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
  ['SynFutures', 'DeFi', ['DeFi', 'Derivatives'], ['Ethereum', 'Base'], 'Onchain perpetuals protocol and derivatives marketplace.', 'https://www.synfutures.com', 'https://app.synfutures.com', 2021, 'Singapore', 'F', 'https://x.com/SynFuturesDefi'],
  ['Polynomial Protocol', 'DeFi', ['DeFi', 'Derivatives'], ['Optimism'], 'Options and derivatives protocol in Optimism ecosystem.', 'https://www.polynomial.fi', 'https://app.polynomial.fi', 2022, 'Metaverse', 'n/a', 'https://x.com/PolynomialFi'],
  ['HMX', 'DeFi', ['DeFi', 'Derivatives'], ['Arbitrum'], 'Decentralized perpetual exchange protocol and vault ecosystem.', 'https://hmx.org', 'https://app.hmx.org', 2023, 'Metaverse', 'HMX', 'https://x.com/HMXorg'],
  ['Astaria', 'DeFi', ['DeFi', 'Lending', 'NFTs & Creator Economy'], ['Ethereum'], 'Lending protocol for NFT-collateralized credit markets.', 'https://www.astaria.xyz', 'https://www.astaria.xyz/app', 2022, 'United States', 'n/a', 'https://x.com/AstariaXYZ'],
  ['Arcadia Finance', 'DeFi', ['DeFi', 'Lending'], ['Ethereum', 'Base'], 'Cross-margin lending and portfolio collateral protocol.', 'https://arcadia.finance', 'https://app.arcadia.finance', 2022, 'Metaverse', 'AAA', 'https://x.com/ArcadiaFi'],
  ['Term Finance', 'DeFi', ['DeFi', 'Lending'], ['Ethereum'], 'Fixed-rate onchain lending via term auctions.', 'https://term.finance', 'https://app.term.finance', 2023, 'United States', 'TERM', 'https://x.com/term_labs'],
  ['Sovryn', 'DeFi', ['DeFi', 'Bitcoin'], ['Bitcoin', 'Rootstock'], 'Bitcoin-native DeFi protocol for lending and trading.', 'https://sovryn.app', 'https://sovryn.app', 2020, 'Metaverse', 'SOV', 'https://x.com/SovrynBTC'],
  ['ALEX', 'DeFi', ['DeFi', 'Bitcoin'], ['Stacks', 'Bitcoin'], 'Bitcoin DeFi protocol and launch ecosystem on Stacks.', 'https://alexlab.co', 'https://app.alexlab.co', 2021, 'Metaverse', 'ALEX', 'https://x.com/alexlabbtc'],
  ['zkLend', 'DeFi', ['DeFi', 'Lending'], ['Starknet'], 'Lending protocol for Starknet-based assets.', 'https://zklend.com', 'https://app.zklend.com', 2022, 'Metaverse', 'ZEND', 'https://x.com/zkLend'],
  ['Nostra', 'DeFi', ['DeFi', 'Lending'], ['Starknet'], 'Starknet DeFi suite with lending and liquidity products.', 'https://www.nostra.finance', 'https://app.nostra.finance', 2023, 'Metaverse', 'NSTR', 'https://x.com/nostrafinance'],
  ['Ekubo', 'DeFi', ['DeFi', 'DEX'], ['Starknet'], 'Concentrated liquidity DEX protocol on Starknet.', 'https://www.ekubo.org', 'https://app.ekubo.org', 2023, 'Metaverse', 'n/a', 'https://x.com/EkuboProtocol'],
  ['Vesu', 'DeFi', ['DeFi', 'Lending'], ['Starknet'], 'Money market protocol for Starknet ecosystem.', 'https://vesu.xyz', 'https://app.vesu.xyz', 2023, 'Metaverse', 'n/a', 'https://x.com/vesuxyz'],
  ['Clearpool', 'DeFi', ['DeFi', 'Lending', 'Real World Assets (RWA)'], ['Ethereum', 'Polygon'], 'Institutional credit marketplace connecting DeFi capital and borrowers.', 'https://clearpool.finance', 'https://app.clearpool.finance', 2022, 'Singapore', 'CPOOL', 'https://x.com/ClearpoolFin'],
  ['TrueFi', 'DeFi', ['DeFi', 'Lending', 'Real World Assets (RWA)'], ['Ethereum'], 'Onchain credit protocol offering uncollateralized lending markets.', 'https://truefi.io', 'https://app.truefi.io', 2020, 'United States', 'TRU', 'https://x.com/TrueFiDAO'],
  ['Credix', 'DeFi', ['DeFi', 'Real World Assets (RWA)'], ['Solana'], 'Credit protocol for emerging market private debt financing.', 'https://credix.finance', 'https://app.credix.finance', 2021, 'Brazil', 'CDX', 'https://x.com/Credix_finance'],
  ['OpenTrade', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'DeFi'], ['Ethereum'], 'Institutional-grade onchain fixed-income infrastructure.', 'https://opentrade.io', 'https://opentrade.io/products', 2023, 'United Kingdom', 'n/a', 'https://x.com/opentrade_io'],
  ['Mountain Protocol', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'Stablecoin'], ['Ethereum'], 'Yield-bearing stablecoin protocol backed by treasury assets.', 'https://www.mountainprotocol.com', 'https://www.mountainprotocol.com/usdm', 2023, 'Bermuda', 'USDM', 'https://x.com/MountainUSDM'],
  ['Hashnote', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'DeFi'], ['Ethereum'], 'Onchain cash and tokenized short-duration yield products.', 'https://www.hashnote.com', 'https://www.hashnote.com/products', 2023, 'United States', 'n/a', 'https://x.com/hashnote_lab'],
  ['Matrixdock', 'Real World Assets (RWA)', ['Real World Assets (RWA)'], ['Ethereum'], 'Tokenized treasury and RWA product issuer.', 'https://www.matrixdock.com', 'https://www.matrixdock.com/products', 2023, 'Singapore', 'n/a', 'https://x.com/Matrixdock_HQ'],
  ['Figure Markets', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'Payments'], ['Ethereum'], 'Blockchain-based financial marketplace for tokenized products.', 'https://www.figuremarkets.com', 'https://www.figuremarkets.com/products', 2024, 'United States', 'n/a', 'https://x.com/FigureMarkets'],

  ['Botanix', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Bitcoin'], ['Bitcoin'], 'Bitcoin L2 ecosystem using EVM-compatible execution.', 'https://botanixlabs.xyz', 'https://botanixlabs.xyz/developers', 2023, 'United Kingdom', 'n/a', 'https://x.com/botanixlabs'],
  ['Citrea', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Bitcoin'], ['Bitcoin'], 'ZK rollup project for Bitcoin-native scaling.', 'https://citrea.xyz', 'https://citrea.xyz/docs', 2024, 'Metaverse', 'n/a', 'https://x.com/citrea_xyz'],
  ['Mezo', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Bitcoin'], ['Bitcoin'], 'Bitcoin economy-focused L2 ecosystem.', 'https://mezo.org', 'https://mezo.org/learn', 2024, 'Metaverse', 'n/a', 'https://x.com/MezoNetwork'],
  ['Merlin Chain', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Bitcoin'], ['Bitcoin'], 'Bitcoin L2 network with EVM-compatible tooling.', 'https://merlinchain.io', 'https://merlinchain.io/ecosystem', 2024, 'Metaverse', 'MERL', 'https://x.com/MerlinLayer2'],
  ['Bitlayer', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Bitcoin'], ['Bitcoin'], 'Bitcoin security-backed L2 ecosystem for dapps.', 'https://www.bitlayer.org', 'https://www.bitlayer.org/ecosystem', 2024, 'Singapore', 'n/a', 'https://x.com/BitlayerLabs'],
  ['BOB', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Bitcoin'], ['Bitcoin', 'Ethereum'], 'Hybrid L2 combining Bitcoin security and EVM usability.', 'https://www.gobob.xyz', 'https://www.gobob.xyz/ecosystem', 2024, 'Metaverse', 'n/a', 'https://x.com/build_on_bob'],
  ['Corn', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Bitcoin'], ['Bitcoin'], 'Bitcoin-aligned L2 ecosystem and application network.', 'https://www.usecorn.com', 'https://www.usecorn.com/build', 2024, 'Metaverse', 'n/a', 'https://x.com/use_corn'],
  ['Eclipse', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Solana', 'Ethereum'], 'High-performance rollup using Solana VM in Ethereum context.', 'https://www.eclipse.xyz', 'https://www.eclipse.xyz/developers', 2024, 'United States', 'n/a', 'https://x.com/EclipseFND'],
  ['Zircuit', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Zero Knowledge'], ['Ethereum'], 'ZK rollup ecosystem with security-first sequencing.', 'https://www.zircuit.com', 'https://www.zircuit.com/ecosystem', 2024, 'United States', 'ZRC', 'https://x.com/ZircuitL2'],
  ['Fraxtal', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'DeFi'], ['Ethereum'], 'Layer 2 network in the Frax ecosystem.', 'https://frax.com/fraxtal', 'https://frax.com/fraxtal', 2024, 'Metaverse', 'FXS', 'https://x.com/fraxfinance'],
  ['Soneium', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Ethereum'], 'Consumer-focused L2 ecosystem by Sony group entities.', 'https://soneium.org', 'https://soneium.org/developers', 2024, 'Japan', 'n/a', 'https://x.com/soneium'],
  ['Abstract', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Consumer'], ['Ethereum'], 'Consumer app-focused L2 ecosystem.', 'https://www.abs.xyz', 'https://www.abs.xyz/ecosystem', 2024, 'United States', 'n/a', 'https://x.com/AbstractChain'],
  ['Ink', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Ethereum'], 'L2 ecosystem initiative associated with Kraken stack.', 'https://inkonchain.com', 'https://inkonchain.com/build', 2024, 'United States', 'n/a', 'https://x.com/inkonchain'],
  ['Chiliz Chain', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Payments'], ['Chiliz'], 'Sports and fan-token focused blockchain ecosystem.', 'https://www.chiliz.com', 'https://www.chiliz.com/chain', 2023, 'Malta', 'CHZ', 'https://x.com/Chiliz'],
  ['Elys Network', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'DeFi'], ['Cosmos'], 'Cosmos-based DeFi-focused chain ecosystem.', 'https://elys.network', 'https://elys.network/ecosystem', 2024, 'Metaverse', 'ELYS', 'https://x.com/elys_network'],

  ['Syndicate', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Base'], 'Developer platform for launching and operating onchain organizations.', 'https://syndicate.io', 'https://docs.syndicate.io', 2021, 'United States', 'n/a', 'https://x.com/syndicateio'],
  ['Zeeve', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Polygon', 'Multiple'], 'Managed infrastructure for nodes, rollups, and blockchain networks.', 'https://www.zeeve.io', 'https://www.zeeve.io/products', 2021, 'India', 'n/a', 'https://x.com/zeeveio'],
  ['GetBlock', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Solana', 'Multiple'], 'Node-as-a-service and blockchain API provider.', 'https://getblock.io', 'https://getblock.io/products', 2019, 'Cyprus', 'n/a', 'https://x.com/getblockio'],
  ['NOWNodes', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Shared and dedicated blockchain node infrastructure provider.', 'https://nownodes.io', 'https://nownodes.io/pricing', 2019, 'Netherlands', 'n/a', 'https://x.com/NOWNodes'],
  ['SubQuery', 'Infrastructure', ['Infrastructure', 'Data & Analytics'], ['Polkadot', 'Ethereum', 'Multiple'], 'Data indexing framework for multichain applications.', 'https://subquery.network', 'https://academy.subquery.network', 2021, 'New Zealand', 'SQT', 'https://x.com/subquerynetwork'],
  ['Spheron', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Multiple'], 'Decentralized compute and hosting platform for web3 developers.', 'https://spheron.network', 'https://spheron.network/products', 2021, 'India', 'SPON', 'https://x.com/SpheronFDN'],
  ['Akash Network', 'Infrastructure', ['Infrastructure', 'Compute'], ['Cosmos'], 'Decentralized cloud compute marketplace.', 'https://akash.network', 'https://akash.network/products', 2020, 'United States', 'AKT', 'https://x.com/akashnet_'],
  ['io.net', 'Infrastructure', ['Infrastructure', 'Compute'], ['Solana'], 'Distributed GPU compute network for AI workloads.', 'https://io.net', 'https://io.net/network', 2023, 'United States', 'IO', 'https://x.com/ionet'],
  ['Aethir', 'Infrastructure', ['Infrastructure', 'Compute'], ['Ethereum', 'Multiple'], 'Decentralized cloud GPU infrastructure and streaming stack.', 'https://aethir.com', 'https://aethir.com/products', 2023, 'Singapore', 'ATH', 'https://x.com/AethirCloud'],
  ['Render Network', 'Infrastructure', ['Infrastructure', 'Compute'], ['Solana', 'Ethereum'], 'Decentralized GPU rendering and compute network.', 'https://rendernetwork.com', 'https://rendernetwork.com/get-started', 2017, 'United States', 'RENDER', 'https://x.com/rendernetwork'],
  ['Helium', 'Infrastructure', ['Infrastructure', 'DePIN'], ['Solana'], 'Decentralized wireless infrastructure network.', 'https://www.helium.com', 'https://www.helium.com/network', 2019, 'United States', 'HNT', 'https://x.com/helium'],
  ['Hivemapper', 'Infrastructure', ['Infrastructure', 'DePIN'], ['Solana'], 'Decentralized mapping network and geospatial data marketplace.', 'https://hivemapper.com', 'https://hivemapper.com/explore', 2022, 'United States', 'HONEY', 'https://x.com/Hivemapper'],
  ['Arweave', 'Infrastructure', ['Infrastructure', 'Storage'], ['Arweave'], 'Permanent decentralized storage network and ecosystem.', 'https://www.arweave.org', 'https://www.arweave.org/ecosystem', 2018, 'United Kingdom', 'AR', 'https://x.com/arweaveeco'],
  ['Storj', 'Infrastructure', ['Infrastructure', 'Storage'], ['Ethereum'], 'Decentralized cloud object storage platform.', 'https://www.storj.io', 'https://www.storj.io/products', 2014, 'United States', 'STORJ', 'https://x.com/storj'],
  ['Sia Foundation', 'Infrastructure', ['Infrastructure', 'Storage'], ['Sia'], 'Organization stewarding Sia decentralized storage ecosystem.', 'https://sia.tech', 'https://sia.tech/products', 2021, 'United States', 'SC', 'https://x.com/Sia__Foundation'],
  ['Aleph.im', 'Infrastructure', ['Infrastructure', 'Compute'], ['Ethereum', 'Solana', 'Multiple'], 'Decentralized cloud for compute, storage, and indexing.', 'https://aleph.im', 'https://aleph.im/products', 2020, 'France', 'ALEPH', 'https://x.com/aleph_im'],
  ['Fluence', 'Infrastructure', ['Infrastructure', 'Compute'], ['Ethereum', 'Filecoin'], 'Decentralized compute protocol for resilient applications.', 'https://fluence.network', 'https://fluence.network/developers', 2017, 'United States', 'FLT', 'https://x.com/fluence_project'],
  ['Filecoin Foundation', 'Infrastructure', ['Infrastructure', 'Storage'], ['Filecoin'], 'Foundation supporting Filecoin and decentralized storage adoption.', 'https://fil.org', 'https://fil.org/ecosystem', 2020, 'United States', 'FIL', 'https://x.com/Filecoin'],

  ['L2BEAT', 'Data & Analytics', ['Data & Analytics', 'Layer 1 / Layer 2'], ['Ethereum'], 'Independent analytics and risk framework for L2 ecosystems.', 'https://l2beat.com', 'https://l2beat.com/scaling/summary', 2021, 'Poland', 'n/a', 'https://x.com/l2beat'],
  ['Blockworks Research', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Institutional-grade research and analytics platform.', 'https://blockworks.co/research', 'https://blockworks.co/research', 2020, 'United States', 'n/a', 'https://x.com/blockworksres'],
  ['Delphi Digital', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Crypto research and analytics firm.', 'https://www.delphidigital.io', 'https://www.delphidigital.io/research', 2018, 'United States', 'n/a', 'https://x.com/delphi_digital'],
  ['DropsTab', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Ethereum', 'Multiple'], 'Crypto market tracking and portfolio analytics platform.', 'https://dropstab.com', 'https://dropstab.com/coins', 2021, 'Estonia', 'n/a', 'https://x.com/drops_tab'],
  ['CoinCodex', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Ethereum', 'Multiple'], 'Asset data, forecasts, and market analytics portal.', 'https://coincodex.com', 'https://coincodex.com/markets', 2017, 'Austria', 'n/a', 'https://x.com/CoinCodex'],
  ['LunarCrush', 'Data & Analytics', ['Data & Analytics', 'Intelligence'], ['Ethereum', 'Multiple'], 'Social and market intelligence analytics for crypto assets.', 'https://lunarcrush.com', 'https://lunarcrush.com/discover', 2018, 'United States', 'LUNR', 'https://x.com/LunarCrush'],
  ['Kaito', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'AI-powered information and signal discovery platform for crypto.', 'https://kaito.ai', 'https://kaito.ai/platform', 2022, 'United States', 'KAITO', 'https://x.com/KaitoAI'],
  ['Laevitas', 'Data & Analytics', ['Data & Analytics', 'Derivatives'], ['Bitcoin', 'Ethereum'], 'Derivatives analytics and options data platform.', 'https://laevitas.ch', 'https://laevitas.ch/dashboard', 2019, 'Switzerland', 'n/a', 'https://x.com/laevitashq'],

  ['Blockaid', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Solana', 'Multiple'], 'Transaction and dapp threat detection infrastructure.', 'https://blockaid.io', 'https://blockaid.io/platform', 2022, 'Israel', 'n/a', 'https://x.com/blockaid_'],
  ['Blowfish', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Solana'], 'Transaction simulation and risk protection APIs.', 'https://blowfish.xyz', 'https://blowfish.xyz/products', 2022, 'United States', 'n/a', 'https://x.com/blowfishxyz'],
  ['Wallet Guard', 'Security', ['Security', 'Wallets'], ['Ethereum'], 'Browser extension and wallet security tooling for users.', 'https://walletguard.app', 'https://walletguard.app/download', 2022, 'United States', 'n/a', 'https://x.com/wallet_guard'],
  ['Scam Sniffer', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Multiple'], 'Anti-phishing and threat intelligence for web3 users.', 'https://www.scamsniffer.io', 'https://www.scamsniffer.io/products', 2022, 'Singapore', 'n/a', 'https://x.com/realScamSniffer'],
  ['ChainPatrol', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Multiple'], 'Brand and phishing protection platform for web3 teams.', 'https://chainpatrol.io', 'https://chainpatrol.io/platform', 2020, 'Canada', 'n/a', 'https://x.com/chain_patrol'],
  ['Webacy', 'Security', ['Security', 'Wallets'], ['Ethereum', 'Base'], 'Wallet protection and beneficiary safety tooling.', 'https://www.webacy.com', 'https://www.webacy.com/products', 2022, 'United States', 'n/a', 'https://x.com/mywebacy'],
  ['Harpie', 'Security', ['Security', 'Wallets'], ['Ethereum'], 'Onchain wallet security and exploit prevention platform.', 'https://www.harpie.io', 'https://www.harpie.io/security', 2022, 'United States', 'n/a', 'https://x.com/harpieio'],

  ['Taho', 'Wallets', ['Wallets'], ['Ethereum'], 'Open-source wallet focused on community-owned governance.', 'https://taho.xyz', 'https://taho.xyz/download', 2021, 'United States', 'n/a', 'https://x.com/Taho_xyz'],
  ['Enkrypt', 'Wallets', ['Wallets'], ['Ethereum', 'Polkadot', 'Multiple'], 'Browser extension wallet by MyEtherWallet team.', 'https://www.enkrypt.com', 'https://www.enkrypt.com/download', 2021, 'United States', 'n/a', 'https://x.com/enkrypt'],
  ['Atomic Wallet', 'Wallets', ['Wallets'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Multi-asset self-custody wallet platform.', 'https://atomicwallet.io', 'https://atomicwallet.io/downloads', 2018, 'Estonia', 'AWC', 'https://x.com/AtomicWallet'],
  ['Guarda', 'Wallets', ['Wallets'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Multi-platform non-custodial wallet ecosystem.', 'https://guarda.com', 'https://guarda.com/download', 2017, 'Estonia', 'n/a', 'https://x.com/GuardaWallet'],
  ['Solflare', 'Wallets', ['Wallets'], ['Solana'], 'Solana-native wallet and staking platform.', 'https://solflare.com', 'https://solflare.com/download', 2021, 'Metaverse', 'n/a', 'https://x.com/solflare_wallet'],
  ['Yoroi', 'Wallets', ['Wallets'], ['Cardano'], 'Light wallet for Cardano ecosystem users.', 'https://yoroi-wallet.com', 'https://yoroi-wallet.com/download', 2018, 'Japan', 'n/a', 'https://x.com/YoroiWallet'],
  ['Eternl', 'Wallets', ['Wallets'], ['Cardano'], 'Feature-rich Cardano wallet for advanced users.', 'https://eternl.io', 'https://eternl.io/app', 2021, 'Metaverse', 'n/a', 'https://x.com/eternlwallet'],
  ['Lace', 'Wallets', ['Wallets'], ['Cardano'], 'Official Cardano light wallet by Input Output.', 'https://www.lace.io', 'https://www.lace.io/download', 2023, 'Hong Kong', 'n/a', 'https://x.com/lace_io'],

  ['Paybis', 'Payments', ['Payments', 'Infrastructure'], ['Ethereum', 'Multiple'], 'Fiat-crypto on-ramp and exchange infrastructure provider.', 'https://paybis.com', 'https://paybis.com/business', 2014, 'United Kingdom', 'n/a', 'https://x.com/paybis'],
  ['Onramper', 'Payments', ['Payments', 'Infrastructure'], ['Ethereum', 'Multiple'], 'Aggregated fiat on-ramp infrastructure for wallets and dapps.', 'https://onramper.com', 'https://onramper.com/products', 2020, 'Netherlands', 'n/a', 'https://x.com/onramper'],
  ['BVNK', 'Payments', ['Payments', 'Infrastructure'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Stablecoin payments and business treasury infrastructure.', 'https://www.bvnk.com', 'https://www.bvnk.com/products', 2021, 'United Kingdom', 'n/a', 'https://x.com/BVNKFinance'],
  ['Bridge', 'Payments', ['Payments', 'Infrastructure'], ['Ethereum', 'Solana'], 'Stablecoin and payments infrastructure for global money movement.', 'https://www.bridge.xyz', 'https://www.bridge.xyz/products', 2022, 'United States', 'n/a', 'https://x.com/bridge_xyz'],
  ['Zero Hash', 'Payments', ['Payments', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Embedded digital asset and stablecoin infrastructure for fintechs.', 'https://zerohash.com', 'https://zerohash.com/solutions', 2017, 'United States', 'n/a', 'https://x.com/ZeroHashX'],
  ['Yellow Card', 'Payments', ['Payments'], ['Bitcoin', 'Ethereum', 'Multiple'], 'African payments and digital asset platform.', 'https://yellowcard.io', 'https://yellowcard.io/products', 2019, 'United States', 'n/a', 'https://x.com/yellowcard_app'],
  ['Paxful', 'Payments', ['Payments', 'Exchange'], ['Bitcoin'], 'Peer-to-peer Bitcoin marketplace and payments platform.', 'https://paxful.com', 'https://paxful.com/buy-bitcoin', 2015, 'United States', 'n/a', 'https://x.com/paxful'],

  ['Dfns', 'Custody', ['Custody', 'Infrastructure'], ['Ethereum', 'Solana', 'Multiple'], 'Wallet-as-a-service and secure key management infrastructure.', 'https://www.dfns.co', 'https://www.dfns.co/products', 2020, 'France', 'n/a', 'https://x.com/dfnsHQ'],
  ['Cubist', 'Custody', ['Custody', 'Security'], ['Ethereum', 'Solana', 'Multiple'], 'Key management and policy engine for developers and institutions.', 'https://cubist.dev', 'https://cubist.dev/platform', 2022, 'United States', 'n/a', 'https://x.com/cubistdev'],
  ['Utila', 'Custody', ['Custody', 'Infrastructure'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Institutional digital asset operations and custody stack.', 'https://utila.io', 'https://utila.io/products', 2022, 'Israel', 'n/a', 'https://x.com/utila_io'],
  ['Safeheron', 'Custody', ['Custody', 'Infrastructure'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Institutional self-custody infrastructure and MPC wallet stack.', 'https://safeheron.com', 'https://safeheron.com/products', 2021, 'Singapore', 'n/a', 'https://x.com/safeheron'],

  ['Disco', 'Identity', ['Identity'], ['Ethereum'], 'Decentralized identity and credential profile platform.', 'https://www.disco.xyz', 'https://www.disco.xyz/features', 2021, 'United States', 'n/a', 'https://x.com/discoxyz'],
  ['Humanode', 'Identity', ['Identity', 'Biometrics'], ['Humanode'], 'Biometric sybil-resistant blockchain identity network.', 'https://humanode.io', 'https://humanode.io/ecosystem', 2022, 'United Kingdom', 'HMND', 'https://x.com/humanode_io'],

  ['Karma3 Labs', 'DAOs & Governance', ['DAOs & Governance', 'Identity'], ['Ethereum', 'Multiple'], 'Reputation and governance tooling for web3 communities.', 'https://karma3labs.com', 'https://karma3labs.com/products', 2023, 'United States', 'n/a', 'https://x.com/karma3labs'],
  ['Utopia Labs', 'DAOs & Governance', ['DAOs & Governance', 'Payments'], ['Ethereum'], 'Treasury and finance operations tools for DAOs.', 'https://www.utopialabs.com', 'https://www.utopialabs.com/products', 2021, 'United States', 'n/a', 'https://x.com/UtopiaLabs_'],

  ['HUG', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Ethereum'], 'Creator network and educational tools for web3 artists.', 'https://thehug.xyz', 'https://thehug.xyz/creators', 2022, 'United States', 'n/a', 'https://x.com/thehugxyz'],
  ['MOOAR', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Marketplace'], ['Solana', 'Ethereum'], 'NFT launchpad and marketplace from STEPN ecosystem.', 'https://mooar.com', 'https://mooar.com/launchpad', 2022, 'Singapore', 'GMT', 'https://x.com/mooarofficial'],
  ['Exchange Art', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Marketplace'], ['Solana'], 'Digital art marketplace for creators and collectors.', 'https://exchange.art', 'https://exchange.art/marketplace', 2021, 'United States', 'n/a', 'https://x.com/exchgART'],

  ['Xterio', 'Gaming', ['Gaming'], ['BNB Chain', 'Ethereum'], 'Gaming publisher and ecosystem with web3 assets.', 'https://xter.io', 'https://xter.io/games', 2022, 'Switzerland', 'XTER', 'https://x.com/XterioGames'],
  ['GUNZ', 'Gaming', ['Gaming', 'Layer 1 / Layer 2'], ['Avalanche'], 'Gaming chain and ecosystem by Gunzilla Games.', 'https://gunzillagames.com', 'https://gunzillagames.com/gunz', 2024, 'Germany', 'GUN', 'https://x.com/GunzillaGames'],
  ['Matr1x', 'Gaming', ['Gaming'], ['Ethereum'], 'Esports and shooter-focused web3 gaming ecosystem.', 'https://matr1x.io', 'https://matr1x.io/games', 2022, 'Singapore', 'MAX', 'https://x.com/Matr1xOfficial']
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

