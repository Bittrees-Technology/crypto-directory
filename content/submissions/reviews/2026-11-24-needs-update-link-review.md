# CryptoDirectory needs-update review

Source: `bebdc866e02973727dc308337dec02722ac90ffd`

198 entries; 350 distinct listed URLs checked, with bounded TLS, route and browser follow-ups. Twelve proposed corrections, ten proposed exclusions, 176 holds. **Proposed source changes:** 12 corrected listings become editorially verified; ten stale or redundant listings become rejected. The other 176 stay on hold. No listing files are deleted.

Prepared from the unchanged listing blobs on merge commit `44be7e5ff9ebd89203ac123c56233a488a60ac41`, using the baseline below. The user approved one repository PR for these changes on 24 November 2026. These are repository editorial proposals, not actions executed through a raging.eth session. Independent release approval and required checks still apply. Editorial verification establishes directory fit and public link evidence; it is not a contract audit, financial endorsement or proof of every authenticated product function. Blocked pages and network errors are not treated as proof of project closure. Exclusion preserves the record as rejected; it does not delete history.

## Proposed corrections

### 1212 Capital — 1212-capital.md

Official site identifies the Luxembourg-based group and its digital asset strategies; the existing investor portal redirects to /login. Founding year remains unknown.

- `description`: "Digital asset management platform with portfolio and onchain strategy interfaces." → "Luxembourg-based digital asset investment group offering stablecoin and directional strategies through an investor portal."
- `hq`: "Metaverse" → "Luxembourg"
- `product_url`: "https://app.1212.capital/" → "https://app.1212.capital/login"
- primary_url: https://1212.capital/ — 200
- product_url: https://app.1212.capital/ — 200 → https://app.1212.capital/login

Expected source blob: `7ae39654aaed14dc7d65916318bd9b9f7b7830e1`.

### Art Blocks — art-blocks.md

Official Collections navigation opens the rendered collection directory at /discover; legacy /collections returns 404.

- `product_url`: "https://www.artblocks.io/collections" → "https://www.artblocks.io/discover"
- primary_url: https://www.artblocks.io — 200
- product_url: https://www.artblocks.io/collections — 404

Expected source blob: `c9516083a6685d45e58b78cd3511f92b8b77781c`.

### ChainSecurity — chainsecurity.md

Official Audits navigation opens the current report catalogue, including November 2026 reports; legacy /services returns 404.

- `primary_url`: "https://chainsecurity.com" → "https://www.chainsecurity.com/"
- `product_url`: "https://chainsecurity.com/services" → "https://www.chainsecurity.com/smart-contract-audit-reports/"
- primary_url: https://chainsecurity.com — 200 → https://www.chainsecurity.com/
- product_url: https://chainsecurity.com/services — 404 → https://www.chainsecurity.com/services

Expected source blob: `27acabc5e9ff76c8488529b4bc5df0e4123180f3`.

### CryptoCompare — cryptocompare.md

The legacy API endpoint requires a key and explicitly directs readers to CoinDesk developer documentation. The current developer product page renders; a 401 is not closure evidence.

- `product_url`: "https://min-api.cryptocompare.com" → "https://developers.coindesk.com/"
- primary_url: https://www.cryptocompare.com — 200
- product_url: https://min-api.cryptocompare.com — 401

Expected source blob: `a4b4f21963424f6fd38728d84874e070db4f6021`.

### Gardens — gardens.md

The current community directory renders these chain filters and links the official social account. Documentation describes conviction-voting governance and funding.

- `product_url`: "https://app.gardens.fund/" → "https://app.gardens.fund/gardens"
- `ecosystem`: ["EVM"] → ["Arbitrum", "Base", "Celo", "Ethereum", "Gnosis", "Optimism", "Polygon"]
- `twitter`: "n/a" → "https://x.com/gardens_fund"
- primary_url: https://docs.gardens.fund/ — 200
- product_url: https://app.gardens.fund/ — 200

Expected source blob: `4a3b7078ef3ff4fc3cd4ef73930ef3133add9551`.

### Hacken — hacken.md

Modern certificate-validating transport resolves the legacy TLS-client failure. Official current navigation describes these security services. Existing founding year, HQ and token are preserved without new verification claims.

- `product_url`: "https://hacken.io/services" → "https://hacken.io/services/"
- `description`: "Blockchain cybersecurity provider offering audits, monitoring, and incident response." → "Blockchain security provider offering smart contract and deployment audits, Proof of Reserves assessments and onchain monitoring."
- primary_url: https://hacken.io — 200
- product_url: https://hacken.io/services — 200 → https://hacken.io/services/

Expected source blob: `ee552e83cc417b0cf36579e7e642efdbb79bf05b`.

### HashDit — hashdit.md

Legacy /products renders a soft 404 despite HTTP 200. The official Products menu links HashDit Pro in the Chrome Web Store; the listing identifies hashdit.io. Nothing was installed or connected.

- `primary_url`: "https://hashdit.io" → "https://www.hashdit.io/"
- `product_url`: "https://hashdit.io/products" → "https://chromewebstore.google.com/detail/hashdit-pro/hjplojcanomjhmbmpnfkdhicomfdkhmi"
- `description`: "Web3 security platform focused on scam prevention and alerts." → "Web3 security tools for transaction and signature risk warnings, scam prevention and monitoring."
- primary_url: https://hashdit.io — 200 → https://www.hashdit.io/
- product_url: https://hashdit.io/products — 200 → https://www.hashdit.io/products

Expected source blob: `ebf6fae6a2332eebd62028c2957658585c88f160`.

### Huma Finance — huma.md

The current application renders Deposit, Portfolio, Rewards and Stake alongside HUMA and USDC. Official documentation is current. Unknown networks, founding year and HQ remain unknown; no transaction was performed.

- `token`: "n/a" → "HUMA"
- `description`: "Onchain financing infrastructure for payment-related credit and liquidity applications." → "PayFi network with onchain payment-financing, liquidity, rewards and staking interfaces."
- primary_url: https://app.huma.finance — 200
- product_url: https://docs.huma.finance/ — 200

Expected source blob: `6acdf068cdafeff832e92be5973778efb1e26182`.

### Project X — project-x.md

The rendered public application explicitly labels HyperEVM and exposes Swap, Liquidity and Portfolio. HYPE in a pair is not assumed to be the project token.

- `ecosystem`: ["n/a"] → ["HyperEVM"]
- `description`: "Onchain trading and liquidity interfaces for cryptocurrency markets." → "Decentralized exchange on HyperEVM with swap, liquidity and portfolio interfaces."
- primary_url: https://www.prjx.com — 200
- product_url: https://www.prjx.com/ — 200

Expected source blob: `7e0ef30427be564891e1b7a578c049ac7583ee71`.

### Securitize — securitize.md

Legacy /platform is a soft 404 despite HTTP 200. The official Tokenization As A Service link opens the rendered institutional tokenization service page.

- `primary_url`: "https://www.securitize.io" → "https://securitize.io/"
- `product_url`: "https://www.securitize.io/platform" → "https://securitize.io/institutional-tokenization"
- primary_url: https://www.securitize.io — 200 → https://securitize.io/
- product_url: https://www.securitize.io/platform — 200 → https://securitize.io/platform

Expected source blob: `3055b61966c83a62b20f27d2a6a19c6492733601`.

### Unchained — unchained.md

Official navigation links the rendered vault product page and existing portal; legacy /services returns 404. No financial account or transaction was created.

- `primary_url`: "https://unchained.com" → "https://www.unchained.com/"
- `product_url`: "https://unchained.com/services" → "https://www.unchained.com/vaults"
- `description`: "Bitcoin-native custody and financial services platform." → "Bitcoin collaborative custody service with multisignature vaults and an account portal."
- primary_url: https://unchained.com — 200 → https://www.unchained.com/
- product_url: https://unchained.com/services — 404 → https://www.unchained.com/services

Expected source blob: `3b3ea39c9bb7716ec59b257aef3590a5e6e106ee`.

### Verus — verus.md

The official wallet page renders current desktop and mobile source/store links and the homepage explicitly links Get VRSC. Nothing was downloaded or installed.

- `product_url`: "n/a" → "https://verus.io/wallet"
- `token`: "n/a" → "VRSC"
- primary_url: https://verus.io/ — 200
- product_url: n/a — No separate product URL recorded; missing value is not a failed request.

Expected source blob: `595043165f10264ed88b1619665f28e321641d2f`.

## Proposed exclusions

### Amberdata — amberdata.md

Official Kaiko announcement says Amberdata is fully integrated from 1 November 2026; both old links redirect to Kaiko acquisition material. Kaiko already has a verified listing.

- `verification_status`: "needs_update" → "rejected"
- primary_url: https://amberdata.io — 200 → https://www.kaiko.com/news/kaiko-acquires-amberdata-in-landmark-digital-asset-data-consolidation
- product_url: https://amberdata.io/products — 200 → https://www.kaiko.com/news/kaiko-acquires-amberdata-in-landmark-digital-asset-data-consolidation

Expected source blob: `80b1bf4460a3c5bac3bd29032c462ca1b79a5026`.

### DYOR — dyor.md

The listed domain now describes Dyor Labs language, golf and habit mobile apps rather than the described crypto research product. Current crypto-product continuity is not established.

- `verification_status`: "needs_update" → "rejected"
- primary_url: https://dyor.com — 200
- product_url: https://dyor.com — 200

Expected source blob: `cf966056855ce204d1a1f9514b0baf7d6ea79cc1`.

### Ionic — ionic.md

The listed website now presents sportsbook content unrelated to the described DeFi lending product; the listed application hostname does not resolve. Remove this obsolete destination without alleging wrongdoing by the original project.

- `verification_status`: "needs_update" → "rejected"
- primary_url: https://www.ionic.money — 200 → https://ionic.money/
- product_url: https://app.ionic.money — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `0439dd6eeb53c0c524d3b9aa0cb21489a9c59dd1`.

### Kwenta — kwenta.md

The listed homepage redirects to already-listed Synthetix and the old trade route returns 404. Exclude the redundant old frontend listing; do not infer a legal merger or token retirement.

- `verification_status`: "needs_update" → "rejected"
- primary_url: https://kwenta.io — 200 → https://synthetix.io/
- product_url: https://kwenta.io/trade — 404

Expected source blob: `eb05f1b2315c518384c92fe4669da8836b4fa176`.

### marginfi — marginfi.md

The official application explicitly says marginfi has moved to Project 0. Project 0 already has a verified listing; preserve this old record as history.

- `verification_status`: "needs_update" → "rejected"
- primary_url: https://marginfi.com — 200 → https://app.marginfi.com/
- product_url: https://app.marginfi.com — 200

Expected source blob: `2975b2bc9ba40cf5cf4971b2b6177ae6a0df4c7e`.

### Mendi Finance — mendi-finance.md

The official site announces the Mendi sunset and withdrawal-only legacy use; the old application hostname no longer resolves. Exclude the retired active-product listing while preserving its record; do not silently replace it with Malda.

- `verification_status`: "needs_update" → "rejected"
- primary_url: https://mendi.finance — 200
- product_url: https://app.mendi.finance — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `dede51ef3d3a74382e583ffd11942a082b95fd8d`.

### Resolv — resolv.md

The official site announces the move to VaultStreet, which already has a verified listing. Legacy recovery/token interfaces are not proof that the original listed stablecoin product remains available.

- `verification_status`: "needs_update" → "rejected"
- primary_url: https://resolv.xyz — 200
- product_url: https://app.resolv.xyz — 200

Expected source blob: `40cc23f02b6c46a3377b7048e29d34e33b18cf3c`.

### Shieldify — shieldify.md

Both listed routes now lead to G1 Global medical/IT services, not the described Web3 security product. Remove the wrong destination without attributing malicious intent.

- `verification_status`: "needs_update" → "rejected"
- primary_url: https://shieldify.io — 200 → https://g1.global/
- product_url: https://shieldify.io — 200 → https://g1.global/

Expected source blob: `bc3c7349b28797c322fc3eef4816abf116a4ca04`.

### Spearbit — spearbit.md

The official page says Spearbit now lives on Cantina and links Cantina. Cantina already has a verified listing.

- `verification_status`: "needs_update" → "rejected"
- primary_url: https://spearbit.com — 200
- product_url: https://cantina.xyz — 200 → https://www.cantina.security/

Expected source blob: `ba169cfbae7360ead8cce67557e6470cab35106f`.

### Utopia Labs — utopia-labs.md

The listed domain now describes flying machines and aircraft preorders rather than the described DAO treasury platform. This does not establish the legal status of the original crypto company.

- `verification_status`: "needs_update" → "rejected"
- primary_url: https://www.utopialabs.com — 200
- product_url: n/a — No separate product URL recorded; missing value is not a failed request.

Expected source blob: `105bdd7938c467e5d191512a4c3f60b38529af4d`.

## Follow-up holds

### Abracadabra — abracadabra.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://abracadabra.money — 200
- product_url: https://abracadabra.money/borrow — 404

Expected source blob: `2351c46156627a52902002a492f3a99d52256af0`.

### Aleo — aleo.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://aleo.org — 200
- product_url: https://developer.aleo.org — 403 → https://docs.aleo.org/

Expected source blob: `cd63f90a0550d35d635fd3164aab40ce0382a782`.

### Aleo Wallet — aleo-wallet.md

An ecosystem wallets anchor does not identify the specific generic wallet product in this row. Do not substitute another wallet without identity evidence.

- primary_url: https://aleo.org/ecosystem#wallets — 200
- product_url: https://aleo.org/ecosystem#wallets — 200

Expected source blob: `136988982267d4b6fd65248b69d2e1a78e401b57`.

### Ancilia — ancilia.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://ancilia.com — 404
- product_url: https://ancilia.com/platform — 404

Expected source blob: `7be96f1fe0198017276dd6093bd68c11a43ee7e3`.

### Ankr AppChain — ankr-appchain.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://www.ankr.com/appchains — 200 → https://chainscanner.xyz/
- product_url: https://www.ankr.com/appchains — 200 → https://chainscanner.xyz/

Expected source blob: `f4e4a316dea97a44ac11ce6ae072a5f3328ca03f`.

### Ante Finance — ante-finance.md

The linked documentation explicitly identifies deprecated Ante Finance v0.5. Verify a currently supported product before clearing the hold.

- primary_url: https://www.ante.finance/ — 200
- product_url: https://docs.ante.finance/ante/v05/about/security — 200

Expected source blob: `7f0b0d322f6957cae0864ec6798e70e179dd52c5`.

### Anzen — anzen.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://anzen.finance — [Errno 8] nodename nor servname provided, or not known
- product_url: https://anzen.finance/app — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `32ad390f8a9d0c170805607ba3a3a568d42c6a58`.

### Aptos Wallet — aptos-wallet.md

The generic wallet identity is unresolved and the ecosystem page is access-challenged. Do not choose an unrelated wallet as a replacement.

- primary_url: https://aptosfoundation.org/ecosystem/wallets — 429
- product_url: https://aptosfoundation.org/ecosystem/wallets — 429

Expected source blob: `c621b6a74c8640332f2fa41e53702f716f763010`.

### Argent — argent.md

The destination is now Ready. Current continuity with the described crypto wallet and existing metadata needs official reconciliation.

- primary_url: https://www.argent.xyz — 200 → https://www.ready.co/
- product_url: n/a — No separate product URL recorded; missing value is not a failed request.

Expected source blob: `44511ba3546ace4b025c240db87e8b49997d9b67`.

### Astaria — astaria.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.astaria.xyz — 404
- product_url: n/a — No separate product URL recorded; missing value is not a failed request.

Expected source blob: `dd1e5748d9e2ca55f82b441096bdeea4d2c216fc`.

### Async Art — async-art.md

The current site identifies an Async Art archive, and the old market route is missing. An archive is not evidence of an active original marketplace; obtain primary retirement/continuity evidence.

- primary_url: https://async.art — 200
- product_url: https://async.art/market — 404

Expected source blob: `bd3402f4c5f9931e96f83de862980f0612deb0b2`.

### Azuki — azuki.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.azuki.com — 200
- product_url: https://www.azuki.com/collectibles — 404

Expected source blob: `7b9863a95f4d84fed15d82521fe1dfee26160248`.

### Badger — badger.md

The official site discusses sunset legacy frontends. Clarify which currently supported product this row describes; do not infer all contracts or the network are closed.

- primary_url: https://badger.com — 200
- product_url: https://app.badger.com — 200

Expected source blob: `b6d472cbfde81a7e6d6a1ab5d6e4a9263956ce19`.

### Bakkt — bakkt.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.bakkt.com — 200 → https://bakkt.com/
- product_url: https://www.bakkt.com/platform — 404 → https://bakkt.com/platform

Expected source blob: `aa8369fe83f673dc4a491b4ebef491f1d3cd142c`.

### Balancer — balancer.md

Retain the previous wind-down/product concern; current access challenges neither resolve it nor prove a new shutdown.

- primary_url: https://balancer.fi — 429
- product_url: https://app.balancer.fi — 429 → https://balancer.fi/pools

Expected source blob: `8ef8ac4e205a17b0962556ec598b30af39c74d03`.

### BanklessDAO — banklessdao.md

Both old routes now lead to Black Flag DAO Notion. Reconcile renamed organization, current governance activity and official product route.

- primary_url: https://bankless.community — 200 → https://blackflagdao.notion.site/
- product_url: https://bankless.community/join — 200 → https://blackflagdao.notion.site/

Expected source blob: `2675bf6d7afc98ef518b462617c814ee078c5fa9`.

### BarnBridge — barnbridge.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://barnbridge.com — [Errno 8] nodename nor servname provided, or not known
- product_url: https://app.barnbridge.com — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `4cfd272edd1fbdcdeaac9e9b2f80e9e6c5d0874d`.

### bitFlyer — bitflyer.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://bitflyer.com — The read operation timed out
- product_url: https://bitflyer.com/en-jp/exchange — The read operation timed out

Expected source blob: `e0101cf5000722a368290bb038d2020cb43ed913`.

### Bitpanda Custody — bitpanda-custody.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.bitpanda.com/en/custody — 404
- product_url: n/a — No separate product URL recorded; missing value is not a failed request.

Expected source blob: `b5861c63eb3b0f51cfee3e4dbaf3912be56d399e`.

### Blocklords — blocklords.md

The official site announces a change to BLOCKLORE AI creative canvas. Establish current Web3 functionality before replacing the blockchain-game profile.

- primary_url: https://blocklords.com — 200 → https://blocklords.com/en
- product_url: https://blocklords.com — 200 → https://blocklords.com/en

Expected source blob: `d1854eddde2b6c6b80946d0b2a864141ae51908f`.

### Blocknative — blocknative.md

The official site discusses the team joining Deloitte and product/API transitions. Reconcile current products and retirement dates instead of assuming continuity.

- primary_url: https://www.blocknative.com — 200
- product_url: https://www.blocknative.com — 200

Expected source blob: `54a5190f91d4c3731475e4f012037cb804d187db`.

### Blowfish — blowfish.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://blowfish.xyz — <urlopen error [SSL: SSLV3_ALERT_HANDSHAKE_FAILURE] ssl/tls alert handshake failure (_ssl.c:1081)>
- product_url: https://blowfish.xyz — <urlopen error [SSL: SSLV3_ALERT_HANDSHAKE_FAILURE] ssl/tls alert handshake failure (_ssl.c:1081)>

Expected source blob: `035f02db7e7a8a9806e3b46399859e3d0d973563`.

### Blueshift — blueshift.md

The application explicitly reports geographic restriction from this region. Restricted access is not closure evidence.

- primary_url: https://blueshift.fi/ — 200
- product_url: https://app.blueshift.fi/ — 200

Expected source blob: `f804d01fc11f903d9a3cf3bce055cf51720574b9`.

### Breadcrumbs — breadcrumbs.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://www.breadcrumbs.app — 403
- product_url: https://www.breadcrumbs.app/pricing — 403

Expected source blob: `efe82de546fb1d6e235dfcf673d163cacf1d25c9`.

### Bunzz — bunzz.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://www.bunzz.dev/ — 200
- product_url: https://app.bunzz.dev/explorer — 200

Expected source blob: `29da83620488dca9a2cb1791db29fcaf9a5bb8d6`.

### BVOX — bitvenus.md

The official route now redirects to BVOX. Establish precise product/organization continuity before renaming and carrying metadata forward.

- primary_url: https://www.bvox.com/ — 200
- product_url: n/a — No separate product URL recorded; missing value is not a failed request.

Expected source blob: `043fb0f24674ee136747686e344bcdc249d77825`.

### Bware Labs — bware-labs.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://bwarelabs.com — 530
- product_url: https://bwarelabs.com — 530

Expected source blob: `a64c30681552690e35a58b4e40dcc7dff1fd5ab6`.

### BYDFi — bydfi.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.bydfi.com — 200
- product_url: https://www.bydfi.com/trade — 404

Expected source blob: `5dd425e839453bc93d0885d1f4294934298801e9`.

### Cabin — cabin.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://cabin.city — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1129)>
- product_url: https://cabin.city — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1129)>

Expected source blob: `72179158ec827b943f4ba94adc19cab00ae73465`.

### Canto — canto.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://canto.io — 402
- product_url: https://canto.io/ecosystem — 402

Expected source blob: `65b9e4406027609aed3aad905c701ca3035e5d5c`.

### Cellana Finance — cellana-finance.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://cellana.finance — [Errno 8] nodename nor servname provided, or not known
- product_url: https://app.cellana.finance — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `79c2fe81f3460b019bed0c52cf088e843adbb5aa`.

### Centrifuge — centrifuge.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://centrifuge.io — 403
- product_url: https://app.centrifuge.io — 403

Expected source blob: `9135cef801b06e87bd6666be9964da94b9c63fcb`.

### Ceramic — ceramic.md

Documentation is available but the homepage still fails TLS transport. Resolve current network/product identity and ComposeDB route; do not bypass certificate protections.

- primary_url: https://ceramic.network — <urlopen error [SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error (_ssl.c:1081)>
- product_url: https://developers.ceramic.network — 200

Expected source blob: `9e694526ba5d7830c8733bfbc92793cb9f24cbad`.

### CESS — cess.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://cess.network/ — The read operation timed out
- product_url: https://github.com/CESSProject/Whitepaper/blob/main/cess-whitepaper.pdf — 200

Expected source blob: `934a750471f0925783a760ae55c865ae0694dbde`.

### ChainPatrol — chainpatrol.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://chainpatrol.io — 200 → https://chainpatrol.com/
- product_url: https://chainpatrol.io/platform — 404 → https://chainpatrol.com/platform

Expected source blob: `8d0ab1ac1e186a88de67638e89aa41a12205d8da`.

### CharmVerse — charmverse.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://charmverse.io — 200
- product_url: https://app.charmverse.io — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `58dd936fb760356309d68aca9044e3c10f708d78`.

### Civic — civic.md

The homepage now advertises Bryn lead-generation AI. Current onchain Civic product continuity is not established.

- primary_url: https://www.civic.com — 200
- product_url: https://www.civic.com — 200

Expected source blob: `fd14bbcc1085717dd708c53d4f67cdd5ea53fb20`.

### Civic Pass — civic-pass.md

The old pass route is missing and the homepage advertises lead-generation AI. Do not replace Civic Pass with an unrelated current product.

- primary_url: https://www.civic.com/pass — 404
- product_url: https://www.civic.com/pass — 404

Expected source blob: `e56e4ba08a285810c991d43d423e7ea0f9886f79`.

### Coinfirm — coinfirm.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.coinfirm.com — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1129)>
- product_url: https://www.coinfirm.com/products — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1129)>

Expected source blob: `0fbbd2315f7d2e11a70897968bd056029ef4b43f`.

### Commonwealth — commonwealth.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://commonwealth.im — 403 → https://common.xyz/
- product_url: https://commonwealth.im/explore — 403 → https://common.xyz/explore

Expected source blob: `d11867674519dc290062f4d479a25bc42e0546a5`.

### ComposeDB — composedb.md

The current Ceramic documentation root responds, but the specific ComposeDB path is missing. Locate current official product documentation before clearing.

- primary_url: https://developers.ceramic.network — 200
- product_url: https://developers.ceramic.network/docs/composedb — 404 → https://developers.ceramic.network/docs/composedb/

Expected source blob: `df5a9c736578b1fd080f26fb221d689e22242d70`.

### Conic Finance — conic-finance.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://www.conic.finance — 200 → https://conic.finance/
- product_url: https://www.conic.finance/app — 200 → https://conic.finance/app

Expected source blob: `e83e4d0e7b0054831ec86548aa3d933077350405`.

### Coreum — coreum.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.coreum.com — The read operation timed out
- product_url: https://www.coreum.com/ecosystem — The read operation timed out

Expected source blob: `8692b94ccaadd1813345ff79e63cc34d0cc9255d`.

### Corn — corn.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.usecorn.com — 200
- product_url: https://www.usecorn.com/build — 404

Expected source blob: `322a42eae03ce0d64300b0c6766018bae34c2386`.

### Cypher Capital Markets — cypher-capital-markets.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://cyphercm.com — [Errno 8] nodename nor servname provided, or not known
- product_url: https://cyphercm.com/services — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `0d956859e7ffecd2f3df0faa41e7f5b4ee117755`.

### DID.id — did-id.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.did.id — 525
- product_url: https://www.did.id/docs — 525

Expected source blob: `40fddf82410e0d934a0d9fb18b9210df1a5e33cf`.

### DojoSwap — dojoswap.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://dojoswap.xyz — 200
- product_url: https://dojoswap.xyz/swap — 200

Expected source blob: `4e2478f341d366def8905076be348eb330fe95ef`.

### Econia — econia.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.econialabs.com — [Errno 8] nodename nor servname provided, or not known
- product_url: https://www.econialabs.com/products — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `3f018cff784983a5f24859c5080b162d4378fe3b`.

### EigenLayer — eigenlayer.md

Homepage now identifies EigenCloud while the listed app returns 500. Reconcile the restaking product and current onchain scope with the broader AI platform.

- primary_url: https://www.eigenlayer.xyz — 200 → https://www.eigencloud.xyz/
- product_url: https://app.eigenlayer.xyz — 500

Expected source blob: `0c386513019b070649c21d17ff1d3ea6231fa39a`.

### Ekubo — ekubo.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://www.ekubo.org — 403 → https://ekubo.org/
- product_url: https://app.ekubo.org — 403 → https://ekubo.org/

Expected source blob: `9e365a49a8d05f0c60ceab3a46262775f8092dbe`.

### Figment — figment.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://figment.io — 403
- product_url: https://figment.io/staking — 403

Expected source blob: `bf1a9f199a9f52e3f2b304f9b0516e54d117c2c5`.

### Finoa — finoa.md

The homepage now describes infrastructure and says founded in 2019, while the row says 2018; both the old solutions route and the official custody link fail. Reconcile entity, year and product before changing regulated-custody claims.

- primary_url: https://finoa.io — 200 → https://www.finoa.io/
- product_url: https://finoa.io/solutions — 404 → https://www.finoa.io/solutions

Expected source blob: `ba0bb584c4654db993936723b8a28ac393f1ad7a`.

### Fleek — fleek.md

The current destination is a coming-soon product page. A placeholder does not verify the described active Web3 service.

- primary_url: https://fleek.xyz — 200 → https://www.fleek.sh/
- product_url: https://fleek.xyz/products — 200 → https://www.fleek.sh/

Expected source blob: `8fcea36b0ae592a4018e43c750031008fed0c600`.

### Flipside — flipside.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://flipsidecrypto.xyz — 200
- product_url: https://flipsidecrypto.xyz — 200

Expected source blob: `549b286874d2cb051b21221e7cf4ab81493262b6`.

### Fluence — fluence.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://fluence.network — 200 → https://fluence.ai/
- product_url: https://fluence.network/developers — 404 → https://fluence.ai/developers

Expected source blob: `2b13e97ab5af0e71ae47d735b11f2203194e47fa`.

### Fortunafi — fortunafi.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://www.fortunafi.com/ — 200
- product_url: https://app.gitbook.com/o/pKA4LZPny1hWRCEj2kx6/sites/site_2Pq6Y/ — 200

Expected source blob: `5d81f769d922d1184ac275d8915e6f3041b34df7`.

### Fractal ID — fractal-id.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://fractal.id — 503
- product_url: https://fractal.id/for-users — 503

Expected source blob: `bb33a8172f16fc44633582250922b280b893e85e`.

### Friends With Benefits — friends-with-benefits.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.fwb.help — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1129)>
- product_url: https://www.fwb.help/membership — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1129)>

Expected source blob: `6b76944674fb498a0e8f5aea99c31b5497dbc888`.

### Frigg — frigg-eco.md

Renewable-energy financing site and board render, but current crypto/onchain functionality remains unproven.

- primary_url: https://www.frigg.eco/ — 200
- product_url: https://app.frigg.eco/ — 200

Expected source blob: `1de5b2f73bd4c3d6026b05342481c39388bab969`.

### fxhash — fxhash.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://fxhash.xyz — <urlopen error [Errno 61] Connection refused>
- product_url: https://fxhash.xyz/explore — <urlopen error [Errno 61] Connection refused>

Expected source blob: `1995c6ecd6d218c2cacd9139d9290a75f7c263a6`.

### Gelato — gelato.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://gelato.network — 200 → https://gelato.cloud/
- product_url: https://docs.gelato.network — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1129)>

Expected source blob: `9606e22e2526d87fb44ec0a95b366a9d85af50ee`.

### Gelato Web3 Functions — gelato-web3-functions.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.gelato.network/web3-functions — 200 → https://gelato.cloud/
- product_url: https://docs.gelato.network/web3-services/web3-functions — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1129)>

Expected source blob: `75ad6cd44ed9b9c5e8e75e35f12537f97dc3cd34`.

### Govrn — govrn.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.govrn.xyz — [Errno 8] nodename nor servname provided, or not known
- product_url: https://www.govrn.xyz/platform — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `7d478bfc15f985fd49abb5262cc60b268dbfdfd9`.

### Harmony — harmony.md

The current homepage describes AI video. Reconcile current blockchain product and metadata before retaining the original chain description.

- primary_url: https://www.harmony.one — 200
- product_url: https://www.harmony.one — 200

Expected source blob: `4be62326b5fd21653a63a451a49cea62f2dfc543`.

### Helika — helika.md

The current homepage describes an AI character platform. Current Web3 scope and original game-analytics continuity require evidence.

- primary_url: https://www.helika.io — 200
- product_url: https://www.helika.io — 200

Expected source blob: `5683b56238c89517b0df91dc137d60e7c8dee7ab`.

### HeyMint — heymint.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://heymint.xyz — 402
- product_url: https://heymint.xyz — 402

Expected source blob: `c9dede2c1e9bafe52bde989a0663a331fd6b45a7`.

### HMX — hmx.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://hmx.org — [Errno 8] nodename nor servname provided, or not known
- product_url: https://app.hmx.org — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `6983e3758fa690714f18655f500f533a70d2c462`.

### ICON — icon.md

The official site announces network shutdown for 31 December 2026, which is future-dated as of this review. Do not mark already shut down; record the scheduled wind-down.

- primary_url: https://icon.community — 200
- product_url: https://icon.community/ecosystem — 200 → https://icon.community/ecosystem/

Expected source blob: `054fd7d212ad7c5345be2df4806d2f14543152ec`.

### IntoTheBlock — intotheblock.md

Official transition page retires legacy analytics and points to Sentora Research. Prepare a precise successor profile only after verifying current entity/year/HQ; do not carry old metadata into a new entity automatically.

- primary_url: https://app.intotheblock.com — 200 → https://sentora.com/analytics-research
- product_url: https://app.intotheblock.com — 200 → https://sentora.com/analytics-research

Expected source blob: `000d9123d2696a10ab01d4c900e09d2da13be36c`.

### IvendPay — ivendpay.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://ivendpay.com — [Errno 8] nodename nor servname provided, or not known
- product_url: https://ivendpay.com/products — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `5234bfb95e337f2c95dc047fd31a393ab104e1e3`.

### Jambo — jambo.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://jambo.technology — [Errno 8] nodename nor servname provided, or not known
- product_url: https://jambo.technology/products — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `b0e2777d6884e1c2dec20e8c2bb49104a860f072`.

### JediSwap — jediswap.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.jediswap.xyz — [Errno 8] nodename nor servname provided, or not known
- product_url: https://app.jediswap.xyz — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `07186a5f34df4167e27c10581c415ae189ec9769`.

### JEX — jex.md

The homepage is a coming-soon placeholder and the listed app does not resolve. Current active product unverified.

- primary_url: https://jex.trade — 200
- product_url: https://app.jex.trade — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `56a034b9f626f6596d8c353439e391f4458fb4eb`.

### JokeRace — jokerace.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://jokerace.io — 403
- product_url: https://jokerace.io/explore — 403

Expected source blob: `b84fec07374425345f27edb4f9734204116e771c`.

### Kadena — kadena.md

Official site says Kadena LLC ended business on 21 October 2025. Company closure alone does not prove the permissionless chain ended; verify a current community product.

- primary_url: https://kadena.io — 200 → https://www.kadena.io/
- product_url: https://kadena.io/ecosystem — 404 → https://www.kadena.io/ecosystem

Expected source blob: `412b2af08093904c52ad62d1502147463835824b`.

### Kaito — kaito.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://kaito.ai — 403
- product_url: https://kaito.ai/platform — 403

Expected source blob: `349494c9a509f743d8e881d0a5eb3d4cd59db35c`.

### Kilt Protocol — kilt-protocol.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.kilt.io — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1129)>
- product_url: https://www.kilt.io — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1129)>

Expected source blob: `69e087f5d69fe6ce50967a193ad144a8cb356e95`.

### Kinto — kinto.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.kinto.xyz — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'www.kinto.xyz'. (_ssl.c:1129)>
- product_url: https://www.kinto.xyz/build — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'www.kinto.xyz'. (_ssl.c:1129)>

Expected source blob: `49d73644b7b743f1bed11d0e82932551649c2730`.

### KriyaDEX — kriyadex.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://kriya.finance — [Errno 8] nodename nor servname provided, or not known
- product_url: n/a — No separate product URL recorded; missing value is not a failed request.

Expected source blob: `804a71b4f626168e7546f38bb939d5f4c7a3f70c`.

### LATOKEN — latoken.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://latoken.com — 200
- product_url: https://latoken.com/exchange — 200

Expected source blob: `85de28ae150c3335a87141b2996e3fa2793e5175`.

### Leap Wallet — leap-wallet.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.leapwallet.io — 404
- product_url: https://www.leapwallet.io/download — 404

Expected source blob: `737e88b571604a39516e4b4406c348f4f99b3da6`.

### Leapfrog Wallet — leapfrog-wallet.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://leapfrogwallet.xyz — [Errno 8] nodename nor servname provided, or not known
- product_url: https://leapfrogwallet.xyz/download — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `aee68d148547fd00c7ad00616afa07d31e3e3899`.

### LI.FI — li-fi.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://li.fi — 200
- product_url: https://li.fi/products — 404

Expected source blob: `6dc4fb5653752403a86c3cc45a5d9ea60f552148`.

### Lisk — lisk.md

The current page describes stablecoin finance/early access and the old ecosystem route is missing. Reconcile current product against the original L2 profile.

- primary_url: https://lisk.com — 200
- product_url: https://lisk.com/ecosystem — 404 → https://lisk.com/ecosystem/

Expected source blob: `fca8dc10accc2396225394c801903ce3297807df`.

### LogX — logx.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.logx.trade — 200 → https://www.logx.network/
- product_url: https://www.logx.trade/trade — 404

Expected source blob: `7d4f2d993ee4a77cf2fab7311c8a47d5564ee47c`.

### Lybra Finance — lybra-finance.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://lybra.finance — [Errno 8] nodename nor servname provided, or not known
- product_url: https://lybra.finance/app — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `fb5802b5f19eb972b6644acabe8c141632628920`.

### Lykke — lykke.md

The listed homepage redirects to an unrelated X account and the trade route is missing. Confirm original exchange status and source identity before final exclusion.

- primary_url: https://www.lykke.com — 200 → https://x.com/rundns
- product_url: https://www.lykke.com/trade — 404

Expected source blob: `d429d7523f331e58bc21454d75234c9d5b185644`.

### Magic Eden — magic-eden.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://magiceden.io — 403
- product_url: https://magiceden.io — 403

Expected source blob: `6fde67b65c3beae64db40dca61502f79f0a0fc1c`.

### Magic Eden Creator Hub — magic-eden-creator-hub.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://magiceden.io/launchpad — 403
- product_url: https://magiceden.io/launchpad — 403

Expected source blob: `13289a2b76de620e64fb80252a0aad39aff77601`.

### Mango Markets — mango-markets.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://mango.markets — [Errno 8] nodename nor servname provided, or not known
- product_url: https://trade.mango.markets — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `ed7466b11cc03a854facee15bdca077afd1d5ef6`.

### Mars Protocol — mars-protocol.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://marsprotocol.io — [Errno 8] nodename nor servname provided, or not known
- product_url: https://app.marsprotocol.io — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `829144c3edad2ae28f49833db7cd426a57c0515c`.

### Martian Wallet — martian-wallet.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://martianwallet.xyz — [Errno 8] nodename nor servname provided, or not known
- product_url: https://martianwallet.xyz — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `399621676a2f879f4b4a9eed1c52a72e080508bb`.

### Masa — masa.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.masa.finance — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1129)>
- product_url: https://www.masa.finance/products — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired (_ssl.c:1129)>

Expected source blob: `d637ae629820cd07a2204c6664b70c9841c30c61`.

### Matr1x — matr1x.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://matr1x.io — <urlopen error timed out>
- product_url: https://matr1x.io/games — <urlopen error timed out>

Expected source blob: `37483661b04a4cc239c40d64b43c76b7fefc8347`.

### Mercado Bitcoin — mercado-bitcoin.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://www.mercadobitcoin.com.br — 403
- product_url: https://www.mercadobitcoin.com.br/trade — 403

Expected source blob: `7ffa6e5fc84136ecaf58f1d878738a75b0bef91e`.

### Merkle Science — merkle-science.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.merklescience.com — 200
- product_url: https://www.merklescience.com/products — 404

Expected source blob: `2319ef8f43604cc097997e27ee016ca9d060bf66`.

### Metaco — metaco.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://metaco.com — <urlopen error [Errno 54] Connection reset by peer>
- product_url: https://metaco.com/platform — <urlopen error [Errno 54] Connection reset by peer>

Expected source blob: `8d198da4df758dd6f711728093c2cd17fcb5a0c1`.

### Metalabel — metalabel.md

The listed /explore route redirects to a soft-404 page. Current creative marketplace Web3 scope is not established by the homepage alone.

- primary_url: https://www.metalabel.com — 200
- product_url: https://www.metalabel.com/explore — 200 → https://www.metalabel.com/not-found

Expected source blob: `e0b89fa79ff7d5d4efd34001b17b792507c46a4a`.

### MetalCore — metalcore.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.metalcore.gg — <urlopen error [SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error (_ssl.c:1081)>
- product_url: https://www.metalcore.gg — <urlopen error [SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error (_ssl.c:1081)>

Expected source blob: `6a74abe4d44fa890cb06c5fa9919bccbcf5db1ab`.

### Midas — midas.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://midas.app — 403
- product_url: https://midas.app/products — 403

Expected source blob: `432c006f7d3759af6d851ec941567bc410290381`.

### Mina Foundation — mina-foundation.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://mina.foundation — <urlopen error timed out>
- product_url: https://minaprotocol.com — 200

Expected source blob: `4dd9c89bb8bbb5d6843cb1c4d72b2f1ae4e5901d`.

### Mintbase — mintbase.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.mintbase.xyz — 402
- product_url: https://www.mintbase.xyz — 402

Expected source blob: `00f4b748fbd6a6f6f6509d705d6faa8c44c13af3`.

### Mirror — mirror.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://mirror.xyz — 403
- product_url: https://mirror.xyz/discover — 403

Expected source blob: `40d8a7ab580005d6f4b9ad60a5ca289f3254247f`.

### Mocana Gaming — mocana-gaming.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://mocanagaming.com — [Errno 8] nodename nor servname provided, or not known
- product_url: https://mocanagaming.com/games — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `69fc9f2e3ccb30a5af98e2855b84115b01d1fafe`.

### Mocaverse — mocaverse.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://www.mocaverse.xyz — 200
- product_url: https://www.mocaverse.xyz — 200

Expected source blob: `5fe74d3fada86bc8c8d28603174addf46ec03ea0`.

### Moonbeam — moonbeam.md

The current site describes AI-agent settlement on Base; the old build route is missing. Reconcile current identity, chain/token and prior network metadata.

- primary_url: https://moonbeam.network — 200
- product_url: https://moonbeam.network/build — 404

Expected source blob: `0a83b559d9caaba02d3d521b41ef0d37c0899bea`.

### Moonriver — moonriver.md

Both listed routes are missing on the changed Moonbeam website. Find an official current network source before assuming retirement.

- primary_url: https://moonbeam.network/networks/moonriver — 404
- product_url: https://moonbeam.network/networks/moonriver — 404

Expected source blob: `438222790aeb9de37378ce21564832cb6d24726a`.

### Moonwell — moonwell.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://moonwell.fi — 200
- product_url: https://app.moonwell.fi — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `a7dfc360d9150efb2f662e5d6a8dca1cdbf65f15`.

### MoveBit — movebit.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://movebit.xyz/ — 200
- product_url: n/a — No separate product URL recorded; missing value is not a failed request.

Expected source blob: `d2504f6963ce79e811afa7d9970ddfb75f9484e6`.

### Movement Labs — movement-labs.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://movementlabs.xyz — [Errno 8] nodename nor servname provided, or not known
- product_url: https://movementlabs.xyz/ecosystem — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `8469ebcf09569317dd2d7345c700ad2c1d233f62`.

### Neutron — neutron.md

Official destination is an X CLI withdrawal guide. Establish wind-down status and a supported current product before clearing.

- primary_url: https://neutron.org — 200 → https://x.com/neutron_org/status/2072037746424603130
- product_url: https://neutron.org — 200 → https://x.com/neutron_org/status/2072037746424603130

Expected source blob: `6180fc647a98d5134aca7118ba42386d562f8ee8`.

### Nod Games — nod-games.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://nodgames.io — [Errno 8] nodename nor servname provided, or not known
- product_url: https://nodgames.io/games — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `72b8042b26b2bf71f331625f250b573f6b797f0a`.

### Notional Finance — notional-finance.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://notional.finance — 200
- product_url: https://app.notional.finance — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `914205980381165c51473e6d287edf9294d05883`.

### Nyan Heroes — nyan-heroes.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://nyanheroes.com — [Errno 8] nodename nor servname provided, or not known
- product_url: https://nyanheroes.com/game — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `18decf4caa94022961fa6b111fdd44d28fa4f329`.

### NYDIG — nydig.md

The homepage now describes power, compute and Bitcoin infrastructure, while the old solutions path is missing. Reconcile category and current service rather than preserving old custody claims.

- primary_url: https://nydig.com — 200 → https://www.nydig.com/
- product_url: https://nydig.com/solutions — 404 → https://www.nydig.com/solutions

Expected source blob: `be90aad69900e74630c38e4b401c8f68c43661f1`.

### OKLink — oklink.md

Browser renders the explorer UI, but live chain statistics did not populate. Record partial availability, not verified backend operation.

- primary_url: https://www.oklink.com — 200
- product_url: https://www.oklink.com — 200

Expected source blob: `aa057a02e229fa0a51b9a9f9c37ce5b5cc39ffc4`.

### OnCyber — oncyber.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://oncyber.io — 200
- product_url: https://oncyber.io/spaces — 200

Expected source blob: `4035d0da5138a76f35bbadb024fa67f8e5dc8995`.

### OpenAudit — openaudit.md

The site is a coming-soon placeholder, including the marketplace route. Current active product unverified.

- primary_url: https://openaudit.org — 200
- product_url: https://openaudit.org/marketplace — 200

Expected source blob: `ecfd7364d7a02fd3bd3d132aeb683042a75c5285`.

### OpenLaw — openlaw.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://openlaw.io — [Errno 8] nodename nor servname provided, or not known
- product_url: https://openlaw.io/products — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `691d054de49ee071380e56ea0efe96fe28aa5ee2`.

### Opyn — opyn.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://www.opyn.co — 200
- product_url: https://www.opyn.co — 200

Expected source blob: `9a020af4045dbe7044ee76c86467f404dd090c5c`.

### Parallel Finance — parallel-finance.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://parallel.fi — 200
- product_url: https://app.parallel.fi — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `b73562b2ef466d4cbc4815217a1060fb436556c3`.

### Penumbra — penumbra.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://penumbra.zone — 403
- product_url: https://penumbra.zone/learn — 403

Expected source blob: `e5c3479aa70bb94b000e96ba3d62e9272a15fb66`.

### Persistence Core-1 — persistence.md

The homepage leads to a history page. Available documentation does not establish a supported current product or unchanged network identity.

- primary_url: https://persistence.one/history/ — 200
- product_url: https://docs.persistence.one/ — 200

Expected source blob: `4acb1302e037da9d872e0c50793c1d5fe12115ce`.

### Pirate Nation — pirate-nation.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://piratenation.game — 403
- product_url: https://piratenation.game/play — 403

Expected source blob: `29481bba5774b969480568d16c2f314cbb875277`.

### PizzaDAO — pizzadao.md

Both routes lead to Global Pizza Party 2026. Verify continuing DAO identity and governance/crypto scope beyond an event landing page.

- primary_url: https://www.pizzadao.xyz — 200 → https://globalpizza.party/
- product_url: https://www.pizzadao.xyz — 200 → https://globalpizza.party/

Expected source blob: `e432e69c114390841419b847ad28b0b3feb3fb83`.

### Platypus Finance — platypus-finance.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://platypus.finance — 200
- product_url: https://app.platypus.finance — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `db81e2fee820ca273d210feca9cfdfbfb965b4d6`.

### PlayEmber — playember.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://playember.com — 403
- product_url: https://playember.com/games — 403

Expected source blob: `d7dc5ec7ab8f0bf3b16b9cc8d168b1321ff6b4be`.

### PleasrDAO — pleasrdao.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://pleasr.org — The read operation timed out
- product_url: https://pleasr.org — The read operation timed out

Expected source blob: `cbbd1ea7439e9685c0a55dba2cce6304ecdfd5f1`.

### Prisma Finance — prisma-finance.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.prismafinance.com — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self signed certificate (_ssl.c:1129)>
- product_url: https://app.prismafinance.com — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `8e25b4145dccf440b1169858a4549e697c1daf58`.

### Pudgy Penguins — pudgy-penguins.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://www.pudgypenguins.com — 403
- product_url: https://www.pudgypenguins.com/collections — 403

Expected source blob: `f5e978442a11e1681fc439ad7631d4918f09ea4f`.

### Qredo — qredo.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://www.qredo.com — 200
- product_url: https://www.qredo.com — 200

Expected source blob: `7fa3930c68869e76146967584f9c5eb997c28d32`.

### Quasar — quasar.md

Official page discusses a move to Tower.fi and deprecated vaults, but the linked successor renders Site not found. Do not replace with a broken successor or connect a wallet.

- primary_url: https://quasar.fi — 200
- product_url: https://app.quasar.fi — 200

Expected source blob: `2a6e4f286c66497c422f85fb60b3b36724dd04c0`.

### Questbook — questbook.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://questbook.app — 200
- product_url: https://questbook.app/dashboard — 404 → https://questbook.app/dashboard/&chainId=10/

Expected source blob: `972a737b8b34ad5bd59b2bba9240384a3ed47f4f`.

### Raft — raft.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://raft.fi — <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'raft.fi'. (_ssl.c:1129)>
- product_url: n/a — No separate product URL recorded; missing value is not a failed request.

Expected source blob: `3bc6e966469858513f40fcfd483450217d3ef21a`.

### Rage Trade — rage-trade.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.rage.trade — 402
- product_url: https://app.rage.trade — 402

Expected source blob: `829d2d869bfacdd5f81af892c8916edf566d0ff8`.

### Redefine Security — redefine-security.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://redefine.security — [Errno 8] nodename nor servname provided, or not known
- product_url: https://redefine.security/services — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `cff0e780cadcac551f966b440b7e52f74c62bdd5`.

### Reservoir — reservoir.md

Old developer route now leads to Relay documentation and the homepage is access-challenged. Reconcile NFT infrastructure versus successor bridging product.

- primary_url: https://reservoir.tools — 429
- product_url: https://docs.reservoir.tools — 200 → https://docs.relay.link/

Expected source blob: `1d2d3e4db322ee32d89d59801aedacfdda907c2f`.

### Rootstock — rootstock.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://rootstock.io — 200
- product_url: https://rootstock.io/developers — 404 → https://rootstock.io/developers/

Expected source blob: `1a817f91cb44cc54ab18badb7e5c6de6841b17e3`.

### Saakuru — saakuru.md

The homepage now advertises AI-native companies/game studios; the build route is missing. Current Web3 scope requires evidence.

- primary_url: https://saakuru.com — 200 → https://www.saakuru.com/
- product_url: https://saakuru.com/build — 404 → https://www.saakuru.com/build

Expected source blob: `6b22cf10f29064294879fb03afdc2c649e89c8e9`.

### Saga — saga.md

The homepage now advertises character AI agents. Do not assume these are crypto/Web3 agents from the historical chain name.

- primary_url: https://www.saga.xyz — 200 → https://saga.xyz/
- product_url: https://www.saga.xyz — 200 → https://saga.xyz/

Expected source blob: `e1ed02d6887d371755a363c0666a9a5880a141db`.

### Shrapnel — shrapnel.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://www.shrapnel.com — 403
- product_url: https://www.shrapnel.com/play — 403

Expected source blob: `da7723ee22f73b756e70e2e6ba414d0392177963`.

### SimpleHash — simplehash.md

The homepage is missing and documentation now requires a password. Current public product unverified; do not bypass access controls.

- primary_url: https://simplehash.com — 404
- product_url: https://simplehash.readme.io — 200 → https://docs.simplehash.com/password?redirect=%2F

Expected source blob: `bd2bb00c8fc63d0995fdaf4c28f4c92bbad28eac`.

### Skynet Security — skynet-security.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://skynet.security — [Errno 8] nodename nor servname provided, or not known
- product_url: https://skynet.security/products — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `ae2431a384bdae288124bb87375aed451bc3d699`.

### SolanaFM — solanafm.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://solana.fm/ — 200
- product_url: n/a — No separate product URL recorded; missing value is not a failed request.

Expected source blob: `0e489bd9b96303acb6d82394a15f808f7b4d174e`.

### Solend — solend.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://solend.fi — 503
- product_url: https://solend.fi/dashboard — 503

Expected source blob: `3c6a82b74f8952f15a598c13a87d617d8dcf7853`.

### SoSoValue — sosovalue.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://sosovalue.com — 403
- product_url: https://sosovalue.com/markets — 403

Expected source blob: `a85ac3f686921c4910e08a265cd3ee22bb5d4395`.

### Spectral Labs — spectral-syntax.md

The destination now describes Spectral Labs/The Grid inference infrastructure. Verify current crypto/Web3 agent scope and precise product continuity.

- primary_url: https://www.spectrallabs.xyz/ — 200
- product_url: https://app.thegrid.ai/consumption — 200

Expected source blob: `f355651f67724d58734513bdd58278a05a5f47ff`.

### Spheron — spheron.md

The site advertises GPU rentals and the old products route is missing. Current crypto/Web3 functionality is not established by generic cloud hosting.

- primary_url: https://spheron.network — 200 → https://www.spheron.network/
- product_url: https://spheron.network/products — 404 → https://www.spheron.network/products/

Expected source blob: `e8ca5bd1139840bee9b83d5e1a2aafb522ff4c26`.

### SpruceID — spruceid.md

The site now emphasizes government digital trust and the old products route is missing. Identify a current in-scope Web3 product before clearing.

- primary_url: https://www.spruceid.com — 200 → https://spruceid.com/
- product_url: https://www.spruceid.com/products — 404 → https://spruceid.com/products

Expected source blob: `37528f0807e0b98e8e398982500c24ec53bb5d58`.

### Stella — stella.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.stella.org — <urlopen error [Errno 65] No route to host>
- product_url: https://www.stella.org/app — <urlopen error [Errno 65] No route to host>

Expected source blob: `cf9df6d0ce67102daffc24a3c2147eca19c71e65`.

### Story Protocol — story-protocol.md

The destination identifies Data Foundation with AI data focus and an absent ecosystem route. Reconcile chain and entity continuity before carrying metadata forward.

- primary_url: https://story.foundation — 200 → https://www.datafdn.org/
- product_url: https://story.foundation/ecosystem — 404 → https://www.datafdn.org/ecosystem

Expected source blob: `28f5d88fa7fd30ea4af7b6538d02069754ff2e75`.

### Superfluid Governance — superfluid-governance.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.superfluid.finance — 200
- product_url: https://www.superfluid.finance/dao — 404

Expected source blob: `7d54ae8a7960ee57594b56041d29d01293d8416c`.

### Swarm Markets — swarm-markets.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://swarm.com — 200 → https://app.swarm.markets/
- product_url: https://app.swarm.com — 200 → https://app.swarm.markets/

Expected source blob: `39d4f9a33c84207ddd5a89e72deffe520ea99a1c`.

### Tableland — tableland.md

Both routes redirect to Recall Labs wind-down announcement. Verify the status of Tableland itself; company wind-down does not prove a permissionless network universally stopped.

- primary_url: https://tableland.xyz — 200 → https://x.com/RecallLabs_/status/2116235386582426069
- product_url: https://docs.tableland.xyz — 200 → https://x.com/RecallLabs_/status/2116235386582426069

Expected source blob: `cdcc88ec595fc1b616e09500277e231eb4d7ff0e`.

### The Beacon — the-beacon.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://www.thebeacon.gg — 403
- product_url: https://www.thebeacon.gg/play — 403

Expected source blob: `bfed955c837f0c95633097a17757fe059b09321b`.

### The Sandbox — the-sandbox.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://www.sandbox.game — 403
- product_url: https://www.sandbox.game/en/create — 403

Expected source blob: `fe5a89b13b090d093c9669061c3e13027891815c`.

### Thruster — thruster.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://www.thruster.finance — [Errno 8] nodename nor servname provided, or not known
- product_url: https://www.thruster.finance/swap — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `4a713b3483867f21dac226a77808d620c8f497ef`.

### TokenLogic — tokenlogic.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://tokenlogic.xyz — 200 → https://www.tokenlogic.xyz/
- product_url: https://tokenlogic.xyz/research — 404 → https://www.tokenlogic.xyz/research

Expected source blob: `0bba866643496657308ae8a6a006b273e0e77dd7`.

### Trader Joe — trader-joe.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://www.traderjoexyz.com — 403 → https://lfj.gg/?utm_source=TJdomain&utm_medium=referral&utm_campaign=redirect
- product_url: https://traderjoexyz.com/avalanche/trade — 403 → https://lfj.gg/avalanche/trade?utm_source=TJdomain&utm_medium=referral&utm_campaign=redirect

Expected source blob: `512469f9b760923c1c4859224f1668299e7f8762`.

### Trailblaze Security — trailblaze-security.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://trailblaze.security — [Errno 8] nodename nor servname provided, or not known
- product_url: https://trailblaze.security/platform — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `9c1bda808e73693a1396a1920572d79503b2a4c8`.

### Treasure DAO — treasure-dao.md

The homepage advertises Forever Software/coming-soon agent infrastructure and the old product hostname fails. Current in-scope active product unverified.

- primary_url: https://www.treasure.lol — 200 → https://treasure.lol/
- product_url: https://market.treasure.lol — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `38515df7fe50b1b41c9c6291f2de9b3400a76c0c`.

### VeChain Foundation — vechain-foundation.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://www.vechain.org — 200 → https://vechain.org/
- product_url: https://www.vechain.org/ecosystem — 404 → https://vechain.org/ecosystem

Expected source blob: `590e82e62a213b0cd712b5129f4371944618f766`.

### Vela Exchange — vela-exchange.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://vela.exchange — The read operation timed out
- product_url: https://app.vela.exchange — 301 → https://app.vela.exchange/

Expected source blob: `87c0830eb340adeec66b7de42eefde1112652e00`.

### Verite — verite.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://verite.id — 404 → https://developers.circle.com/circle-research/docs
- product_url: https://verite.id/docs — 404 → https://developers.circle.com/circle-research/docs

Expected source blob: `8344b98f00b7d9472592f3b48f69b7b813e307f9`.

### Vertex Protocol — vertex-protocol.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://vertexprotocol.com — 404
- product_url: n/a — No separate product URL recorded; missing value is not a failed request.

Expected source blob: `03d87e2d451e93a1aa85a538a1d51b960e2290ba`.

### WatchPug — watchpug.md

A listed website/product route is missing, paused or unavailable. Confirm an official replacement or retirement before changing this row.

- primary_url: https://watchpug.com — 404
- product_url: n/a — No separate product URL recorded; missing value is not a failed request.

Expected source blob: `45de17ed6d6e9e9a6e0032075c2f2999c661ee25`.

### web3.storage — web3-storage.md

The destination is now Fil One S3 storage for AI. Establish current onchain/Filecoin scope and product continuity, rather than assuming a different successor from older knowledge.

- primary_url: https://web3.storage — 200 → https://www.fil.one/
- product_url: https://web3.storage/docs — 200 → https://www.fil.one/

Expected source blob: `4a0e9c21dffea5343dd031685a3f52d794f456ae`.

### Wildcard — wildcard.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://wildcardgame.com — 200
- product_url: https://wildcardgame.com — 200

Expected source blob: `cc4c4d7445959ec906c6e326d6313afdb6d4be6f`.

### Xai — xai.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://xai.games — 403
- product_url: https://xai.games/ecosystem — 403

Expected source blob: `2a24dd23d38a442d16ebd742fbcb2e3c2eee385c`.

### youves — youves.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://app.youves.com — 200
- product_url: https://app.youves.com/ — 200

Expected source blob: `9a76281fc23951e02fb34882f0041bb6baa9beab`.

### ZebPay — zebpay.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://zebpay.com — 403
- product_url: https://zebpay.com/exchange — 403

Expected source blob: `a2882412668f3037f69e3595696b70fc589cc4e4`.

### Zengo — zengo.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://zengo.com — 403
- product_url: https://zengo.com/download — 403

Expected source blob: `c8ffa4d570ada0e2f864739f2fba3485ed0066ed`.

### Zeta Markets — zeta-markets.md

Public HTML response alone does not resolve the previous editorial hold or establish a currently supported product. Browser/product and identity evidence remains required.

- primary_url: https://zetamarkets.com — 200
- product_url: https://dex.zeta.markets — 200

Expected source blob: `2a58a100babd50327d68903e81962d91d25c169f`.

### Zipmex — zipmex.md

The current site is a Solana DeFi aggregator rather than the described regional exchange; old trade path is missing. Brand reuse alone is insufficient identity continuity.

- primary_url: https://zipmex.com — 200
- product_url: https://zipmex.com/trade — 404 → https://zipmex.com/trade/

Expected source blob: `c73338bb4d366c57a31ba129eaabe7daea130c1c`.

### zkFair — zkfair.md

Access challenge or restriction prevents current product verification. Do not infer shutdown from blocking or bypass the challenge.

- primary_url: https://zkfair.io — 403
- product_url: https://zkfair.io/ecosystem — 403

Expected source blob: `7f28cff8820b541eaffe91d8f0bf8bcbe73a9e3c`.

### ZKSwap Finance — zkswap-finance.md

Listed route has a recorded DNS, certificate, transport or timeout failure. The organization is not presumed closed; identify a current official product or establish retirement.

- primary_url: https://zkswap.finance — [Errno 8] nodename nor servname provided, or not known
- product_url: https://zkswap.finance/app — [Errno 8] nodename nor servname provided, or not known

Expected source blob: `1d65221dfea40882287edfb0329bcc0e9f57cfaf`.
