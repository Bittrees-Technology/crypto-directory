# Held-entry link review — 25 November 2026

This review follows [draft PR #53](https://github.com/Bittrees-Technology/crypto-directory/pull/53), which itself depends on [draft PR #52](https://github.com/Bittrees-Technology/crypto-directory/pull/52). Its exact source base is `377abb413f0f02e11882322fca5bd7a0b9177e11`. All **117** remaining held rows received a separate focused search for current official products, identity continuity and retirement evidence. This pass added **69 distinct bounded HTTP checks** and selected normal-browser observations. Earlier listed-link receipts are reused with their original timestamps; this is not a claim that every original URL was freshly fetched again.

**Proposed outcome: seven corrected/reverified listings, seven limited corrections that stay held, 11 exclusions and 92 unchanged holds.** This leaves **99 needs_update** records. Together with its prerequisites, the proposal preserves all 1,534 source records: **1,333 verified, 102 rejected and 99 needs_update**. These are proposed source counts, not production counts.

Exclusions mark `verification_status: rejected` and retain each source file and history. Retired products, non-distinct ecosystem placeholders and out-of-scope companies have separate reasons. An unavailable URL, acquisition, archived repository, temporary maintenance, geographical restriction or HTTP-200 shell alone is not shutdown proof. A current public offering is not authenticated product acceptance or a security, compliance or investment endorsement. Unchanged historical metadata is not represented as freshly verified; unknown successor metadata stays unknown.

This draft changes reviewed content and this evidence ledger only. It does not execute native/MCP actions as raging.eth, grant roles, create accounts, sign messages, connect wallets, subscribe, install third-party code or perform a claim, recovery or transaction. Private browser/session UI and machine details are excluded. Browser observation links can include unavailable or incomplete rendered states; each rationale states what was actually established.

The PR is stacked on PR #53 to avoid repeating earlier changes. It must be retargeted to main after the prerequisite merges, and the existing required hosted checks must pass there before any later approval/merge/release. Existing CI triggers only main/surf-production bases, so a stacked draft has no hosted CI result. No auto-merge or deployment is enabled.

## Proposed changes

### Aleo — propose correction

Source: [content/projects/aleo.md](../../../content/projects/aleo.md); original blob `cd63f90a0550d35d635fd3164aab40ce0382a782`.

The current foundation site and its populated ecosystem catalogue establish the network and a usable project-discovery product. Replace the challenged developer redirect with the exact plural /ecosystems/ route; this does not verify every third-party application in that catalogue.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://developer.aleo.org"` | `"https://aleo.org/ecosystems/"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://aleo.org](https://aleo.org) — 200; checked `2026-11-24T22:43:08.981417+00:00`
- [https://developer.aleo.org](https://developer.aleo.org) — 403 (access challenge) → [https://docs.aleo.org/](https://docs.aleo.org/); checked `2026-11-24T22:43:08.981468+00:00`
- [https://aleo.org/](https://aleo.org/) — 200; checked `2026-11-25T01:17:06.992587+00:00`
- [https://aleo.org/ecosystems/](https://aleo.org/ecosystems/) — 200; checked `2026-11-25T01:17:06.993187+00:00`

Rendered observations: [https://aleo.org/ecosystems/](https://aleo.org/ecosystems/) (`2026-11-25T01:18:36.839Z`).

### Aleo Wallet — propose exclusion

Source: [content/projects/aleo-wallet.md](../../../content/projects/aleo-wallet.md); original blob `136988982267d4b6fd65248b69d2e1a78e401b57`.

Exclude the generic ecosystem placeholder, not Aleo or any named wallet. The foundation explicitly says Aleo has no official wallet and lists independently named wallets instead. This row's same stale ecosystem URL in both fields does not identify a separate project; the retained Aleo network entry now links its current catalogue.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://aleo.org/ecosystem#wallets](https://aleo.org/ecosystem#wallets) — 200; checked `2026-11-24T22:43:08.981507+00:00`
- [https://aleo.org/post/aleo-mainnet-faq/](https://aleo.org/post/aleo-mainnet-faq/) — 200; checked `2026-11-25T01:17:06.993289+00:00`
- [https://aleo.org/ecosystems/](https://aleo.org/ecosystems/) — 200; checked `2026-11-25T01:17:06.993187+00:00`

### Anzen — propose partial correction keep hold

Source: [content/projects/anzen.md](../../../content/projects/anzen.md); original blob `32ad390f8a9d0c170805607ba3a3a568d42c6a58`.

The rendered official application explicitly announces cessation on 15 December 2026 and exposes the current transparency route. Correct the product link and present wind-down state; retain needs_update. The deadline is future as of this review, so this is not an assertion that all operations already ceased. Zero/unavailable figures and malformed explorer links were not accepted as healthy reserve data. No withdrawal or wallet action occurred.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://anzen.finance/app"` | `"https://app.anzen.finance/transparency"` |
| description | `"Protocol offering collateralized real-world credit exposure onchain."` | `"USDz stablecoin and tokenized-credit protocol in wind-down, with operations scheduled to cease on 15 December 2026."` |

Evidence:

- [https://anzen.finance](https://anzen.finance) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:09.451370+00:00`
- [https://anzen.finance/app](https://anzen.finance/app) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:09.542621+00:00`
- [https://app.anzen.finance/transparency](https://app.anzen.finance/transparency) — 200; checked `2026-11-25T01:17:12.780241+00:00`

Rendered observations: [https://app.anzen.finance/transparency](https://app.anzen.finance/transparency) (`2026-11-25T01:24:22.312Z`).

### Aptos Wallet — propose exclusion

Source: [content/projects/aptos-wallet.md](../../../content/projects/aptos-wallet.md); original blob `c621b6a74c8640332f2fa41e53702f716f763010`.

Exclude the non-distinct generic wallet placeholder. The current official wallet category is a catalogue of individually named projects, including Petra, rather than an application called Aptos Wallet. Aptos and Petra retain their own source rows. Do not silently replace the generic row with a different wallet operator or claim Aptos wallets closed.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://aptosfoundation.org/ecosystem/wallets](https://aptosfoundation.org/ecosystem/wallets) — 429 (access challenge); checked `2026-11-24T22:43:09.545075+00:00`
- [https://aptosnetwork.com/ecosystem/directory/category/wallets](https://aptosnetwork.com/ecosystem/directory/category/wallets) — 429 (access challenge); checked `2026-11-25T01:17:13.018317+00:00`

### Cabin — propose exclusion

Source: [content/projects/cabin.md](../../../content/projects/cabin.md); original blob `72179158ec827b943f4ba94adc19cab00ae73465`.

The original Cabin announcement dated 7 May 2025 explicitly confirms an approved DAO wind-down and treasury distribution while continuing as an informal community network. The indexed official site also describes the formal DAO ending in 2025. Exclude the obsolete onchain-governance organization profile; do not declare every neighborhood or spun-out project closed. The site's expired certificate was not bypassed.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://cabin.city](https://cabin.city) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)>; checked `2026-11-24T22:43:13.934569+00:00`
- [https://x.com/cabindotcity/status/1920220527530225764](https://x.com/cabindotcity/status/1920220527530225764) — 200; checked `2026-11-25T01:20:46.463496+00:00`
- [https://cabin.city/](https://cabin.city/) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)>; checked `2026-11-25T01:17:06.993797+00:00`

Rendered observations: [https://x.com/cabindotcity/status/1920220527530225764](https://x.com/cabindotcity/status/1920220527530225764) (`2026-11-25T01:19:20.125Z`).

### Ceramic — propose correction

Source: [content/projects/ceramic.md](../../../content/projects/ceramic.md); original blob `9e694526ba5d7830c8733bfbc92793cb9f24cbad`.

The official documentation and exact installation guide render, identify the node and SDK, and link the public Rust implementation. Replace the unavailable marketing origin with the developer site. The earlier failing intermediate documentation path was not the installation page. This verifies a published developer offering, not an installation or a revival of retired ComposeDB services.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://ceramic.network"` | `"https://developers.ceramic.network/"` |
| product_url | `"https://developers.ceramic.network"` | `"https://developers.ceramic.network/docs/protocol/ceramic-one/usage/installation"` |
| description | `"Decentralized data network for user-owned application data."` | `"Open-source decentralized event-stream protocol and Ceramic One node/SDK for application data."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://ceramic.network](https://ceramic.network) — <urlopen error [SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error (_ssl.c:1081)>; checked `2026-11-24T22:43:14.560887+00:00`
- [https://developers.ceramic.network](https://developers.ceramic.network) — 200; checked `2026-11-24T22:43:14.678986+00:00`
- [https://developers.ceramic.network/](https://developers.ceramic.network/) — 200; checked `2026-11-25T01:17:06.993419+00:00`
- [https://developers.ceramic.network/docs/protocol/ceramic-one/usage/installation](https://developers.ceramic.network/docs/protocol/ceramic-one/usage/installation) — 200; checked `2026-11-25T01:17:06.993626+00:00`
- [https://github.com/ceramicnetwork/rust-ceramic](https://github.com/ceramicnetwork/rust-ceramic) — 200; checked `2026-11-25T01:20:46.462861+00:00`

Rendered observations: [https://developers.ceramic.network/docs/protocol/ceramic-one/usage/installation](https://developers.ceramic.network/docs/protocol/ceramic-one/usage/installation) (`2026-11-25T01:18:25.996Z`).

### CESS — propose partial correction keep hold

Source: [content/projects/cess.md](../../../content/projects/cess.md); original blob `934a750471f0925783a760ae55c865ae0694dbde`.

The official CESS repository provides the node-management software and identifies its relationship to the network, replacing the whitepaper masquerading as a product. Retain needs_update because current requests to the official homepage time out and this did not independently establish a live storage service. No code or node was installed or executed.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://github.com/CESSProject/Whitepaper/blob/main/cess-whitepaper.pdf"` | `"https://github.com/CESSProject/cess-nodeadm"` |

Evidence:

- [https://cess.network/](https://cess.network/) — The read operation timed out; checked `2026-11-25T01:17:08.166145+00:00`
- [https://github.com/CESSProject/Whitepaper/blob/main/cess-whitepaper.pdf](https://github.com/CESSProject/Whitepaper/blob/main/cess-whitepaper.pdf) — 200; checked `2026-11-24T22:43:15.022443+00:00`
- [https://cess.network/](https://cess.network/) — The read operation timed out; checked `2026-11-25T01:17:08.166145+00:00`
- [https://github.com/CESSProject/cess-nodeadm](https://github.com/CESSProject/cess-nodeadm) — 200; checked `2026-11-25T01:17:08.198870+00:00`
- [https://github.com/CESSProject/cess/releases](https://github.com/CESSProject/cess/releases) — 200; checked `2026-11-25T01:17:08.382598+00:00`

### CharmVerse — propose exclusion

Source: [content/projects/charmverse.md](../../../content/projects/charmverse.md); original blob `58dd936fb760356309d68aca9044e3c10f708d78`.

The original official-account post dated 25 March 2026 explicitly announces shutdown of operations on 30 April; the thread states the platform cannot continue being supported. This passed date and whole-platform scope resolve the earlier year/scope uncertainty. Exclude the retired DAO workspace, without treating another project's old grant link as proof of continued operation.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://charmverse.io](https://charmverse.io) — 200; checked `2026-11-24T22:43:15.880447+00:00`
- [https://app.charmverse.io](https://app.charmverse.io) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:15.907002+00:00`
- [https://x.com/CharmVerse/status/2036766170158674264](https://x.com/CharmVerse/status/2036766170158674264) — 200; checked `2026-11-25T01:20:48.201857+00:00`

Rendered observations: [https://x.com/CharmVerse/status/2036766170158674264](https://x.com/CharmVerse/status/2036766170158674264) (`2026-11-25T01:20:01.908Z`).

### Coinfirm — propose correction

Source: [content/projects/coinfirm.md](../../../content/projects/coinfirm.md); original blob `0fbbd2315f7d2e11a70897968bd056029ef4b43f`.

Lukka's acquisition announcement explicitly describes integration of the Coinfirm team and products into its analytics offering. Its current November 2026 product sheet describes that offered analytics service and the public service status is available. Replace the dead standalone Coinfirm routes. Unknown successor founding/HQ/social fields are cleared rather than transferring predecessor company metadata to the combined product. This is not an independent endorsement of compliance, security or vendor performance.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"Coinfirm"` | `"Lukka Blockchain Analytics (Coinfirm)"` |
| primary_url | `"https://www.coinfirm.com"` | `"https://lukka.tech/"` |
| product_url | `"https://www.coinfirm.com/products"` | `"https://lukka.tech/resources/blockchain-analytics-product-sheet/"` |
| description | `"AML and compliance analytics for digital asset businesses."` | `"Blockchain analytics and AML software offered within Lukka following its acquisition and integration of Coinfirm."` |
| founded | `"2016"` | `"n/a"` |
| hq | `"United Kingdom"` | `"n/a"` |
| twitter | `"https://x.com/coinfirm_io"` | `"n/a"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.coinfirm.com](https://www.coinfirm.com) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)>; checked `2026-11-24T22:43:16.411401+00:00`
- [https://www.coinfirm.com/products](https://www.coinfirm.com/products) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)>; checked `2026-11-24T22:43:16.514685+00:00`
- [https://lukka.tech/lukka-acquires-coinfirm-bringing-audited-data-to-blockchain-analytics-compliance-and-investigations/](https://lukka.tech/lukka-acquires-coinfirm-bringing-audited-data-to-blockchain-analytics-compliance-and-investigations/) — 200; checked `2026-11-25T01:20:46.933769+00:00`
- [https://lukka.tech/](https://lukka.tech/) — 200; checked `2026-11-25T01:20:46.463954+00:00`
- [https://lukka.tech/resources/blockchain-analytics-product-sheet/](https://lukka.tech/resources/blockchain-analytics-product-sheet/) — 200; checked `2026-11-25T01:17:11.555629+00:00`
- [https://status.blockchain-analytics.lukka.tech/](https://status.blockchain-analytics.lukka.tech/) — 200; checked `2026-11-25T01:20:47.299800+00:00`

### Corn — propose exclusion

Source: [content/projects/corn.md](../../../content/projects/corn.md); original blob `322a42eae03ce0d64300b0c6766018bae34c2386`.

The official Corn announcement channel explicitly sets network cessation for 30 June 2026, after which its sequencer and transactions would stop. It also identifies the old network app as legacy. Exclude the retired Bitcoin-aligned L2 profile; the issuer's next chapter is not automatically the same operating network or an approved replacement listing. No claim, bridge or recovery was attempted.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.usecorn.com](https://www.usecorn.com) — 200; checked `2026-11-24T22:43:18.474565+00:00`
- [https://www.usecorn.com/build](https://www.usecorn.com/build) — 404; checked `2026-11-24T22:43:18.693409+00:00`
- [https://t.me/s/usecorn](https://t.me/s/usecorn) — 200; checked `2026-11-25T01:17:12.067327+00:00`

### Finoa — propose partial correction keep hold

Source: [content/projects/finoa.md](../../../content/projects/finoa.md); original blob `91d5e7cd76a93d1839377ce558ae0beb5b4277a6`.

The current homepage and August 2026 privacy policy explicitly describe a technology provider that does not provide custody or execute orders. Remove the stale custody classification and description. Retain needs_update because advertised customer/product routes remain unresolved. This is a correction to the issuer's stated service scope, not a new legal or regulatory assessment.

| Field | Before | Proposed |
| --- | --- | --- |
| lead_category | `"Custody"` | `"Infrastructure"` |
| tags | `["Custody", "Infrastructure"]` | `["Infrastructure"]` |
| description | `"Institutional-grade custody and staking service provider."` | `"Technology infrastructure provider for businesses bringing digital assets onchain; Finoa states it does not provide custody or control client assets."` |

Evidence:

- [https://finoa.io](https://finoa.io) — 200 → [https://www.finoa.io/](https://www.finoa.io/); checked `2026-11-24T22:43:21.283846+00:00`
- [https://finoa.io/solutions](https://finoa.io/solutions) — 404 → [https://www.finoa.io/solutions](https://www.finoa.io/solutions); checked `2026-11-24T22:43:21.897136+00:00`
- [https://www.finoa.io/](https://www.finoa.io/) — 200; checked `2026-11-25T01:17:12.485244+00:00`
- [https://www.finoa.io/privacy-policy](https://www.finoa.io/privacy-policy) — 200; checked `2026-11-25T01:17:12.547310+00:00`

### IvendPay — propose partial correction keep hold

Source: [content/projects/ivendpay.md](../../../content/projects/ivendpay.md); original blob `5234bfb95e337f2c95dc047fd31a393ab104e1e3`.

The company's own LinkedIn announcement explicitly confirms ivendPay to IVPAY. Correct the brand only and retain needs_update: the advertised new ivpay.io origin and terms fail current DNS checks. Do not substitute an unavailable URL or infer headquarters from a registered legal address.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"IvendPay"` | `"IVPAY (formerly ivendPay)"` |

Evidence:

- [https://ivendpay.com](https://ivendpay.com) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:27.153372+00:00`
- [https://ivendpay.com/products](https://ivendpay.com/products) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:27.190271+00:00`
- [https://www.linkedin.com/posts/ivpay_ivpay-rebranding-activity-7249379525636018178-eW3e](https://www.linkedin.com/posts/ivpay_ivpay-rebranding-activity-7249379525636018178-eW3e) — 200; checked `2026-11-25T01:17:09.711807+00:00`
- [https://ivpay.io/](https://ivpay.io/) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-25T01:17:08.515977+00:00`
- [https://ivpay.io/terms](https://ivpay.io/terms) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-25T01:17:09.064947+00:00`

### JediSwap — propose exclusion

Source: [content/projects/jediswap.md](../../../content/projects/jediswap.md); original blob `07186a5f34df4167e27c10581c415ae189ec9769`.

The original account's 31 July 2025 post confirms the frontend was deactivated, following its explicit wind-down announcement. Starknet's own ecosystem recap corroborates ceased operations. Exclude the unsupported DEX frontend profile while preserving the distinction that contracts and manual withdrawals can still exist. No withdrawal was attempted.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.jediswap.xyz](https://www.jediswap.xyz) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:27.293443+00:00`
- [https://app.jediswap.xyz](https://app.jediswap.xyz) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:27.425256+00:00`
- [https://x.com/JediSwap/status/1950811022371041532](https://x.com/JediSwap/status/1950811022371041532) — 200; checked `2026-11-25T01:20:47.512851+00:00`
- [https://www.starknet.io/blog/starknet-july-ecosystem-recap/](https://www.starknet.io/blog/starknet-july-ecosystem-recap/) — 200; checked `2026-11-25T01:17:11.707698+00:00`

Rendered observations: [https://x.com/JediSwap/status/1950811022371041532](https://x.com/JediSwap/status/1950811022371041532) (`2026-11-25T01:19:21.356Z`).

### JokeRace — propose correction

Source: [content/projects/jokerace.md](../../../content/projects/jokerace.md); original blob `b84fec07374425345f27edb4f9734204116e771c`.

The issuer's 30 January 2026 announcement explicitly confirms the rebrand and links Confetti. The rendered application contains a live contest, completed contests and Polygon contract routes. Correct the brand, routes and demonstrated ecosystem; clear the stale social handle rather than invent a successor handle. No contest, vote or transaction was entered.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"JokeRace"` | `"Confetti (formerly JokeRace)"` |
| primary_url | `"https://jokerace.io"` | `"https://confetti.win/"` |
| product_url | `"https://jokerace.io/explore"` | `"https://confetti.win/"` |
| description | `"Competitive governance and onchain voting platform."` | `"Onchain contest platform where participants vote on outcomes and creators configure rewards."` |
| ecosystem | `["Ethereum", "Base"]` | `["Polygon"]` |
| twitter | `"https://x.com/jokerace_io"` | `"n/a"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://jokerace.io](https://jokerace.io) — 200 → [https://confetti.win/](https://confetti.win/); checked `2026-11-24T22:43:27.593440+00:00`
- [https://jokerace.io/explore](https://jokerace.io/explore) — 404 → [https://confetti.win/explore](https://confetti.win/explore); checked `2026-11-24T22:43:27.614636+00:00`
- [https://fettipop.substack.com/p/we-are-confetti-now](https://fettipop.substack.com/p/we-are-confetti-now) — 200; checked `2026-11-25T01:17:09.800875+00:00`
- [https://confetti.win/](https://confetti.win/) — 200; checked `2026-11-25T01:17:10.192281+00:00`

Rendered observations: [https://confetti.win/](https://confetti.win/) (`2026-11-25T01:17:48.698Z`); [https://confetti.win/](https://confetti.win/) (`2026-11-25T01:18:24.359Z`).

### Kadena — propose correction

Source: [content/projects/kadena.md](../../../content/projects/kadena.md); original blob `412b2af08093904c52ad62d1502147463835824b`.

The community-maintained node repository links kda-chain.org, which describes continuation of the same chain and KDA. The independent community monitor rendered live block height 7,434,205, throughput and transaction data. Replace the old company routes and distinguish the continuing network from the ceased company. The monitor identifies itself as independent; neither it nor the community is presented as Kadena LLC. No wallet, node or transaction was created.

| Field | Before | Proposed |
| --- | --- | --- |
| name | `"Kadena"` | `"Kadena (Community Edition)"` |
| primary_url | `"https://kadena.io"` | `"https://kda-chain.org/"` |
| product_url | `"https://kadena.io/ecosystem"` | `"https://nodes.kadena.ws/"` |
| description | `"Scalable proof-of-work blockchain ecosystem."` | `"Community-maintained proof-of-work blockchain using Chainweb and Pact, continued independently after Kadena LLC ceased operations."` |
| hq | `"United States"` | `"Metaverse"` |
| twitter | `"https://x.com/kadena_io"` | `"n/a"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://kadena.io](https://kadena.io) — 200 → [https://www.kadena.io/](https://www.kadena.io/); checked `2026-11-24T22:43:27.871540+00:00`
- [https://kadena.io/ecosystem](https://kadena.io/ecosystem) — 404 → [https://www.kadena.io/ecosystem](https://www.kadena.io/ecosystem); checked `2026-11-24T22:43:27.878871+00:00`
- [https://github.com/kda-community/chainweb-node](https://github.com/kda-community/chainweb-node) — 200; checked `2026-11-25T01:22:27.833757+00:00`
- [https://kda-chain.org/](https://kda-chain.org/) — 200; checked `2026-11-25T01:22:27.833702+00:00`
- [https://kadena.ws/community-edition/](https://kadena.ws/community-edition/) — 200; checked `2026-11-25T01:17:14.665100+00:00`
- [https://nodes.kadena.ws/](https://nodes.kadena.ws/) — 200; checked `2026-11-25T01:17:14.422411+00:00`

Rendered observations: [https://nodes.kadena.ws/](https://nodes.kadena.ws/) (`2026-11-25T01:21:08.646Z`); [https://nodes.kadena.ws/](https://nodes.kadena.ws/) (`2026-11-25T01:21:29.067Z`).

### KriyaDEX — propose exclusion

Source: [content/projects/kriyadex.md](../../../content/projects/kriyadex.md); original blob `804a71b4f626168e7546f38bb939d5f4c7a3f70c`.

The original official post dated 17 August 2026 announces cessation of Kriya web/mobile interface maintenance after 60 days, a period now passed, and the listed/withdrawal interfaces are unavailable. Exclude the unsupported legacy DEX application, not all Sui activity, remaining contracts, user assets or a potential future product. The thread explicitly distinguishes permanent onchain withdrawals from frontend support.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://kriya.finance](https://kriya.finance) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:28.734815+00:00`
- [https://x.com/KriyaDEX/status/2089324289342537737](https://x.com/KriyaDEX/status/2089324289342537737) — 200; checked `2026-11-25T01:27:44.605294+00:00`

Rendered observations: [https://x.com/KriyaDEX/status/2089324289342537737](https://x.com/KriyaDEX/status/2089324289342537737) (`2026-11-25T01:22:54.868Z`).

### Masa — propose partial correction keep hold

Source: [content/projects/masa.md](../../../content/projects/masa.md); original blob `d637ae629820cd07a2204c6664b70c9841c30c61`.

The official identity references and current Masa page establish the data-network offering, MASA and Bittensor subnets rather than the old identity profile. Correct the website and documented scope. Retain needs_update: the linked Agent Arena deployment is paused and the linked API documentation returns 404. This does not promote generic AI as an accepted crypto agent or establish live staking/data execution.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://www.masa.finance"` | `"https://beta.masa.ai/about"` |
| lead_category | `"Identity"` | `"Data & Analytics"` |
| tags | `["Identity", "Data"]` | `["Data & Analytics", "Infrastructure"]` |
| ecosystem | `["Ethereum", "BNB Chain"]` | `["Bittensor"]` |
| description | `"Decentralized identity and personal data network."` | `"Decentralized data network for AI builders, miners and validators, describing MASA staking and Bittensor subnets."` |

Evidence:

- [https://www.masa.finance](https://www.masa.finance) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)>; checked `2026-11-24T22:43:30.641354+00:00`
- [https://www.masa.finance/products](https://www.masa.finance/products) — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)>; checked `2026-11-24T22:43:31.184270+00:00`
- [https://linktr.ee/masa.network](https://linktr.ee/masa.network) — 200; checked `2026-11-25T01:17:13.765704+00:00`
- [https://beta.masa.ai/about](https://beta.masa.ai/about) — 200; checked `2026-11-25T01:17:13.882317+00:00`
- [https://app.masa.ai/agent-arena](https://app.masa.ai/agent-arena) — 402; checked `2026-11-25T01:20:47.777428+00:00`
- [https://developers.masa.ai/docs/index-API/masa-api-search](https://developers.masa.ai/docs/index-API/masa-api-search) — 404 → [https://developers.gopher-ai.com/docs/index-API/masa-api-search](https://developers.gopher-ai.com/docs/index-API/masa-api-search); checked `2026-11-25T01:20:47.655125+00:00`

Rendered observations: [https://beta.masa.ai/about](https://beta.masa.ai/about) (`2026-11-25T01:20:15.705Z`); [https://app.masa.ai/agent-arena](https://app.masa.ai/agent-arena) (`2026-11-25T01:20:24.694Z`).

### Metalabel — propose exclusion

Source: [content/projects/metalabel.md](../../../content/projects/metalabel.md); original blob `e0b89fa79ff7d5d4efd34001b17b792507c46a4a`.

Metalabel's own FAQ explicitly says there are no blockchains underneath its platform and that it chose non-crypto payment-split tools after exploring blockchain. Its payment FAQ says the service is built on Stripe. Exclude this out-of-scope creator-platform profile under the crypto/Web3 directory scope; this is not a company shutdown claim.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.metalabel.com](https://www.metalabel.com) — 200; checked `2026-11-24T22:43:31.995241+00:00`
- [https://www.metalabel.com/explore](https://www.metalabel.com/explore) — 200 → [https://www.metalabel.com/not-found](https://www.metalabel.com/not-found); checked `2026-11-24T22:43:32.614139+00:00`
- [https://help.metalabel.com/hc/en-us/articles/25230685819539-Is-this-a-blockchain-thing](https://help.metalabel.com/hc/en-us/articles/25230685819539-Is-this-a-blockchain-thing) — 200; checked `2026-11-25T01:22:27.832907+00:00`
- [https://help.metalabel.com/hc/en-us/sections/20617907763987-FAQ](https://help.metalabel.com/hc/en-us/sections/20617907763987-FAQ) — 200; checked `2026-11-25T01:17:07.923418+00:00`

### Mirror — propose exclusion

Source: [content/projects/mirror.md](../../../content/projects/mirror.md); original blob `40d8a7ab580005d6f4b9ad60a5ca289f3254247f`.

The operator's announcement explicitly says it is winding down Mirror and concentrating the combined publishing product in Paragraph. Exclude Mirror's obsolete standalone publishing/discover profile. Existing historical posts and the successor product are not deleted, and no general claim about all onchain publishing is made.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://mirror.xyz](https://mirror.xyz) — 200 → [https://paragraph.com/](https://paragraph.com/); checked `2026-11-24T22:43:33.667357+00:00`
- [https://mirror.xyz/discover](https://mirror.xyz/discover) — 200 → [https://paragraph.com/](https://paragraph.com/); checked `2026-11-24T22:43:33.714387+00:00`
- [https://paragraph.com/@blog/bringing-the-best-of-mirror-to-paragraph](https://paragraph.com/@blog/bringing-the-best-of-mirror-to-paragraph) — 200 → [https://paragraph.com/articles/bringing-the-best-of-mirror-to-paragraph](https://paragraph.com/articles/bringing-the-best-of-mirror-to-paragraph); checked `2026-11-25T01:17:08.146189+00:00`

### Notional Finance — propose partial correction keep hold

Source: [content/projects/notional-finance.md](../../../content/projects/notional-finance.md); original blob `914205980381165c51473e6d287edf9294d05883`.

The current homepage links /vaults and the issuer announces Exponent, separating that product from the deprecated V1 exploit. The vault interface renders a named mAPOLLO vault, but also displays an anomalous negative APY and very small figures. Correct the dead old app route and profile while retaining needs_update; this is not a financial-data validation or a claim that all products shut down.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://app.notional.finance"` | `"https://notional.finance/vaults"` |
| description | `"Fixed-rate DeFi lending and borrowing protocol."` | `"DeFi lending and leveraged-yield protocol whose current offering is Notional Exponent vaults."` |

Evidence:

- [https://notional.finance](https://notional.finance) — 200; checked `2026-11-24T22:43:35.946844+00:00`
- [https://app.notional.finance](https://app.notional.finance) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:36.309336+00:00`
- [https://blog.notional.finance/notional-exponent-is-live/](https://blog.notional.finance/notional-exponent-is-live/) — 200; checked `2026-11-25T01:17:12.413647+00:00`
- [https://notional.finance/](https://notional.finance/) — 200; checked `2026-11-25T01:20:47.647653+00:00`
- [https://notional.finance/vaults](https://notional.finance/vaults) — 200; checked `2026-11-25T01:22:27.833609+00:00`

Rendered observations: [https://notional.finance/](https://notional.finance/) (`2026-11-25T01:20:14.584Z`); [https://notional.finance/](https://notional.finance/) (`2026-11-25T01:21:29.903Z`); [https://notional.finance/](https://notional.finance/) (`2026-11-25T01:22:01.921Z`); [https://notional.finance/vaults](https://notional.finance/vaults) (`2026-11-25T01:22:32.837Z`); [https://notional.finance/vaults](https://notional.finance/vaults) (`2026-11-25T01:22:53.105Z`).

### OKLink — propose correction

Source: [content/projects/oklink.md](../../../content/projects/oklink.md); original blob `aa057a02e229fa0a51b9a9f9c37ce5b5cc39ffc4`.

The exact Ethereum explorer rendered populated block/transaction and network figures after initial loading. Use that direct product route instead of repeating the generic homepage. This is a public explorer observation, not a provider API or account test.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://www.oklink.com"` | `"https://www.oklink.com/ethereum"` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.oklink.com](https://www.oklink.com) — 200; checked `2026-11-24T22:43:36.835011+00:00`
- [https://www.oklink.com/ethereum](https://www.oklink.com/ethereum) — 200; checked `2026-11-25T01:17:13.490142+00:00`

Rendered observations: [https://www.oklink.com/ethereum](https://www.oklink.com/ethereum) (`2026-11-25T01:18:38.366Z`); [https://www.oklink.com/ethereum](https://www.oklink.com/ethereum) (`2026-11-25T01:19:19.026Z`).

### Parallel Finance — propose exclusion

Source: [content/projects/parallel-finance.md](../../../content/projects/parallel-finance.md); original blob `b73562b2ef466d4cbc4815217a1060fb436556c3`.

The issuer's August 2025 notice explicitly shuts down Parallel/ParaSpace lending. Its later December 2025 legacy-access update confirms the old Polkadot chain is effectively shut down and clarifies that the relaunched interface serves historical positions and support. Exclude the obsolete operating Polkadot lending/staking profile; do not confuse residual legacy access or future projects with an active original service. No recovery process was used.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://parallel.fi](https://parallel.fi) — 200; checked `2026-11-24T22:43:38.346386+00:00`
- [https://app.parallel.fi](https://app.parallel.fi) — [Errno 8] nodename nor servname provided, or not known; checked `2026-11-24T22:43:38.571077+00:00`
- [https://parallelfinance.medium.com/parallel-protocol-parallel-paraspace-shutdown-full-liquidation-notice-f89412c3231c](https://parallelfinance.medium.com/parallel-protocol-parallel-paraspace-shutdown-full-liquidation-notice-f89412c3231c) — 200; checked `2026-11-25T01:17:07.494890+00:00`
- [https://parallelfinance.medium.com/parallel-front-end-relaunch-legacy-access-update-027ac2162ff3](https://parallelfinance.medium.com/parallel-front-end-relaunch-legacy-access-update-027ac2162ff3) — 200; checked `2026-11-25T01:20:46.463588+00:00`

### PizzaDAO — propose partial correction keep hold

Source: [content/projects/pizzadao.md](../../../content/projects/pizzadao.md); original blob `e432e69c114390841419b847ad28b0b3feb3fb83`.

The current PizzaDAO site and its detailed origin account establish continuity through RarePizzas, the 2021 founding and the continuing pizza events. Replace the unavailable old domain and narrow the description. Retain needs_update: historical NFT fundraising and current events do not independently establish ongoing onchain governance or a supported current crypto product.

| Field | Before | Proposed |
| --- | --- | --- |
| primary_url | `"https://www.pizzadao.xyz"` | `"https://pizzadao.org/"` |
| product_url | `"https://www.pizzadao.xyz"` | `"https://pizzadao.org/"` |
| description | `"Global community DAO coordinating events, grants, and cultural initiatives around internet-native collaboration."` | `"Global community organizing Bitcoin Pizza Day events, originally funded through the RarePizzas NFT project."` |

Evidence:

- [https://www.pizzadao.xyz](https://www.pizzadao.xyz) — 200 → [https://globalpizza.party/](https://globalpizza.party/); checked `2026-11-24T22:43:39.732237+00:00`
- [https://pizzadao.org/](https://pizzadao.org/) — 200; checked `2026-11-25T01:17:10.222266+00:00`
- [https://pizzadao.org/about](https://pizzadao.org/about) — 200; checked `2026-11-25T01:17:10.607967+00:00`

### Rage Trade — propose exclusion

Source: [content/projects/rage-trade.md](../../../content/projects/rage-trade.md); original blob `829d2d869bfacdd5f81af892c8916edf566d0ff8`.

The original official announcement dated 6 October 2025 explicitly winds down Rage, returns funds and deprecates its app. Its 14 October follow-up says distributions are complete and directs users to source protocol interfaces. Exclude the retired aggregation application, not those underlying protocols or user positions. No distribution or claim was performed.

| Field | Before | Proposed |
| --- | --- | --- |
| verification_status | `"needs_update"` | `"rejected"` |

Evidence:

- [https://www.rage.trade](https://www.rage.trade) — 402; checked `2026-11-24T22:43:42.719205+00:00`
- [https://app.rage.trade](https://app.rage.trade) — 402; checked `2026-11-24T22:43:43.211374+00:00`
- [https://x.com/rage_trade/status/1975111275668443509](https://x.com/rage_trade/status/1975111275668443509) — 200; checked `2026-11-25T01:20:48.246393+00:00`
- [https://x.com/rage_trade/status/1977991472814407779](https://x.com/rage_trade/status/1977991472814407779) — 200; checked `2026-11-25T01:20:48.423161+00:00`

Rendered observations: [https://x.com/rage_trade/status/1975111275668443509](https://x.com/rage_trade/status/1975111275668443509) (`2026-11-25T01:20:02.566Z`).

### Shrapnel — propose correction

Source: [content/projects/shrapnel.md](../../../content/projects/shrapnel.md); original blob `da7723ee22f73b756e70e2e6ba414d0392177963`.

The current official homepage links this exact Steam product, whose developer listing records release on 12 March 2026 and the Shrapnel account requirement. The issuer still describes digital-item ownership and its marketplace. Replace the missing /play page with the released game listing. The separate marketplace observation did not establish populated inventory; this does not claim Steam itself supports NFT trading. No game, account, purchase or agreement was entered.

| Field | Before | Proposed |
| --- | --- | --- |
| product_url | `"https://www.shrapnel.com/play"` | `"https://store.steampowered.com/app/4175080"` |
| description | `"AAA shooter game ecosystem using blockchain assets."` | `"Team-based first-person shooter with a digital-item ecosystem; the current game is offered on Steam."` |
| verification_status | `"needs_update"` | `"verified"` |

Evidence:

- [https://www.shrapnel.com](https://www.shrapnel.com) — 200; checked `2026-11-24T22:43:44.049711+00:00`
- [https://www.shrapnel.com/play](https://www.shrapnel.com/play) — 404; checked `2026-11-24T22:43:44.560697+00:00`
- [https://www.shrapnel.com/](https://www.shrapnel.com/) — 200; checked `2026-11-25T01:17:10.943695+00:00`
- [https://store.steampowered.com/app/4175080](https://store.steampowered.com/app/4175080) — 200; checked `2026-11-25T01:17:11.142292+00:00`
- [https://www.shrapnel.com/marketplace/featured](https://www.shrapnel.com/marketplace/featured) — 200; checked `2026-11-25T01:20:46.463865+00:00`

Rendered observations: [https://www.shrapnel.com/](https://www.shrapnel.com/) (`2026-11-25T01:20:04.908Z`); [https://www.shrapnel.com/marketplace/featured](https://www.shrapnel.com/marketplace/featured) (`2026-11-25T01:20:11.900Z`); [https://www.shrapnel.com/marketplace/featured](https://www.shrapnel.com/marketplace/featured) (`2026-11-25T01:23:15.589Z`); [https://www.shrapnel.com/marketplace/featured](https://www.shrapnel.com/marketplace/featured) (`2026-11-25T01:24:14.448Z`).

## All 117 row outcomes

Every row below received focused research. Held rows remain unresolved; no new replacement was accepted merely because a search returned a similar name. The query receipts are private operational evidence. These public URLs and reasons let a reviewer assess the proposed decisions.

| Row | Outcome | Public evidence / listed links | Reason |
| --- | --- | --- | --- |
| abracadabra.md | hold | [https://abracadabra.money](https://abracadabra.money): 200<br>[https://abracadabra.money/borrow](https://abracadabra.money/borrow): 404 | The further focused search did not resolve this hold. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| aleo.md | propose correction | [https://aleo.org/](https://aleo.org/): 200<br>[https://aleo.org/ecosystems/](https://aleo.org/ecosystems/): 200 | The current foundation site and its populated ecosystem catalogue establish the network and a usable project-discovery product. Replace the challenged developer redirect with the exact plural /ecosystems/ route; this does not verify every third-party application in that catalogue. |
| aleo-wallet.md | propose exclusion | [https://aleo.org/post/aleo-mainnet-faq/](https://aleo.org/post/aleo-mainnet-faq/): 200<br>[https://aleo.org/ecosystems/](https://aleo.org/ecosystems/): 200 | Exclude the generic ecosystem placeholder, not Aleo or any named wallet. The foundation explicitly says Aleo has no official wallet and lists independently named wallets instead. This row's same stale ecosystem URL in both fields does not identify a separate project; the retained Aleo network entry now links its current catalogue. |
| ancilia.md | hold | [https://ancilia.com](https://ancilia.com): 404<br>[https://ancilia.com/platform](https://ancilia.com/platform): 404 | The further focused search did not resolve this hold. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| anzen.md | propose partial correction keep hold | [https://app.anzen.finance/transparency](https://app.anzen.finance/transparency): 200 | The rendered official application explicitly announces cessation on 15 December 2026 and exposes the current transparency route. Correct the product link and present wind-down state; retain needs_update. The deadline is future as of this review, so this is not an assertion that all operations already ceased. Zero/unavailable figures and malformed explorer links were not accepted as healthy reserve data. No withdrawal or wallet action occurred. |
| aptos-wallet.md | propose exclusion | [https://aptosnetwork.com/ecosystem/directory/category/wallets](https://aptosnetwork.com/ecosystem/directory/category/wallets): 429 (access challenge) | Exclude the non-distinct generic wallet placeholder. The current official wallet category is a catalogue of individually named projects, including Petra, rather than an application called Aptos Wallet. Aptos and Petra retain their own source rows. Do not silently replace the generic row with a different wallet operator or claim Aptos wallets closed. |
| astaria.md | hold | [https://www.astaria.xyz](https://www.astaria.xyz): 404 | The further focused search did not resolve this hold. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| azuki.md | hold | [https://www.azuki.com](https://www.azuki.com): 200<br>[https://www.azuki.com/collectibles](https://www.azuki.com/collectibles): 404 | The further focused search did not resolve this hold. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| badger.md | hold | [https://badger.com](https://badger.com): 200<br>[https://app.badger.com](https://app.badger.com): 200 | The further focused search did not resolve this hold. The current official notice and legacy-sunset repository remove frontends and preserve direct contract access. This does not establish closure of the whole DAO or prove a currently supported deposit product; retain the hold. |
| bakkt.md | hold | [https://www.bakkt.com](https://www.bakkt.com): 200 → [https://bakkt.com/](https://bakkt.com/)<br>[https://www.bakkt.com/platform](https://www.bakkt.com/platform): 404 → [https://bakkt.com/platform](https://bakkt.com/platform) | The further focused search did not resolve this hold. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| balancer.md | hold | [https://balancer.fi](https://balancer.fi): 429 (access challenge)<br>[https://app.balancer.fi](https://app.balancer.fi): 429 (access challenge) → [https://balancer.fi/pools](https://balancer.fi/pools) | The further focused search did not resolve this hold. The passed BIP-928 forum update specifies the wind-down and scheduled 30 November final pause, with limited exceptions. That date is future as of this review. Preserve needs_update; do not call every pool or contract already shut down. |
| barnbridge.md | hold | [https://barnbridge.com](https://barnbridge.com): [Errno 8] nodename nor servname provided, or not known<br>[https://app.barnbridge.com](https://app.barnbridge.com): [Errno 8] nodename nor servname provided, or not known | The official organization README explicitly distinguishes discontinued Smart Yield V1/Smart Alpha from products it labels current, including Smart Yield V2. That old README and the unavailable original routes do not prove a currently supported offering or whole-protocol closure. Keep held; do not extend a V1 retirement to all versions. |
| banklessdao.md | hold | [https://blackflagdao.notion.site/](https://blackflagdao.notion.site/): 200 | The further focused search did not resolve this hold. The official former-DAO newsletter explicitly confirms the Black Flag rebrand and intentional bankless.community redirect to this Notion portal. Correct the identity and routes, but keep needs_update: current independent governance/activity evidence beyond the older transition material is still insufficient. No obsolete Discord invitation is substituted. |
| blocklords.md | hold | [https://blocklords.com](https://blocklords.com): 200 → [https://blocklords.com/en](https://blocklords.com/en) | The further focused search did not resolve this hold. The official transition confirms BLOCKLORE and says the change remains within Web3; its current canvas dashboard and November release notes render. However, a currently available onchain function was not established. Do not treat an aspirational Web3 statement as a live crypto product. |
| blueshift.md | hold | [https://blueshift.fi/](https://blueshift.fi/): 200<br>[https://app.blueshift.fi/](https://app.blueshift.fi/): 200 | The further focused search did not resolve this hold. The application explicitly reports geographic restriction from this region. Restricted access is not closure evidence. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| bunzz.md | hold | [https://www.bunzz.dev/](https://www.bunzz.dev/): 200<br>[https://app.bunzz.dev/explorer](https://app.bunzz.dev/explorer): 200 | The further focused search did not resolve this hold. The prior rendered maintenance state remains unresolved. Current searches did not establish an ordinary supported product or an authoritative permanent closure; retain the hold. |
| bitvenus.md | hold | [https://www.bvox.com/](https://www.bvox.com/): 200 | The further focused search did not resolve this hold. The current BVOX browser page explicitly reports that service is unavailable in this region. Retain the hold without treating a geographic restriction as permanent closure or using another location to bypass it. |
| cabin.md | propose exclusion | [https://x.com/cabindotcity/status/1920220527530225764](https://x.com/cabindotcity/status/1920220527530225764): 200<br>[https://cabin.city/](https://cabin.city/): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)> | The original Cabin announcement dated 7 May 2025 explicitly confirms an approved DAO wind-down and treasury distribution while continuing as an informal community network. The indexed official site also describes the formal DAO ending in 2025. Exclude the obsolete onchain-governance organization profile; do not declare every neighborhood or spun-out project closed. The site's expired certificate was not bypassed. |
| canto.md | hold | [https://explore.canto.io/](https://explore.canto.io/): 200<br>[https://docs.canto.io/](https://docs.canto.io/): 200 | Current chain docs identify a specific explorer, but the unresolved bridge and lack of newly accepted populated network activity still prevent re-verification. Documentation and a marketing page are not proof that the bridge works or the chain ceased. |
| cellana-finance.md | hold | [https://cellana.finance](https://cellana.finance): [Errno 8] nodename nor servname provided, or not known<br>[https://app.cellana.finance](https://app.cellana.finance): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| ceramic.md | propose correction | [https://developers.ceramic.network/](https://developers.ceramic.network/): 200<br>[https://developers.ceramic.network/docs/protocol/ceramic-one/usage/installation](https://developers.ceramic.network/docs/protocol/ceramic-one/usage/installation): 200<br>[https://github.com/ceramicnetwork/rust-ceramic](https://github.com/ceramicnetwork/rust-ceramic): 200 | The official documentation and exact installation guide render, identify the node and SDK, and link the public Rust implementation. Replace the unavailable marketing origin with the developer site. The earlier failing intermediate documentation path was not the installation page. This verifies a published developer offering, not an installation or a revival of retired ComposeDB services. |
| cess.md | propose partial correction keep hold | [https://cess.network/](https://cess.network/): The read operation timed out<br>[https://github.com/CESSProject/cess-nodeadm](https://github.com/CESSProject/cess-nodeadm): 200<br>[https://github.com/CESSProject/cess/releases](https://github.com/CESSProject/cess/releases): 200 | The official CESS repository provides the node-management software and identifies its relationship to the network, replacing the whitepaper masquerading as a product. Retain needs_update because current requests to the official homepage time out and this did not independently establish a live storage service. No code or node was installed or executed. |
| charmverse.md | propose exclusion | [https://x.com/CharmVerse/status/2036766170158674264](https://x.com/CharmVerse/status/2036766170158674264): 200 | The original official-account post dated 25 March 2026 explicitly announces shutdown of operations on 30 April; the thread states the platform cannot continue being supported. This passed date and whole-platform scope resolve the earlier year/scope uncertainty. Exclude the retired DAO workspace, without treating another project's old grant link as proof of continued operation. |
| civic.md | hold | [https://www.civic.com](https://www.civic.com): 200 | The further focused search did not resolve this hold. Current official pages and product-specific terms focus on Bryn business automation. They do not establish a supported current onchain identity product or independently prove all Civic offerings ceased. |
| coinfirm.md | propose correction | [https://lukka.tech/lukka-acquires-coinfirm-bringing-audited-data-to-blockchain-analytics-compliance-and-investigations/](https://lukka.tech/lukka-acquires-coinfirm-bringing-audited-data-to-blockchain-analytics-compliance-and-investigations/): 200<br>[https://lukka.tech/](https://lukka.tech/): 200<br>[https://lukka.tech/resources/blockchain-analytics-product-sheet/](https://lukka.tech/resources/blockchain-analytics-product-sheet/): 200<br>[https://status.blockchain-analytics.lukka.tech/](https://status.blockchain-analytics.lukka.tech/): 200 | Lukka's acquisition announcement explicitly describes integration of the Coinfirm team and products into its analytics offering. Its current November 2026 product sheet describes that offered analytics service and the public service status is available. Replace the dead standalone Coinfirm routes. Unknown successor founding/HQ/social fields are cleared rather than transferring predecessor company metadata to the combined product. This is not an independent endorsement of compliance, security or vendor performance. |
| coreum.md | hold | [https://www.coreum.com](https://www.coreum.com): The read operation timed out<br>[https://www.coreum.com/ecosystem](https://www.coreum.com/ecosystem): The read operation timed out | Exchange migration notices describe a Coreum/Sologenic merger into TX, but this pass did not recover a verified current issuer/product pair and exact successor scope. A token migration alone does not prove chain cessation or authorize silently changing this project to a similarly named domain. |
| corn.md | propose exclusion | [https://t.me/s/usecorn](https://t.me/s/usecorn): 200 | The official Corn announcement channel explicitly sets network cessation for 30 June 2026, after which its sequencer and transactions would stop. It also identifies the old network app as legacy. Exclude the retired Bitcoin-aligned L2 profile; the issuer's next chapter is not automatically the same operating network or an approved replacement listing. No claim, bridge or recovery was attempted. |
| cypher-capital-markets.md | hold | [https://cyphercm.com](https://cyphercm.com): [Errno 8] nodename nor servname provided, or not known<br>[https://cyphercm.com/services](https://cyphercm.com/services): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| hmx.md | hold | [https://desk.exchange/](https://desk.exchange/): 200 → [https://clob.desk.exchange/](https://clob.desk.exchange/) | The further focused search did not resolve this hold. The original HMX official profile explicitly identifies the migration and links the DESK account and Linktree. That official Linktree identifies Base and the new website/docs. The website redirects to a blank CLOB shell and docs DNS fails. Correct documented identity/site metadata, unset the unverified current token and dead legacy app link, but keep needs_update; neither trading nor agent execution is claimed live. |
| did-id.md | hold | [https://www.did.id](https://www.did.id): 525<br>[https://www.did.id/docs](https://www.did.id/docs): 525 | The further focused search did not resolve this hold. The listed project is a Kusama/Polkadot identity profile associated with dotdid. Search found the different .bit/d.id identity product; the similar name does not establish continuity and was not substituted. |
| dojoswap.md | hold | [https://dojoswap.xyz](https://dojoswap.xyz): 200<br>[https://dojoswap.xyz/swap](https://dojoswap.xyz/swap): 200 | The further focused search did not resolve this hold. Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| eigenlayer.md | hold | [https://www.eigenlayer.xyz](https://www.eigenlayer.xyz): 200 → [https://www.eigencloud.xyz/](https://www.eigencloud.xyz/)<br>[https://app.eigenlayer.xyz](https://app.eigenlayer.xyz): 500 | The further focused search did not resolve this hold. Homepage now identifies EigenCloud while the listed app returns 500. Reconcile the restaking product and current onchain scope with the broader AI platform. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| figment.md | hold | [https://figment.io](https://figment.io): 403 (access challenge)<br>[https://figment.io/staking](https://figment.io/staking): 403 (access challenge) | The further focused search did not resolve this hold. Current official product and Q3 2026 validator-report references support company activity, but the actual staking-app service page remains browser access-challenged. No challenge was bypassed; keep the product hold. |
| finoa.md | propose partial correction keep hold | [https://www.finoa.io/](https://www.finoa.io/): 200<br>[https://www.finoa.io/privacy-policy](https://www.finoa.io/privacy-policy): 200 | The current homepage and August 2026 privacy policy explicitly describe a technology provider that does not provide custody or execute orders. Remove the stale custody classification and description. Retain needs_update because advertised customer/product routes remain unresolved. This is a correction to the issuer's stated service scope, not a new legal or regulatory assessment. |
| fleek.md | hold | [https://fleek.xyz](https://fleek.xyz): 200 → [https://www.fleek.sh/](https://www.fleek.sh/)<br>[https://fleek.xyz/products](https://fleek.xyz/products): 200 → [https://www.fleek.sh/](https://www.fleek.sh/) | The further focused search did not resolve this hold. A coming-soon/relaunch destination does not establish a currently supported version of the listed decentralized developer product. |
| flipside.md | hold | [https://flipsidecrypto.xyz](https://flipsidecrypto.xyz): 200 | The further focused search did not resolve this hold. The website response still does not establish a rendered current analytics product. This pass did not independently verify an operating replacement; do not promote a shell or infer closure. |
| fortunafi.md | hold | [https://www.fortunafi.com/](https://www.fortunafi.com/): 200<br>[https://app.gitbook.com/o/pKA4LZPny1hWRCEj2kx6/sites/site_2Pq6Y/](https://app.gitbook.com/o/pKA4LZPny1hWRCEj2kx6/sites/site_2Pq6Y/): 200 | The further focused search did not resolve this hold. Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required. The fresh HTML response does not resolve the prior product/identity concern. No sufficiently complete rendered-product evidence was accepted for promotion. |
| fractal-id.md | hold | [https://fractal.id](https://fractal.id): 503<br>[https://fractal.id/for-users](https://fractal.id/for-users): 503 | The further focused search did not resolve this hold. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| fxhash.md | hold | [https://fxhash.xyz](https://fxhash.xyz): <urlopen error [Errno 61] Connection refused><br>[https://fxhash.xyz/explore](https://fxhash.xyz/explore): <urlopen error [Errno 61] Connection refused> | An indexed mirror contains a detailed apparent official closure post dated 17 August 2026, but its exact original post currently returns Post Not Found. Retain the hold pending recoverable first-party confirmation. Supporting artwork access on other platforms is not proof the original marketplace remains supported, and a mirror is not treated as the original account. |
| gelato-web3-functions.md | hold | [https://www.gelato.network/web3-functions](https://www.gelato.network/web3-functions): 200 → [https://gelato.cloud/](https://gelato.cloud/)<br>[https://docs.gelato.network/web3-services/web3-functions](https://docs.gelato.network/web3-services/web3-functions): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)> | The further focused search did not resolve this hold. Current legacy documentation has a certificate failure. A competitor sunset claim and historical official blog are insufficient first-party proof of the current retirement state. The separate Gelato Cloud correction does not reverify this product. |
| govrn.md | hold | [https://www.govrn.xyz](https://www.govrn.xyz): [Errno 8] nodename nor servname provided, or not known<br>[https://www.govrn.xyz/platform](https://www.govrn.xyz/platform): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. The original profile links Govrn.io, while historical official guides and Govrn.app references identify the DAO contribution tool. A current working product/site pair was not established; the prior Govrn.app request timed out. |
| harmony.md | hold | [https://www.harmony.one](https://www.harmony.one): 200 | The indexed official explorer explicitly announces L1 sunsetting and permanent explorer closure on 18 November 2026. Direct explorer access now refuses connections. The linked full announcement and actual chain-cessation scope were not recovered, while the company homepage has an AI focus; retain the hold rather than claim an independently verified whole-chain halt. |
| heymint.md | hold | [https://heymint.xyz](https://heymint.xyz): 402 | The further focused search did not resolve this hold. A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| icon.md | hold | [https://icon.community](https://icon.community): 200<br>[https://icon.community/ecosystem](https://icon.community/ecosystem): 200 → [https://icon.community/ecosystem/](https://icon.community/ecosystem/) | The further focused search did not resolve this hold. A further official Foundation notice confirms that rewards and emissions already ended, adding present-state evidence to the future halt recorded in PR #52. Keep needs_update and preserve the announced future halt date; economic shutdown is not an assertion that every block already stopped. |
| ivendpay.md | propose partial correction keep hold | [https://www.linkedin.com/posts/ivpay_ivpay-rebranding-activity-7249379525636018178-eW3e](https://www.linkedin.com/posts/ivpay_ivpay-rebranding-activity-7249379525636018178-eW3e): 200<br>[https://ivpay.io/](https://ivpay.io/): [Errno 8] nodename nor servname provided, or not known<br>[https://ivpay.io/terms](https://ivpay.io/terms): [Errno 8] nodename nor servname provided, or not known | The company's own LinkedIn announcement explicitly confirms ivendPay to IVPAY. Correct the brand only and retain needs_update: the advertised new ivpay.io origin and terms fail current DNS checks. Do not substitute an unavailable URL or infer headquarters from a registered legal address. |
| jediswap.md | propose exclusion | [https://x.com/JediSwap/status/1950811022371041532](https://x.com/JediSwap/status/1950811022371041532): 200<br>[https://www.starknet.io/blog/starknet-july-ecosystem-recap/](https://www.starknet.io/blog/starknet-july-ecosystem-recap/): 200 | The original account's 31 July 2025 post confirms the frontend was deactivated, following its explicit wind-down announcement. Starknet's own ecosystem recap corroborates ceased operations. Exclude the unsupported DEX frontend profile while preserving the distinction that contracts and manual withdrawals can still exist. No withdrawal was attempted. |
| jex.md | hold | [https://jex.trade](https://jex.trade): 200<br>[https://app.jex.trade](https://app.jex.trade): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. The destination is a coming-soon placeholder. No working current exchange product or authoritative permanent shutdown evidence was established. |
| jokerace.md | propose correction | [https://fettipop.substack.com/p/we-are-confetti-now](https://fettipop.substack.com/p/we-are-confetti-now): 200<br>[https://confetti.win/](https://confetti.win/): 200 | The issuer's 30 January 2026 announcement explicitly confirms the rebrand and links Confetti. The rendered application contains a live contest, completed contests and Polygon contract routes. Correct the brand, routes and demonstrated ecosystem; clear the stale social handle rather than invent a successor handle. No contest, vote or transaction was entered. |
| kadena.md | propose correction | [https://github.com/kda-community/chainweb-node](https://github.com/kda-community/chainweb-node): 200<br>[https://kda-chain.org/](https://kda-chain.org/): 200<br>[https://kadena.ws/community-edition/](https://kadena.ws/community-edition/): 200<br>[https://nodes.kadena.ws/](https://nodes.kadena.ws/): 200 | The community-maintained node repository links kda-chain.org, which describes continuation of the same chain and KDA. The independent community monitor rendered live block height 7,434,205, throughput and transaction data. Replace the old company routes and distinguish the continuing network from the ceased company. The monitor identifies itself as independent; neither it nor the community is presented as Kadena LLC. No wallet, node or transaction was created. |
| kilt-protocol.md | hold | [https://www.kilt.io](https://www.kilt.io): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1081)> | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| kriyadex.md | propose exclusion | [https://x.com/KriyaDEX/status/2089324289342537737](https://x.com/KriyaDEX/status/2089324289342537737): 200 | The original official post dated 17 August 2026 announces cessation of Kriya web/mobile interface maintenance after 60 days, a period now passed, and the listed/withdrawal interfaces are unavailable. Exclude the unsupported legacy DEX application, not all Sui activity, remaining contracts, user assets or a potential future product. The thread explicitly distinguishes permanent onchain withdrawals from frontend support. |
| leapfrog-wallet.md | hold | [https://leapfrogwallet.xyz](https://leapfrogwallet.xyz): [Errno 8] nodename nor servname provided, or not known<br>[https://leapfrogwallet.xyz/download](https://leapfrogwallet.xyz/download): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| trader-joe.md | hold | [https://lfj.gg/](https://lfj.gg/): 200<br>[https://lfj.gg/swap](https://lfj.gg/swap): 403 (access challenge) | The further focused search did not resolve this hold. The issuer newsletter explicitly confirms the LFJ rebrand; both old domains redirect to LFJ and current developer docs describe its DEX. Correct the name and canonical swap route, but keep needs_update: the observed swap interface remained at asset/network loading and did not establish a functioning current market. No challenge was bypassed or swap attempted. |
| lybra-finance.md | hold | [https://lybra.finance](https://lybra.finance): [Errno 8] nodename nor servname provided, or not known<br>[https://lybra.finance/app](https://lybra.finance/app): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. A similarly branded LBR DAO destination and token metadata do not independently establish current official continuity or an operating original product; retain the hold. |
| lykke.md | hold | [https://www.lykke.com](https://www.lykke.com): 200 → [https://x.com/rundns](https://x.com/rundns)<br>[https://www.lykke.com/trade](https://www.lykke.com/trade): 404 | The further focused search did not resolve this hold. The old domain now routes to an unrelated social profile and the old trade route is unavailable. This establishes stale links, not a verified legal closure or safe replacement. |
| magic-eden.md | hold | [https://magiceden.io](https://magiceden.io): 403 (access challenge) | The current official service-change notice explicitly preserves the Solana Marketplace and Packs while retiring other chains and wallet services. Keep held because the ordinary marketplace is still restricted in this environment; do not treat a wallet or chain-specific sunset as whole-company closure. |
| magic-eden-creator-hub.md | hold | [https://magiceden.io/launchpad](https://magiceden.io/launchpad): 403 (access challenge) | The official current guide identifies creators.magiceden.io as Creator Hub, resolving the old launchpad mismatch. That exact application remains access-restricted, so keep held without claiming the creator workflow was verified or that all creator products retired. |
| mango-markets.md | hold | [https://mango.markets](https://mango.markets): [Errno 8] nodename nor servname provided, or not known<br>[https://trade.mango.markets](https://trade.mango.markets): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. The cited shutdown report links an original-account post that currently returns Post Not Found. The legacy sites are unavailable, but exact fresh first-party confirmation was not recovered; retain the hold rather than rely on a copied news page as independent proof. |
| mars-protocol.md | hold | [https://marsprotocol.io](https://marsprotocol.io): [Errno 8] nodename nor servname provided, or not known<br>[https://app.marsprotocol.io](https://app.marsprotocol.io): [Errno 8] nodename nor servname provided, or not known | The new search surfaces contributor wind-down discussion, but the passed/executed state and exact Red Bank versus older Mars Hub scope remain unconfirmed. Keep held rather than turn a proposal or chain-specific change into whole-protocol closure. |
| martian-wallet.md | hold | [https://martianwallet.xyz](https://martianwallet.xyz): [Errno 8] nodename nor servname provided, or not known | Search finds similarly branded replacement domains, but no first-party operator or publisher continuity was established. Do not substitute a wallet lookalike, install an extension or request recovery information; retain the hold. |
| masa.md | propose partial correction keep hold | [https://linktr.ee/masa.network](https://linktr.ee/masa.network): 200<br>[https://beta.masa.ai/about](https://beta.masa.ai/about): 200<br>[https://app.masa.ai/agent-arena](https://app.masa.ai/agent-arena): 402<br>[https://developers.masa.ai/docs/index-API/masa-api-search](https://developers.masa.ai/docs/index-API/masa-api-search): 404 → [https://developers.gopher-ai.com/docs/index-API/masa-api-search](https://developers.gopher-ai.com/docs/index-API/masa-api-search) | The official identity references and current Masa page establish the data-network offering, MASA and Bittensor subnets rather than the old identity profile. Correct the website and documented scope. Retain needs_update: the linked Agent Arena deployment is paused and the linked API documentation returns 404. This does not promote generic AI as an accepted crypto agent or establish live staking/data execution. |
| matr1x.md | hold | [https://matr1x.io](https://matr1x.io): <urlopen error timed out><br>[https://matr1x.io/games](https://matr1x.io/games): <urlopen error timed out> | The further focused search did not resolve this hold. Reported game shutdown or ecosystem changes were not resolved with sufficiently specific primary evidence. Do not generalize one game or token event to the whole listed ecosystem. |
| metalabel.md | propose exclusion | [https://help.metalabel.com/hc/en-us/articles/25230685819539-Is-this-a-blockchain-thing](https://help.metalabel.com/hc/en-us/articles/25230685819539-Is-this-a-blockchain-thing): 200<br>[https://help.metalabel.com/hc/en-us/sections/20617907763987-FAQ](https://help.metalabel.com/hc/en-us/sections/20617907763987-FAQ): 200 | Metalabel's own FAQ explicitly says there are no blockchains underneath its platform and that it chose non-crypto payment-split tools after exploring blockchain. Its payment FAQ says the service is built on Stripe. Exclude this out-of-scope creator-platform profile under the crypto/Web3 directory scope; this is not a company shutdown claim. |
| metalcore.md | hold | [https://www.metalcore.gg](https://www.metalcore.gg): <urlopen error [SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error (_ssl.c:1081)> | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| mina-foundation.md | hold | [https://www.minafoundation.com/](https://www.minafoundation.com/): 200<br>[https://minaprotocol.com](https://minaprotocol.com): 200 | The further focused search did not resolve this hold. The November Q3 report corroborates the continuing treasury handover and organizational wind-down already recorded in PR #52. It does not newly verify completion or retire the Mina network; keep the existing hold. |
| mintbase.md | hold | [https://www.mintbase.xyz](https://www.mintbase.xyz): 402 | A similarly branded new agent page does not establish operator continuity from Mintbase/Bitte, and the previously observed official successor remains paused. Retain the hold; do not transfer the profile to an unverified domain. |
| mirror.md | propose exclusion | [https://paragraph.com/@blog/bringing-the-best-of-mirror-to-paragraph](https://paragraph.com/@blog/bringing-the-best-of-mirror-to-paragraph): 200 → [https://paragraph.com/articles/bringing-the-best-of-mirror-to-paragraph](https://paragraph.com/articles/bringing-the-best-of-mirror-to-paragraph) | The operator's announcement explicitly says it is winding down Mirror and concentrating the combined publishing product in Paragraph. Exclude Mirror's obsolete standalone publishing/discover profile. Existing historical posts and the successor product are not deleted, and no general claim about all onchain publishing is made. |
| mocana-gaming.md | hold | [https://mocanagaming.com](https://mocanagaming.com): [Errno 8] nodename nor servname provided, or not known<br>[https://mocanagaming.com/games](https://mocanagaming.com/games): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| moonbeam.md | hold | [https://moonbeam.network](https://moonbeam.network): 200<br>[https://moonbeam.network/docs](https://moonbeam.network/docs): 200 | The further focused search did not resolve this hold. Current official docs explicitly identify a pre-launch Base agent protocol, not the old Polkadot platform. They state joining is not open and the SDK is not published to npm. Correct the stale profile but keep needs_update; this is not approval of a live agent service. |
| movement-labs.md | hold | [https://movementlabs.xyz](https://movementlabs.xyz): [Errno 8] nodename nor servname provided, or not known<br>[https://movementlabs.xyz/ecosystem](https://movementlabs.xyz/ecosystem): [Errno 8] nodename nor servname provided, or not known | Current official Movement network pages and documentation describe stablecoin settlement/yield. The issuer's 2025 announcement establishes a new company formed by two Movement employees, not necessarily a legal rename of Movement Labs. Current network products do not settle this company profile's exact identity; retain the hold rather than silently substitute another organization. |
| neutron.md | hold | [https://neutron.org](https://neutron.org): 200 → [https://x.com/neutron_org/status/2072037746424603130](https://x.com/neutron_org/status/2072037746424603130) | Current apparent official announcements describe long-term maintenance and transfer of infrastructure operations to CryptoCrew. That does not mean the chain halted. A current supported product/site pair and exact operational scope remain unresolved; keep held. |
| nod-games.md | hold | [https://nodgames.io](https://nodgames.io): [Errno 8] nodename nor servname provided, or not known<br>[https://nodgames.io/games](https://nodgames.io/games): [Errno 8] nodename nor servname provided, or not known | The company's own public profile identifies nodgames.com and blockchain-game development, but that exact website returns 404 and its referenced League of Kingdoms route fails DNS. Retain the hold; the profile and historical game terms do not establish a working current site/product pair. |
| notional-finance.md | propose partial correction keep hold | [https://blog.notional.finance/notional-exponent-is-live/](https://blog.notional.finance/notional-exponent-is-live/): 200<br>[https://notional.finance/](https://notional.finance/): 200<br>[https://notional.finance/vaults](https://notional.finance/vaults): 200 | The current homepage links /vaults and the issuer announces Exponent, separating that product from the deprecated V1 exploit. The vault interface renders a named mAPOLLO vault, but also displays an anomalous negative APY and very small figures. Correct the dead old app route and profile while retaining needs_update; this is not a financial-data validation or a claim that all products shut down. |
| oklink.md | propose correction | [https://www.oklink.com/ethereum](https://www.oklink.com/ethereum): 200 | The exact Ethereum explorer rendered populated block/transaction and network figures after initial loading. Use that direct product route instead of repeating the generic homepage. This is a public explorer observation, not a provider API or account test. |
| oncyber.md | hold | [https://oncyber.io](https://oncyber.io): 200<br>[https://oncyber.io/spaces](https://oncyber.io/spaces): 200 | The further focused search did not resolve this hold. The AWE Studio documentation is available, but the observed template controls did not establish populated, supported onchain product activity or exact operator continuity. |
| openaudit.md | hold | [https://openaudit.org](https://openaudit.org): 200<br>[https://openaudit.org/marketplace](https://openaudit.org/marketplace): 200 | The further focused search did not resolve this hold. The current destination is a coming-soon placeholder. Do not substitute a different similarly named audit product. |
| opyn.md | hold | [https://www.opyn.co](https://www.opyn.co): 200 | The first-party Squeeth application explicitly confirms its 4 November 2024 shutdown while mentioning future Opyn Markets. That is precise Squeeth evidence, not proof that every Gamma/Opyn service closed or that the successor launched. Keep the broader company/protocol profile held. |
| parallel-finance.md | propose exclusion | [https://parallelfinance.medium.com/parallel-protocol-parallel-paraspace-shutdown-full-liquidation-notice-f89412c3231c](https://parallelfinance.medium.com/parallel-protocol-parallel-paraspace-shutdown-full-liquidation-notice-f89412c3231c): 200<br>[https://parallelfinance.medium.com/parallel-front-end-relaunch-legacy-access-update-027ac2162ff3](https://parallelfinance.medium.com/parallel-front-end-relaunch-legacy-access-update-027ac2162ff3): 200 | The issuer's August 2025 notice explicitly shuts down Parallel/ParaSpace lending. Its later December 2025 legacy-access update confirms the old Polkadot chain is effectively shut down and clarifies that the relaunched interface serves historical positions and support. Exclude the obsolete operating Polkadot lending/staking profile; do not confuse residual legacy access or future projects with an active original service. No recovery process was used. |
| penumbra.md | hold | [https://penumbra.zone](https://penumbra.zone): 403<br>[https://penumbra.zone/learn](https://penumbra.zone/learn): 403 | Current official wallet/frontend references persist, but the focused search also finds an unrelated esports tournament. That is not a replacement for the Penumbra network product. The unresolved actual app/DEX route remains held; no wallet or light client was installed. |
| pirate-nation.md | hold | [https://piratenation.game](https://piratenation.game): 403 (access challenge)<br>[https://piratenation.game/play](https://piratenation.game/play): 403 (access challenge) | The official arcade explicitly describes a seasonal pause rather than permanent retirement. Current supported full-game availability remains unresolved. Retain the hold rather than close the whole project from a season-specific notice. |
| pizzadao.md | propose partial correction keep hold | [https://pizzadao.org/](https://pizzadao.org/): 200<br>[https://pizzadao.org/about](https://pizzadao.org/about): 200 | The current PizzaDAO site and its detailed origin account establish continuity through RarePizzas, the 2021 founding and the continuing pizza events. Replace the unavailable old domain and narrow the description. Retain needs_update: historical NFT fundraising and current events do not independently establish ongoing onchain governance or a supported current crypto product. |
| platypus-finance.md | hold | [https://platypus.finance](https://platypus.finance): 200<br>[https://app.platypus.finance](https://app.platypus.finance): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| playember.md | hold | [https://playember.com](https://playember.com): 200<br>[https://playember.com/games](https://playember.com/games): 200 | The further focused search did not resolve this hold. Current rendered pages focus on mobile apps, Stripe payments and analytics; a legacy Web3 meta description does not establish a current onchain product. The old games route is missing. |
| pleasrdao.md | hold | [https://pleasr.org](https://pleasr.org): The read operation timed out | The further focused search did not resolve this hold. Current search results describe the collective, but direct public website requests/navigation did not complete. Historical collections alone do not resolve current product and group activity. |
| prisma-finance.md | hold | [https://www.prismafinance.com](https://www.prismafinance.com): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self-signed certificate (_ssl.c:1081)><br>[https://app.prismafinance.com](https://app.prismafinance.com): [Errno 8] nodename nor servname provided, or not known | The newly indexed similarly named domain describes a different token/network and does not establish continuity with the original Ethereum/PRISMA protocol. Retain the hold and do not substitute it. |
| pudgy-penguins.md | hold | [https://www.pudgypenguins.com](https://www.pudgypenguins.com): 403 (access challenge)<br>[https://www.pudgypenguins.com/collections](https://www.pudgypenguins.com/collections): 403 (access challenge) | The issuer's education page and official profile identify its marketplace, strengthening identity evidence. A supported, populated replacement NFT product was not accepted in this pass; the earlier community portal does not itself verify that marketplace. |
| qredo.md | hold | [https://www.qredo.com](https://www.qredo.com): 200 | The further focused search did not resolve this hold. The issuer asset-acquisition announcement and official administration filings concern different legal/entity scopes. They do not establish a current operating Qredo product or a safe automatic successor profile. |
| questbook.md | hold | [https://questbook.app](https://questbook.app): 200<br>[https://questbook.app/dashboard](https://questbook.app/dashboard): 404 → [https://questbook.app/dashboard/&chainId=10/](https://questbook.app/dashboard/&chainId=10/) | The foundation still references Questbook and a grants portal, but no newly accepted populated current grant workflow was established. Keep held; a historical foundation link is not proof of the application's current availability. |
| raft.md | hold | [https://raft.fi](https://raft.fi): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'raft.fi'. (_ssl.c:1081)> | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| rage-trade.md | propose exclusion | [https://x.com/rage_trade/status/1975111275668443509](https://x.com/rage_trade/status/1975111275668443509): 200<br>[https://x.com/rage_trade/status/1977991472814407779](https://x.com/rage_trade/status/1977991472814407779): 200 | The original official announcement dated 6 October 2025 explicitly winds down Rage, returns funds and deprecates its app. Its 14 October follow-up says distributions are complete and directs users to source protocol interfaces. Exclude the retired aggregation application, not those underlying protocols or user positions. No distribution or claim was performed. |
| redefine-security.md | hold | [https://redefine.security](https://redefine.security): [Errno 8] nodename nor servname provided, or not known<br>[https://redefine.security/services](https://redefine.security/services): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| reservoir.md | hold | [https://reservoir.tools](https://reservoir.tools): 429 (access challenge)<br>[https://docs.reservoir.tools](https://docs.reservoir.tools): 200 → [https://docs.relay.link/](https://docs.relay.link/) | The further focused search did not resolve this hold. Old developer route now leads to Relay documentation and the homepage is access-challenged. Reconcile NFT infrastructure versus successor bridging product. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| saakuru.md | hold | [https://saakuru.com](https://saakuru.com): 200 → [https://www.saakuru.com/](https://www.saakuru.com/)<br>[https://saakuru.com/build](https://saakuru.com/build): 404 → [https://www.saakuru.com/build](https://www.saakuru.com/build) | The further focused search did not resolve this hold. Historical official chain environments remain documented, but the current destination emphasizes general AI. A maintained onchain service or authoritative whole-network retirement was not established. |
| saga.md | hold | [https://www.saga.xyz](https://www.saga.xyz): 200 → [https://saga.xyz/](https://saga.xyz/) | The further focused search did not resolve this hold. The current AI-oriented destination and older chain material still lack verified current network/product continuity. Do not assign a crypto-agent category based solely on history. |
| shrapnel.md | propose correction | [https://www.shrapnel.com/](https://www.shrapnel.com/): 200<br>[https://store.steampowered.com/app/4175080](https://store.steampowered.com/app/4175080): 200<br>[https://www.shrapnel.com/marketplace/featured](https://www.shrapnel.com/marketplace/featured): 200 | The current official homepage links this exact Steam product, whose developer listing records release on 12 March 2026 and the Shrapnel account requirement. The issuer still describes digital-item ownership and its marketplace. Replace the missing /play page with the released game listing. The separate marketplace observation did not establish populated inventory; this does not claim Steam itself supports NFT trading. No game, account, purchase or agreement was entered. |
| skynet-security.md | hold | [https://skynet.security](https://skynet.security): [Errno 8] nodename nor servname provided, or not known<br>[https://skynet.security/products](https://skynet.security/products): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. Search returns unrelated Skynet AI, cloud and other security products. No official replacement or identity continuity was established for this exact row. |
| solanafm.md | hold | [https://solana.fm/](https://solana.fm/): 200 | The further focused search did not resolve this hold. Current explorer references and the Jupiter acquisition do not independently verify a populated current explorer; secondary commentary explicitly lacks an official shutdown notice. Keep the hold. |
| spectral-syntax.md | hold | [https://www.spectrallabs.xyz/](https://www.spectrallabs.xyz/): 200<br>[https://app.thegrid.ai/consumption](https://app.thegrid.ai/consumption): 200 | The further focused search did not resolve this hold. The current Grid inference offering does not establish an onchain agent use case. Model usage tokens are not evidence of blockchain token functionality; retain the scope hold. |
| spheron.md | hold | [https://spheron.network](https://spheron.network): 200 → [https://www.spheron.network/](https://www.spheron.network/)<br>[https://spheron.network/products](https://spheron.network/products): 404 → [https://www.spheron.network/products/](https://www.spheron.network/products/) | The further focused search did not resolve this hold. A current GPU marketplace with populated capacity/pricing renders, but the current service does not itself prove a crypto/Web3 function. The old DePIN whitepaper is not a current supported onchain product demonstration. |
| spruceid.md | hold | [https://www.spruceid.com](https://www.spruceid.com): 200 → [https://spruceid.com/](https://spruceid.com/)<br>[https://github.com/spruceid/siwe](https://github.com/spruceid/siwe): 200 | The organization's current identity repositories include ongoing work, but this does not independently establish current support for every legacy SIWE product. Retain the already corrected SIWE repository link and the current hold pending product-specific support evidence. |
| stella.md | hold | [https://www.stella.org](https://www.stella.org): <urlopen error timed out><br>[https://www.stella.org/app](https://www.stella.org/app): <urlopen error [Errno 65] No route to host> | The further focused search did not resolve this hold. Stella/Stellar and other similarly named finance products are not interchangeable. The original profile identity and a working official product are unresolved. |
| swarm-markets.md | hold | [https://swarm.com](https://swarm.com): 200 → [https://app.swarm.markets/](https://app.swarm.markets/)<br>[https://app.swarm.com](https://app.swarm.com): 200 → [https://app.swarm.markets/](https://app.swarm.markets/) | The further focused search did not resolve this hold. Current dOTC documentation describes a separate service, while issuer notices terminate stock-certificate/xGold products. The still-available docs do not resolve current operational scope; keep the product-specific correction from PR #52 held. |
| tableland.md | hold | [https://tableland.xyz](https://tableland.xyz): 200 → [https://x.com/RecallLabs_/status/2116235386582426069](https://x.com/RecallLabs_/status/2116235386582426069)<br>[https://docs.tableland.xyz](https://docs.tableland.xyz): 200 → [https://x.com/RecallLabs_/status/2116235386582426069](https://x.com/RecallLabs_/status/2116235386582426069) | The further focused search did not resolve this hold. The original routes lead toward Recall wind-down, but this does not independently retire every Tableland contract/community implementation or establish a supported current Tableland product. |
| the-beacon.md | hold | [https://www.thebeacon.gg](https://www.thebeacon.gg): 404<br>[https://www.thebeacon.gg/play](https://www.thebeacon.gg/play): 404 | The further focused search did not resolve this hold. Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. At least one listed route remains unavailable, missing or paused. No sufficiently established official replacement and current product was accepted. |
| thruster.md | hold | [https://www.thruster.finance](https://www.thruster.finance): [Errno 8] nodename nor servname provided, or not known<br>[https://www.thruster.finance/swap](https://www.thruster.finance/swap): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| trailblaze-security.md | hold | [https://trailblaze.security](https://trailblaze.security): [Errno 8] nodename nor servname provided, or not known<br>[https://trailblaze.security/platform](https://trailblaze.security/platform): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
| treasure-dao.md | hold | [https://www.treasure.lol](https://www.treasure.lol): 200 → [https://treasure.lol/](https://treasure.lol/)<br>[https://market.treasure.lol](https://market.treasure.lol): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. Current Forever Software/network documentation is presented as coming soon. A current ordinary onchain product was not established; do not treat the proposed agent network as already live. |
| openlaw.md | hold | [https://tributelabs.xyz/](https://tributelabs.xyz/): 200<br>[https://openlaw.io/products](https://openlaw.io/products): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. The official rebrand announcement and current company site explicitly establish continuity from OpenLaw and describe current ADIN work. Correct the company identity/site but retain needs_update: the old product URL is unavailable, core framework repos are archived, and a current supported onchain product route was not established. Do not call the still-operating company shut down or automatically include a general AI offering. |
| vela-exchange.md | hold | [https://vela.exchange](https://vela.exchange): The read operation timed out<br>[https://app.vela.exchange](https://app.vela.exchange): 301 → [https://app.vela.exchange/](https://app.vela.exchange/) | The further focused search did not resolve this hold. The listed VelaExchange social identity points toward a different exchange domain, while the separately referenced Vela_Exchange account currently has no posts. Historical official docs still load but do not establish current trading or independently recover the reported sunset announcement. No lookalike exchange was substituted. |
| verite.md | hold | [https://verite.id](https://verite.id): 404 → [https://developers.circle.com/circle-research/docs](https://developers.circle.com/circle-research/docs)<br>[https://verite.id/docs](https://verite.id/docs): 404 → [https://developers.circle.com/circle-research/docs](https://developers.circle.com/circle-research/docs) | The official Circle repository was archived on 4 April 2025. Archived code establishes historical identity, but alone proves neither all deployments ceased nor an actively supported current offering. The original site/product gap remains held. |
| watchpug.md | hold | [https://www.watchpug.org/](https://www.watchpug.org/): 200 | The further focused search did not resolve this hold. Correct the official auditor domain, corroborated by a client audit-report repository. The current minimal service/contact page does not establish a maintained product or report portfolio. Keep needs_update; no client repository is substituted as the auditor product. |
| web3-storage.md | hold | [https://web3.storage](https://web3.storage): 200 → [https://www.fil.one/](https://www.fil.one/)<br>[https://web3.storage/docs](https://web3.storage/docs): 200 → [https://www.fil.one/](https://www.fil.one/) | The further focused search did not resolve this hold. The historical operator confirms web3.storage became Storacha, and both domains now lead to Fil One. Fil One confirms Filecoin backing and a former Storacha engineering lead, but treats migration from Storacha as a separate support case. This is insufficient to silently equate the legal/operator/product identities or transfer the old metadata; keep the continuity hold. |
| youves.md | hold | [https://app.youves.com](https://app.youves.com): 200<br>[https://app.youves.com/](https://app.youves.com/): 200 | Current own application results still show maintenance and unavailable APR/vault data. Retain the hold; a working governance/earn page description does not establish normal financial-product availability or permanent closure. |
| zebpay.md | hold | [https://zebpay.com](https://zebpay.com): 403<br>[https://zebpay.com/exchange](https://zebpay.com/exchange): 403 | The further focused search did not resolve this hold. Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| zipmex.md | hold | [https://zipmex.com](https://zipmex.com): 200<br>[https://zipmex.com/trade](https://zipmex.com/trade): 404 → [https://zipmex.com/trade/](https://zipmex.com/trade/) | The regulator's regional exchange suspension/revocation and the original-domain reuse by a Solana aggregator remain different scopes. Retain the hold rather than assert every regional entity closed or substitute the reused domain's product as the original exchange. |
| zkfair.md | hold | [https://zkfair.io](https://zkfair.io): 403 (access challenge)<br>[https://zkfair.io/ecosystem](https://zkfair.io/ecosystem): 403 (access challenge) | The further focused search did not resolve this hold. Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge. The fresh public check still encounters an access restriction/challenge or rate limit. No challenge was bypassed; this is not shutdown evidence. |
| zkswap-finance.md | hold | [https://zkswap.finance](https://zkswap.finance): [Errno 8] nodename nor servname provided, or not known<br>[https://zkswap.finance/app](https://zkswap.finance/app): [Errno 8] nodename nor servname provided, or not known | The further focused search did not resolve this hold. Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement. A fresh DNS, certificate, transport or timeout failure remains. The failure is recorded without inferring permanent closure. |
