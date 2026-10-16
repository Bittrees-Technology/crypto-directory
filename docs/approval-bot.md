# Claude approval pilot

This pilot reviews small, same-repository Crypto Directory pull requests after CI passes. Claude Code uses the Bobofbuilding account's subscription token; a separate GitHub Actions job submits an approval for the reviewed commit. It never merges a PR. The existing required review, stale-review dismissal and required CI rules remain in place.

## What can receive approval

The current head must include current main, have a successful run of the existing CI workflow and its `build-and-check` job, and have no failing, pending, skipped, neutral or unrecognized-provider checks. Existing human requests for changes block approval. The review must cover all supplied changes, report no blocking/high/critical findings, and identify the exact head and base commits. Limits are 20 changed text files, 64 KB per source file and 200 KB of source context; larger or unsupported changes require human review.

The bot reads complete before/after changed files plus the README, package and build/link-check implementation. It does not check out or execute PR code. Claude runs in an empty temporary directory with tools, MCP servers, skills and repository settings disabled, without a GitHub credential. Its subscription credential is available only to the review job. The approval job receives a structured result from that job, fetches the PR and checks again, and compares the source digest, head, base and CI run/attempt. It passes the exact `commit_id` to GitHub. A detected update during submission causes dismissal of the stale approval; GitHub's existing stale-review dismissal remains enabled for subsequent updates.

Changes to `.github/`, `.claude/`, the bot, its tests/documentation, or root agent instructions require human review. This includes the initial installation PR. The bot cannot authorize its own installation or change its approval rules. Workflow dispatch must run on main. Errors, missing credentials, quota limits, malformed output and insufficient context withhold approval. Successful repeated runs do not duplicate an existing exact approval.

## Activation

1. Have an independent authorized reviewer approve the installation PR and merge it after the existing checks pass. This bootstrap cannot be satisfied by a bot that is not yet installed.
2. Sign in to the intended Bobofbuilding Claude subscription and run `claude setup-token` locally. Save the resulting credential directly as the **repository** Actions secret `CLAUDE_CODE_OAUTH_TOKEN`. Do not paste it in a PR, chat, source file or log. This uses Claude subscription allowance and GitHub runner minutes; it does not configure API billing or paid overages. Pro, Max, Team and Enterprise subscription tokens are documented by Anthropic. Respect the account's administration policies.
3. Allow GitHub Actions to create and approve pull requests in this repository's Actions settings, leaving default workflow permissions read-only. The review job remains read-only; only the approval job requests `pull-requests: write`. Organization policy may restrict this setting. Do not remove or bypass the required-review rule.
4. Set repository variable `CLAUDE_APPROVAL_ENABLED` to `true`. Dispatch **Claude approval pilot** on main with an existing PR number whose current CI passed. Verify a real review receipt identifies that exact head and that GitHub counts it toward the existing rule. Until this live verification succeeds, activation is unverified.
5. Subsequent successful CI completions trigger review automatically. A newer head or CI attempt requires a new review. To pause, set `CLAUDE_APPROVAL_ENABLED` to `false` and cancel any in-flight approval run; a variable change alone does not cancel an already running job. Revoke the subscription token separately when decommissioning.

The repository setting enabling Actions approvals applies to other suitably permissioned workflows too. Workflow changes remain subject to independent review. The initial pilot stays disabled until setup is complete; no API key fallback or automatic account upgrade is configured. The CLI is pinned to 2.1.220; changing it requires reviewed workflow changes. `sonnet` selects the account's available Sonnet model, so record the actual model returned by Claude for each review.

## Verification

Run `node --test test/approval-bot.test.mjs`, the existing build and link checks. Tests cover blocking/incomplete results, forks, unsupported changes, CI provenance, failed/pending checks, head/base changes, human change requests, duplicate approvals, approval races and child-process credential/tool isolation. Synthetic tests do not establish subscription access or live approval eligibility.

References: [Claude subscription setup](https://code.claude.com/docs/en/github-actions#manual-setup), [GitHub review API](https://docs.github.com/en/rest/pulls/reviews), [GitHub Actions approval setting](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository).
