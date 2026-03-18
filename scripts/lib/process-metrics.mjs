import { promises as fs } from 'node:fs';
import path from 'node:path';

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function getByPath(target, keyPath = '') {
  if (!keyPath) return target;
  return keyPath.split('.').reduce((current, key) => {
    if (current === null || current === undefined) return undefined;
    return current[key];
  }, target);
}

async function countDirectoryEntries(targetDir, extension = '') {
  try {
    const names = await fs.readdir(targetDir);
    return names.filter((name) => !extension || name.endsWith(extension)).length;
  } catch {
    return 0;
  }
}

function normalizePercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, number));
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + Math.ceil(days));
  return next;
}

async function evaluateCheck(rootDir, check) {
  const type = check.type || 'file_exists';
  const targetPath = check.path ? path.join(rootDir, check.path) : '';

  if (type === 'file_exists') {
    const passed = await pathExists(targetPath);
    return {
      ...check,
      passed,
      progressPercent: passed ? 100 : 0,
      observed: passed ? 'present' : 'missing'
    };
  }

  if (type === 'directory_count') {
    const observedCount = await countDirectoryEntries(targetPath, check.extension || '');
    const minCount = Number(check.min_count || 1);
    const progressPercent = minCount <= 0 ? 100 : normalizePercent((observedCount / minCount) * 100);
    return {
      ...check,
      passed: observedCount >= minCount,
      progressPercent,
      observed: observedCount,
      target: minCount
    };
  }

  if (type === 'text_in_file') {
    try {
      const raw = await fs.readFile(targetPath, 'utf8');
      const passed = raw.includes(check.includes || '');
      return {
        ...check,
        passed,
        progressPercent: passed ? 100 : 0,
        observed: passed ? 'matched' : 'not_matched'
      };
    } catch {
      return {
        ...check,
        passed: false,
        progressPercent: 0,
        observed: 'missing'
      };
    }
  }

  if (type === 'json_value') {
    const json = await readJson(targetPath, null);
    const actual = getByPath(json, check.key_path);
    let passed = false;
    if (check.equals !== undefined) {
      passed = actual === check.equals;
    } else if (check.min !== undefined) {
      passed = Number(actual) >= Number(check.min);
    } else if (check.includes !== undefined && Array.isArray(actual)) {
      passed = actual.includes(check.includes);
    }
    return {
      ...check,
      passed,
      progressPercent: passed ? 100 : 0,
      observed: actual
    };
  }

  return {
    ...check,
    passed: false,
    progressPercent: 0,
    observed: 'unsupported_check_type'
  };
}

function summarizeRequirement(requirement, checks) {
  const manualCompletion = requirement.manual_completion_percent;
  const progressPercent = Number.isFinite(Number(manualCompletion))
    ? normalizePercent(manualCompletion)
    : (checks.length === 0
      ? 0
      : round(checks.reduce((sum, check) => sum + check.progressPercent, 0) / checks.length));
  const passed = progressPercent >= 100;

  return {
    id: requirement.id,
    title: requirement.title,
    description: requirement.description || '',
    weight: Number(requirement.weight || 1),
    progressPercent,
    passed,
    checks
  };
}

function summarizeSection(section, requirements) {
  const totalWeight = requirements.reduce((sum, item) => sum + item.weight, 0);
  const completedWeight = requirements.reduce((sum, item) => sum + ((item.progressPercent / 100) * item.weight), 0);
  const progressPercent = totalWeight === 0 ? 0 : round((completedWeight / totalWeight) * 100);
  return {
    id: section.id,
    title: section.title,
    specPath: section.spec_path || '',
    weight: Number(section.weight || 1),
    progressPercent,
    completed: progressPercent >= 100,
    requirements
  };
}

function summarizeTimeline(projectDef, progressPercent, history) {
  const today = new Date();
  const targetDate = projectDef.timeline?.target_date || '';
  const defaultVelocity = Number(projectDef.timeline?.default_velocity_percent_per_day || 0);
  const snapshots = toArray(history)
    .map((entry) => ({
      date: entry.date,
      progressPercent: normalizePercent(entry.progress_percent)
    }))
    .filter((entry) => entry.date)
    .sort((a, b) => a.date.localeCompare(b.date));

  const latest = snapshots[snapshots.length - 1];
  const previous = snapshots[snapshots.length - 2];
  let velocityPerDay = defaultVelocity;

  if (latest && previous) {
    const elapsedMs = Date.parse(latest.date) - Date.parse(previous.date);
    const elapsedDays = elapsedMs / 86400000;
    const progressDelta = latest.progressPercent - previous.progressPercent;
    if (elapsedDays > 0 && progressDelta > 0) {
      velocityPerDay = progressDelta / elapsedDays;
    }
  }

  let projectedCompletionDate = '';
  let daysRemaining = null;

  if (progressPercent >= 100) {
    projectedCompletionDate = latest?.date || formatDate(today);
    daysRemaining = 0;
  } else if (velocityPerDay > 0) {
    daysRemaining = round((100 - progressPercent) / velocityPerDay, 1);
    projectedCompletionDate = formatDate(addDays(today, daysRemaining));
  } else if (targetDate) {
    projectedCompletionDate = targetDate;
  }

  return {
    startedOn: projectDef.timeline?.started_on || '',
    targetDate,
    defaultVelocityPercentPerDay: defaultVelocity,
    observedVelocityPercentPerDay: round(velocityPerDay, 2),
    projectedCompletionDate,
    daysRemaining,
    history: snapshots
  };
}

export async function loadProcessStatuses(rootDir) {
  const processRoot = path.join(rootDir, 'content', 'processes');
  const projectsDir = path.join(processRoot, 'projects');
  if (!(await pathExists(projectsDir))) {
    return [];
  }

  const files = (await fs.readdir(projectsDir))
    .filter((name) => name.endsWith('.json'))
    .sort();

  const statuses = [];
  for (const name of files) {
    const defPath = path.join(projectsDir, name);
    const projectDef = JSON.parse(await fs.readFile(defPath, 'utf8'));
    const sections = [];

    for (const section of toArray(projectDef.sections)) {
      const requirements = [];
      for (const requirement of toArray(section.requirements)) {
        const checks = [];
        for (const check of toArray(requirement.checks)) {
          checks.push(await evaluateCheck(rootDir, check));
        }
        requirements.push(summarizeRequirement(requirement, checks));
      }
      sections.push(summarizeSection(section, requirements));
    }

    const totalWeight = sections.reduce((sum, section) => sum + section.weight, 0);
    const weightedProgress = sections.reduce((sum, section) => sum + ((section.progressPercent / 100) * section.weight), 0);
    const progressPercent = totalWeight === 0 ? 0 : round((weightedProgress / totalWeight) * 100);
    const historyPath = projectDef.timeline?.history_path
      ? path.join(rootDir, projectDef.timeline.history_path)
      : '';
    const history = historyPath ? await readJson(historyPath, []) : [];
    const timeline = summarizeTimeline(projectDef, progressPercent, history);

    statuses.push({
      id: projectDef.id,
      name: projectDef.name,
      summary: projectDef.summary || '',
      owner: projectDef.owner || '',
      progressPercent,
      completed: progressPercent >= 100,
      sections,
      timeline
    });
  }

  return statuses;
}
