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
  ['Sushi', 'DeFi', ['DeFi', 'DEX'], ['Ethereum', 'Arbitrum', 'Polygon'], 'Multi-chain decentralized exchange and liquidity protocol.', 'https://www.sushi.com', 'https://www.sushi.com/swap', 2020, 'Metaverse', 'SUSHI', 'https://x.com/SushiSwap'],
  ['Bancor', 'DeFi', ['DeFi', 'DEX'], ['Ethereum'], 'Automated market maker protocol for onchain token trading.', 'https://www.bancor.network', 'https://app.bancor.network', 2017, 'Switzerland', 'BNT', 'https://x.com/Bancor'],
  ['Venus Protocol', 'DeFi', ['DeFi', 'Lending'], ['BNB Chain'], 'Decentralized money market and stablecoin protocol.', 'https://venus.io', 'https://app.venus.io', 2020, 'Metaverse', 'XVS', 'https://x.com/VenusProtocol'],
  ['BENQI', 'DeFi', ['DeFi', 'Lending'], ['Avalanche'], 'Lending, borrowing, and liquid staking protocol on Avalanche.', 'https://benqi.fi', 'https://app.benqi.fi', 2021, 'Metaverse', 'QI', 'https://x.com/BenqiFinance'],
  ['Radiant Capital', 'DeFi', ['DeFi', 'Lending'], ['Arbitrum', 'BNB Chain'], 'Cross-chain lending and borrowing protocol.', 'https://radiant.capital', 'https://app.radiant.capital', 2022, 'Metaverse', 'RDNT', 'https://x.com/RDNTCapital'],
  ['Rocket Pool', 'DeFi', ['DeFi', 'Staking'], ['Ethereum'], 'Decentralized Ethereum staking network with liquid staking token.', 'https://rocketpool.net', 'https://stake.rocketpool.net', 2017, 'Australia', 'RPL', 'https://x.com/Rocket_Pool'],
  ['Frax Finance', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum', 'Base'], 'Stablecoin and DeFi protocol ecosystem with multiple products.', 'https://frax.finance', 'https://app.frax.finance', 2020, 'Metaverse', 'FXS', 'https://x.com/fraxfinance'],
  ['Liquity', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum'], 'Borrowing protocol for collateralized stablecoin issuance.', 'https://www.liquity.org', 'https://app.liquity.org', 2021, 'Metaverse', 'LQTY', 'https://x.com/LiquityProtocol'],
  ['Notional Finance', 'DeFi', ['DeFi', 'Yield'], ['Ethereum', 'Arbitrum'], 'Fixed-rate DeFi lending and borrowing protocol.', 'https://notional.finance', 'https://app.notional.finance', 2020, 'United States', 'NOTE', 'https://x.com/notionalfinance'],
  ['Maple', 'DeFi', ['DeFi', 'Lending'], ['Ethereum'], 'Onchain credit marketplace for institutional borrowers and lenders.', 'https://maple.finance', 'https://app.maple.finance', 2021, 'Australia', 'SYRUP', 'https://x.com/maplefinance'],
  ['Sei Foundation', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Sei'], 'Foundation supporting Sei ecosystem growth and development.', 'https://www.sei.io', 'https://www.sei.io/developers', 2023, 'United States', 'SEI', 'https://x.com/SeiNetwork'],
  ['Celestia', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Celestia'], 'Modular data availability network for scalable blockchains.', 'https://celestia.org', 'https://docs.celestia.org', 2023, 'Switzerland', 'TIA', 'https://x.com/CelestiaOrg'],
  ['Berachain Foundation', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Berachain'], 'Ecosystem steward for Berachain network development.', 'https://www.berachain.com', 'https://www.berachain.com/ecosystem', 2024, 'Cayman Islands', 'BERA', 'https://x.com/berachain'],
  ['Scroll', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Zero Knowledge'], ['Scroll', 'Ethereum'], 'ZK rollup network focused on Ethereum compatibility.', 'https://scroll.io', 'https://scroll.io/bridge', 2021, 'United States', 'n/a', 'https://x.com/Scroll_ZKP'],
  ['Linea', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Zero Knowledge'], ['Linea', 'Ethereum'], 'Ethereum L2 ecosystem built with zkEVM technology.', 'https://linea.build', 'https://linea.build/developers', 2023, 'United States', 'n/a', 'https://x.com/LineaBuild'],
  ['Mantle', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Mantle', 'Ethereum'], 'Ethereum scaling ecosystem with governance and treasury tooling.', 'https://www.mantle.xyz', 'https://www.mantle.xyz/ecosystem', 2023, 'Metaverse', 'MNT', 'https://x.com/Mantle_Official'],
  ['Base', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Base', 'Ethereum'], 'Ethereum L2 ecosystem incubated by Coinbase for onchain apps.', 'https://base.org', 'https://base.org/build', 2023, 'United States', 'n/a', 'https://x.com/base'],
  ['zkLink', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Zero Knowledge'], ['Ethereum', 'Multiple'], 'ZK-based interoperability and scaling stack for multi-chain apps.', 'https://zk.link', 'https://zk.link/products', 2021, 'Singapore', 'ZKL', 'https://x.com/zkLink_Official'],
  ['Injective', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'DeFi'], ['Injective'], 'Layer 1 focused on financial applications and onchain trading.', 'https://injective.com', 'https://injective.com/ecosystem', 2021, 'United States', 'INJ', 'https://x.com/injective'],
  ['Kava', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'DeFi'], ['Kava'], 'Cosmos-based network and DeFi ecosystem.', 'https://www.kava.io', 'https://www.kava.io/ecosystem', 2018, 'United States', 'KAVA', 'https://x.com/KAVA_CHAIN'],
  ['Binance Wallet', 'Wallets', ['Wallets'], ['BNB Chain', 'Ethereum'], 'Self-custody wallet for interacting with multi-chain web3 apps.', 'https://www.binance.com/en/web3wallet', 'https://www.binance.com/en/web3wallet', 2023, 'United Arab Emirates', 'n/a', 'https://x.com/binance'],
  ['Coinbase Wallet', 'Wallets', ['Wallets'], ['Ethereum', 'Base', 'Multiple'], 'Consumer self-custody wallet for multi-chain assets and apps.', 'https://www.coinbase.com/wallet', 'https://www.coinbase.com/wallet/downloads', 2018, 'United States', 'n/a', 'https://x.com/CoinbaseWallet'],
  ['OKX Wallet', 'Wallets', ['Wallets'], ['Ethereum', 'Solana', 'Multiple'], 'Multi-chain wallet and web3 discovery interface.', 'https://www.okx.com/web3', 'https://www.okx.com/web3/wallet', 2022, 'Seychelles', 'n/a', 'https://x.com/okxweb3'],
  ['Keplr', 'Wallets', ['Wallets'], ['Cosmos'], 'Wallet and staking interface for Cosmos ecosystem users.', 'https://www.keplr.app', 'https://www.keplr.app/download', 2021, 'South Korea', 'n/a', 'https://x.com/keplrwallet'],
  ['Leap Wallet', 'Wallets', ['Wallets'], ['Cosmos'], 'Cosmos ecosystem wallet for users and validators.', 'https://www.leapwallet.io', 'https://www.leapwallet.io/download', 2022, 'India', 'n/a', 'https://x.com/leap_wallet'],
  ['MathWallet', 'Wallets', ['Wallets'], ['Ethereum', 'Solana', 'Multiple'], 'Multi-chain wallet for mobile, browser, and hardware integrations.', 'https://mathwallet.org', 'https://mathwallet.org/en-us/download', 2017, 'Singapore', 'n/a', 'https://x.com/MathWallet'],
  ['NuFi', 'Wallets', ['Wallets'], ['Cardano', 'Solana'], 'Multi-chain self-custody wallet and staking platform.', 'https://nu.fi', 'https://nu.fi/download', 2021, 'Slovakia', 'n/a', 'https://x.com/NuFiWallet'],
  ['XDEFI Wallet', 'Wallets', ['Wallets'], ['Bitcoin', 'Ethereum', 'Solana'], 'Browser wallet with broad chain support and DeFi integrations.', 'https://xdefi.io', 'https://xdefi.io/download', 2020, 'United Kingdom', 'n/a', 'https://x.com/xdefi_wallet'],
  ['Pocket Network', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Multiple'], 'Decentralized RPC infrastructure for blockchain applications.', 'https://www.pokt.network', 'https://www.pokt.network/builders', 2020, 'United States', 'POKT', 'https://x.com/POKTnetwork'],
  ['Chainbase', 'Infrastructure', ['Infrastructure', 'Data & Analytics'], ['Ethereum', 'Solana', 'Multiple'], 'Data infrastructure platform for blockchain indexing and APIs.', 'https://chainbase.com', 'https://chainbase.com/product', 2021, 'Singapore', 'n/a', 'https://x.com/ChainbaseHQ'],
  ['Subsquid', 'Infrastructure', ['Infrastructure', 'Data & Analytics'], ['Ethereum', 'Arbitrum', 'Multiple'], 'Open data indexing stack for web3 developers.', 'https://subsquid.io', 'https://docs.subsquid.io', 2021, 'United Kingdom', 'SQD', 'https://x.com/subsquid'],
  ['Space and Time', 'Infrastructure', ['Infrastructure', 'Data & Analytics'], ['Ethereum', 'Multiple'], 'Decentralized data warehouse and query infrastructure for web3.', 'https://www.spaceandtime.io', 'https://www.spaceandtime.io/developers', 2022, 'United States', 'n/a', 'https://x.com/SpaceandTimeDB'],
  ['NodeReal', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['BNB Chain', 'Ethereum'], 'Node and API infrastructure provider for developers.', 'https://nodereal.io', 'https://nodereal.io/products', 2021, 'Singapore', 'n/a', 'https://x.com/Nodereal_io'],
  ['Bware Labs', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Polygon', 'Multiple'], 'Blockchain API and node provider for decentralized applications.', 'https://bwarelabs.com', 'https://bwarelabs.com/blast', 2021, 'Romania', 'INFRA', 'https://x.com/BwareLabs'],
  ['Caldera', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum'], 'Rollup platform for launching app-specific chains.', 'https://www.caldera.xyz', 'https://www.caldera.xyz/product', 2022, 'United States', 'n/a', 'https://x.com/Calderaxyz'],
  ['Conduit', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum'], 'Developer platform for deploying and managing rollups.', 'https://conduit.xyz', 'https://conduit.xyz/product', 2023, 'United States', 'n/a', 'https://x.com/conduitxyz'],
  ['Gelato Web3 Functions', 'Developer Tools', ['Developer Tools', 'Automation'], ['Ethereum', 'Polygon', 'Arbitrum'], 'Smart contract automation and execution tooling for developers.', 'https://www.gelato.network/web3-functions', 'https://docs.gelato.network/web3-services/web3-functions', 2021, 'Germany', 'n/a', 'https://x.com/GelatoNetwork'],
  ['Blockscout', 'Developer Tools', ['Developer Tools', 'Infrastructure'], ['Ethereum', 'Multiple'], 'Open-source blockchain explorer stack for EVM chains.', 'https://www.blockscout.com', 'https://docs.blockscout.com', 2021, 'United States', 'n/a', 'https://x.com/blockscoutcom'],
  ['Tenderly Web3 Actions', 'Developer Tools', ['Developer Tools', 'Infrastructure'], ['Ethereum', 'Base', 'Arbitrum'], 'Backend automation and simulation tooling for web3 developers.', 'https://tenderly.co', 'https://docs.tenderly.co', 2022, 'Serbia', 'n/a', 'https://x.com/TenderlyApp'],
  ['Cyfrin', 'Security', ['Security', 'Developer Tools'], ['Ethereum'], 'Smart contract security training, tooling, and audit services.', 'https://www.cyfrin.io', 'https://www.cyfrin.io/audits', 2023, 'United States', 'n/a', 'https://x.com/CyfrinAudits'],
  ['Zellic', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Solana', 'Multiple'], 'Security research and smart contract auditing firm.', 'https://www.zellic.io', 'https://www.zellic.io/services', 2021, 'United States', 'n/a', 'https://x.com/zellic_io'],
  ['Spearbit', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Distributed security review network for blockchain projects.', 'https://spearbit.com', 'https://cantina.xyz', 2021, 'United States', 'n/a', 'https://x.com/spearbitdao'],
  ['OtterSec', 'Security', ['Security', 'Auditing'], ['Solana', 'Ethereum'], 'Security audits and research for smart contracts and protocols.', 'https://osec.io', 'https://osec.io/services', 2022, 'United States', 'n/a', 'https://x.com/osec_io'],
  ['Code4rena', 'Security', ['Security', 'Bug Bounty'], ['Ethereum', 'Multiple'], 'Competitive audit platform for smart contract security reviews.', 'https://code4rena.com', 'https://code4rena.com/contests', 2021, 'United States', 'n/a', 'https://x.com/code4rena'],
  ['Cantina', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Security marketplace connecting projects with audit experts.', 'https://cantina.xyz', 'https://cantina.xyz/for-projects', 2023, 'United States', 'n/a', 'https://x.com/cantinaxyz'],
  ['Coin Metrics', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional crypto market and network data provider.', 'https://coinmetrics.io', 'https://coinmetrics.io/product', 2017, 'United States', 'n/a', 'https://x.com/coinmetrics'],
  ['CryptoQuant', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Onchain and exchange flow analytics platform.', 'https://cryptoquant.com', 'https://cryptoquant.com/asset', 2019, 'South Korea', 'n/a', 'https://x.com/cryptoquant_com'],
  ['Kaiko', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Ethereum', 'Multiple'], 'Digital asset market data provider for institutional workflows.', 'https://www.kaiko.com', 'https://www.kaiko.com/products', 2014, 'France', 'n/a', 'https://x.com/KaikoData'],
  ['IntoTheBlock', 'Data & Analytics', ['Data & Analytics', 'Intelligence'], ['Ethereum', 'Multiple'], 'Onchain intelligence and DeFi analytics tools.', 'https://app.intotheblock.com', 'https://app.intotheblock.com', 2018, 'United States', 'n/a', 'https://x.com/intotheblock'],
  ['Nexo', 'Payments', ['Payments', 'Lending'], ['Ethereum', 'Bitcoin'], 'Digital asset platform for payments, lending, and trading.', 'https://nexo.com', 'https://nexo.com/products', 2018, 'Switzerland', 'NEXO', 'https://x.com/Nexo'],
  ['Crypto.com', 'Payments', ['Payments', 'Exchange'], ['Ethereum', 'Cronos', 'Bitcoin'], 'Consumer crypto platform with payments, cards, and exchange products.', 'https://crypto.com', 'https://crypto.com/app', 2016, 'Singapore', 'CRO', 'https://x.com/cryptocom'],
  ['Binance', 'Payments', ['Payments', 'Exchange'], ['BNB Chain', 'Ethereum', 'Bitcoin'], 'Global crypto platform with exchange, custody, and payments products.', 'https://www.binance.com', 'https://www.binance.com/en/pay', 2017, 'United Arab Emirates', 'BNB', 'https://x.com/binance'],
  ['OKX', 'Payments', ['Payments', 'Exchange'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Crypto exchange and web3 products including wallet and trading services.', 'https://www.okx.com', 'https://www.okx.com/trade-spot', 2017, 'Seychelles', 'OKB', 'https://x.com/okx'],
  ['Bybit', 'Payments', ['Payments', 'Exchange'], ['Ethereum', 'Bitcoin'], 'Crypto trading and asset platform with global derivatives and spot markets.', 'https://www.bybit.com', 'https://www.bybit.com/trade/usdt/BTCUSDT', 2018, 'United Arab Emirates', 'n/a', 'https://x.com/Bybit_Official'],
  ['Bitstamp', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum'], 'Long-running crypto exchange and institutional trading venue.', 'https://www.bitstamp.net', 'https://www.bitstamp.net/trade', 2011, 'United Kingdom', 'n/a', 'https://x.com/Bitstamp'],
  ['Gemini', 'Payments', ['Payments', 'Custody'], ['Bitcoin', 'Ethereum'], 'Crypto platform for exchange, custody, and payment infrastructure.', 'https://www.gemini.com', 'https://www.gemini.com/active-trader', 2014, 'United States', 'n/a', 'https://x.com/Gemini'],
  ['Bitfinex', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum'], 'Global digital asset trading platform.', 'https://www.bitfinex.com', 'https://trading.bitfinex.com', 2012, 'British Virgin Islands', 'LEO', 'https://x.com/bitfinex'],
  ['KuCoin', 'Payments', ['Payments', 'Exchange'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Global exchange platform with spot, derivatives, and bot products.', 'https://www.kucoin.com', 'https://www.kucoin.com/trade/BTC-USDT', 2017, 'Seychelles', 'KCS', 'https://x.com/kucoincom'],
  ['Gate.io', 'Payments', ['Payments', 'Exchange'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Crypto exchange and digital asset market platform.', 'https://www.gate.io', 'https://www.gate.io/trade/BTC_USDT', 2013, 'Cayman Islands', 'GT', 'https://x.com/gate_io'],
  ['HTX', 'Payments', ['Payments', 'Exchange'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Digital asset exchange and market platform.', 'https://www.htx.com', 'https://www.htx.com/en-us/trade/btc_usdt', 2013, 'Seychelles', 'HT', 'https://x.com/HTX_Global'],
  ['Bitget', 'Payments', ['Payments', 'Exchange'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Exchange platform focused on spot and derivatives markets.', 'https://www.bitget.com', 'https://www.bitget.com/spot/BTCUSDT', 2018, 'Seychelles', 'BGB', 'https://x.com/bitgetglobal'],
  ['MEXC', 'Payments', ['Payments', 'Exchange'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Global crypto exchange for spot and futures trading.', 'https://www.mexc.com', 'https://www.mexc.com/exchange/BTC_USDT', 2018, 'Seychelles', 'MX', 'https://x.com/MEXC_Official'],
  ['Hex Trust', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional custody platform for digital assets.', 'https://hextrust.com', 'https://hextrust.com/solutions', 2018, 'Hong Kong', 'n/a', 'https://x.com/Hex_Trust'],
  ['Komainu', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional-grade digital asset custody provider.', 'https://www.komainu.com', 'https://www.komainu.com/services', 2018, 'Jersey', 'n/a', 'https://x.com/komainuhq'],
  ['Taurus', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Enterprise digital asset custody and tokenization infrastructure.', 'https://www.taurusgroup.ch', 'https://www.taurusgroup.ch/products', 2018, 'Switzerland', 'n/a', 'https://x.com/Taurus_HQ'],
  ['Metaco', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional digital asset custody technology provider.', 'https://metaco.com', 'https://metaco.com/platform', 2015, 'Switzerland', 'n/a', 'https://x.com/MetacoSA'],
  ['Bitpanda Custody', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Custody services for institutional digital asset clients.', 'https://www.bitpanda.com/en/custody', 'https://www.bitpanda.com/en/custody', 2021, 'Austria', 'n/a', 'https://x.com/Bitpanda_global'],
  ['Gitcoin Passport', 'Identity', ['Identity', 'DAOs & Governance'], ['Ethereum', 'Multiple'], 'Reputation and identity credential system for sybil resistance.', 'https://passport.gitcoin.co', 'https://support.passport.xyz', 2022, 'United States', 'n/a', 'https://x.com/gitcoinpassport'],
  ['BrightID', 'Identity', ['Identity'], ['Ethereum'], 'Social verification protocol for unique human identity.', 'https://www.brightid.org', 'https://www.brightid.org/apps', 2019, 'Metaverse', 'n/a', 'https://x.com/BrightIDProject'],
  ['Holonym', 'Identity', ['Identity', 'Zero Knowledge'], ['Ethereum'], 'Privacy-preserving identity infrastructure using zero-knowledge proofs.', 'https://holonym.id', 'https://holonym.id/products', 2022, 'United States', 'n/a', 'https://x.com/holonymid'],
  ['Privado ID', 'Identity', ['Identity', 'Zero Knowledge'], ['Polygon', 'Ethereum'], 'Self-sovereign identity tools based on zk credential verification.', 'https://www.privado.id', 'https://www.privado.id/developers', 2023, 'Spain', 'n/a', 'https://x.com/PrivadoID'],
  ['Securitize', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'Infrastructure'], ['Ethereum', 'Polygon'], 'Tokenization platform for regulated real-world securities and funds.', 'https://www.securitize.io', 'https://www.securitize.io/platform', 2017, 'United States', 'n/a', 'https://x.com/Securitize'],
  ['Tokeny', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'Infrastructure'], ['Ethereum'], 'Institutional tokenization platform for compliant digital assets.', 'https://tokeny.com', 'https://tokeny.com/platform', 2017, 'Luxembourg', 'n/a', 'https://x.com/TokenySolutions'],
  ['Polymesh Association', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'Layer 1 / Layer 2'], ['Polymesh'], 'Association supporting security-token focused Polymesh network.', 'https://polymesh.network', 'https://polymesh.network/ecosystem', 2021, 'Switzerland', 'POLYX', 'https://x.com/PolymeshNetwork'],
  ['Backed', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'DeFi'], ['Ethereum'], 'Issuer of tokenized real-world financial assets.', 'https://backed.fi', 'https://backed.fi/products', 2021, 'Switzerland', 'n/a', 'https://x.com/BackedFi'],
  ['Swarm Markets', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'DeFi'], ['Ethereum'], 'Regulated DeFi venue for tokenized real-world assets.', 'https://swarm.com', 'https://app.swarm.com', 2021, 'Germany', 'SMT', 'https://x.com/SwarmMarkets'],
  ['DAOhaus', 'DAOs & Governance', ['DAOs & Governance'], ['Ethereum', 'Gnosis'], 'DAO launch and management toolkit for community organizations.', 'https://daohaus.club', 'https://app.daohaus.club', 2020, 'Metaverse', 'n/a', 'https://x.com/DAOhaus'],
  ['Colony', 'DAOs & Governance', ['DAOs & Governance'], ['Ethereum'], 'DAO coordination framework for teams and contributors.', 'https://colony.io', 'https://colony.io/colony-network', 2017, 'United Kingdom', 'CLNY', 'https://x.com/JoinColony'],
  ['Juicebox', 'DAOs & Governance', ['DAOs & Governance', 'Developer Tools'], ['Ethereum'], 'Treasury and fundraising protocol for onchain communities.', 'https://juicebox.money', 'https://juicebox.money/app', 2021, 'Metaverse', 'n/a', 'https://x.com/juiceboxETH'],
  ['CharmVerse', 'DAOs & Governance', ['DAOs & Governance', 'Developer Tools'], ['Ethereum', 'Multiple'], 'Operating system for community and DAO collaboration workflows.', 'https://charmverse.io', 'https://app.charmverse.io', 2021, 'United States', 'n/a', 'https://x.com/charmverse'],
  ['Guild', 'DAOs & Governance', ['DAOs & Governance', 'Identity'], ['Ethereum', 'Multiple'], 'Token-gated membership and role management infrastructure.', 'https://guild.xyz', 'https://guild.xyz/explore', 2021, 'Hungary', 'n/a', 'https://x.com/guildxyz'],
  ['Questbook', 'DAOs & Governance', ['DAOs & Governance', 'Infrastructure'], ['Ethereum', 'Arbitrum'], 'Grant allocation and governance tooling for ecosystems and DAOs.', 'https://questbook.app', 'https://questbook.app/dashboard', 2021, 'India', 'n/a', 'https://x.com/questbookapp'],
  ['Scaffold-ETH', 'Developer Tools', ['Developer Tools'], ['Ethereum'], 'Open-source starter stack for Ethereum smart contract apps.', 'https://scaffoldeth.io', 'https://docs.scaffoldeth.io', 2022, 'Metaverse', 'n/a', 'https://x.com/scaffoldeth'],
  ['RainbowKit', 'Developer Tools', ['Developer Tools', 'Wallets'], ['Ethereum'], 'Wallet connection UI toolkit for EVM applications.', 'https://www.rainbowkit.com', 'https://www.rainbowkit.com/docs/introduction', 2022, 'United States', 'n/a', 'https://x.com/rainbowdotme'],
  ['Wagmi', 'Developer Tools', ['Developer Tools'], ['Ethereum'], 'React hooks library for Ethereum app development.', 'https://wagmi.sh', 'https://wagmi.sh/react/getting-started', 2022, 'Metaverse', 'n/a', 'https://x.com/wagmi_sh'],
  ['Viem', 'Developer Tools', ['Developer Tools'], ['Ethereum'], 'TypeScript interface for EVM JSON-RPC and wallet interactions.', 'https://viem.sh', 'https://viem.sh/docs/getting-started', 2023, 'Metaverse', 'n/a', 'https://x.com/wagmi_sh'],
  ['Etherscan', 'Developer Tools', ['Developer Tools', 'Data & Analytics'], ['Ethereum'], 'Block explorer and contract verification platform for Ethereum.', 'https://etherscan.io', 'https://docs.etherscan.io', 2015, 'Malaysia', 'n/a', 'https://x.com/etherscan'],
  ['Polygonscan', 'Developer Tools', ['Developer Tools', 'Data & Analytics'], ['Polygon'], 'Block explorer and developer APIs for Polygon network.', 'https://polygonscan.com', 'https://docs.polygonscan.com', 2021, 'Malaysia', 'n/a', 'https://x.com/polygonscan'],
  ['Basescan', 'Developer Tools', ['Developer Tools', 'Data & Analytics'], ['Base'], 'Block explorer and API platform for Base network.', 'https://basescan.org', 'https://docs.basescan.org', 2023, 'Malaysia', 'n/a', 'https://x.com/base'],
  ['Arbiscan', 'Developer Tools', ['Developer Tools', 'Data & Analytics'], ['Arbitrum'], 'Block explorer and APIs for Arbitrum chain activity.', 'https://arbiscan.io', 'https://docs.arbiscan.io', 2021, 'Malaysia', 'n/a', 'https://x.com/arbitrum'],
  ['Solscan', 'Developer Tools', ['Developer Tools', 'Data & Analytics'], ['Solana'], 'Explorer and analytics interface for Solana activity.', 'https://solscan.io', 'https://info.solscan.io', 2021, 'Singapore', 'n/a', 'https://x.com/solscanofficial'],
  ['Animoca Brands', 'Gaming', ['Gaming', 'NFTs & Creator Economy'], ['Ethereum', 'Multiple'], 'Web3 gaming and digital property company with broad portfolio exposure.', 'https://www.animocabrands.com', 'https://www.animocabrands.com/portfolio', 2014, 'Hong Kong', 'n/a', 'https://x.com/animocabrands'],
  ['The Sandbox', 'Gaming', ['Gaming', 'NFTs & Creator Economy'], ['Ethereum', 'Polygon'], 'Virtual world platform with user-created experiences and digital assets.', 'https://www.sandbox.game', 'https://www.sandbox.game/en/create', 2018, 'Hong Kong', 'SAND', 'https://x.com/TheSandboxGame'],
  ['Decentraland Foundation', 'Gaming', ['Gaming', 'Metaverse'], ['Ethereum'], 'Stewardship organization for the Decentraland virtual world ecosystem.', 'https://decentraland.org', 'https://play.decentraland.org', 2017, 'Argentina', 'MANA', 'https://x.com/decentraland'],
  ['Dapper Labs', 'Gaming', ['Gaming', 'NFTs & Creator Economy'], ['Flow', 'Ethereum'], 'Company behind Flow and consumer blockchain collectibles products.', 'https://www.dapperlabs.com', 'https://flow.com', 2018, 'Canada', 'FLOW', 'https://x.com/dapperlabs'],
  ['Ronin', 'Gaming', ['Gaming', 'Layer 1 / Layer 2'], ['Ronin'], 'Gaming-focused blockchain ecosystem with consumer titles and assets.', 'https://roninchain.com', 'https://wallet.roninchain.com', 2021, 'Singapore', 'RON', 'https://x.com/Ronin_Network'],
  ['Illuvium', 'Gaming', ['Gaming'], ['Ethereum'], 'Web3 game ecosystem with interoperable assets and token economy.', 'https://illuvium.io', 'https://illuvium.io/game', 2021, 'Australia', 'ILV', 'https://x.com/illuviumio'],
  ['Gala Games', 'Gaming', ['Gaming'], ['GalaChain', 'Ethereum'], 'Gaming arm of Gala ecosystem focused on blockchain-native titles.', 'https://games.gala.com', 'https://games.gala.com', 2019, 'United States', 'GALA', 'https://x.com/GoGalaGames'],
  ['Pudgy Penguins', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Consumer Brands'], ['Ethereum'], 'Consumer brand and NFT ecosystem with collectibles and media expansion.', 'https://www.pudgypenguins.com', 'https://www.pudgypenguins.com/collections', 2021, 'United States', 'n/a', 'https://x.com/pudgypenguins'],
  ['Nifty Gateway', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Marketplace'], ['Ethereum'], 'Curated NFT marketplace for creator and brand drops.', 'https://www.niftygateway.com', 'https://www.niftygateway.com/marketplace', 2018, 'United States', 'n/a', 'https://x.com/niftygateway'],
  ['LooksRare', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Marketplace'], ['Ethereum'], 'NFT marketplace and trading rewards ecosystem.', 'https://looksrare.org', 'https://looksrare.org', 2022, 'Metaverse', 'LOOKS', 'https://x.com/LooksRare'],
  ['Blur', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Marketplace'], ['Ethereum'], 'High-liquidity NFT marketplace focused on advanced traders.', 'https://blur.io', 'https://blur.io', 2022, 'United States', 'BLUR', 'https://x.com/blur_io'],
  ['Async Art', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Ethereum'], 'Programmable art marketplace and creator platform.', 'https://async.art', 'https://async.art/market', 2020, 'United States', 'n/a', 'https://x.com/AsyncArt'],
  ['KnownOrigin', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Marketplace'], ['Ethereum'], 'Curated NFT marketplace for digital artists and collectors.', 'https://knownorigin.io', 'https://knownorigin.io/gallery', 2018, 'United Kingdom', 'n/a', 'https://x.com/KnownOrigin_io'],
  ['Moonbeam', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Polkadot'], 'Smart contract platform in the Polkadot ecosystem.', 'https://moonbeam.network', 'https://moonbeam.network/build', 2022, 'United States', 'GLMR', 'https://x.com/MoonbeamNetwork'],
  ['Moonriver', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Kusama'], 'Canary network for Moonbeam-compatible smart contracts.', 'https://moonbeam.network/networks/moonriver', 'https://moonbeam.network/networks/moonriver', 2021, 'United States', 'MOVR', 'https://x.com/MoonbeamNetwork']
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

