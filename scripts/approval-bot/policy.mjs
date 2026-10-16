export const REPOSITORY = 'Bittrees-Technology/crypto-directory';
export const CI_WORKFLOW_ID = 233883074;
export const REQUIRED_JOB = 'build-and-check';
export const SHA = /^[a-f0-9]{40}$/;
export function ensure(ok, message) { if (!ok) throw new Error(message); }
export function eligible(pr, files) {
  ensure(pr.state === 'open' && !pr.draft && !pr.merged, 'PR is not open and ready');
  ensure(pr.base?.ref === 'main' && pr.base.repo.full_name === REPOSITORY && pr.head?.repo?.full_name === REPOSITORY, 'Pilot accepts same-repository PRs to main only');
  ensure(SHA.test(pr.head.sha) && SHA.test(pr.base.sha), 'Invalid revision');
  ensure(files.length > 0 && files.length <= 20 && files.length === pr.changed_files, 'Incomplete or oversized change set');
  for (const f of files) {
    for (const path of [f.filename, f.previous_filename].filter(Boolean)) {
      ensure(!/^(\.github\/|\.claude\/|scripts\/approval-bot\/|test\/approval-bot\.test\.mjs$|docs\/approval-bot\.md$|CLAUDE\.md$|AGENTS\.md$)/i.test(path), 'Bot, workflow and policy changes require human review');
    }
    ensure(['added','modified','removed','renamed'].includes(f.status), 'Unsupported change type');
    ensure(typeof f.patch === 'string', 'Missing or binary diff requires human review');
  }
}
export function checksPass(runs, statuses, jobs, run, head) {
  ensure(run.workflow_id === CI_WORKFLOW_ID && run.path === '.github/workflows/ci.yml' && run.event === 'pull_request' && run.head_sha === head && run.head_repository?.full_name === REPOSITORY, 'CI provenance mismatch');
  ensure(run.status === 'completed' && run.conclusion === 'success', 'CI has not passed');
  ensure(jobs.some(j => j.name === REQUIRED_JOB && j.status === 'completed' && j.conclusion === 'success'), 'Required CI job missing or failed');
  ensure(jobs.every(j => j.status === 'completed' && j.conclusion === 'success'), 'A CI job did not pass');
  ensure(runs.length > 0 && runs.every(c => c.status === 'completed' && c.conclusion === 'success' && c.app?.id === 15368), 'Checks pending, failed, skipped or from an unreviewed provider');
  ensure(statuses.every(s => s.state === 'success'), 'Commit status pending or failed');
}
export const reviewSchema = {
  type: 'object', additionalProperties: false,
  required: ['headSha','baseSha','complete','verdict','summary','findings'],
  properties: {
    headSha: {type:'string'}, baseSha: {type:'string'}, complete: {type:'boolean'},
    verdict: {type:'string',enum:['clear','blocked','incomplete']}, summary:{type:'string'},
    findings:{type:'array',items:{type:'object',additionalProperties:false,required:['path','severity','blocking','explanation'],properties:{path:{type:'string'},severity:{type:'string',enum:['low','medium','high','critical']},blocking:{type:'boolean'},explanation:{type:'string'}}}}
  }
};
export function validateReview(value, snapshot) {
  ensure(value && typeof value === 'object' && Object.keys(value).sort().join() === ['headSha','baseSha','complete','verdict','summary','findings'].sort().join(), 'Invalid review schema');
  ensure(value.headSha === snapshot.head && value.baseSha === snapshot.base, 'Review revision mismatch');
  ensure(typeof value.complete === 'boolean' && ['clear','blocked','incomplete'].includes(value.verdict), 'Invalid review verdict');
  ensure(typeof value.summary === 'string' && value.summary.length > 0 && value.summary.length <= 4000, 'Invalid review summary');
  ensure(Array.isArray(value.findings) && value.findings.length <= 50, 'Invalid findings');
  for (const f of value.findings) {
    ensure(f && Object.keys(f).sort().join() === ['path','severity','blocking','explanation'].sort().join(), 'Invalid finding schema');
    ensure(typeof f.path === 'string' && typeof f.explanation === 'string' && f.explanation.length > 0 && f.explanation.length <= 4000 && typeof f.blocking === 'boolean' && ['low','medium','high','critical'].includes(f.severity), 'Invalid finding');
  }
  return value;
}
export function approvalAllowed(review, snapshot) {
  validateReview(review, snapshot);
  ensure(review.complete && review.verdict === 'clear' && !review.findings.some(f => f.blocking || ['high','critical'].includes(f.severity)), 'Claude did not return a complete review without blocking findings');
}
export function sameSnapshot(expected, actual) {
  for (const key of ['repository','number','head','base','digest','ciRunId','ciAttempt']) ensure(expected[key] === actual[key], 'Reviewed commit, base, content or CI attempt changed');
}
