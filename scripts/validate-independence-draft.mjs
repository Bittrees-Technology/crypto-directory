import { readFile } from 'node:fs/promises';

const draftPath = new URL('../content/processes/specs/crypto-directory-independence-draft.md', import.meta.url);
const draft = await readFile(draftPath, 'utf8');

const requiredGateIds = [
  'gate-1-user-value',
  'gate-2-scope-out-of-scope',
  'gate-3-onboarding-first-value',
  'gate-4-release-status',
  'gate-5-trust-support-placeholders',
  'gate-6-standalone-entry-runtime',
  'gate-7-no-sibling-bittrees-dependency',
  'gate-8-optional-integration-boundaries',
];

const requiredPhrases = [
  'Supersedes: Crypto Directory #59a58504',
  'Task: draft-crypto-directory-independence-product',
  'not approved for release, deployment, DNS changes, visibility changes, auth changes, or legal publication',
  'without signing in, connecting a wallet, installing another product',
  'product-owned placeholders, not legal content',
  'must run from this repository without requiring a sibling checkout',
  'Bittrees may appear as a listed project entry, but it is not a runtime dependency',
  'the directory must still provide standalone static value when those integrations are absent or deferred',
];

const missing = [
  ...requiredGateIds.filter((gateId) => !draft.includes(gateId)),
  ...requiredPhrases.filter((phrase) => !draft.includes(phrase)),
];

if (missing.length > 0) {
  console.error('Independence draft validation failed. Missing required evidence:');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log(`Validated ${requiredGateIds.length} independence gates in ${draftPath.pathname}`);
