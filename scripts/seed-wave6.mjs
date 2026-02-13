import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const projectsDir = path.join(root, 'content', 'projects');

function slugify(input = '') {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function list(values) {
  return `[${values.join(', ')}]`;
}

function toMd(p) {
  return `---
name: ${p.name}
lead_category: ${p.lead_category}
tags: ${list(p.tags)}
ecosystem: ${list(p.ecosystem)}
description: ${p.description}
primary_url: ${p.primary_url}
product_url: ${p.product_url}
founded: ${p.founded}
hq: ${p.hq}
token: ${p.token}
twitter: ${p.twitter}
verification_status: pending_audit
---
`;
}

const rows = [
  ['Bluefin', 'DeFi', ['DeFi', 'Derivatives'], ['Sui'], 'Derivatives-focused decentralized trading platform on Sui.', 'https://bluefin.io', 'https://trade.bluefin.io', 2023, 'Metaverse', 'BLUE', 'https://x.com/bluefinapp'],
  ['Jambo', 'DeFi', ['DeFi', 'Consumer'], ['Solana', 'Ethereum'], 'Consumer-focused web3 app ecosystem with integrated trading and rewards.', 'https://jambo.technology', 'https://jambo.technology/products', 2022, 'United States', 'J', 'https://x.com/JamboTechnology'],
  ['Silo Finance', 'DeFi', ['DeFi', 'Lending'], ['Ethereum', 'Arbitrum'], 'Isolated risk lending markets protocol for DeFi assets.', 'https://www.silo.finance', 'https://app.silo.finance', 2022, 'Metaverse', 'SILO', 'https://x.com/SiloFinance'],
  ['Vela Exchange', 'DeFi', ['DeFi', 'Derivatives'], ['Arbitrum'], 'Perpetuals trading protocol with orderbook-like execution.', 'https://vela.exchange', 'https://app.vela.exchange', 2023, 'Metaverse', 'VELA', 'https://x.com/VelaExchange'],
  ['LogX', 'DeFi', ['DeFi', 'Derivatives'], ['Base', 'Mode'], 'Perpetual trading protocol optimized for rollup ecosystems.', 'https://www.logx.trade', 'https://www.logx.trade/trade', 2024, 'Metaverse', 'n/a', 'https://x.com/LogX_trade'],
  ['Rage Trade', 'DeFi', ['DeFi', 'Derivatives'], ['Arbitrum'], 'Decentralized derivatives and vault protocol.', 'https://www.rage.trade', 'https://app.rage.trade', 2022, 'Metaverse', 'RAGE', 'https://x.com/rage_trade'],
  ['Resolv', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum'], 'Collateralized stable asset protocol with risk-segmented tranches.', 'https://resolv.xyz', 'https://app.resolv.xyz', 2024, 'Metaverse', 'n/a', 'https://x.com/resolvxyz'],
  ['Aperture Finance', 'DeFi', ['DeFi', 'Automation'], ['Ethereum', 'Arbitrum'], 'Strategy automation and execution tooling for DeFi users.', 'https://www.aperture.finance', 'https://www.aperture.finance/app', 2022, 'United States', 'n/a', 'https://x.com/ApertureFinance'],
  ['Swell', 'DeFi', ['DeFi', 'Staking'], ['Ethereum'], 'Liquid staking and restaking protocol ecosystem.', 'https://www.swellnetwork.io', 'https://app.swellnetwork.io', 2023, 'Metaverse', 'SWELL', 'https://x.com/swellnetworkio'],
  ['Kelp DAO', 'DeFi', ['DeFi', 'Restaking'], ['Ethereum'], 'Liquid restaking protocol and asset strategy platform.', 'https://kelpdao.xyz', 'https://kelpdao.xyz/app', 2024, 'Metaverse', 'KELP', 'https://x.com/KelpDAO'],
  ['Puffer Finance', 'DeFi', ['DeFi', 'Staking'], ['Ethereum'], 'Restaking-native staking protocol and infrastructure stack.', 'https://www.puffer.fi', 'https://app.puffer.fi', 2023, 'Metaverse', 'PUFFER', 'https://x.com/puffer_finance'],
  ['StakeWise', 'DeFi', ['DeFi', 'Staking'], ['Ethereum'], 'Ethereum liquid staking protocol and vault ecosystem.', 'https://stakewise.io', 'https://app.stakewise.io', 2020, 'Estonia', 'SWISE', 'https://x.com/stakewise_io'],
  ['Aurigami', 'DeFi', ['DeFi', 'Lending'], ['Aurora'], 'Lending and borrowing protocol on Aurora/NEAR ecosystem.', 'https://www.aurigami.finance', 'https://app.aurigami.finance', 2022, 'Metaverse', 'PLY', 'https://x.com/aurigami_PLY'],
  ['NAVI Protocol', 'DeFi', ['DeFi', 'Lending'], ['Sui'], 'Sui-native lending and liquidity protocol.', 'https://www.naviprotocol.io', 'https://app.naviprotocol.io', 2023, 'Metaverse', 'NAVX', 'https://x.com/navi_protocol'],
  ['Aftermath Finance', 'DeFi', ['DeFi', 'DEX'], ['Sui'], 'DEX and liquidity infrastructure suite for Sui users.', 'https://aftermath.finance', 'https://aftermath.finance/trade', 2023, 'Metaverse', 'AFT', 'https://x.com/aftermathfi'],

  ['Gravity', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Gravity'], 'Cross-ecosystem blockchain focused on large-scale consumer applications.', 'https://gravity.xyz', 'https://gravity.xyz/ecosystem', 2024, 'Metaverse', 'G', 'https://x.com/GravityChain'],
  ['Morph', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Morph', 'Ethereum'], 'Ethereum rollup ecosystem optimized for consumer applications.', 'https://www.morphl2.io', 'https://www.morphl2.io/ecosystem', 2024, 'Singapore', 'n/a', 'https://x.com/MorphL2'],
  ['Kinto', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Identity'], ['Kinto', 'Ethereum'], 'Compliance-aware L2 focused on onchain financial applications.', 'https://www.kinto.xyz', 'https://www.kinto.xyz/build', 2024, 'Metaverse', 'K', 'https://x.com/KintoXYZ'],
  ['World Chain', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Optimism', 'Ethereum'], 'L2 ecosystem built for human-centric identity and applications.', 'https://world.org/world-chain', 'https://world.org/world-chain', 2024, 'Metaverse', 'WLD', 'https://x.com/worldcoin'],
  ['Ancient8', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Gaming'], ['Ancient8'], 'Gaming-centric L2 and community ecosystem.', 'https://ancient8.gg', 'https://ancient8.gg/ecosystem', 2023, 'Vietnam', 'A8', 'https://x.com/Ancient8_gg'],
  ['Myria', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Gaming'], ['Myria'], 'Gaming and NFT-focused scaling ecosystem.', 'https://myria.com', 'https://myria.com/ecosystem', 2022, 'Australia', 'MYRIA', 'https://x.com/Myria'],
  ['Sonic Labs', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Sonic'], 'Core ecosystem team for Sonic network development.', 'https://www.soniclabs.com', 'https://www.soniclabs.com/ecosystem', 2024, 'United States', 'S', 'https://x.com/SonicLabs'],
  ['zkCandy', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Gaming'], ['zkSync'], 'Game-focused ZK rollup ecosystem and tooling.', 'https://zkcandy.io', 'https://zkcandy.io/developers', 2024, 'Metaverse', 'n/a', 'https://x.com/zkcandyhq'],
  ['Camp Network', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Identity'], ['Camp'], 'Identity-first blockchain ecosystem for communities and apps.', 'https://campnetwork.xyz', 'https://campnetwork.xyz/docs', 2024, 'Metaverse', 'n/a', 'https://x.com/campnetworkxyz'],
  ['Initia', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Initia'], 'Interwoven L1 and appchain ecosystem with modular architecture.', 'https://initia.xyz', 'https://initia.xyz/ecosystem', 2024, 'United States', 'INIT', 'https://x.com/initia'],

  ['QuickSwap', 'Infrastructure', ['Infrastructure', 'DeFi'], ['Polygon'], 'DEX and liquidity infrastructure hub in Polygon ecosystem.', 'https://quickswap.exchange', 'https://quickswap.exchange/#/swap', 2021, 'Metaverse', 'QUICK', 'https://x.com/QuickswapDEX'],
  ['Mellow Protocol', 'Infrastructure', ['Infrastructure', 'Restaking'], ['Ethereum'], 'Modular restaking and vault infrastructure layer.', 'https://mellow.finance', 'https://mellow.finance/products', 2024, 'Metaverse', 'n/a', 'https://x.com/mellowprotocol'],
  ['HyperSDK', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Avalanche'], 'Framework and ecosystem for custom high-performance chains.', 'https://www.avax.network/hypersdk', 'https://docs.avax.network', 2024, 'United States', 'n/a', 'https://x.com/avax'],
  ['DIA', 'Infrastructure', ['Infrastructure', 'Oracles'], ['Ethereum', 'Multiple'], 'Open-source oracle and data provider for web3 applications.', 'https://www.diadata.org', 'https://www.diadata.org/products', 2018, 'Switzerland', 'DIA', 'https://x.com/DIADATA_org'],
  ['Seda', 'Infrastructure', ['Infrastructure', 'Oracles'], ['Cosmos', 'Ethereum'], 'Programmable oracle and data query network.', 'https://www.seda.xyz', 'https://www.seda.xyz/docs', 2023, 'Metaverse', 'SEDA', 'https://x.com/sedanetwork'],
  ['Automata', 'Infrastructure', ['Infrastructure', 'Privacy'], ['Ethereum'], 'Privacy middleware and confidential computing infrastructure.', 'https://www.ata.network', 'https://www.ata.network/products', 2019, 'Singapore', 'ATA', 'https://x.com/AutomataNetwork'],
  ['Litentry', 'Infrastructure', ['Infrastructure', 'Identity'], ['Polkadot', 'Ethereum'], 'Identity aggregation and credential infrastructure protocol.', 'https://www.litentry.com', 'https://www.litentry.com/products', 2020, 'Germany', 'LIT', 'https://x.com/litentry'],
  ['Sequence Builder', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Multiple'], 'Infrastructure stack for chain and game backend operations.', 'https://sequence.xyz', 'https://sequence.xyz/build', 2023, 'Canada', 'n/a', 'https://x.com/0xsequence'],
  ['Celestia Data Hub', 'Infrastructure', ['Infrastructure', 'Data Availability'], ['Celestia'], 'Data availability tooling and infrastructure around Celestia ecosystem.', 'https://celestia.org', 'https://docs.celestia.org', 2024, 'Switzerland', 'TIA', 'https://x.com/CelestiaOrg'],
  ['BlockPI', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'BNB Chain', 'Multiple'], 'Decentralized RPC and API marketplace for developers.', 'https://blockpi.io', 'https://blockpi.io/products', 2022, 'Singapore', 'n/a', 'https://x.com/RealBlockPI'],
  ['Allnodes', 'Infrastructure', ['Infrastructure', 'Staking'], ['Ethereum', 'Cosmos', 'Multiple'], 'Node hosting and validator services platform.', 'https://www.allnodes.com', 'https://www.allnodes.com/hosting', 2019, 'United States', 'n/a', 'https://x.com/Allnodes'],
  ['Chorus One', 'Infrastructure', ['Infrastructure', 'Staking'], ['Ethereum', 'Cosmos', 'Solana'], 'Institutional staking and validator operations company.', 'https://chorus.one', 'https://chorus.one/products', 2018, 'Switzerland', 'n/a', 'https://x.com/ChorusOne'],
  ['Kiln', 'Infrastructure', ['Infrastructure', 'Staking'], ['Ethereum', 'Solana', 'Multiple'], 'Enterprise staking and reward infrastructure API platform.', 'https://www.kiln.fi', 'https://www.kiln.fi/products', 2018, 'France', 'n/a', 'https://x.com/Kiln_finance'],
  ['Stakin', 'Infrastructure', ['Infrastructure', 'Staking'], ['Ethereum', 'Cosmos', 'Multiple'], 'Validator and staking infrastructure provider.', 'https://stakin.com', 'https://stakin.com/services', 2018, 'France', 'n/a', 'https://x.com/stakingfac'],
  ['Ankr AppChain', 'Infrastructure', ['Infrastructure', 'Layer 1 / Layer 2'], ['Ethereum', 'BNB Chain'], 'Appchain and rollup tooling by Ankr.', 'https://www.ankr.com/appchains', 'https://www.ankr.com/appchains', 2023, 'United States', 'ANKR', 'https://x.com/ankr'],

  ['ApeX Pro', 'Data & Analytics', ['Data & Analytics', 'Derivatives'], ['Arbitrum'], 'Data-rich derivatives trading platform with onchain settlement.', 'https://pro.apex.exchange', 'https://pro.apex.exchange/trade', 2022, 'Metaverse', 'APEX', 'https://x.com/OfficialApeXdex'],
  ['DefiLlama Yields', 'Data & Analytics', ['Data & Analytics', 'DeFi'], ['Ethereum', 'Multiple'], 'Yield and protocol analytics module within DefiLlama.', 'https://defillama.com/yields', 'https://defillama.com/yields', 2022, 'Metaverse', 'n/a', 'https://x.com/DefiLlama'],
  ['Nansen Portfolio', 'Data & Analytics', ['Data & Analytics', 'Wallets'], ['Ethereum', 'Solana', 'Multiple'], 'Portfolio and wallet intelligence product from Nansen.', 'https://www.nansen.ai', 'https://www.nansen.ai/portfolio', 2023, 'Singapore', 'n/a', 'https://x.com/nansen_ai'],
  ['Flipside API', 'Data & Analytics', ['Data & Analytics', 'Developer Tools'], ['Ethereum', 'Solana', 'Multiple'], 'Data APIs and query tooling for blockchain analytics.', 'https://flipsidecrypto.xyz', 'https://docs.flipsidecrypto.xyz', 2023, 'United States', 'n/a', 'https://x.com/flipsidecrypto'],
  ['CryptoFees', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Protocol revenue and fees tracking dashboard.', 'https://cryptofees.info', 'https://cryptofees.info', 2021, 'Metaverse', 'n/a', 'https://x.com/CryptoFeesInfo'],
  ['DappLooker', 'Data & Analytics', ['Data & Analytics', 'Developer Tools'], ['Ethereum', 'Multiple'], 'Dashboard and analytics tooling for dapp operators.', 'https://dapplooker.com', 'https://dapplooker.com/dashboard', 2022, 'India', 'n/a', 'https://x.com/dapplooker'],
  ['Messari Signals', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Signals and intelligence feed for market participants.', 'https://messari.io', 'https://messari.io/signals', 2024, 'United States', 'n/a', 'https://x.com/MessariCrypto'],
  ['CryptoMiso', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Open-source development activity analytics for crypto projects.', 'https://www.cryptomiso.com', 'https://www.cryptomiso.com/dashboard', 2018, 'Japan', 'n/a', 'https://x.com/cryptomiso'],

  ['BugRap', 'Security', ['Security', 'Bug Bounty'], ['Ethereum', 'Multiple'], 'Security contest and bounty aggregation platform for web3.', 'https://bugrap.io', 'https://bugrap.io/contests', 2023, 'Metaverse', 'n/a', 'https://x.com/bugrap_io'],
  ['QuillAudits', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Smart contract audit and security assessment provider.', 'https://quillaudits.com', 'https://quillaudits.com/services', 2021, 'India', 'n/a', 'https://x.com/QuillAudits'],
  ['Sec3', 'Security', ['Security', 'Auditing'], ['Solana', 'Sui'], 'Security audits and tooling focused on Move and Solana ecosystems.', 'https://www.sec3.dev', 'https://www.sec3.dev/services', 2022, 'United States', 'n/a', 'https://x.com/sec3dev'],
  ['Trailblaze Security', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Multiple'], 'Runtime security monitoring and incident response tooling.', 'https://trailblaze.security', 'https://trailblaze.security/platform', 2024, 'United States', 'n/a', 'https://x.com/trailblaze_sec'],
  ['Skynet Security', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'BSC', 'Multiple'], 'Automated threat monitoring platform for protocols and wallets.', 'https://skynet.security', 'https://skynet.security/products', 2023, 'Metaverse', 'n/a', 'https://x.com/skynet_security'],
  ['Fuzzland', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Smart contract fuzzing and security services provider.', 'https://fuzz.land', 'https://fuzz.land/services', 2022, 'Singapore', 'n/a', 'https://x.com/fuzzland'],
  ['Spearbit Cantina', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Security contest and review platform operated by Spearbit.', 'https://cantina.xyz', 'https://cantina.xyz/contests', 2023, 'United States', 'n/a', 'https://x.com/cantinaxyz'],
  ['Redefine Security', 'Security', ['Security', 'Auditing'], ['Ethereum'], 'Specialized security reviews for DeFi protocols.', 'https://redefine.security', 'https://redefine.security/services', 2024, 'Metaverse', 'n/a', 'https://x.com/redefine_sec'],

  ['Glow Wallet', 'Wallets', ['Wallets'], ['Solana'], 'Consumer wallet focused on Solana user experience.', 'https://glow.app', 'https://glow.app/download', 2021, 'United States', 'n/a', 'https://x.com/glowwallet'],
  ['Backpack Wallet', 'Wallets', ['Wallets'], ['Solana', 'Ethereum'], 'Self-custody wallet product in Backpack ecosystem.', 'https://backpack.app', 'https://backpack.app/download', 2022, 'United Arab Emirates', 'n/a', 'https://x.com/Backpack'],
  ['Core Wallet', 'Wallets', ['Wallets'], ['Avalanche', 'Bitcoin', 'Ethereum'], 'Wallet and bridge products from Avalanche ecosystem.', 'https://core.app', 'https://core.app/download', 2022, 'United States', 'n/a', 'https://x.com/coreapp'],
  ['Brave Wallet', 'Wallets', ['Wallets'], ['Ethereum', 'Solana', 'Multiple'], 'Built-in browser wallet for self-custody and dapp usage.', 'https://brave.com/wallet', 'https://brave.com/wallet', 2021, 'United States', 'n/a', 'https://x.com/brave'],
  ['SubWallet', 'Wallets', ['Wallets'], ['Polkadot'], 'Wallet suite for Polkadot and Substrate ecosystems.', 'https://subwallet.app', 'https://subwallet.app/download', 2022, 'Singapore', 'n/a', 'https://x.com/subwalletapp'],
  ['Pontem Wallet', 'Wallets', ['Wallets'], ['Aptos'], 'Wallet and developer tooling for Aptos ecosystem.', 'https://pontem.network', 'https://pontem.network/wallet', 2022, 'Metaverse', 'n/a', 'https://x.com/PontemNetwork'],
  ['Surf Wallet', 'Wallets', ['Wallets'], ['Sui'], 'Wallet interface focused on Sui ecosystem users.', 'https://surf.tech', 'https://surf.tech/wallet', 2023, 'Metaverse', 'n/a', 'https://x.com/surfwallet'],

  ['Wirex', 'Payments', ['Payments', 'Cards'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Crypto payments and card platform for retail users.', 'https://wirexapp.com', 'https://wirexapp.com/products', 2014, 'United Kingdom', 'WXT', 'https://x.com/wirexapp'],
  ['Nexo Card', 'Payments', ['Payments', 'Cards'], ['Bitcoin', 'Ethereum'], 'Card and payment products integrated with Nexo accounts.', 'https://nexo.com/card', 'https://nexo.com/card', 2022, 'Switzerland', 'NEXO', 'https://x.com/Nexo'],
  ['BitPay Card', 'Payments', ['Payments', 'Cards'], ['Bitcoin', 'Ethereum'], 'Prepaid card and payments layer for BitPay users.', 'https://bitpay.com/card', 'https://bitpay.com/card', 2020, 'United States', 'n/a', 'https://x.com/BitPay'],
  ['Alchemy Commerce', 'Payments', ['Payments', 'Infrastructure'], ['Ethereum', 'Multiple'], 'Merchant commerce stack and stablecoin settlement products.', 'https://alchemypay.org', 'https://alchemypay.org', 2024, 'Singapore', 'ACH', 'https://x.com/AlchemyPay'],
  ['TripleA', 'Payments', ['Payments', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Crypto payment gateway for global merchants.', 'https://triple-a.io', 'https://triple-a.io/merchants', 2017, 'Singapore', 'n/a', 'https://x.com/tripleA_io'],
  ['CoinGate', 'Payments', ['Payments', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Merchant payment processing and invoicing platform.', 'https://coingate.com', 'https://coingate.com/for-merchants', 2014, 'Lithuania', 'n/a', 'https://x.com/CoinGatecom'],
  ['NOWPayments', 'Payments', ['Payments', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Crypto payment gateway with broad token support.', 'https://nowpayments.io', 'https://nowpayments.io/merchant-tools', 2019, 'Netherlands', 'n/a', 'https://x.com/NOWPayments_io'],
  ['Utorg', 'Payments', ['Payments', 'Infrastructure'], ['Ethereum', 'Multiple'], 'Fiat on-ramp and web3 payment integration provider.', 'https://utorg.pro', 'https://utorg.pro/business', 2021, 'United Kingdom', 'n/a', 'https://x.com/utorgapp'],

  ['Qredo Custody', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional custody and treasury operations products.', 'https://www.qredo.com', 'https://www.qredo.com/custody', 2018, 'United Kingdom', 'QRDO', 'https://x.com/QredoNetwork'],
  ['Liminal', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Enterprise-grade wallet operations and custody platform.', 'https://www.liminalcustody.com', 'https://www.liminalcustody.com/platform', 2021, 'Singapore', 'n/a', 'https://x.com/LiminalCustody'],
  ['Cypherock', 'Custody', ['Custody', 'Security'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Hardware-based key custody and inheritance solution.', 'https://www.cypherock.com', 'https://www.cypherock.com/products', 2022, 'India', 'n/a', 'https://x.com/CypherockWallet'],
  ['SwissBorg Vault', 'Custody', ['Custody', 'Payments'], ['Bitcoin', 'Ethereum'], 'Custody and asset management features within SwissBorg ecosystem.', 'https://swissborg.com', 'https://swissborg.com/app', 2017, 'Switzerland', 'BORG', 'https://x.com/swissborg'],

  ['Polygon AggLayer', 'Identity', ['Identity', 'Infrastructure'], ['Ethereum', 'Polygon'], 'Cross-chain identity and liquidity coordination layer in Polygon ecosystem.', 'https://polygon.technology/agglayer', 'https://polygon.technology/agglayer', 2024, 'India', 'POL', 'https://x.com/0xPolygon'],
  ['Masa', 'Identity', ['Identity', 'Data'], ['Ethereum', 'BNB Chain'], 'Decentralized identity and personal data network.', 'https://www.masa.finance', 'https://www.masa.finance/products', 2022, 'United States', 'MASA', 'https://x.com/getmasafi'],
  ['Kilt Protocol', 'Identity', ['Identity'], ['Polkadot'], 'Decentralized identity protocol for verifiable credentials.', 'https://www.kilt.io', 'https://www.kilt.io/ecosystem', 2018, 'Germany', 'KILT', 'https://x.com/Kiltprotocol'],

  ['OpenLaw', 'DAOs & Governance', ['DAOs & Governance', 'Developer Tools'], ['Ethereum'], 'Legal and DAO tooling for contract automation.', 'https://openlaw.io', 'https://openlaw.io/products', 2017, 'United States', 'n/a', 'https://x.com/openlawofficial'],
  ['Govrn', 'DAOs & Governance', ['DAOs & Governance'], ['Ethereum', 'Multiple'], 'Contribution and reputation tooling for onchain communities.', 'https://www.govrn.xyz', 'https://www.govrn.xyz/platform', 2021, 'United States', 'n/a', 'https://x.com/govrnHQ'],
  ['Superfluid Governance', 'DAOs & Governance', ['DAOs & Governance', 'Developer Tools'], ['Ethereum', 'Polygon', 'Optimism'], 'Governance and token streaming tools for DAOs.', 'https://www.superfluid.finance', 'https://www.superfluid.finance/dao', 2021, 'Switzerland', 'SUPER', 'https://x.com/Superfluid_HQ'],

  ['Magic Eden Creator Hub', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Solana', 'Ethereum', 'Bitcoin'], 'Creator tooling and launch products within Magic Eden ecosystem.', 'https://magiceden.io/launchpad', 'https://magiceden.io/launchpad', 2023, 'United States', 'n/a', 'https://x.com/MagicEden'],
  ['Objkt', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Marketplace'], ['Tezos'], 'NFT marketplace and creator ecosystem for Tezos assets.', 'https://objkt.com', 'https://objkt.com/marketplace', 2021, 'Metaverse', 'n/a', 'https://x.com/objktcom'],
  ['MagicSquare', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Discovery'], ['Ethereum', 'BNB Chain'], 'Web3 app and game discovery platform with creator integrations.', 'https://magicsquare.io', 'https://magicsquare.io/appstore', 2021, 'United Arab Emirates', 'SQR', 'https://x.com/MagicSquareio'],

  ['Nyan Heroes', 'Gaming', ['Gaming'], ['Solana'], 'Hero shooter gaming ecosystem with onchain assets.', 'https://nyanheroes.com', 'https://nyanheroes.com/game', 2021, 'United States', 'NYAN', 'https://x.com/nyanheroes'],
  ['Big Time', 'Gaming', ['Gaming'], ['Ethereum'], 'Action RPG ecosystem with web3 item ownership.', 'https://bigtime.gg', 'https://bigtime.gg/play', 2022, 'United States', 'BIGTIME', 'https://x.com/playbigtime'],
  ['Shrapnel', 'Gaming', ['Gaming'], ['Avalanche'], 'AAA shooter game ecosystem using blockchain assets.', 'https://www.shrapnel.com', 'https://www.shrapnel.com/play', 2023, 'United States', 'SHRAP', 'https://x.com/playSHRAPNEL']
];

async function main() {
  await fs.mkdir(projectsDir, { recursive: true });
  let created = 0;
  let skipped = 0;
  for (const row of rows) {
    const [name, lead_category, tags, ecosystem, description, primary_url, product_url, founded, hq, token, twitter] = row;
    const slug = slugify(name);
    const outPath = path.join(projectsDir, `${slug}.md`);
    try {
      await fs.access(outPath);
      skipped += 1;
      console.log(`SKIP (exists): ${slug}.md`);
      continue;
    } catch {
      // create
    }
    await fs.writeFile(outPath, toMd({ name, lead_category, tags, ecosystem, description, primary_url, product_url, founded, hq, token, twitter }), 'utf8');
    created += 1;
    console.log(`CREATE: ${slug}.md`);
  }
  console.log(`Done. created=${created} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

