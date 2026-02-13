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
  ['Sablier', 'DeFi', ['DeFi', 'Payments'], ['Ethereum', 'Arbitrum', 'Base'], 'Token streaming protocol for recurring and vesting payments.', 'https://sablier.com', 'https://app.sablier.com', 2019, 'United States', 'SAB', 'https://x.com/sablier'],
  ['Superform', 'DeFi', ['DeFi', 'Yield'], ['Ethereum', 'Arbitrum', 'Base'], 'Cross-chain yield marketplace for vault strategies.', 'https://www.superform.xyz', 'https://app.superform.xyz', 2023, 'Metaverse', 'SUPER', 'https://x.com/superformxyz'],
  ['Prisma Finance', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum'], 'Collateralized stablecoin and lending protocol.', 'https://www.prismafinance.com', 'https://app.prismafinance.com', 2023, 'Metaverse', 'PRISMA', 'https://x.com/PrismaFi'],
  ['Instadapp', 'DeFi', ['DeFi', 'Developer Tools'], ['Ethereum'], 'DeFi account abstraction and automation tooling ecosystem.', 'https://instadapp.io', 'https://instadapp.io/products', 2019, 'India', 'INST', 'https://x.com/Instadapp'],
  ['Summer.fi', 'DeFi', ['DeFi', 'Lending'], ['Ethereum', 'Arbitrum'], 'Borrowing and leverage management interface for DeFi users.', 'https://summer.fi', 'https://summer.fi/borrow', 2021, 'United Kingdom', 'n/a', 'https://x.com/summer_fi'],
  ['DeFi Saver', 'DeFi', ['DeFi', 'Automation'], ['Ethereum'], 'Automation and risk management toolkit for DeFi positions.', 'https://defisaver.com', 'https://app.defisaver.com', 2019, 'Croatia', 'n/a', 'https://x.com/DeFiSaver'],
  ['Moonwell', 'DeFi', ['DeFi', 'Lending'], ['Base', 'Moonbeam'], 'Open lending and borrowing protocol ecosystem.', 'https://moonwell.fi', 'https://app.moonwell.fi', 2022, 'United States', 'WELL', 'https://x.com/MoonwellDeFi'],
  ['Seamless Protocol', 'DeFi', ['DeFi', 'Lending'], ['Base'], 'Lending and leverage protocol for Base ecosystem.', 'https://www.seamlessprotocol.com', 'https://app.seamlessprotocol.com', 2023, 'Metaverse', 'SEAM', 'https://x.com/SeamlessFi'],
  ['Ionic', 'DeFi', ['DeFi', 'Lending'], ['Mode', 'Base'], 'Composable money market protocol for emerging L2s.', 'https://www.ionic.money', 'https://app.ionic.money', 2023, 'Metaverse', 'ION', 'https://x.com/Ionicmoney'],
  ['Mendi Finance', 'DeFi', ['DeFi', 'Lending'], ['Linea'], 'Money market protocol in Linea ecosystem.', 'https://mendi.finance', 'https://app.mendi.finance', 2023, 'Metaverse', 'MENDI', 'https://x.com/MendiFinance'],
  ['Conic Finance', 'DeFi', ['DeFi', 'Yield'], ['Ethereum'], 'Liquidity routing and yield optimization protocol.', 'https://www.conic.finance', 'https://www.conic.finance/app', 2023, 'Metaverse', 'CNC', 'https://x.com/ConicFinance'],
  ['Raft', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum'], 'Collateralized stablecoin and borrowing protocol.', 'https://raft.fi', 'https://app.raft.fi', 2023, 'Metaverse', 'RAFT', 'https://x.com/RaftFi'],
  ['Mento', 'DeFi', ['DeFi', 'Stablecoin'], ['Celo'], 'Stable asset protocol and exchange infrastructure on Celo.', 'https://mento.org', 'https://mento.org/products', 2021, 'Germany', 'MENTO', 'https://x.com/MentoLabs'],
  ['Fluid', 'DeFi', ['DeFi', 'Lending'], ['Ethereum'], 'Integrated liquidity and lending protocol ecosystem.', 'https://fluid.instadapp.io', 'https://fluid.instadapp.io/app', 2024, 'India', 'n/a', 'https://x.com/0xfluid'],
  ['Meson', 'DeFi', ['DeFi', 'Cross-chain'], ['Ethereum', 'Arbitrum', 'Optimism'], 'Stablecoin-focused cross-chain transfer protocol.', 'https://meson.fi', 'https://meson.fi', 2021, 'Singapore', 'MESON', 'https://x.com/mesonfi'],

  ['Connext', 'Infrastructure', ['Infrastructure', 'Cross-chain'], ['Ethereum', 'Multiple'], 'Interoperability protocol for cross-chain messaging and value transfer.', 'https://www.connext.network', 'https://docs.connext.network', 2017, 'United States', 'NEXT', 'https://x.com/connextnetwork'],
  ['Celer Network', 'Infrastructure', ['Infrastructure', 'Cross-chain'], ['Ethereum', 'Multiple'], 'Inter-chain messaging and bridging infrastructure.', 'https://www.celer.network', 'https://www.celer.network/products', 2018, 'United States', 'CELR', 'https://x.com/CelerNetwork'],
  ['Orbiter Finance', 'Infrastructure', ['Infrastructure', 'Cross-chain'], ['Ethereum', 'Arbitrum', 'Base'], 'Bridge and transfer infrastructure for L2 users.', 'https://www.orbiter.finance', 'https://www.orbiter.finance', 2022, 'Metaverse', 'OBT', 'https://x.com/Orbiter_Finance'],
  ['Portal Bridge', 'Infrastructure', ['Infrastructure', 'Cross-chain'], ['Ethereum', 'Solana', 'Multiple'], 'Cross-chain bridge interface built on Wormhole.', 'https://portalbridge.com', 'https://portalbridge.com', 2022, 'Metaverse', 'n/a', 'https://x.com/wormhole'],
  ['Tellor', 'Infrastructure', ['Infrastructure', 'Oracles'], ['Ethereum', 'Multiple'], 'Decentralized oracle protocol for permissionless data feeds.', 'https://tellor.io', 'https://tellor.io/docs', 2019, 'United States', 'TRB', 'https://x.com/WeAreTellor'],
  ['Chronicle', 'Infrastructure', ['Infrastructure', 'Oracles'], ['Ethereum'], 'Oracle infrastructure focused on secure and transparent data feeds.', 'https://chroniclelabs.org', 'https://chroniclelabs.org/docs', 2023, 'Metaverse', 'n/a', 'https://x.com/ChronicleLabs'],
  ['Witnet', 'Infrastructure', ['Infrastructure', 'Oracles'], ['Ethereum', 'Polygon'], 'Decentralized oracle network and randomness provider.', 'https://witnet.io', 'https://docs.witnet.io', 2018, 'Spain', 'WIT', 'https://x.com/witnet_io'],
  ['Biconomy', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Polygon', 'Multiple'], 'Transaction relaying and account abstraction infrastructure.', 'https://www.biconomy.io', 'https://www.biconomy.io/products', 2019, 'India', 'BICO', 'https://x.com/biconomy'],
  ['Pimlico', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Base', 'Arbitrum'], 'ERC-4337 infrastructure and bundler services.', 'https://www.pimlico.io', 'https://docs.pimlico.io', 2023, 'United Kingdom', 'n/a', 'https://x.com/pimlicoHQ'],
  ['Stackup', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Base'], 'Account abstraction and bundler infrastructure for developers.', 'https://www.stackup.fi', 'https://www.stackup.fi/docs', 2022, 'United States', 'n/a', 'https://x.com/stackupdotsh'],
  ['ZeroDev', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Base', 'Arbitrum'], 'Smart account infrastructure and developer SDKs.', 'https://zerodev.app', 'https://docs.zerodev.app', 2022, 'United States', 'n/a', 'https://x.com/zerodev_app'],
  ['Particle Network', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Multiple'], 'Chain abstraction and universal accounts infrastructure.', 'https://particle.network', 'https://particle.network/products', 2022, 'Singapore', 'PARTI', 'https://x.com/ParticleNtwrk'],
  ['Magic', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Solana', 'Multiple'], 'Embedded wallet and authentication SDK platform.', 'https://magic.link', 'https://magic.link/products', 2018, 'United States', 'n/a', 'https://x.com/magic_labs'],
  ['Chainnodes', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Node infrastructure provider for blockchain developers.', 'https://www.chainnodes.org', 'https://www.chainnodes.org/docs', 2020, 'Germany', 'n/a', 'https://x.com/chainnodes'],
  ['Blast API', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Polygon', 'Multiple'], 'Managed blockchain node and API platform.', 'https://blastapi.io', 'https://blastapi.io/products', 2021, 'Romania', 'n/a', 'https://x.com/blastapi'],

  ['Quai Network', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Quai'], 'Sharded proof-of-work blockchain ecosystem.', 'https://qu.ai', 'https://qu.ai/ecosystem', 2024, 'United States', 'QUAI', 'https://x.com/QuaiNetwork'],
  ['BounceBit', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Bitcoin'], ['BounceBit'], 'Bitcoin-oriented L1 with CeDeFi primitives.', 'https://bouncebit.io', 'https://bouncebit.io/ecosystem', 2024, 'Singapore', 'BB', 'https://x.com/bounce_bit'],
  ['Saakuru', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Gaming'], ['Saakuru'], 'Gaming and consumer-focused L2 ecosystem.', 'https://saakuru.com', 'https://saakuru.com/build', 2024, 'Singapore', 'n/a', 'https://x.com/SaakuruLabs'],
  ['X Layer', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Ethereum'], 'EVM layer ecosystem backed by OKX stack.', 'https://www.okx.com/xlayer', 'https://www.okx.com/web3/xlayer', 2024, 'Seychelles', 'n/a', 'https://x.com/okxweb3'],
  ['Immutable zkEVM', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Gaming'], ['Ethereum'], 'Gaming-focused zkEVM chain ecosystem by Immutable.', 'https://www.immutable.com/products/zkevm', 'https://www.immutable.com/products/zkevm', 2023, 'Australia', 'IMX', 'https://x.com/Immutable'],

  ['CoinDance', 'Data & Analytics', ['Data & Analytics', 'Bitcoin'], ['Bitcoin'], 'Open data platform for Bitcoin network statistics.', 'https://coin.dance', 'https://coin.dance/stats', 2014, 'United Kingdom', 'n/a', 'https://x.com/CoinDance'],
  ['Messari Screener', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Asset screening and analytics tooling from Messari.', 'https://messari.io', 'https://messari.io/screener', 2022, 'United States', 'n/a', 'https://x.com/MessariCrypto'],
  ['CryptoStat', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Protocol and market metrics dashboard suite.', 'https://cryptostats.community', 'https://cryptostats.community/dashboard', 2021, 'Metaverse', 'n/a', 'https://x.com/crypto_stats'],
  ['DefiSafety', 'Data & Analytics', ['Data & Analytics', 'Security'], ['Ethereum', 'Multiple'], 'Operational risk ratings and transparency analytics for DeFi.', 'https://www.defisafety.com', 'https://www.defisafety.com/ratings', 2020, 'Canada', 'n/a', 'https://x.com/DefiSafety'],

  ['HashEx', 'Security', ['Security', 'Auditing'], ['Ethereum', 'BSC', 'Multiple'], 'Smart contract audit and blockchain security services.', 'https://hashex.org', 'https://hashex.org/services', 2017, 'Cyprus', 'n/a', 'https://x.com/HashExOfficial'],
  ['ChainSecurity', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Security firm providing audits and formal analysis.', 'https://chainsecurity.com', 'https://chainsecurity.com/services', 2017, 'Switzerland', 'n/a', 'https://x.com/Chain_Security'],
  ['RugDoc', 'Security', ['Security', 'Research'], ['BSC', 'Polygon', 'Multiple'], 'DeFi protocol risk assessment and security research platform.', 'https://rugdoc.io', 'https://rugdoc.io/risk-analysis', 2021, 'Netherlands', 'n/a', 'https://x.com/RugDocIO'],

  ['Coinomi', 'Wallets', ['Wallets'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Multi-chain self-custody wallet platform.', 'https://www.coinomi.com', 'https://www.coinomi.com/en/downloads', 2014, 'United Kingdom', 'n/a', 'https://x.com/CoinomiWallet'],
  ['Sparrow Wallet', 'Wallets', ['Wallets', 'Bitcoin'], ['Bitcoin'], 'Desktop Bitcoin wallet focused on security and control.', 'https://sparrowwallet.com', 'https://sparrowwallet.com/download', 2020, 'Metaverse', 'n/a', 'https://x.com/sparrowwallet'],
  ['Wasabi Wallet', 'Wallets', ['Wallets', 'Bitcoin'], ['Bitcoin'], 'Privacy-focused Bitcoin wallet with coinjoin tooling.', 'https://wasabiwallet.io', 'https://wasabiwallet.io/#download', 2018, 'Hungary', 'n/a', 'https://x.com/wasabiwallet'],
  ['Blockstream Green', 'Wallets', ['Wallets', 'Bitcoin'], ['Bitcoin'], 'Self-custody Bitcoin wallet by Blockstream.', 'https://blockstream.com/green', 'https://blockstream.com/green', 2019, 'Canada', 'n/a', 'https://x.com/Blockstream'],

  ['CEX.IO', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Global exchange and brokerage platform.', 'https://cex.io', 'https://cex.io/trade', 2013, 'United Kingdom', 'n/a', 'https://x.com/cex_io'],
  ['CoinEx', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Digital asset exchange with spot and futures markets.', 'https://www.coinex.com', 'https://www.coinex.com/exchange', 2017, 'Hong Kong', 'CET', 'https://x.com/coinexcom'],
  ['Bitrue', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Global crypto exchange and wealth products platform.', 'https://www.bitrue.com', 'https://www.bitrue.com/trade', 2018, 'Singapore', 'BTR', 'https://x.com/BitrueOfficial'],
  ['WazirX', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'India-focused crypto exchange and trading platform.', 'https://wazirx.com', 'https://wazirx.com/exchange', 2018, 'India', 'WRX', 'https://x.com/WazirXIndia'],
  ['Coinmetro', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Regulated exchange and trading platform for digital assets.', 'https://coinmetro.com', 'https://coinmetro.com/trade', 2018, 'Estonia', 'XCM', 'https://x.com/CoinMetro'],
  ['Bit2Me', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Spanish crypto exchange and digital asset platform.', 'https://bit2me.com', 'https://bit2me.com/en/buy', 2014, 'Spain', 'B2M', 'https://x.com/bit2me'],
  ['CoinList', 'Payments', ['Payments', 'Exchange'], ['Ethereum', 'Multiple'], 'Token launch and exchange platform for early-stage crypto projects.', 'https://coinlist.co', 'https://coinlist.co/trade', 2017, 'United States', 'n/a', 'https://x.com/CoinList'],
  ['Uphold', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Multi-asset trading and payments platform.', 'https://uphold.com', 'https://uphold.com/en-us/trade', 2014, 'United States', 'n/a', 'https://x.com/UpholdInc'],
  ['eToro Crypto', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Retail trading platform with integrated crypto markets.', 'https://www.etoro.com/crypto', 'https://www.etoro.com/crypto', 2013, 'Israel', 'n/a', 'https://x.com/eToro'],

  ['Cactus Custody', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional digital asset custody and staking services.', 'https://www.cactuscustody.com', 'https://www.cactuscustody.com/solutions', 2019, 'Hong Kong', 'n/a', 'https://x.com/CactusCustody'],
  ['Prosegur Crypto', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum'], 'Institutional custody solutions by Prosegur group.', 'https://www.prosegurcrypto.com', 'https://www.prosegurcrypto.com/services', 2021, 'Spain', 'n/a', 'https://x.com/prosegurcrypto'],

  ['Quadrata', 'Identity', ['Identity', 'Compliance'], ['Ethereum'], 'Onchain passport and compliance credential infrastructure.', 'https://www.quadrata.com', 'https://www.quadrata.com/products', 2021, 'United States', 'n/a', 'https://x.com/quadrataNetwork'],
  ['Verite', 'Identity', ['Identity'], ['Ethereum'], 'Open framework for identity credentials and attestations.', 'https://verite.id', 'https://verite.id/docs', 2022, 'United States', 'n/a', 'https://x.com/verite_id'],

  ['Metagov', 'DAOs & Governance', ['DAOs & Governance', 'Research'], ['Ethereum', 'Multiple'], 'Open governance coordination infrastructure and research collective.', 'https://metagov.org', 'https://metagov.org/projects', 2021, 'United States', 'n/a', 'https://x.com/metagov_project'],

  ['Guild of Guardians', 'Gaming', ['Gaming'], ['Immutable'], 'Mobile RPG ecosystem with onchain asset ownership.', 'https://www.guildofguardians.com', 'https://www.guildofguardians.com/play', 2023, 'Australia', 'n/a', 'https://x.com/GuildOfGuardian'],
  ['Pirate Nation', 'Gaming', ['Gaming'], ['Ethereum'], 'Onchain strategy RPG and ecosystem by Proof of Play.', 'https://piratenation.game', 'https://piratenation.game/play', 2023, 'United States', 'PIRATE', 'https://x.com/PirateNation']
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

