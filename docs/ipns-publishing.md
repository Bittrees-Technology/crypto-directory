# Weekly IPNS publishing

Status: publisher installed on Acer; ENS activation remains pending independent full-page retrieval and the owner's wallet signature. ENS currently points directly to the verified IPFS release.

Dedicated public name: `k51qzi5uqu5dj5gnbib6enjf4ae0qp0rr41izt3bo2o23vczesjhype374d5ox`.
Key alias: `cryptodirectory-weekly`. The private key remains in Kubo's keystore and is never included in repository files. This key can publish only its own IPNS name; it cannot change ENS, spend Ethereum, or operate the governing Safe.

The user service checks daily for a queued release, with at most one publication attempt per rolling seven days. Failed or uncertain publication attempts consume that slot. Preflight failures do not. Identical releases do not republish through this worker. Kubo refreshes signed IPNS records; this maintenance does not change the content. The key has no scheduled expiration; individual signed records have a 30-day lifetime, so continued Kubo republishing and availability are necessary.

## Release queue

Install `publisher.py` at `/home/raging/.local/lib/cryptodirectory-publisher/publisher.py` and the supplied units under the user's systemd directory. The existing user has lingering enabled. State and the queued `candidate.json` live in `/home/raging/.local/state/cryptodirectory-publisher/`.

Candidate format: `{"cid":"bafy…","sourceCommit":"…","files":{"index.html":"64-character SHA256", "assets/styles.css":"…"}}`. Stage a release only after source checks and pinning finish. Replace the candidate atomically. This implementation consumes that manifest; it does not fetch or build arbitrary GitHub commits. Automatic release creation and staging remain separate integration work.

Before signing IPNS, the worker requires a recursive local pin, verifies every manifest file through the local and public Bittrees gateways, and retrieves the full homepage through an independent gateway. It respects the existing IPFS daily-budget pause. There are no Ethereum transactions or recurring gas costs.

Run without `--publish` for a dry run. Run `python3 -m unittest discover -s scripts/ipns -v` for policy and failure-path tests. `latest-check.json` provides the most recent result; `state.json` retains publication and attempt state. State files are replaced atomically; concurrent runs use an exclusive lock. Do not clear state to bypass the weekly limit.

## Activation and revocation

After independent IPNS resolution and file checks succeed, the ENS manager signs one contenthash change to `ipns://k51qzi5uqu5dj5gnbib6enjf4ae0qp0rr41izt3bo2o23vczesjhype374d5ox`. Deployment must independently encode and simulate that exact record. Do not sign before these checks pass. The one-time Ethereum gas cost is shown in the wallet and is not a recurring publishing charge.

To pause, create the `disabled` file in the state directory and stop the timer. To revoke the key's connection to the ENS website, the ENS manager changes contenthash back to a trusted IPFS CID or another IPNS name. Stopping the publisher alone does not revoke a stolen key. The seven-day rule is enforced by trusted publisher software, not cryptography; an attacker controlling Kubo or its keystore could publish more often. Retain the previous IPFS release for rollback.

No news-model services, models, configuration, or data are changed by these units. Existing IPFS bandwidth restrictions remain active.
