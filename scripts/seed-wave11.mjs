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
  ['Osmosis', 'DeFi', ['DeFi', 'DEX'], ['Cosmos'], 'Leading DEX and liquidity hub in the Cosmos ecosystem.', 'https://osmosis.zone', 'https://app.osmosis.zone', 2021, 'Metaverse', 'OSMO', 'https://x.com/osmosiszone'],
  ['THORSwap', 'DeFi', ['DeFi', 'Cross-chain'], ['THORChain', 'Bitcoin', 'Ethereum'], 'Cross-chain swap interface powered by THORChain liquidity.', 'https://thorswap.finance', 'https://app.thorswap.finance', 2021, 'Metaverse', 'n/a', 'https://x.com/THORSwap'],
  ['Maya Protocol', 'DeFi', ['DeFi', 'Cross-chain'], ['Maya', 'Bitcoin', 'Ethereum'], 'Cross-chain liquidity protocol for native asset swaps.', 'https://www.mayaprotocol.com', 'https://www.mayaprotocol.com/swap', 2023, 'Metaverse', 'CACAO', 'https://x.com/Maya_Protocol'],
  ['JediSwap', 'DeFi', ['DeFi', 'DEX'], ['Starknet'], 'AMM DEX protocol for Starknet ecosystem.', 'https://www.jediswap.xyz', 'https://app.jediswap.xyz', 2022, 'Metaverse', 'JEDI', 'https://x.com/JediSwap'],
  ['mySwap', 'DeFi', ['DeFi', 'DEX'], ['Starknet'], 'Starknet DEX for token swaps and liquidity.', 'https://www.myswap.xyz', 'https://www.myswap.xyz/#/swap', 2022, 'Metaverse', 'n/a', 'https://x.com/myswapxyz'],
  ['10KSwap', 'DeFi', ['DeFi', 'DEX'], ['Starknet'], 'Concentrated and AMM liquidity protocol on Starknet.', 'https://10kswap.com', 'https://10kswap.com/swap', 2022, 'Metaverse', 'n/a', 'https://x.com/10KSwap'],
  ['Aries Markets', 'DeFi', ['DeFi', 'Lending'], ['Aptos'], 'Aptos-native lending and margin trading protocol.', 'https://ariesmarkets.xyz', 'https://app.ariesmarkets.xyz', 2023, 'Metaverse', 'n/a', 'https://x.com/AriesMarkets'],
  ['Econia', 'DeFi', ['DeFi', 'Orderbook'], ['Aptos'], 'Onchain orderbook and matching engine infrastructure on Aptos.', 'https://www.econialabs.com', 'https://www.econialabs.com/products', 2023, 'United States', 'n/a', 'https://x.com/EconiaLabs'],
  ['Cellana Finance', 'DeFi', ['DeFi', 'DEX'], ['Aptos'], 'Aptos AMM and liquidity marketplace.', 'https://cellana.finance', 'https://app.cellana.finance', 2023, 'Metaverse', 'CELL', 'https://x.com/CellanaFinance'],
  ['KriyaDEX', 'DeFi', ['DeFi', 'DEX'], ['Sui'], 'Sui-based DEX and liquidity protocol.', 'https://kriya.finance', 'https://kriya.finance/swap', 2023, 'Metaverse', 'KDX', 'https://x.com/KriyaDEX'],
  ['Bucket Protocol', 'DeFi', ['DeFi', 'Stablecoin'], ['Sui'], 'Stablecoin and collateral protocol in Sui ecosystem.', 'https://www.bucketprotocol.io', 'https://www.bucketprotocol.io/app', 2023, 'Metaverse', 'BUCK', 'https://x.com/Bucket_Protocol'],
  ['Velar', 'DeFi', ['DeFi', 'DEX'], ['Bitcoin', 'Stacks'], 'Bitcoin DeFi protocol and liquidity infrastructure on Stacks.', 'https://www.velar.co', 'https://app.velar.co', 2024, 'Metaverse', 'VELAR', 'https://x.com/VelarBTC'],
  ['Bitflow', 'DeFi', ['DeFi', 'DEX'], ['Bitcoin', 'Stacks'], 'Bitcoin-native swap and liquidity protocol.', 'https://www.bitflow.finance', 'https://www.bitflow.finance/app', 2023, 'Metaverse', 'BFF', 'https://x.com/Bitflow_Finance'],
  ['Zest Protocol', 'DeFi', ['DeFi', 'Lending'], ['Bitcoin', 'Stacks'], 'Bitcoin lending and fixed-income protocol.', 'https://www.zestprotocol.com', 'https://www.zestprotocol.com/app', 2024, 'Metaverse', 'ZEST', 'https://x.com/zestprotocol'],
  ['Extra Finance', 'DeFi', ['DeFi', 'Lending'], ['Optimism', 'Base'], 'Leverage and liquidity strategy protocol.', 'https://extrafi.io', 'https://app.extrafi.io', 2023, 'Metaverse', 'EXTRA', 'https://x.com/extrafi_io'],
  ['KiloEx', 'DeFi', ['DeFi', 'Derivatives'], ['BNB Chain', 'Base'], 'Perpetual futures protocol for multi-chain traders.', 'https://kiloex.io', 'https://app.kiloex.io', 2024, 'Metaverse', 'KILO', 'https://x.com/KiloEx_perp'],
  ['Thruster', 'DeFi', ['DeFi', 'DEX'], ['Blast'], 'Native DEX and liquidity hub for Blast ecosystem.', 'https://www.thruster.finance', 'https://www.thruster.finance/swap', 2024, 'Metaverse', 'THRUST', 'https://x.com/thrusterfinance'],
  ['ZKSwap Finance', 'DeFi', ['DeFi', 'DEX'], ['zkSync', 'Ethereum'], 'ZK-powered AMM and swap infrastructure.', 'https://zkswap.finance', 'https://zkswap.finance/app', 2021, 'Metaverse', 'ZKS', 'https://x.com/zkswapfinance'],
  ['Rubic', 'DeFi', ['DeFi', 'Cross-chain'], ['Ethereum', 'Multiple'], 'Cross-chain swap aggregator and bridging interface.', 'https://rubic.exchange', 'https://app.rubic.exchange', 2021, 'Canada', 'RBC', 'https://x.com/CryptoRubic'],
  ['DODO', 'DeFi', ['DeFi', 'DEX'], ['Ethereum', 'Arbitrum', 'BSC'], 'Proactive market maker and liquidity protocol.', 'https://dodoex.io', 'https://app.dodoex.io', 2020, 'Singapore', 'DODO', 'https://x.com/BreederDodo'],

  ['Kadena', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Kadena'], 'Scalable proof-of-work blockchain ecosystem.', 'https://kadena.io', 'https://kadena.io/ecosystem', 2019, 'United States', 'KDA', 'https://x.com/kadena_io'],
  ['Waves', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Waves'], 'Blockchain ecosystem for tokens and applications.', 'https://waves.tech', 'https://waves.tech/ecosystem', 2016, 'Switzerland', 'WAVES', 'https://x.com/wavesprotocol'],
  ['Lisk', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Lisk'], 'Blockchain app ecosystem with SDK tooling.', 'https://lisk.com', 'https://lisk.com/ecosystem', 2016, 'Switzerland', 'LSK', 'https://x.com/LiskHQ'],
  ['ICON', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['ICON'], 'Interoperable blockchain ecosystem and network.', 'https://icon.community', 'https://icon.community/ecosystem', 2017, 'South Korea', 'ICX', 'https://x.com/helloiconworld'],
  ['Ontology', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Identity'], ['Ontology'], 'Identity-oriented blockchain ecosystem and tooling.', 'https://ont.io', 'https://ont.io/ecosystem', 2018, 'Singapore', 'ONT', 'https://x.com/OntologyNetwork'],
  ['VeChain Foundation', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['VeChain'], 'Foundation supporting VeChain ecosystem and enterprise adoption.', 'https://www.vechain.org', 'https://www.vechain.org/ecosystem', 2017, 'Singapore', 'VET', 'https://x.com/vechainofficial'],
  ['NEM', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['NEM'], 'Public blockchain ecosystem focused on enterprise use cases.', 'https://www.nem.io', 'https://www.nem.io/ecosystem', 2015, 'Japan', 'XEM', 'https://x.com/nemofficial'],
  ['IOTA Foundation', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['IOTA'], 'Foundation building distributed ledger infrastructure for IoT.', 'https://www.iota.org', 'https://www.iota.org/ecosystem', 2017, 'Germany', 'IOTA', 'https://x.com/iota'],
  ['EOS Network Foundation', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['EOS'], 'Stewardship organization for EOS network ecosystem.', 'https://eosnetwork.com', 'https://eosnetwork.com/ecosystem', 2021, 'Canada', 'EOS', 'https://x.com/EOSNetworkFDN'],
  ['Zilliqa', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Zilliqa'], 'High-throughput blockchain ecosystem using sharding.', 'https://www.zilliqa.com', 'https://www.zilliqa.com/ecosystem', 2017, 'Singapore', 'ZIL', 'https://x.com/zilliqa'],

  ['Scorechain', 'Data & Analytics', ['Data & Analytics', 'Compliance'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Compliance analytics and blockchain risk monitoring platform.', 'https://www.scorechain.com', 'https://www.scorechain.com/solutions', 2015, 'Luxembourg', 'n/a', 'https://x.com/Scorechain'],
  ['Merkle Science', 'Data & Analytics', ['Data & Analytics', 'Compliance'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Risk and compliance intelligence platform for digital assets.', 'https://www.merklescience.com', 'https://www.merklescience.com/products', 2018, 'Singapore', 'n/a', 'https://x.com/merkle_science'],
  ['Coinfirm', 'Data & Analytics', ['Data & Analytics', 'Compliance'], ['Bitcoin', 'Ethereum', 'Multiple'], 'AML and compliance analytics for digital asset businesses.', 'https://www.coinfirm.com', 'https://www.coinfirm.com/products', 2016, 'United Kingdom', 'n/a', 'https://x.com/coinfirm_io'],
  ['Crystal Intelligence', 'Data & Analytics', ['Data & Analytics', 'Compliance'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Blockchain analytics platform for investigations and risk.', 'https://crystalintelligence.com', 'https://crystalintelligence.com/platform', 2018, 'Netherlands', 'n/a', 'https://x.com/CrystalPlatform'],
  ['Coinranking', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Ethereum', 'Multiple'], 'Crypto market data and ranking platform.', 'https://coinranking.com', 'https://coinranking.com/api', 2017, 'Netherlands', 'n/a', 'https://x.com/coinranking'],
  ['CoinLore', 'Data & Analytics', ['Data & Analytics', 'Market Data'], ['Ethereum', 'Multiple'], 'Market data and ranking portal for crypto assets.', 'https://www.coinlore.com', 'https://www.coinlore.com/coins', 2017, 'United States', 'n/a', 'https://x.com/coinlorecom'],

  ['Shieldify', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Multiple'], 'Runtime monitoring and incident response tooling for web3.', 'https://shieldify.io', 'https://shieldify.io/platform', 2023, 'United States', 'n/a', 'https://x.com/shieldifysec'],
  ['Oxorio', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Security research and audit firm for smart contracts.', 'https://oxor.io', 'https://oxor.io/services', 2021, 'Metaverse', 'n/a', 'https://x.com/oxorio'],
  ['BlockSec Phalcon', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Multiple'], 'Security observability and simulation tooling suite.', 'https://phalcon.blocksec.com', 'https://phalcon.blocksec.com/explorer', 2022, 'Singapore', 'n/a', 'https://x.com/BlockSecTeam'],
  ['OpenZeppelin Defender', 'Security', ['Security', 'Developer Tools'], ['Ethereum', 'Multiple'], 'Transaction automation and security operations platform.', 'https://openzeppelin.com/defender', 'https://openzeppelin.com/defender', 2020, 'United States', 'n/a', 'https://x.com/OpenZeppelin'],
  ['Cyfrin Updraft', 'Security', ['Security', 'Developer Tools'], ['Ethereum'], 'Security education and tooling ecosystem for Solidity developers.', 'https://updraft.cyfrin.io', 'https://updraft.cyfrin.io/courses', 2023, 'United States', 'n/a', 'https://x.com/CyfrinAudits'],

  ['Keystone Wallet', 'Wallets', ['Wallets', 'Security'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Hardware wallet and companion app ecosystem.', 'https://keyst.one', 'https://keyst.one/download', 2018, 'Hong Kong', 'n/a', 'https://x.com/KeystoneWallet'],
  ['ELLIPAL', 'Wallets', ['Wallets', 'Security'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Air-gapped hardware wallet platform.', 'https://www.ellipal.com', 'https://www.ellipal.com/pages/download', 2018, 'Hong Kong', 'n/a', 'https://x.com/ellipalwallet'],
  ['CoolWallet', 'Wallets', ['Wallets', 'Security'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Hardware wallet with mobile-first user experience.', 'https://www.coolwallet.io', 'https://www.coolwallet.io/download', 2016, 'Taiwan', 'n/a', 'https://x.com/CoolWallet'],
  ['NGRAVE', 'Wallets', ['Wallets', 'Security'], ['Bitcoin', 'Ethereum', 'Multiple'], 'High-security hardware wallet and custody stack.', 'https://www.ngrave.io', 'https://www.ngrave.io/products', 2018, 'Belgium', 'n/a', 'https://x.com/ngrave_official'],

  ['Bitbank', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Japanese crypto exchange and spot trading platform.', 'https://bitbank.cc', 'https://bitbank.cc/trade', 2014, 'Japan', 'n/a', 'https://x.com/bitbank_inc'],
  ['Coinone', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Korean crypto exchange platform.', 'https://coinone.co.kr', 'https://coinone.co.kr/exchange', 2014, 'South Korea', 'n/a', 'https://x.com/CoinoneOfficial'],
  ['Korbit', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Korean exchange and trading platform for digital assets.', 'https://www.korbit.co.kr', 'https://www.korbit.co.kr/trade', 2013, 'South Korea', 'n/a', 'https://x.com/korbit_official'],
  ['Zipmex', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Regional exchange and digital asset service platform.', 'https://zipmex.com', 'https://zipmex.com/trade', 2018, 'Thailand', 'n/a', 'https://x.com/zipmex'],
  ['Pintu', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Indonesian crypto trading and payments app.', 'https://pintu.co.id', 'https://pintu.co.id/trade', 2020, 'Indonesia', 'PTU', 'https://x.com/pintucoid'],
  ['Lykke', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Digital asset exchange and fintech platform.', 'https://www.lykke.com', 'https://www.lykke.com/trade', 2015, 'Switzerland', 'LKK', 'https://x.com/Lykke'],
  ['Coinsquare', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Canadian digital asset exchange platform.', 'https://www.coinsquare.com', 'https://www.coinsquare.com/trade', 2014, 'Canada', 'n/a', 'https://x.com/Coinsquare'],
  ['NDAX', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Canadian crypto trading and exchange platform.', 'https://ndax.io', 'https://ndax.io/trade', 2018, 'Canada', 'n/a', 'https://x.com/ndaxio'],
  ['Newton', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Canadian crypto app and exchange services.', 'https://www.newton.co', 'https://www.newton.co/trade', 2018, 'Canada', 'n/a', 'https://x.com/newton_crypto'],
  ['Shakepay', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum'], 'Canadian crypto payments and trading app.', 'https://shakepay.com', 'https://shakepay.com/features', 2015, 'Canada', 'n/a', 'https://x.com/shakepay'],
  ['CoinMENA', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'MENA-focused licensed digital asset exchange.', 'https://coinmena.com', 'https://coinmena.com/trade', 2021, 'Bahrain', 'n/a', 'https://x.com/CoinMENA'],
  ['BYDFi', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Global exchange platform for spot and derivatives.', 'https://www.bydfi.com', 'https://www.bydfi.com/trade', 2020, 'Singapore', 'n/a', 'https://x.com/BYDFi_Official'],
  ['BTCC', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Long-running crypto exchange and derivatives venue.', 'https://www.btcc.com', 'https://www.btcc.com/trade', 2011, 'United Kingdom', 'n/a', 'https://x.com/BTCCexchange'],
  ['CoinTR', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Digital asset exchange platform for Turkish market.', 'https://www.cointr.com', 'https://www.cointr.com/trade', 2022, 'Turkey', 'n/a', 'https://x.com/CoinTR'],
  ['Tapbit', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Global crypto exchange for spot and futures.', 'https://www.tapbit.com', 'https://www.tapbit.com/trade', 2021, 'Seychelles', 'n/a', 'https://x.com/tapbitglobal'],
  ['Bitkan', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Crypto market platform and trading gateway.', 'https://bitkan.com', 'https://bitkan.com/markets', 2012, 'Singapore', 'n/a', 'https://x.com/BitKanOfficial'],
  ['Coinstore', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Global exchange and digital asset trading venue.', 'https://www.coinstore.com', 'https://www.coinstore.com/trade', 2021, 'Singapore', 'n/a', 'https://x.com/CoinstoreExc'],
  ['ProBit', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Global exchange with spot markets and token listings.', 'https://www.probit.com', 'https://www.probit.com/en-us/exchange', 2018, 'Seychelles', 'n/a', 'https://x.com/ProBit_Exchange'],
  ['LATOKEN', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Digital asset exchange with broad token listings.', 'https://latoken.com', 'https://latoken.com/exchange', 2017, 'Cayman Islands', 'LA', 'https://x.com/latokens'],
  ['Bitpanda', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'European crypto broker and trading platform.', 'https://www.bitpanda.com', 'https://www.bitpanda.com/en/trade', 2014, 'Austria', 'BEST', 'https://x.com/Bitpanda_global'],
  ['Kriptomat', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'European crypto brokerage and exchange platform.', 'https://kriptomat.io', 'https://kriptomat.io/buy-crypto', 2018, 'Estonia', 'KMT', 'https://x.com/kriptomat'],

  ['RealT', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'DeFi'], ['Ethereum'], 'Tokenized real estate investment and rental income platform.', 'https://realt.co', 'https://realt.co/marketplace', 2019, 'United States', 'n/a', 'https://x.com/RealTPlatform'],
  ['Lofty', 'Real World Assets (RWA)', ['Real World Assets (RWA)'], ['Algorand'], 'Fractional tokenized real estate marketplace.', 'https://www.lofty.ai', 'https://www.lofty.ai/marketplace', 2021, 'United States', 'n/a', 'https://x.com/lofty_ai'],

  ['Collab.Land', 'DAOs & Governance', ['DAOs & Governance', 'Identity'], ['Ethereum', 'Multiple'], 'Token-gated community and role management tooling.', 'https://www.collab.land', 'https://www.collab.land/product', 2020, 'United States', 'COLLAB', 'https://x.com/collab_land_'],

  ['fxhash', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Marketplace'], ['Tezos'], 'Generative art marketplace and creator platform.', 'https://fxhash.xyz', 'https://fxhash.xyz/explore', 2021, 'France', 'n/a', 'https://x.com/fx_hash_'],
  ['Mintbase', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['NEAR'], 'NFT storefront and creator tooling platform.', 'https://www.mintbase.xyz', 'https://www.mintbase.xyz/creator', 2018, 'Portugal', 'MINT', 'https://x.com/mintbase'],

  ['The Beacon', 'Gaming', ['Gaming'], ['Arbitrum'], 'Roguelite RPG game ecosystem with onchain progression.', 'https://www.thebeacon.gg', 'https://www.thebeacon.gg/play', 2023, 'United States', 'n/a', 'https://x.com/The_Beacon_GG']
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

