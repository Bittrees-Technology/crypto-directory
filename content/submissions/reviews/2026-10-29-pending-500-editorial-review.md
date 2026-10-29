# Editorial review of the 500 pending expansion listings

**485 accepted for protected release review · 13 held for follow-up · 2 rejected.**

The 500 additions were already present in CD but still marked `pending_audit`, so Surf correctly excluded them. Under [Curation Policy v1](../../curation-policy.md), `verified` means manually reviewed and accepted for directory inclusion. It does not mean a protocol security audit was performed.

This agent-assisted review accounts for every addition from PRs #27 and #29, reuses their same-day primary evidence, and adds 78 focused browser checks and 47 canonical repository archive-state checks. Every original listing hash matched its proposal. Unknown metadata stays explicit; no account, wallet, installation, payment or transaction was used. Prior proposals remain historical evidence.

The JSON companion records all 500 decisions, before/after hashes, source checks and metadata corrections. Acceptance still requires the independent GitHub review and required checks on the exact proposal commit. This document does not claim publication.

After approval, expected totals are 1,531 retained records: 1,488 verified (including 18 crypto/Web3 AI Agents), 13 needs-update and 30 rejected. CD shows 1,501 non-rejected records. Surf includes the 1,488 verified records and keeps the same filter. The existing publisher must verify both CD addresses before synchronized release is claimed.

## Holds and rejections

| Project | Decision | Reason / resolution needed |
| --- | --- | --- |
| 1212 Capital | `needs_update` | The official investor application explicitly says Coming soon. A live investor/product interface has not been established. |
| Ante Finance | `needs_update` | Both official v0.5 and current v0.6 documentation identify themselves as deprecated; v0.6 was last updated three years ago. Current maintained product continuity needs confirmation. |
| BVOX | `needs_update` | The BVOX product displays a regional-unavailability notice and did not expose usable markets during review. Confirm a current accessible product reference; no regional restriction was bypassed. |
| Blueshift | `needs_update` | The product explicitly blocks access from this review location in the EU. Current product operation could not be independently confirmed here; regional restrictions are not evidence of global shutdown. |
| Bunzz | `needs_update` | The official product explorer explicitly reports that the service is under maintenance. Restore or identify a current usable product reference before acceptance. |
| Fortunafi | `needs_update` | The official documentation domain redirects to an internal GitBook workspace route with no public product content; the follow-up application address could not be reached. Confirm a public current product or documentation route. |
| Frigg | `needs_update` | The renewable-energy business and blockchain positioning are identifiable, but the supplied product application rendered no usable content. Confirm current product access and its onchain functionality. |
| Gardens | `needs_update` | The official governance documentation and source are identifiable, but the current app rendered an empty page. Confirm a functioning community/proposal interface before acceptance. |
| Huma Finance | `needs_update` | The supplied Huma application is region-restricted and the public documentation check did not establish a usable current product interface. Confirm current product availability without bypassing access restrictions. |
| Project X | `needs_update` | The supplied product rendered only Swap/Liquidity/Portfolio/Cashdrop navigation, without a usable trading interface or corroborating product documentation. Current product availability remains uncertain. |
| Solana Bankrun | `rejected` | The official Bankrun documentation explicitly marks the tool deprecated and directs users to LiteSVM, which already has its own entry in this expansion. |
| SolanaFM | `needs_update` | The explorer rendered navigation and loading placeholders, without current blockchain results. Confirm functioning explorer data before acceptance; this is not a finding that the project has shut down. |
| Spectral Labs | `needs_update` | The current linked Grid product provides general AI inference consumption/trading. A legacy SPEC-holder credit offer does not establish a current onchain product or crypto-specific application; clarify current Web3 scope. |
| youves | `needs_update` | The current official application displays a maintenance-in-progress notice with features temporarily unavailable. Confirm restored product availability before acceptance. |
| zkBob | `rejected` | The official app states all pools are deprecated after a discovered vulnerability, deposits and transfers are disabled, and withdrawals are manually processed. The proposed active privacy-transfer listing does not meet the active-product criterion. |

## Corrections made before acceptance

- **Allbridge**: Reviewed Allbridge as the current company/protocol, rather than recommending the Classic application that announces deprecation in November 2026. The official homepage links the live Core app and Core documentation; the rendered Core app exposes a stablecoin transfer interface.
- **August Digital**: Replaced the sibling Upshift documentation link with August's own product page, which describes its credit, trading, contract-account and risk-control infrastructure. August and Upshift are distinct named products and retain separate entries.
- **Cozy Finance**: The current live interface discloses an oracle-related incident and temporarily unavailable disaster-loss payouts while retaining lending/protection interfaces. Added this material limitation to the description. Acceptance is not a finding that payouts, coverage or contracts are safe.
- **Delysium**: The current Delysium homepage identifies Lucy/YKILY and links official Lucy information. The official announcement identifies lucyos.ai; its current landing route redirects to a branded Lucy account page. Replaced the historical blog-as-product URL with that current product entry. No login or agent execution was performed.
- **DoubleZero**: Replaced the PDF whitepaper product link with the official current DoubleZero Edge product page for Hyperliquid market data.
- **Gami Labs**: The original Silo search did not establish the curator. The official homepage also links the Lagoon curator page, which rendered six Gami-labelled vaults; this is now the product URL. Advertised yields and balances are not copied or endorsed.
- **MistTrack**: The account dashboard requires sign-in. The official homepage-linked OpenAPI documentation instead provides a publicly readable product reference, with address, risk and tracing endpoints.
- **My Wallet**: The current official website explicitly identifies the MyTonWallet-to-My Wallet rebrand. The old canonical repository remains linked; name and network description now reflect the current wallet without creating a duplicate.
- **Persistence Core-1**: The root homepage now promotes general business AI. The official history page explicitly confirms the still-operating Core-1 network, staking and governance, and links its current network documentation/explorer. Narrowed this listing to Core-1 rather than the deprecated interoperability product or general AI business.
- **R25**: The default app route was initially blank; the official exchange route rendered an rcUSD exchange/staking interface. Current official Curator Studio documentation corroborates the vault product.
- **Secureum**: Replaced the minimal homepage-as-product reference with the public Secureum Book, which identifies the ongoing Ethereum security education curriculum and its Secureum source repository.
- **TON API**: The old linked Streaming API is deprecated, but TonAPI itself is active. The product reference now points to the current REST API documentation.
- **Tonviewer**: The explorer homepage itself is the live product. Removed the unrelated Keeper wallet download reference; n/a means there is no different product URL.

## Complete decision register

| Project | Category | Decision | Source record |
| --- | --- | --- | --- |
| 1212 Capital | DeFi | `needs_update` | [1212-capital.md](../../projects/1212-capital.md) |
| 3F | DeFi | `verified` | [3f.md](../../projects/3f.md) |
| 3Jane | DeFi | `verified` | [3jane-lending.md](../../projects/3jane-lending.md) |
| 722 Capital | DeFi | `verified` | [722-capital.md](../../projects/722-capital.md) |
| 9Summits | DeFi | `verified` | [9summits.md](../../projects/9summits.md) |
| A0x | AI Agents | `verified` | [a0x.md](../../projects/a0x.md) |
| ABC Pool | DeFi | `verified` | [abc-pool.md](../../projects/abc-pool.md) |
| ABIType | Developer Tools | `verified` | [abitype.md](../../projects/abitype.md) |
| ACryptoS | DeFi | `verified` | [acryptos.md](../../projects/acryptos.md) |
| Aera | DeFi | `verified` | [aera-v3.md](../../projects/aera-v3.md) |
| Agave | Infrastructure | `verified` | [agave.md](../../projects/agave.md) |
| AgenC | AI Agents | `verified` | [agenc.md](../../projects/agenc.md) |
| Agni Finance | DeFi | `verified` | [agni-finance.md](../../projects/agni-finance.md) |
| AILayer | Layer 1 / Layer 2 | `verified` | [ailayer-farm.md](../../projects/ailayer-farm.md) |
| AIOZ Network | Infrastructure | `verified` | [aioz-network.md](../../projects/aioz-network.md) |
| Allbridge | Infrastructure | `verified` | [allbridge-classic.md](../../projects/allbridge-classic.md) |
| Allora | Infrastructure | `verified` | [allora.md](../../projects/allora.md) |
| Alloy | Developer Tools | `verified` | [alloy.md](../../projects/alloy.md) |
| Almanak | AI Agents | `verified` | [almanak.md](../../projects/almanak.md) |
| Ambire Wallet | Wallets | `verified` | [ambire-wallet.md](../../projects/ambire-wallet.md) |
| Anchor | Developer Tools | `verified` | [anchor.md](../../projects/anchor.md) |
| Anemoy | Real World Assets (RWA) | `verified` | [anemoy-capital.md](../../projects/anemoy-capital.md) |
| Angstrom | DeFi | `verified` | [angstrom.md](../../projects/angstrom.md) |
| Anon Aadhaar | Identity | `verified` | [anon-aadhaar.md](../../projects/anon-aadhaar.md) |
| Ante Finance | Security | `needs_update` | [ante-finance.md](../../projects/ante-finance.md) |
| Anvil | DeFi | `verified` | [anvil.md](../../projects/anvil.md) |
| Ape Framework | Developer Tools | `verified` | [ape-framework.md](../../projects/ape-framework.md) |
| ApeBond | DeFi | `verified` | [apeswap-amm.md](../../projects/apeswap-amm.md) |
| Apostro | DeFi | `verified` | [apostro.md](../../projects/apostro.md) |
| Aquarius | DeFi | `verified` | [aquarius-stellar.md](../../projects/aquarius-stellar.md) |
| Archway | Layer 1 / Layer 2 | `verified` | [archway.md](../../projects/archway.md) |
| Aster | DeFi | `verified` | [aster-bridge.md](../../projects/aster-bridge.md) |
| Audius | NFTs & Creator Economy | `verified` | [audius.md](../../projects/audius.md) |
| August Digital | DeFi | `verified` | [august-digital.md](../../projects/august-digital.md) |
| Avant Protocol | DeFi | `verified` | [avant-avusd.md](../../projects/avant-avusd.md) |
| Axis | DeFi | `verified` | [axis.md](../../projects/axis.md) |
| b14g | DeFi | `verified` | [b14g.md](../../projects/b14g.md) |
| BabelFish | Infrastructure | `verified` | [babelfish.md](../../projects/babelfish.md) |
| Babylon Protocol | Infrastructure | `verified` | [babylon-protocol.md](../../projects/babylon-protocol.md) |
| Bailsec | Security | `verified` | [bailsec.md](../../projects/bailsec.md) |
| Bankr | AI Agents | `verified` | [bankr.md](../../projects/bankr.md) |
| Beam Privacy Network | Layer 1 / Layer 2 | `verified` | [beam-privacy-network.md](../../projects/beam-privacy-network.md) |
| Bellman | Developer Tools | `verified` | [bellman.md](../../projects/bellman.md) |
| BigONE | Payments | `verified` | [bigone.md](../../projects/bigone.md) |
| Binaryx | Real World Assets (RWA) | `verified` | [binaryx-platform.md](../../projects/binaryx-platform.md) |
| Bitcoin Core | Infrastructure | `verified` | [bitcoin-core.md](../../projects/bitcoin-core.md) |
| Bitcoin Dev Kit | Developer Tools | `verified` | [bitcoin-dev-kit.md](../../projects/bitcoin-dev-kit.md) |
| Bitcoin Knots | Infrastructure | `verified` | [bitcoin-knots.md](../../projects/bitcoin-knots.md) |
| BitFi | DeFi | `verified` | [bitfi-basis.md](../../projects/bitfi-basis.md) |
| Bitlo | Payments | `verified` | [bitlo.md](../../projects/bitlo.md) |
| Bittensor | Infrastructure | `verified` | [bittensor.md](../../projects/bittensor.md) |
| Bitunix | Payments | `verified` | [bitunix.md](../../projects/bitunix.md) |
| BVOX | Payments | `needs_update` | [bitvenus.md](../../projects/bitvenus.md) |
| BitVM | Infrastructure | `verified` | [bitvm.md](../../projects/bitvm.md) |
| BitVMX | Infrastructure | `verified` | [bitvmx.md](../../projects/bitvmx.md) |
| BlazeStake | DeFi | `verified` | [blazestake.md](../../projects/blazestake.md) |
| Blend | DeFi | `verified` | [blend-pools-v2.md](../../projects/blend-pools-v2.md) |
| BlindPay | Payments | `verified` | [blindpay.md](../../projects/blindpay.md) |
| BlockVision | Infrastructure | `verified` | [blockvision.md](../../projects/blockvision.md) |
| Blueshift | DeFi | `needs_update` | [blueshift.md](../../projects/blueshift.md) |
| Boar Network | Developer Tools | `verified` | [boar-blockchain-mcp.md](../../projects/boar-blockchain-mcp.md) |
| Bonzo Finance | DeFi | `verified` | [bonzo-lend.md](../../projects/bonzo-lend.md) |
| Boson Protocol | Real World Assets (RWA) | `verified` | [boson-protocol.md](../../projects/boson-protocol.md) |
| Braiins | Infrastructure | `verified` | [braiins.md](../../projects/braiins.md) |
| Brickken | Real World Assets (RWA) | `verified` | [brickken.md](../../projects/brickken.md) |
| BuidlGuidl | Developer Tools | `verified` | [buidlguidl.md](../../projects/buidlguidl.md) |
| BulbaSwap | DeFi | `verified` | [bulbaswap-v3.md](../../projects/bulbaswap-v3.md) |
| BULK | DeFi | `verified` | [bulk.md](../../projects/bulk.md) |
| Bunzz | Developer Tools | `needs_update` | [bunzz.md](../../projects/bunzz.md) |
| Byreal | DeFi | `verified` | [byreal.md](../../projects/byreal.md) |
| Byte Exchange | Payments | `verified` | [byte-exchange.md](../../projects/byte-exchange.md) |
| Cairo | Developer Tools | `verified` | [cairo.md](../../projects/cairo.md) |
| Cake Wallet | Wallets | `verified` | [cake-wallet.md](../../projects/cake-wallet.md) |
| Capyfi | DeFi | `verified` | [capyfi.md](../../projects/capyfi.md) |
| Carbon | Developer Tools | `verified` | [carbon.md](../../projects/carbon.md) |
| CESS | Infrastructure | `verified` | [cess.md](../../projects/cess.md) |
| ChainGPT | AI Agents | `verified` | [chaingpt.md](../../projects/chaingpt.md) |
| ChainLight | Security | `verified` | [chainlight.md](../../projects/chainlight.md) |
| ChainPort | Infrastructure | `verified` | [chainport.md](../../projects/chainport.md) |
| Chamber | DeFi | `verified` | [chamber-vaults.md](../../projects/chamber-vaults.md) |
| Chopsticks | Developer Tools | `verified` | [chopsticks.md](../../projects/chopsticks.md) |
| Chutes | Infrastructure | `verified` | [chutes.md](../../projects/chutes.md) |
| CIAN | DeFi | `verified` | [cian-yield-layer.md](../../projects/cian-yield-layer.md) |
| BlockRun | Developer Tools | `verified` | [clawrouter-blockrun.md](../../projects/clawrouter-blockrun.md) |
| clr.fund | DAOs & Governance | `verified` | [clr-fund.md](../../projects/clr-fund.md) |
| COD3X | AI Agents | `verified` | [cod3x.md](../../projects/cod3x.md) |
| Codama | Developer Tools | `verified` | [codama.md](../../projects/codama.md) |
| CometBFT | Infrastructure | `verified` | [cometbft.md](../../projects/cometbft.md) |
| Cometh | Infrastructure | `verified` | [cometh.md](../../projects/cometh.md) |
| Composable Security | Security | `verified` | [composable-security.md](../../projects/composable-security.md) |
| Concrete | DeFi | `verified` | [concrete.md](../../projects/concrete.md) |
| Contango | DeFi | `verified` | [contango-v2.md](../../projects/contango-v2.md) |
| CosmJS | Developer Tools | `verified` | [cosmjs.md](../../projects/cosmjs.md) |
| Cosmos SDK | Developer Tools | `verified` | [cosmos-sdk.md](../../projects/cosmos-sdk.md) |
| CosmWasm | Developer Tools | `verified` | [cosmwasm.md](../../projects/cosmwasm.md) |
| Cozy Finance | Security | `verified` | [cozy-earn.md](../../projects/cozy-earn.md) |
| Crust Network | Infrastructure | `verified` | [crust-network.md](../../projects/crust-network.md) |
| CryptoZombies | Developer Tools | `verified` | [cryptozombies.md](../../projects/cryptozombies.md) |
| Current Finance | Real World Assets (RWA) | `verified` | [current.md](../../projects/current.md) |
| Curvance | DeFi | `verified` | [curvance.md](../../projects/curvance.md) |
| DAMM Capital | DeFi | `verified` | [damm-capital.md](../../projects/damm-capital.md) |
| Dappnode | Infrastructure | `verified` | [dappnode.md](../../projects/dappnode.md) |
| Dash | Layer 1 / Layer 2 | `verified` | [dash.md](../../projects/dash.md) |
| Daydreams | AI Agents | `verified` | [daydreams.md](../../projects/daydreams.md) |
| Decibel | DeFi | `verified` | [decibel.md](../../projects/decibel.md) |
| Decred | Layer 1 / Layer 2 | `verified` | [decred.md](../../projects/decred.md) |
| Decurity | Security | `verified` | [decurity.md](../../projects/decurity.md) |
| DeDust | DeFi | `verified` | [dedust.md](../../projects/dedust.md) |
| DeepBook | DeFi | `verified` | [deepbook-v3.md](../../projects/deepbook-v3.md) |
| DeFindex | DeFi | `verified` | [defindex.md](../../projects/defindex.md) |
| Delysium | AI Agents | `verified` | [delysium.md](../../projects/delysium.md) |
| Deri Protocol | DeFi | `verified` | [deri-v4.md](../../projects/deri-v4.md) |
| DexPaprika | Developer Tools | `verified` | [dexpaprika-mcp-server.md](../../projects/dexpaprika-mcp-server.md) |
| DigiByte | Layer 1 / Layer 2 | `verified` | [digibyte.md](../../projects/digibyte.md) |
| Dojo | Developer Tools | `verified` | [dojo.md](../../projects/dojo.md) |
| DoubleZero | Infrastructure | `verified` | [doublezero-staked-sol.md](../../projects/doublezero-staked-sol.md) |
| Drips | DAOs & Governance | `verified` | [drips.md](../../projects/drips.md) |
| Dwellir | Infrastructure | `verified` | [dwellir.md](../../projects/dwellir.md) |
| Dymension | Layer 1 / Layer 2 | `verified` | [dymension.md](../../projects/dymension.md) |
| Ease | Security | `verified` | [easedefi-org.md](../../projects/easedefi-org.md) |
| Echidna | Security | `verified` | [echidna.md](../../projects/echidna.md) |
| Echo Protocol | DeFi | `verified` | [echo-bridge.md](../../projects/echo-bridge.md) |
| Electrs | Infrastructure | `verified` | [electrs.md](../../projects/electrs.md) |
| elizaOS | AI Agents | `verified` | [elizaos.md](../../projects/elizaos.md) |
| Enosys Loans | DeFi | `verified` | [enosys-loans.md](../../projects/enosys-loans.md) |
| Enso | Developer Tools | `verified` | [enso.md](../../projects/enso.md) |
| Ensuro | Security | `verified` | [ensuro.md](../../projects/ensuro.md) |
| Equilibria | DeFi | `verified` | [equilibria.md](../../projects/equilibria.md) |
| Ergo | Layer 1 / Layer 2 | `verified` | [ergo.md](../../projects/ergo.md) |
| Erigon | Infrastructure | `verified` | [erigon.md](../../projects/erigon.md) |
| EthereumJS | Developer Tools | `verified` | [ethereumjs.md](../../projects/ethereumjs.md) |
| ethers.js | Developer Tools | `verified` | [ethers-js.md](../../projects/ethers-js.md) |
| ethPandaOps | Developer Tools | `verified` | [ethpandaops.md](../../projects/ethpandaops.md) |
| EthStaker | Infrastructure | `verified` | [ethstaker.md](../../projects/ethstaker.md) |
| EthStorage | Infrastructure | `verified` | [ethstorage.md](../../projects/ethstorage.md) |
| eva Markets | Real World Assets (RWA) | `verified` | [eva-markets.md](../../projects/eva-markets.md) |
| EVAA Protocol | DeFi | `verified` | [evaa-protocol.md](../../projects/evaa-protocol.md) |
| EVE Frontier | Gaming | `verified` | [eve-frontier.md](../../projects/eve-frontier.md) |
| Exceed Finance | Real World Assets (RWA) | `verified` | [exceed-finance.md](../../projects/exceed-finance.md) |
| Exponent | DeFi | `verified` | [exponent-yield-exchange.md](../../projects/exponent-yield-exchange.md) |
| Fe | Developer Tools | `verified` | [fe.md](../../projects/fe.md) |
| Fearless Wallet | Wallets | `verified` | [fearless-wallet.md](../../projects/fearless-wallet.md) |
| Feather Wallet | Wallets | `verified` | [feather-wallet.md](../../projects/feather-wallet.md) |
| Fetch.ai uAgents | AI Agents | `verified` | [fetch-ai-uagents.md](../../projects/fetch-ai-uagents.md) |
| Fira | DeFi | `verified` | [fira.md](../../projects/fira.md) |
| Firedancer | Infrastructure | `verified` | [firedancer.md](../../projects/firedancer.md) |
| Firelight | Security | `verified` | [firelight.md](../../projects/firelight.md) |
| Firo | Layer 1 / Layer 2 | `verified` | [firo.md](../../projects/firo.md) |
| Flaunch | Developer Tools | `verified` | [flaunch.md](../../projects/flaunch.md) |
| Flipster | Payments | `verified` | [flipster.md](../../projects/flipster.md) |
| Flock.io | Infrastructure | `verified` | [flock-io.md](../../projects/flock-io.md) |
| Flux | Infrastructure | `verified` | [flux.md](../../projects/flux.md) |
| Fluxion | DeFi | `verified` | [fluxion-network.md](../../projects/fluxion-network.md) |
| Forest Road Vault | Real World Assets (RWA) | `verified` | [forest-road-vault.md](../../projects/forest-road-vault.md) |
| Fortunafi | Real World Assets (RWA) | `needs_update` | [fortunafi.md](../../projects/fortunafi.md) |
| Frankencoin | DeFi | `verified` | [frankencoin.md](../../projects/frankencoin.md) |
| Fren Pet | Gaming | `verified` | [fren-pets.md](../../projects/fren-pets.md) |
| Frigg | Real World Assets (RWA) | `needs_update` | [frigg-eco.md](../../projects/frigg-eco.md) |
| Fulcrom Finance | DeFi | `verified` | [fulcrom-perps.md](../../projects/fulcrom-perps.md) |
| Fulcrum | Infrastructure | `verified` | [fulcrum.md](../../projects/fulcrum.md) |
| Function | Infrastructure | `verified` | [function-fbtc.md](../../projects/function-fbtc.md) |
| Funding the Commons | DAOs & Governance | `verified` | [funding-the-commons.md](../../projects/funding-the-commons.md) |
| f(x) Protocol | DeFi | `verified` | [fx-protocol.md](../../projects/fx-protocol.md) |
| Gami Labs | DeFi | `verified` | [gami-labs.md](../../projects/gami-labs.md) |
| Gardens | DAOs & Governance | `needs_update` | [gardens.md](../../projects/gardens.md) |
| Gauntlet | DeFi | `verified` | [gauntlet.md](../../projects/gauntlet.md) |
| Geth | Infrastructure | `verified` | [geth.md](../../projects/geth.md) |
| Giveth | DAOs & Governance | `verified` | [giveth.md](../../projects/giveth.md) |
| Giza | AI Agents | `verified` | [giza-arma.md](../../projects/giza-arma.md) |
| gnark | Developer Tools | `verified` | [gnark.md](../../projects/gnark.md) |
| Golem | Infrastructure | `verified` | [golem.md](../../projects/golem.md) |
| GONDI | NFTs & Creator Economy | `verified` | [gondi-v3.md](../../projects/gondi-v3.md) |
| Grandine | Infrastructure | `verified` | [grandine.md](../../projects/grandine.md) |
| Griffin AI | AI Agents | `verified` | [griffin-ai.md](../../projects/griffin-ai.md) |
| Grin | Layer 1 / Layer 2 | `verified` | [grin.md](../../projects/grin.md) |
| Grove | DeFi | `verified` | [grove-finance.md](../../projects/grove-finance.md) |
| Haedal Protocol | DeFi | `verified` | [haedal-protocol.md](../../projects/haedal-protocol.md) |
| Halmos | Security | `verified` | [halmos.md](../../projects/halmos.md) |
| Halo2 | Developer Tools | `verified` | [halo2.md](../../projects/halo2.md) |
| Hardhat | Developer Tools | `verified` | [hardhat.md](../../projects/hardhat.md) |
| Harvest Finance | Data & Analytics | `verified` | [harvest-finance.md](../../projects/harvest-finance.md) |
| HashKey Exchange | Payments | `verified` | [hashkey-exchange.md](../../projects/hashkey-exchange.md) |
| HertzFlow | DeFi | `verified` | [hertzflow.md](../../projects/hertzflow.md) |
| Hevm | Security | `verified` | [hevm.md](../../projects/hevm.md) |
| Hipo | DeFi | `verified` | [hipo.md](../../projects/hipo.md) |
| HiYield | Real World Assets (RWA) | `verified` | [hiyield.md](../../projects/hiyield.md) |
| Horizen | Layer 1 / Layer 2 | `verified` | [horizen.md](../../projects/horizen.md) |
| Hotcoin | Payments | `verified` | [hotcoin.md](../../projects/hotcoin.md) |
| Huma Finance | Real World Assets (RWA) | `needs_update` | [huma.md](../../projects/huma.md) |
| Hyperledger Besu | Infrastructure | `verified` | [hyperledger-besu.md](../../projects/hyperledger-besu.md) |
| HyperLend | DeFi | `verified` | [hyperlend-pooled.md](../../projects/hyperlend-pooled.md) |
| Hyperweb | Developer Tools | `verified` | [hyperweb.md](../../projects/hyperweb.md) |
| HypurrFi | DeFi | `verified` | [hypurrfi-pooled.md](../../projects/hypurrfi-pooled.md) |
| IBC Go | Developer Tools | `verified` | [ibc-go.md](../../projects/ibc-go.md) |
| Ignite | Developer Tools | `verified` | [ignite.md](../../projects/ignite.md) |
| Imperator | Infrastructure | `verified` | [imperator.md](../../projects/imperator.md) |
| Index Coop | DeFi | `verified` | [index-coop.md](../../projects/index-coop.md) |
| Indodax | Payments | `verified` | [indodax.md](../../projects/indodax.md) |
| Influence | Gaming | `verified` | [influence.md](../../projects/influence.md) |
| Infrared Finance | DeFi | `verified` | [infrared-finance.md](../../projects/infrared-finance.md) |
| IPOR Fusion | DeFi | `verified` | [ipor-fusion.md](../../projects/ipor-fusion.md) |
| Iron Fish | Layer 1 / Layer 2 | `verified` | [iron-fish.md](../../projects/iron-fish.md) |
| JagPool | DeFi | `verified` | [jagpool-staked-sol.md](../../projects/jagpool-staked-sol.md) |
| Jolt | Developer Tools | `verified` | [jolt.md](../../projects/jolt.md) |
| JPool | DeFi | `verified` | [jpool.md](../../projects/jpool.md) |
| K3 Capital | DeFi | `verified` | [k3-capital.md](../../projects/k3-capital.md) |
| KAIO | Real World Assets (RWA) | `verified` | [kaio.md](../../projects/kaio.md) |
| Kaspa | Layer 1 / Layer 2 | `verified` | [kaspa.md](../../projects/kaspa.md) |
| Kinetic | DeFi | `verified` | [kinetic.md](../../projects/kinetic.md) |
| Markets.xyz | DeFi | `verified` | [kinetiq-kmhype.md](../../projects/kinetiq-kmhype.md) |
| Kodiak | DeFi | `verified` | [kodiak-islands.md](../../projects/kodiak-islands.md) |
| Komodo Platform | Infrastructure | `verified` | [komodo-platform.md](../../projects/komodo-platform.md) |
| Kontrol | Security | `verified` | [kontrol.md](../../projects/kontrol.md) |
| KPK | DeFi | `verified` | [kpk.md](../../projects/kpk.md) |
| KTON | DeFi | `verified` | [kton.md](../../projects/kton.md) |
| Kurtosis | Developer Tools | `verified` | [kurtosis.md](../../projects/kurtosis.md) |
| Kyros | DeFi | `verified` | [kyros.md](../../projects/kyros.md) |
| Lambdaworks | Developer Tools | `verified` | [lambdaworks.md](../../projects/lambdaworks.md) |
| LayerBank | DeFi | `verified` | [layerbank.md](../../projects/layerbank.md) |
| Least Authority | Security | `verified` | [least-authority.md](../../projects/least-authority.md) |
| Lightning Dev Kit | Developer Tools | `verified` | [lightning-dev-kit.md](../../projects/lightning-dev-kit.md) |
| LiNEAR Protocol | DeFi | `verified` | [linear-protocol.md](../../projects/linear-protocol.md) |
| Liquid Collective | DeFi | `verified` | [liquid-collective.md](../../projects/liquid-collective.md) |
| Liquidium | DeFi | `verified` | [liquidium.md](../../projects/liquidium.md) |
| Lista DAO | DeFi | `verified` | [lista-lending.md](../../projects/lista-lending.md) |
| Litecoin | Layer 1 / Layer 2 | `verified` | [litecoin.md](../../projects/litecoin.md) |
| LiteSVM | Developer Tools | `verified` | [litesvm.md](../../projects/litesvm.md) |
| Livepeer | Infrastructure | `verified` | [livepeer.md](../../projects/livepeer.md) |
| LlamaPay | Payments | `verified` | [llamapay.md](../../projects/llamapay.md) |
| Lodestar | Infrastructure | `verified` | [lodestar.md](../../projects/lodestar.md) |
| Loot Survivor | Gaming | `verified` | [loot-survivor.md](../../projects/loot-survivor.md) |
| Lucid Labs | Infrastructure | `verified` | [lucid-labs.md](../../projects/lucid-labs.md) |
| Lulo | DeFi | `verified` | [lulo.md](../../projects/lulo.md) |
| M0 | DeFi | `verified` | [m0.md](../../projects/m0.md) |
| MACI | DAOs & Governance | `verified` | [maci.md](../../projects/maci.md) |
| MadeOnSol | Data & Analytics | `verified` | [madeonsol.md](../../projects/madeonsol.md) |
| Makina | DeFi | `verified` | [makina.md](../../projects/makina.md) |
| MapleStory Universe | Gaming | `verified` | [maplestory-universe.md](../../projects/maplestory-universe.md) |
| Mayan | Infrastructure | `verified` | [mayan-bridge.md](../../projects/mayan-bridge.md) |
| Medusa | Security | `verified` | [medusa.md](../../projects/medusa.md) |
| MegaETH | Layer 1 / Layer 2 | `verified` | [megaeth-bridge.md](../../projects/megaeth-bridge.md) |
| Mempool | Data & Analytics | `verified` | [mempool.md](../../projects/mempool.md) |
| Merchant Moe | DeFi | `verified` | [merchant-moe-liquidity-book.md](../../projects/merchant-moe-liquidity-book.md) |
| mETH Protocol | DeFi | `verified` | [meth-protocol.md](../../projects/meth-protocol.md) |
| Metronome | DeFi | `verified` | [metronome-synth.md](../../projects/metronome-synth.md) |
| Miden | Layer 1 / Layer 2 | `verified` | [miden.md](../../projects/miden.md) |
| MistTrack | Security | `verified` | [misttrack-mcp.md](../../projects/misttrack-mcp.md) |
| Mollusk | Developer Tools | `verified` | [mollusk.md](../../projects/mollusk.md) |
| Monero | Layer 1 / Layer 2 | `verified` | [monero.md](../../projects/monero.md) |
| Money On Chain | DeFi | `verified` | [moneyonchain.md](../../projects/moneyonchain.md) |
| Moonlander | DeFi | `verified` | [moonlander.md](../../projects/moonlander.md) |
| MORE Markets | DeFi | `verified` | [more-markets.md](../../projects/more-markets.md) |
| Morpheus | Infrastructure | `verified` | [morpheus.md](../../projects/morpheus.md) |
| MoveBit | Security | `verified` | [movebit.md](../../projects/movebit.md) |
| MUD | Developer Tools | `verified` | [mud.md](../../projects/mud.md) |
| MUX Protocol | DeFi | `verified` | [mux-perps.md](../../projects/mux-perps.md) |
| Mystic Finance | DeFi | `verified` | [mystic-finance-lending.md](../../projects/mystic-finance-lending.md) |
| Mythril | Security | `verified` | [mythril.md](../../projects/mythril.md) |
| My Wallet | Wallets | `verified` | [mytonwallet.md](../../projects/mytonwallet.md) |
| Nara | Real World Assets (RWA) | `verified` | [narausd.md](../../projects/narausd.md) |
| Native | DeFi | `verified` | [native-credit-pool.md](../../projects/native-credit-pool.md) |
| NBX | Custody | `verified` | [nbx.md](../../projects/nbx.md) |
| Neptune Finance | DeFi | `verified` | [neptune-finance.md](../../projects/neptune-finance.md) |
| Nethereum | Developer Tools | `verified` | [nethereum.md](../../projects/nethereum.md) |
| Neutral Trade | DeFi | `verified` | [neutral-trade.md](../../projects/neutral-trade.md) |
| Neverland | DeFi | `verified` | [neverland.md](../../projects/neverland.md) |
| Nexa | Layer 1 / Layer 2 | `verified` | [nexa.md](../../projects/nexa.md) |
| Nexus Mutual | Security | `verified` | [nexus-mutual-insurance.md](../../projects/nexus-mutual-insurance.md) |
| NFTX | NFTs & Creator Economy | `verified` | [nftx.md](../../projects/nftx.md) |
| Nimbus | Infrastructure | `verified` | [nimbus.md](../../projects/nimbus.md) |
| Noble | Layer 1 / Layer 2 | `verified` | [noble.md](../../projects/noble.md) |
| Nodit | Developer Tools | `verified` | [nodit-mcp-server.md](../../projects/nodit-mcp-server.md) |
| Noir | Developer Tools | `verified` | [noir.md](../../projects/noir.md) |
| Nonce Capital | DeFi | `verified` | [nonce-capital.md](../../projects/nonce-capital.md) |
| NonKYC | Payments | `verified` | [nonkyc.md](../../projects/nonkyc.md) |
| Nosana | Infrastructure | `verified` | [nosana.md](../../projects/nosana.md) |
| Nova Markets | DeFi | `verified` | [nova-nlp.md](../../projects/nova-nlp.md) |
| Nova Wallet | Wallets | `verified` | [nova-wallet.md](../../projects/nova-wallet.md) |
| Numia | Data & Analytics | `verified` | [numia.md](../../projects/numia.md) |
| NUVA | Real World Assets (RWA) | `verified` | [nuva.md](../../projects/nuva.md) |
| OCEAN | Infrastructure | `verified` | [ocean.md](../../projects/ocean.md) |
| Olas | AI Agents | `verified` | [olas-autonolas.md](../../projects/olas-autonolas.md) |
| OnFinality | Infrastructure | `verified` | [onfinality.md](../../projects/onfinality.md) |
| OORT | Infrastructure | `verified` | [oort.md](../../projects/oort.md) |
| Open Wallet Standard | Wallets | `verified` | [open-wallet-standard-ows.md](../../projects/open-wallet-standard-ows.md) |
| OpenLedger | Infrastructure | `verified` | [openledger.md](../../projects/openledger.md) |
| Oraichain | Infrastructure | `verified` | [oraichain.md](../../projects/oraichain.md) |
| OrangeX | Payments | `verified` | [orangex.md](../../projects/orangex.md) |
| Orderly Network | Infrastructure | `verified` | [orderly-bridge.md](../../projects/orderly-bridge.md) |
| Oro Finance | Real World Assets (RWA) | `verified` | [oro-finance.md](../../projects/oro-finance.md) |
| OSL | Payments | `verified` | [osl-exchange.md](../../projects/osl-exchange.md) |
| Ostium | DeFi | `verified` | [ostium.md](../../projects/ostium.md) |
| Ourbit | Payments | `verified` | [ourbit.md](../../projects/ourbit.md) |
| Ox | Developer Tools | `verified` | [ox.md](../../projects/ox.md) |
| P2B | Payments | `verified` | [p2pb2b.md](../../projects/p2pb2b.md) |
| Pacifica | DeFi | `verified` | [pacifica-bridge.md](../../projects/pacifica-bridge.md) |
| Paima Engine | Developer Tools | `verified` | [paima-engine.md](../../projects/paima-engine.md) |
| Paimon Finance | Real World Assets (RWA) | `verified` | [paimon.md](../../projects/paimon.md) |
| Papertrade | DeFi | `verified` | [papertrade.md](../../projects/papertrade.md) |
| Pashov Audit Group | Security | `verified` | [pashov-audit-group.md](../../projects/pashov-audit-group.md) |
| Pay Protocol | Payments | `verified` | [pay-protocol.md](../../projects/pay-protocol.md) |
| Persistence Core-1 | Layer 1 / Layer 2 | `verified` | [persistence.md](../../projects/persistence.md) |
| Pieverse | AI Agents | `verified` | [pieverse.md](../../projects/pieverse.md) |
| Ping.pub | Data & Analytics | `verified` | [ping-pub.md](../../projects/ping-pub.md) |
| Pixelmon | Gaming | `verified` | [pixelmon.md](../../projects/pixelmon.md) |
| Plonky3 | Developer Tools | `verified` | [plonky3.md](../../projects/plonky3.md) |
| Plume Vaults | Real World Assets (RWA) | `verified` | [plume-vaults.md](../../projects/plume-vaults.md) |
| Polkachu | Infrastructure | `verified` | [polkachu.md](../../projects/polkachu.md) |
| Polkadot API | Developer Tools | `verified` | [polkadot-api.md](../../projects/polkadot-api.md) |
| Polkadot SDK | Developer Tools | `verified` | [polkadot-sdk.md](../../projects/polkadot-sdk.md) |
| Poloniex | Payments | `verified` | [poloniex.md](../../projects/poloniex.md) |
| Ponder | Developer Tools | `verified` | [ponder.md](../../projects/ponder.md) |
| PoolTogether | DeFi | `verified` | [pooltogether-v3.md](../../projects/pooltogether-v3.md) |
| Pop CLI | Developer Tools | `verified` | [pop-cli.md](../../projects/pop-cli.md) |
| PopDex | DeFi | `verified` | [popdex-bridge.md](../../projects/popdex-bridge.md) |
| Predict.fun | DeFi | `verified` | [predict-fun.md](../../projects/predict-fun.md) |
| Prime Staking | DeFi | `verified` | [prime-staking.md](../../projects/prime-staking.md) |
| Project 0 | DeFi | `verified` | [project-0.md](../../projects/project-0.md) |
| Project X | DeFi | `needs_update` | [project-x.md](../../projects/project-x.md) |
| Prysm | Infrastructure | `verified` | [prysm.md](../../projects/prysm.md) |
| R25 | Real World Assets (RWA) | `verified` | [r25.md](../../projects/r25.md) |
| RAILGUN | Security | `verified` | [railgun.md](../../projects/railgun.md) |
| Rare Protocol | NFTs & Creator Economy | `verified` | [rare-protocol.md](../../projects/rare-protocol.md) |
| Ravencoin | Layer 1 / Layer 2 | `verified` | [ravencoin.md](../../projects/ravencoin.md) |
| Re | Real World Assets (RWA) | `verified` | [re.md](../../projects/re.md) |
| Reclaim Protocol | Identity | `verified` | [reclaim-protocol.md](../../projects/reclaim-protocol.md) |
| Reserve | DeFi | `verified` | [reserve-protocol.md](../../projects/reserve-protocol.md) |
| Resupply | DeFi | `verified` | [resupply.md](../../projects/resupply.md) |
| Reth | Infrastructure | `verified` | [reth.md](../../projects/reth.md) |
| Revert | Data & Analytics | `verified` | [revert-lend.md](../../projects/revert-lend.md) |
| RGB Protocol | Infrastructure | `verified` | [rgb-protocol.md](../../projects/rgb-protocol.md) |
| Rhino.fi | Infrastructure | `verified` | [rhino-fi.md](../../projects/rhino-fi.md) |
| rindexer | Developer Tools | `verified` | [rindexer.md](../../projects/rindexer.md) |
| RISE | Layer 1 / Layer 2 | `verified` | [rise-bridge.md](../../projects/rise-bridge.md) |
| RISEX | DeFi | `verified` | [risex.md](../../projects/risex.md) |
| Ritual | Infrastructure | `verified` | [ritual.md](../../projects/ritual.md) |
| RockawayX | Infrastructure | `verified` | [rockawayx.md](../../projects/rockawayx.md) |
| RockSolid | DeFi | `verified` | [rocksolid-network.md](../../projects/rocksolid-network.md) |
| Rosen Bridge | Infrastructure | `verified` | [rosen-bridge.md](../../projects/rosen-bridge.md) |
| Royco | DeFi | `verified` | [royco-v2.md](../../projects/royco-v2.md) |
| Rysk | DeFi | `verified` | [rysk-v12.md](../../projects/rysk-v12.md) |
| Saturn | DeFi | `verified` | [saturn.md](../../projects/saturn.md) |
| SaucerSwap | DeFi | `verified` | [saucerswap-v2.md](../../projects/saucerswap-v2.md) |
| Scarb | Developer Tools | `verified` | [scarb.md](../../projects/scarb.md) |
| Scribble | Security | `verified` | [scribble.md](../../projects/scribble.md) |
| Secureum | Security | `verified` | [secureum.md](../../projects/secureum.md) |
| Sedge | Developer Tools | `verified` | [sedge.md](../../projects/sedge.md) |
| Self | Identity | `verified` | [self-protocol.md](../../projects/self-protocol.md) |
| Semaphore | Identity | `verified` | [semaphore.md](../../projects/semaphore.md) |
| Sharky | NFTs & Creator Economy | `verified` | [sharky.md](../../projects/sharky.md) |
| SharpByte Capital | DeFi | `verified` | [sharpbyte-capital.md](../../projects/sharpbyte-capital.md) |
| shMonad | DeFi | `verified` | [shmonad.md](../../projects/shmonad.md) |
| Sierra Protocol | Real World Assets (RWA) | `verified` | [sierra-protocol.md](../../projects/sierra-protocol.md) |
| SKALE | Layer 1 / Layer 2 | `verified` | [skale.md](../../projects/skale.md) |
| Slither | Security | `verified` | [slither.md](../../projects/slither.md) |
| SnarkJS | Developer Tools | `verified` | [snarkjs.md](../../projects/snarkjs.md) |
| Snuggle | DeFi | `verified` | [snuggle.md](../../projects/snuggle.md) |
| SODAX Builders MCP | Developer Tools | `verified` | [sodax-builders-mcp.md](../../projects/sodax-builders-mcp.md) |
| Solady | Developer Tools | `verified` | [solady.md](../../projects/solady.md) |
| Solana Bankrun | Developer Tools | `rejected` | [solana-bankrun.md](../../projects/solana-bankrun.md) |
| Solana Beach | Data & Analytics | `verified` | [solana-beach.md](../../projects/solana-beach.md) |
| Solana Compass | Data & Analytics | `verified` | [solana-compass.md](../../projects/solana-compass.md) |
| Solana Kit | Developer Tools | `verified` | [solana-kit.md](../../projects/solana-kit.md) |
| Solana Playground | Developer Tools | `verified` | [solana-playground.md](../../projects/solana-playground.md) |
| SolanaFM | Data & Analytics | `needs_update` | [solanafm.md](../../projects/solanafm.md) |
| Solang | Developer Tools | `verified` | [solang.md](../../projects/solang.md) |
| Solhint | Developer Tools | `verified` | [solhint.md](../../projects/solhint.md) |
| Solidity Coverage | Developer Tools | `verified` | [solidity-coverage.md](../../projects/solidity-coverage.md) |
| Solidity | Developer Tools | `verified` | [solidity.md](../../projects/solidity.md) |
| Solodit | Security | `verified` | [solodit.md](../../projects/solodit.md) |
| Solomon Labs | DeFi | `verified` | [solomon-usdv.md](../../projects/solomon-usdv.md) |
| Solstice | DeFi | `verified` | [solstice.md](../../projects/solstice.md) |
| SOON | Layer 1 / Layer 2 | `verified` | [soon.md](../../projects/soon.md) |
| Sourcify | Developer Tools | `verified` | [sourcify.md](../../projects/sourcify.md) |
| Sozu | DeFi | `verified` | [sozu.md](../../projects/sozu.md) |
| SparkDEX | DeFi | `verified` | [sparkdex-v4.md](../../projects/sparkdex-v4.md) |
| Spectra | DeFi | `verified` | [spectra-v2.md](../../projects/spectra-v2.md) |
| Spectral Labs | Infrastructure | `needs_update` | [spectral-syntax.md](../../projects/spectral-syntax.md) |
| SpeedRunEthereum | Developer Tools | `verified` | [speedrunethereum.md](../../projects/speedrunethereum.md) |
| SpringSui | DeFi | `verified` | [springsui.md](../../projects/springsui.md) |
| SSV Network | DeFi | `verified` | [ssv-network.md](../../projects/ssv-network.md) |
| Stacking DAO | DeFi | `verified` | [stackingdao.md](../../projects/stackingdao.md) |
| sBTC | Infrastructure | `verified` | [stacks-sbtc.md](../../projects/stacks-sbtc.md) |
| Stader | DeFi | `verified` | [stader.md](../../projects/stader.md) |
| StaFi | DeFi | `verified` | [stafi.md](../../projects/stafi.md) |
| stake.link | DeFi | `verified` | [stake-link-liquid.md](../../projects/stake-link-liquid.md) |
| Stakecito | Infrastructure | `verified` | [stakecito.md](../../projects/stakecito.md) |
| StakePoint | Developer Tools | `verified` | [stakepoint.md](../../projects/stakepoint.md) |
| StakeStone | DeFi | `verified` | [stakestone-stone.md](../../projects/stakestone-stone.md) |
| Starknet Agentic | AI Agents | `verified` | [starknet-agentic.md](../../projects/starknet-agentic.md) |
| Starknet Foundry | Developer Tools | `verified` | [starknet-foundry.md](../../projects/starknet-foundry.md) |
| Starknet.py | Developer Tools | `verified` | [starknet-py.md](../../projects/starknet-py.md) |
| Starknet Rust | Developer Tools | `verified` | [starknet-rust.md](../../projects/starknet-rust.md) |
| Steakhouse Financial | DeFi | `verified` | [steakhouse-financial.md](../../projects/steakhouse-financial.md) |
| Stockrip | Gaming | `verified` | [stockrip.md](../../projects/stockrip.md) |
| STON.fi | DeFi | `verified` | [ston-fi.md](../../projects/ston-fi.md) |
| Storm Trade | DeFi | `verified` | [storm-trade.md](../../projects/storm-trade.md) |
| STRATO | Layer 1 / Layer 2 | `verified` | [strato-bridge.md](../../projects/strato-bridge.md) |
| Stratum V2 | Infrastructure | `verified` | [stratum-v2.md](../../projects/stratum-v2.md) |
| Streamflow | Payments | `verified` | [streamflow.md](../../projects/streamflow.md) |
| Stripe Machine Payments | Payments | `verified` | [stripe-machine-payments.md](../../projects/stripe-machine-payments.md) |
| Subxt | Developer Tools | `verified` | [subxt.md](../../projects/subxt.md) |
| sudoswap | NFTs & Creator Economy | `verified` | [sudoswap-v2.md](../../projects/sudoswap-v2.md) |
| SuiScan | Data & Analytics | `verified` | [suiscan.md](../../projects/suiscan.md) |
| SuiVision | Data & Analytics | `verified` | [suivision.md](../../projects/suivision.md) |
| SUN.io | DeFi | `verified` | [sunswap-v4.md](../../projects/sunswap-v4.md) |
| Surfpool | Developer Tools | `verified` | [surfpool.md](../../projects/surfpool.md) |
| Swan Chain | Infrastructure | `verified` | [swan-chain.md](../../projects/swan-chain.md) |
| SWIRL | DeFi | `verified` | [swirl.md](../../projects/swirl.md) |
| Symbiosis | Infrastructure | `verified` | [symbiosis.md](../../projects/symbiosis.md) |
| Syntetika | DeFi | `verified` | [syntetika.md](../../projects/syntetika.md) |
| T3tris | DeFi | `verified` | [t3tris-finance.md](../../projects/t3tris-finance.md) |
| TAC | Layer 1 / Layer 2 | `verified` | [tac-cross-chain-layer.md](../../projects/tac-cross-chain-layer.md) |
| Talisman | Wallets | `verified` | [talisman.md](../../projects/talisman.md) |
| Tangent Finance | DeFi | `verified` | [tangent-finance.md](../../projects/tangent-finance.md) |
| Tari | Layer 1 / Layer 2 | `verified` | [tari.md](../../projects/tari.md) |
| Threshold Network | Infrastructure | `verified` | [tbtc.md](../../projects/tbtc.md) |
| Team Finance | Developer Tools | `verified` | [team-finance.md](../../projects/team-finance.md) |
| Tectonic | DeFi | `verified` | [tectonic.md](../../projects/tectonic.md) |
| Teku | Infrastructure | `verified` | [teku.md](../../projects/teku.md) |
| Templar Protocol | DeFi | `verified` | [templar-protocol.md](../../projects/templar-protocol.md) |
| Temple Digital Group | Real World Assets (RWA) | `verified` | [temple.md](../../projects/temple.md) |
| Tempo | Layer 1 / Layer 2 | `verified` | [tempo-stablecoin-dex.md](../../projects/tempo-stablecoin-dex.md) |
| Tevm | Developer Tools | `verified` | [tevm.md](../../projects/tevm.md) |
| The Interfold | Security | `verified` | [the-interfold.md](../../projects/the-interfold.md) |
| Theoriq | Real World Assets (RWA) | `verified` | [theoriq.md](../../projects/theoriq.md) |
| Theta Network | Infrastructure | `verified` | [theta-network.md](../../projects/theta-network.md) |
| Tinyman | DeFi | `verified` | [tinyman.md](../../projects/tinyman.md) |
| Titanoboa | Developer Tools | `verified` | [titanoboa.md](../../projects/titanoboa.md) |
| TLSNotary | Identity | `verified` | [tlsnotary.md](../../projects/tlsnotary.md) |
| Tolk | Developer Tools | `verified` | [tolk.md](../../projects/tolk.md) |
| TON API | Developer Tools | `verified` | [ton-api.md](../../projects/ton-api.md) |
| TON Center | Infrastructure | `verified` | [ton-center.md](../../projects/ton-center.md) |
| TonConnect | Developer Tools | `verified` | [tonconnect.md](../../projects/tonconnect.md) |
| Tonhub | Wallets | `verified` | [tonhub.md](../../projects/tonhub.md) |
| Tonscan | Data & Analytics | `verified` | [tonscan.md](../../projects/tonscan.md) |
| Tonstakers | DeFi | `verified` | [tonstakers-lsd.md](../../projects/tonstakers-lsd.md) |
| Tonviewer | Data & Analytics | `verified` | [tonviewer.md](../../projects/tonviewer.md) |
| Tori Finance | DeFi | `verified` | [tori-finance.md](../../projects/tori-finance.md) |
| Tothemoon | Payments | `verified` | [tothemoon.md](../../projects/tothemoon.md) |
| Travessia Credit | Real World Assets (RWA) | `verified` | [travessia-credit.md](../../projects/travessia-credit.md) |
| Treehouse | DeFi | `verified` | [treehouse-protocol.md](../../projects/treehouse-protocol.md) |
| Trident | Security | `verified` | [trident.md](../../projects/trident.md) |
| Troves | DeFi | `verified` | [troves.md](../../projects/troves.md) |
| TxFlow | Layer 1 / Layer 2 | `verified` | [txflow-bridge.md](../../projects/txflow-bridge.md) |
| Tydro | DeFi | `verified` | [tydro.md](../../projects/tydro.md) |
| Unichain | Layer 1 / Layer 2 | `verified` | [unichain-bridge.md](../../projects/unichain-bridge.md) |
| Unified Labs | DeFi | `verified` | [unified-labs.md](../../projects/unified-labs.md) |
| Unit | Infrastructure | `verified` | [unit.md](../../projects/unit.md) |
| Upshift | DeFi | `verified` | [upshift.md](../../projects/upshift.md) |
| USD.AI | Real World Assets (RWA) | `verified` | [usd-ai.md](../../projects/usd-ai.md) |
| USDT0 | Infrastructure | `verified` | [usdt0.md](../../projects/usdt0.md) |
| ZIG Finance | DeFi | `verified` | [valdora-finance.md](../../projects/valdora-finance.md) |
| Vault Street | Real World Assets (RWA) | `verified` | [vault-street.md](../../projects/vault-street.md) |
| Veda | DeFi | `verified` | [veda.md](../../projects/veda.md) |
| Vena Finance | DeFi | `verified` | [vena-finance.md](../../projects/vena-finance.md) |
| Veno Finance | DeFi | `verified` | [veno-finance.md](../../projects/veno-finance.md) |
| Veranta | DeFi | `verified` | [veranta.md](../../projects/veranta.md) |
| Verified Network | Real World Assets (RWA) | `verified` | [verified-network.md](../../projects/verified-network.md) |
| Verus | Layer 1 / Layer 2 | `verified` | [verus.md](../../projects/verus.md) |
| Vesper Finance | DeFi | `verified` | [vesper.md](../../projects/vesper.md) |
| vfat | DeFi | `verified` | [vfat-io.md](../../projects/vfat-io.md) |
| Virtuals Protocol | AI Agents | `verified` | [virtuals-protocol.md](../../projects/virtuals-protocol.md) |
| Vocdoni | DAOs & Governance | `verified` | [vocdoni.md](../../projects/vocdoni.md) |
| Volo | DeFi | `verified` | [volo-vault.md](../../projects/volo-vault.md) |
| Vultisig | Wallets | `verified` | [vultisig.md](../../projects/vultisig.md) |
| VVS Finance | DeFi | `verified` | [vvs-standard.md](../../projects/vvs-standard.md) |
| Vyper | Developer Tools | `verified` | [vyper.md](../../projects/vyper.md) |
| Wake | Security | `verified` | [wake.md](../../projects/wake.md) |
| Walrus | Infrastructure | `verified` | [walrus.md](../../projects/walrus.md) |
| Warden Protocol | AI Agents | `verified` | [warden-protocol.md](../../projects/warden-protocol.md) |
| Waterline | DeFi | `verified` | [waterline.md](../../projects/waterline.md) |
| WBTC | Infrastructure | `verified` | [wbtc.md](../../projects/wbtc.md) |
| web3.py | Developer Tools | `verified` | [web3-py.md](../../projects/web3-py.md) |
| web3j | Developer Tools | `verified` | [web3j.md](../../projects/web3j.md) |
| Webot | Developer Tools | `verified` | [webot.md](../../projects/webot.md) |
| WEEX | Payments | `verified` | [weex.md](../../projects/weex.md) |
| Wildcat Protocol | DeFi | `verified` | [wildcat-protocol.md](../../projects/wildcat-protocol.md) |
| Winterfell | Developer Tools | `verified` | [winterfell.md](../../projects/winterfell.md) |
| Folks Finance | DeFi | `verified` | [xalgo-liquid-staking.md](../../projects/xalgo-liquid-staking.md) |
| xExchange | DeFi | `verified` | [xexchange.md](../../projects/xexchange.md) |
| XRP Ledger | Layer 1 / Layer 2 | `verified` | [xrpl-dex.md](../../projects/xrpl-dex.md) |
| YieldPoint | DeFi | `verified` | [xsy.md](../../projects/xsy.md) |
| Yei Finance | DeFi | `verified` | [yeilend.md](../../projects/yeilend.md) |
| Yellowstone gRPC | Developer Tools | `verified` | [yellowstone-grpc.md](../../projects/yellowstone-grpc.md) |
| Yield Basis | DeFi | `verified` | [yield-basis.md](../../projects/yield-basis.md) |
| Yield Yak | DeFi | `verified` | [yield-yak-aggregator.md](../../projects/yield-yak-aggregator.md) |
| YieldFi | DeFi | `verified` | [yieldfi.md](../../projects/yieldfi.md) |
| YieldNest | DeFi | `verified` | [yieldnest.md](../../projects/yieldnest.md) |
| youves | DeFi | `needs_update` | [youves.md](../../projects/youves.md) |
| Zama | Security | `verified` | [zama.md](../../projects/zama.md) |
| ZEROBASE | Infrastructure | `verified` | [zerobase-cedefi.md](../../projects/zerobase-cedefi.md) |
| Zharta | DeFi | `verified` | [zharta-finance.md](../../projects/zharta-finance.md) |
| Ziren | Developer Tools | `verified` | [ziren.md](../../projects/ziren.md) |
| ZK Email | Identity | `verified` | [zk-email.md](../../projects/zk-email.md) |
| zkBob | Security | `rejected` | [zkbob.md](../../projects/zkbob.md) |
| zkPass | Identity | `verified` | [zkpass.md](../../projects/zkpass.md) |
| Zombienet | Developer Tools | `verified` | [zombienet.md](../../projects/zombienet.md) |
| Zupass | Identity | `verified` | [zupass.md](../../projects/zupass.md) |
| Zyfai | AI Agents | `verified` | [zyfai.md](../../projects/zyfai.md) |
