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
  ['Premia', 'DeFi', ['DeFi', 'Derivatives'], ['Ethereum', 'Arbitrum'], 'Onchain options and derivatives protocol.', 'https://premia.finance', 'https://app.premia.finance', 2021, 'Metaverse', 'PREMIA', 'https://x.com/PremiaFinance'],
  ['Lyra', 'DeFi', ['DeFi', 'Derivatives'], ['Optimism', 'Base'], 'Decentralized options protocol and liquidity layer.', 'https://www.lyra.finance', 'https://app.lyra.finance', 2021, 'Metaverse', 'LYRA', 'https://x.com/lyrafinance'],
  ['Hegic', 'DeFi', ['DeFi', 'Derivatives'], ['Ethereum', 'Arbitrum'], 'Onchain options trading protocol.', 'https://www.hegic.co', 'https://www.hegic.co/options', 2020, 'Metaverse', 'HEGIC', 'https://x.com/HegicOptions'],
  ['WOOFi', 'DeFi', ['DeFi', 'DEX'], ['Ethereum', 'Arbitrum', 'BNB Chain'], 'Cross-chain liquidity and swap protocol.', 'https://fi.woo.org', 'https://fi.woo.org/swap', 2021, 'Hong Kong', 'WOO', 'https://x.com/_WOOFi'],
  ['dForce', 'DeFi', ['DeFi', 'Lending'], ['Ethereum', 'Arbitrum', 'Optimism'], 'DeFi protocol suite including lending and stable assets.', 'https://dforce.network', 'https://app.dforce.network', 2019, 'Singapore', 'DF', 'https://x.com/dForcenet'],
  ['Abracadabra', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum', 'Arbitrum'], 'Lending and stablecoin protocol centered on MIM.', 'https://abracadabra.money', 'https://abracadabra.money/borrow', 2021, 'Metaverse', 'SPELL', 'https://x.com/MIM_Spell'],
  ['Tranchess', 'DeFi', ['DeFi', 'Yield'], ['BNB Chain', 'Ethereum'], 'Asset management and structured yield protocol.', 'https://tranchess.com', 'https://tranchess.com/app', 2021, 'Singapore', 'CHESS', 'https://x.com/tranchess'],
  ['Smardex', 'DeFi', ['DeFi', 'DEX'], ['Ethereum', 'Arbitrum'], 'AMM DEX with anti-impermanent-loss design.', 'https://smardex.io', 'https://smardex.io/swap', 2023, 'France', 'SDEX', 'https://x.com/SmarDex'],
  ['Stella', 'DeFi', ['DeFi', 'Leverage'], ['Arbitrum'], 'Leverage and strategy protocol for DeFi users.', 'https://www.stella.org', 'https://www.stella.org/app', 2023, 'Metaverse', 'ALPHA', 'https://x.com/StellaStrategy'],
  ['Ribbon Finance', 'DeFi', ['DeFi', 'Yield'], ['Ethereum'], 'Structured products and options-based yield strategies.', 'https://www.ribbon.finance', 'https://www.ribbon.finance/vaults', 2021, 'United States', 'RBN', 'https://x.com/ribbonfinance'],
  ['Opyn', 'DeFi', ['DeFi', 'Derivatives'], ['Ethereum'], 'Options infrastructure and risk primitives for DeFi.', 'https://www.opyn.co', 'https://www.opyn.co/products', 2019, 'United States', 'n/a', 'https://x.com/opyn_'],
  ['Notifi', 'DeFi', ['DeFi', 'Infrastructure'], ['Ethereum', 'Solana', 'Multiple'], 'Web3 alerts and communication infrastructure for traders.', 'https://notifi.network', 'https://notifi.network/products', 2021, 'United States', 'n/a', 'https://x.com/notifi_network'],

  ['Conflux', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Conflux'], 'Public blockchain ecosystem with hybrid PoW/PoS design.', 'https://confluxnetwork.org', 'https://confluxnetwork.org/ecosystem', 2018, 'China', 'CFX', 'https://x.com/Conflux_Network'],
  ['IoTeX', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'DePIN'], ['IoTeX'], 'Blockchain ecosystem for machine economy and DePIN.', 'https://iotex.io', 'https://iotex.io/ecosystem', 2018, 'United States', 'IOTX', 'https://x.com/iotex_io'],
  ['Telos', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Telos'], 'EVM-compatible L1 ecosystem and governance network.', 'https://www.telos.net', 'https://www.telos.net/ecosystem', 2018, 'United States', 'TLOS', 'https://x.com/HelloTelos'],
  ['Viction', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Viction'], 'EVM blockchain ecosystem formerly known as TomoChain.', 'https://viction.xyz', 'https://viction.xyz/ecosystem', 2023, 'Singapore', 'VIC', 'https://x.com/VictionPlatform'],
  ['Kroma', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Zero Knowledge'], ['Ethereum'], 'ZK rollup ecosystem for Ethereum applications.', 'https://kroma.network', 'https://kroma.network/build', 2023, 'South Korea', 'KRO', 'https://x.com/kroma_network'],
  ['Story Protocol', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'NFTs & Creator Economy'], ['Story'], 'IP-focused blockchain ecosystem for programmable licensing.', 'https://story.foundation', 'https://story.foundation/ecosystem', 2024, 'United States', 'IP', 'https://x.com/storyprotocol'],
  ['Lens Chain', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Identity'], ['Lens'], 'Social-focused chain for Lens ecosystem applications.', 'https://lens.xyz', 'https://lens.xyz/build', 2024, 'Metaverse', 'n/a', 'https://x.com/lensprotocol'],
  ['RARI Chain', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'NFTs & Creator Economy'], ['Ethereum'], 'Creator-centric L2 chain from Rarible ecosystem.', 'https://rari.foundation', 'https://rari.foundation/chain', 2024, 'United States', 'RARI', 'https://x.com/rarible'],
  ['opBNB', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['BNB Chain'], 'Optimistic rollup ecosystem anchored to BNB Chain.', 'https://opbnb.bnbchain.org', 'https://opbnb.bnbchain.org/en', 2023, 'United Arab Emirates', 'BNB', 'https://x.com/BNBCHAIN'],
  ['zkFair', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Zero Knowledge'], ['Ethereum'], 'Community-focused ZK rollup ecosystem.', 'https://zkfair.io', 'https://zkfair.io/ecosystem', 2024, 'Metaverse', 'ZKF', 'https://x.com/ZKFCommunity'],

  ['deBridge', 'Infrastructure', ['Infrastructure', 'Cross-chain'], ['Ethereum', 'Solana', 'Multiple'], 'Cross-chain interoperability and messaging infrastructure.', 'https://debridge.finance', 'https://app.debridge.finance', 2021, 'Estonia', 'DBR', 'https://x.com/deBridgeFinance'],
  ['LI.FI', 'Infrastructure', ['Infrastructure', 'Cross-chain'], ['Ethereum', 'Multiple'], 'Aggregation layer for cross-chain swaps and bridges.', 'https://li.fi', 'https://li.fi/products', 2021, 'Germany', 'n/a', 'https://x.com/lifiprotocol'],
  ['LayerSwap', 'Infrastructure', ['Infrastructure', 'Cross-chain'], ['Ethereum', 'Arbitrum', 'Base'], 'Cross-chain transfer infrastructure for exchanges and L2s.', 'https://www.layerswap.io', 'https://www.layerswap.io/app', 2022, 'United Kingdom', 'n/a', 'https://x.com/layerswap'],
  ['Pinata', 'Infrastructure', ['Infrastructure', 'Storage'], ['IPFS'], 'IPFS media and file infrastructure for web3 builders.', 'https://www.pinata.cloud', 'https://www.pinata.cloud/products', 2018, 'United States', 'n/a', 'https://x.com/pinatacloud'],
  ['web3.storage', 'Infrastructure', ['Infrastructure', 'Storage'], ['IPFS', 'Filecoin'], 'Developer storage platform for IPFS and Filecoin.', 'https://web3.storage', 'https://web3.storage/docs', 2021, 'United States', 'n/a', 'https://x.com/web3_storage'],
  ['nft.storage', 'Infrastructure', ['Infrastructure', 'Storage'], ['IPFS', 'Filecoin'], 'NFT media storage and retrieval tooling.', 'https://nft.storage', 'https://nft.storage/docs', 2021, 'United States', 'n/a', 'https://x.com/nft_storage'],
  ['Lighthouse', 'Infrastructure', ['Infrastructure', 'Storage'], ['Filecoin'], 'Decentralized perpetual storage for web3 data.', 'https://www.lighthouse.storage', 'https://docs.lighthouse.storage', 2022, 'India', 'n/a', 'https://x.com/StorageLighthouse'],
  ['Fleek', 'Infrastructure', ['Infrastructure', 'Storage'], ['IPFS'], 'Edge cloud and hosting platform for decentralized apps.', 'https://fleek.xyz', 'https://fleek.xyz/products', 2018, 'United States', 'n/a', 'https://x.com/Fleek'],
  ['InfStones', 'Infrastructure', ['Infrastructure', 'Staking'], ['Ethereum', 'Solana', 'Multiple'], 'Institutional blockchain infrastructure and staking services.', 'https://infstones.com', 'https://infstones.com/solutions', 2018, 'United States', 'n/a', 'https://x.com/InfStones'],
  ['ChainUp', 'Infrastructure', ['Infrastructure', 'Custody'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Digital asset infrastructure for exchanges and custodians.', 'https://www.chainup.com', 'https://www.chainup.com/products', 2017, 'Singapore', 'n/a', 'https://x.com/ChainUpOfficial'],

  ['Amberdata', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Institutional crypto market, DeFi, and blockchain data platform.', 'https://amberdata.io', 'https://amberdata.io/products', 2017, 'United States', 'n/a', 'https://x.com/Amberdataio'],
  ['CoinAPI', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Unified API for crypto market and exchange data.', 'https://www.coinapi.io', 'https://www.coinapi.io/products', 2014, 'Poland', 'n/a', 'https://x.com/CoinAPI'],
  ['The Tie', 'Data & Analytics', ['Data & Analytics', 'Intelligence'], ['Ethereum', 'Multiple'], 'Institutional digital asset intelligence and sentiment analytics.', 'https://www.thetie.io', 'https://www.thetie.io/platform', 2018, 'United States', 'n/a', 'https://x.com/TheTIEIO'],
  ['Messari Governor', 'Data & Analytics', ['Data & Analytics', 'DAOs & Governance'], ['Ethereum', 'Multiple'], 'Governance analytics and DAO intelligence product.', 'https://messari.io', 'https://messari.io/governor', 2022, 'United States', 'n/a', 'https://x.com/MessariCrypto'],
  ['Parsec Finance', 'Data & Analytics', ['Data & Analytics', 'Derivatives'], ['Ethereum', 'Multiple'], 'Pro trading terminal and derivatives analytics platform.', 'https://www.parsec.finance', 'https://www.parsec.finance/platform', 2023, 'United States', 'n/a', 'https://x.com/ParsecFinance'],
  ['DYOR', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Project discovery and analytics platform for crypto users.', 'https://dyor.com', 'https://dyor.com/discover', 2023, 'Metaverse', 'n/a', 'https://x.com/dyordotcom'],

  ['Coinspect', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Smart contract and blockchain security auditing firm.', 'https://www.coinspect.com', 'https://www.coinspect.com/services', 2018, 'Hungary', 'n/a', 'https://x.com/Coinspect'],
  ['Ancilia', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Multiple'], 'Threat detection and incident response platform for web3.', 'https://ancilia.com', 'https://ancilia.com/platform', 2022, 'United States', 'n/a', 'https://x.com/ancilia_inc'],
  ['BlockApex', 'Security', ['Security', 'Auditing'], ['Ethereum', 'BSC', 'Multiple'], 'Security audit and smart contract review provider.', 'https://blockapex.io', 'https://blockapex.io/services', 2020, 'Pakistan', 'n/a', 'https://x.com/blockapex_io'],
  ['Cyberscope Shield', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'BSC', 'Multiple'], 'Automated monitoring and risk intelligence tools for protocols.', 'https://www.cyberscope.io', 'https://www.cyberscope.io/shield', 2022, 'United Kingdom', 'n/a', 'https://x.com/Cyberscope_io'],
  ['QuillShield', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Multiple'], 'Runtime security monitoring product suite from QuillAudits.', 'https://quillaudits.com', 'https://quillaudits.com/quillshield', 2023, 'India', 'n/a', 'https://x.com/QuillAudits'],

  ['Edge Wallet', 'Wallets', ['Wallets'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Mobile self-custody wallet with broad asset support.', 'https://edge.app', 'https://edge.app/download', 2018, 'United States', 'n/a', 'https://x.com/EdgeWallet'],
  ['Muun', 'Wallets', ['Wallets', 'Bitcoin'], ['Bitcoin'], 'Bitcoin wallet with Lightning-focused UX.', 'https://muun.com', 'https://muun.com/download', 2019, 'Argentina', 'n/a', 'https://x.com/muunwallet'],
  ['Phoenix Wallet', 'Wallets', ['Wallets', 'Bitcoin'], ['Bitcoin'], 'Self-custodial Lightning wallet by ACINQ.', 'https://phoenix.acinq.co', 'https://phoenix.acinq.co', 2019, 'France', 'n/a', 'https://x.com/PhoenixWallet'],
  ['ZEUS Wallet', 'Wallets', ['Wallets', 'Bitcoin'], ['Bitcoin'], 'Bitcoin Lightning wallet and node management app.', 'https://zeusln.app', 'https://zeusln.app/download', 2020, 'Canada', 'n/a', 'https://x.com/ZeusLN'],

  ['WhiteBIT', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Centralized exchange and trading platform with global coverage.', 'https://whitebit.com', 'https://whitebit.com/trade', 2018, 'Lithuania', 'WBT', 'https://x.com/WhiteBit'],
  ['Bitvavo', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'European cryptocurrency exchange for retail and pro users.', 'https://bitvavo.com', 'https://bitvavo.com/en/trade', 2018, 'Netherlands', 'n/a', 'https://x.com/bitvavocom'],
  ['Bitkub', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Thailand-based digital asset exchange platform.', 'https://www.bitkub.com', 'https://www.bitkub.com/trade', 2018, 'Thailand', 'KUB', 'https://x.com/BitkubOfficial'],
  ['CoinJar', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Crypto trading and payments app for multiple regions.', 'https://www.coinjar.com', 'https://www.coinjar.com/trade', 2013, 'Australia', 'n/a', 'https://x.com/coinjar'],
  ['CoinSpot', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Australian digital asset exchange and brokerage platform.', 'https://www.coinspot.com.au', 'https://www.coinspot.com.au/buy', 2013, 'Australia', 'n/a', 'https://x.com/coinspotau'],
  ['BTC Markets', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Australian crypto exchange and trading venue.', 'https://www.btcmarkets.net', 'https://www.btcmarkets.net/trade', 2013, 'Australia', 'n/a', 'https://x.com/BTCMarkets'],
  ['LBank', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Global digital asset exchange and derivatives venue.', 'https://www.lbank.com', 'https://www.lbank.com/trade', 2016, 'British Virgin Islands', 'LBK', 'https://x.com/LBank_Exchange'],
  ['AscendEX', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Global exchange platform for spot and derivatives.', 'https://ascendex.com', 'https://ascendex.com/en/trade', 2018, 'Singapore', 'ASD', 'https://x.com/_AscendEX'],
  ['DigiFinex', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Global exchange platform for spot and derivatives markets.', 'https://www.digifinex.com', 'https://www.digifinex.com/en-ww/trade', 2017, 'Seychelles', 'DFT', 'https://x.com/digifinex'],
  ['BitMart', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Digital asset exchange with global market listings.', 'https://www.bitmart.com', 'https://www.bitmart.com/trade', 2018, 'Cayman Islands', 'BMX', 'https://x.com/BitMartExchange'],
  ['BingX', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Crypto exchange focused on derivatives and copy trading.', 'https://bingx.com', 'https://bingx.com/en-us/trade', 2018, 'Singapore', 'n/a', 'https://x.com/BingXOfficial'],
  ['Toobit', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Global crypto exchange for spot and derivatives.', 'https://www.toobit.com', 'https://www.toobit.com/en-US/trade', 2022, 'Cayman Islands', 'n/a', 'https://x.com/Toobit_official'],
  ['OKCoin', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum'], 'Exchange platform and fiat gateway in select regions.', 'https://www.okcoin.com', 'https://www.okcoin.com/trade-spot', 2013, 'United States', 'n/a', 'https://x.com/OKCoin'],

  ['Finoa', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional-grade custody and staking service provider.', 'https://finoa.io', 'https://finoa.io/solutions', 2018, 'Germany', 'n/a', 'https://x.com/Finoa_IO'],
  ['Ledger Enterprise', 'Custody', ['Custody', 'Security'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional custody and governance tooling from Ledger.', 'https://enterprise.ledger.com', 'https://enterprise.ledger.com/platform', 2020, 'France', 'n/a', 'https://x.com/Ledger'],

  ['SelfKey', 'Identity', ['Identity', 'Compliance'], ['Ethereum'], 'Self-sovereign identity and KYC marketplace ecosystem.', 'https://selfkey.org', 'https://selfkey.org/products', 2017, 'Mauritius', 'KEY', 'https://x.com/selfkey'],
  ['Dock', 'Identity', ['Identity'], ['Polkadot'], 'Verifiable credential and decentralized identity platform.', 'https://www.dock.io', 'https://www.dock.io/products', 2018, 'United Kingdom', 'DOCK', 'https://x.com/docknetwork'],
  ['Trinsic', 'Identity', ['Identity', 'Developer Tools'], ['Ethereum', 'Multiple'], 'Identity API platform for verifiable credentials.', 'https://trinsic.id', 'https://trinsic.id/products', 2020, 'United States', 'n/a', 'https://x.com/trinsic_id'],

  ['JokeRace', 'DAOs & Governance', ['DAOs & Governance'], ['Ethereum', 'Base'], 'Competitive governance and onchain voting platform.', 'https://jokerace.io', 'https://jokerace.io/explore', 2023, 'United States', 'n/a', 'https://x.com/jokerace_io'],
  ['Commonwealth', 'DAOs & Governance', ['DAOs & Governance'], ['Ethereum', 'Multiple'], 'Governance forum and proposal management platform.', 'https://commonwealth.im', 'https://commonwealth.im/explore', 2019, 'United States', 'n/a', 'https://x.com/hicommonwealth'],

  ['Unlock Protocol', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Identity'], ['Ethereum', 'Base', 'Polygon'], 'Protocol for memberships, subscriptions, and tokenized access.', 'https://unlock-protocol.com', 'https://app.unlock-protocol.com', 2020, 'United States', 'UDT', 'https://x.com/UnlockProtocol'],
  ['Mirror', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Ethereum'], 'Decentralized publishing and creator monetization platform.', 'https://mirror.xyz', 'https://mirror.xyz/discover', 2020, 'United States', 'n/a', 'https://x.com/mirrorxyz'],
  ['Sound', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Ethereum'], 'Music minting and creator-first platform for onchain releases.', 'https://www.sound.xyz', 'https://www.sound.xyz/discover', 2022, 'United States', 'n/a', 'https://x.com/soundxyz_'],

  ['Yield Guild Games', 'Gaming', ['Gaming', 'DAOs & Governance'], ['Ethereum', 'Ronin', 'Multiple'], 'Gaming guild and ecosystem supporting web3 players.', 'https://yieldguild.io', 'https://yieldguild.io/games', 2020, 'Philippines', 'YGG', 'https://x.com/YGGGuild'],
  ['Wildcard', 'Gaming', ['Gaming'], ['Ethereum'], 'Competitive action game ecosystem with onchain asset layer.', 'https://wildcardgame.com', 'https://wildcardgame.com/play', 2023, 'United States', 'n/a', 'https://x.com/playwildcard'],
  ['MetalCore', 'Gaming', ['Gaming'], ['Immutable'], 'Mechanized combat game with web3 asset ownership.', 'https://www.metalcore.gg', 'https://www.metalcore.gg/play', 2023, 'United States', 'n/a', 'https://x.com/playmetalcore']
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

