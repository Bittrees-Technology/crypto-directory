# Held listing follow-up review — 24 November 2026

Base source: `44097e05e2fce38b6524ff3a9f1b16cafb534e0e`. Scope: all **176** remaining `needs_update` rows from the preceding review; **310 distinct original site/product URLs** checked with certificate validation. Each row below records its current outcome and rationale. Follow-ups include official navigation, announcements, identity searches and rendered public product observations. A URL reference is evidence to inspect, not an endorsement.

**Proposal:** 22 rows can return to `verified`; seven receive limited corrections while remaining held; 14 stale product/provider/network profiles are proposed for exclusion; 133 remain unchanged on hold. If approved together, totals become 1,309 verified, 85 rejected and 140 needs_update out of the same 1,534 source rows. No new rows are introduced.

The 14 exclusions change only `verification_status` to `rejected`; source files and history remain. A retired standalone service can continue as internal technology, and an organization shutdown need not retire its permissionless network. Future-dated closures are recorded as future. DNS/TLS failures, access challenges, maintenance and HTTP 200 alone never establish closure or current product support.

This is a source-review proposal, not executed native/MCP actions by a wallet identity, role approval or a production release. It does not connect wallets, bypass login, install apps, accept terms, grant authority or make transactions. Public product verification does not establish authenticated service behavior, security, regulatory status or financial suitability. Founding year/HQ and other unrelated legacy fields are preserved unless explicitly changed; they are not all newly independently authenticated.

Original and follow-up checks were made on 24 November 2026 UTC. Bounded HTML samples and rendered observations are point-in-time evidence; findings can change. Access errors are reported as observed rather than retried without bound. Independent review and required checks remain prerequisites for any merge/publication.

## Local validation

- Source preflight and its nine regression checks pass.
- All 121 directory tests pass; the site builds all 1,534 rows across 15 categories.
- Five synthetic browser journeys pass (anonymous, submitter, editor, reviewer and admin), with no page errors. These are local fixture tests, not live authenticated actions.
- Exact source-scope checks pass: 43 listing files changed, 1,491 remain byte-identical to the base, all listing IDs and bodies are preserved, and every one of the 176 reviewed rows appears exactly once in the outcome table.
- Generated counts reconcile to 1,309 verified, 85 rejected and 140 needs_update. All 14 exclusions retain their source files.
- The broader link report has no broken internal links or invalid external URL formats. Its 2,074 external checks also record 400 bad HTTP responses and 116 transport errors across the whole directory, including deliberately held/rejected records; this is not a claim that every external destination works or that those failures prove closure.

## Proposed changes

### Ante Finance — propose exclusion

Source: [content/projects/ante-finance.md](../../../content/projects/ante-finance.md); original blob `7f0b0d322f6957cae0864ec6798e70e179dd52c5`.

Official documentation exposes only deprecated v0.5 and v0.6 versions; the homepage-linked v0.6 is explicitly deprecated. Propose excluding the unsupported legacy product profile, not declaring all contracts or the legal entity closed.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.ante.finance/](https://www.ante.finance/) — 200; checked `2026-11-24T22:43:09.228598+00:00`
- [https://docs.ante.finance/ante/v05/about/security](https://docs.ante.finance/ante/v05/about/security) — 200; checked `2026-11-24T22:43:09.320169+00:00`
- [https://docs.ante.finance/ante-v06/](https://docs.ante.finance/ante-v06/) — 200 → [https://docs.ante.finance/ante](https://docs.ante.finance/ante); checked `2026-11-24T22:45:42.058092+00:00`

Rendered public observations: [https://docs.ante.finance/ante](https://docs.ante.finance/ante) (`2026-11-24T22:56:49.885Z`); [https://docs.ante.finance/ante](https://docs.ante.finance/ante) (`2026-11-24T22:57:00.346Z`).

### Argent — propose correction

Source: [content/projects/argent.md](../../../content/projects/argent.md); original blob `44511ba3546ace4b025c240db87e8b49997d9b67`.

The original domain redirects to Ready; its CEO explicitly confirms the Argent rebrand. Current homepage describes digital-dollar accounts and links this same Argent Android package. The store URL responds successfully and is supplied by the official site; it was not installed. Legacy Ethereum/Starknet and social metadata are not assumed to describe the current Ready app; the announced Base transition is not treated as independently completed.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"Argent"` | `"Ready (formerly Argent)"` |
| primary_url | `"https://www.argent.xyz"` | `"https://www.ready.co/"` |
| product_url | `"n/a"` | `"https://play.google.com/store/apps/details?id=im.argent.contractwalletclient&hl=en"` |
| ecosystem | `["Ethereum", "Starknet"]` | `["n/a"]` |
| description | `"Smart wallet focused on simplified self-custody and account abstraction UX."` | `"Self-custodial digital-dollar account and community payments app, formerly Argent."` |
| twitter | `"https://x.com/argentHQ"` | `"n/a"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.argent.xyz](https://www.argent.xyz) — 200 → [https://www.ready.co/](https://www.ready.co/); checked `2026-11-24T22:43:09.725840+00:00`
- [https://www.ready.co/blog/community-finance](https://www.ready.co/blog/community-finance) — 200; checked `2026-11-24T22:45:42.058157+00:00`
- [https://www.ready.co/legal/ready-app-terms-of-service](https://www.ready.co/legal/ready-app-terms-of-service) — 200; checked `2026-11-24T22:45:42.058236+00:00`
- [https://www.ready.co/](https://www.ready.co/) — 200; checked `2026-11-24T23:09:10.594050+00:00`
- [https://play.google.com/store/apps/details?id=im.argent.contractwalletclient&hl=en](https://play.google.com/store/apps/details?id=im.argent.contractwalletclient&hl=en) — 200; checked `2026-11-24T23:09:10.594998+00:00`

Rendered public observations: [https://www.ready.co/](https://www.ready.co/) (`2026-11-24T22:50:06.722Z`).

### Async Art — propose exclusion

Source: [content/projects/async-art.md](../../../content/projects/async-art.md); original blob `bd3402f4c5f9931e96f83de862980f0612deb0b2`.

The current destination is an independent Digital Rescue Lab archive, not the original operational creator marketplace, and /market is 404. The original shutdown announcement is corroborated by contemporary coverage. Exclude the original marketplace profile; preserve NFTs/artworks and do not silently substitute the independent archive operator.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://async.art](https://async.art) — 200; checked `2026-11-24T22:43:09.897568+00:00`
- [https://async.art/market](https://async.art/market) — 404; checked `2026-11-24T22:43:09.920427+00:00`
- [https://async.art](https://async.art) — 200; checked `2026-11-24T22:43:09.897568+00:00`
- [https://nftnow.com/news/creator-platform-async-art-announces-shutdown/](https://nftnow.com/news/creator-platform-async-art-announces-shutdown/) — 403 (access challenge); checked `2026-11-24T23:09:12.727698+00:00`

### Balancer — propose partial correction keep hold

Source: [content/projects/balancer.md](../../../content/projects/balancer.md); original blob `8ef8ac4e205a17b0962556ec598b30af39c74d03`.

The passed BIP-928 forum update specifies the wind-down and scheduled 30 November final pause, with limited exceptions. That date is future as of this review. Preserve needs_update; do not call every pool or contract already shut down.

| Field | Before | Proposed |
| --- | --- | --- |
| description | `"Automated portfolio and liquidity protocol for weighted pools and onchain trading."` | `"DeFi liquidity protocol in an approved wind-down; most pools are withdrawal-only, with the final v3 Vault pause scheduled for 30 November 2026."` |

Evidence:

- [https://balancer.fi](https://balancer.fi) — 429 (access challenge); checked `2026-11-24T22:43:10.949220+00:00`
- [https://app.balancer.fi](https://app.balancer.fi) — 429 (access challenge) → [https://balancer.fi/pools](https://balancer.fi/pools); checked `2026-11-24T22:43:10.981262+00:00`
- [https://forum.balancer.fi/t/on-the-future-of-balancer-shutting-down-balancer-labs-supporting-the-path-forward/7002](https://forum.balancer.fi/t/on-the-future-of-balancer-shutting-down-balancer-labs-supporting-the-path-forward/7002) — 200; checked `2026-11-24T22:55:21.581085+00:00`
- [https://forum.balancer.fi/t/bip-928-orderly-winddown-of-balancer-and-distribution-of-the-treasury/7107/23](https://forum.balancer.fi/t/bip-928-orderly-winddown-of-balancer-and-distribution-of-the-treasury/7107/23) — 200; checked `2026-11-24T23:09:12.572816+00:00`

Rendered public observations: [https://forum.balancer.fi/t/bip-928-orderly-winddown-of-balancer-and-distribution-of-the-treasury/7107/23](https://forum.balancer.fi/t/bip-928-orderly-winddown-of-balancer-and-distribution-of-the-treasury/7107/23) (`2026-11-24T23:07:11.941Z`).

### bitFlyer — propose correction

Source: [content/projects/bitflyer.md](../../../content/projects/bitflyer.md); original blob `e0101cf5000722a368290bb038d2020cb43ed913`.

The official regional homepage links Lightning; its rendered exchange lists BTC/EUR, ETH/EUR and BTC/JPY markets. The old /en-jp/exchange route is 404. This is public availability, not account eligibility or an exchange endorsement.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://bitflyer.com/en-jp/exchange"` | `"https://lightning.bitflyer.com/?region=EU"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://bitflyer.com](https://bitflyer.com) — 200 → [https://bitflyer.com/en-eu/](https://bitflyer.com/en-eu/); checked `2026-11-24T22:43:11.295716+00:00`
- [https://bitflyer.com/en-jp/exchange](https://bitflyer.com/en-jp/exchange) — 404; checked `2026-11-24T22:43:11.411498+00:00`
- [https://lightning.bitflyer.com/?region=EU](https://lightning.bitflyer.com/?region=EU) — 200; checked `2026-11-24T22:45:42.316175+00:00`

Rendered public observations: [https://lightning.bitflyer.com/?region=EU](https://lightning.bitflyer.com/?region=EU) (`2026-11-24T22:48:57.585Z`).

### Blocknative — propose exclusion

Source: [content/projects/blocknative.md](../../../content/projects/blocknative.md); original blob `54a5190f91d4c3731475e4f012037cb804d187db`.

The first-party notice says Blocknative API services and Gas Network ceased on 19 June 2026 and the team joined Deloitte. Exclude the standalone provider profile; research or team continuation is not the former API service.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.blocknative.com](https://www.blocknative.com) — 200; checked `2026-11-24T22:43:12.186384+00:00`
- [https://www.blocknative.com](https://www.blocknative.com) — 200; checked `2026-11-24T22:43:12.186384+00:00`
- [http://www.yahoo.com/now/blocknative-launches-transaction-distribution-network-160000143.html](http://www.yahoo.com/now/blocknative-launches-transaction-distribution-network-160000143.html) — 404 → [https://www.yahoo.com/now/blocknative-launches-transaction-distribution-network-160000143.html](https://www.yahoo.com/now/blocknative-launches-transaction-distribution-network-160000143.html); checked `2026-11-24T22:45:42.895059+00:00`
- [https://gas.network/docs/overview](https://gas.network/docs/overview) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:45:42.935650+00:00`

### Blowfish — propose exclusion

Source: [content/projects/blowfish.md](../../../content/projects/blowfish.md); original blob `035f02db7e7a8a9806e3b46399859e3d0d973563`.

Phantom explicitly says existing Blowfish customers were notified the current standalone service was sunset. Phantom still lists an internal Blowfish API on its status page. Exclude the independent customer offering, not all Blowfish technology or its integration inside Phantom.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://blowfish.xyz](https://blowfish.xyz) — <urlopen error [SSL: SSLV3_ALERT_HANDSHAKE_FAILURE] ssl/tls alert handshake failure (_ssl.c:1081)>; checked `2026-11-24T22:43:12.503296+00:00`
- [https://phantom.com/learn/blog/phantom-acquires-blowfish](https://phantom.com/learn/blog/phantom-acquires-blowfish) — 200; checked `2026-11-24T22:55:21.215776+00:00`
- [https://status.phantom.com/](https://status.phantom.com/) — 200; checked `2026-11-24T22:55:21.256709+00:00`

### Breadcrumbs — propose correction

Source: [content/projects/breadcrumbs.md](../../../content/projects/breadcrumbs.md); original blob `efe82de546fb1d6e235dfcf673d163cacf1d25c9`.

Both original URLs now load, and the rendered pricing interface presents the current crypto analytics service and network data. The earlier hold is resolved by public product evidence, not solely HTTP 200.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.breadcrumbs.app](https://www.breadcrumbs.app) — 200; checked `2026-11-24T22:43:12.712625+00:00`
- [https://www.breadcrumbs.app/pricing](https://www.breadcrumbs.app/pricing) — 200; checked `2026-11-24T22:43:12.794369+00:00`
- [https://breadcrumbs.app/](https://breadcrumbs.app/) — 200 → [https://www.breadcrumbs.app/](https://www.breadcrumbs.app/); checked `2026-11-24T23:09:10.817516+00:00`
- [https://breadcrumbs.app/pricing](https://breadcrumbs.app/pricing) — 200 → [https://www.breadcrumbs.app/pricing](https://www.breadcrumbs.app/pricing); checked `2026-11-24T23:09:10.899282+00:00`

Rendered public observations: [https://www.breadcrumbs.app/pricing](https://www.breadcrumbs.app/pricing) (`2026-11-24T23:01:51.023Z`); [https://www.breadcrumbs.app/pricing](https://www.breadcrumbs.app/pricing) (`2026-11-24T23:02:09.184Z`).

### Bware Labs — propose exclusion

Source: [content/projects/bware-labs.md](../../../content/projects/bware-labs.md); original blob `a64c30681552690e35a58b4e40dcc7dff1fd5ab6`.

Alchemy confirms the acquisition and the official Blast API site says Blast products are no longer available. The original Bware site is unavailable; Alchemy already has a verified directory row. Exclude this obsolete standalone RPC/product profile without asserting that all validator operations or INFRA tokens ceased.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://bwarelabs.com](https://bwarelabs.com) — 530; checked `2026-11-24T22:43:13.446124+00:00`
- [https://www.alchemy.com/blog/alchemy-acquires-bware-labs](https://www.alchemy.com/blog/alchemy-acquires-bware-labs) — 200; checked `2026-11-24T22:45:43.545364+00:00`
- [https://blastapi.io/](https://blastapi.io/) — 200; checked `2026-11-24T22:45:43.685055+00:00`

### Centrifuge — propose correction

Source: [content/projects/centrifuge.md](../../../content/projects/centrifuge.md); original blob `9135cef801b06e87bd6666be9964da94b9c63fcb`.

Both original routes now load. The rendered application lists twelve tokenized funds with asset data; the earlier access challenge is no longer present. No investment, account or authorization test was performed.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://centrifuge.io](https://centrifuge.io) — 200; checked `2026-11-24T22:43:14.356068+00:00`
- [https://app.centrifuge.io](https://app.centrifuge.io) — 200; checked `2026-11-24T22:43:14.381278+00:00`
- [https://centrifuge.io/blog/jqqq-janushenderson-nasdaq](https://centrifuge.io/blog/jqqq-janushenderson-nasdaq) — 200; checked `2026-11-24T22:45:43.880340+00:00`
- [https://centrifuge.io/derwa-tokens](https://centrifuge.io/derwa-tokens) — 200; checked `2026-11-24T22:45:43.932491+00:00`

Rendered public observations: [https://app.centrifuge.io/](https://app.centrifuge.io/) (`2026-11-24T22:48:36.677Z`); [https://app.centrifuge.io/](https://app.centrifuge.io/) (`2026-11-24T22:48:42.825Z`).

### Civic Pass — propose exclusion

Source: [content/projects/civic-pass.md](../../../content/projects/civic-pass.md); original blob `e56e4ba08a285810c991d43d423e7ea0f9886f79`.

Civic explicitly discontinued CAPTCHA/ID verification on 1 July 2025 and uniqueness/liveness on 31 July 2025. Exclude Civic Pass, not Civic as a whole or its separate products.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.civic.com/pass](https://www.civic.com/pass) — 404; checked `2026-11-24T22:43:16.321524+00:00`
- [https://www.civic.com/news/an-update-on-civic-pass](https://www.civic.com/news/an-update-on-civic-pass) — 200; checked `2026-11-24T22:45:44.005771+00:00`

### Commonwealth — propose correction

Source: [content/projects/commonwealth.md](../../../content/projects/commonwealth.md); original blob `d11867674519dc290062f4d479a25bc42e0546a5`.

Both old routes redirect to Common. After rendering, Explore contains actual communities, token pairs and quests. The correction follows the current product brand and canonical routes; no legal merger or token assignment is inferred.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"Commonwealth"` | `"Common (formerly Commonwealth)"` |
| primary_url | `"https://commonwealth.im"` | `"https://common.xyz/"` |
| product_url | `"https://commonwealth.im/explore"` | `"https://common.xyz/explore"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://commonwealth.im](https://commonwealth.im) — 200 → [https://common.xyz/](https://common.xyz/); checked `2026-11-24T22:43:16.588165+00:00`
- [https://commonwealth.im/explore](https://commonwealth.im/explore) — 200 → [https://common.xyz/explore](https://common.xyz/explore); checked `2026-11-24T22:43:16.628768+00:00`
- [https://common.xyz/](https://common.xyz/) — 200; checked `2026-11-24T23:09:10.595225+00:00`
- [https://common.xyz/explore](https://common.xyz/explore) — 200; checked `2026-11-24T23:09:10.595284+00:00`

Rendered public observations: [https://commonwealth.im/explore](https://commonwealth.im/explore) (`2026-11-24T23:03:39.524Z`); [https://commonwealth.im/explore](https://commonwealth.im/explore) (`2026-11-24T23:03:51.423Z`).

### ComposeDB — propose exclusion

Source: [content/projects/composedb.md](../../../content/projects/composedb.md); original blob `df5a9c736578b1fd080f26fb221d689e22242d70`.

The official Ceramic transition notice deprecates js-ceramic/ComposeDB and directs users away from ComposeDB; the old product route is 404. Exclude the unsupported legacy product profile without asserting a precisely proven final shutdown date or that ceramic-one also ended.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://developers.ceramic.network](https://developers.ceramic.network) — 200; checked `2026-11-24T22:43:14.678986+00:00`
- [https://developers.ceramic.network/docs/composedb](https://developers.ceramic.network/docs/composedb) — 404 → [https://developers.ceramic.network/docs/composedb/](https://developers.ceramic.network/docs/composedb/); checked `2026-11-24T22:43:17.150927+00:00`
- [https://blog.ceramic.network/the-future-of-ceramic-focusing-on-recall/](https://blog.ceramic.network/the-future-of-ceramic-focusing-on-recall/) — 200; checked `2026-11-24T22:55:21.371992+00:00`

### Conic Finance — propose exclusion

Source: [content/projects/conic-finance.md](../../../content/projects/conic-finance.md); original blob `e83e4d0e7b0054831ec86548aa3d933077350405`.

The project announcement says services were discontinued, all Omnipools closed and deposits disabled. A still-loading frontend does not establish a supported yield product. Contracts/source may remain available; do not claim withdrawals or every contract are impossible.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.conic.finance](https://www.conic.finance) — 200 → [https://conic.finance/](https://conic.finance/); checked `2026-11-24T22:43:17.213202+00:00`
- [https://www.conic.finance/app](https://www.conic.finance/app) — 200 → [https://conic.finance/app](https://conic.finance/app); checked `2026-11-24T22:43:17.345604+00:00`
- [https://medium.com/@ConicFinance/conic-is-shutting-down-70482910a5d1](https://medium.com/@ConicFinance/conic-is-shutting-down-70482910a5d1) — 200; checked `2026-11-24T23:09:12.707393+00:00`

Rendered public observations: [https://conic.finance/app](https://conic.finance/app) (`2026-11-24T22:56:26.005Z`); [https://medium.com/@ConicFinance/conic-is-shutting-down-70482910a5d1](https://medium.com/@ConicFinance/conic-is-shutting-down-70482910a5d1) (`2026-11-24T22:56:36.705Z`).

### Econia — propose exclusion

Source: [content/projects/econia.md](../../../content/projects/econia.md); original blob `3f018cff784983a5f24859c5080b162d4378fe3b`.

The official Econia Labs company announcement states it is winding down; the listed home/product domains do not resolve. Exclude the original provider profile, without asserting every integrator or deployed contract stopped.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.econialabs.com](https://www.econialabs.com) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:20.007361+00:00`
- [https://www.econialabs.com/products](https://www.econialabs.com/products) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:20.071012+00:00`
- [https://www.linkedin.com/posts/econia-labs_econia-labs-activity-7370895847292792832-rRof](https://www.linkedin.com/posts/econia-labs_econia-labs-activity-7370895847292792832-rRof) — 200; checked `2026-11-24T22:55:22.483730+00:00`

### Ekubo — propose correction

Source: [content/projects/ekubo.md](../../../content/projects/ekubo.md); original blob `9e365a49a8d05f0c60ceab3a46262775f8092dbe`.

Both old hostnames redirect to the canonical Ekubo interface. The rendered application includes network selection, swap controls and populated protocol volume/liquidity metrics. No swap or wallet connection was attempted.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://www.ekubo.org"` | `"https://ekubo.org/"` |
| product_url | `"https://app.ekubo.org"` | `"https://ekubo.org/"` |
| ecosystem | `["Starknet"]` | `["Ethereum", "Starknet"]` |
| description | `"Concentrated liquidity DEX protocol on Starknet."` | `"Concentrated-liquidity DEX protocol with Ethereum and Starknet interfaces."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.ekubo.org](https://www.ekubo.org) — 200 → [https://ekubo.org/](https://ekubo.org/); checked `2026-11-24T22:43:20.687287+00:00`
- [https://app.ekubo.org](https://app.ekubo.org) — 200 → [https://ekubo.org/](https://ekubo.org/); checked `2026-11-24T22:43:20.959440+00:00`
- [https://app.ekubo.org/](https://app.ekubo.org/) — 200 → [https://ekubo.org/](https://ekubo.org/); checked `2026-11-24T23:09:10.941401+00:00`
- [https://ekubo.org/](https://ekubo.org/) — 200; checked `2026-11-24T22:43:20.687287+00:00`

Rendered public observations: [https://ekubo.org/](https://ekubo.org/) (`2026-11-24T22:56:12.079Z`); [https://ekubo.org/](https://ekubo.org/) (`2026-11-24T22:56:21.924Z`).

### Finoa — propose partial correction keep hold

Source: [content/projects/finoa.md](../../../content/projects/finoa.md); original blob `ba0bb584c4654db993936723b8a28ac393f1ad7a`.

The first-party homepage explicitly says founded in 2019, correcting 2018. Listed /solutions and current custody/customer route candidates return 404; product availability remains unverified, so retain needs_update.

| Field | Before | Proposed |
| --- | --- | --- |
| founded | `"2018"` | `"2019"` |

Evidence:

- [https://finoa.io](https://finoa.io) — 200 → [https://www.finoa.io/](https://www.finoa.io/); checked `2026-11-24T22:43:21.283846+00:00`
- [https://finoa.io/solutions](https://finoa.io/solutions) — 404 → [https://www.finoa.io/solutions](https://www.finoa.io/solutions); checked `2026-11-24T22:43:21.897136+00:00`
- [https://www.finoa.io/custody](https://www.finoa.io/custody) — 404; checked `2026-11-24T22:45:44.145330+00:00`
- [https://www.finoa.io/customers-overview](https://www.finoa.io/customers-overview) — 404; checked `2026-11-24T22:45:44.396563+00:00`

### Friends With Benefits — propose correction

Source: [content/projects/friends-with-benefits.md](../../../content/projects/friends-with-benefits.md); original blob `6b76944674fb498a0e8f5aea99c31b5497dbc888`.

The working official apex homepage, membership and About pages render. About confirms the governance token moved to Base in 2025; current membership is application/subscription based, so the old exclusively token-gated description is removed. No application, subscription or payment was made.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://www.fwb.help"` | `"https://fwb.help/"` |
| product_url | `"https://www.fwb.help/membership"` | `"https://fwb.help/membership"` |
| ecosystem | `["Ethereum"]` | `["Base"]` |
| description | `"Token-gated cultural collective and DAO for creators and builders."` | `"Members club and DAO for internet culture, events and community governance."` |
| twitter | `"https://x.com/fwbDAO"` | `"https://x.com/fwbtweets"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.fwb.help](https://www.fwb.help) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)>; checked `2026-11-24T22:43:23.741061+00:00`
- [https://www.fwb.help/membership](https://www.fwb.help/membership) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)>; checked `2026-11-24T22:43:23.900878+00:00`
- [https://fwb.help/about](https://fwb.help/about) — 200; checked `2026-11-24T22:55:23.121436+00:00`
- [https://fwb.help/](https://fwb.help/) — 200; checked `2026-11-24T23:09:10.971347+00:00`
- [https://fwb.help/membership](https://fwb.help/membership) — 200; checked `2026-11-24T23:09:11.027035+00:00`

Rendered public observations: [https://fwb.help/about](https://fwb.help/about) (`2026-11-24T22:59:43.306Z`); [https://fwb.help/membership](https://fwb.help/membership) (`2026-11-24T23:00:06.364Z`).

### Gelato — propose correction

Source: [content/projects/gelato.md](../../../content/projects/gelato.md); original blob `9606e22e2526d87fb44ec0a95b366a9d85af50ee`.

The original homepage redirects to Gelato Cloud; the rendered current Paymaster & Bundler page describes ERC-4337/7702 infrastructure. Replace expired-certificate legacy documentation without bypassing TLS checks. This does not reverify the separate Web3 Functions product.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://gelato.network"` | `"https://gelato.cloud/"` |
| product_url | `"https://docs.gelato.network"` | `"https://gelato.cloud/paymaster-bundler"` |
| description | `"Web3 automation and relayer network for recurring tasks and gas abstraction."` | `"Web3 infrastructure providing rollup services, gas sponsorship, paymaster and bundler tooling."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://gelato.network](https://gelato.network) — 200 → [https://gelato.cloud/](https://gelato.cloud/); checked `2026-11-24T22:43:25.010885+00:00`
- [https://docs.gelato.network](https://docs.gelato.network) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)>; checked `2026-11-24T22:43:25.156106+00:00`
- [https://gelato.cloud/](https://gelato.cloud/) — 200; checked `2026-11-24T22:55:25.616736+00:00`
- [https://docs.gelato.cloud/](https://docs.gelato.cloud/) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)>; checked `2026-11-24T22:55:25.945925+00:00`
- [https://gelato.cloud/paymaster-bundler](https://gelato.cloud/paymaster-bundler) — 200; checked `2026-11-24T23:09:11.285259+00:00`

Rendered public observations: [https://gelato.cloud/](https://gelato.cloud/) (`2026-11-24T22:57:20.868Z`); [https://gelato.cloud/paymaster-bundler](https://gelato.cloud/paymaster-bundler) (`2026-11-24T22:57:31.849Z`).

### ICON — propose partial correction keep hold

Source: [content/projects/icon.md](../../../content/projects/icon.md); original blob `054fd7d212ad7c5345be2df4806d2f14543152ec`.

The official ICON Foundation announcement sets 31 December 2026, still future at review time. Record the scheduled closure without treating the chain as already halted; keep needs_update.

| Field | Before | Proposed |
| --- | --- | --- |
| description | `"Interoperable blockchain ecosystem and network."` | `"Blockchain network in a planned migration and wind-down, with permanent chain shutdown announced for 31 December 2026."` |

Evidence:

- [https://icon.community](https://icon.community) — 200; checked `2026-11-24T22:43:26.671288+00:00`
- [https://icon.community/ecosystem](https://icon.community/ecosystem) — 200 → [https://icon.community/ecosystem/](https://icon.community/ecosystem/); checked `2026-11-24T22:43:26.740978+00:00`
- [https://www.icon.foundation/blog/2026/final-date-set-for-sodax-migration-icon-network-to-shut-down-end-of-2026](https://www.icon.foundation/blog/2026/final-date-set-for-sodax-migration-icon-network-to-shut-down-end-of-2026) — 200; checked `2026-11-24T22:45:45.396045+00:00`
- [https://docs.icon.community/](https://docs.icon.community/) — 200; checked `2026-11-24T22:45:45.543623+00:00`
- [https://docs.icon.community](https://docs.icon.community) — 200; checked `2026-11-24T22:45:45.755473+00:00`

Rendered public observations: [https://www.icon.foundation/blog/2026/final-date-set-for-sodax-migration-icon-network-to-shut-down-end-of-2026](https://www.icon.foundation/blog/2026/final-date-set-for-sodax-migration-icon-network-to-shut-down-end-of-2026) (`2026-11-24T23:06:49.092Z`).

### IntoTheBlock — propose correction

Source: [content/projects/intotheblock.md](../../../content/projects/intotheblock.md); original blob `000d9123d2696a10ab01d4c900e09d2da13be36c`.

The original official application redirects to a retirement/transition notice directing users to Sentora Research. The current Research page renders recent DeFi articles, reports and dashboards. This is a successor research profile, not a claim that the retired analytics API still works. Old-company year, HQ, networks and social identity are not carried into the successor without proof; a registered office is not treated as HQ.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"IntoTheBlock"` | `"Sentora Research (formerly IntoTheBlock Analytics)"` |
| primary_url | `"https://app.intotheblock.com"` | `"https://sentora.com/"` |
| product_url | `"https://app.intotheblock.com"` | `"https://sentora.com/research"` |
| description | `"Onchain intelligence and DeFi analytics tools."` | `"DeFi market research, reports and dashboards succeeding the retired IntoTheBlock analytics service."` |
| ecosystem | `["Ethereum", "Multiple"]` | `["n/a"]` |
| founded | `"2018"` | `"n/a"` |
| hq | `"United States"` | `"Metaverse"` |
| twitter | `"https://x.com/intotheblock"` | `"n/a"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://app.intotheblock.com](https://app.intotheblock.com) — 200 → [https://sentora.com/analytics-research](https://sentora.com/analytics-research); checked `2026-11-24T22:43:27.038160+00:00`
- [https://sentora.com/research](https://sentora.com/research) — 200; checked `2026-11-24T23:09:11.624443+00:00`
- [https://sentora.com/](https://sentora.com/) — 200; checked `2026-11-24T23:09:11.460343+00:00`

Rendered public observations: [https://sentora.com/research](https://sentora.com/research) (`2026-11-24T23:06:48.037Z`).

### Jambo — propose correction

Source: [content/projects/jambo.md](../../../content/projects/jambo.md); original blob `b0e2777d6884e1c2dec20e8c2bb49104a860f072`.

The www hostname works and officially links the JamboPhone shop. The rendered catalogue contains current phone products and identifies Jambo Technology; the old apex hostname fails. No purchase was made.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://jambo.technology"` | `"https://www.jambo.technology/"` |
| product_url | `"https://jambo.technology/products"` | `"https://jambophone.xyz/collections/all"` |
| description | `"Consumer-focused web3 app ecosystem with integrated trading and rewards."` | `"Crypto-native mobile ecosystem with JamboPhone devices, wallet and onchain apps."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://jambo.technology](https://jambo.technology) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:27.192224+00:00`
- [https://jambo.technology/products](https://jambo.technology/products) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:27.290595+00:00`
- [https://www.jambo.technology/](https://www.jambo.technology/) — 200; checked `2026-11-24T22:55:23.240976+00:00`
- [https://jambo.gitbook.io/whitepaper](https://jambo.gitbook.io/whitepaper) — 200; checked `2026-11-24T22:55:23.451517+00:00`
- [https://jambophone.xyz/collections/all](https://jambophone.xyz/collections/all) — 200; checked `2026-11-24T23:09:11.694164+00:00`

Rendered public observations: [https://www.jambo.technology/](https://www.jambo.technology/) (`2026-11-24T23:00:07.243Z`); [https://jambophone.xyz/collections/all](https://jambophone.xyz/collections/all) (`2026-11-24T23:00:18.360Z`).

### LATOKEN — propose correction

Source: [content/projects/latoken.md](../../../content/projects/latoken.md); original blob `85de28ae150c3335a87141b2996e3fa2793e5175`.

The existing exchange route renders populated token pairs, prices and market listings. Public product access resolves the previous hold; this is not a financial, regulatory or safety endorsement.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://latoken.com](https://latoken.com) — 200; checked `2026-11-24T22:43:28.828845+00:00`
- [https://latoken.com/exchange](https://latoken.com/exchange) — 200; checked `2026-11-24T22:43:28.840355+00:00`

Rendered public observations: [https://latoken.com/exchange](https://latoken.com/exchange) (`2026-11-24T23:03:04.017Z`); [https://latoken.com/exchange](https://latoken.com/exchange) (`2026-11-24T23:03:12.347Z`).

### LI.FI — propose correction

Source: [content/projects/li-fi.md](../../../content/projects/li-fi.md); original blob `6dc4fb5653752403a86c3cc45a5d9ea60f552148`.

Official navigation opens the current API/SDK product page and current SDK documentation. The old /products route is 404.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://li.fi/products"` | `"https://li.fi/api-sdk"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://li.fi](https://li.fi) — 200; checked `2026-11-24T22:43:29.240360+00:00`
- [https://li.fi/products](https://li.fi/products) — 404; checked `2026-11-24T22:43:29.240558+00:00`
- [https://li.fi/api-sdk](https://li.fi/api-sdk) — 200; checked `2026-11-24T22:55:20.978867+00:00`
- [https://docs.li.fi/sdk/overview](https://docs.li.fi/sdk/overview) — 200; checked `2026-11-24T22:55:20.979072+00:00`

Rendered public observations: [https://li.fi/](https://li.fi/) (`2026-11-24T22:48:04.257Z`); [https://li.fi/api-sdk](https://li.fi/api-sdk) (`2026-11-24T22:48:04.615Z`).

### Lisk — propose exclusion

Source: [content/projects/lisk.md](../../../content/projects/lisk.md); original blob `fca8dc10accc2396225394c801903ce3297807df`.

The official founder update explicitly says Lisk Chain shut down on 2 November 2026. Exclude the obsolete L2-chain profile; the company continues a distinct stablecoin-finance business in early access, so this is not a claim the whole company closed.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://lisk.com](https://lisk.com) — 200; checked `2026-11-24T22:43:29.440452+00:00`
- [https://lisk.com/ecosystem](https://lisk.com/ecosystem) — 404 → [https://lisk.com/ecosystem/](https://lisk.com/ecosystem/); checked `2026-11-24T22:43:29.492371+00:00`
- [https://lisk.com/blog/posts/introducing-the-new-lisk/](https://lisk.com/blog/posts/introducing-the-new-lisk/) — 200; checked `2026-11-24T22:45:45.870254+00:00`

Rendered public observations: [https://lisk.com/blog/posts/introducing-the-new-lisk/](https://lisk.com/blog/posts/introducing-the-new-lisk/) (`2026-11-24T23:07:13.787Z`).

### Merkle Science — propose correction

Source: [content/projects/merkle-science.md](../../../content/projects/merkle-science.md); original blob `2319ef8f43604cc097997e27ee016ca9d060bf66`.

Official platform navigation opens the current Compass transaction and wallet monitoring service page. The old /products route is 404.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://www.merklescience.com/products"` | `"https://www.merklescience.com/platform/transaction-wallet-monitoring"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.merklescience.com](https://www.merklescience.com) — 200; checked `2026-11-24T22:43:31.575279+00:00`
- [https://www.merklescience.com/products](https://www.merklescience.com/products) — 404; checked `2026-11-24T22:43:31.596356+00:00`
- [https://www.merklescience.com/platform/transaction-wallet-monitoring](https://www.merklescience.com/platform/transaction-wallet-monitoring) — 200; checked `2026-11-24T22:45:46.105100+00:00`
- [https://www.merklescience.com/platform/intelligence-reports](https://www.merklescience.com/platform/intelligence-reports) — 200; checked `2026-11-24T22:45:46.276467+00:00`
- [https://merkle-science-v2-site.webflow.io/blog/merkle-science-and-sui-partner-to-elevate-blockchain-security-compliance](https://merkle-science-v2-site.webflow.io/blog/merkle-science-and-sui-partner-to-elevate-blockchain-security-compliance) — 200; checked `2026-11-24T22:45:46.593807+00:00`

Rendered public observations: [https://www.merklescience.com/platform/transaction-wallet-monitoring](https://www.merklescience.com/platform/transaction-wallet-monitoring) (`2026-11-24T22:48:58.659Z`).

### Mina Foundation — propose partial correction keep hold

Source: [content/projects/mina-foundation.md](../../../content/projects/mina-foundation.md); original blob `4dd9c89bb8bbb5d6843cb1c4d72b2f1ae4e5901d`.

The current official foundation site identifies its Swiss nonprofit status and November 2026 treasury/wind-down progress. Correct the domain, US HQ and active-steward description. The previous 2021 value matches mainnet launch, which does not establish foundation incorporation; leave it unknown. Keep needs_update pending completion/continuity of the organizational handover; do not mark the Mina network retired.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://mina.foundation"` | `"https://www.minafoundation.com/"` |
| hq | `"United States"` | `"Switzerland"` |
| founded | `"2021"` | `"n/a"` |
| description | `"Ecosystem steward for lightweight zk-powered Mina protocol."` | `"Switzerland-based Mina ecosystem foundation scaling down toward a solvent wind-down and decentralized treasury handover."` |

Evidence:

- [https://mina.foundation](https://mina.foundation) — <urlopen error timed out>; checked `2026-11-24T22:43:32.896179+00:00`
- [https://minaprotocol.com](https://minaprotocol.com) — 200; checked `2026-11-24T22:43:33.093860+00:00`
- [https://www.minafoundation.com/](https://www.minafoundation.com/) — 200; checked `2026-11-24T22:55:23.516996+00:00`
- [https://minaprotocol.com/impressum](https://minaprotocol.com/impressum) — 200; checked `2026-11-24T22:55:23.694190+00:00`

Rendered public observations: [https://www.minafoundation.com/](https://www.minafoundation.com/) (`2026-11-24T22:55:32.589Z`).

### Mocaverse — propose correction

Source: [content/projects/mocaverse.md](../../../content/projects/mocaverse.md); original blob `5fe74d3fada86bc8c8d28603174addf46ec03ea0`.

The existing site renders current Moca Network identity features, AIR ID statistics, MOCA material, quests and dated ecosystem news after loading. No identity was created or claim submitted.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.mocaverse.xyz](https://www.mocaverse.xyz) — 200; checked `2026-11-24T22:43:33.790061+00:00`

Rendered public observations: [https://www.mocaverse.xyz/](https://www.mocaverse.xyz/) (`2026-11-24T23:01:37.863Z`); [https://www.mocaverse.xyz/](https://www.mocaverse.xyz/) (`2026-11-24T23:01:47.443Z`).

### Moonbeam — propose partial correction keep hold

Source: [content/projects/moonbeam.md](../../../content/projects/moonbeam.md); original blob `0a83b559d9caaba02d3d521b41ef0d37c0899bea`.

Current official docs explicitly identify a pre-launch Base agent protocol, not the old Polkadot platform. They state joining is not open and the SDK is not published to npm. Correct the stale profile but keep needs_update; this is not approval of a live agent service.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://moonbeam.network/build"` | `"https://moonbeam.network/docs"` |
| lead_category | `"Layer 1 / Layer 2"` | `"AI Agents"` |
| tags | `["Layer 1 / Layer 2", "Infrastructure"]` | `["AI Agents", "Infrastructure"]` |
| ecosystem | `["Polkadot"]` | `["Base"]` |
| description | `"Smart contract platform in the Polkadot ecosystem."` | `"Pre-launch agent transaction settlement and assurance protocol planned for Base; joining and its SDK are not yet generally available."` |

Evidence:

- [https://moonbeam.network](https://moonbeam.network) — 200; checked `2026-11-24T22:43:34.480419+00:00`
- [https://moonbeam.network/build](https://moonbeam.network/build) — 404; checked `2026-11-24T22:43:34.483642+00:00`
- [https://moonbeam.network/docs](https://moonbeam.network/docs) — 200; checked `2026-11-24T22:45:46.786780+00:00`

### Moonriver — propose exclusion

Source: [content/projects/moonriver.md](../../../content/projects/moonriver.md); original blob `438222790aeb9de37378ce21564832cb6d24726a`.

The official migration notice put the legacy parachain into transaction-rejecting maintenance from 1 August 2026 while blocks may continue during wind-down. Exclude the inactive parachain profile without declaring the MOVR token or every block producer gone.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://moonbeam.network/networks/moonriver](https://moonbeam.network/networks/moonriver) — 404; checked `2026-11-24T22:43:34.775465+00:00`
- [https://www.moonbeam.network/news/moonriver-strategic-update-movr-is-migrating-to-base](https://www.moonbeam.network/news/moonriver-strategic-update-movr-is-migrating-to-base) — 200; checked `2026-11-24T22:55:23.846842+00:00`

### Moonwell — propose correction

Source: [content/projects/moonwell.md](../../../content/projects/moonwell.md); original blob `a7dfc360d9150efb2f662e5d6a8dca1cdbf65f15`.

The official Launch App link opens the rendered lending/vault discovery interface. Current homepage network labels are Ethereum, Base and Optimism; the old app hostname does not resolve. No lending transaction was attempted.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://app.moonwell.fi"` | `"https://moonwell.fi/discover"` |
| ecosystem | `["Base", "Moonbeam"]` | `["Ethereum", "Base", "Optimism"]` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://moonwell.fi](https://moonwell.fi) — 200; checked `2026-11-24T22:43:34.919655+00:00`
- [https://app.moonwell.fi](https://app.moonwell.fi) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:35.131329+00:00`
- [https://moonwell.fi/discover](https://moonwell.fi/discover) — 200; checked `2026-11-24T22:55:20.979181+00:00`

Rendered public observations: [https://moonwell.fi/](https://moonwell.fi/) (`2026-11-24T22:48:30.201Z`); [https://moonwell.fi/discover](https://moonwell.fi/discover) (`2026-11-24T22:48:35.951Z`).

### MoveBit — propose correction

Source: [content/projects/movebit.md](../../../content/projects/movebit.md); original blob `d2504f6963ce79e811afa7d9970ddfb75f9484e6`.

Current first-party site identifies Move audits for Aptos and Sui and links the public MoveBit report repository. The rendered report portfolio provides a concrete service output; an empty /ListReports page is not used as evidence. Unknown founding year/HQ remain unknown.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"n/a"` | `"https://github.com/movebit/Sampled-Audit-Reports"` |
| ecosystem | `["n/a"]` | `["Aptos", "Sui"]` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://movebit.xyz/](https://movebit.xyz/) — 200; checked `2026-11-24T22:43:35.160714+00:00`
- [https://movebit.xyz/blog/sui-move-security-why-legacy-packages-can-still-put-shared-objects-at-risk-after-an-upgrade-fb5a67](https://movebit.xyz/blog/sui-move-security-why-legacy-packages-can-still-put-shared-objects-at-risk-after-an-upgrade-fb5a67) — 200; checked `2026-11-24T22:45:46.985921+00:00`
- [https://movebit.xyz/blog/sui-shared-object-security-how-access-control-flaws-put-defi-protocols-at-risk-9dc56b](https://movebit.xyz/blog/sui-shared-object-security-how-access-control-flaws-put-defi-protocols-at-risk-9dc56b) — 200; checked `2026-11-24T22:45:46.990465+00:00`
- [https://github.com/movebit/Sampled-Audit-Reports](https://github.com/movebit/Sampled-Audit-Reports) — 200; checked `2026-11-24T23:09:11.752918+00:00`

Rendered public observations: [https://movebit.xyz/](https://movebit.xyz/) (`2026-11-24T22:56:38.879Z`); [https://movebit.xyz/ListReports](https://movebit.xyz/ListReports) (`2026-11-24T22:56:48.848Z`); [https://github.com/movebit/Sampled-Audit-Reports](https://github.com/movebit/Sampled-Audit-Reports) (`2026-11-24T22:57:12.467Z`).

### NYDIG — propose correction

Source: [content/projects/nydig.md](../../../content/projects/nydig.md); original blob `be90aad69900e74630c38e4b401c8f68c43661f1`.

Current first-party homepage and Power & Compute service page describe Bitcoin mining infrastructure. Replace the missing /solutions route and custody-led description; this does not establish that all historical custody services ceased.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://nydig.com"` | `"https://www.nydig.com/"` |
| product_url | `"https://nydig.com/solutions"` | `"https://www.nydig.com/power-compute"` |
| lead_category | `"Custody"` | `"Infrastructure"` |
| tags | `["Custody", "Infrastructure"]` | `["Infrastructure", "Mining"]` |
| description | `"Bitcoin custody and financial infrastructure for institutions."` | `"Power and compute infrastructure supporting Bitcoin mining and high-performance computing."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://nydig.com](https://nydig.com) — 200 → [https://www.nydig.com/](https://www.nydig.com/); checked `2026-11-24T22:43:36.425863+00:00`
- [https://nydig.com/solutions](https://nydig.com/solutions) — 404 → [https://www.nydig.com/solutions](https://www.nydig.com/solutions); checked `2026-11-24T22:43:36.660287+00:00`
- [https://app.nydig.com](https://app.nydig.com) — 200; checked `2026-11-24T22:45:47.152527+00:00`
- [https://www.nydig.com/power-compute](https://www.nydig.com/power-compute) — 200; checked `2026-11-24T22:55:20.979238+00:00`
- [https://www.nydig.com/](https://www.nydig.com/) — 200; checked `2026-11-24T22:43:36.425863+00:00`

Rendered public observations: [https://www.nydig.com/](https://www.nydig.com/) (`2026-11-24T22:49:06.543Z`); [https://app.nydig.com/accounts](https://app.nydig.com/accounts) (`2026-11-24T22:49:08.552Z`); [https://external.auth.nydig.com/oauth2/ausrssjtjerBT1CsI5d7/v1/authorize?client_id=0oarssgz2i2uSg2pm5d7&code_challenge=XBY_lSKYvcWALmhR3Mq5LuZQD6-MZyd-UIyt2YhiwTM&code_challenge_method=S256&nonce=JdS1pbdZ1srQaGnNk0Tx84ZR26r6A9FrGp56UgayzY7WBgGnKjeaFJZHgRQnJziy&redirect_uri=https%3A%2F%2Fapp.nydig.com&response_type=code&state=0ceiNXTRtTTJshVQiTpWQcuxCZwPuMiJp6HxwAWsJiXq6DcctC5TVaZuR06xE9E9&scope=email%20offline_access%20openid%20profile%20okta.myAccount.appAuthenticator.maintenance.manage%20okta.myAccount.appAuthenticator.maintenance.read%20okta.myAccount.appAuthenticator.manage%20okta.myAccount.appAuthenticator.read%20okta.myAccount.authenticators.manage%20okta.myAccount.authenticators.read%20okta.myAccount.email.manage%20okta.myAccount.email.read%20okta.myAccount.password.manage%20okta.myAccount.password.read%20okta.myAccount.phone.manage%20okta.myAccount.phone.read%20okta.myAccount.profile.manage%20okta.myAccount.profile.read%20okta.myAccount.sessions.manage%20okta.myAccount.webauthn.manage%20okta.myAccount.webauthn.read](https://external.auth.nydig.com/oauth2/ausrssjtjerBT1CsI5d7/v1/authorize?client_id=0oarssgz2i2uSg2pm5d7&code_challenge=XBY_lSKYvcWALmhR3Mq5LuZQD6-MZyd-UIyt2YhiwTM&code_challenge_method=S256&nonce=JdS1pbdZ1srQaGnNk0Tx84ZR26r6A9FrGp56UgayzY7WBgGnKjeaFJZHgRQnJziy&redirect_uri=https%3A%2F%2Fapp.nydig.com&response_type=code&state=0ceiNXTRtTTJshVQiTpWQcuxCZwPuMiJp6HxwAWsJiXq6DcctC5TVaZuR06xE9E9&scope=email%20offline_access%20openid%20profile%20okta.myAccount.appAuthenticator.maintenance.manage%20okta.myAccount.appAuthenticator.maintenance.read%20okta.myAccount.appAuthenticator.manage%20okta.myAccount.appAuthenticator.read%20okta.myAccount.authenticators.manage%20okta.myAccount.authenticators.read%20okta.myAccount.email.manage%20okta.myAccount.email.read%20okta.myAccount.password.manage%20okta.myAccount.password.read%20okta.myAccount.phone.manage%20okta.myAccount.phone.read%20okta.myAccount.profile.manage%20okta.myAccount.profile.read%20okta.myAccount.sessions.manage%20okta.myAccount.webauthn.manage%20okta.myAccount.webauthn.read) (`2026-11-24T22:49:14.922Z`); [https://www.nydig.com/power-compute](https://www.nydig.com/power-compute) (`2026-11-24T22:49:15.248Z`).

### Rootstock — propose correction

Source: [content/projects/rootstock.md](../../../content/projects/rootstock.md); original blob `1a817f91cb44cc54ab18badb7e5c6de6841b17e3`.

Official Documentation navigation opens a current Bitcoin-sidechain developer portal with quickstarts and tools. The old /developers route is 404.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://rootstock.io/developers"` | `"https://dev.rootstock.io/"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://rootstock.io](https://rootstock.io) — 200; checked `2026-11-24T22:43:43.484109+00:00`
- [https://rootstock.io/developers](https://rootstock.io/developers) — 404 → [https://rootstock.io/developers/](https://rootstock.io/developers/); checked `2026-11-24T22:43:43.532738+00:00`
- [https://dev.rootstock.io/](https://dev.rootstock.io/) — 200; checked `2026-11-24T22:55:20.979132+00:00`

Rendered public observations: [https://rootstock.io/](https://rootstock.io/) (`2026-11-24T22:48:15.281Z`); [https://dev.rootstock.io/](https://dev.rootstock.io/) (`2026-11-24T22:48:29.081Z`).

### SimpleHash — propose exclusion

Source: [content/projects/simplehash.md](../../../content/projects/simplehash.md); original blob `bd2bb00c8fc63d0995fdaf4c28f4c92bbad28eac`.

Phantom announces the acquisition and sunset of the standalone customer service. The old public site is 404 and documentation is no longer public. Exclude the independent API provider; do not claim its internal Phantom technology ceased.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://simplehash.com](https://simplehash.com) — 404; checked `2026-11-24T22:43:44.780257+00:00`
- [https://simplehash.readme.io](https://simplehash.readme.io) — 200 → [https://docs.simplehash.com/password?redirect=%2F](https://docs.simplehash.com/password?redirect=%2F); checked `2026-11-24T22:43:44.971477+00:00`
- [https://phantom.com/learn/blog/phantom-acquires-simplehash](https://phantom.com/learn/blog/phantom-acquires-simplehash) — 200; checked `2026-11-24T22:55:21.307336+00:00`

### SoSoValue — propose correction

Source: [content/projects/sosovalue.md](../../../content/projects/sosovalue.md); original blob `a85ac3f686921c4910e08a265cd3ee22bb5d4395`.

Official navigation opens rendered crypto market charts and dated metrics. The old /markets route is 404.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://sosovalue.com/markets"` | `"https://sosovalue.com/dashboard/charts"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://sosovalue.com](https://sosovalue.com) — 200; checked `2026-11-24T22:43:45.327918+00:00`
- [https://sosovalue.com/markets](https://sosovalue.com/markets) — 404; checked `2026-11-24T22:43:45.606429+00:00`
- [https://sosovalue.com/dashboard/charts](https://sosovalue.com/dashboard/charts) — 200; checked `2026-11-24T22:45:49.612994+00:00`

Rendered public observations: [https://sosovalue.com/dashboard/charts](https://sosovalue.com/dashboard/charts) (`2026-11-24T22:49:18.411Z`); [https://sosovalue.com/dashboard/charts](https://sosovalue.com/dashboard/charts) (`2026-11-24T22:49:27.359Z`).

### Story Protocol — propose correction

Source: [content/projects/story-protocol.md](../../../content/projects/story-protocol.md); original blob `28f5d88fa7fd30ea4af7b6538d02069754ff2e75`.

The official rebrand announcement explicitly maps Story to DATA Foundation, IP to DATA, and Story Network to DATA Network. Trace renders a current public provenance registry. Current documentation says the independent chain continues until the planned Sui upgrade; Sui is not claimed as an already completed deployment. Existing founding/HQ fields are retained as legacy metadata, not newly authenticated.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"Story Protocol"` | `"The DATA Foundation (formerly Story Protocol)"` |
| primary_url | `"https://story.foundation"` | `"https://www.datafdn.org/"` |
| product_url | `"https://story.foundation/ecosystem"` | `"https://trace.datafdn.org/"` |
| lead_category | `"Layer 1 / Layer 2"` | `"Infrastructure"` |
| tags | `["Layer 1 / Layer 2", "NFTs & Creator Economy"]` | `["Infrastructure", "Data & Analytics"]` |
| ecosystem | `["Story"]` | `["DATA Network"]` |
| token | `"IP"` | `"DATA"` |
| description | `"IP-focused blockchain ecosystem for programmable licensing."` | `"Onchain provenance and rights-cleared AI data infrastructure, with the public Trace registry and a planned transition to Sui."` |
| twitter | `"https://x.com/storyprotocol"` | `"https://x.com/datafdn"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://story.foundation](https://story.foundation) — 200 → [https://www.datafdn.org/](https://www.datafdn.org/); checked `2026-11-24T22:43:46.871462+00:00`
- [https://story.foundation/ecosystem](https://story.foundation/ecosystem) — 404 → [https://www.datafdn.org/ecosystem](https://www.datafdn.org/ecosystem); checked `2026-11-24T22:43:47.350686+00:00`
- [https://www.datafdn.org/blog/were-becoming-the-data-foundation](https://www.datafdn.org/blog/were-becoming-the-data-foundation) — 200; checked `2026-11-24T22:45:50.259419+00:00`
- [https://www.datafdn.org/apps](https://www.datafdn.org/apps) — 200; checked `2026-11-24T22:45:50.410382+00:00`
- [https://docs.datafdn.org/introduction](https://docs.datafdn.org/introduction) — 200; checked `2026-11-24T22:45:50.547437+00:00`
- [https://www.datafdn.org/](https://www.datafdn.org/) — 200; checked `2026-11-24T23:09:11.911992+00:00`
- [https://trace.datafdn.org/](https://trace.datafdn.org/) — 200; checked `2026-11-24T23:09:12.012384+00:00`

Rendered public observations: [https://www.datafdn.org/apps](https://www.datafdn.org/apps) (`2026-11-24T22:58:51.663Z`); [https://trace.datafdn.org/](https://trace.datafdn.org/) (`2026-11-24T22:58:52.839Z`).

### Superfluid Governance — propose correction

Source: [content/projects/superfluid-governance.md](../../../content/projects/superfluid-governance.md); original blob `7d54ae8a7960ee57594b56041d29d01293d8416c`.

The corporate site links the protocol homepage; the current governance page renders discussion and voting routes. The protocol explicitly identifies SUP, correcting the unrelated SUPER symbol. No vote or governance action was submitted.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://www.superfluid.finance"` | `"https://superfluid.org/"` |
| product_url | `"https://www.superfluid.finance/dao"` | `"https://superfluid.org/governance"` |
| token | `"SUPER"` | `"SUP"` |
| description | `"Governance and token streaming tools for DAOs."` | `"Governance for the Superfluid money-streaming protocol and its ecosystem incentives."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.superfluid.finance](https://www.superfluid.finance) — 200; checked `2026-11-24T22:43:47.497450+00:00`
- [https://www.superfluid.finance/dao](https://www.superfluid.finance/dao) — 404; checked `2026-11-24T22:43:47.590940+00:00`
- [https://www.superfluidwallet.com/start](https://www.superfluidwallet.com/start) — 200; checked `2026-11-24T22:45:50.602139+00:00`
- [https://superfluid.org/](https://superfluid.org/) — 200; checked `2026-11-24T22:55:26.729690+00:00`
- [https://superfluid.org/governance](https://superfluid.org/governance) — 200; checked `2026-11-24T23:09:12.250094+00:00`

Rendered public observations: [https://superfluid.org/](https://superfluid.org/) (`2026-11-24T22:57:13.102Z`); [https://superfluid.org/governance](https://superfluid.org/governance) (`2026-11-24T22:57:20.184Z`).

### Swarm Markets — propose partial correction keep hold

Source: [content/projects/swarm-markets.md](../../../content/projects/swarm-markets.md); original blob `39d4f9a33c84207ddd5a89e72deffe520ea99a1c`.

The rendered application and issuer notice identify those specific terminated products and the remaining claims period. Correct the active-RWA description and keep needs_update: this does not establish that every Swarm company or dOTC service ceased. No terms, KYC or redemption action was accepted.

| Field | Before | Proposed |
| --- | --- | --- |
| description | `"Regulated DeFi venue for tokenized real-world assets."` | `"Tokenized-asset venue whose SwarmX stock-certificate and xGold products terminated on 30 September 2026; a claims period remains open through 31 December 2026."` |

Evidence:

- [https://swarm.com](https://swarm.com) — 200 → [https://app.swarm.markets/](https://app.swarm.markets/); checked `2026-11-24T22:43:47.743354+00:00`
- [https://app.swarm.com](https://app.swarm.com) — 200 → [https://app.swarm.markets/](https://app.swarm.markets/); checked `2026-11-24T22:43:47.831981+00:00`
- [https://docs.swarmx.net/p/swarmx-kya/sunsetting](https://docs.swarmx.net/p/swarmx-kya/sunsetting) — 200; checked `2026-11-24T23:09:12.711183+00:00`

Rendered public observations: [https://app.swarm.markets/](https://app.swarm.markets/) (`2026-11-24T23:03:37.696Z`); [https://app.swarm.markets/](https://app.swarm.markets/) (`2026-11-24T23:03:52.160Z`); [https://app.swarm.markets/](https://app.swarm.markets/) (`2026-11-24T23:04:02.160Z`).

### Vertex Protocol — propose exclusion

Source: [content/projects/vertex-protocol.md](../../../content/projects/vertex-protocol.md); original blob `03d87e2d451e93a1aa85a538a1d51b960e2290ba`.

The issuer announcement specifies the legacy EVM deployments will cease and VRTX will be sunset as the team joins Ink Foundation. The old homepage is now 404. Exclude that legacy profile without automatically replacing it with a future Ink product.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://vertexprotocol.com](https://vertexprotocol.com) — 404; checked `2026-11-24T22:43:51.619543+00:00`
- [https://www.prnewswire.com/news-releases/vertex-protocol-team-to-join-ink-foundation-build-new-defi-primitives-on-ink-layer-2-302499517.html](https://www.prnewswire.com/news-releases/vertex-protocol-team-to-join-ink-foundation-build-new-defi-primitives-on-ink-layer-2-302499517.html) — 200; checked `2026-11-24T22:45:51.155661+00:00`

### WatchPug — propose partial correction keep hold

Source: [content/projects/watchpug.md](../../../content/projects/watchpug.md); original blob `45de17ed6d6e9e9a6e0032075c2f2999c661ee25`.

Correct the official auditor domain, corroborated by a client audit-report repository. The current minimal service/contact page does not establish a maintained product or report portfolio. Keep needs_update; no client repository is substituted as the auditor product.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://watchpug.com"` | `"https://www.watchpug.org/"` |

Evidence:

- [https://watchpug.com](https://watchpug.com) — 404; checked `2026-11-24T22:43:51.837110+00:00`
- [https://www.watchpug.org/](https://www.watchpug.org/) — 200; checked `2026-11-24T22:55:20.979279+00:00`
- [https://github.com/standx-labs/stand_audit](https://github.com/standx-labs/stand_audit) — 200; checked `2026-11-24T22:55:21.139002+00:00`

Rendered public observations: [https://www.watchpug.org/](https://www.watchpug.org/) (`2026-11-24T22:49:29.125Z`).

### Wildcard — propose correction

Source: [content/projects/wildcard.md](../../../content/projects/wildcard.md); original blob `cc4c4d7445959ec906c6e326d6313afdb6d4be6f`.

The official site links the released Steam game; the Steam developer/publisher identity and website backlink match Wildcard. The official Wildpass migration article confirms Ethereum context. The homepage teaser alone is not mistaken for a game shutdown. Nothing was installed or purchased.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://wildcardgame.com"` | `"https://store.steampowered.com/app/497120/Wildcard/"` |
| description | `"Competitive action game ecosystem with onchain asset layer."` | `"Two-versus-two collectible card action game with an Ethereum Wildpass collectible ecosystem."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://wildcardgame.com](https://wildcardgame.com) — 200; checked `2026-11-24T22:43:53.023951+00:00`
- [https://wildcardgame.com/news/how-to-migrate-your-wildpass-to-ethereum](https://wildcardgame.com/news/how-to-migrate-your-wildpass-to-ethereum) — 200; checked `2026-11-24T22:45:51.417854+00:00`
- [https://store.steampowered.com/app/497120/Wildcard/](https://store.steampowered.com/app/497120/Wildcard/) — 200; checked `2026-11-24T23:09:12.539721+00:00`

Rendered public observations: [https://store.steampowered.com/app/497120/Wildcard/](https://store.steampowered.com/app/497120/Wildcard/) (`2026-11-24T23:02:58.672Z`).

### Zeta Markets — propose exclusion

Source: [content/projects/zeta-markets.md](../../../content/projects/zeta-markets.md); original blob `2a58a100babd50327d68903e81962d91d25c169f`.

Official documentation says the protocol ceased in May 2025 and the final-epoch page disables trading from 1 May. A legacy frontend returning 200 is not an active exchange. Exclude the legacy perp venue without silently substituting Bullet.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://zetamarkets.com](https://zetamarkets.com) — 200; checked `2026-11-24T22:43:54.346353+00:00`
- [https://dex.zeta.markets](https://dex.zeta.markets) — 200; checked `2026-11-24T22:43:54.433969+00:00`
- [https://docs.zeta.markets/](https://docs.zeta.markets/) — 200; checked `2026-11-24T22:45:51.426449+00:00`
- [https://docs.zeta.markets/rewards-programs/final-epoch](https://docs.zeta.markets/rewards-programs/final-epoch) — 200; checked `2026-11-24T22:45:51.556827+00:00`

## All 176 row outcomes

The table accounts for every reviewed row, including unchanged holds. Listed original links include their fresh response/transport result; a successful response is not automatic approval.

| Row | Decision | Original site/product checks | Reason |
| --- | --- | --- | --- |
| abracadabra.md | hold | [https://abracadabra.money](https://abracadabra.money): 200<br>[https://abracadabra.money/borrow](https://abracadabra.money/borrow): 404 | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| aleo.md | hold | [https://aleo.org](https://aleo.org): 200<br>[https://developer.aleo.org](https://developer.aleo.org): 403 (access challenge) → [https://docs.aleo.org/](https://docs.aleo.org/) | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| aleo-wallet.md | hold | [https://aleo.org/ecosystem#wallets](https://aleo.org/ecosystem#wallets): 200 | The row names an ecosystem wallet category rather than a specific wallet product. A changed ecosystem route does not authorize substituting a different wallet or inventing its identity. |
| ancilia.md | hold | [https://ancilia.com](https://ancilia.com): 404<br>[https://ancilia.com/platform](https://ancilia.com/platform): 404 | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| ankr-appchain.md | hold | [https://www.ankr.com/appchains](https://www.ankr.com/appchains): 200 → [https://chainscanner.xyz/](https://chainscanner.xyz/) | Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| ante-finance.md | propose exclusion | [https://www.ante.finance/](https://www.ante.finance/): 200<br>[https://docs.ante.finance/ante/v05/about/security](https://docs.ante.finance/ante/v05/about/security): 200 | Official documentation exposes only deprecated v0.5 and v0.6 versions; the homepage-linked v0.6 is explicitly deprecated. Propose excluding the unsupported legacy product profile, not declaring all contracts or the legal entity closed. |
| anzen.md | hold | [https://anzen.finance](https://anzen.finance): [Errno 8] nodename nor servname provided, or not known<br>[https://anzen.finance/app](https://anzen.finance/app): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| aptos-wallet.md | hold | [https://aptosfoundation.org/ecosystem/wallets](https://aptosfoundation.org/ecosystem/wallets): 429 (access challenge) | The row names an ecosystem wallet category rather than a specific wallet. Search results for named Aptos wallets do not establish continuity with this generic profile. |
| argent.md | propose correction | [https://www.argent.xyz](https://www.argent.xyz): 200 → [https://www.ready.co/](https://www.ready.co/) | The original domain redirects to Ready; its CEO explicitly confirms the Argent rebrand. Current homepage describes digital-dollar accounts and links this same Argent Android package. The store URL responds successfully and is supplied by the official site; it was not installed. Legacy Ethereum/Starknet and social metadata are not assumed to describe the current Ready app; the announced Base transition is not treated as independently completed. |
| astaria.md | hold | [https://www.astaria.xyz](https://www.astaria.xyz): 404 | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| async-art.md | propose exclusion | [https://async.art](https://async.art): 200<br>[https://async.art/market](https://async.art/market): 404 | The current destination is an independent Digital Rescue Lab archive, not the original operational creator marketplace, and /market is 404. The original shutdown announcement is corroborated by contemporary coverage. Exclude the original marketplace profile; preserve NFTs/artworks and do not silently substitute the independent archive operator. |
| azuki.md | hold | [https://www.azuki.com](https://www.azuki.com): 200<br>[https://www.azuki.com/collectibles](https://www.azuki.com/collectibles): 404 | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| badger.md | hold | [https://badger.com](https://badger.com): 200<br>[https://app.badger.com](https://app.badger.com): 200 | Official legacy frontend sunset material does not prove the entire DAO/protocol retired. Distinguish legacy vault withdrawal access from a currently supported deposit product before exclusion or verification. |
| bakkt.md | hold | [https://www.bakkt.com](https://www.bakkt.com): 200 → [https://bakkt.com/](https://bakkt.com/)<br>[https://www.bakkt.com/platform](https://www.bakkt.com/platform): 404 → [https://bakkt.com/platform](https://bakkt.com/platform) | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| balancer.md | propose partial correction keep hold | [https://balancer.fi](https://balancer.fi): 429 (access challenge)<br>[https://app.balancer.fi](https://app.balancer.fi): 429 (access challenge) → [https://balancer.fi/pools](https://balancer.fi/pools) | The passed BIP-928 forum update specifies the wind-down and scheduled 30 November final pause, with limited exceptions. That date is future as of this review. Preserve needs_update; do not call every pool or contract already shut down. |
| banklessdao.md | hold | [https://bankless.community](https://bankless.community): 200 → [https://blackflagdao.notion.site/](https://blackflagdao.notion.site/)<br>[https://bankless.community/join](https://bankless.community/join): 200 → [https://blackflagdao.notion.site/](https://blackflagdao.notion.site/) | A Black Flag/Notion destination needs explicit continuity and current governance/product evidence. A redirected community page is not automatically the original DAO. |
| barnbridge.md | hold | [https://barnbridge.com](https://barnbridge.com): [Errno 8] nodename nor servname provided, or not known<br>[https://app.barnbridge.com](https://app.barnbridge.com): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| bitflyer.md | propose correction | [https://bitflyer.com](https://bitflyer.com): 200 → [https://bitflyer.com/en-eu/](https://bitflyer.com/en-eu/)<br>[https://bitflyer.com/en-jp/exchange](https://bitflyer.com/en-jp/exchange): 404 | The official regional homepage links Lightning; its rendered exchange lists BTC/EUR, ETH/EUR and BTC/JPY markets. The old /en-jp/exchange route is 404. This is public availability, not account eligibility or an exchange endorsement. |
| bitpanda-custody.md | hold | [https://www.bitpanda.com/en/custody](https://www.bitpanda.com/en/custody): 404 | Current official enterprise custody page and TrustVault documentation respond successfully, but the previous entity/product continuity concern has not been resolved through a current rendered service journey. Retain the hold; do not infer operation from old API documentation alone. |
| blocklords.md | hold | [https://blocklords.com](https://blocklords.com): 200 → [https://blocklords.com/en](https://blocklords.com/en) | The official site announces a change to BLOCKLORE AI creative canvas. Establish current Web3 functionality before replacing the blockchain-game profile. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| blocknative.md | propose exclusion | [https://www.blocknative.com](https://www.blocknative.com): 200 | The first-party notice says Blocknative API services and Gas Network ceased on 19 June 2026 and the team joined Deloitte. Exclude the standalone provider profile; research or team continuation is not the former API service. |
| blowfish.md | propose exclusion | [https://blowfish.xyz](https://blowfish.xyz): <urlopen error [SSL: SSLV3_ALERT_HANDSHAKE_FAILURE] ssl/tls alert handshake failure (_ssl.c:1081)> | Phantom explicitly says existing Blowfish customers were notified the current standalone service was sunset. Phantom still lists an internal Blowfish API on its status page. Exclude the independent customer offering, not all Blowfish technology or its integration inside Phantom. |
| blueshift.md | hold | [https://blueshift.fi/](https://blueshift.fi/): 200<br>[https://app.blueshift.fi/](https://app.blueshift.fi/): 200 | The application explicitly reports geographic restriction from this region. Restricted access is not closure evidence. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| breadcrumbs.md | propose correction | [https://www.breadcrumbs.app](https://www.breadcrumbs.app): 200<br>[https://www.breadcrumbs.app/pricing](https://www.breadcrumbs.app/pricing): 200 | Both original URLs now load, and the rendered pricing interface presents the current crypto analytics service and network data. The earlier hold is resolved by public product evidence, not solely HTTP 200. |
| bunzz.md | hold | [https://www.bunzz.dev/](https://www.bunzz.dev/): 200<br>[https://app.bunzz.dev/explorer](https://app.bunzz.dev/explorer): 200 | The rendered application explicitly reports maintenance. Do not promote a HTTP-200 maintenance screen or infer permanent closure from it. |
| bitvenus.md | hold | [https://www.bvox.com/](https://www.bvox.com/): 200 | The apparent BVOX successor needs a direct official continuity statement and a verified current product. A similar exchange brand or redirect alone is insufficient. |
| bware-labs.md | propose exclusion | [https://bwarelabs.com](https://bwarelabs.com): 530 | Alchemy confirms the acquisition and the official Blast API site says Blast products are no longer available. The original Bware site is unavailable; Alchemy already has a verified directory row. Exclude this obsolete standalone RPC/product profile without asserting that all validator operations or INFRA tokens ceased. |
| bydfi.md | hold | [https://www.bydfi.com](https://www.bydfi.com): 200<br>[https://www.bydfi.com/trade](https://www.bydfi.com/trade): 404 | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| cabin.md | hold | [https://cabin.city](https://cabin.city): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)> | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| canto.md | hold | [https://canto.io](https://canto.io): 402<br>[https://canto.io/ecosystem](https://canto.io/ecosystem): 402 | Official explorer and documentation candidates respond, but the original homepage is paused and current network/product activity is not independently established. Preserve the hold rather than claiming shutdown. |
| cellana-finance.md | hold | [https://cellana.finance](https://cellana.finance): [Errno 8] nodename nor servname provided, or not known<br>[https://app.cellana.finance](https://app.cellana.finance): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| centrifuge.md | propose correction | [https://centrifuge.io](https://centrifuge.io): 200<br>[https://app.centrifuge.io](https://app.centrifuge.io): 200 | Both original routes now load. The rendered application lists twelve tokenized funds with asset data; the earlier access challenge is no longer present. No investment, account or authorization test was performed. |
| ceramic.md | hold | [https://ceramic.network](https://ceramic.network): <urlopen error [SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error (_ssl.c:1081)><br>[https://developers.ceramic.network](https://developers.ceramic.network): 200 | The official transition preserves ceramic-one while deprecating ComposeDB. Its linked new Ceramic One documentation route is 404. Do not exclude the whole protocol based on ComposeDB retirement. |
| cess.md | hold | [https://cess.network/](https://cess.network/): The read operation timed out<br>[https://github.com/CESSProject/Whitepaper/blob/main/cess-whitepaper.pdf](https://github.com/CESSProject/Whitepaper/blob/main/cess-whitepaper.pdf): 200 | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| chainpatrol.md | hold | [https://chainpatrol.io](https://chainpatrol.io): 200 → [https://chainpatrol.com/](https://chainpatrol.com/)<br>[https://chainpatrol.io/platform](https://chainpatrol.io/platform): 404 → [https://chainpatrol.com/platform](https://chainpatrol.com/platform) | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| charmverse.md | hold | [https://charmverse.io](https://charmverse.io): 200<br>[https://app.charmverse.io](https://app.charmverse.io): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| civic.md | hold | [https://www.civic.com](https://www.civic.com): 200 | The current Civic/Bryn destination focuses on general business AI; continuity of the described crypto identity product is unresolved. Civic Pass retirement is separately scoped and does not prove all Civic services closed. |
| civic-pass.md | propose exclusion | [https://www.civic.com/pass](https://www.civic.com/pass): 404 | Civic explicitly discontinued CAPTCHA/ID verification on 1 July 2025 and uniqueness/liveness on 31 July 2025. Exclude Civic Pass, not Civic as a whole or its separate products. |
| coinfirm.md | hold | [https://www.coinfirm.com](https://www.coinfirm.com): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)><br>[https://www.coinfirm.com/products](https://www.coinfirm.com/products): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)> | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| commonwealth.md | propose correction | [https://commonwealth.im](https://commonwealth.im): 200 → [https://common.xyz/](https://common.xyz/)<br>[https://commonwealth.im/explore](https://commonwealth.im/explore): 200 → [https://common.xyz/explore](https://common.xyz/explore) | Both old routes redirect to Common. After rendering, Explore contains actual communities, token pairs and quests. The correction follows the current product brand and canonical routes; no legal merger or token assignment is inferred. |
| composedb.md | propose exclusion | [https://developers.ceramic.network](https://developers.ceramic.network): 200<br>[https://developers.ceramic.network/docs/composedb](https://developers.ceramic.network/docs/composedb): 404 → [https://developers.ceramic.network/docs/composedb/](https://developers.ceramic.network/docs/composedb/) | The official Ceramic transition notice deprecates js-ceramic/ComposeDB and directs users away from ComposeDB; the old product route is 404. Exclude the unsupported legacy product profile without asserting a precisely proven final shutdown date or that ceramic-one also ended. |
| conic-finance.md | propose exclusion | [https://www.conic.finance](https://www.conic.finance): 200 → [https://conic.finance/](https://conic.finance/)<br>[https://www.conic.finance/app](https://www.conic.finance/app): 200 → [https://conic.finance/app](https://conic.finance/app) | The project announcement says services were discontinued, all Omnipools closed and deposits disabled. A still-loading frontend does not establish a supported yield product. Contracts/source may remain available; do not claim withdrawals or every contract are impossible. |
| coreum.md | hold | [https://www.coreum.com](https://www.coreum.com): The read operation timed out<br>[https://www.coreum.com/ecosystem](https://www.coreum.com/ecosystem): The read operation timed out | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| corn.md | hold | [https://www.usecorn.com](https://www.usecorn.com): 200<br>[https://www.usecorn.com/build](https://www.usecorn.com/build): 404 | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| cypher-capital-markets.md | hold | [https://cyphercm.com](https://cyphercm.com): [Errno 8] nodename nor servname provided, or not known<br>[https://cyphercm.com/services](https://cyphercm.com/services): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| did-id.md | hold | [https://www.did.id](https://www.did.id): 525<br>[https://www.did.id/docs](https://www.did.id/docs): 525 | The listed project is a Kusama/Polkadot identity profile associated with dotdid. Search found the different .bit/d.id identity product; the similar name does not establish continuity and was not substituted. |
| dojoswap.md | hold | [https://dojoswap.xyz](https://dojoswap.xyz): 200<br>[https://dojoswap.xyz/swap](https://dojoswap.xyz/swap): 200 | Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| econia.md | propose exclusion | [https://www.econialabs.com](https://www.econialabs.com): [Errno 8] nodename nor servname provided, or not known<br>[https://www.econialabs.com/products](https://www.econialabs.com/products): [Errno 8] nodename nor servname provided, or not known | The official Econia Labs company announcement states it is winding down; the listed home/product domains do not resolve. Exclude the original provider profile, without asserting every integrator or deployed contract stopped. |
| eigenlayer.md | hold | [https://www.eigenlayer.xyz](https://www.eigenlayer.xyz): 200 → [https://www.eigencloud.xyz/](https://www.eigencloud.xyz/)<br>[https://app.eigenlayer.xyz](https://app.eigenlayer.xyz): 500 | Homepage now identifies EigenCloud while the listed app returns 500. Reconcile the restaking product and current onchain scope with the broader AI platform. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| ekubo.md | propose correction | [https://www.ekubo.org](https://www.ekubo.org): 200 → [https://ekubo.org/](https://ekubo.org/)<br>[https://app.ekubo.org](https://app.ekubo.org): 200 → [https://ekubo.org/](https://ekubo.org/) | Both old hostnames redirect to the canonical Ekubo interface. The rendered application includes network selection, swap controls and populated protocol volume/liquidity metrics. No swap or wallet connection was attempted. |
| figment.md | hold | [https://figment.io](https://figment.io): 403 (access challenge)<br>[https://figment.io/staking](https://figment.io/staking): 403 (access challenge) | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| finoa.md | propose partial correction keep hold | [https://finoa.io](https://finoa.io): 200 → [https://www.finoa.io/](https://www.finoa.io/)<br>[https://finoa.io/solutions](https://finoa.io/solutions): 404 → [https://www.finoa.io/solutions](https://www.finoa.io/solutions) | The first-party homepage explicitly says founded in 2019, correcting 2018. Listed /solutions and current custody/customer route candidates return 404; product availability remains unverified, so retain needs_update. |
| fleek.md | hold | [https://fleek.xyz](https://fleek.xyz): 200 → [https://www.fleek.sh/](https://www.fleek.sh/)<br>[https://fleek.xyz/products](https://fleek.xyz/products): 200 → [https://www.fleek.sh/](https://www.fleek.sh/) | A coming-soon/relaunch destination does not establish a currently supported version of the listed decentralized developer product. |
| flipside.md | hold | [https://flipsidecrypto.xyz](https://flipsidecrypto.xyz): 200 | Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| fluence.md | hold | [https://fluence.network](https://fluence.network): 200 → [https://fluence.ai/](https://fluence.ai/)<br>[https://fluence.network/developers](https://fluence.network/developers): 404 → [https://fluence.ai/developers](https://fluence.ai/developers) | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| fortunafi.md | hold | [https://www.fortunafi.com/](https://www.fortunafi.com/): 200<br>[https://app.gitbook.com/o/pKA4LZPny1hWRCEj2kx6/sites/site_2Pq6Y/](https://app.gitbook.com/o/pKA4LZPny1hWRCEj2kx6/sites/site_2Pq6Y/): 200 | Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| fractal-id.md | hold | [https://fractal.id](https://fractal.id): 503<br>[https://fractal.id/for-users](https://fractal.id/for-users): 503 | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| friends-with-benefits.md | propose correction | [https://www.fwb.help](https://www.fwb.help): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)><br>[https://www.fwb.help/membership](https://www.fwb.help/membership): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)> | The working official apex homepage, membership and About pages render. About confirms the governance token moved to Base in 2025; current membership is application/subscription based, so the old exclusively token-gated description is removed. No application, subscription or payment was made. |
| frigg-eco.md | hold | [https://www.frigg.eco/](https://www.frigg.eco/): 200<br>[https://app.frigg.eco/](https://app.frigg.eco/): 200 | Renewable-energy financing site and board render, but current crypto/onchain functionality remains unproven. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| fxhash.md | hold | [https://fxhash.xyz](https://fxhash.xyz): <urlopen error [Errno 61] Connection refused><br>[https://fxhash.xyz/explore](https://fxhash.xyz/explore): <urlopen error [Errno 61] Connection refused> | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| gelato.md | propose correction | [https://gelato.network](https://gelato.network): 200 → [https://gelato.cloud/](https://gelato.cloud/)<br>[https://docs.gelato.network](https://docs.gelato.network): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)> | The original homepage redirects to Gelato Cloud; the rendered current Paymaster & Bundler page describes ERC-4337/7702 infrastructure. Replace expired-certificate legacy documentation without bypassing TLS checks. This does not reverify the separate Web3 Functions product. |
| gelato-web3-functions.md | hold | [https://www.gelato.network/web3-functions](https://www.gelato.network/web3-functions): 200 → [https://gelato.cloud/](https://gelato.cloud/)<br>[https://docs.gelato.network/web3-services/web3-functions](https://docs.gelato.network/web3-services/web3-functions): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)> | Current legacy documentation has a certificate failure. A competitor sunset claim and historical official blog are insufficient first-party proof of the current retirement state. The separate Gelato Cloud correction does not reverify this product. |
| govrn.md | hold | [https://www.govrn.xyz](https://www.govrn.xyz): [Errno 8] nodename nor servname provided, or not known<br>[https://www.govrn.xyz/platform](https://www.govrn.xyz/platform): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| harmony.md | hold | [https://www.harmony.one](https://www.harmony.one): 200 | The current homepage describes AI video. Reconcile current blockchain product and metadata before retaining the original chain description. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| helika.md | hold | [https://www.helika.io](https://www.helika.io): 200 | Current first-party pages describe Helika Evolve AI-character infrastructure and a pivot from game analytics. A current crypto/Web3 product has not been established; do not include general AI solely because of the former Web3 business. |
| heymint.md | hold | [https://heymint.xyz](https://heymint.xyz): 402 | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| hmx.md | hold | [https://hmx.org](https://hmx.org): [Errno 8] nodename nor servname provided, or not known<br>[https://app.hmx.org](https://app.hmx.org): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| icon.md | propose partial correction keep hold | [https://icon.community](https://icon.community): 200<br>[https://icon.community/ecosystem](https://icon.community/ecosystem): 200 → [https://icon.community/ecosystem/](https://icon.community/ecosystem/) | The official ICON Foundation announcement sets 31 December 2026, still future at review time. Record the scheduled closure without treating the chain as already halted; keep needs_update. |
| intotheblock.md | propose correction | [https://app.intotheblock.com](https://app.intotheblock.com): 200 → [https://sentora.com/analytics-research](https://sentora.com/analytics-research) | The original official application redirects to a retirement/transition notice directing users to Sentora Research. The current Research page renders recent DeFi articles, reports and dashboards. This is a successor research profile, not a claim that the retired analytics API still works. Old-company year, HQ, networks and social identity are not carried into the successor without proof; a registered office is not treated as HQ. |
| ivendpay.md | hold | [https://ivendpay.com](https://ivendpay.com): [Errno 8] nodename nor servname provided, or not known<br>[https://ivendpay.com/products](https://ivendpay.com/products): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| jambo.md | propose correction | [https://jambo.technology](https://jambo.technology): [Errno 8] nodename nor servname provided, or not known<br>[https://jambo.technology/products](https://jambo.technology/products): [Errno 8] nodename nor servname provided, or not known | The www hostname works and officially links the JamboPhone shop. The rendered catalogue contains current phone products and identifies Jambo Technology; the old apex hostname fails. No purchase was made. |
| jediswap.md | hold | [https://www.jediswap.xyz](https://www.jediswap.xyz): [Errno 8] nodename nor servname provided, or not known<br>[https://app.jediswap.xyz](https://app.jediswap.xyz): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| jex.md | hold | [https://jex.trade](https://jex.trade): 200<br>[https://app.jex.trade](https://app.jex.trade): [Errno 8] nodename nor servname provided, or not known | The destination is a coming-soon placeholder. No working current exchange product or authoritative permanent shutdown evidence was established. |
| jokerace.md | hold | [https://jokerace.io](https://jokerace.io): 200 → [https://confetti.win/](https://confetti.win/)<br>[https://jokerace.io/explore](https://jokerace.io/explore): 404 → [https://confetti.win/explore](https://confetti.win/explore) | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| kadena.md | hold | [https://kadena.io](https://kadena.io): 200 → [https://www.kadena.io/](https://www.kadena.io/)<br>[https://kadena.io/ecosystem](https://kadena.io/ecosystem): 404 → [https://www.kadena.io/ecosystem](https://www.kadena.io/ecosystem) | Company cessation does not prove the permissionless community chain stopped. A current community product and chain continuity must be verified before changing the network profile. |
| kaito.md | hold | [https://kaito.ai](https://kaito.ai): 403 (access challenge)<br>[https://kaito.ai/platform](https://kaito.ai/platform): 403 (access challenge) | Search found an unrelated kaito.io payments company. Do not substitute it for the original kaito.ai crypto/InfoFi project without proven identity continuity. |
| kilt-protocol.md | hold | [https://www.kilt.io](https://www.kilt.io): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)> | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| kinto.md | hold | [https://www.kinto.xyz](https://www.kinto.xyz): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'www.kinto.xyz'. (_ssl.c:1081)><br>[https://www.kinto.xyz/build](https://www.kinto.xyz/build): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'www.kinto.xyz'. (_ssl.c:1081)> | Secondary sources report shutdown, but current first-party confirmation and the exact scope/date were not adequately resolved. Preserve the hold instead of presenting the reports as verified closure. |
| kriyadex.md | hold | [https://kriya.finance](https://kriya.finance): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| latoken.md | propose correction | [https://latoken.com](https://latoken.com): 200<br>[https://latoken.com/exchange](https://latoken.com/exchange): 200 | The existing exchange route renders populated token pairs, prices and market listings. Public product access resolves the previous hold; this is not a financial, regulatory or safety endorsement. |
| leap-wallet.md | hold | [https://www.leapwallet.io](https://www.leapwallet.io): 404<br>[https://www.leapwallet.io/download](https://www.leapwallet.io/download): 404 | A Compass-specific sunset is not proof that every Leap wallet product closed. Current supported wallet access and the original Leap identity still need confirmation. |
| leapfrog-wallet.md | hold | [https://leapfrogwallet.xyz](https://leapfrogwallet.xyz): [Errno 8] nodename nor servname provided, or not known<br>[https://leapfrogwallet.xyz/download](https://leapfrogwallet.xyz/download): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| li-fi.md | propose correction | [https://li.fi](https://li.fi): 200<br>[https://li.fi/products](https://li.fi/products): 404 | Official navigation opens the current API/SDK product page and current SDK documentation. The old /products route is 404. |
| lisk.md | propose exclusion | [https://lisk.com](https://lisk.com): 200<br>[https://lisk.com/ecosystem](https://lisk.com/ecosystem): 404 → [https://lisk.com/ecosystem/](https://lisk.com/ecosystem/) | The official founder update explicitly says Lisk Chain shut down on 2 November 2026. Exclude the obsolete L2-chain profile; the company continues a distinct stablecoin-finance business in early access, so this is not a claim the whole company closed. |
| logx.md | hold | [https://www.logx.trade](https://www.logx.trade): 200 → [https://www.logx.network/](https://www.logx.network/)<br>[https://www.logx.trade/trade](https://www.logx.trade/trade): 404 | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| lybra-finance.md | hold | [https://lybra.finance](https://lybra.finance): [Errno 8] nodename nor servname provided, or not known<br>[https://lybra.finance/app](https://lybra.finance/app): [Errno 8] nodename nor servname provided, or not known | Alternative LBR/Prisma-branded destinations are not proven successors of the listed Lybra lending product. Do not swap an unrelated or reused brand into this row. |
| lykke.md | hold | [https://www.lykke.com](https://www.lykke.com): 200 → [https://x.com/rundns](https://x.com/rundns)<br>[https://www.lykke.com/trade](https://www.lykke.com/trade): 404 | The old domain now routes to an unrelated social profile and the old trade route is unavailable. This establishes stale links, not a verified legal closure or safe replacement. |
| magic-eden.md | hold | [https://magiceden.io](https://magiceden.io): 403 (access challenge) | Access challenges prevent current product verification. Official wallet/EVM/Bitcoin product sunsets do not establish closure of the whole Solana NFT marketplace. |
| magic-eden-creator-hub.md | hold | [https://magiceden.io/launchpad](https://magiceden.io/launchpad): 403 (access challenge) | The creator product route and current supported chain scope still require verification. A Magic Eden wallet or chain-specific sunset must not be generalized to all creator products. |
| mango-markets.md | hold | [https://mango.markets](https://mango.markets): [Errno 8] nodename nor servname provided, or not known<br>[https://trade.mango.markets](https://trade.mango.markets): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| mars-protocol.md | hold | [https://marsprotocol.io](https://marsprotocol.io): [Errno 8] nodename nor servname provided, or not known<br>[https://app.marsprotocol.io](https://app.marsprotocol.io): [Errno 8] nodename nor servname provided, or not known | Search results include the unrelated Marscoin project. No official continuity or current replacement route was established for the listed Mars Protocol. |
| martian-wallet.md | hold | [https://martianwallet.xyz](https://martianwallet.xyz): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| masa.md | hold | [https://www.masa.finance](https://www.masa.finance): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)><br>[https://www.masa.finance/products](https://www.masa.finance/products): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)> | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| matr1x.md | hold | [https://matr1x.io](https://matr1x.io): <urlopen error timed out><br>[https://matr1x.io/games](https://matr1x.io/games): <urlopen error timed out> | Reported game shutdown or ecosystem changes were not resolved with sufficiently specific primary evidence. Do not generalize one game or token event to the whole listed ecosystem. |
| mercado-bitcoin.md | hold | [https://www.mercadobitcoin.com.br](https://www.mercadobitcoin.com.br): 200<br>[https://www.mercadobitcoin.com.br/trade](https://www.mercadobitcoin.com.br/trade): 404 | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| merkle-science.md | propose correction | [https://www.merklescience.com](https://www.merklescience.com): 200<br>[https://www.merklescience.com/products](https://www.merklescience.com/products): 404 | Official platform navigation opens the current Compass transaction and wallet monitoring service page. The old /products route is 404. |
| metaco.md | hold | [https://metaco.com](https://metaco.com): <urlopen error [Errno 54] Connection reset by peer><br>[https://metaco.com/platform](https://metaco.com/platform): <urlopen error [Errno 54] Connection reset by peer> | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| metalabel.md | hold | [https://www.metalabel.com](https://www.metalabel.com): 200<br>[https://www.metalabel.com/explore](https://www.metalabel.com/explore): 200 → [https://www.metalabel.com/not-found](https://www.metalabel.com/not-found) | The listed /explore route redirects to a soft-404 page. Current creative marketplace Web3 scope is not established by the homepage alone. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| metalcore.md | hold | [https://www.metalcore.gg](https://www.metalcore.gg): <urlopen error [SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error (_ssl.c:1081)> | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| midas.md | hold | [https://midas.app](https://midas.app): 403 (access challenge)<br>[https://midas.app/products](https://midas.app/products): 200 | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| mina-foundation.md | propose partial correction keep hold | [https://mina.foundation](https://mina.foundation): <urlopen error timed out><br>[https://minaprotocol.com](https://minaprotocol.com): 200 | The current official foundation site identifies its Swiss nonprofit status and November 2026 treasury/wind-down progress. Correct the domain, US HQ and active-steward description. The previous 2021 value matches mainnet launch, which does not establish foundation incorporation; leave it unknown. Keep needs_update pending completion/continuity of the organizational handover; do not mark the Mina network retired. |
| mintbase.md | hold | [https://www.mintbase.xyz](https://www.mintbase.xyz): 402 | An official rebrand toward Bitte exists, but the current Bitte deployment is paused. A redirect/rebrand does not establish a working agent service. |
| mirror.md | hold | [https://mirror.xyz](https://mirror.xyz): 200 → [https://paragraph.com/](https://paragraph.com/)<br>[https://mirror.xyz/discover](https://mirror.xyz/discover): 200 → [https://paragraph.com/](https://paragraph.com/) | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| mocana-gaming.md | hold | [https://mocanagaming.com](https://mocanagaming.com): [Errno 8] nodename nor servname provided, or not known<br>[https://mocanagaming.com/games](https://mocanagaming.com/games): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| mocaverse.md | propose correction | [https://www.mocaverse.xyz](https://www.mocaverse.xyz): 200 | The existing site renders current Moca Network identity features, AIR ID statistics, MOCA material, quests and dated ecosystem news after loading. No identity was created or claim submitted. |
| moonbeam.md | propose partial correction keep hold | [https://moonbeam.network](https://moonbeam.network): 200<br>[https://moonbeam.network/build](https://moonbeam.network/build): 404 | Current official docs explicitly identify a pre-launch Base agent protocol, not the old Polkadot platform. They state joining is not open and the SDK is not published to npm. Correct the stale profile but keep needs_update; this is not approval of a live agent service. |
| moonriver.md | propose exclusion | [https://moonbeam.network/networks/moonriver](https://moonbeam.network/networks/moonriver): 404 | The official migration notice put the legacy parachain into transaction-rejecting maintenance from 1 August 2026 while blocks may continue during wind-down. Exclude the inactive parachain profile without declaring the MOVR token or every block producer gone. |
| moonwell.md | propose correction | [https://moonwell.fi](https://moonwell.fi): 200<br>[https://app.moonwell.fi](https://app.moonwell.fi): [Errno 8] nodename nor servname provided, or not known | The official Launch App link opens the rendered lending/vault discovery interface. Current homepage network labels are Ethereum, Base and Optimism; the old app hostname does not resolve. No lending transaction was attempted. |
| movebit.md | propose correction | [https://movebit.xyz/](https://movebit.xyz/): 200 | Current first-party site identifies Move audits for Aptos and Sui and links the public MoveBit report repository. The rendered report portfolio provides a concrete service output; an empty /ListReports page is not used as evidence. Unknown founding year/HQ remain unknown. |
| movement-labs.md | hold | [https://movementlabs.xyz](https://movementlabs.xyz): [Errno 8] nodename nor servname provided, or not known<br>[https://movementlabs.xyz/ecosystem](https://movementlabs.xyz/ecosystem): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| neutron.md | hold | [https://neutron.org](https://neutron.org): 200 → [https://x.com/neutron_org/status/2072037746424603130](https://x.com/neutron_org/status/2072037746424603130) | The current destination includes an official withdrawal/CLI guide rather than a verified ordinary product. Scope and current network state remain unresolved; do not infer a whole-chain shutdown. |
| nod-games.md | hold | [https://nodgames.io](https://nodgames.io): [Errno 8] nodename nor servname provided, or not known<br>[https://nodgames.io/games](https://nodgames.io/games): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| notional-finance.md | hold | [https://notional.finance](https://notional.finance): 200<br>[https://app.notional.finance](https://app.notional.finance): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| nyan-heroes.md | hold | [https://nyanheroes.com](https://nyanheroes.com): [Errno 8] nodename nor servname provided, or not known<br>[https://nyanheroes.com/game](https://nyanheroes.com/game): [Errno 8] nodename nor servname provided, or not known | Reported shutdown requires current primary-source reconciliation. Missing routes and secondary reporting alone do not establish the exact company/game state. |
| nydig.md | propose correction | [https://nydig.com](https://nydig.com): 200 → [https://www.nydig.com/](https://www.nydig.com/)<br>[https://nydig.com/solutions](https://nydig.com/solutions): 404 → [https://www.nydig.com/solutions](https://www.nydig.com/solutions) | Current first-party homepage and Power & Compute service page describe Bitcoin mining infrastructure. Replace the missing /solutions route and custody-led description; this does not establish that all historical custody services ceased. |
| oklink.md | hold | [https://www.oklink.com](https://www.oklink.com): 200 | A marketing/interface shell loads, but current live explorer data was not established in the observed product state. Preserve the earlier hold. |
| oncyber.md | hold | [https://oncyber.io](https://oncyber.io): 200<br>[https://oncyber.io/spaces](https://oncyber.io/spaces): 200 | Rendered template controls do not establish a populated, supported gallery; documentation redirects to AWE. Current product/entity continuity remains unproven. |
| openaudit.md | hold | [https://openaudit.org](https://openaudit.org): 200<br>[https://openaudit.org/marketplace](https://openaudit.org/marketplace): 200 | The current destination is a coming-soon placeholder. Do not substitute a different similarly named audit product. |
| openlaw.md | hold | [https://openlaw.io](https://openlaw.io): [Errno 8] nodename nor servname provided, or not known<br>[https://openlaw.io/products](https://openlaw.io/products): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| opyn.md | hold | [https://www.opyn.co](https://www.opyn.co): 200 | Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| parallel-finance.md | hold | [https://parallel.fi](https://parallel.fi): 200<br>[https://app.parallel.fi](https://app.parallel.fi): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| penumbra.md | hold | [https://penumbra.zone](https://penumbra.zone): 403<br>[https://penumbra.zone/learn](https://penumbra.zone/learn): 403 | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| persistence.md | hold | [https://persistence.one/history/](https://persistence.one/history/): 200<br>[https://docs.persistence.one/](https://docs.persistence.one/): 200 | The homepage leads to a history page. Available documentation does not establish a supported current product or unchanged network identity. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| pirate-nation.md | hold | [https://piratenation.game](https://piratenation.game): 403 (access challenge)<br>[https://piratenation.game/play](https://piratenation.game/play): 403 (access challenge) | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| pizzadao.md | hold | [https://www.pizzadao.xyz](https://www.pizzadao.xyz): 200 → [https://globalpizza.party/](https://globalpizza.party/) | The current Global Pizza Party event does not by itself establish continuity of the described DAO/governance product. |
| platypus-finance.md | hold | [https://platypus.finance](https://platypus.finance): 200<br>[https://app.platypus.finance](https://app.platypus.finance): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| playember.md | hold | [https://playember.com](https://playember.com): 200<br>[https://playember.com/games](https://playember.com/games): 200 | Current rendered pages focus on mobile apps, Stripe payments and analytics; a legacy Web3 meta description does not establish a current onchain product. The old games route is missing. |
| pleasrdao.md | hold | [https://pleasr.org](https://pleasr.org): The read operation timed out | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| prisma-finance.md | hold | [https://www.prismafinance.com](https://www.prismafinance.com): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self-signed certificate (_ssl.c:1081)><br>[https://app.prismafinance.com](https://app.prismafinance.com): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| pudgy-penguins.md | hold | [https://www.pudgypenguins.com](https://www.pudgypenguins.com): 403 (access challenge)<br>[https://www.pudgypenguins.com/collections](https://www.pudgypenguins.com/collections): 403 (access challenge) | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| qredo.md | hold | [https://www.qredo.com](https://www.qredo.com): 200 | Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| quasar.md | hold | [https://quasar.fi](https://quasar.fi): 200<br>[https://app.quasar.fi](https://app.quasar.fi): 200 | The current transition/deprecation message points toward Tower.fi, but a current working successor product and metadata continuity were not established. Keep the old vault profile held. |
| questbook.md | hold | [https://questbook.app](https://questbook.app): 200<br>[https://questbook.app/dashboard](https://questbook.app/dashboard): 404 → [https://questbook.app/dashboard/&chainId=10/](https://questbook.app/dashboard/&chainId=10/) | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| raft.md | hold | [https://raft.fi](https://raft.fi): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'raft.fi'. (_ssl.c:1081)> | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| rage-trade.md | hold | [https://www.rage.trade](https://www.rage.trade): 402<br>[https://app.rage.trade](https://app.rage.trade): 402 | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| redefine-security.md | hold | [https://redefine.security](https://redefine.security): [Errno 8] nodename nor servname provided, or not known<br>[https://redefine.security/services](https://redefine.security/services): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| reservoir.md | hold | [https://reservoir.tools](https://reservoir.tools): 429 (access challenge)<br>[https://docs.reservoir.tools](https://docs.reservoir.tools): 200 → [https://docs.relay.link/](https://docs.relay.link/) | Old developer route now leads to Relay documentation and the homepage is access-challenged. Reconcile NFT infrastructure versus successor bridging product. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| rootstock.md | propose correction | [https://rootstock.io](https://rootstock.io): 200<br>[https://rootstock.io/developers](https://rootstock.io/developers): 404 → [https://rootstock.io/developers/](https://rootstock.io/developers/) | Official Documentation navigation opens a current Bitcoin-sidechain developer portal with quickstarts and tools. The old /developers route is 404. |
| saakuru.md | hold | [https://saakuru.com](https://saakuru.com): 200 → [https://www.saakuru.com/](https://www.saakuru.com/)<br>[https://saakuru.com/build](https://saakuru.com/build): 404 → [https://www.saakuru.com/build](https://www.saakuru.com/build) | The destination now emphasizes general AI rather than the described chain/developer offering. Current crypto/Web3 scope and supported legacy product remain unresolved. |
| saga.md | hold | [https://www.saga.xyz](https://www.saga.xyz): 200 → [https://saga.xyz/](https://saga.xyz/) | The destination presents an AI-oriented offering. Current chain/product continuity and crypto/Web3 relevance remain unresolved; historical branding is insufficient. |
| shrapnel.md | hold | [https://www.shrapnel.com](https://www.shrapnel.com): 200<br>[https://www.shrapnel.com/play](https://www.shrapnel.com/play): 404 | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| simplehash.md | propose exclusion | [https://simplehash.com](https://simplehash.com): 404<br>[https://simplehash.readme.io](https://simplehash.readme.io): 200 → [https://docs.simplehash.com/password?redirect=%2F](https://docs.simplehash.com/password?redirect=%2F) | Phantom announces the acquisition and sunset of the standalone customer service. The old public site is 404 and documentation is no longer public. Exclude the independent API provider; do not claim its internal Phantom technology ceased. |
| skynet-security.md | hold | [https://skynet.security](https://skynet.security): [Errno 8] nodename nor servname provided, or not known<br>[https://skynet.security/products](https://skynet.security/products): [Errno 8] nodename nor servname provided, or not known | Search returns unrelated Skynet AI, cloud and other security products. No official replacement or identity continuity was established for this exact row. |
| solanafm.md | hold | [https://solana.fm/](https://solana.fm/): 200 | Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| solend.md | hold | [https://solend.fi](https://solend.fi): 503<br>[https://solend.fi/dashboard](https://solend.fi/dashboard): 503 | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| sosovalue.md | propose correction | [https://sosovalue.com](https://sosovalue.com): 200<br>[https://sosovalue.com/markets](https://sosovalue.com/markets): 404 | Official navigation opens rendered crypto market charts and dated metrics. The old /markets route is 404. |
| spectral-syntax.md | hold | [https://www.spectrallabs.xyz/](https://www.spectrallabs.xyz/): 200<br>[https://app.thegrid.ai/consumption](https://app.thegrid.ai/consumption): 200 | The current Grid inference product does not by itself demonstrate a crypto/Web3 agent product. Model tokens are not evidence of blockchain/token integration; preserve the scope hold. |
| spheron.md | hold | [https://spheron.network](https://spheron.network): 200 → [https://www.spheron.network/](https://www.spheron.network/)<br>[https://spheron.network/products](https://spheron.network/products): 404 → [https://www.spheron.network/products/](https://www.spheron.network/products/) | Current compute/AI pages need proof of a supported crypto/Web3 product and continuity with the original network. Do not generalize all AI infrastructure into the agent category. |
| spruceid.md | hold | [https://www.spruceid.com](https://www.spruceid.com): 200 → [https://spruceid.com/](https://spruceid.com/)<br>[https://www.spruceid.com/products](https://www.spruceid.com/products): 404 → [https://spruceid.com/products](https://spruceid.com/products) | Current identity products need a verified current crypto/Web3 application; digital identity alone does not establish the listed onchain scope. |
| stella.md | hold | [https://www.stella.org](https://www.stella.org): <urlopen error timed out><br>[https://www.stella.org/app](https://www.stella.org/app): <urlopen error [Errno 65] No route to host> | Stella/Stellar and other similarly named finance products are not interchangeable. The original profile identity and a working official product are unresolved. |
| story-protocol.md | propose correction | [https://story.foundation](https://story.foundation): 200 → [https://www.datafdn.org/](https://www.datafdn.org/)<br>[https://story.foundation/ecosystem](https://story.foundation/ecosystem): 404 → [https://www.datafdn.org/ecosystem](https://www.datafdn.org/ecosystem) | The official rebrand announcement explicitly maps Story to DATA Foundation, IP to DATA, and Story Network to DATA Network. Trace renders a current public provenance registry. Current documentation says the independent chain continues until the planned Sui upgrade; Sui is not claimed as an already completed deployment. Existing founding/HQ fields are retained as legacy metadata, not newly authenticated. |
| superfluid-governance.md | propose correction | [https://www.superfluid.finance](https://www.superfluid.finance): 200<br>[https://www.superfluid.finance/dao](https://www.superfluid.finance/dao): 404 | The corporate site links the protocol homepage; the current governance page renders discussion and voting routes. The protocol explicitly identifies SUP, correcting the unrelated SUPER symbol. No vote or governance action was submitted. |
| swarm-markets.md | propose partial correction keep hold | [https://swarm.com](https://swarm.com): 200 → [https://app.swarm.markets/](https://app.swarm.markets/)<br>[https://app.swarm.com](https://app.swarm.com): 200 → [https://app.swarm.markets/](https://app.swarm.markets/) | The rendered application and issuer notice identify those specific terminated products and the remaining claims period. Correct the active-RWA description and keep needs_update: this does not establish that every Swarm company or dOTC service ceased. No terms, KYC or redemption action was accepted. |
| tableland.md | hold | [https://tableland.xyz](https://tableland.xyz): 200 → [https://x.com/RecallLabs_/status/2116235386582426069](https://x.com/RecallLabs_/status/2116235386582426069)<br>[https://docs.tableland.xyz](https://docs.tableland.xyz): 200 → [https://x.com/RecallLabs_/status/2116235386582426069](https://x.com/RecallLabs_/status/2116235386582426069) | The original links now lead toward Recall Labs wind-down material. That does not independently prove every Tableland protocol deployment or community product ceased. |
| the-beacon.md | hold | [https://www.thebeacon.gg](https://www.thebeacon.gg): 404<br>[https://www.thebeacon.gg/play](https://www.thebeacon.gg/play): 404 | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| the-sandbox.md | hold | [https://www.sandbox.game](https://www.sandbox.game): 403 (access challenge)<br>[https://www.sandbox.game/en/create](https://www.sandbox.game/en/create): 403 (access challenge) | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| thruster.md | hold | [https://www.thruster.finance](https://www.thruster.finance): [Errno 8] nodename nor servname provided, or not known<br>[https://www.thruster.finance/swap](https://www.thruster.finance/swap): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| tokenlogic.md | hold | [https://tokenlogic.xyz](https://tokenlogic.xyz): 200 → [https://www.tokenlogic.xyz/](https://www.tokenlogic.xyz/)<br>[https://tokenlogic.xyz/research](https://tokenlogic.xyz/research): 404 → [https://www.tokenlogic.xyz/research](https://www.tokenlogic.xyz/research) | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| trader-joe.md | hold | [https://www.traderjoexyz.com](https://www.traderjoexyz.com): 403 (access challenge) → [https://lfj.gg/?utm_source=TJdomain&utm_medium=referral&utm_campaign=redirect](https://lfj.gg/?utm_source=TJdomain&utm_medium=referral&utm_campaign=redirect)<br>[https://traderjoexyz.com/avalanche/trade](https://traderjoexyz.com/avalanche/trade): 403 (access challenge) → [https://lfj.gg/avalanche/trade?utm_source=TJdomain&utm_medium=referral&utm_campaign=redirect](https://lfj.gg/avalanche/trade?utm_source=TJdomain&utm_medium=referral&utm_campaign=redirect) | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| trailblaze-security.md | hold | [https://trailblaze.security](https://trailblaze.security): [Errno 8] nodename nor servname provided, or not known<br>[https://trailblaze.security/platform](https://trailblaze.security/platform): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| treasure-dao.md | hold | [https://www.treasure.lol](https://www.treasure.lol): 200 → [https://treasure.lol/](https://treasure.lol/)<br>[https://market.treasure.lol](https://market.treasure.lol): [Errno 8] nodename nor servname provided, or not known | The homepage advertises Forever Software/coming-soon agent infrastructure and the old product hostname fails. Current in-scope active product unverified. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| vechain-foundation.md | hold | [https://www.vechain.org](https://www.vechain.org): 200 → [https://vechain.org/](https://vechain.org/)<br>[https://www.vechain.org/ecosystem](https://www.vechain.org/ecosystem): 404 → [https://vechain.org/ecosystem](https://vechain.org/ecosystem) | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| vela-exchange.md | hold | [https://vela.exchange](https://vela.exchange): The read operation timed out<br>[https://app.vela.exchange](https://app.vela.exchange): 301 → [https://app.vela.exchange/](https://app.vela.exchange/) | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| verite.md | hold | [https://verite.id](https://verite.id): 404 → [https://developers.circle.com/circle-research/docs](https://developers.circle.com/circle-research/docs)<br>[https://verite.id/docs](https://verite.id/docs): 404 → [https://developers.circle.com/circle-research/docs](https://developers.circle.com/circle-research/docs) | A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| vertex-protocol.md | propose exclusion | [https://vertexprotocol.com](https://vertexprotocol.com): 404 | The issuer announcement specifies the legacy EVM deployments will cease and VRTX will be sunset as the team joins Ink Foundation. The old homepage is now 404. Exclude that legacy profile without automatically replacing it with a future Ink product. |
| watchpug.md | propose partial correction keep hold | [https://watchpug.com](https://watchpug.com): 404 | Correct the official auditor domain, corroborated by a client audit-report repository. The current minimal service/contact page does not establish a maintained product or report portfolio. Keep needs_update; no client repository is substituted as the auditor product. |
| web3-storage.md | hold | [https://web3.storage](https://web3.storage): 200 → [https://www.fil.one/](https://www.fil.one/)<br>[https://web3.storage/docs](https://web3.storage/docs): 200 → [https://www.fil.one/](https://www.fil.one/) | Current domain redirects to FilOne and its docs identify Filecoin backing, resolving generic-Web3 scope only. Operator continuity with the original Web3.Storage remains unproven; do not silently substitute FilOne or Storacha. |
| wildcard.md | propose correction | [https://wildcardgame.com](https://wildcardgame.com): 200 | The official site links the released Steam game; the Steam developer/publisher identity and website backlink match Wildcard. The official Wildpass migration article confirms Ethereum context. The homepage teaser alone is not mistaken for a game shutdown. Nothing was installed or purchased. |
| xai.md | hold | [https://xai.games](https://xai.games): 403 (access challenge)<br>[https://xai.games/ecosystem](https://xai.games/ecosystem): 403 (access challenge) | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| youves.md | hold | [https://app.youves.com](https://app.youves.com): 200<br>[https://app.youves.com/](https://app.youves.com/): 200 | The rendered interface reports maintenance, displays unavailable APR values and no active vaults. This is not enough to verify an active service or assert permanent retirement. |
| zebpay.md | hold | [https://zebpay.com](https://zebpay.com): 403<br>[https://zebpay.com/exchange](https://zebpay.com/exchange): 403 | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| zengo.md | hold | [https://zengo.com](https://zengo.com): 200<br>[https://zengo.com/download](https://zengo.com/download): 403 (access challenge) | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| zeta-markets.md | propose exclusion | [https://zetamarkets.com](https://zetamarkets.com): 200<br>[https://dex.zeta.markets](https://dex.zeta.markets): 200 | Official documentation says the protocol ceased in May 2025 and the final-epoch page disables trading from 1 May. A legacy frontend returning 200 is not an active exchange. Exclude the legacy perp venue without silently substituting Bullet. |
| zipmex.md | hold | [https://zipmex.com](https://zipmex.com): 200<br>[https://zipmex.com/trade](https://zipmex.com/trade): 404 → [https://zipmex.com/trade/](https://zipmex.com/trade/) | The current Solana DeFi branding does not establish continuity with the former regional exchange. Preserve the hold against possible domain/brand reuse. |
| zkfair.md | hold | [https://zkfair.io](https://zkfair.io): 403 (access challenge)<br>[https://zkfair.io/ecosystem](https://zkfair.io/ecosystem): 403 (access challenge) | Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| zkswap-finance.md | hold | [https://zkswap.finance](https://zkswap.finance): [Errno 8] nodename nor servname provided, or not known<br>[https://zkswap.finance/app](https://zkswap.finance/app): [Errno 8] nodename nor servname provided, or not known | Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
