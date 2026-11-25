# Further held-entry evidence — 25 November 2026

This extends [draft PR #54](https://github.com/Bittrees-Technology/crypto-directory/pull/54), using source snapshot `1eac662aa9dcc282858608bb71775f695eae13e4`. All **90** remaining held rows received a further source-specific search. Focused first-party, publisher and operator reads were used where they could resolve a decision. Earlier dated receipts are reused; this does not claim 90 fresh successful product tests. The prior two ledgers remain dated snapshots. PR #54 still depends on PRs #52/#53.

**Incremental proposal: three corrected/reverified listings, three limited corrections that remain held, two exclusions and 82 unchanged holds.** This leaves **85 needs_update** records. The complete proposed source contains **1,342 verified, 107 rejected and 85 needs_update** records, preserving all **1,534** IDs/files. These are review-branch counts, not deployed counts.

Across PR #54, the original 117 rows now comprise **16 reverified, 12 partial corrections still held, 16 exclusions and 73 unchanged holds**. Eight additional listing files change in this pass. None overlap the 36 listing files changed in the earlier passes.

The tx explorer initially rendered zero placeholders, then populated recent blocks and transactions; only the populated observation supports the network reference. Marketplace panels marked coming soon are not described as launched. Publisher mobile listings establish public distribution references, not authenticated trading eligibility, security, custody or regulatory acceptance. Existing historical metadata is not silently transferred to successor entities.

The new exclusions rely on firsthand service-operator/user records with explicit attribution and precise scope. Ankr reports Harmony L1 sunset and its endpoint retirement; BGD Labs reports migration away from Gelato automation/Functions following deprecation. These proposals do not declare every related token, business or product closed. Source/history is retained with rejected status.

No wallet, key, account, app/SDK installation, transaction, migration, purchase, role grant or authenticated editorial write was performed. Browser account UI and transient authentication parameters are omitted from public evidence. No new service or paid resource was provisioned. The draft has no auto-merge or deployment. Required hosted checks remain pending retargeting to main after prerequisites merge; local checks do not replace them.

## Proposed changes

### BVOX — propose correction

Source: [content/projects/bitvenus.md](../../../content/projects/bitvenus.md); original blob `043fb0f24674ee136747686e344bcdc249d77825`.

The publisher-controlled Google Play listing identifies Bitvenus Technology Ltd., the BVOX brand, its bvox.com support website and a 12 June 2026 update. The listing rendered in Brave. Narrow this row to the published mobile offering and use its distribution page rather than the region-restricted exchange website. A published listing does not establish trading eligibility here or verify deposits, withdrawals, security or publisher marketing claims. No app was installed and no geographic restriction was bypassed. Remove the unsupported Metaverse headquarters value.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"BVOX"` | `"BVOX (mobile app)"` |
| primary_url | `"https://www.bvox.com/"` | `"https://play.google.com/store/apps/details?hl=en_US&id=io.bitvenus.app.first"` |
| product_url | `"n/a"` | `"https://play.google.com/store/apps/details?hl=en_US&id=io.bitvenus.app.first"` |
| description | `"Centralized cryptocurrency exchange offering spot and perpetual futures markets."` | `"Published Android cryptocurrency trading app from Bitvenus Technology Ltd., branded BVOX; service eligibility and regional availability apply."` |
| hq | `"Metaverse"` | `"n/a"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.bvox.com/](https://www.bvox.com/) — 200; checked `2026-11-24T22:43:13.400897+00:00`
- [https://play.google.com/store/apps/details?hl=en_US&id=io.bitvenus.app.first](https://play.google.com/store/apps/details?hl=en_US&id=io.bitvenus.app.first) — 200; checked `2026-11-25T04:21:24.238916+00:00`

Rendered observations: [https://play.google.com/store/apps/details?hl=en_US&id=io.bitvenus.app.first&pli=1](https://play.google.com/store/apps/details?hl=en_US&id=io.bitvenus.app.first&pli=1) (`2026-11-25T04:23:07.651Z`).

### Coreum — propose correction

Source: [content/projects/coreum.md](../../../content/projects/coreum.md); original blob `8692b94ccaadd1813345ff79e63cc34d0cc9255d`.

The successor issuer explicitly identifies the Coreum/Sologenic merger and links its own tx documentation and explorer. After initial loading, the explorer populated recent blocks, transactions and validators, resolving the earlier empty-shell observation. Reprofile the existing ID as the successor network, without asserting that the advertised coming-soon marketplace has launched. Former entity founding/HQ/social fields are not silently inherited. This verifies a public network reference, not token-conversion instructions, chain security or financial suitability.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"Coreum"` | `"tx (formerly Coreum)"` |
| ecosystem | `["Coreum"]` | `["tx"]` |
| description | `"Enterprise-ready L1 ecosystem with asset tokenization features."` | `"Layer-1 network following the Coreum and Sologenic merger, with smart-token developer tooling and a public network explorer; trader and issuer marketplace offerings are marked coming soon."` |
| primary_url | `"https://www.coreum.com"` | `"https://tx.org/"` |
| product_url | `"https://www.coreum.com/ecosystem"` | `"https://explorer.tx.org/tx"` |
| token | `"COREUM"` | `"TX"` |
| founded | `"2023"` | `"n/a"` |
| hq | `"Switzerland"` | `"n/a"` |
| twitter | `"https://x.com/CoreumOfficial"` | `"n/a"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.coreum.com](https://www.coreum.com) — The read operation timed out; checked `2026-11-24T22:43:17.708245+00:00`
- [https://www.coreum.com/ecosystem](https://www.coreum.com/ecosystem) — The read operation timed out; checked `2026-11-24T22:43:17.751122+00:00`
- [https://tx.org/](https://tx.org/) — 200; checked `2026-11-25T04:21:23.717154+00:00`
- [https://tx.org/faq](https://tx.org/faq) — 200; checked `2026-11-25T04:21:23.717242+00:00`
- [https://docs.tx.org/](https://docs.tx.org/) — 200; checked `2026-11-25T04:21:24.063154+00:00`
- [https://explorer.tx.org/tx](https://explorer.tx.org/tx) — 200; checked `2026-11-25T04:24:01.846580+00:00`

Rendered observations: [https://explorer.tx.org/tx](https://explorer.tx.org/tx) (`2026-11-25T04:21:43.466Z`); [https://explorer.tx.org/tx](https://explorer.tx.org/tx) (`2026-11-25T04:22:02.451Z`); [https://tx.org/](https://tx.org/) (`2026-11-25T04:22:19.352Z`).

### Gelato Web3 Functions — propose exclusion

Source: [content/projects/gelato-web3-functions.md](../../../content/projects/gelato-web3-functions.md); original blob `75ad6cd44ed9b9c5e8e75e35f12537f97dc3cd34`.

BGD Labs' firsthand Aave Robot report dated 31 March 2026 explicitly identifies Gelato automation/Web3 Functions deprecation and confirms migration of the affected automations to Chainlink CRE. This adds an actual former user's implementation record beyond a competitor's migration article. Propose exclusion of this specifically named legacy Functions service, retaining its history; do not classify the separate continuing Gelato rollup/platform business as closed. The old app's certificate failure is recorded only as an access failure, not as the retirement proof.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.gelato.network/web3-functions](https://www.gelato.network/web3-functions) — 200 → [https://gelato.cloud/](https://gelato.cloud/); checked `2026-11-24T22:43:25.613049+00:00`
- [https://docs.gelato.network/web3-services/web3-functions](https://docs.gelato.network/web3-services/web3-functions) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)>; checked `2026-11-24T22:43:25.764756+00:00`
- [https://governance.aave.com/t/integration-of-chainlink-cre-into-aave-robot/24366](https://governance.aave.com/t/integration-of-chainlink-cre-into-aave-robot/24366) — 200; checked `2026-11-25T04:21:24.633427+00:00`
- [https://www.mimic.fi/blog/gelato-web3-automation-is-ending-use-mimic](https://www.mimic.fi/blog/gelato-web3-automation-is-ending-use-mimic) — Public first-party source read or rendered observation; no separate HTTP receipt.
- [https://app.gelato.network/](https://app.gelato.network/) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)>; checked `2026-11-25T04:21:24.750167+00:00`

### Govrn — propose partial correction keep hold

Source: [content/projects/govrn.md](../../../content/projects/govrn.md); original blob `7d478bfc15f985fd49abb5262cc60b268dbfdfd9`.

Govrn's own Linktree identifies the DAO contribution tool and links the exact govrn.app application, docs and issuer blog. Replace the unsupported .xyz reference with that accessible issuer link hub. The linked application again timed out, including the Brave navigation attempt, so remove the known-broken guessed /platform product link rather than assert a working replacement. Keep needs_update until the actual application or retirement can be established.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://www.govrn.xyz"` | `"https://linktr.ee/Govrn"` |
| product_url | `"https://www.govrn.xyz/platform"` | `"n/a"` |

Evidence:

- [https://www.govrn.xyz](https://www.govrn.xyz) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:25.965385+00:00`
- [https://www.govrn.xyz/platform](https://www.govrn.xyz/platform) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:26.007326+00:00`
- [https://linktr.ee/Govrn](https://linktr.ee/Govrn) — 200; checked `2026-11-25T04:21:24.400831+00:00`
- [https://govrn.app/](https://govrn.app/) — <urlopen error timed out>; checked `2026-11-25T04:21:24.628057+00:00`

### Harmony — propose exclusion

Source: [content/projects/harmony.md](../../../content/projects/harmony.md); original blob `4be62326b5fd21653a63a451a49cea62f2dfc543`.

Ankr's own 5 October 2026 RPC end-of-support notice explicitly records Harmony's L1 sunset and retires its Harmony endpoint. This is a firsthand service-operator record, strengthening the prior issuer explorer sunset banner. Propose exclusion of the listed active-L1 service profile, retaining the source and history. The network-halt statement is attributed to Ankr, not presented as an independent chain measurement. This does not declare every Harmony business, ONE token or future product closed and does not endorse any token migration.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.harmony.one](https://www.harmony.one) — 200; checked `2026-11-24T22:43:26.009718+00:00`
- [https://www.ankr.com/docs/changelog/harmony-end-of-support/](https://www.ankr.com/docs/changelog/harmony-end-of-support/) — 200; checked `2026-11-25T04:21:24.802170+00:00`
- [https://explorer.harmony.one/blocks](https://explorer.harmony.one/blocks) — Public first-party source read or rendered observation; no separate HTTP receipt.

### Redefine Security — propose partial correction keep hold

Source: [content/projects/redefine-security.md](../../../content/projects/redefine-security.md); original blob `cff0e780cadcac551f966b440b7e52f74c62bdd5`.

Redefine's own API documentation and its Firefox publisher listing establish the DeFirewall identity, replacing an unsubstantiated auditing profile and failed .security routes. The publisher's redefine.net domain now leads to a sale page; the experimental extension and API guide were last updated in 2024. These surviving references do not establish current service support. Keep needs_update, use the accessible publisher documentation, clear unsupported founding/HQ/social fields, and do not obtain keys, install the extension or call its API.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"Redefine Security"` | `"Redefine (DeFirewall)"` |
| tags | `["Security", "Auditing"]` | `["Security", "Monitoring"]` |
| description | `"Specialized security reviews for DeFi protocols."` | `"Publishes DeFirewall transaction-risk and due-diligence API documentation; current service availability remains unconfirmed."` |
| primary_url | `"https://redefine.security"` | `"https://redefine-api-docs.readme.io/reference/getting-started-with-your-api"` |
| product_url | `"https://redefine.security/services"` | `"https://redefine-api-docs.readme.io/reference/getting-started-with-your-api"` |
| founded | `"2024"` | `"n/a"` |
| hq | `"Metaverse"` | `"n/a"` |
| twitter | `"https://x.com/redefine_sec"` | `"n/a"` |

Evidence:

- [https://redefine.security](https://redefine.security) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:43.248503+00:00`
- [https://redefine.security/services](https://redefine.security/services) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:43.291363+00:00`
- [https://redefine-api-docs.readme.io/reference/getting-started-with-your-api](https://redefine-api-docs.readme.io/reference/getting-started-with-your-api) — 200; checked `2026-11-25T04:21:23.716936+00:00`
- [https://addons.mozilla.org/en-US/firefox/addon/defirewall/](https://addons.mozilla.org/en-US/firefox/addon/defirewall/) — 200; checked `2026-11-25T04:21:23.717033+00:00`
- [https://redefine.net/](https://redefine.net/) — 200; checked `2026-11-25T04:21:23.716823+00:00`

### Stella — propose partial correction keep hold

Source: [content/projects/stella.md](../../../content/projects/stella.md); original blob `cf9df6d0ce67102daffc24a3c2147eca19c71e65`.

The issuer's ALPHA staking page explicitly identifies Stella and its announced LitLayer transition, resolving confusion with the unrelated stella.org domain. Both detailed governance proposals linked by that page return 404 in the public reader, so a completed successor product is not established. Keep needs_update while correcting the reference to the actual legacy interface. No wallet was connected and no staking, unstaking, migration or claim was performed. Clear the unsupported Metaverse headquarters value.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://www.stella.org"` | `"https://staking.stellaxyz.io/"` |
| product_url | `"https://www.stella.org/app"` | `"https://staking.stellaxyz.io/"` |
| description | `"Leverage and strategy protocol for DeFi users."` | `"Legacy ALPHA staking interface carrying Stella's announced transition to LitLayer; current successor-product availability remains unconfirmed."` |
| hq | `"Metaverse"` | `"n/a"` |

Evidence:

- [https://www.stella.org](https://www.stella.org) — <urlopen error timed out>; checked `2026-11-24T22:43:46.584113+00:00`
- [https://www.stella.org/app](https://www.stella.org/app) — <urlopen error [Errno 65] No route to host>; checked `2026-11-24T22:43:46.752326+00:00`
- [https://staking.stellaxyz.io/](https://staking.stellaxyz.io/) — 200; checked `2026-11-25T04:21:24.092679+00:00`
- [https://stella.discourse.group/t/rebranding-proposal-stella-to-litlayer/12](https://stella.discourse.group/t/rebranding-proposal-stella-to-litlayer/12) — Public first-party source read or rendered observation; no separate HTTP receipt.
- [https://stella.discourse.group/t/stella-to-litlayer-more-details-about-the-transition/25](https://stella.discourse.group/t/stella-to-litlayer-more-details-about-the-transition/25) — Public first-party source read or rendered observation; no separate HTTP receipt.

### ZebPay — propose correction

Source: [content/projects/zebpay.md](../../../content/projects/zebpay.md); original blob `a2882412668f3037f69e3595696b70fc589cc4e4`.

The original ZebPay publisher listing identifies its website and crypto trading product. Brave rendered its current 20 November 2026 update, providing a current distribution reference instead of the missing /exchange route. Narrow verification to the published mobile offering; no account, app installation, trading, custody, return or regulatory claim was tested. Historical founding/HQ/social metadata remains unchanged and is not newly certified.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"ZebPay"` | `"ZebPay (mobile app)"` |
| primary_url | `"https://zebpay.com"` | `"https://play.google.com/store/apps/details?id=zebpay.Application"` |
| product_url | `"https://zebpay.com/exchange"` | `"https://play.google.com/store/apps/details?id=zebpay.Application"` |
| description | `"Long-running crypto exchange platform in India."` | `"Published Android cryptocurrency exchange app from ZebPay, with India-focused trading services subject to regional eligibility."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://zebpay.com](https://zebpay.com) — 403; checked `2026-11-24T22:43:53.598523+00:00`
- [https://zebpay.com/exchange](https://zebpay.com/exchange) — 403; checked `2026-11-24T22:43:53.706334+00:00`
- [https://play.google.com/store/apps/details?id=zebpay.Application](https://play.google.com/store/apps/details?id=zebpay.Application) — 200; checked `2026-11-25T04:24:01.848291+00:00`

Rendered observations: [https://play.google.com/store/apps/details?id=zebpay.Application](https://play.google.com/store/apps/details?id=zebpay.Application) (`2026-11-25T04:23:26.101Z`); [https://zebpay.com/in/apps](https://zebpay.com/in/apps) (`2026-11-25T02:09:52.559Z`).

## All 90 row outcomes

Every row has a source-specific query below. Search leads are discovery references, not accepted proof of a current product or retirement. Unresolved identity, scope and product checks remain held; a failed request or similarly named result is not closure evidence.

| Row | Outcome | Reason |
| --- | --- | --- |
| abracadabra.md | hold | The further focused search did not resolve this hold. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| ancilia.md | hold | The BNB Chain partner report establishes Ancilia's historical security work and AnciliaInc identity. A company-directory lead points to ancilia.ai, but that hostname currently fails DNS here. It does not supply an accessible current product or justify replacing the row with a similarly named project; retain the hold. |
| anzen.md | hold | The stated 15 December cessation remains a future deadline. Partially loading pool pages and unresolved reserve figures do not establish either current full support or completed closure; retain the hold. |
| astaria.md | hold | The further focused search did not resolve this hold. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| azuki.md | hold | Issuer-associated NFT collection and creator marketplace leads strengthen product identity, but an accepted current issuer-to-collection link and destination check remain outstanding. TCG search results alone do not show that the original NFT collection has retired. |
| badger.md | hold | The further focused search did not resolve this hold. The current official notice and legacy-sunset repository remove frontends and preserve direct contract access. This does not establish closure of the whole DAO or prove a currently supported deposit product; retain the hold. |
| bakkt.md | hold | Issuer investor material distinguishes current Zaira/API infrastructure from planned card and agent offerings. No new current public platform destination has been accepted; do not replace a broken product route with an illustrative or planned service. |
| balancer.md | hold | The published transition retains specific partner-requested v3 pools until 30 November 2026, a future deadline at this review date. Preserve those exceptions rather than report a completed whole-protocol shutdown. |
| barnbridge.md | hold | The further focused search did not resolve this hold. The organization still distinguishes discontinued V1 products from V2/FIAT products labelled current in its old README. This further repository-focused search did not recover a supported current frontend or precise whole-service retirement. Retain the hold and preserve that version distinction. |
| banklessdao.md | hold | The further focused search did not resolve this hold. The issuer's Black Flag rebrand bulletin establishes governance/membership continuity but is dated January 2025. A current populated decision/product workflow was not newly established. Keep the already corrected identity and links held rather than confuse historical governance plans with present operation. |
| blocklords.md | hold | The further focused search did not resolve this hold. Current BLOCKLORE guidance explicitly includes wallet-signature sign-in, strengthening identity/crypto-related evidence. Wallet sign-in alone does not establish an operating onchain creation product or token economy; retain the hold rather than equate authentication with current Web3 execution. |
| blueshift.md | hold | The further focused search did not resolve this hold. The application explicitly reports geographic restriction from this region. Restricted access is not closure evidence. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| bunzz.md | hold | The further focused search did not resolve this hold. The prior rendered maintenance state remains unresolved. Current searches did not establish an ordinary supported product or an authoritative permanent closure; retain the hold. |
| bitvenus.md | propose correction | The publisher-controlled Google Play listing identifies Bitvenus Technology Ltd., the BVOX brand, its bvox.com support website and a 12 June 2026 update. The listing rendered in Brave. Narrow this row to the published mobile offering and use its distribution page rather than the region-restricted exchange website. A published listing does not establish trading eligibility here or verify deposits, withdrawals, security or publisher marketing claims. No app was installed and no geographic restriction was bypassed. Remove the unsupported Metaverse headquarters value. |
| canto.md | hold | The issuer's EVM quickstart explicitly links the Canto-specific OKLink explorer, but that exact explorer now returns 404 in the public reader. The previously checked Ethereum explorer is not evidence of Canto activity. Keep the chain/product hold; a broken explorer alone does not establish network retirement. |
| cellana-finance.md | hold | The further focused search did not resolve this hold. The further search found an announcement-channel reference and similarly branded unrelated domains, but no accepted current issuer shutdown notice or verified product pair. An abandoned-looking channel or lookalike site is not a replacement or closure proof; retain the hold. |
| cess.md | hold | The further focused search did not resolve this hold. The node repository confirms its software role but adds no newly verified current service endpoint. The earlier product-link correction remains valid; current homepage/storage-service availability remains unresolved. No node software was run. |
| coreum.md | propose correction | The successor issuer explicitly identifies the Coreum/Sologenic merger and links its own tx documentation and explorer. After initial loading, the explorer populated recent blocks, transactions and validators, resolving the earlier empty-shell observation. Reprofile the existing ID as the successor network, without asserting that the advertised coming-soon marketplace has launched. Former entity founding/HQ/social fields are not silently inherited. This verifies a public network reference, not token-conversion instructions, chain security or financial suitability. |
| cypher-capital-markets.md | hold | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| hmx.md | hold | The further focused search did not resolve this hold. The original HMX official profile explicitly identifies the migration and links the DESK account and Linktree. That official Linktree identifies Base and the new website/docs. The website redirects to a blank CLOB shell and docs DNS fails. Correct documented identity/site metadata, unset the unverified current token and dead legacy app link, but keep needs_update; neither trading nor agent execution is claimed live. |
| did-id.md | hold | The further focused search did not resolve this hold. The listed project is a Kusama/Polkadot identity profile associated with dotdid. Search found the different .bit/d.id identity product; the similar name does not establish continuity and was not substituted. |
| dojoswap.md | hold | The further focused search did not resolve this hold. A market-data provider references dojo.trading, while a previously associated Telegram route now presents an unrelated channel. These are identity discontinuities, not proof that the exchange currently works or that a similarly named site is its successor. Keep held. |
| eigenlayer.md | hold | The further focused search did not resolve this hold. The official EigenCloud documentation search recovers the original restaking whitepaper, which confirms historical protocol identity but does not resolve the current application failure or provide a functioning replacement. Keep the onchain-product hold. |
| finoa.md | hold | The further focused search did not resolve this hold. The August 2026 mobile-app privacy policy corroborates the technical-service model and non-custodial scope already corrected in PR #54. It does not supply a newly accepted accessible service/product route. Keep held without treating the policy as a custody authorization or product test. |
| flipside.md | hold | The further focused search did not resolve this hold. The website response still does not establish a rendered current analytics product. This pass did not independently verify an operating replacement; do not promote a shell or infer closure. |
| fortunafi.md | hold | The public issuer homepage continues to describe tokenized investment products, but the row's GitBook editor URL is not a public product reference. A current public documentation/product destination remains unresolved; fund data in an aggregator does not fix that link. |
| fractal-id.md | hold | The further focused search did not resolve this hold. The issuer's dated plan describes dataless KYC and intended open-sourcing, but the current original routes remain unavailable. A planned transition in 2025 is not proof it completed, the company shut down or a current replacement is supported. Retain the hold. |
| fxhash.md | hold | The further focused search did not resolve this hold. The official organization still hosts a public frontend repository with later repository activity than the apparent closure post on a mirror. Such activity could be maintenance or metadata changes and does not prove a hosted service. The original closure post remains unrecoverable; retain the hold rather than promote either contradictory signal as conclusive. |
| gelato-web3-functions.md | propose exclusion | BGD Labs' firsthand Aave Robot report dated 31 March 2026 explicitly identifies Gelato automation/Web3 Functions deprecation and confirms migration of the affected automations to Chainlink CRE. This adds an actual former user's implementation record beyond a competitor's migration article. Propose exclusion of this specifically named legacy Functions service, retaining its history; do not classify the separate continuing Gelato rollup/platform business as closed. The old app's certificate failure is recorded only as an access failure, not as the retirement proof. |
| govrn.md | propose partial correction keep hold | Govrn's own Linktree identifies the DAO contribution tool and links the exact govrn.app application, docs and issuer blog. Replace the unsupported .xyz reference with that accessible issuer link hub. The linked application again timed out, including the Brave navigation attempt, so remove the known-broken guessed /platform product link rather than assert a working replacement. Keep needs_update until the actual application or retirement can be established. |
| harmony.md | propose exclusion | Ankr's own 5 October 2026 RPC end-of-support notice explicitly records Harmony's L1 sunset and retires its Harmony endpoint. This is a firsthand service-operator record, strengthening the prior issuer explorer sunset banner. Propose exclusion of the listed active-L1 service profile, retaining the source and history. The network-halt statement is attributed to Ankr, not presented as an independent chain measurement. This does not declare every Harmony business, ONE token or future product closed and does not endorse any token migration. |
| heymint.md | hold | The further focused search did not resolve this hold. The acquirer's own directory continues to describe HeyMint/Launchpad tools, strengthening acquisition/product identity but not verifying an accessible current launch workflow. Do not infer closure solely from acquisition or re-verify from a static catalogue; retain the hold. |
| icon.md | hold | The published economic wind-down and stopped rewards differ from a complete network halt. The stated 31 December 2026 endpoint remains in the future; retain the hold and prior scoped description. |
| ivendpay.md | hold | The further focused search did not resolve this hold. The issuer's indexed /app and /pos pages establish exact named products and app.ivpay.io as its entry, but those current domains still fail DNS here. Keep the IVPAY name correction and product hold; do not publish an unverified replacement route merely because it appears in an index. |
| jex.md | hold | The further focused search did not resolve this hold. Binance's own announcements establish its historical JEX acquisition and token program, not current operation or exact later retirement. Acquisition alone does not repair the coming-soon destination or authorize replacing this row with Binance; keep held. |
| kilt-protocol.md | hold | The SDK/explorer-focused search did not establish the current official site/product pair needed to resolve this hold. Historical SDK distribution or exchange delisting does not establish either current network operation or whole-project closure. |
| leapfrog-wallet.md | hold | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| trader-joe.md | hold | The further focused search did not resolve this hold. The issuer newsletter explicitly confirms the LFJ rebrand; both old domains redirect to LFJ and current developer docs describe its DEX. Correct the name and canonical swap route, but keep needs_update: the observed swap interface remained at asset/network loading and did not establish a functioning current market. No challenge was bypassed or swap attempted. |
| lybra-finance.md | hold | A migration-oriented domain lead requires issuer continuity and current product confirmation. A zero countdown or token price is not accepted as proof of either a successful migration or permanent closure. |
| lykke.md | hold | The getlykke.com student app is unrelated to the former exchange. Archived wallet instructions are historical references, not a current supported exchange product; no keys or recovery actions were used. |
| magic-eden.md | hold | The further focused search did not resolve this hold. The current official Solana collection-listing guide adds product-specific support evidence. The ordinary marketplace remains restricted here, and chain-specific/Wallet retirements still do not establish whole-platform closure; retain the hold without bypassing access restrictions. |
| magic-eden-creator-hub.md | hold | The further focused search did not resolve this hold. The 9 March 2026 issuer guide specifically covers Solana collection listing/ownership in Creator Hub. This strengthens current support evidence but does not independently verify the restricted application workflow. Keep held; no wallet ownership or collection-management action was performed. |
| mango-markets.md | hold | Kraken's published MNGO asset statement reports the DAO wind-down and end of active core development. This is stronger operator evidence but is not an issuer statement that every surviving contract or product has ceased. The exact maintained frontend/service scope still requires confirmation; retain the hold. |
| mars-protocol.md | hold | The further focused search did not resolve this hold. The new search surfaces contributor wind-down discussion, but the passed/executed state and exact Red Bank versus older Mars Hub scope remain unconfirmed. Keep held rather than turn a proposal or chain-specific change into whole-protocol closure. |
| masa.md | hold | A similarly named masa.io support/app result concerns a different product. It is not accepted as a successor to Masa's Web3/AI offering; retain the identity/product hold. |
| matr1x.md | hold | The further focused search did not resolve this hold. The current original domain is a registrar parking page, which strengthens the stale-link finding but does not establish the precise retirement scope of every game/token project. Retain the hold pending issuer evidence; do not treat a re-registered domain as continued operator identity. |
| metalcore.md | hold | The further focused search did not resolve this hold. The issuer's old getting-started material still describes a closed beta and NFT-linked wallets. This historical instruction does not settle present support or a reported later shutdown. Keep held without accepting terms, downloading a launcher or connecting a wallet. |
| mina-foundation.md | hold | The further focused search did not resolve this hold. The current Q3 2026 report explicitly says the solvent wind-down and treasury handover are still being prepared. This corroborates the existing correction but is not proof of completed dissolution or termination of the Mina network; retain the hold. |
| mintbase.md | hold | The further focused search did not resolve this hold. The original Ethereum/NEAR sites still have indexed legacy product material. This does not resolve the paused Bitte successor or establish continuity with a similarly branded new domain. Keep held rather than use cached launch materials as current functionality proof. |
| mocana-gaming.md | hold | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| movement-labs.md | hold | New issuer governance material identifies Move Industries as a service provider to Movement Network Foundation. That relationship does not establish a simple legal rename of Movement Labs or justify inheriting all former company metadata. Keep the original identity/successor hold. |
| neutron.md | hold | Current operator/explorer leads identify CryptoCrew/Solva validator and recovery activity, but a canonical current product/network reference has not yet been accepted. Long-term maintenance, handover and a historical incident do not by themselves establish a retired whole network; retain the hold. |
| nod-games.md | hold | The further focused search did not resolve this hold. Own game terms and the old LINE game page establish historical NOD identity, but the exact company/game routes remain unavailable and no current successor was accepted. Keep held rather than invent a replacement from another studio. |
| notional-finance.md | hold | The current vault/legacy-version material distinguishes a V1 incident and V2 deprecation from V3 or company-wide retirement. Unresolved displayed vault figures and current product scope remain held; do not infer closure of every version. |
| oncyber.md | hold | A current oncyber.com world-building lead needs issuer continuity to the original .io product and a current public product check. The similarly named oncyber.ca status service concerns a different cybersecurity business and is not accepted as metaverse evidence. |
| openaudit.md | hold | Exact-name search results include unrelated binary-analysis and network-inventory software. They do not establish the row's claimed crypto auditing marketplace; retain the hold without adopting a lookalike. |
| opyn.md | hold | The further focused search did not resolve this hold. The first-party Squeeth application explicitly confirms its 4 November 2024 shutdown while mentioning future Opyn Markets. That is precise Squeeth evidence, not proof that every Gamma/Opyn service closed or that the successor launched. Keep the broader company/protocol profile held. |
| penumbra.md | hold | The further focused search did not resolve this hold. The current official frontend guide replaces the missing generic /learn route and identifies the protocol's independent frontend architecture, wallet dependency, explorer and DEX tooling. It also reveals that the Veil guide is incomplete. Correct the reference while retaining needs_update: a current populated hosted DEX/explorer was not established, and accessible code or documentation is not proof of chain-wide shutdown or full product operation. No wallet, node or frontend was installed. |
| pizzadao.md | hold | The further focused search did not resolve this hold. The official origin account again confirms NFT fundraising and current community events, but no additional ongoing onchain governance/product evidence was established. Keep the corrected current domain/profile held without treating a community event programme as a newly verified crypto service. |
| platypus-finance.md | hold | The further focused search did not resolve this hold. The public official announcement channel contains older recovery/pool-launch material. This does not establish a currently supported exchange or an exact permanent retirement; keep held and do not follow claims/withdrawal instructions. |
| playember.md | hold | The further focused search did not resolve this hold. Current issuer support/privacy pages describe a free strategy game with passwordless sign-in, reinforcing the scope mismatch with the legacy Web3 profile. They do not explicitly establish whether every old crypto product retired, or prove operator continuity of the changed offering. Keep held rather than reclassify a general game as an onchain product. |
| pleasrdao.md | hold | The further focused search did not resolve this hold. The current own site and June 2026 DAO explainer establish continued cultural/DAO-themed publication. A supported collective ownership/governance product and exact current operational identity remain unverified; an educational article alone does not settle the hold. |
| prisma-finance.md | hold | A similarly named Prisma/Asentum project is distinct from the original Ethereum PRISMA protocol. The new name is not accepted as a successor without issuer continuity and a current product check. |
| qredo.md | hold | The further focused search did not resolve this hold. Zenrock's current own site documents its dMPC chain and products, but the exact legal/product continuity from the old Qredo entry is still not established by acquisition alone. Keep held instead of transferring predecessor metadata into the successor's distinct products. |
| raft.md | hold | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| redefine-security.md | propose partial correction keep hold | Redefine's own API documentation and its Firefox publisher listing establish the DeFirewall identity, replacing an unsubstantiated auditing profile and failed .security routes. The publisher's redefine.net domain now leads to a sale page; the experimental extension and API guide were last updated in 2024. These surviving references do not establish current service support. Keep needs_update, use the accessible publisher documentation, clear unsupported founding/HQ/social fields, and do not obtain keys, install the extension or call its API. |
| saakuru.md | hold | The publisher's MetaOne/Saakuru Android wallet listing announces that specific app's discontinuation. This is narrower than the row's Layer-2 network scope. Do not turn a wallet retirement or generic AI branding into evidence that every Saakuru chain service has ceased. |
| saga.md | hold | The further focused search did not resolve this hold. The current AI-oriented destination and older chain material still lack verified current network/product continuity. Do not assign a crypto-agent category based solely on history. |
| skynet-security.md | hold | The further focused search did not resolve this hold. Search returns unrelated Skynet AI, cloud and other security products. No official replacement or identity continuity was established for this exact row. |
| solanafm.md | hold | The further focused search did not resolve this hold. The further review source explicitly says no issuer shutdown notice was found and its widgets did not load. That is useful contrary evidence against an invented closure, but cannot re-verify the product. Official API docs remain historical support evidence; keep held. |
| spectral-syntax.md | hold | Current project-profile leads describe The Grid inference work and an agent roadmap. A roadmap or generalized inference product does not prove that the specific Syntax onchain agent offering is currently available, nor does it establish whole-company closure. |
| spheron.md | hold | The further focused search did not resolve this hold. A current GPU marketplace with populated capacity/pricing renders, but the current service does not itself prove a crypto/Web3 function. The old DePIN whitepaper is not a current supported onchain product demonstration. |
| spruceid.md | hold | SpruceID's verified GitHub organization remains active, while its company focus includes government identity. Current SIWE package support and the exact product reference remain under review. A stable library is not presumed retired because it lacks frequent releases, and a company pivot alone does not verify or retire every library. |
| stella.md | propose partial correction keep hold | The issuer's ALPHA staking page explicitly identifies Stella and its announced LitLayer transition, resolving confusion with the unrelated stella.org domain. Both detailed governance proposals linked by that page return 404 in the public reader, so a completed successor product is not established. Keep needs_update while correcting the reference to the actual legacy interface. No wallet was connected and no staking, unstaking, migration or claim was performed. Clear the unsupported Metaverse headquarters value. |
| swarm-markets.md | hold | The documentation describes dOTC v2, but the current public offering, successor documentation-host continuity and actual application availability remain unverified. Retired individual assets must not be generalized to all OTC services. |
| tableland.md | hold | The operator merger/Recall material explains organizational changes and community-channel retirement. Those facts do not establish the retirement of every Tableland protocol component or a working current replacement product; retain the hold. |
| the-beacon.md | hold | The publisher's Epic FAQ explicitly describes its blockchain/item ownership model, strengthening Web3 relevance. A FAQ alone does not establish whether the actual store game is released, in closed testing or coming soon; keep the product-availability hold without installing the game. |
| thruster.md | hold | A newly found INIT integration notice refers to Thruster's wind-down, but the dated original issuer/operator post and exact surviving product scope still require confirmation. A reused social handle or another protocol's borrowing restriction is not silently substituted for the retired DEX's current identity. |
| trailblaze-security.md | hold | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| treasure-dao.md | hold | The further focused search did not resolve this hold. The own current site describes a persistent-agent network and MAGIC, but current general availability is still unestablished. Keep held rather than promote a forthcoming network into a verified operating game/agent service. |
| openlaw.md | hold | The further focused search did not resolve this hold. Current ADIN terms identify Tribute Labs Services LLC and venture-analysis services, strengthening the already corrected operator identity. Those terms do not establish a currently supported onchain DAO/legal product or turn non-token points into crypto assets; keep held. |
| vela-exchange.md | hold | The further focused search did not resolve this hold. The original VELA knowledge base preserves the old product and support identities, but no precise current retirement announcement or working trading frontend was recovered. Retain the hold and do not substitute the separately branded exchange using a similar name. |
| verite.md | hold | The further focused search did not resolve this hold. Circle's own 2022 announcements confirm the Verite standards/proof-of-concept identity. They do not establish current support following the repository archive or prove every deployment ceased. Keep held rather than equate historical standards publication with an active service. |
| watchpug.md | hold | The client's original Mainstreet PDF is dated 18 July 2025, distinguishing report date from repository upload date. A newly found compiled catalogue claims an August 2026 Pendle report but links watchpug.com, conflicting with the row's .org reference; it is explicitly a compiled unclaimed profile. The original current report and domain continuity remain unresolved, so neither the recent date nor alternate domain is accepted as proof of current service. |
| web3-storage.md | hold | The further focused search did not resolve this hold. Exact historical Storacha console/Forge endpoints were recovered, but those current hosts fail DNS. This does not resolve operator continuity into Fil One or establish an available predecessor service; retain the hold without replacing the identity or claiming every stored file disappeared. |
| youves.md | hold | The further focused search did not resolve this hold. The own governance forum remains indexed, but no new authoritative permanent-closure notice or healthy application data was recovered. Keep the maintenance/product hold; forum availability alone does not verify financial service operation. |
| zebpay.md | propose correction | The original ZebPay publisher listing identifies its website and crypto trading product. Brave rendered its current 20 November 2026 update, providing a current distribution reference instead of the missing /exchange route. Narrow verification to the published mobile offering; no account, app installation, trading, custody, return or regulatory claim was tested. Historical founding/HQ/social metadata remains unchanged and is not newly certified. |
| zipmex.md | hold | The current domain markets a Solana aggregator, unlike the original centralized-exchange profile. That new content is not accepted as original-operator continuity or a safe successor merely because it occupies the old domain. |
| zkfair.md | hold | The further focused search did not resolve this hold. Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| zkswap-finance.md | hold | The new indexed price-catalogue result repeats a shutdown claim and points to an issuer announcement. Until the original dated announcement and exact scope are recovered, a secondary summary alone does not close the hold. |

## Further search coverage

These queries and indexed leads record the additional research coverage. A lead listed here was not necessarily fetched or accepted; accepted decision evidence is specified above.

| Row | Focused query | Indexed leads, pending confirmation unless accepted above |
| --- | --- | --- |
| abracadabra.md | "Abracadabra" crypto current official product support 2026 | [https://abracadabra.money/](https://abracadabra.money/)<br>[https://docs.abracadabra.money/learn](https://docs.abracadabra.money/learn) |
| ancilia.md | "Ancilia" "security" "platform" official | [https://app.dealroom.co/companies/ancilia](https://app.dealroom.co/companies/ancilia)<br>[https://www.bnbchain.org/en/blog/bnb-smart-chain-2023-security-report-by-avengerdao-contributed-by-hashdit-certik-ancilia-and-salus-security](https://www.bnbchain.org/en/blog/bnb-smart-chain-2023-security-report-by-avengerdao-contributed-by-hashdit-certik-ancilia-and-salus-security) |
| anzen.md | "Anzen" crypto current official product support 2026 | [https://app.anzen.finance/transparency](https://app.anzen.finance/transparency)<br>[https://docs.anzen.finance/](https://docs.anzen.finance/) |
| astaria.md | "Astaria" crypto current official product support 2026 | [https://defillama.com/protocol/astaria](https://defillama.com/protocol/astaria)<br>[https://linktr.ee/astariaxyz](https://linktr.ee/astariaxyz) |
| azuki.md | "Azuki" "NFT" "OpenSea" official collection | [https://opensea.io/collection/azuki/overview](https://opensea.io/collection/azuki/overview)<br>[https://opensea.io/collection/beanzofficial/overview](https://opensea.io/collection/beanzofficial/overview) |
| badger.md | "Badger" crypto current official product support 2026 | [https://badger.com/](https://badger.com/)<br>[https://oldlandingpage.badger.com/products/badger](https://oldlandingpage.badger.com/products/badger) |
| bakkt.md | "Bakkt" "Zaira" stablecoin product official | [https://docs.publicnow.com/viewDoc?filename=182195%5CEXT%5C2331434B9FB8BECE67F76F42F9BFACFCE07C1909_088FC01D520A93901A12E9155084102CC852078D.PDF](https://docs.publicnow.com/viewDoc?filename=182195%5CEXT%5C2331434B9FB8BECE67F76F42F9BFACFCE07C1909_088FC01D520A93901A12E9155084102CC852078D.PDF)<br>[https://investors.bakkt.com/static-files/f4868c30-a8cc-4507-ada0-482b096b7bbc](https://investors.bakkt.com/static-files/f4868c30-a8cc-4507-ada0-482b096b7bbc) |
| balancer.md | "Balancer" crypto current official product support 2026 | [https://balancer.fi/](https://balancer.fi/)<br>[https://help.wealthsimple.com/hc/en-ca/articles/4405009137691-Balancer-BAL](https://help.wealthsimple.com/hc/en-ca/articles/4405009137691-Balancer-BAL) |
| barnbridge.md | "BarnBridge" crypto current official product support 2026 | [https://github.com/barnbridge](https://github.com/barnbridge)<br>[https://defillama.com/protocol/barnbridge](https://defillama.com/protocol/barnbridge) |
| banklessdao.md | "Black Flag DAO (formerly BanklessDAO)" crypto current official product support 2026 | [https://www.openhaven.net/research/dao-governance-platforms/](https://www.openhaven.net/research/dao-governance-platforms/)<br>[https://openhaven.net/research/dao-governance-platforms/](https://openhaven.net/research/dao-governance-platforms/) |
| blocklords.md | "Blocklords" crypto current official product support 2026 | [https://wiki.blocklords.com/faqs](https://wiki.blocklords.com/faqs)<br>[https://wiki.blocklords.com/getting-started/official-links](https://wiki.blocklords.com/getting-started/official-links) |
| blueshift.md | "Blueshift" "blueshift.fi" bridge sunset | [https://www.linkedin.com/company/blueshift-fi](https://www.linkedin.com/company/blueshift-fi)<br>[https://skynet.certik.com/projects/blueshift](https://skynet.certik.com/projects/blueshift) |
| bunzz.md | "Bunzz" crypto current official product support 2026 | [https://app.bunzz.dev/login](https://app.bunzz.dev/login)<br>[https://docs.caduceus.foundation/bunzz](https://docs.caduceus.foundation/bunzz) |
| bitvenus.md | "BVOX" "BitVenus" app official publisher | [https://play.google.com/store/apps/details?hl=en_US&id=io.bitvenus.app.first](https://play.google.com/store/apps/details?hl=en_US&id=io.bitvenus.app.first)<br>[https://medium.com/%40bvox/announcement-on-beware-of-fraud-628865794651](https://medium.com/%40bvox/announcement-on-beware-of-fraud-628865794651) |
| canto.md | "Canto" "block explorer" mainnet official | [https://docs.canto.io/evm-development/quickstart-guide](https://docs.canto.io/evm-development/quickstart-guide)<br>[https://docs.canto.io/user-guides/connecting-to-canto](https://docs.canto.io/user-guides/connecting-to-canto) |
| cellana-finance.md | "Cellana Finance" "shutdown" OR "sunset" | [https://www.skillsdirectory.com/skills/plurigrid-aptos-ecosystem](https://www.skillsdirectory.com/skills/plurigrid-aptos-ecosystem)<br>[https://www.vcnewsdaily.com/fundedcompanylist/javawww.vcnewsdaily.com/fundedcompanylist/s](https://www.vcnewsdaily.com/fundedcompanylist/javawww.vcnewsdaily.com/fundedcompanylist/s) |
| cess.md | "CESS" "mainnet" "explorer" official | [https://cess.network/earn/](https://cess.network/earn/)<br>[https://www.cess.network/](https://www.cess.network/) |
| coreum.md | "Coreum" "TX" merger official website | [https://tx.org/](https://tx.org/)<br>[https://tx.org/index.html](https://tx.org/index.html) |
| cypher-capital-markets.md | "Cypher" "cyphercm.com" |  |
| hmx.md | "HMX" "DESK" "markets" official | [https://defillama.com/protocol/hmx?events=false&revenue=true&tvl=false](https://defillama.com/protocol/hmx?events=false&revenue=true&tvl=false)<br>[https://www.alchemy.com/dapps/hmx](https://www.alchemy.com/dapps/hmx) |
| did-id.md | "dotdid" "DID" "Polkadot" official |  |
| dojoswap.md | "DojoSwap" crypto current official product support 2026 | [https://defillama.com/protocol/dojoswap](https://defillama.com/protocol/dojoswap)<br>[https://coinmarketcap.com/currencies/dojoswap/](https://coinmarketcap.com/currencies/dojoswap/) |
| eigenlayer.md | "EigenLayer" crypto current official product support 2026 | [https://docs.eigenfoundation.org/](https://docs.eigenfoundation.org/)<br>[https://help.wealthsimple.com/hc/en-ca/articles/33040735799451-EigenLayer-EIGEN](https://help.wealthsimple.com/hc/en-ca/articles/33040735799451-EigenLayer-EIGEN) |
| finoa.md | "Finoa" "technical services" "app" | [https://www.finoa.io/mobile-app-privacy-policy](https://www.finoa.io/mobile-app-privacy-policy)<br>[https://www.alchemy.com/dapps/finoa](https://www.alchemy.com/dapps/finoa) |
| flipside.md | "Flipside" crypto "Studio" "API" official | [https://github.com/FlipsideCrypto/sdk/blob/main/README.md](https://github.com/FlipsideCrypto/sdk/blob/main/README.md)<br>[https://github.com/FlipsideCrypto/sdk](https://github.com/FlipsideCrypto/sdk) |
| fortunafi.md | "Fortunafi" "docs" "tokenized" | [https://enterprise.defillama.com/rwa/platform/fortunafi](https://enterprise.defillama.com/rwa/platform/fortunafi)<br>[https://defillama.com/rwa/platform/fortunafi?view=information](https://defillama.com/rwa/platform/fortunafi?view=information) |
| fractal-id.md | "Fractal ID" "open source" "GitHub" | [https://github.com/andrevalenm/poh-aggregator/blob/main/research/protocols/passport-civic-fractal-zkme-galxe.md](https://github.com/andrevalenm/poh-aggregator/blob/main/research/protocols/passport-civic-fractal-zkme-galxe.md)<br>[https://github.com/web3privacy/web3privacy/blob/main/Market%20overview/Ethereum%20Ecosystem/Readme.md](https://github.com/web3privacy/web3privacy/blob/main/Market%20overview/Ethereum%20Ecosystem/Readme.md) |
| fxhash.md | "fxhash" "wind-down" "ciphrd" | [https://x.noodl3.net/fx_hash_](https://x.noodl3.net/fx_hash_)<br>[https://xitter.cf/fx_hash_](https://xitter.cf/fx_hash_) |
| gelato-web3-functions.md | "Gelato" "Web3 Functions" "deprecated" | [https://www.mimic.fi/blog/gelato-web3-automation-is-ending-use-mimic](https://www.mimic.fi/blog/gelato-web3-automation-is-ending-use-mimic)<br>[https://governance.aave.com/t/integration-of-chainlink-cre-into-aave-robot/24366](https://governance.aave.com/t/integration-of-chainlink-cre-into-aave-robot/24366) |
| govrn.md | "Govrn" "DAO" app official contribution | [https://govrn.app/](https://govrn.app/)<br>[https://linktr.ee/Govrn](https://linktr.ee/Govrn) |
| harmony.md | "Harmony" crypto current official product support 2026 | [https://www.ankr.com/docs/changelog/harmony-end-of-support/](https://www.ankr.com/docs/changelog/harmony-end-of-support/)<br>[https://explorer.harmony.one/blocks](https://explorer.harmony.one/blocks) |
| heymint.md | "HeyMint" "Alchemy" "sunset" | [https://tgchannels.org/channel/eli5definews?first=3259&lang=all&size=30&start=3259](https://tgchannels.org/channel/eli5definews?first=3259&lang=all&size=30&start=3259)<br>[https://thisweekinchia.com/archive.php](https://thisweekinchia.com/archive.php) |
| icon.md | "ICON" crypto current official product support 2026 | [https://www.icon.foundation/blog/2026/icon-network-economic-shutdown](https://www.icon.foundation/blog/2026/icon-network-economic-shutdown)<br>[https://www.icon.foundation/blog/2026/icon-network-phased-halt-to-emissions](https://www.icon.foundation/blog/2026/icon-network-phased-halt-to-emissions) |
| ivendpay.md | "IVPAY (formerly ivendPay)" crypto current official product support 2026 | [https://plugins.wpmayor.com/plugin/ivendpay-payments](https://plugins.wpmayor.com/plugin/ivendpay-payments)<br>[https://dev.to/shieldz/93-crypto-payment-gateways-compared-fees-custody-kyc-november-2026-454n](https://dev.to/shieldz/93-crypto-payment-gateways-compared-fees-custody-kyc-november-2026-454n) |
| jex.md | "JEX" "jex.trade" exchange official |  |
| kilt-protocol.md | "KILT Protocol" "docs" "Subscan" | [https://git.pezkuwichain.io/pezkuwichain/pezkuwi-apps/blame/branch/main/CHANGELOG.md](https://git.pezkuwichain.io/pezkuwichain/pezkuwi-apps/blame/branch/main/CHANGELOG.md)<br>[https://git.pezkuwichain.io/pezkuwichain/pezkuwi-apps/blame/commit/f348a901c5e522ae725273312d299ec7fd42b7f0/CHANGELOG.md](https://git.pezkuwichain.io/pezkuwichain/pezkuwi-apps/blame/commit/f348a901c5e522ae725273312d299ec7fd42b7f0/CHANGELOG.md) |
| leapfrog-wallet.md | "Leapfrog" "leapfrogwallet.xyz" |  |
| trader-joe.md | "LFJ (formerly Trader Joe)" crypto current official product support 2026 | [https://solanacompass.com/projects/lfj](https://solanacompass.com/projects/lfj)<br>[https://skynet.certik.com/projects/trader-joe](https://skynet.certik.com/projects/trader-joe) |
| lybra-finance.md | "Lybra" "LBR DAO" official transition | [https://lbrdao.com/](https://lbrdao.com/)<br>[https://assets.cfx.co.id/static/Surat_Keputusan_Direksi_Penetapan_Daftar_Aset_Keuangan_Digital_17_April_2026_dc34674fbc.pdf](https://assets.cfx.co.id/static/Surat_Keputusan_Direksi_Penetapan_Daftar_Aset_Keuangan_Digital_17_April_2026_dc34674fbc.pdf) |
| lykke.md | "Lykke" crypto current official product support 2026 | [https://www.students.getlykke.com/terms](https://www.students.getlykke.com/terms)<br>[https://lykkecity.github.io/LykkeWeb/public/](https://lykkecity.github.io/LykkeWeb/public/) |
| magic-eden.md | "Magic Eden" crypto current official product support 2026 | [https://help.magiceden.io/en/articles/13885504-magic-eden-marketplace-updates-service-changes](https://help.magiceden.io/en/articles/13885504-magic-eden-marketplace-updates-service-changes)<br>[https://help.magiceden.io/en/articles/13885539-magic-eden-wallet-deprecation-overview%23.ejs](https://help.magiceden.io/en/articles/13885539-magic-eden-wallet-deprecation-overview%23.ejs) |
| magic-eden-creator-hub.md | "Magic Eden Creator Hub" crypto current official product support 2026 | [https://help.magiceden.io/en/articles/6975805-what-is-creator-hub-a-guide-to-managing-nft-collections-on-magic-eden](https://help.magiceden.io/en/articles/6975805-what-is-creator-hub-a-guide-to-managing-nft-collections-on-magic-eden)<br>[https://solanacompass.com/projects/magic-eden](https://solanacompass.com/projects/magic-eden) |
| mango-markets.md | "Mango Markets" "wind down" "DAO" announcement | [https://www.theblock.co/news/defi/2025-01-12-mango-markets-to-wind-down-in-wake-of-sec-settlement-dao-battle-334172](https://www.theblock.co/news/defi/2025-01-12-mango-markets-to-wind-down-in-wake-of-sec-settlement-dao-battle-334172)<br>[https://assets-cms.kraken.com/files/51n36hrp/facade/16fb3bb9fc0ae3801e7aa4ab24ff4eb255454892.pdf](https://assets-cms.kraken.com/files/51n36hrp/facade/16fb3bb9fc0ae3801e7aa4ab24ff4eb255454892.pdf) |
| mars-protocol.md | "Mars Protocol" crypto current official product support 2026 | [https://linktr.ee/marsprotocol](https://linktr.ee/marsprotocol)<br>[https://bitmart.zendesk.com/hc/en-us/articles/12438781936539-Mars-Protocol-MARS](https://bitmart.zendesk.com/hc/en-us/articles/12438781936539-Mars-Protocol-MARS) |
| masa.md | "Masa" crypto current official product support 2026 | [https://coinone.co.kr/info/notice/5039](https://coinone.co.kr/info/notice/5039)<br>[https://masa.io/support](https://masa.io/support) |
| matr1x.md | "Matr1x" crypto current official product support 2026 | [https://bitmart.zendesk.com/hc/en-us/articles/27994721853851-Matr1x-MAX](https://bitmart.zendesk.com/hc/en-us/articles/27994721853851-Matr1x-MAX)<br>[https://www.kucoin.com/announcement/en-matr1x-max-gets-listed-on-kucoin-world-premiere](https://www.kucoin.com/announcement/en-matr1x-max-gets-listed-on-kucoin-world-premiere) |
| metalcore.md | "MetalCore" crypto current official product support 2026 | [https://www.metalcore.gg/get-started](https://www.metalcore.gg/get-started)<br>[https://www.metalcore.gg/faq](https://www.metalcore.gg/faq) |
| mina-foundation.md | "Mina Foundation" crypto current official product support 2026 | [https://www.minafoundation.com/](https://www.minafoundation.com/)<br>[https://www.minafoundation.com/reports/q3-2026-transparency-report](https://www.minafoundation.com/reports/q3-2026-transparency-report) |
| mintbase.md | "Mintbase" crypto current official product support 2026 | [https://www.mintbase.io/](https://www.mintbase.io/)<br>[https://eth.mintbase.io/](https://eth.mintbase.io/) |
| mocana-gaming.md | "Mocana" "mocanagaming.com" |  |
| movement-labs.md | "Movement Labs" "Move Industries" official website 2026 | [https://www.prnewswire.com/news-releases/move-industries-launches-new-era-for-movement-302448093.html](https://www.prnewswire.com/news-releases/move-industries-launches-new-era-for-movement-302448093.html)<br>[https://www.wboc.com/online_features/press_releases/movement-network-foundation-announces-corporate-governance-updates/article_9212c779-ec96-55cc-8023-53b5cb79a097.html](https://www.wboc.com/online_features/press_releases/movement-network-foundation-announces-corporate-governance-updates/article_9212c779-ec96-55cc-8023-53b5cb79a097.html) |
| neutron.md | "Neutron" official "explorer" "CryptoCrew" | [https://neutron.valopers.com/validators/neutronvaloper1e6rw7a7ngjmn8qjqfymu4en0px7hlr27fpf55k](https://neutron.valopers.com/validators/neutronvaloper1e6rw7a7ngjmn8qjqfymu4en0px7hlr27fpf55k)<br>[https://iknowblockchain.com/chains/neutron/](https://iknowblockchain.com/chains/neutron/) |
| nod-games.md | "NOD Games" "League of Kingdoms" current website | [https://apis.io/providers/nod-games/](https://apis.io/providers/nod-games/)<br>[https://kr.linkedin.com/jobs/view/business-development-manager-at-nod-games-3935605473](https://kr.linkedin.com/jobs/view/business-development-manager-at-nod-games-3935605473) |
| notional-finance.md | "Notional Finance" crypto current official product support 2026 | [https://blog.notional.finance/](https://blog.notional.finance/)<br>[https://v2.notional.finance/](https://v2.notional.finance/) |
| oncyber.md | "OnCyber" crypto current official product support 2026 | [https://www.oncyber.com/](https://www.oncyber.com/)<br>[https://status.oncyber.ca/](https://status.oncyber.ca/) |
| openaudit.md | "OpenAudit" "openaudit.org" crypto | [https://hitmen.c02.at/html/tools_ida.html](https://hitmen.c02.at/html/tools_ida.html)<br>[https://worldmetrics.org/best/lan-inventory-software/](https://worldmetrics.org/best/lan-inventory-software/) |
| opyn.md | "Opyn" crypto current official product support 2026 | [https://dapps.alchemy.com/dapps/opyn](https://dapps.alchemy.com/dapps/opyn)<br>[https://defillama.com/protocol/opyn](https://defillama.com/protocol/opyn) |
| penumbra.md | "Penumbra" "Noctis" "explorer" | [https://explorer.penumbra.fi/](https://explorer.penumbra.fi/)<br>[https://explorer.rotko.net/](https://explorer.rotko.net/) |
| pizzadao.md | "PizzaDAO" crypto current official product support 2026 | [https://pizzadao.org/](https://pizzadao.org/)<br>[https://pizzadao.org/home](https://pizzadao.org/home) |
| platypus-finance.md | "Platypus Finance" "cease" "official" | [https://m.web3isgoinggreat.com/web1?cursor=2023-08-10-0&direction=next](https://m.web3isgoinggreat.com/web1?cursor=2023-08-10-0&direction=next)<br>[https://oma.web3isgoinggreat.com/web1?cursor=2023-08-01-1&direction=next](https://oma.web3isgoinggreat.com/web1?cursor=2023-08-01-1&direction=next) |
| playember.md | "PlayEmber" "Ember" "Web3" transition | [https://investors.boombit.com/wp-content/uploads/sites/3/2024/04/ENGLISH-BoomBit_FY2023_final.pdf](https://investors.boombit.com/wp-content/uploads/sites/3/2024/04/ENGLISH-BoomBit_FY2023_final.pdf)<br>[https://nearprotocol.eco/category/game](https://nearprotocol.eco/category/game) |
| pleasrdao.md | "PleasrDAO" crypto current official product support 2026 | [https://pleasr.org/](https://pleasr.org/)<br>[https://github.com/PleasrDAO](https://github.com/PleasrDAO) |
| prisma-finance.md | "Prisma Finance" crypto current official product support 2026 | [https://www.prismafinance.tech/docs/](https://www.prismafinance.tech/docs/)<br>[https://www.prismafinance.tech/](https://www.prismafinance.tech/) |
| qredo.md | "Qredo" crypto current official product support 2026 | [https://www.qredo.com/product](https://www.qredo.com/product)<br>[https://www.qredo.com/pricing](https://www.qredo.com/pricing) |
| raft.md | "Raft" "RAFT" "winding down" protocol | [https://www.raft.co.za/forensic-investigations-liquidations-2/](https://www.raft.co.za/forensic-investigations-liquidations-2/)<br>[https://committees.parliament.uk/oralevidence/6480/pdf/](https://committees.parliament.uk/oralevidence/6480/pdf/) |
| redefine-security.md | "Redefine" "DeFirewall" official platform | [https://addons.mozilla.org/en-US/firefox/addon/defirewall/](https://addons.mozilla.org/en-US/firefox/addon/defirewall/)<br>[https://redefine-api-docs.readme.io/reference/getting-started-with-your-api](https://redefine-api-docs.readme.io/reference/getting-started-with-your-api) |
| saakuru.md | "Saakuru" crypto current official product support 2026 | [https://play.google.com/store/apps/details?hl=en&id=ventures.aag.metaone](https://play.google.com/store/apps/details?hl=en&id=ventures.aag.metaone)<br>[https://play.google.com/store/apps/details?hl=en_US&id=ventures.aag.metaone](https://play.google.com/store/apps/details?hl=en_US&id=ventures.aag.metaone) |
| saga.md | "Saga" crypto current official product support 2026 | [https://www.gate.com/en-eu/announcements/article/228113](https://www.gate.com/en-eu/announcements/article/228113)<br>[https://www.bitget.com/asia/support/articles/12560603895538](https://www.bitget.com/asia/support/articles/12560603895538) |
| skynet-security.md | "Skynet Security" "skynet.security" |  |
| solanafm.md | "SolanaFM" crypto current official product support 2026 | [https://docs.solana.fm/](https://docs.solana.fm/)<br>[https://smithii.io/en/dictionary/solanafm/](https://smithii.io/en/dictionary/solanafm/) |
| spectral-syntax.md | "Spectral" "The Grid" "Syntax" transition | [https://mobile.twstalker.com/Spectral_Labs](https://mobile.twstalker.com/Spectral_Labs)<br>[https://www.btcc.com/en-AU/price/spec](https://www.btcc.com/en-AU/price/spec) |
| spheron.md | "Spheron" "SPON" "payment" official | [https://www.spheron.network/Spheron-Whitepaper.pdf](https://www.spheron.network/Spheron-Whitepaper.pdf)<br>[https://resources.cryptocompare.com/asset-management/21520/1769171872448.pdf](https://resources.cryptocompare.com/asset-management/21520/1769171872448.pdf) |
| spruceid.md | "SpruceID" crypto current official product support 2026 | [https://www.ycombinator.com/companies/spruceid](https://www.ycombinator.com/companies/spruceid)<br>[https://github.com/spruceid](https://github.com/spruceid) |
| stella.md | "Stella" "ALPHA" "LitLayer" transition official | [https://staking.stellaxyz.io/](https://staking.stellaxyz.io/)<br>[https://www.lbk.pub/price/alpha-finance](https://www.lbk.pub/price/alpha-finance) |
| swarm-markets.md | "Swarm" "dOTC" "live" 2026 | [https://docs.swarm.com/core-concepts/dotc](https://docs.swarm.com/core-concepts/dotc)<br>[https://docs.swarmx.net/b/swarm-docs/dotc-v2](https://docs.swarmx.net/b/swarm-docs/dotc-v2) |
| tableland.md | "Tableland" "Recall" "sunset" official | [https://www.linkedin.com/posts/textile.io_textile-3box-labs-merge-in-decentralized-activity-7293360878563844096-kqpa](https://www.linkedin.com/posts/textile.io_textile-3box-labs-merge-in-decentralized-activity-7293360878563844096-kqpa)<br>[https://issues.texasobserver.org/pdf/ustxtxb_obs_1970_08_21_issue.pdf](https://issues.texasobserver.org/pdf/ustxtxb_obs_1970_08_21_issue.pdf) |
| the-beacon.md | "The Beacon" crypto current official product support 2026 | [https://store.epicgames.com/p/the-beacon-faq-a39ed3?lang=en-US](https://store.epicgames.com/p/the-beacon-faq-a39ed3?lang=en-US)<br>[https://t.co/k4d1P48OVw](https://t.co/k4d1P48OVw) |
| thruster.md | "ThrusterFi" "winding down" "2025" | [https://tgchannels.org/channel/defillama_tg?first=2019&lang=all&size=30&start=1817](https://tgchannels.org/channel/defillama_tg?first=2019&lang=all&size=30&start=1817)<br>[https://www.twstalker.com/InitCapital_](https://www.twstalker.com/InitCapital_) |
| trailblaze-security.md | "Trailblaze Security" "trailblaze.security" |  |
| treasure-dao.md | "Treasure DAO" crypto current official product support 2026 | [https://crypto.com/document/crypto_asset_statement](https://crypto.com/document/crypto_asset_statement)<br>[https://treasure.lol/ai-frens-whitepaper.pdf](https://treasure.lol/ai-frens-whitepaper.pdf) |
| openlaw.md | "Tribute Labs" "ADIN" "DAO" current | [https://www.linkedin.com/company/tributelabs](https://www.linkedin.com/company/tributelabs)<br>[https://www.linkedin.com/in/clarkchan](https://www.linkedin.com/in/clarkchan) |
| vela-exchange.md | "Vela Exchange" crypto current official product support 2026 | [https://docs.vela.exchange/vela-knowledge-base](https://docs.vela.exchange/vela-knowledge-base)<br>[https://docs.vela.exchange/vela-knowledge-base/exchange/trading](https://docs.vela.exchange/vela-knowledge-base/exchange/trading) |
| verite.md | "Verite" crypto current official product support 2026 | [https://dapps.alchemy.com/dapps/verite](https://dapps.alchemy.com/dapps/verite)<br>[https://www.alchemy.com/dapps/verite](https://www.alchemy.com/dapps/verite) |
| watchpug.md | "WatchPug" "2026" "audit" official | [https://docs.arrakis.fi/text/resources/audits.html](https://docs.arrakis.fi/text/resources/audits.html)<br>[https://app.trustblock.run/auditor/watchpug](https://app.trustblock.run/auditor/watchpug) |
| web3-storage.md | "Storacha" "Fil One" "team" transition | [https://www.filone.com/about](https://www.filone.com/about)<br>[https://www.filone.com/](https://www.filone.com/) |
| youves.md | "youves" "maintenance" "2026" | [https://www.teapawt.net/jevonearth](https://www.teapawt.net/jevonearth)<br>[https://www.teapaw.org/jevonearth](https://www.teapaw.org/jevonearth) |
| zebpay.md | "ZebPay" crypto current official product support 2026 | [https://play.google.com/store/apps/details?id=zebpay.Application](https://play.google.com/store/apps/details?id=zebpay.Application)<br>[https://zebpay.com/](https://zebpay.com/) |
| zipmex.md | "Zipmex" crypto current official product support 2026 | [https://zipmex.com/help/](https://zipmex.com/help/)<br>[https://zipmex.com/docs-getting-started/](https://zipmex.com/docs-getting-started/) |
| zkfair.md | "zkFair" crypto current official product support 2026 | [https://bitmart.zendesk.com/hc/en-us/articles/21751758747291-ZKFair-ZKF](https://bitmart.zendesk.com/hc/en-us/articles/21751758747291-ZKFair-ZKF)<br>[https://github.com/ZKFair](https://github.com/ZKFair) |
| zkswap-finance.md | "zkSwap Finance" "shutting down" official | [https://cryptorank.io/price/zkswap-finance](https://cryptorank.io/price/zkswap-finance)<br>[https://cryptorank.io/price/long-2](https://cryptorank.io/price/long-2) |
