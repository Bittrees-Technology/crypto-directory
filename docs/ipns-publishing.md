# Approved releases on both domains

`cd.bittrees.org` is the production Vercel site. `cryptodirectory.eth.limo` follows the existing IPNS name `k51qzi5uqu5dj5gnbib6enjf4ae0qp0rr41izt3bo2o23vczesjhype374d5ox`, using key alias `cryptodirectory-weekly`. The key stays in the existing Kubo keystore; it cannot change ENS, spend Ethereum or operate a Safe.

The release owner requested automatic synchronization after each approved production release on 18 October 2026, replacing the previous weekly release delay. The existing Acer timer checks every ten minutes, with up to thirty seconds of jitter. There is one scheduler and one publication lock. Vercel and public IPNS gateways cannot switch atomically: a ready production release is mirrored, and both public domains must pass file checks before a release is recorded as synchronized. Gateway cache propagation can take additional time.

## Approval and artifact identity

The normal build writes `site/release.json`, containing the exact Git source commit, Vercel project/deployment identity and SHA256 of every site file except the manifest itself. The manifest contains no environment dump or credentials. Generated manifests are not committed.

`sync.py` accepts only the fixed production domain, repository and existing Vercel project. It requires current `main` and the latest successful repository CI for that exact commit. When token-authored merges do not trigger push CI, it accepts a successfully checked merged PR only if its source tree exactly matches main. Failed or pending main CI cannot fall back to older successful checks. The latest Vercel status must identify the exact deployment in the production manifest. Repository review and source authorization remain upstream requirements; the sync worker cannot approve or merge code.

The worker fetches only public, immutable deployment files. It restricts deployment hostnames and redirects, rejects unsafe paths and symlinks, verifies every hash, and enforces file/count/total-size limits. Production identity is checked again before publication. No Vercel credentials are copied to Acer, and the worker neither builds applications nor runs downloaded code. No new hosted resources, paid models, accounts or subscriptions are provisioned. Additional spending authorization remains $0 outside the standing routine-release exception for existing services; the worker cannot change billing or budgets.

## Publication and verification

Install `sync.py`, `publisher.py` and `stage.py` together under `/home/raging/.local/lib/cryptodirectory-publisher/`. The supplied user service runs only `sync.py`; the old weekly worker remains available for rollback, without a second active timer. State remains in `/home/raging/.local/state/cryptodirectory-publisher/`.

Before signing IPNS, the worker requires recursive pins, checks every file through the local and public Bittrees gateways, and retrieves the full homepage through an independent Filebase gateway. The current release pin is retained for rollback. Existing seed bandwidth limits, daily budget accounting and pause controls remain effective. No Ethereum transaction or ENS contenthash replacement is involved.

There is at most one publication attempt per approved source commit, with reservation recorded before signing. A failed or uncertain attempt is never blindly replayed, including after a process crash. A later full public match can reconcile an uncertain result without another signature; otherwise the outcome is held for owner investigation. Rebuilding the same source with changed bytes is also held for review. Do not delete or edit journals to bypass these protections.

The manifest, previous candidate/state, approval evidence and operation journal are retained under `releases/<sourceCommit>/`. `state.json` and `candidate.json` preserve compatibility with existing seed operations. `latest-sync.json` reports current synchronization; `sync-exception.json` records held conditions and their resolution. Logs and network requests are bounded. Unchanged healthy releases fetch only the two small public manifests, without additional signatures, pins, builds or repository API checks.

Public verification compares all content files on both domains with the approved artifact. The homepage must resolve the new CID. Byte-identical cached assets are valid even if their cache provenance headers refer to an earlier root. eth.limo supplies its own gateway-level `robots.txt`, which is excluded from content equality. Failed preflight checks have three bounded attempts, and public convergence has six; exhausted retries produce held evidence rather than repeated signing or paid fallback.

## Operations

Run `python3 sync.py --state-dir <existing-state-directory>` for a verified dry run. Add `--publish` only for the existing approved release operation; scheduled execution already includes it. Run `python3 -m unittest discover -s scripts/ipns -v` for approval, provenance, publication, crash/retry and file-manifest tests.

To pause publication, create the existing `disabled` file and stop the timer. Before installation, retain the previous scripts and units, verify the new source/checks and dry run, and stop the original timer before replacing it. Verify the first natural scheduled invocation and its durable publication/verification receipt after enablement. Keep rollback copies, all previous pins and operational evidence. Never run both old and new release workers concurrently.

Changing ENS to another IPFS CID or IPNS name remains a separate wallet/TLD/Safe operation with its existing approval and simulation requirements. The synchronizer has no such authority. No news, mail, model or unrelated service configuration is changed by these units.
