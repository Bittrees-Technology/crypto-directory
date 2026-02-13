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
  ['Euler', 'DeFi', ['DeFi', 'Lending'], ['Ethereum'], 'DeFi lending protocol focused on permissionless risk-managed markets.', 'https://www.euler.finance', 'https://app.euler.finance', 2021, 'United Kingdom', 'EUL', 'https://x.com/eulerfinance'],
  ['Gearbox', 'DeFi', ['DeFi', 'Lending'], ['Ethereum', 'Arbitrum'], 'Composable leverage protocol for DeFi markets.', 'https://gearbox.fi', 'https://app.gearbox.fi', 2021, 'Metaverse', 'GEAR', 'https://x.com/GearboxProtocol'],
  ['Exactly Protocol', 'DeFi', ['DeFi', 'Lending'], ['Optimism'], 'Open-source fixed and variable rate lending protocol.', 'https://exact.ly', 'https://app.exact.ly', 2022, 'Argentina', 'EXA', 'https://x.com/exactlyprotocol'],
  ['Spark', 'DeFi', ['DeFi', 'Lending'], ['Ethereum'], 'Lending protocol ecosystem related to the Sky/Maker stack.', 'https://spark.fi', 'https://app.spark.fi', 2023, 'Metaverse', 'n/a', 'https://x.com/sparkdotfi'],
  ['Ethena', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum'], 'Synthetic dollar and yield protocol built on crypto-native collateral.', 'https://www.ethena.fi', 'https://app.ethena.fi', 2023, 'Metaverse', 'ENA', 'https://x.com/ethena_labs'],
  ['Usual', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum'], 'Stablecoin and treasury protocol focused on redistributing value to users.', 'https://usual.money', 'https://app.usual.money', 2024, 'Metaverse', 'USUAL', 'https://x.com/usualmoney'],
  ['Alchemix', 'DeFi', ['DeFi', 'Lending'], ['Ethereum'], 'Self-repaying DeFi loan protocol using future yield.', 'https://alchemix.fi', 'https://app.alchemix.fi', 2021, 'Metaverse', 'ALCX', 'https://x.com/AlchemixFi'],
  ['Angle Protocol', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum', 'Arbitrum'], 'Stablecoin and borrowing protocol for decentralized money.', 'https://www.angle.money', 'https://app.angle.money', 2021, 'France', 'ANGLE', 'https://x.com/AngleProtocol'],
  ['Lybra Finance', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum'], 'DeFi protocol for collateralized stable assets and yield-bearing products.', 'https://lybra.finance', 'https://lybra.finance/app', 2023, 'Metaverse', 'LBR', 'https://x.com/LybraFinanceLSD'],
  ['Convex Finance', 'DeFi', ['DeFi', 'Yield'], ['Ethereum'], 'Yield optimization protocol built around Curve liquidity strategies.', 'https://www.convexfinance.com', 'https://www.convexfinance.com/stake', 2021, 'Metaverse', 'CVX', 'https://x.com/ConvexFinance'],
  ['Tokemak', 'DeFi', ['DeFi', 'Liquidity'], ['Ethereum'], 'Liquidity and market-making coordination protocol.', 'https://tokemak.xyz', 'https://app.tokemak.xyz', 2021, 'United States', 'TOKE', 'https://x.com/Tokemak'],
  ['Badger', 'DeFi', ['DeFi', 'Bitcoin'], ['Ethereum'], 'Bitcoin-focused DeFi protocol and ecosystem.', 'https://badger.com', 'https://app.badger.com', 2020, 'Metaverse', 'BADGER', 'https://x.com/badgerdao'],
  ['Beefy', 'DeFi', ['DeFi', 'Yield'], ['Ethereum', 'BNB Chain', 'Multiple'], 'Multi-chain yield optimizer with automated vault strategies.', 'https://beefy.com', 'https://app.beefy.com', 2020, 'Metaverse', 'BIFI', 'https://x.com/beefyfinance'],
  ['Aevo', 'DeFi', ['DeFi', 'Derivatives'], ['Ethereum'], 'Derivatives-focused onchain trading platform.', 'https://www.aevo.xyz', 'https://www.aevo.xyz', 2023, 'Metaverse', 'AEVO', 'https://x.com/aevoxyz'],
  ['Vertex Protocol', 'DeFi', ['DeFi', 'Derivatives'], ['Arbitrum'], 'Orderbook-based perp and spot exchange protocol.', 'https://vertexprotocol.com', 'https://app.vertexprotocol.com', 2022, 'United States', 'VRTX', 'https://x.com/vertex_protocol'],
  ['Kwenta', 'DeFi', ['DeFi', 'Derivatives'], ['Optimism'], 'Perpetuals trading front-end and governance ecosystem.', 'https://kwenta.io', 'https://kwenta.io/trade', 2021, 'Metaverse', 'KWENTA', 'https://x.com/Kwenta_io'],
  ['Perpetual Protocol', 'DeFi', ['DeFi', 'Derivatives'], ['Optimism'], 'Decentralized perpetual contracts protocol.', 'https://perp.com', 'https://app.perp.com', 2020, 'Taiwan', 'PERP', 'https://x.com/perpprotocol'],
  ['Gains Network', 'DeFi', ['DeFi', 'Derivatives'], ['Arbitrum', 'Polygon'], 'Leverage trading protocol for crypto and synthetic markets.', 'https://gains.trade', 'https://gains.trade/trading', 2021, 'Metaverse', 'GNS', 'https://x.com/GainsNetwork_io'],
  ['Dolomite', 'DeFi', ['DeFi', 'Lending'], ['Arbitrum', 'Berachain'], 'Margin-enabled money market and DeFi infrastructure protocol.', 'https://dolomite.io', 'https://app.dolomite.io', 2020, 'United States', 'DOLO', 'https://x.com/Dolomite_io'],
  ['Solend', 'DeFi', ['DeFi', 'Lending'], ['Solana'], 'Solana-based decentralized lending and borrowing protocol.', 'https://solend.fi', 'https://solend.fi/dashboard', 2021, 'Metaverse', 'SLND', 'https://x.com/solendprotocol'],
  ['marginfi', 'DeFi', ['DeFi', 'Lending'], ['Solana'], 'Onchain borrowing and lending protocol in Solana ecosystem.', 'https://marginfi.com', 'https://app.marginfi.com', 2023, 'Metaverse', 'n/a', 'https://x.com/marginfi'],
  ['Meteora', 'DeFi', ['DeFi', 'DEX'], ['Solana'], 'Liquidity infrastructure and DEX tooling for Solana.', 'https://www.meteora.ag', 'https://app.meteora.ag', 2023, 'Metaverse', 'n/a', 'https://x.com/MeteoraAG'],
  ['Orca', 'DeFi', ['DeFi', 'DEX'], ['Solana'], 'User-friendly Solana DEX and liquidity protocol.', 'https://www.orca.so', 'https://www.orca.so/swap', 2021, 'United States', 'ORCA', 'https://x.com/orca_so'],
  ['Sanctum', 'DeFi', ['DeFi', 'Staking'], ['Solana'], 'Solana liquid staking and validator marketplace protocol.', 'https://sanctum.so', 'https://sanctum.so/app', 2024, 'Metaverse', 'n/a', 'https://x.com/sanctumso'],

  ['Algorand Foundation', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Algorand'], 'Foundation supporting Algorand protocol and ecosystem development.', 'https://algorand.foundation', 'https://algorand.foundation/ecosystem', 2019, 'Singapore', 'ALGO', 'https://x.com/AlgoFoundation'],
  ['Hedera', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Hedera'], 'Public distributed ledger ecosystem powered by hashgraph consensus.', 'https://hedera.com', 'https://hedera.com/ecosystem', 2018, 'United States', 'HBAR', 'https://x.com/hedera'],
  ['Tezos Foundation', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Tezos'], 'Foundation supporting Tezos protocol and ecosystem growth.', 'https://tezos.foundation', 'https://tezos.com', 2017, 'Switzerland', 'XTZ', 'https://x.com/tezos'],
  ['DFINITY', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Internet Computer'], 'Core organization behind Internet Computer protocol and tooling.', 'https://dfinity.org', 'https://internetcomputer.org', 2016, 'Switzerland', 'ICP', 'https://x.com/dfinity'],
  ['Fantom Foundation', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Fantom'], 'Organization supporting Fantom network and ecosystem.', 'https://fantom.foundation', 'https://fantom.foundation/ecosystem', 2018, 'United Arab Emirates', 'FTM', 'https://x.com/FantomFDN'],
  ['Cronos Labs', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Cronos'], 'Developer-focused organization supporting Cronos ecosystem.', 'https://cronoslabs.org', 'https://cronos.org', 2021, 'Singapore', 'CRO', 'https://x.com/cronos_chain'],
  ['Core DAO', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Core'], 'Ecosystem and governance organization for Core blockchain.', 'https://coredao.org', 'https://coredao.org/ecosystem', 2023, 'Metaverse', 'CORE', 'https://x.com/Coredao_Org'],
  ['Oasis Network', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Privacy'], ['Oasis'], 'Privacy-enabled L1 ecosystem for scalable applications.', 'https://oasisprotocol.org', 'https://oasisprotocol.org/ecosystem', 2020, 'United States', 'ROSE', 'https://x.com/OasisProtocol'],
  ['Harmony', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Harmony'], 'Sharded L1 blockchain ecosystem and developer platform.', 'https://www.harmony.one', 'https://www.harmony.one/ecosystem', 2019, 'United States', 'ONE', 'https://x.com/harmonyprotocol'],
  ['Aurora', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'EVM'], ['NEAR'], 'EVM-compatible environment built in the NEAR ecosystem.', 'https://aurora.dev', 'https://aurora.dev/developers', 2021, 'Metaverse', 'AURORA', 'https://x.com/auroraisnear'],
  ['Astar Network', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Polkadot'], 'Smart contract ecosystem connected to Polkadot.', 'https://astar.network', 'https://astar.network/ecosystem', 2021, 'Japan', 'ASTR', 'https://x.com/AstarNetwork'],
  ['MultiversX', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['MultiversX'], 'High-throughput blockchain platform and ecosystem.', 'https://multiversx.com', 'https://multiversx.com/ecosystem', 2019, 'Romania', 'EGLD', 'https://x.com/MultiversX'],
  ['Nervos', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Nervos'], 'Layered blockchain architecture for decentralized applications.', 'https://www.nervos.org', 'https://www.nervos.org/ecosystem', 2019, 'China', 'CKB', 'https://x.com/NervosNetwork'],
  ['Neo', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Neo'], 'Smart economy blockchain ecosystem and developer platform.', 'https://neo.org', 'https://neo.org/ecosystem', 2014, 'China', 'NEO', 'https://x.com/Neo_Blockchain'],
  ['Movement Labs', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Move', 'Ethereum'], 'Move-based execution ecosystem targeting Ethereum compatibility.', 'https://movementlabs.xyz', 'https://movementlabs.xyz/ecosystem', 2023, 'United States', 'MOVE', 'https://x.com/movementlabsxyz'],
  ['Monad Labs', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Monad'], 'High-performance EVM-compatible blockchain development team.', 'https://monad.xyz', 'https://monad.xyz/developers', 2022, 'United States', 'n/a', 'https://x.com/monad_xyz'],
  ['Shardeum', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Shardeum'], 'EVM-compatible sharded blockchain ecosystem.', 'https://shardeum.org', 'https://shardeum.org/ecosystem', 2022, 'United States', 'SHM', 'https://x.com/shardeum'],
  ['Manta Network', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Zero Knowledge'], ['Manta', 'Polkadot'], 'Modular ecosystem for ZK applications and private identities.', 'https://manta.network', 'https://manta.network/ecosystem', 2023, 'United States', 'MANTA', 'https://x.com/MantaNetwork'],
  ['Mode', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Mode', 'Ethereum'], 'Ethereum L2 focused on DeFi growth and app incentives.', 'https://www.mode.network', 'https://www.mode.network/ecosystem', 2024, 'Metaverse', 'MODE', 'https://x.com/modenetwork'],
  ['Xai', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Gaming'], ['Xai', 'Arbitrum'], 'Gaming-focused blockchain ecosystem built with Arbitrum tech.', 'https://xai.games', 'https://xai.games/ecosystem', 2023, 'United States', 'XAI', 'https://x.com/XAI_GAMES'],

  ['Pyth Network', 'Infrastructure', ['Infrastructure', 'Oracles'], ['Solana', 'Ethereum', 'Multiple'], 'Oracle network delivering real-time market data onchain.', 'https://www.pyth.network', 'https://www.pyth.network/developers', 2021, 'United States', 'PYTH', 'https://x.com/PythNetwork'],
  ['RedStone', 'Infrastructure', ['Infrastructure', 'Oracles'], ['Ethereum', 'Arbitrum', 'Multiple'], 'Oracle infrastructure with modular data delivery models.', 'https://redstone.finance', 'https://redstone.finance/developers', 2021, 'Poland', 'RED', 'https://x.com/redstone_defi'],
  ['API3', 'Infrastructure', ['Infrastructure', 'Oracles'], ['Ethereum', 'Multiple'], 'First-party oracle protocol and API data marketplace.', 'https://api3.org', 'https://docs.api3.org', 2020, 'Switzerland', 'API3', 'https://x.com/API3DAO'],
  ['Band Protocol', 'Infrastructure', ['Infrastructure', 'Oracles'], ['Cosmos', 'Ethereum'], 'Cross-chain oracle network for decentralized apps.', 'https://bandprotocol.com', 'https://docs.bandchain.org', 2019, 'Thailand', 'BAND', 'https://x.com/BandProtocol'],
  ['UMA', 'Infrastructure', ['Infrastructure', 'Oracles'], ['Ethereum'], 'Optimistic oracle and decentralized financial contract infrastructure.', 'https://uma.xyz', 'https://uma.xyz/products', 2018, 'United States', 'UMA', 'https://x.com/UMAprotocol'],
  ['Supra', 'Infrastructure', ['Infrastructure', 'Oracles'], ['Ethereum', 'Multiple'], 'Oracle and verifiable randomness infrastructure.', 'https://supra.com', 'https://supra.com/developers', 2022, 'United States', 'SUPRA', 'https://x.com/SUPRA_Labs'],
  ['Lava Network', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Cosmos', 'Ethereum', 'Multiple'], 'Decentralized RPC protocol and marketplace for blockchain access.', 'https://www.lavanet.xyz', 'https://docs.lavanet.xyz', 2023, 'Israel', 'LAVA', 'https://x.com/lavanetxyz'],
  ['Router Protocol', 'Infrastructure', ['Infrastructure', 'Cross-chain'], ['Ethereum', 'Cosmos', 'Multiple'], 'Interoperability infrastructure for cross-chain messaging and intents.', 'https://routerprotocol.com', 'https://routerprotocol.com/developers', 2021, 'India', 'ROUTE', 'https://x.com/routerprotocol'],
  ['Socket', 'Infrastructure', ['Infrastructure', 'Cross-chain'], ['Ethereum', 'Multiple'], 'Developer and user infrastructure for cross-chain actions.', 'https://socket.tech', 'https://docs.socket.tech', 2021, 'India', 'n/a', 'https://x.com/socketprotocol'],
  ['Skip', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Cosmos'], 'Infrastructure team focused on transaction flow and MEV tooling in Cosmos.', 'https://skip.money', 'https://skip.money/products', 2022, 'United States', 'n/a', 'https://x.com/skipprotocol'],
  ['Chainflip', 'Infrastructure', ['Infrastructure', 'Cross-chain'], ['Chainflip', 'Ethereum', 'Bitcoin'], 'Cross-chain AMM protocol for native asset swaps.', 'https://chainflip.io', 'https://chainflip.io/app', 2023, 'Switzerland', 'FLIP', 'https://x.com/chainflip'],
  ['Union', 'Infrastructure', ['Infrastructure', 'Cross-chain'], ['Cosmos', 'Ethereum'], 'Interoperability layer for trust-minimized cross-chain messaging.', 'https://union.build', 'https://docs.union.build', 2023, 'Metaverse', 'n/a', 'https://x.com/union_build'],

  ['DexScreener', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Ethereum', 'Solana', 'Multiple'], 'Real-time DEX market data and token pair analytics.', 'https://dexscreener.com', 'https://dexscreener.com/new-pairs', 2021, 'United Kingdom', 'n/a', 'https://x.com/dexscreener'],
  ['GeckoTerminal', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Ethereum', 'Solana', 'Multiple'], 'DEX trading analytics and charting platform from CoinGecko.', 'https://www.geckoterminal.com', 'https://www.geckoterminal.com/trending', 2023, 'Singapore', 'n/a', 'https://x.com/geckoterminal'],
  ['CoinGlass', 'Data & Analytics', ['Data & Analytics', 'Derivatives'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Derivatives and liquidation analytics platform for crypto markets.', 'https://www.coinglass.com', 'https://www.coinglass.com/pro', 2019, 'United States', 'n/a', 'https://x.com/coinglass_com'],
  ['CoinPaprika', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Ethereum', 'Multiple'], 'Crypto asset market data and API provider.', 'https://coinpaprika.com', 'https://api.coinpaprika.com', 2018, 'Poland', 'n/a', 'https://x.com/coinpaprika'],
  ['CryptoRank', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Market analytics and research platform for token ecosystems.', 'https://cryptorank.io', 'https://cryptorank.io/insights', 2017, 'Estonia', 'n/a', 'https://x.com/CryptoRank_io'],
  ['Token Unlocks', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Token unlock schedule and vesting analytics platform.', 'https://token.unlocks.app', 'https://token.unlocks.app/calendar', 2022, 'Metaverse', 'n/a', 'https://x.com/Token_Unlocks'],
  ['SoSoValue', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Market intelligence and macro analytics platform for digital assets.', 'https://sosovalue.com', 'https://sosovalue.com/markets', 2024, 'Singapore', 'SOSO', 'https://x.com/sosovalue'],
  ['RootData', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Project, funding, and ecosystem analytics database for crypto.', 'https://www.rootdata.com', 'https://www.rootdata.com/projects', 2022, 'Singapore', 'n/a', 'https://x.com/rootdata'],
  ['CryptoCompare', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Digital asset market data provider and index platform.', 'https://www.cryptocompare.com', 'https://min-api.cryptocompare.com', 2014, 'United Kingdom', 'n/a', 'https://x.com/CryptoCompare'],
  ['Messari Pro', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Institutional research and analytics suite from Messari.', 'https://messari.io', 'https://messari.io/pro', 2018, 'United States', 'n/a', 'https://x.com/MessariCrypto'],

  ['Hexagate', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Multiple'], 'Onchain threat detection and prevention platform.', 'https://www.hexagate.com', 'https://www.hexagate.com/platform', 2022, 'Israel', 'n/a', 'https://x.com/Hexagate_'],
  ['Salus Security', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Security audits and formal review services for blockchain projects.', 'https://salusec.io', 'https://salusec.io/services', 2021, 'Singapore', 'n/a', 'https://x.com/salusecio'],
  ['Ackee Blockchain', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Security research and smart contract audit firm.', 'https://ackee.xyz', 'https://ackee.xyz/services', 2019, 'Czech Republic', 'n/a', 'https://x.com/ackeeblockchain'],
  ['Dedaub', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Smart contract security company focused on audits and tooling.', 'https://dedaub.com', 'https://dedaub.com/services', 2020, 'Greece', 'n/a', 'https://x.com/dedaub'],
  ['HashDit', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'BSC'], 'Web3 security platform focused on scam prevention and alerts.', 'https://hashdit.io', 'https://hashdit.io/products', 2022, 'Hong Kong', 'n/a', 'https://x.com/hashdit'],
  ['Phalcon', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'BSC', 'Multiple'], 'Transaction simulation and threat detection tooling.', 'https://phalcon.xyz', 'https://phalcon.xyz/explorer', 2022, 'Singapore', 'n/a', 'https://x.com/BlockSecTeam'],
  ['GoPlus Security', 'Security', ['Security', 'Infrastructure'], ['Ethereum', 'BSC', 'Multiple'], 'Open security data and APIs for wallets and dapps.', 'https://gopluslabs.io', 'https://docs.gopluslabs.io', 2022, 'Singapore', 'GPS', 'https://x.com/GoPlusSecurity'],
  ['Pessimistic', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Blockchain security company providing audits and monitoring.', 'https://pessimistic.io', 'https://pessimistic.io/services', 2021, 'Ukraine', 'n/a', 'https://x.com/pessimistic_io'],

  ['Tangem', 'Wallets', ['Wallets', 'Security'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Hardware wallet card ecosystem for self-custody.', 'https://tangem.com', 'https://tangem.com/en', 2018, 'Switzerland', 'n/a', 'https://x.com/Tangem'],
  ['OneKey', 'Wallets', ['Wallets', 'Security'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Hardware and software wallet suite for multi-chain users.', 'https://onekey.so', 'https://onekey.so/download', 2019, 'Hong Kong', 'n/a', 'https://x.com/OneKeyHQ'],
  ['BitBox', 'Wallets', ['Wallets', 'Security'], ['Bitcoin', 'Ethereum'], 'Hardware wallet platform developed by Shift Crypto.', 'https://bitbox.swiss', 'https://bitbox.swiss/download', 2019, 'Switzerland', 'n/a', 'https://x.com/BitBoxSwiss'],
  ['SafePal', 'Wallets', ['Wallets', 'Security'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Hardware and mobile wallet ecosystem for digital assets.', 'https://www.safepal.com', 'https://www.safepal.com/download', 2018, 'Singapore', 'SFP', 'https://x.com/iSafePal'],
  ['Coin98 Wallet', 'Wallets', ['Wallets'], ['Ethereum', 'Solana', 'Multiple'], 'Multi-chain wallet and DeFi gateway.', 'https://coin98.com/wallet', 'https://coin98.com/wallet-download', 2020, 'Vietnam', 'C98', 'https://x.com/coin98_wallet'],
  ['imToken', 'Wallets', ['Wallets'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Mobile self-custody wallet with multi-chain support.', 'https://token.im', 'https://token.im/download', 2016, 'Singapore', 'n/a', 'https://x.com/imTokenOfficial'],
  ['TokenPocket', 'Wallets', ['Wallets'], ['Ethereum', 'Solana', 'Multiple'], 'Multi-chain wallet and dapp browser ecosystem.', 'https://www.tokenpocket.pro', 'https://www.tokenpocket.pro/en/download/app', 2018, 'Singapore', 'TPT', 'https://x.com/TokenPocket_TP'],
  ['Zengo', 'Wallets', ['Wallets', 'Security'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Keyless self-custody wallet for mobile users.', 'https://zengo.com', 'https://zengo.com/download', 2019, 'Israel', 'n/a', 'https://x.com/Zengo'],

  ['Deribit', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum'], 'Derivatives exchange focused on options and futures.', 'https://www.deribit.com', 'https://www.deribit.com/trading', 2016, 'Panama', 'n/a', 'https://x.com/DeribitOfficial'],
  ['BitMEX', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum'], 'Crypto derivatives exchange and trading platform.', 'https://www.bitmex.com', 'https://www.bitmex.com/app/trade', 2014, 'Seychelles', 'BMEX', 'https://x.com/BitMEX'],
  ['Upbit', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Major centralized exchange serving global and Korean markets.', 'https://upbit.com', 'https://upbit.com/exchange', 2017, 'South Korea', 'n/a', 'https://x.com/upbitglobal'],
  ['Bithumb', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Korean digital asset exchange and market platform.', 'https://www.bithumb.com', 'https://www.bithumb.com/trade', 2014, 'South Korea', 'n/a', 'https://x.com/BithumbOfficial'],
  ['Coincheck', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum'], 'Japan-based crypto exchange and consumer platform.', 'https://coincheck.com', 'https://coincheck.com/exchange', 2014, 'Japan', 'n/a', 'https://x.com/coincheckjp'],
  ['bitFlyer', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum'], 'Crypto exchange platform with presence in Japan and other regions.', 'https://bitflyer.com', 'https://bitflyer.com/en-jp/exchange', 2014, 'Japan', 'n/a', 'https://x.com/bitFlyer'],
  ['Luno', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum'], 'Crypto investing and payments platform in multiple markets.', 'https://www.luno.com', 'https://www.luno.com/en/trade', 2013, 'United Kingdom', 'n/a', 'https://x.com/luno'],
  ['Bitso', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum'], 'Latin American crypto exchange and payments company.', 'https://bitso.com', 'https://bitso.com/trade', 2014, 'Mexico', 'n/a', 'https://x.com/Bitso'],
  ['Mercado Bitcoin', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Brazilian crypto exchange and digital asset marketplace.', 'https://www.mercadobitcoin.com.br', 'https://www.mercadobitcoin.com.br/trade', 2013, 'Brazil', 'n/a', 'https://x.com/MercadoBitcoin'],
  ['Coins.ph', 'Payments', ['Payments'], ['Bitcoin', 'Ethereum'], 'Consumer wallet and payments platform in Southeast Asia.', 'https://coins.ph', 'https://coins.ph/app', 2014, 'Philippines', 'n/a', 'https://x.com/coinsph'],
  ['Coinhako', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Singapore-based crypto trading platform.', 'https://www.coinhako.com', 'https://www.coinhako.com/exchange', 2014, 'Singapore', 'n/a', 'https://x.com/coinhako'],
  ['Phemex', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Crypto exchange for spot and derivatives markets.', 'https://phemex.com', 'https://phemex.com/trade', 2019, 'Singapore', 'n/a', 'https://x.com/Phemex_official'],
  ['CoinDCX', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Indian crypto exchange and investing platform.', 'https://coindcx.com', 'https://coindcx.com/trade', 2018, 'India', 'n/a', 'https://x.com/CoinDCX'],
  ['ZebPay', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum'], 'Long-running crypto exchange platform in India.', 'https://zebpay.com', 'https://zebpay.com/exchange', 2014, 'India', 'n/a', 'https://x.com/zebpay'],
  ['Swyftx', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Australian digital asset trading platform.', 'https://swyftx.com', 'https://swyftx.com/au/trade', 2018, 'Australia', 'n/a', 'https://x.com/SwyftxAU'],
  ['Independent Reserve', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional and retail crypto exchange in APAC.', 'https://www.independentreserve.com', 'https://www.independentreserve.com/au/trade', 2013, 'Australia', 'n/a', 'https://x.com/indepreserve'],
  ['VALR', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'African crypto exchange and trading platform.', 'https://www.valr.com', 'https://www.valr.com/exchange', 2018, 'South Africa', 'n/a', 'https://x.com/VALRdotcom'],
  ['Rain', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'MENA-focused crypto trading platform.', 'https://www.rain.com', 'https://www.rain.com/en/trade', 2017, 'Bahrain', 'n/a', 'https://x.com/rain'],
  ['BTSE', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Digital asset exchange and derivatives venue.', 'https://www.btse.com', 'https://www.btse.com/en/trade', 2018, 'United Arab Emirates', 'BTSE', 'https://x.com/BTSE_Official'],
  ['Bullish', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional-focused digital asset exchange platform.', 'https://bullish.com', 'https://bullish.com/exchange', 2021, 'Cayman Islands', 'n/a', 'https://x.com/Bullish'],

  ['Fidelity Digital Assets', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum'], 'Institutional digital asset custody and execution services.', 'https://www.fidelitydigitalassets.com', 'https://www.fidelitydigitalassets.com/what-we-offer', 2018, 'United States', 'n/a', 'https://x.com/Fidelity'],
  ['NYDIG', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin'], 'Bitcoin custody and financial infrastructure for institutions.', 'https://nydig.com', 'https://nydig.com/solutions', 2017, 'United States', 'n/a', 'https://x.com/NYDIG_BTC'],
  ['Bakkt', 'Custody', ['Custody', 'Payments'], ['Bitcoin', 'Ethereum'], 'Digital asset platform for custody and trading infrastructure.', 'https://www.bakkt.com', 'https://www.bakkt.com/platform', 2018, 'United States', 'n/a', 'https://x.com/Bakkt'],
  ['Ceffu', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional custody and settlement platform.', 'https://www.ceffu.com', 'https://www.ceffu.com/solutions', 2021, 'Singapore', 'n/a', 'https://x.com/CeffuGlobal'],
  ['GK8', 'Custody', ['Custody', 'Security'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional-grade digital asset custody technology.', 'https://www.gk8.io', 'https://www.gk8.io/platform', 2018, 'Israel', 'n/a', 'https://x.com/GK8_Security'],

  ['Galxe', 'Identity', ['Identity', 'DAOs & Governance'], ['Ethereum', 'BNB Chain', 'Multiple'], 'Web3 identity and credential platform for communities.', 'https://galxe.com', 'https://galxe.com/quest', 2021, 'United States', 'GAL', 'https://x.com/Galxe'],
  ['Fractal ID', 'Identity', ['Identity', 'Compliance'], ['Ethereum'], 'Identity verification platform for web3 users and apps.', 'https://fractal.id', 'https://fractal.id/for-users', 2021, 'United Kingdom', 'n/a', 'https://x.com/Fractal_ID'],
  ['idOS', 'Identity', ['Identity', 'Infrastructure'], ['Ethereum', 'Multiple'], 'Decentralized identity layer for reusable KYC and user data.', 'https://www.idos.network', 'https://www.idos.network/technology', 2023, 'Switzerland', 'n/a', 'https://x.com/idos_network'],
  ['Unstoppable Domains', 'Identity', ['Identity'], ['Ethereum', 'Polygon'], 'Onchain naming and digital identity platform.', 'https://unstoppabledomains.com', 'https://unstoppabledomains.com/search', 2018, 'United States', 'n/a', 'https://x.com/unstoppableweb'],
  ['Proof of Humanity', 'Identity', ['Identity', 'DAOs & Governance'], ['Ethereum'], 'Human registry protocol for sybil-resistant identity.', 'https://www.proofofhumanity.id', 'https://www.proofofhumanity.id/how-it-works', 2021, 'Metaverse', 'n/a', 'https://x.com/proofofhumanity'],

  ['Hats Protocol', 'DAOs & Governance', ['DAOs & Governance', 'Identity'], ['Ethereum', 'Base'], 'Role and permissions protocol for onchain organizations.', 'https://www.hatsprotocol.xyz', 'https://docs.hatsprotocol.xyz', 2022, 'United States', 'n/a', 'https://x.com/HatsProtocol'],
  ['Zodiac', 'DAOs & Governance', ['DAOs & Governance', 'Developer Tools'], ['Ethereum'], 'Composable DAO tooling framework built for Safe-based organizations.', 'https://www.zodiac.wiki', 'https://www.zodiac.wiki/documentation', 2021, 'Germany', 'n/a', 'https://x.com/gnosisDAO'],
  ['Agora Governance', 'DAOs & Governance', ['DAOs & Governance'], ['Ethereum', 'Base', 'Optimism'], 'Governance interface and voting tooling for token communities.', 'https://www.agora.xyz', 'https://www.agora.xyz/governance', 2023, 'United States', 'n/a', 'https://x.com/withAvara'],

  ['Tensor', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Marketplace'], ['Solana'], 'NFT marketplace and trading infrastructure for Solana.', 'https://www.tensor.trade', 'https://www.tensor.trade/collections', 2022, 'United States', 'TNSR', 'https://x.com/tensor_hq'],
  ['Metaplex', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Developer Tools'], ['Solana'], 'Core NFT and digital asset standards infrastructure in Solana ecosystem.', 'https://www.metaplex.com', 'https://developers.metaplex.com', 2021, 'United States', 'MPLX', 'https://x.com/metaplex'],
  ['NiftyKit', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Ethereum', 'Polygon'], 'No-code NFT creation and storefront toolkit.', 'https://niftykit.com', 'https://niftykit.com/features', 2021, 'Canada', 'n/a', 'https://x.com/niftykitapp'],
  ['Highlight', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Ethereum', 'Base'], 'Creator platform for tokenized communities and experiences.', 'https://highlight.xyz', 'https://highlight.xyz/create', 2021, 'United States', 'n/a', 'https://x.com/highlight_xyz'],
  ['Rarimo', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Identity'], ['Ethereum', 'Multiple'], 'Cross-chain protocol for interoperable digital identity and assets.', 'https://rarimo.com', 'https://rarimo.com/docs', 2022, 'Metaverse', 'RMO', 'https://x.com/rarimo_protocol'],

  ['Beam', 'Gaming', ['Gaming', 'Infrastructure'], ['Beam'], 'Gaming-focused blockchain ecosystem and tooling suite.', 'https://onbeam.com', 'https://onbeam.com/ecosystem', 2023, 'Metaverse', 'BEAM', 'https://x.com/BuildOnBeam'],
  ['Saga', 'Gaming', ['Gaming', 'Layer 1 / Layer 2'], ['Saga'], 'Protocol for launching app-specific chains, with gaming focus.', 'https://www.saga.xyz', 'https://www.saga.xyz/ecosystem', 2024, 'United States', 'SAGA', 'https://x.com/Sagaxyz__'],
  ['Ultra', 'Gaming', ['Gaming'], ['Ultra'], 'Gaming distribution platform with blockchain-native asset support.', 'https://ultra.io', 'https://ultra.io/platform', 2017, 'Switzerland', 'UOS', 'https://x.com/Ultra_io'],
  ['WEMIX', 'Gaming', ['Gaming'], ['WEMIX'], 'Blockchain gaming ecosystem and infrastructure platform.', 'https://www.wemix.com', 'https://www.wemix.com/platform', 2020, 'South Korea', 'WEMIX', 'https://x.com/WemixNetwork'],
  ['Mythos Foundation', 'Gaming', ['Gaming', 'DAOs & Governance'], ['Mythos'], 'Ecosystem foundation supporting interoperable gaming initiatives.', 'https://mythos.foundation', 'https://mythos.foundation/ecosystem', 2022, 'Switzerland', 'MYTH', 'https://x.com/mythostoken']
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

