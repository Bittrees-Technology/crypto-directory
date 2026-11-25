# Primary-evidence follow-up — 25 November 2026

This is a separate proposal following **[draft PR #52](https://github.com/Bittrees-Technology/crypto-directory/pull/52)**. Its exact source base is `4c0df5eba559158fb87a5d5d148792571ad4ecde`; the PR #52 changes are prerequisites, not repeated approvals. All **140** unresolved rows received targeted official-source research. The pass added **125 distinct bounded HTTP checks**, normal-browser product observations and **41 official-profile lookups. Original link receipts from 24 November are retained with their timestamps; they were not all redundantly fetched again.

**Proposed outcome:** 17 corrected/reverified rows, seven limited corrections that remain held, six exclusions and 110 unchanged holds. That leaves **117 needs_update** rows. If this batch and its prerequisite are approved together, the unchanged 1,534 source rows contain **1,326 verified, 91 rejected and 117 needs_update** records.

The proposal changes only reviewed content and this evidence ledger. Exclusions set `verification_status: rejected` while retaining every source file and history. An ended product, an out-of-scope pivot and a whole-company closure are distinct findings. Maintenance, geoblocking, DNS/TLS failures, an acquisition, archived code or a HTTP-200 shell alone do not establish permanent closure or a functioning current product.

This is independent editorial review material, not native/MCP actions executed by raging.eth or another account, a role grant or a production release. No wallet, account, signature, subscription, recovery process, instance or transaction was created. Public service pages are evidence of the offering, not authenticated acceptance tests, financial suitability or an independent security/compliance certification. Unchanged legacy metadata is preserved without claiming every year/HQ/token field was freshly authenticated; unknown successor data remains unknown.

Source URLs and browser observations below are public project evidence only. Private session UI, personal account state and machine details are excluded. Some requested pages did not complete navigation or remained restricted; these are not treated as successful product observations. Current normal browser content can resolve a robots/HTTP challenge without bypassing a challenge. Exact fields below remain proposals until approval.

The follow-up PR is based on the PR #52 branch to keep the review diff separate. Existing CI triggers target main/surf-production; required hosted validation must run after this proposal is retargeted to main once the prerequisite merges. This draft does not enable auto-merge or a Vercel/ENS release.

## Local validation

- Source preflight and all nine source-guard regressions pass.
- All 121 directory tests pass. The site builds all 1,534 source rows across 15 categories.
- Five synthetic browser journeys pass (anonymous, submitter, editor, reviewer and admin), with no page errors. These do not claim live authenticated product tests.
- Exact source checks preserve every listing ID/body and prove 1,504 listing files unchanged from the PR #52 head. Only 30 reviewed listing files change, plus this ledger.
- Every one of the 140 researched rows appears exactly once below; generated counts reconcile to 1,326 verified, 91 rejected and 117 needs_update.
- The public ledger contains source evidence only. Private browser/session details and raw captures remain outside the repository.
- Hosted CI is pending retargeting to main after PR #52 merges; the existing CI workflow does not run for this stacked draft base. No checks or branch protections have been weakened.

## Proposed changes

### Ankr AppChain — propose correction

Source: [content/projects/ankr-appchain.md](../../../content/projects/ankr-appchain.md); original blob `f4e4a316dea97a44ac11ce6ae072a5f3328ca03f`.

Current official navigation explicitly links AppChains to Scaling Services Overview. Both pages render the actual developer service; the old appchains URL instead leads to ChainScanner. The docs root records a 23 November 2026 update. No chain or API account was provisioned.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://www.ankr.com/appchains"` | `"https://www.ankr.com/docs/"` |
| product_url | `"https://www.ankr.com/appchains"` | `"https://www.ankr.com/docs/scaling-services-overview/"` |
| description | `"Appchain and rollup tooling by Ankr."` | `"Appchain and rollup infrastructure services, including rollup-as-a-service and sidechain development."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.ankr.com/appchains](https://www.ankr.com/appchains) — 200 → [https://chainscanner.xyz/](https://chainscanner.xyz/); checked `2026-11-24T22:43:08.981741+00:00`
- [https://www.ankr.com/docs/](https://www.ankr.com/docs/) — 200; checked `2026-11-24T23:46:28.008066+00:00`
- [https://www.ankr.com/docs/scaling-services-overview/](https://www.ankr.com/docs/scaling-services-overview/) — 200; checked `2026-11-25T00:08:04.756013+00:00`

Rendered observations: [https://www.ankr.com/docs/](https://www.ankr.com/docs/) (`2026-11-24T23:50:39.937Z`); [https://www.ankr.com/docs/scaling-services-overview/](https://www.ankr.com/docs/scaling-services-overview/) (`2026-11-24T23:50:46.012Z`).

### BanklessDAO — propose partial correction keep hold

Source: [content/projects/banklessdao.md](../../../content/projects/banklessdao.md); original blob `2675bf6d7afc98ef518b462617c814ee078c5fa9`.

The official former-DAO newsletter explicitly confirms the Black Flag rebrand and intentional bankless.community redirect to this Notion portal. Correct the identity and routes, but keep needs_update: current independent governance/activity evidence beyond the older transition material is still insufficient. No obsolete Discord invitation is substituted.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"BanklessDAO"` | `"Black Flag DAO (formerly BanklessDAO)"` |
| primary_url | `"https://bankless.community"` | `"https://blackflagdao.notion.site/"` |
| product_url | `"https://bankless.community/join"` | `"https://blackflagdao.notion.site/"` |

Evidence:

- [https://bankless.community](https://bankless.community) — 200 → [https://blackflagdao.notion.site/](https://blackflagdao.notion.site/); checked `2026-11-24T22:43:11.058627+00:00`
- [https://bankless.community/join](https://bankless.community/join) — 200 → [https://blackflagdao.notion.site/](https://blackflagdao.notion.site/); checked `2026-11-24T22:43:11.070903+00:00`
- [https://banklessdao.substack.com/p/a-distinctive-black-flag-brand-black?action=share](https://banklessdao.substack.com/p/a-distinctive-black-flag-brand-black?action=share) — 200; checked `2026-11-24T23:46:28.836757+00:00`
- [https://blackflagdao.notion.site/](https://blackflagdao.notion.site/) — 200; checked `2026-11-25T00:08:05.620796+00:00`

### Bitpanda Custody — propose correction

Source: [content/projects/bitpanda-custody.md](../../../content/projects/bitpanda-custody.md); original blob `b5861c63eb3b0f51cfee3e4dbaf3912be56d399e`.

The current first-party enterprise custody page renders specific custody/governance services and links the TrustVault platform documentation, resolving the missing legacy /en/custody route. Public service availability is verified; security certification, account eligibility and actual custody execution are not independently certified here.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"Bitpanda Custody"` | `"Bitpanda Enterprise Custody"` |
| primary_url | `"https://www.bitpanda.com/en/custody"` | `"https://www.bitpanda.com/en/enterprise/products/custody"` |
| product_url | `"n/a"` | `"https://documentation.bitpandaenterprise.com/custody/"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.bitpanda.com/en/custody](https://www.bitpanda.com/en/custody) — 404; checked `2026-11-24T22:43:11.914952+00:00`
- [https://www.bitpanda.com/en/enterprise/products/custody](https://www.bitpanda.com/en/enterprise/products/custody) — 200; checked `2026-11-24T23:46:29.467539+00:00`
- [https://documentation.bitpandaenterprise.com/custody/](https://documentation.bitpandaenterprise.com/custody/) — 200; checked `2026-11-24T23:46:29.927495+00:00`

Rendered observations: [https://www.bitpanda.com/en/enterprise/products/custody](https://www.bitpanda.com/en/enterprise/products/custody) (`2026-11-24T23:46:50.938Z`).

### BYDFi — propose correction

Source: [content/projects/bydfi.md](../../../content/projects/bydfi.md); original blob `5dd425e839453bc93d0885d1f4294934298801e9`.

The official current spot-market route renders populated BTC, ETH, XRP and other USDT markets with prices and volumes. Replace the missing /trade route. No exchange account or transaction was created.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://www.bydfi.com/trade"` | `"https://www.bydfi.com/markets/crypto/spot/usdt/main"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.bydfi.com](https://www.bydfi.com) — 200; checked `2026-11-24T22:43:13.502431+00:00`
- [https://www.bydfi.com/trade](https://www.bydfi.com/trade) — 404; checked `2026-11-24T22:43:13.820229+00:00`
- [https://www.bydfi.com/markets/crypto/spot/usdt/main](https://www.bydfi.com/markets/crypto/spot/usdt/main) — 200; checked `2026-11-24T23:46:31.497940+00:00`

Rendered observations: [https://www.bydfi.com/markets/crypto/spot/usdt/main](https://www.bydfi.com/markets/crypto/spot/usdt/main) (`2026-11-24T23:56:10.335Z`).

### Canto — propose partial correction keep hold

Source: [content/projects/canto.md](../../../content/projects/canto.md); original blob `65b9e4406027609aed3aad905c701ca3035e5d5c`.

The current first-party Explore site renders the Canto ecosystem and links these docs. However, its actual Launch App/bridge link returns Cloudflare origin TLS error 525 in the browser. Correct accessible information routes while retaining needs_update; marketing and documentation do not establish an operational bridge or current chain health.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://canto.io"` | `"https://explore.canto.io/"` |
| product_url | `"https://canto.io/ecosystem"` | `"https://docs.canto.io/"` |

Evidence:

- [https://canto.io](https://canto.io) — 402; checked `2026-11-24T22:43:14.011817+00:00`
- [https://canto.io/ecosystem](https://canto.io/ecosystem) — 402; checked `2026-11-24T22:43:14.089843+00:00`
- [https://explore.canto.io/](https://explore.canto.io/) — 200; checked `2026-11-24T23:46:33.554825+00:00`
- [https://app.canto.io/bridge](https://app.canto.io/bridge) — 525; checked `2026-11-25T00:08:04.757306+00:00`
- [https://docs.canto.io/](https://docs.canto.io/) — 200; checked `2026-11-24T22:55:21.960387+00:00`

Rendered observations: [https://explore.canto.io/](https://explore.canto.io/) (`2026-11-24T23:47:05.711Z`); [https://app.canto.io/bridge](https://app.canto.io/bridge) (`2026-11-24T23:48:40.041Z`).

### ChainPatrol — propose correction

Source: [content/projects/chainpatrol.md](../../../content/projects/chainpatrol.md); original blob `8d0ab1ac1e186a88de67638e89aa41a12205d8da`.

The original .io site redirects to .com. Current rendered service documentation describes crypto-customer phishing protection and wallet/browser distribution, including MetaMask and Coinbase integrations. This establishes the current product and Web3 use case without a dashboard login or security endorsement.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://chainpatrol.io"` | `"https://chainpatrol.com/"` |
| product_url | `"https://chainpatrol.io/platform"` | `"https://chainpatrol.com/docs/getting-started/what-we-do/introduction"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://chainpatrol.io](https://chainpatrol.io) — 200 → [https://chainpatrol.com/](https://chainpatrol.com/); checked `2026-11-24T22:43:15.080884+00:00`
- [https://chainpatrol.io/platform](https://chainpatrol.io/platform) — 404 → [https://chainpatrol.com/platform](https://chainpatrol.com/platform); checked `2026-11-24T22:43:15.709009+00:00`
- [https://chainpatrol.com/](https://chainpatrol.com/) — 200; checked `2026-11-24T23:46:33.873526+00:00`
- [https://chainpatrol.com/docs/getting-started/what-we-do/introduction](https://chainpatrol.com/docs/getting-started/what-we-do/introduction) — 200; checked `2026-11-25T00:08:04.757197+00:00`
- [https://chainpatrol.com/docs](https://chainpatrol.com/docs) — Official source reference or rendered observation; no separate HTTP receipt.

Rendered observations: [https://chainpatrol.com/](https://chainpatrol.com/) (`2026-11-24T23:51:33.209Z`); [https://chainpatrol.com/docs/getting-started/what-we-do/introduction](https://chainpatrol.com/docs/getting-started/what-we-do/introduction) (`2026-11-24T23:51:44.172Z`).

### Fluence — propose correction

Source: [content/projects/fluence.md](../../../content/projects/fluence.md); original blob `2b13e97ab5af0e71ae47d735b11f2203194e47fa`.

The official Q3 2026 DAO report links current Fluence cloud work and FLT network activity. The current website renders Web3/node and compute services and directly links the working console sign-in page. The obsolete developer route is replaced. No account, compute instance or billing action was created.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://fluence.network"` | `"https://fluence.ai/"` |
| product_url | `"https://fluence.network/developers"` | `"https://console.fluence.network/"` |
| description | `"Decentralized compute protocol for resilient applications."` | `"Decentralized compute project offering GPU and CPU cloud infrastructure through a multi-provider console and API."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://fluence.network](https://fluence.network) — 200 → [https://fluence.ai/](https://fluence.ai/); checked `2026-11-24T22:43:22.708926+00:00`
- [https://fluence.network/developers](https://fluence.network/developers) — 404 → [https://fluence.ai/developers](https://fluence.ai/developers); checked `2026-11-24T22:43:23.226670+00:00`
- [https://gov.fluence.network/t/q3-2026-fluence-dao-report/632](https://gov.fluence.network/t/q3-2026-fluence-dao-report/632) — 200; checked `2026-11-24T23:46:34.722045+00:00`
- [https://console.fluence.network/](https://console.fluence.network/) — 200 → [https://auth.fluence.network/auth/v1/oidc/authorize?response_type=code&client_id=fluence-cloud-mainnet&redirect_uri=https%3A%2F%2Fconsole.fluence.ai%2Fapi%2Fauth%2Fcallback&scope=openid+email+profile&state=UFNSIHpV4an-PIWMTnT6sGXYU6r5AarSl-jVdENNhY4&code_challenge=j2_pmRZ_lJoNgKWLN6DD3ctC3HkiksuZN_7QgLSIe5s&code_challenge_method=S256&app_return_uri=https%3A%2F%2Fconsole.fluence.ai](https://auth.fluence.network/auth/v1/oidc/authorize?response_type=code&client_id=fluence-cloud-mainnet&redirect_uri=https%3A%2F%2Fconsole.fluence.ai%2Fapi%2Fauth%2Fcallback&scope=openid+email+profile&state=UFNSIHpV4an-PIWMTnT6sGXYU6r5AarSl-jVdENNhY4&code_challenge=j2_pmRZ_lJoNgKWLN6DD3ctC3HkiksuZN_7QgLSIe5s&code_challenge_method=S256&app_return_uri=https%3A%2F%2Fconsole.fluence.ai); checked `2026-11-24T23:46:34.895289+00:00`
- [https://fluence.ai/](https://fluence.ai/) — 200; checked `2026-11-25T00:08:05.581043+00:00`

Rendered observations: [https://fluence.ai/](https://fluence.ai/) (`2026-11-25T00:07:15.043Z`).

### Frigg — propose correction

Source: [content/projects/frigg-eco.md](../../../content/projects/frigg-eco.md); original blob `1de5b2f73bd4c3d6026b05342481c39388bab969`.

The current first-party FAQ explicitly states that investments are tokenized by default and represent claims on renewable-energy assets, resolving the former onchain-scope concern. The current transaction service page and existing project platform are public. This records the provider offering, not independently validated compliance, returns or executed token issuance; unknown chains and founding/HQ fields remain unknown.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://app.frigg.eco/"` | `"https://www.frigg.eco/product/transactions"` |
| description | `"Platform for renewable energy project analysis, fundraising and investment administration."` | `"Renewable-energy financing platform offering tokenized debt and equity transactions and investment administration."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.frigg.eco/](https://www.frigg.eco/) — 200; checked `2026-11-24T22:43:24.366356+00:00`
- [https://app.frigg.eco/](https://app.frigg.eco/) — 200; checked `2026-11-24T22:43:24.494488+00:00`
- [https://www.frigg.eco/faq](https://www.frigg.eco/faq) — 200; checked `2026-11-25T00:08:05.519214+00:00`
- [https://www.frigg.eco/insights/the-first-digital-green-bond](https://www.frigg.eco/insights/the-first-digital-green-bond) — 200; checked `2026-11-24T23:46:35.105601+00:00`
- [https://www.frigg.eco/product/transactions](https://www.frigg.eco/product/transactions) — 200; checked `2026-11-25T00:08:05.327047+00:00`

### Helika — propose exclusion

Source: [content/projects/helika.md](../../../content/projects/helika.md); original blob `5683b56238c89517b0df91dc137d60e7c8dee7ab`.

The current first-party FAQ says the company now focuses entirely on Helika Evolve AI-character infrastructure for brands, sports, entertainment and games. This supports exclusion of the obsolete Web3 game-analytics profile under the crypto/Web3 scope rule; it is not a company shutdown claim or automatic inclusion as a general AI agent.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.helika.io](https://www.helika.io) — 200; checked `2026-11-24T22:43:26.252459+00:00`
- [https://www.helika.io/](https://www.helika.io/) — Official source reference or rendered observation; no separate HTTP receipt.
- [https://www.helika.io/about-us/](https://www.helika.io/about-us/) — 200; checked `2026-11-24T23:46:35.926348+00:00`
- [https://www.helika.io/technology/](https://www.helika.io/technology/) — 200; checked `2026-11-24T23:09:12.723706+00:00`

### HMX — propose partial correction keep hold

Source: [content/projects/hmx.md](../../../content/projects/hmx.md); original blob `6983e3758fa690714f18655f500f533a70d2c462`.

The original HMX official profile explicitly identifies the migration and links the DESK account and Linktree. That official Linktree identifies Base and the new website/docs. The website redirects to a blank CLOB shell and docs DNS fails. Correct documented identity/site metadata, unset the unverified current token and dead legacy app link, but keep needs_update; neither trading nor agent execution is claimed live.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"HMX"` | `"DESK (formerly HMX)"` |
| primary_url | `"https://hmx.org"` | `"https://desk.exchange/"` |
| product_url | `"https://app.hmx.org"` | `"n/a"` |
| ecosystem | `["Arbitrum"]` | `["Base"]` |
| token | `"HMX"` | `"n/a"` |
| twitter | `"https://x.com/HMXorg"` | `"https://x.com/TradeOnDESK"` |
| description | `"Decentralized perpetual exchange protocol and vault ecosystem."` | `"Perpetual trading infrastructure for traders and Web3 agents on Base, migrated from HMX; current product access remains unverified."` |

Evidence:

- [https://hmx.org](https://hmx.org) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:26.577788+00:00`
- [https://app.hmx.org](https://app.hmx.org) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:26.658447+00:00`
- [https://x.com/HMXorg](https://x.com/HMXorg) — Official source reference or rendered observation; no separate HTTP receipt.
- [https://linktr.ee/tradeondesk](https://linktr.ee/tradeondesk) — Official source reference or rendered observation; no separate HTTP receipt.
- [https://desk.exchange/](https://desk.exchange/) — 200 → [https://clob.desk.exchange/](https://clob.desk.exchange/); checked `2026-11-25T00:20:34.616690+00:00`
- [https://docs.desk.exchange/](https://docs.desk.exchange/) — Official source reference or rendered observation; no separate HTTP receipt.

Rendered observations: [https://linktr.ee/tradeondesk](https://linktr.ee/tradeondesk) (`2026-11-25T00:13:30.333Z`); [https://clob.desk.exchange/](https://clob.desk.exchange/) (`2026-11-25T00:13:44.610Z`); [https://x.com/HMXorg](https://x.com/HMXorg) (`2026-11-25T00:13:12.746Z`).

### ICON — propose partial correction keep hold

Source: [content/projects/icon.md](../../../content/projects/icon.md); original blob `98aa9c22555316febd5fa1979993588be3a86140`.

A further official Foundation notice confirms that rewards and emissions already ended, adding present-state evidence to the future halt recorded in PR #52. Keep needs_update and preserve the announced future halt date; economic shutdown is not an assertion that every block already stopped.

| Field | Before | Proposed |
| --- | --- | --- |
| description | `"Blockchain network in a planned migration and wind-down, with permanent chain shutdown announced for 31 December 2026."` | `"Blockchain network in economic shutdown after staking rewards and token emissions ended; permanent chain halt is announced for 31 December 2026."` |

Evidence:

- [https://icon.community](https://icon.community) — 200; checked `2026-11-24T22:43:26.671288+00:00`
- [https://icon.community/ecosystem](https://icon.community/ecosystem) — 200 → [https://icon.community/ecosystem/](https://icon.community/ecosystem/); checked `2026-11-24T22:43:26.740978+00:00`
- [https://www.icon.foundation/blog/2026/icon-network-economic-shutdown](https://www.icon.foundation/blog/2026/icon-network-economic-shutdown) — 200; checked `2026-11-24T23:46:36.213736+00:00`

### Kaito — propose correction

Source: [content/projects/kaito.md](../../../content/projects/kaito.md); original blob `349494c9a509f743d8e881d0a5eb3d4cd59db35c`.

The current Kaito Pro page renders a specific Web3 research product, plans and API access under the original kaito.ai domain family. This resolves the missing /platform route without substituting the unrelated kaito.io payments company. No subscription or account was created.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://kaito.ai/platform"` | `"https://www.pro.kaito.ai/pricing"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://kaito.ai](https://kaito.ai) — 403 (access challenge); checked `2026-11-24T22:43:27.918453+00:00`
- [https://kaito.ai/platform](https://kaito.ai/platform) — 403 (access challenge); checked `2026-11-24T22:43:28.072340+00:00`
- [https://www.pro.kaito.ai/portal](https://www.pro.kaito.ai/portal) — 200; checked `2026-11-24T23:46:36.532307+00:00`
- [https://www.pro.kaito.ai/pricing](https://www.pro.kaito.ai/pricing) — 200; checked `2026-11-25T00:08:04.757412+00:00`

Rendered observations: [https://www.pro.kaito.ai/pricing](https://www.pro.kaito.ai/pricing) (`2026-11-24T23:59:24.716Z`).

### Kinto — propose exclusion

Source: [content/projects/kinto.md](../../../content/projects/kinto.md); original blob `49d73644b7b743f1bed11d0e82932551649c2730`.

The first-party Kinto announcement explicitly begins an orderly shutdown, sets the ordinary withdrawal deadline in September 2025 and explains the residual Ethereum claims process. Exclude the retired L2 profile; residual claims are not an operating financial network. No claim, recovery or transaction was performed.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.kinto.xyz](https://www.kinto.xyz) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'www.kinto.xyz'. (_ssl.c:1081)>; checked `2026-11-24T22:43:28.447985+00:00`
- [https://www.kinto.xyz/build](https://www.kinto.xyz/build) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'www.kinto.xyz'. (_ssl.c:1081)>; checked `2026-11-24T22:43:28.511116+00:00`
- [https://medium.com/mamori-finance/kinto-is-shutting-down-fca59862f0e7](https://medium.com/mamori-finance/kinto-is-shutting-down-fca59862f0e7) — 200; checked `2026-11-25T00:08:07.495624+00:00`

### Leap Wallet — propose exclusion

Source: [content/projects/leap-wallet.md](../../../content/projects/leap-wallet.md); original blob `737e88b571604a39516e4b4406c348f4f99b3da6`.

The official original-account sunset post was read directly: it covers Leap extension/mobile apps, Compass, Leap WebApp, Swapfast, the validator and Snaps after 28 May 2026. This resolves the earlier concern that only Compass was retiring. Exclude the wallet-suite profile, not the onchain assets of its users.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.leapwallet.io](https://www.leapwallet.io) — 404; checked `2026-11-24T22:43:29.012000+00:00`
- [https://www.leapwallet.io/download](https://www.leapwallet.io/download) — 404; checked `2026-11-24T22:43:29.016382+00:00`
- [https://x.com/leap_wallet/status/2039729267685376026](https://x.com/leap_wallet/status/2039729267685376026) — 200; checked `2026-11-25T00:08:07.714686+00:00`
- [https://docs.leapwallet.io/introduction](https://docs.leapwallet.io/introduction) — 200; checked `2026-11-24T23:46:36.982981+00:00`
- [https://developer.leapwallet.io/](https://developer.leapwallet.io/) — 200; checked `2026-11-24T23:46:37.194151+00:00`
- [https://www.theblock.co/news/business/2026-04-03-cosmos-ecosystems-leap-wallet-is-shutting-down-396325](https://www.theblock.co/news/business/2026-04-03-cosmos-ecosystems-leap-wallet-is-shutting-down-396325) — 200; checked `2026-11-25T00:08:07.506184+00:00`

Rendered observations: [https://x.com/leap_wallet/status/2039729267685376026](https://x.com/leap_wallet/status/2039729267685376026) (`2026-11-25T00:09:16.352Z`).

### LogX — propose exclusion

Source: [content/projects/logx.md](../../../content/projects/logx.md); original blob `7d4f2d993ee4a77cf2fab7311c8a47d5564ee47c`.

The original official application explicitly says LogX OG concluded and points to V2. That official successor currently displays an evolution/relaunch notice for a new institutional stablecoin offering rather than a live trading product. Exclude the obsolete perpetual-trading profile; this does not declare the organization bankrupt or assert user funds are inaccessible.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.logx.trade](https://www.logx.trade) — 200 → [https://www.logx.network/](https://www.logx.network/); checked `2026-11-24T22:43:29.562113+00:00`
- [https://www.logx.trade/trade](https://www.logx.trade/trade) — 404; checked `2026-11-24T22:43:29.836403+00:00`
- [https://app.logx.trade/](https://app.logx.trade/) — 200; checked `2026-11-24T23:46:37.258817+00:00`
- [https://app.logx.network/](https://app.logx.network/) — 200; checked `2026-11-25T00:08:04.757525+00:00`

Rendered observations: [https://app.logx.trade/](https://app.logx.trade/) (`2026-11-24T23:59:48.400Z`); [https://app.logx.trade/](https://app.logx.trade/) (`2026-11-25T00:00:18.188Z`); [https://app.logx.network/](https://app.logx.network/) (`2026-11-25T00:01:26.942Z`).

### Mercado Bitcoin — propose correction

Source: [content/projects/mercado-bitcoin.md](../../../content/projects/mercado-bitcoin.md); original blob `7ffa6e5fc84136ecaf58f1d878738a75b0bef91e`.

The current official Portuguese app page renders digital-asset trading features and links the Mercado Bitcoin Apple/Google listings. Replace the missing legacy trade route. A separate /criptomoedas page currently reports unavailable service and is not selected; the app landing page does not establish authenticated trading availability or investment suitability.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://www.mercadobitcoin.com.br/trade"` | `"https://www.mercadobitcoin.com.br/app"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.mercadobitcoin.com.br](https://www.mercadobitcoin.com.br) — 200; checked `2026-11-24T22:43:31.338236+00:00`
- [https://www.mercadobitcoin.com.br/trade](https://www.mercadobitcoin.com.br/trade) — 404; checked `2026-11-24T22:43:31.467616+00:00`
- [https://www.mercadobitcoin.com.br/criptomoedas/](https://www.mercadobitcoin.com.br/criptomoedas/) — 200 → [https://www.mercadobitcoin.com.br/servico-indisponivel](https://www.mercadobitcoin.com.br/servico-indisponivel); checked `2026-11-24T23:46:37.527451+00:00`
- [https://www.mercadobitcoin.com.br/app](https://www.mercadobitcoin.com.br/app) — 200; checked `2026-11-24T23:46:37.557505+00:00`

Rendered observations: [https://www.mercadobitcoin.com.br/app](https://www.mercadobitcoin.com.br/app) (`2026-11-24T23:55:45.974Z`).

### Metaco — propose correction

Source: [content/projects/metaco.md](../../../content/projects/metaco.md); original blob `8d198da4df758dd6f711728093c2cd17fcb5a0c1`.

Official Ripple release notes explicitly rebrand Metaco/Harmonize UI and app to Ripple Custody. The current rendered Vault documentation identifies v1.43 LTS with custody, governance, deployment and API guides. This follows the documented product lineage, not a new unrelated entity. Original Metaco year/HQ remain historical entity metadata rather than Ripple founding data; no custody or signing action was performed.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"Metaco"` | `"Metaco / Ripple Custody Vault"` |
| primary_url | `"https://metaco.com"` | `"https://docs.ripple.com/products/custody/"` |
| product_url | `"https://metaco.com/platform"` | `"https://docs.ripple.com/products/custody/overview/what-is-ripple-custody"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://metaco.com](https://metaco.com) — <urlopen error [Errno 54] Connection reset by peer>; checked `2026-11-24T22:43:31.632437+00:00`
- [https://metaco.com/platform](https://metaco.com/platform) — <urlopen error [Errno 54] Connection reset by peer>; checked `2026-11-24T22:43:31.855001+00:00`
- [https://docs.ripple.com/products/custody/](https://docs.ripple.com/products/custody/) — 200 → [https://docs.ripple.com/products/custody](https://docs.ripple.com/products/custody); checked `2026-11-24T23:46:38.275997+00:00`
- [https://docs.ripple.com/products/custody/overview/what-is-ripple-custody](https://docs.ripple.com/products/custody/overview/what-is-ripple-custody) — 200; checked `2026-11-25T00:08:04.757588+00:00`
- [https://docs.ripple.com/products/custody/support/change-history/v113](https://docs.ripple.com/products/custody/support/change-history/v113) — 200; checked `2026-11-25T00:08:05.001792+00:00`

Rendered observations: [https://docs.ripple.com/products/custody](https://docs.ripple.com/products/custody) (`2026-11-24T23:58:00.892Z`).

### Midas — propose correction

Source: [content/projects/midas.md](../../../content/projects/midas.md); original blob `432c006f7d3759af6d851ec941567bc410290381`.

The current browser renders the existing products route with live catalogue entries, populated product TVL, network information and a separately labelled retired-products section. The earlier HTTP access challenge is not treated as shutdown; successful normal browser access resolves the product hold. No yield or risk claim is endorsed and no wallet was connected.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://midas.app](https://midas.app) — 403 (access challenge); checked `2026-11-24T22:43:32.693896+00:00`
- [https://midas.app/products](https://midas.app/products) — 403 (access challenge); checked `2026-11-25T00:08:06.386496+00:00`
- [https://midas.app/mm1usd](https://midas.app/mm1usd) — 403 (access challenge); checked `2026-11-24T23:46:39.314024+00:00`
- [https://midas.app/liquidity](https://midas.app/liquidity) — 403 (access challenge); checked `2026-11-24T23:46:39.474135+00:00`
- [https://midas.app/products](https://midas.app/products) — 403 (access challenge); checked `2026-11-25T00:08:06.386496+00:00`

Rendered observations: [https://midas.app/liquidity](https://midas.app/liquidity) (`2026-11-24T23:59:34.207Z`); [https://midas.app/products](https://midas.app/products) (`2026-11-24T23:59:39.773Z`).

### Nyan Heroes — propose exclusion

Source: [content/projects/nyan-heroes.md](../../../content/projects/nyan-heroes.md); original blob `18decf4caa94022961fa6b111fdd44d28fa4f329`.

The developer original-account announcement was read directly and explicitly says the studio could not fund completion and the game is closing. Firsthand CEO reporting corroborates it, and the old Steam product redirects to the generic store. Exclude the retired game profile without asserting the token/NFTs cease to exist or accepting a purported recovery offer.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://nyanheroes.com](https://nyanheroes.com) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:36.347216+00:00`
- [https://nyanheroes.com/game](https://nyanheroes.com/game) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:36.422221+00:00`
- [https://x.com/nyanheroes/status/1923349230636421330](https://x.com/nyanheroes/status/1923349230636421330) — 200; checked `2026-11-25T00:08:07.850963+00:00`
- [https://decrypt.co/320501/solana-game-nyan-heroes-shuts-down](https://decrypt.co/320501/solana-game-nyan-heroes-shuts-down) — 200; checked `2026-11-25T00:08:07.835189+00:00`
- [https://store.steampowered.com/app/2767820/Nyan_Heroes/](https://store.steampowered.com/app/2767820/Nyan_Heroes/) — 200 → [https://store.steampowered.com/](https://store.steampowered.com/); checked `2026-11-25T00:08:08.115476+00:00`

Rendered observations: [https://x.com/nyanheroes/status/1923349230636421330](https://x.com/nyanheroes/status/1923349230636421330) (`2026-11-25T00:09:07.676Z`).

### OpenLaw — propose partial correction keep hold

Source: [content/projects/openlaw.md](../../../content/projects/openlaw.md); original blob `691d054de49ee071380e56ea0efe96fe28aa5ee2`.

The official rebrand announcement and current company site explicitly establish continuity from OpenLaw and describe current ADIN work. Correct the company identity/site but retain needs_update: the old product URL is unavailable, core framework repos are archived, and a current supported onchain product route was not established. Do not call the still-operating company shut down or automatically include a general AI offering.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"OpenLaw"` | `"Tribute Labs (formerly OpenLaw)"` |
| primary_url | `"https://openlaw.io"` | `"https://tributelabs.xyz/"` |
| description | `"Legal and DAO tooling for contract automation."` | `"DAO infrastructure company behind OpenLaw and Tribute frameworks, now developing autonomous venture tools."` |

Evidence:

- [https://openlaw.io](https://openlaw.io) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:37.802272+00:00`
- [https://openlaw.io/products](https://openlaw.io/products) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:37.880557+00:00`
- [https://paragraph.com/@tribute-labs/introducing-tribute-labs](https://paragraph.com/@tribute-labs/introducing-tribute-labs) — 200; checked `2026-11-25T00:08:06.753220+00:00`
- [https://tributelabs.xyz/](https://tributelabs.xyz/) — 200; checked `2026-11-25T00:08:06.767909+00:00`
- [https://github.com/openlawteam/tribute-contracts](https://github.com/openlawteam/tribute-contracts) — 200; checked `2026-11-25T00:08:06.814600+00:00`
- [https://github.com/openlawteam/openlaw-core](https://github.com/openlawteam/openlaw-core) — 200; checked `2026-11-25T00:08:06.955300+00:00`

### Persistence Core-1 — propose correction

Source: [content/projects/persistence.md](../../../content/projects/persistence.md); original blob `4acb1302e037da9d872e0c50793c1d5fe12115ce`.

The official history page explicitly separates its newer AI business from the continuing Core-1 chain and links its DEX. The rendered DEX pools page contains five populated pools with liquidity and trading-volume data. Replace generic documentation with that current product; do not reclassify the legacy network as a general AI service.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://docs.persistence.one/"` | `"https://app.persistence.one/pools"` |
| description | `"Proof-of-stake blockchain network supporting XPRT staking, governance and digital asset applications."` | `"Persistence Core-1 blockchain ecosystem with XPRT governance and the Persistence DEX."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://persistence.one/history/](https://persistence.one/history/) — 200; checked `2026-11-24T23:46:40.850438+00:00`
- [https://docs.persistence.one/](https://docs.persistence.one/) — 200; checked `2026-11-24T22:43:39.260674+00:00`
- [https://persistence.one/history/](https://persistence.one/history/) — 200; checked `2026-11-24T23:46:40.850438+00:00`
- [https://app.persistence.one/](https://app.persistence.one/) — 200; checked `2026-11-25T00:08:05.756695+00:00`
- [https://app.persistence.one/pools](https://app.persistence.one/pools) — 200; checked `2026-11-25T00:08:05.903850+00:00`

Rendered observations: [https://app.persistence.one/?from=ibc%2FC8A74ABBE2AF892E15680D916A7C22130585CE5704F9B17A10F184A90D53BECA&to=uxprt](https://app.persistence.one/?from=ibc%2FC8A74ABBE2AF892E15680D916A7C22130585CE5704F9B17A10F184A90D53BECA&to=uxprt) (`2026-11-24T23:53:37.751Z`); [https://app.persistence.one/pools](https://app.persistence.one/pools) (`2026-11-24T23:53:44.126Z`).

### Quasar — propose exclusion

Source: [content/projects/quasar.md](../../../content/projects/quasar.md); original blob `2a6e4f286c66497c422f85fb60b3b36724dd04c0`.

The original official Quasar profile explicitly says its Cosmos yield aggregator shut down in April 2025 and the token/team migrated to Tower. The old application is unavailable. Exclude the legacy yield profile without claiming Tower also shut down or silently transferring old metadata to an unverified successor.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://quasar.fi](https://quasar.fi) — 200; checked `2026-11-24T22:43:41.917088+00:00`
- [https://app.quasar.fi](https://app.quasar.fi) — 200; checked `2026-11-24T22:43:41.924770+00:00`
- [https://x.com/quasarfi](https://x.com/quasarfi) — Official source reference or rendered observation; no separate HTTP receipt.
- [https://quasar.fi](https://quasar.fi) — 200; checked `2026-11-24T22:43:41.917088+00:00`

Rendered observations: [https://x.com/quasarfi](https://x.com/quasarfi) (`2026-11-25T00:15:26.991Z`).

### Solend — propose correction

Source: [content/projects/solend.md](../../../content/projects/solend.md); original blob `3c6a82b74f8952f15a598c13a87d617d8dcf7853`.

The issuer rebrand announcement and current official docs explicitly identify Save as formerly Solend. After loading, the current lending interface displays named pools and populated TVL. Replace the missing Solend dashboard, retaining legacy token/year metadata without assigning an unverified new token. No deposit or wallet connection was made.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"Solend"` | `"Save (formerly Solend)"` |
| primary_url | `"https://solend.fi"` | `"https://save.finance/"` |
| product_url | `"https://solend.fi/dashboard"` | `"https://save.finance/"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://solend.fi](https://solend.fi) — 503; checked `2026-11-24T22:43:45.263863+00:00`
- [https://solend.fi/dashboard](https://solend.fi/dashboard) — 503; checked `2026-11-24T22:43:45.324013+00:00`
- [https://blog.save.finance/solend-is-now-save-c8a204ce5ea5](https://blog.save.finance/solend-is-now-save-c8a204ce5ea5) — 200 → [https://blog.save.finance/solend-is-now-save-c8a204ce5ea5?gi=ed0e4fbe5383](https://blog.save.finance/solend-is-now-save-c8a204ce5ea5?gi=ed0e4fbe5383); checked `2026-11-24T23:46:43.576056+00:00`
- [https://save.finance/about](https://save.finance/about) — 200; checked `2026-11-25T00:08:05.999531+00:00`
- [https://docs.save.finance/](https://docs.save.finance/) — 200; checked `2026-11-24T23:46:44.128843+00:00`
- [https://save.finance/](https://save.finance/) — 200; checked `2026-11-25T00:08:05.970205+00:00`

Rendered observations: [https://save.finance/](https://save.finance/) (`2026-11-24T23:53:53.909Z`); [https://save.finance/](https://save.finance/) (`2026-11-24T23:54:27.174Z`).

### SpruceID — propose partial correction keep hold

Source: [content/projects/spruceid.md](../../../content/projects/spruceid.md); original blob `37528f0807e0b98e8e398982500c24ec53bb5d58`.

Official SpruceID developer material identifies SIWE, and its public non-archived repository replaces the missing generic /products path. Repository metadata last reports a May 2025 push. Keep needs_update: accessible legacy code does not by itself establish an actively supported current crypto offering from the government-focused website. No library was installed or executed.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://www.spruceid.com/products"` | `"https://github.com/spruceid/siwe"` |
| description | `"Identity infrastructure provider for decentralized credentials and sign-in flows."` | `"Digital identity provider and publisher of Sign-In with Ethereum and verifiable-credential libraries; the current company site focuses on government identity."` |

Evidence:

- [https://www.spruceid.com](https://www.spruceid.com) — 200 → [https://spruceid.com/](https://spruceid.com/); checked `2026-11-24T22:43:46.353372+00:00`
- [https://www.spruceid.com/products](https://www.spruceid.com/products) — 404 → [https://spruceid.com/products](https://spruceid.com/products); checked `2026-11-24T22:43:46.502893+00:00`
- [https://blog.spruceid.com/spruceid-developer-update-35/](https://blog.spruceid.com/spruceid-developer-update-35/) — 200; checked `2026-11-24T23:46:44.579036+00:00`
- [https://github.com/spruceid/siwe](https://github.com/spruceid/siwe) — 200; checked `2026-11-25T00:20:34.616841+00:00`
- [https://x.com/spruceid](https://x.com/spruceid) — Official source reference or rendered observation; no separate HTTP receipt.

Rendered observations: [https://x.com/spruceid](https://x.com/spruceid) (`2026-11-25T00:15:46.412Z`).

### The Sandbox — propose correction

Source: [content/projects/the-sandbox.md](../../../content/projects/the-sandbox.md); original blob `fe5a89b13b090d093c9669061c3e13027891815c`.

The current official Game Maker 0.11 page renders product features, creation tools, documentation and existing creator experiences. This resolves the old generic creation route/access concern without downloading software, accepting an agreement or connecting a wallet.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://www.sandbox.game/en/create"` | `"https://www.sandbox.game/en/create/game-maker/"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.sandbox.game](https://www.sandbox.game) — 403 (access challenge); checked `2026-11-24T22:43:48.889213+00:00`
- [https://www.sandbox.game/en/create](https://www.sandbox.game/en/create) — 403 (access challenge); checked `2026-11-24T22:43:49.035460+00:00`
- [https://www.sandbox.game/en/create/game-maker/](https://www.sandbox.game/en/create/game-maker/) — 403 (access challenge); checked `2026-11-24T23:46:45.182213+00:00`
- [https://docs.sandbox.game/en/creator/game-maker](https://docs.sandbox.game/en/creator/game-maker) — 200 → [https://docs.sandbox.game/en/creator/game-maker/create-experiences](https://docs.sandbox.game/en/creator/game-maker/create-experiences); checked `2026-11-24T23:46:45.265686+00:00`

Rendered observations: [https://www.sandbox.game/en/create/game-maker/](https://www.sandbox.game/en/create/game-maker/) (`2026-11-24T23:55:25.377Z`).

### TokenLogic — propose correction

Source: [content/projects/tokenlogic.md](../../../content/projects/tokenlogic.md); original blob `0bba866643496657308ae8a6a006b273e0e77dd7`.

The official Analytics navigation links this exact Aave analytics site. Its rendered dashboard contains populated protocol, GHO, treasury, revenue and staking figures, plus an API catalogue. Replace the missing /research route; no private data or authenticated research was requested.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://tokenlogic.xyz"` | `"https://www.tokenlogic.xyz/"` |
| product_url | `"https://tokenlogic.xyz/research"` | `"https://aave.tokenlogic.xyz/"` |
| description | `"Tokenomics and treasury analytics for crypto organizations."` | `"DeFi treasury and protocol analytics, including public Aave, GHO, financials and staking dashboards."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://tokenlogic.xyz](https://tokenlogic.xyz) — 200 → [https://www.tokenlogic.xyz/](https://www.tokenlogic.xyz/); checked `2026-11-24T22:43:49.119546+00:00`
- [https://tokenlogic.xyz/research](https://tokenlogic.xyz/research) — 404 → [https://www.tokenlogic.xyz/research](https://www.tokenlogic.xyz/research); checked `2026-11-24T22:43:49.187544+00:00`
- [https://www.tokenlogic.xyz/](https://www.tokenlogic.xyz/) — 200; checked `2026-11-24T23:46:45.369743+00:00`
- [https://www.tokenlogic.xyz/analytics](https://www.tokenlogic.xyz/analytics) — 200; checked `2026-11-25T00:08:06.474845+00:00`
- [https://aave.tokenlogic.xyz/](https://aave.tokenlogic.xyz/) — 200; checked `2026-11-25T00:08:06.530396+00:00`

Rendered observations: [https://www.tokenlogic.xyz/](https://www.tokenlogic.xyz/) (`2026-11-24T23:51:50.155Z`); [https://www.tokenlogic.xyz/analytics](https://www.tokenlogic.xyz/analytics) (`2026-11-24T23:52:01.172Z`); [https://aave.tokenlogic.xyz/](https://aave.tokenlogic.xyz/) (`2026-11-24T23:52:19.812Z`); [https://aave.tokenlogic.xyz/](https://aave.tokenlogic.xyz/) (`2026-11-25T00:01:27.079Z`).

### Trader Joe — propose partial correction keep hold

Source: [content/projects/trader-joe.md](../../../content/projects/trader-joe.md); original blob `512469f9b760923c1c4859224f1668299e7f8762`.

The issuer newsletter explicitly confirms the LFJ rebrand; both old domains redirect to LFJ and current developer docs describe its DEX. Correct the name and canonical swap route, but keep needs_update: the observed swap interface remained at asset/network loading and did not establish a functioning current market. No challenge was bypassed or swap attempted.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"Trader Joe"` | `"LFJ (formerly Trader Joe)"` |
| primary_url | `"https://www.traderjoexyz.com"` | `"https://lfj.gg/"` |
| product_url | `"https://traderjoexyz.com/avalanche/trade"` | `"https://lfj.gg/swap"` |

Evidence:

- [https://www.traderjoexyz.com](https://www.traderjoexyz.com) — 403 (access challenge) → [https://lfj.gg/?utm_source=TJdomain&utm_medium=referral&utm_campaign=redirect](https://lfj.gg/?utm_source=TJdomain&utm_medium=referral&utm_campaign=redirect); checked `2026-11-24T22:43:49.522312+00:00`
- [https://traderjoexyz.com/avalanche/trade](https://traderjoexyz.com/avalanche/trade) — 403 (access challenge) → [https://lfj.gg/avalanche/trade?utm_source=TJdomain&utm_medium=referral&utm_campaign=redirect](https://lfj.gg/avalanche/trade?utm_source=TJdomain&utm_medium=referral&utm_campaign=redirect); checked `2026-11-24T22:43:49.557850+00:00`
- [https://docs.lfj.gg/additional-information/brand-and-ecosystem-information/links_to_lfj_legacy_pages_11391553](https://docs.lfj.gg/additional-information/brand-and-ecosystem-information/links_to_lfj_legacy_pages_11391553) — 200; checked `2026-11-24T23:46:45.424370+00:00`
- [https://lfj.gg/](https://lfj.gg/) — 200; checked `2026-11-25T00:08:06.613921+00:00`
- [https://joecontent.substack.com/s/defi](https://joecontent.substack.com/s/defi) — 200; checked `2026-11-25T00:08:06.741392+00:00`
- [https://lfj.gg/swap](https://lfj.gg/swap) — 403 (access challenge); checked `2026-11-25T00:20:34.615465+00:00`

Rendered observations: [https://lfj.gg/swap](https://lfj.gg/swap) (`2026-11-24T23:57:36.634Z`).

### VeChain Foundation — propose correction

Source: [content/projects/vechain-foundation.md](../../../content/projects/vechain-foundation.md); original blob `590e82e62a213b0cd712b5129f4371944618f766`.

Current first-party product navigation identifies VeChainThor, VeWorld, StarGate and VeBetter, and the official App Hub renders a populated onchain application catalogue. Replace the missing ecosystem route. Listed apps are not individually endorsed or transacted with.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://www.vechain.org"` | `"https://vechain.org/"` |
| product_url | `"https://www.vechain.org/ecosystem"` | `"https://apps.vechain.org/"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.vechain.org](https://www.vechain.org) — 200 → [https://vechain.org/](https://vechain.org/); checked `2026-11-24T22:43:49.880412+00:00`
- [https://www.vechain.org/ecosystem](https://www.vechain.org/ecosystem) — 404 → [https://vechain.org/ecosystem](https://vechain.org/ecosystem); checked `2026-11-24T22:43:49.947113+00:00`
- [https://vechain.org/our-products](https://vechain.org/our-products) — 200; checked `2026-11-24T23:46:45.656980+00:00`
- [https://apps.vechain.org/](https://apps.vechain.org/) — 200; checked `2026-11-24T23:46:45.952975+00:00`
- [https://vechain.org/](https://vechain.org/) — 200; checked `2026-11-24T22:43:49.880412+00:00`

Rendered observations: [https://vechain.org/our-products](https://vechain.org/our-products) (`2026-11-24T23:54:45.565Z`); [https://apps.vechain.org/#all](https://apps.vechain.org/#all) (`2026-11-24T23:54:53.816Z`).

### Xai — propose correction

Source: [content/projects/xai.md](../../../content/projects/xai.md); original blob `2a24dd23d38a442d16ebd742fbcb2e3c2eee385c`.

The current official games catalogue renders named games and explicit onchain/Web3 descriptions under the original Xai website. Replace the absent ecosystem path; this verifies the network catalogue, not every listed game or a financial staking action.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://xai.games/ecosystem"` | `"https://xai.games/games/"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://xai.games](https://xai.games) — 403 (access challenge); checked `2026-11-24T22:43:53.108244+00:00`
- [https://xai.games/ecosystem](https://xai.games/ecosystem) — 403 (access challenge); checked `2026-11-24T22:43:53.115149+00:00`
- [https://xai.games/games/](https://xai.games/games/) — 200; checked `2026-11-24T23:46:46.193037+00:00`

Rendered observations: [https://xai.games/games/](https://xai.games/games/) (`2026-11-24T23:55:05.941Z`).

### Zengo — propose correction

Source: [content/projects/zengo.md](../../../content/projects/zengo.md); original blob `c8ffa4d570ada0e2f864739f2fba3485ed0066ed`.

The normal browser renders the current wallet product page and supported crypto features. The homepage says Zengo is now part of eToro while continuing the wallet offering, so acquisition alone is not retirement. Replace the outdated download path; nothing was installed and no custody/security guarantee was independently assessed.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://zengo.com/download"` | `"https://zengo.com/crypto-wallet/"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://zengo.com](https://zengo.com) — 200; checked `2026-11-24T22:43:53.759634+00:00`
- [https://zengo.com/download](https://zengo.com/download) — 403 (access challenge); checked `2026-11-24T22:43:54.067394+00:00`
- [https://zengo.com/](https://zengo.com/) — 403 (access challenge); checked `2026-11-24T23:46:46.938849+00:00`
- [https://zengo.com/crypto-wallet/](https://zengo.com/crypto-wallet/) — 403 (access challenge); checked `2026-11-25T00:08:08.922933+00:00`

Rendered observations: [https://zengo.com/](https://zengo.com/) (`2026-11-24T23:52:37.822Z`); [https://zengo.com/](https://zengo.com/) (`2026-11-24T23:52:43.736Z`); [https://zengo.com/crypto-wallet/](https://zengo.com/crypto-wallet/) (`2026-11-24T23:52:49.792Z`).

## All 140 row outcomes

Every row below was researched. Follow-up URLs are candidates/evidence, not automatic substitutions. Retained holds are not findings that a company or network has ceased.

| Row | Outcome | Evidence checked / investigated | Reason |
| --- | --- | --- | --- |
| abracadabra.md | hold | [https://docs.abracadabra.money/learn/intro/cauldrons/lending-markets](https://docs.abracadabra.money/learn/intro/cauldrons/lending-markets): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| aleo.md | hold | [https://developer.aleo.org/guides/introduction/getting_started](https://developer.aleo.org/guides/introduction/getting_started): 403 (access challenge) → [https://docs.aleo.org/](https://docs.aleo.org/) | The official developer link now leads to docs.aleo.org, but the inspected route remains access-challenged. No verification challenge was solved. Current private-payments marketing does not independently verify the developer product. |
| aleo-wallet.md | hold | [https://aleo.org/ecosystem#wallets](https://aleo.org/ecosystem#wallets): 200 | The generic ecosystem-wallet row still lacks a distinct current product identity. Named wallet search results do not authorize replacing it with a different operator. |
| ancilia.md | hold | [https://x.com/ancilia_inc](https://x.com/ancilia_inc): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| ankr-appchain.md | propose correction | [https://www.ankr.com/docs/](https://www.ankr.com/docs/): 200<br>[https://www.ankr.com/docs/scaling-services-overview/](https://www.ankr.com/docs/scaling-services-overview/): 200 | Current official navigation explicitly links AppChains to Scaling Services Overview. Both pages render the actual developer service; the old appchains URL instead leads to ChainScanner. The docs root records a 23 November 2026 update. No chain or API account was provisioned. |
| anzen.md | hold | [https://docs.anzen.finance/](https://docs.anzen.finance/): 200<br>[https://rwa.anzen.finance/](https://rwa.anzen.finance/): [Errno 8] nodename nor servname provided, or not known | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| aptos-wallet.md | hold | [https://aptosfoundation.org/ecosystem/wallets](https://aptosfoundation.org/ecosystem/wallets): 429 (access challenge) | The generic ecosystem-wallet row still lacks a distinct current product identity; no named wallet was substituted merely because it operates on Aptos. |
| astaria.md | hold | [https://www.astaria.xyz](https://www.astaria.xyz): 404 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| azuki.md | hold | [https://www.azuki.com/](https://www.azuki.com/): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| badger.md | hold | [https://github.com/Badger-Finance/badger-legacy-sunset](https://github.com/Badger-Finance/badger-legacy-sunset): 200 | The current official notice and legacy-sunset repository remove frontends and preserve direct contract access. This does not establish closure of the whole DAO or prove a currently supported deposit product; retain the hold. |
| bakkt.md | hold | [https://investors.bakkt.com/news-releases/news-release-details/bakkt-reports-second-quarter-2026-results](https://investors.bakkt.com/news-releases/news-release-details/bakkt-reports-second-quarter-2026-results): 200<br>[https://www.bakkt.com/](https://www.bakkt.com/): 200 → [https://bakkt.com/](https://bakkt.com/) | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| balancer.md | hold | [https://forum.balancer.fi/t/bip-936-onchain-wind-down-of-protocol-specs/7144](https://forum.balancer.fi/t/bip-936-onchain-wind-down-of-protocol-specs/7144): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. The passed BIP-928 forum update specifies the wind-down and scheduled 30 November final pause, with limited exceptions. That date is future as of this review. Preserve needs_update; do not call every pool or contract already shut down. |
| banklessdao.md | propose partial correction keep hold | [https://banklessdao.substack.com/p/a-distinctive-black-flag-brand-black?action=share](https://banklessdao.substack.com/p/a-distinctive-black-flag-brand-black?action=share): 200<br>[https://blackflagdao.notion.site/](https://blackflagdao.notion.site/): 200 | The official former-DAO newsletter explicitly confirms the Black Flag rebrand and intentional bankless.community redirect to this Notion portal. Correct the identity and routes, but keep needs_update: current independent governance/activity evidence beyond the older transition material is still insufficient. No obsolete Discord invitation is substituted. |
| barnbridge.md | hold | [https://barnbridge.gitbook.io/docs](https://barnbridge.gitbook.io/docs): 200<br>[https://x.com/Barn_Bridge](https://x.com/Barn_Bridge): Official source reference or rendered observation; no separate HTTP receipt. | Official documentation is explicitly archived and the original routes fail. The historical enforcement order and old protocol descriptions do not precisely establish the current status of all contracts; retain the hold rather than infer a new blanket shutdown. |
| bitpanda-custody.md | propose correction | [https://www.bitpanda.com/en/enterprise/products/custody](https://www.bitpanda.com/en/enterprise/products/custody): 200<br>[https://documentation.bitpandaenterprise.com/custody/](https://documentation.bitpandaenterprise.com/custody/): 200 | The current first-party enterprise custody page renders specific custody/governance services and links the TrustVault platform documentation, resolving the missing legacy /en/custody route. Public service availability is verified; security certification, account eligibility and actual custody execution are not independently certified here. |
| blocklords.md | hold | [https://www.blocklords.com/en/blog/blocklords-to-blocklore](https://www.blocklords.com/en/blog/blocklords-to-blocklore): 200<br>[https://blocklords.com/en/dashboard](https://blocklords.com/en/dashboard): 200<br>[https://blocklords.com/en/releases](https://blocklords.com/en/releases): 200 | The official transition confirms BLOCKLORE and says the change remains within Web3; its current canvas dashboard and November release notes render. However, a currently available onchain function was not established. Do not treat an aspirational Web3 statement as a live crypto product. |
| blueshift.md | hold | [https://blueshift.fi/](https://blueshift.fi/): 200<br>[https://app.blueshift.fi/](https://app.blueshift.fi/): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. The application explicitly reports geographic restriction from this region. Restricted access is not closure evidence. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| bunzz.md | hold | [https://www.bunzz.dev/](https://www.bunzz.dev/): 200<br>[https://app.bunzz.dev/explorer](https://app.bunzz.dev/explorer): 200 | The prior rendered maintenance state remains unresolved. Current searches did not establish an ordinary supported product or an authoritative permanent closure; retain the hold. |
| bitvenus.md | hold | [https://www.bvox.com/](https://www.bvox.com/): 200 | The current BVOX browser page explicitly reports that service is unavailable in this region. Retain the hold without treating a geographic restriction as permanent closure or using another location to bypass it. |
| bydfi.md | propose correction | [https://www.bydfi.com/markets/crypto/spot/usdt/main](https://www.bydfi.com/markets/crypto/spot/usdt/main): 200 | The official current spot-market route renders populated BTC, ETH, XRP and other USDT markets with prices and volumes. Replace the missing /trade route. No exchange account or transaction was created. |
| cabin.md | hold | [https://cabin.city/](https://cabin.city/): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)><br>[https://github.com/CabinDAO](https://github.com/CabinDAO): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| canto.md | propose partial correction keep hold | [https://explore.canto.io/](https://explore.canto.io/): 200<br>[https://app.canto.io/bridge](https://app.canto.io/bridge): 525<br>[https://docs.canto.io/](https://docs.canto.io/): 200 | The current first-party Explore site renders the Canto ecosystem and links these docs. However, its actual Launch App/bridge link returns Cloudflare origin TLS error 525 in the browser. Correct accessible information routes while retaining needs_update; marketing and documentation do not establish an operational bridge or current chain health. |
| cellana-finance.md | hold | [https://docs.cellana.finance/](https://docs.cellana.finance/): [Errno 8] nodename nor servname provided, or not known<br>[https://x.com/CellanaFinance](https://x.com/CellanaFinance): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| ceramic.md | hold | [https://ceramic.network](https://ceramic.network): <urlopen error [SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error (_ssl.c:1081)><br>[https://developers.ceramic.network](https://developers.ceramic.network): 200 | The official transition preserves ceramic-one while retiring other components, but the current linked Ceramic One documentation route remains unavailable. Do not generalize ComposeDB retirement to the entire protocol. |
| cess.md | hold | [https://cess.network/](https://cess.network/): The read operation timed out<br>[https://github.com/CESSProject/Whitepaper/blob/main/cess-whitepaper.pdf](https://github.com/CESSProject/Whitepaper/blob/main/cess-whitepaper.pdf): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| chainpatrol.md | propose correction | [https://chainpatrol.com/](https://chainpatrol.com/): 200<br>[https://chainpatrol.com/docs/getting-started/what-we-do/introduction](https://chainpatrol.com/docs/getting-started/what-we-do/introduction): 200<br>[https://chainpatrol.com/docs](https://chainpatrol.com/docs): Official source reference or rendered observation; no separate HTTP receipt. | The original .io site redirects to .com. Current rendered service documentation describes crypto-customer phishing protection and wallet/browser distribution, including MetaMask and Coinbase integrations. This establishes the current product and Web3 use case without a dashboard login or security endorsement. |
| charmverse.md | hold | [https://app.charmverse.io/](https://app.charmverse.io/): [Errno 8] nodename nor servname provided, or not known<br>[https://x.com/charmverse](https://x.com/charmverse): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| civic.md | hold | [https://www.civic.com/legal/customer-product-specific-terms](https://www.civic.com/legal/customer-product-specific-terms): 200 | Current official pages and product-specific terms focus on Bryn business automation. They do not establish a supported current onchain identity product or independently prove all Civic offerings ceased. |
| coinfirm.md | hold | [https://lukka.tech/lukka-acquires-coinfirm-bringing-audited-data-to-blockchain-analytics-compliance-and-investigations/](https://lukka.tech/lukka-acquires-coinfirm-bringing-audited-data-to-blockchain-analytics-compliance-and-investigations/): 200<br>[https://status.blockchain-analytics.lukka.tech/](https://status.blockchain-analytics.lukka.tech/): 200 | The acquirer confirms the Coinfirm acquisition and current Lukka blockchain-analytics status exists, but acquisition alone is not retirement or exact operator/product continuity. A current supported Coinfirm-specific product/site pair was not established. |
| coreum.md | hold | [https://x.com/CoreumOfficial](https://x.com/CoreumOfficial): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| corn.md | hold | [https://docs.usecorn.com/](https://docs.usecorn.com/): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| cypher-capital-markets.md | hold | [https://x.com/cyphercapitals](https://x.com/cyphercapitals): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| did-id.md | hold | [https://x.com/dotdid](https://x.com/dotdid): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. The listed project is a Kusama/Polkadot identity profile associated with dotdid. Search found the different .bit/d.id identity product; the similar name does not establish continuity and was not substituted. |
| dojoswap.md | hold | [https://x.com/Dojo_Swap](https://x.com/Dojo_Swap): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| eigenlayer.md | hold | [https://www.eigencloud.xyz/compute](https://www.eigencloud.xyz/compute): 200<br>[https://x.com/eigenlayer](https://x.com/eigenlayer): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Homepage now identifies EigenCloud while the listed app returns 500. Reconcile the restaking product and current onchain scope with the broader AI platform. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| figment.md | hold | [https://www.figment.io/](https://www.figment.io/): 403 (access challenge)<br>[https://www.figment.io/products/staking-app/](https://www.figment.io/products/staking-app/): 403 (access challenge) | Current official product and Q3 2026 validator-report references support company activity, but the actual staking-app service page remains browser access-challenged. No challenge was bypassed; keep the product hold. |
| finoa.md | hold | [https://www.finoa.io/](https://www.finoa.io/): 200 | The official current homepage still links custody/customer routes that return 404. The founded-year correction remains in PR #52; no supported replacement product route was established in this pass. |
| fleek.md | hold | [https://fleek.xyz](https://fleek.xyz): 200 → [https://www.fleek.sh/](https://www.fleek.sh/)<br>[https://fleek.xyz/products](https://fleek.xyz/products): 200 → [https://www.fleek.sh/](https://www.fleek.sh/) | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A coming-soon/relaunch destination does not establish a currently supported version of the listed decentralized developer product. |
| flipside.md | hold | [https://flipsidecrypto.xyz/](https://flipsidecrypto.xyz/): Official source reference or rendered observation; no separate HTTP receipt.<br>[https://x.com/flipsidecrypto](https://x.com/flipsidecrypto): Official source reference or rendered observation; no separate HTTP receipt. | The website response still does not establish a rendered current analytics product. This pass did not independently verify an operating replacement; do not promote a shell or infer closure. |
| fluence.md | propose correction | [https://gov.fluence.network/t/q3-2026-fluence-dao-report/632](https://gov.fluence.network/t/q3-2026-fluence-dao-report/632): 200<br>[https://console.fluence.network/](https://console.fluence.network/): 200 → [https://auth.fluence.network/auth/v1/oidc/authorize?response_type=code&client_id=fluence-cloud-mainnet&redirect_uri=https%3A%2F%2Fconsole.fluence.ai%2Fapi%2Fauth%2Fcallback&scope=openid+email+profile&state=UFNSIHpV4an-PIWMTnT6sGXYU6r5AarSl-jVdENNhY4&code_challenge=j2_pmRZ_lJoNgKWLN6DD3ctC3HkiksuZN_7QgLSIe5s&code_challenge_method=S256&app_return_uri=https%3A%2F%2Fconsole.fluence.ai](https://auth.fluence.network/auth/v1/oidc/authorize?response_type=code&client_id=fluence-cloud-mainnet&redirect_uri=https%3A%2F%2Fconsole.fluence.ai%2Fapi%2Fauth%2Fcallback&scope=openid+email+profile&state=UFNSIHpV4an-PIWMTnT6sGXYU6r5AarSl-jVdENNhY4&code_challenge=j2_pmRZ_lJoNgKWLN6DD3ctC3HkiksuZN_7QgLSIe5s&code_challenge_method=S256&app_return_uri=https%3A%2F%2Fconsole.fluence.ai)<br>[https://fluence.ai/](https://fluence.ai/): 200 | The official Q3 2026 DAO report links current Fluence cloud work and FLT network activity. The current website renders Web3/node and compute services and directly links the working console sign-in page. The obsolete developer route is replaced. No account, compute instance or billing action was created. |
| fortunafi.md | hold | [https://www.fortunafi.com/](https://www.fortunafi.com/): 200<br>[https://app.gitbook.com/o/pKA4LZPny1hWRCEj2kx6/sites/site_2Pq6Y/](https://app.gitbook.com/o/pKA4LZPny1hWRCEj2kx6/sites/site_2Pq6Y/): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| fractal-id.md | hold | [https://web.fractal.id/](https://web.fractal.id/): [Errno 8] nodename nor servname provided, or not known | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| frigg-eco.md | propose correction | [https://www.frigg.eco/faq](https://www.frigg.eco/faq): 200<br>[https://www.frigg.eco/insights/the-first-digital-green-bond](https://www.frigg.eco/insights/the-first-digital-green-bond): 200<br>[https://www.frigg.eco/product/transactions](https://www.frigg.eco/product/transactions): 200 | The current first-party FAQ explicitly states that investments are tokenized by default and represent claims on renewable-energy assets, resolving the former onchain-scope concern. The current transaction service page and existing project platform are public. This records the provider offering, not independently validated compliance, returns or executed token issuance; unknown chains and founding/HQ fields remain unknown. |
| fxhash.md | hold | [https://x.com/fx_hash_](https://x.com/fx_hash_): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| gelato-web3-functions.md | hold | [https://www.gelato.network/web3-functions](https://www.gelato.network/web3-functions): 200 → [https://gelato.cloud/](https://gelato.cloud/)<br>[https://docs.gelato.network/web3-services/web3-functions](https://docs.gelato.network/web3-services/web3-functions): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)> | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Current legacy documentation has a certificate failure. A competitor sunset claim and historical official blog are insufficient first-party proof of the current retirement state. The separate Gelato Cloud correction does not reverify this product. |
| govrn.md | hold | [https://govrn.app/](https://govrn.app/): <urlopen error timed out><br>[https://hackmd.io/@Govrn/HJFPb_q-o](https://hackmd.io/@Govrn/HJFPb_q-o): 200<br>[https://x.com/govrnHQ](https://x.com/govrnHQ): Official source reference or rendered observation; no separate HTTP receipt. | The original profile links Govrn.io, while historical official guides and Govrn.app references identify the DAO contribution tool. A current working product/site pair was not established; the prior Govrn.app request timed out. |
| harmony.md | hold | [https://explorer.harmony.one/](https://explorer.harmony.one/): <urlopen error [Errno 61] Connection refused> | The current company destination presents AI video, while the official historical chain explorer could not be reached. Neither proves complete chain cessation or a current supported onchain product. |
| helika.md | propose exclusion | [https://www.helika.io/](https://www.helika.io/): Official source reference or rendered observation; no separate HTTP receipt.<br>[https://www.helika.io/about-us/](https://www.helika.io/about-us/): 200<br>[https://www.helika.io/technology/](https://www.helika.io/technology/): 200 | The current first-party FAQ says the company now focuses entirely on Helika Evolve AI-character infrastructure for brands, sports, entertainment and games. This supports exclusion of the obsolete Web3 game-analytics profile under the crypto/Web3 scope rule; it is not a company shutdown claim or automatic inclusion as a general AI agent. |
| heymint.md | hold | [https://heymint.xyz](https://heymint.xyz): 402 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| hmx.md | propose partial correction keep hold | [https://x.com/HMXorg](https://x.com/HMXorg): Official source reference or rendered observation; no separate HTTP receipt.<br>[https://linktr.ee/tradeondesk](https://linktr.ee/tradeondesk): Official source reference or rendered observation; no separate HTTP receipt.<br>[https://desk.exchange/](https://desk.exchange/): 200 → [https://clob.desk.exchange/](https://clob.desk.exchange/)<br>[https://docs.desk.exchange/](https://docs.desk.exchange/): Official source reference or rendered observation; no separate HTTP receipt. | The original HMX official profile explicitly identifies the migration and links the DESK account and Linktree. That official Linktree identifies Base and the new website/docs. The website redirects to a blank CLOB shell and docs DNS fails. Correct documented identity/site metadata, unset the unverified current token and dead legacy app link, but keep needs_update; neither trading nor agent execution is claimed live. |
| icon.md | propose partial correction keep hold | [https://www.icon.foundation/blog/2026/icon-network-economic-shutdown](https://www.icon.foundation/blog/2026/icon-network-economic-shutdown): 200 | A further official Foundation notice confirms that rewards and emissions already ended, adding present-state evidence to the future halt recorded in PR #52. Keep needs_update and preserve the announced future halt date; economic shutdown is not an assertion that every block already stopped. |
| ivendpay.md | hold | [https://x.com/IvendPay](https://x.com/IvendPay): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| jediswap.md | hold | [https://x.com/JediSwap](https://x.com/JediSwap): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| jex.md | hold | [https://jex.trade](https://jex.trade): 200<br>[https://app.jex.trade](https://app.jex.trade): [Errno 8] nodename nor servname provided, or not known | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. The destination is a coming-soon placeholder. No working current exchange product or authoritative permanent shutdown evidence was established. |
| jokerace.md | hold | [https://jokerace.io](https://jokerace.io): 200 → [https://confetti.win/](https://confetti.win/)<br>[https://jokerace.io/explore](https://jokerace.io/explore): 404 → [https://confetti.win/explore](https://confetti.win/explore) | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| kadena.md | hold | [https://www.kadena.io/](https://www.kadena.io/): 200 | The official company notice is not proof that the permissionless community chain ended. Current docs and company cessation must be separated from a verified working community product. |
| kaito.md | propose correction | [https://www.pro.kaito.ai/portal](https://www.pro.kaito.ai/portal): 200<br>[https://www.pro.kaito.ai/pricing](https://www.pro.kaito.ai/pricing): 200 | The current Kaito Pro page renders a specific Web3 research product, plans and API access under the original kaito.ai domain family. This resolves the missing /platform route without substituting the unrelated kaito.io payments company. No subscription or account was created. |
| kilt-protocol.md | hold | [https://x.com/Kiltprotocol](https://x.com/Kiltprotocol): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| kinto.md | propose exclusion | [https://medium.com/mamori-finance/kinto-is-shutting-down-fca59862f0e7](https://medium.com/mamori-finance/kinto-is-shutting-down-fca59862f0e7): 200 | The first-party Kinto announcement explicitly begins an orderly shutdown, sets the ordinary withdrawal deadline in September 2025 and explains the residual Ethereum claims process. Exclude the retired L2 profile; residual claims are not an operating financial network. No claim, recovery or transaction was performed. |
| kriyadex.md | hold | [https://x.com/KriyaDEX](https://x.com/KriyaDEX): Official source reference or rendered observation; no separate HTTP receipt. | The original official profile links withdrawals.kriya.finance, but that route also fails DNS. A withdrawal reference does not prove an active swap service or the exact permanent closure scope. |
| leap-wallet.md | propose exclusion | [https://x.com/leap_wallet/status/2039729267685376026](https://x.com/leap_wallet/status/2039729267685376026): 200<br>[https://docs.leapwallet.io/introduction](https://docs.leapwallet.io/introduction): 200<br>[https://developer.leapwallet.io/](https://developer.leapwallet.io/): 200<br>[https://www.theblock.co/news/business/2026-04-03-cosmos-ecosystems-leap-wallet-is-shutting-down-396325](https://www.theblock.co/news/business/2026-04-03-cosmos-ecosystems-leap-wallet-is-shutting-down-396325): 200 | The official original-account sunset post was read directly: it covers Leap extension/mobile apps, Compass, Leap WebApp, Swapfast, the validator and Snaps after 28 May 2026. This resolves the earlier concern that only Compass was retiring. Exclude the wallet-suite profile, not the onchain assets of its users. |
| leapfrog-wallet.md | hold | [https://x.com/leapfrogwallet](https://x.com/leapfrogwallet): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| logx.md | propose exclusion | [https://app.logx.trade/](https://app.logx.trade/): 200<br>[https://app.logx.network/](https://app.logx.network/): 200 | The original official application explicitly says LogX OG concluded and points to V2. That official successor currently displays an evolution/relaunch notice for a new institutional stablecoin offering rather than a live trading product. Exclude the obsolete perpetual-trading profile; this does not declare the organization bankrupt or assert user funds are inaccessible. |
| lybra-finance.md | hold | [https://x.com/LybraFinanceLSD](https://x.com/LybraFinanceLSD): Official source reference or rendered observation; no separate HTTP receipt. | A similarly branded LBR DAO destination and token metadata do not independently establish current official continuity or an operating original product; retain the hold. |
| lykke.md | hold | [https://www.lykke.com](https://www.lykke.com): 200 → [https://x.com/rundns](https://x.com/rundns)<br>[https://www.lykke.com/trade](https://www.lykke.com/trade): 404 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. The old domain now routes to an unrelated social profile and the old trade route is unavailable. This establishes stale links, not a verified legal closure or safe replacement. |
| magic-eden.md | hold | [https://help.magiceden.io/en/articles/6006555-how-to-sell-solana-nfts-on-magic-eden](https://help.magiceden.io/en/articles/6006555-how-to-sell-solana-nfts-on-magic-eden): 403 (access challenge) | Current official help describes Solana trading, but access challenges still prevent verifying the ordinary marketplace here. Wallet/chain-specific sunsets must not be generalized to all Solana marketplace activity. |
| magic-eden-creator-hub.md | hold | [https://help.magiceden.io/en/articles/6006558-how-to-list-your-nft-collection-on-magic-eden-using-creator-hub](https://help.magiceden.io/en/articles/6006558-how-to-list-your-nft-collection-on-magic-eden-using-creator-hub): 403 (access challenge) | Current official help documents the Creator Hub, but the exact supported creator application remains unverified under access restrictions. A marketplace or wallet change is not proof that every creator product retired. |
| mango-markets.md | hold | [https://www.bizinsider.org/mango-markets-shuts-down-following-sec-settlement/](https://www.bizinsider.org/mango-markets-shuts-down-following-sec-settlement/): 200<br>[https://x.com/mangomarkets/status/1878074453344571845](https://x.com/mangomarkets/status/1878074453344571845): 404 | The cited shutdown report links an original-account post that currently returns Post Not Found. The legacy sites are unavailable, but exact fresh first-party confirmation was not recovered; retain the hold rather than rely on a copied news page as independent proof. |
| mars-protocol.md | hold | [https://marsprotocol.io](https://marsprotocol.io): [Errno 8] nodename nor servname provided, or not known<br>[https://app.marsprotocol.io](https://app.marsprotocol.io): [Errno 8] nodename nor servname provided, or not known | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Search results include the unrelated Marscoin project. No official continuity or current replacement route was established for the listed Mars Protocol. |
| martian-wallet.md | hold | [https://martianwallet.xyz](https://martianwallet.xyz): [Errno 8] nodename nor servname provided, or not known | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| masa.md | hold | [https://www.masa.finance](https://www.masa.finance): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)><br>[https://www.masa.finance/products](https://www.masa.finance/products): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)> | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| matr1x.md | hold | [https://x.com/Matr1xOfficial](https://x.com/Matr1xOfficial): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Reported game shutdown or ecosystem changes were not resolved with sufficiently specific primary evidence. Do not generalize one game or token event to the whole listed ecosystem. |
| mercado-bitcoin.md | propose correction | [https://www.mercadobitcoin.com.br/criptomoedas/](https://www.mercadobitcoin.com.br/criptomoedas/): 200 → [https://www.mercadobitcoin.com.br/servico-indisponivel](https://www.mercadobitcoin.com.br/servico-indisponivel)<br>[https://www.mercadobitcoin.com.br/app](https://www.mercadobitcoin.com.br/app): 200 | The current official Portuguese app page renders digital-asset trading features and links the Mercado Bitcoin Apple/Google listings. Replace the missing legacy trade route. A separate /criptomoedas page currently reports unavailable service and is not selected; the app landing page does not establish authenticated trading availability or investment suitability. |
| metaco.md | propose correction | [https://docs.ripple.com/products/custody/](https://docs.ripple.com/products/custody/): 200 → [https://docs.ripple.com/products/custody](https://docs.ripple.com/products/custody)<br>[https://docs.ripple.com/products/custody/overview/what-is-ripple-custody](https://docs.ripple.com/products/custody/overview/what-is-ripple-custody): 200<br>[https://docs.ripple.com/products/custody/support/change-history/v113](https://docs.ripple.com/products/custody/support/change-history/v113): 200 | Official Ripple release notes explicitly rebrand Metaco/Harmonize UI and app to Ripple Custody. The current rendered Vault documentation identifies v1.43 LTS with custody, governance, deployment and API guides. This follows the documented product lineage, not a new unrelated entity. Original Metaco year/HQ remain historical entity metadata rather than Ripple founding data; no custody or signing action was performed. |
| metalabel.md | hold | [https://www.metalabel.com](https://www.metalabel.com): 200<br>[https://www.metalabel.com/explore](https://www.metalabel.com/explore): 200 → [https://www.metalabel.com/not-found](https://www.metalabel.com/not-found) | Current publishing-platform scope still requires a specifically supported crypto/onchain product; a historical creator-marketplace identity alone is insufficient. |
| metalcore.md | hold | [https://www.metalcore.gg](https://www.metalcore.gg): <urlopen error [SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error (_ssl.c:1081)> | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| midas.md | propose correction | [https://midas.app/mm1usd](https://midas.app/mm1usd): 403 (access challenge)<br>[https://midas.app/liquidity](https://midas.app/liquidity): 403 (access challenge)<br>[https://midas.app/products](https://midas.app/products): 403 (access challenge) | The current browser renders the existing products route with live catalogue entries, populated product TVL, network information and a separately labelled retired-products section. The earlier HTTP access challenge is not treated as shutdown; successful normal browser access resolves the product hold. No yield or risk claim is endorsed and no wallet was connected. |
| mina-foundation.md | hold | [https://www.minafoundation.com/reports/q3-2026-transparency-report](https://www.minafoundation.com/reports/q3-2026-transparency-report): 200 | The November Q3 report corroborates the continuing treasury handover and organizational wind-down already recorded in PR #52. It does not newly verify completion or retire the Mina network; keep the existing hold. |
| mintbase.md | hold | [https://www.mintbase.xyz](https://www.mintbase.xyz): 402 | The historical Bitte rebrand does not resolve the current paused deployment. No functioning successor agent product was established. |
| mirror.md | hold | [https://mirror.xyz](https://mirror.xyz): 200 → [https://paragraph.com/](https://paragraph.com/)<br>[https://mirror.xyz/discover](https://mirror.xyz/discover): 200 → [https://paragraph.com/](https://paragraph.com/) | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| mocana-gaming.md | hold | [https://mocanagaming.com](https://mocanagaming.com): [Errno 8] nodename nor servname provided, or not known<br>[https://mocanagaming.com/games](https://mocanagaming.com/games): [Errno 8] nodename nor servname provided, or not known | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| moonbeam.md | hold | [https://moonbeam.network](https://moonbeam.network): 200<br>[https://moonbeam.network/docs](https://moonbeam.network/docs): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Current official docs explicitly identify a pre-launch Base agent protocol, not the old Polkadot platform. They state joining is not open and the SDK is not published to npm. Correct the stale profile but keep needs_update; this is not approval of a live agent service. |
| movement-labs.md | hold | [https://movementlabs.xyz](https://movementlabs.xyz): [Errno 8] nodename nor servname provided, or not known<br>[https://movementlabs.xyz/ecosystem](https://movementlabs.xyz/ecosystem): [Errno 8] nodename nor servname provided, or not known | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| neutron.md | hold | [https://neutron.org/](https://neutron.org/): 200 → [https://x.com/neutron_org/status/2072037746424603130](https://x.com/neutron_org/status/2072037746424603130) | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. The current destination includes an official withdrawal/CLI guide rather than a verified ordinary product. Scope and current network state remain unresolved; do not infer a whole-chain shutdown. |
| nod-games.md | hold | [https://x.com/nodgames_io](https://x.com/nodgames_io): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| notional-finance.md | hold | [https://x.com/notionalfinance](https://x.com/notionalfinance): Official source reference or rendered observation; no separate HTTP receipt. | The official September 2026 post concerns an already-deprecated V1 exploit, while the same blog announces Notional Exponent. Do not infer shutdown of the entire protocol from the V1 event; a current working website/application pair remains unverified. |
| nyan-heroes.md | propose exclusion | [https://x.com/nyanheroes/status/1923349230636421330](https://x.com/nyanheroes/status/1923349230636421330): 200<br>[https://decrypt.co/320501/solana-game-nyan-heroes-shuts-down](https://decrypt.co/320501/solana-game-nyan-heroes-shuts-down): 200<br>[https://store.steampowered.com/app/2767820/Nyan_Heroes/](https://store.steampowered.com/app/2767820/Nyan_Heroes/): 200 → [https://store.steampowered.com/](https://store.steampowered.com/) | The developer original-account announcement was read directly and explicitly says the studio could not fund completion and the game is closing. Firsthand CEO reporting corroborates it, and the old Steam product redirects to the generic store. Exclude the retired game profile without asserting the token/NFTs cease to exist or accepting a purported recovery offer. |
| oklink.md | hold | [https://www.oklink.com](https://www.oklink.com): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A marketing/interface shell loads, but current live explorer data was not established in the observed product state. Preserve the earlier hold. |
| oncyber.md | hold | [https://docs.oncyber.io/guides/studio](https://docs.oncyber.io/guides/studio): 200 | The AWE Studio documentation is available, but the observed template controls did not establish populated, supported onchain product activity or exact operator continuity. |
| openaudit.md | hold | [https://openaudit.org](https://openaudit.org): 200<br>[https://openaudit.org/marketplace](https://openaudit.org/marketplace): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. The current destination is a coming-soon placeholder. Do not substitute a different similarly named audit product. |
| openlaw.md | propose partial correction keep hold | [https://paragraph.com/@tribute-labs/introducing-tribute-labs](https://paragraph.com/@tribute-labs/introducing-tribute-labs): 200<br>[https://tributelabs.xyz/](https://tributelabs.xyz/): 200<br>[https://github.com/openlawteam/tribute-contracts](https://github.com/openlawteam/tribute-contracts): 200<br>[https://github.com/openlawteam/openlaw-core](https://github.com/openlawteam/openlaw-core): 200 | The official rebrand announcement and current company site explicitly establish continuity from OpenLaw and describe current ADIN work. Correct the company identity/site but retain needs_update: the old product URL is unavailable, core framework repos are archived, and a current supported onchain product route was not established. Do not call the still-operating company shut down or automatically include a general AI offering. |
| opyn.md | hold | [https://www.opyn.co/](https://www.opyn.co/): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| parallel-finance.md | hold | [https://x.com/ParallelFi](https://x.com/ParallelFi): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| penumbra.md | hold | [https://guide.penumbra.zone/network/frontend/minifront](https://guide.penumbra.zone/network/frontend/minifront): 200<br>[https://x.com/penumbrazone](https://x.com/penumbrazone): Official source reference or rendered observation; no separate HTTP receipt. | Current official profile points to dex.penumbra.zone/tournament and current guide documents the frontend. Direct navigation to that product did not complete, so current availability remains unverified; no wallet or light client was installed. |
| persistence.md | propose correction | [https://persistence.one/history/](https://persistence.one/history/): 200<br>[https://app.persistence.one/](https://app.persistence.one/): 200<br>[https://app.persistence.one/pools](https://app.persistence.one/pools): 200 | The official history page explicitly separates its newer AI business from the continuing Core-1 chain and links its DEX. The rendered DEX pools page contains five populated pools with liquidity and trading-volume data. Replace generic documentation with that current product; do not reclassify the legacy network as a general AI service. |
| pirate-nation.md | hold | [https://x.com/PirateNation](https://x.com/PirateNation): Official source reference or rendered observation; no separate HTTP receipt. | The original official profile still references the game, but a current playable product was not independently verified. Token or marketplace activity alone does not establish the game is operational. |
| pizzadao.md | hold | [https://www.pizzadao.xyz](https://www.pizzadao.xyz): 200 → [https://globalpizza.party/](https://globalpizza.party/) | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. The current Global Pizza Party event does not by itself establish continuity of the described DAO/governance product. |
| platypus-finance.md | hold | [https://x.com/Platypusdefi](https://x.com/Platypusdefi): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| playember.md | hold | [https://playember.com](https://playember.com): 200<br>[https://playember.com/games](https://playember.com/games): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Current rendered pages focus on mobile apps, Stripe payments and analytics; a legacy Web3 meta description does not establish a current onchain product. The old games route is missing. |
| pleasrdao.md | hold | [https://pleasr.org/](https://pleasr.org/): The read operation timed out | Current search results describe the collective, but direct public website requests/navigation did not complete. Historical collections alone do not resolve current product and group activity. |
| prisma-finance.md | hold | [https://x.com/PrismaFi](https://x.com/PrismaFi): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| pudgy-penguins.md | hold | [https://huddle.pudgypenguins.com/](https://huddle.pudgypenguins.com/): 200<br>[https://huddle.pudgypenguins.com/resources](https://huddle.pudgypenguins.com/resources): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| qredo.md | hold | [https://www.qredo.com](https://www.qredo.com): 200 | The issuer asset-acquisition announcement and official administration filings concern different legal/entity scopes. They do not establish a current operating Qredo product or a safe automatic successor profile. |
| quasar.md | propose exclusion | [https://x.com/quasarfi](https://x.com/quasarfi): Official source reference or rendered observation; no separate HTTP receipt.<br>[https://quasar.fi](https://quasar.fi): 200 | The original official Quasar profile explicitly says its Cosmos yield aggregator shut down in April 2025 and the token/team migrated to Tower. The old application is unavailable. Exclude the legacy yield profile without claiming Tower also shut down or silently transferring old metadata to an unverified successor. |
| questbook.md | hold | [https://arbitrum.questbook.app/](https://arbitrum.questbook.app/): 200<br>[https://questbook.xyz/about](https://questbook.xyz/about): 404 → [https://questbook.xyz/about/](https://questbook.xyz/about/) | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| raft.md | hold | [https://raft.fi](https://raft.fi): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'raft.fi'. (_ssl.c:1081)> | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| rage-trade.md | hold | [https://x.com/rage_trade](https://x.com/rage_trade): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| redefine-security.md | hold | [https://x.com/redefine_sec](https://x.com/redefine_sec): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| reservoir.md | hold | [https://nft.reservoir.tools/reference/supported-chains](https://nft.reservoir.tools/reference/supported-chains): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Old developer route now leads to Relay documentation and the homepage is access-challenged. Reconcile NFT infrastructure versus successor bridging product. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| saakuru.md | hold | [https://source.saakuru.com/saakuru-source/saakuru-blockchain/environments](https://source.saakuru.com/saakuru-source/saakuru-blockchain/environments): 200<br>[https://x.com/SaakuruLabs](https://x.com/SaakuruLabs): Official source reference or rendered observation; no separate HTTP receipt. | Historical official chain environments remain documented, but the current destination emphasizes general AI. A maintained onchain service or authoritative whole-network retirement was not established. |
| saga.md | hold | [https://x.com/Sagaxyz__](https://x.com/Sagaxyz__): Official source reference or rendered observation; no separate HTTP receipt. | The current AI-oriented destination and older chain material still lack verified current network/product continuity. Do not assign a crypto-agent category based solely on history. |
| shrapnel.md | hold | [https://www.shrapnel.com/intel](https://www.shrapnel.com/intel): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| skynet-security.md | hold | [https://skynet.security](https://skynet.security): [Errno 8] nodename nor servname provided, or not known<br>[https://skynet.security/products](https://skynet.security/products): [Errno 8] nodename nor servname provided, or not known | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Search returns unrelated Skynet AI, cloud and other security products. No official replacement or identity continuity was established for this exact row. |
| solanafm.md | hold | [https://solana.fm/](https://solana.fm/): 200 | Current explorer references and the Jupiter acquisition do not independently verify a populated current explorer; secondary commentary explicitly lacks an official shutdown notice. Keep the hold. |
| solend.md | propose correction | [https://blog.save.finance/solend-is-now-save-c8a204ce5ea5](https://blog.save.finance/solend-is-now-save-c8a204ce5ea5): 200 → [https://blog.save.finance/solend-is-now-save-c8a204ce5ea5?gi=ed0e4fbe5383](https://blog.save.finance/solend-is-now-save-c8a204ce5ea5?gi=ed0e4fbe5383)<br>[https://save.finance/about](https://save.finance/about): 200<br>[https://docs.save.finance/](https://docs.save.finance/): 200<br>[https://save.finance/](https://save.finance/): 200 | The issuer rebrand announcement and current official docs explicitly identify Save as formerly Solend. After loading, the current lending interface displays named pools and populated TVL. Replace the missing Solend dashboard, retaining legacy token/year metadata without assigning an unverified new token. No deposit or wallet connection was made. |
| spectral-syntax.md | hold | [https://www.spectrallabs.xyz/](https://www.spectrallabs.xyz/): 200<br>[https://app.thegrid.ai/consumption](https://app.thegrid.ai/consumption): 200 | The current Grid inference offering does not establish an onchain agent use case. Model usage tokens are not evidence of blockchain token functionality; retain the scope hold. |
| spheron.md | hold | [https://www.spheron.network/](https://www.spheron.network/): 200 | A current GPU marketplace with populated capacity/pricing renders, but the current service does not itself prove a crypto/Web3 function. The old DePIN whitepaper is not a current supported onchain product demonstration. |
| spruceid.md | propose partial correction keep hold | [https://blog.spruceid.com/spruceid-developer-update-35/](https://blog.spruceid.com/spruceid-developer-update-35/): 200<br>[https://github.com/spruceid/siwe](https://github.com/spruceid/siwe): 200<br>[https://x.com/spruceid](https://x.com/spruceid): Official source reference or rendered observation; no separate HTTP receipt. | Official SpruceID developer material identifies SIWE, and its public non-archived repository replaces the missing generic /products path. Repository metadata last reports a May 2025 push. Keep needs_update: accessible legacy code does not by itself establish an actively supported current crypto offering from the government-focused website. No library was installed or executed. |
| stella.md | hold | [https://x.com/StellaStrategy](https://x.com/StellaStrategy): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Stella/Stellar and other similarly named finance products are not interchangeable. The original profile identity and a working official product are unresolved. |
| swarm-markets.md | hold | [https://docs.swarm.com/core-concepts/dotc](https://docs.swarm.com/core-concepts/dotc): 200 | Current dOTC documentation describes a separate service, while issuer notices terminate stock-certificate/xGold products. The still-available docs do not resolve current operational scope; keep the product-specific correction from PR #52 held. |
| tableland.md | hold | [https://x.com/tableland](https://x.com/tableland): Official source reference or rendered observation; no separate HTTP receipt. | The original routes lead toward Recall wind-down, but this does not independently retire every Tableland contract/community implementation or establish a supported current Tableland product. |
| the-beacon.md | hold | [https://x.com/The_Beacon_GG](https://x.com/The_Beacon_GG): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| the-sandbox.md | propose correction | [https://www.sandbox.game/en/create/game-maker/](https://www.sandbox.game/en/create/game-maker/): 403 (access challenge)<br>[https://docs.sandbox.game/en/creator/game-maker](https://docs.sandbox.game/en/creator/game-maker): 200 → [https://docs.sandbox.game/en/creator/game-maker/create-experiences](https://docs.sandbox.game/en/creator/game-maker/create-experiences) | The current official Game Maker 0.11 page renders product features, creation tools, documentation and existing creator experiences. This resolves the old generic creation route/access concern without downloading software, accepting an agreement or connecting a wallet. |
| thruster.md | hold | [https://x.com/thrusterfinance](https://x.com/thrusterfinance): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| tokenlogic.md | propose correction | [https://www.tokenlogic.xyz/](https://www.tokenlogic.xyz/): 200<br>[https://www.tokenlogic.xyz/analytics](https://www.tokenlogic.xyz/analytics): 200<br>[https://aave.tokenlogic.xyz/](https://aave.tokenlogic.xyz/): 200 | The official Analytics navigation links this exact Aave analytics site. Its rendered dashboard contains populated protocol, GHO, treasury, revenue and staking figures, plus an API catalogue. Replace the missing /research route; no private data or authenticated research was requested. |
| trader-joe.md | propose partial correction keep hold | [https://docs.lfj.gg/additional-information/brand-and-ecosystem-information/links_to_lfj_legacy_pages_11391553](https://docs.lfj.gg/additional-information/brand-and-ecosystem-information/links_to_lfj_legacy_pages_11391553): 200<br>[https://lfj.gg/](https://lfj.gg/): 200<br>[https://joecontent.substack.com/s/defi](https://joecontent.substack.com/s/defi): 200<br>[https://lfj.gg/swap](https://lfj.gg/swap): 403 (access challenge) | The issuer newsletter explicitly confirms the LFJ rebrand; both old domains redirect to LFJ and current developer docs describe its DEX. Correct the name and canonical swap route, but keep needs_update: the observed swap interface remained at asset/network loading and did not establish a functioning current market. No challenge was bypassed or swap attempted. |
| trailblaze-security.md | hold | [https://trailblaze.security](https://trailblaze.security): [Errno 8] nodename nor servname provided, or not known<br>[https://trailblaze.security/platform](https://trailblaze.security/platform): [Errno 8] nodename nor servname provided, or not known | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| treasure-dao.md | hold | [https://www.treasure.lol](https://www.treasure.lol): 200 → [https://treasure.lol/](https://treasure.lol/)<br>[https://market.treasure.lol](https://market.treasure.lol): [Errno 8] nodename nor servname provided, or not known | Current Forever Software/network documentation is presented as coming soon. A current ordinary onchain product was not established; do not treat the proposed agent network as already live. |
| vechain-foundation.md | propose correction | [https://vechain.org/our-products](https://vechain.org/our-products): 200<br>[https://apps.vechain.org/](https://apps.vechain.org/): 200<br>[https://vechain.org/](https://vechain.org/): 200 | Current first-party product navigation identifies VeChainThor, VeWorld, StarGate and VeBetter, and the official App Hub renders a populated onchain application catalogue. Replace the missing ecosystem route. Listed apps are not individually endorsed or transacted with. |
| vela-exchange.md | hold | [https://x.com/vela_exchange](https://x.com/vela_exchange): Official source reference or rendered observation; no separate HTTP receipt.<br>[https://x.com/VelaExchange](https://x.com/VelaExchange): Official source reference or rendered observation; no separate HTTP receipt. | The listed VelaExchange social identity points toward a different exchange domain, while the separately referenced Vela_Exchange account currently has no posts. Historical official docs still load but do not establish current trading or independently recover the reported sunset announcement. No lookalike exchange was substituted. |
| verite.md | hold | [https://x.com/verite_id](https://x.com/verite_id): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| watchpug.md | hold | [https://www.watchpug.org/](https://www.watchpug.org/): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Correct the official auditor domain, corroborated by a client audit-report repository. The current minimal service/contact page does not establish a maintained product or report portfolio. Keep needs_update; no client repository is substituted as the auditor product. |
| web3-storage.md | hold | [https://storacha.network/](https://storacha.network/): 200 → [https://www.fil.one/](https://www.fil.one/)<br>[https://fil.one/about](https://fil.one/about): 200 → [https://www.fil.one/about](https://www.fil.one/about)<br>[https://www.filone.com/support](https://www.filone.com/support): 200<br>[https://www.linkedin.com/company/storacha](https://www.linkedin.com/company/storacha): 200 | The historical operator confirms web3.storage became Storacha, and both domains now lead to Fil One. Fil One confirms Filecoin backing and a former Storacha engineering lead, but treats migration from Storacha as a separate support case. This is insufficient to silently equate the legal/operator/product identities or transfer the old metadata; keep the continuity hold. |
| xai.md | propose correction | [https://xai.games/games/](https://xai.games/games/): 200 | The current official games catalogue renders named games and explicit onchain/Web3 descriptions under the original Xai website. Replace the absent ecosystem path; this verifies the network catalogue, not every listed game or a financial staking action. |
| youves.md | hold | [https://app.youves.com/governance](https://app.youves.com/governance): 200 | The governance route exists but the prior rendered application remains in maintenance with unavailable vault/APR data. Governance pages alone do not establish a supported financial product or permanent closure. |
| zebpay.md | hold | [https://zebpay.com/in/](https://zebpay.com/in/): 403<br>[https://help.zebpay.com/support/solutions/articles/44002050209-trading-on-zebpay-exchange-master-the-order-book](https://help.zebpay.com/support/solutions/articles/44002050209-trading-on-zebpay-exchange-master-the-order-book): 200 | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| zengo.md | propose correction | [https://zengo.com/](https://zengo.com/): 403 (access challenge)<br>[https://zengo.com/crypto-wallet/](https://zengo.com/crypto-wallet/): 403 (access challenge) | The normal browser renders the current wallet product page and supported crypto features. The homepage says Zengo is now part of eToro while continuing the wallet offering, so acquisition alone is not retirement. Replace the outdated download path; nothing was installed and no custody/security guarantee was independently assessed. |
| zipmex.md | hold | [https://www.sec.or.th/EN/Pages/News_Detail.aspx?SECID=10850](https://www.sec.or.th/EN/Pages/News_Detail.aspx?SECID=10850): 200<br>[https://zipmex.com/legal-terms/](https://zipmex.com/legal-terms/): 200 | The Thai regulator confirms revocation of the old regional exchange licences, while the reused domain now presents a Solana aggregator. Neither authorizes a silent identity substitution nor a blanket statement about every regional company; retain the hold. |
| zkfair.md | hold | [https://x.com/ZKFCommunity](https://x.com/ZKFCommunity): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| zkswap-finance.md | hold | [https://x.com/zkswapfinance](https://x.com/zkswapfinance): Official source reference or rendered observation; no separate HTTP receipt. | A targeted official-source search did not establish an acceptable current replacement/product or a sufficiently specific retirement notice. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
