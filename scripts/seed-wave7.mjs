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
  ['Marinade Finance', 'DeFi', ['DeFi', 'Staking'], ['Solana'], 'Liquid staking and validator delegation protocol for Solana.', 'https://marinade.finance', 'https://marinade.finance/app', 2021, 'Metaverse', 'MNDE', 'https://x.com/MarinadeFinance'],
  ['Cetus Protocol', 'DeFi', ['DeFi', 'DEX'], ['Sui', 'Aptos'], 'Concentrated liquidity DEX infrastructure for Move ecosystems.', 'https://www.cetus.zone', 'https://app.cetus.zone', 2022, 'Singapore', 'CETUS', 'https://x.com/CetusProtocol'],
  ['Turbos Finance', 'DeFi', ['DeFi', 'DEX'], ['Sui'], 'Sui-native liquidity and trading protocol.', 'https://turbos.finance', 'https://app.turbos.finance', 2023, 'Metaverse', 'TURBOS', 'https://x.com/Turbos_finance'],
  ['Scallop', 'DeFi', ['DeFi', 'Lending'], ['Sui'], 'Money market and lending protocol in the Sui ecosystem.', 'https://scallop.io', 'https://app.scallop.io', 2023, 'Metaverse', 'SCA', 'https://x.com/Scallop_io'],
  ['Thala', 'DeFi', ['DeFi', 'DEX'], ['Aptos'], 'Aptos liquidity and stable asset protocol suite.', 'https://thala.fi', 'https://app.thala.fi', 2022, 'Metaverse', 'THL', 'https://x.com/ThalaLabs'],
  ['Levana', 'DeFi', ['DeFi', 'Derivatives'], ['Cosmos'], 'Perpetual trading protocol focused on Cosmos ecosystems.', 'https://levana.finance', 'https://app.levana.finance', 2022, 'Metaverse', 'LVN', 'https://x.com/Levana_protocol'],
  ['Zeta Markets', 'DeFi', ['DeFi', 'Derivatives'], ['Solana'], 'Onchain derivatives exchange and liquidity protocol.', 'https://zetamarkets.com', 'https://dex.zeta.markets', 2021, 'Metaverse', 'ZEX', 'https://x.com/ZetaMarkets'],
  ['Mango Markets', 'DeFi', ['DeFi', 'Lending'], ['Solana'], 'Decentralized trading and lending protocol on Solana.', 'https://mango.markets', 'https://trade.mango.markets', 2021, 'Metaverse', 'MNGO', 'https://x.com/mangomarkets'],
  ['Liqwid Finance', 'DeFi', ['DeFi', 'Lending'], ['Cardano'], 'Cardano-native non-custodial lending protocol.', 'https://liqwid.finance', 'https://app.liqwid.finance', 2021, 'Metaverse', 'LQ', 'https://x.com/liqwidfinance'],
  ['Indigo Protocol', 'DeFi', ['DeFi', 'Stablecoin'], ['Cardano'], 'Synthetic assets and collateral protocol for Cardano.', 'https://indigoprotocol.io', 'https://app.indigoprotocol.io', 2022, 'Metaverse', 'INDY', 'https://x.com/Indigo_protocol'],
  ['MuesliSwap', 'DeFi', ['DeFi', 'DEX'], ['Cardano'], 'Cardano DEX with orderbook and AMM liquidity options.', 'https://muesliswap.com', 'https://muesliswap.com/swap', 2021, 'Metaverse', 'MILK', 'https://x.com/MuesliSwapTeam'],
  ['Platypus Finance', 'DeFi', ['DeFi', 'DEX'], ['Avalanche'], 'Avalanche-focused stable asset swap and liquidity protocol.', 'https://platypus.finance', 'https://app.platypus.finance', 2021, 'Metaverse', 'PTP', 'https://x.com/Platypusdefi'],
  ['Gyroscope', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum'], 'Resilient stablecoin protocol and liquidity design stack.', 'https://gyro.finance', 'https://app.gyro.finance', 2022, 'Switzerland', 'GYFI', 'https://x.com/GyroStable'],
  ['Origin Dollar', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum'], 'Yield-bearing stablecoin and DeFi vault ecosystem.', 'https://www.originprotocol.com/ousd', 'https://app.originprotocol.com', 2020, 'United States', 'OGN', 'https://x.com/OriginProtocol'],
  ['Jones DAO', 'DeFi', ['DeFi', 'Yield'], ['Arbitrum'], 'Yield strategy and options-based vault protocol.', 'https://jonesdao.io', 'https://app.jonesdao.io', 2022, 'Metaverse', 'JONES', 'https://x.com/JonesDAO_io'],
  ['Arrakis Finance', 'DeFi', ['DeFi', 'Liquidity'], ['Ethereum', 'Base'], 'Onchain market-making and LP strategy infrastructure.', 'https://arrakis.finance', 'https://app.arrakis.finance', 2021, 'Metaverse', 'SPICE', 'https://x.com/ArrakisFinance'],
  ['Gamma Strategies', 'DeFi', ['DeFi', 'Liquidity'], ['Ethereum', 'Arbitrum', 'Polygon'], 'Automated liquidity management vaults for concentrated LPs.', 'https://gamma.xyz', 'https://app.gamma.xyz', 2021, 'Metaverse', 'GAMMA', 'https://x.com/GammaStrategies'],
  ['Enzyme Finance', 'DeFi', ['DeFi', 'Asset Management'], ['Ethereum', 'Polygon'], 'Onchain asset management and vault infrastructure.', 'https://enzyme.finance', 'https://app.enzyme.finance', 2019, 'Switzerland', 'MLN', 'https://x.com/enzymefinance'],
  ['Idle Finance', 'DeFi', ['DeFi', 'Yield'], ['Ethereum'], 'Yield optimization and fixed-income DeFi products.', 'https://idle.finance', 'https://app.idle.finance', 2019, 'Italy', 'IDLE', 'https://x.com/idlefinance'],
  ['BarnBridge', 'DeFi', ['DeFi', 'Yield'], ['Ethereum'], 'Risk tranching and yield-structured DeFi protocol.', 'https://barnbridge.com', 'https://app.barnbridge.com', 2020, 'United States', 'BOND', 'https://x.com/Barn_Bridge'],

  ['Kusama', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Kusama'], 'Canary network ecosystem for Polkadot-native innovation.', 'https://kusama.network', 'https://kusama.network/ecosystem', 2019, 'Metaverse', 'KSM', 'https://x.com/KusamaNetwork'],
  ['Acala', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'DeFi'], ['Polkadot'], 'DeFi-focused parachain with stable asset infrastructure.', 'https://acala.network', 'https://apps.acala.network', 2021, 'Singapore', 'ACA', 'https://x.com/AcalaNetwork'],
  ['Flare', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Flare'], 'L1 ecosystem focused on data access for smart contracts.', 'https://flare.network', 'https://flare.network/build', 2023, 'United Kingdom', 'FLR', 'https://x.com/FlareNetworks'],
  ['Rootstock', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Bitcoin'], ['Bitcoin'], 'Smart contract platform secured by Bitcoin mining.', 'https://rootstock.io', 'https://rootstock.io/developers', 2018, 'Argentina', 'RBTC', 'https://x.com/rootstock_io'],
  ['Syscoin', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Syscoin'], 'Hybrid blockchain ecosystem with data and value layers.', 'https://syscoin.org', 'https://syscoin.org/ecosystem', 2014, 'Canada', 'SYS', 'https://x.com/syscoin'],
  ['Taraxa', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Taraxa'], 'Public ledger focused on real-world event data anchoring.', 'https://www.taraxa.io', 'https://www.taraxa.io/build', 2021, 'United States', 'TARA', 'https://x.com/taraxa_project'],
  ['Alephium', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Alephium'], 'Sharded UTXO blockchain with smart contract support.', 'https://alephium.org', 'https://alephium.org/ecosystem', 2021, 'Switzerland', 'ALPH', 'https://x.com/alephium'],
  ['Coreum', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'RWA'], ['Coreum'], 'Enterprise-ready L1 ecosystem with asset tokenization features.', 'https://www.coreum.com', 'https://www.coreum.com/ecosystem', 2023, 'Switzerland', 'COREUM', 'https://x.com/CoreumOfficial'],
  ['Nibiru', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'DeFi'], ['Nibiru'], 'L1 focused on DeFi-native infrastructure and app growth.', 'https://nibiru.fi', 'https://nibiru.fi/ecosystem', 2024, 'United States', 'NIBI', 'https://x.com/NibiruChain'],
  ['Canto', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'DeFi'], ['Canto'], 'EVM-compatible L1 ecosystem with public utility emphasis.', 'https://canto.io', 'https://canto.io/ecosystem', 2022, 'Metaverse', 'CANTO', 'https://x.com/CantoPublic'],

  ['Goldsky', 'Infrastructure', ['Infrastructure', 'Data & Analytics'], ['Ethereum', 'Arbitrum', 'Multiple'], 'Real-time indexing and data pipelines for web3 developers.', 'https://goldsky.com', 'https://goldsky.com/docs', 2022, 'United States', 'n/a', 'https://x.com/goldskyio'],
  ['Envio', 'Infrastructure', ['Infrastructure', 'Data & Analytics'], ['Ethereum', 'Arbitrum', 'Multiple'], 'Hyperindexing infrastructure for blockchain applications.', 'https://envio.dev', 'https://docs.envio.dev', 2023, 'United States', 'n/a', 'https://x.com/envio_indexer'],
  ['Tatum', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Multiple'], 'Blockchain API platform for rapid product integrations.', 'https://tatum.io', 'https://docs.tatum.io', 2018, 'Czech Republic', 'n/a', 'https://x.com/tatum_io'],
  ['dRPC', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Solana', 'Multiple'], 'Decentralized RPC marketplace and connectivity layer.', 'https://drpc.org', 'https://drpc.org/docs', 2023, 'Singapore', 'n/a', 'https://x.com/drpcorg'],
  ['0G Labs', 'Infrastructure', ['Infrastructure', 'Data Availability'], ['0G'], 'Modular AI and data availability infrastructure stack.', 'https://0g.ai', 'https://0g.ai/developers', 2024, 'United States', 'n/a', 'https://x.com/0G_labs'],
  ['Calimero', 'Infrastructure', ['Infrastructure', 'Privacy'], ['NEAR', 'Ethereum'], 'Private shard and app-specific infrastructure framework.', 'https://calimero.network', 'https://calimero.network/docs', 2022, 'Netherlands', 'n/a', 'https://x.com/calimero_network'],
  ['Nodle', 'Infrastructure', ['Infrastructure', 'IoT'], ['Polkadot'], 'Decentralized network for IoT data and connectivity.', 'https://www.nodle.com', 'https://www.nodle.com/network', 2018, 'France', 'NODL', 'https://x.com/NodleNetwork'],
  ['ComposeDB', 'Infrastructure', ['Infrastructure', 'Data'], ['Ethereum'], 'Composable decentralized data models in Ceramic ecosystem.', 'https://developers.ceramic.network', 'https://developers.ceramic.network/docs/composedb', 2023, 'United States', 'n/a', 'https://x.com/ceramicnetwork'],
  ['Ceramic', 'Infrastructure', ['Infrastructure', 'Data'], ['Ethereum'], 'Decentralized data network for user-owned application data.', 'https://ceramic.network', 'https://developers.ceramic.network', 2021, 'United States', 'n/a', 'https://x.com/ceramicnetwork'],
  ['Tableland', 'Infrastructure', ['Infrastructure', 'Data'], ['Ethereum', 'Polygon'], 'Decentralized SQL database for smart contract applications.', 'https://tableland.xyz', 'https://docs.tableland.xyz', 2022, 'United States', 'n/a', 'https://x.com/tableland'],

  ['Lookonchain', 'Data & Analytics', ['Data & Analytics', 'Intelligence'], ['Ethereum', 'Solana', 'Multiple'], 'Onchain intelligence and whale tracking platform.', 'https://lookonchain.com', 'https://lookonchain.com/dashboard', 2022, 'Metaverse', 'n/a', 'https://x.com/lookonchain'],
  ['Nansen Alpha', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Institutional and pro research layer from Nansen.', 'https://www.nansen.ai', 'https://www.nansen.ai/alpha', 2022, 'Singapore', 'n/a', 'https://x.com/nansen_ai'],
  ['Artemis Terminal', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Cross-ecosystem growth and performance analytics dashboard.', 'https://www.artemis.xyz', 'https://www.artemis.xyz/terminal', 2023, 'United States', 'n/a', 'https://x.com/artemis_hq'],
  ['Growthepie', 'Data & Analytics', ['Data & Analytics', 'Layer 1 / Layer 2'], ['Ethereum'], 'Analytics platform focused on L2 ecosystem metrics.', 'https://www.growthepie.xyz', 'https://www.growthepie.xyz/chains', 2023, 'Germany', 'n/a', 'https://x.com/growthepie_eth'],
  ['TokenLogic', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Tokenomics and treasury analytics for crypto organizations.', 'https://tokenlogic.xyz', 'https://tokenlogic.xyz/research', 2023, 'Metaverse', 'n/a', 'https://x.com/tokenlogicxyz'],

  ['Immunebytes', 'Security', ['Security', 'Auditing'], ['Ethereum', 'BSC', 'Multiple'], 'Smart contract audit and blockchain security provider.', 'https://immunebytes.com', 'https://immunebytes.com/services', 2020, 'India', 'n/a', 'https://x.com/immunebytes'],
  ['HackenProof', 'Security', ['Security', 'Bug Bounty'], ['Ethereum', 'Multiple'], 'Bug bounty platform and security coordination service.', 'https://hackenproof.com', 'https://hackenproof.com/programs', 2018, 'Estonia', 'n/a', 'https://x.com/hackenproof'],
  ['Quick Intel', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'BSC', 'Multiple'], 'Realtime token and contract risk intelligence platform.', 'https://quickintel.io', 'https://quickintel.io/app', 2022, 'United States', 'n/a', 'https://x.com/QuickIntel_io'],
  ['SolidProof', 'Security', ['Security', 'Auditing'], ['Ethereum', 'BSC', 'Multiple'], 'Security audit provider for smart contracts and tokens.', 'https://solidproof.io', 'https://solidproof.io/services', 2021, 'Germany', 'n/a', 'https://x.com/SolidProof_io'],
  ['Verichains', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Solana', 'Multiple'], 'Security services firm for blockchain infrastructure and applications.', 'https://verichains.io', 'https://verichains.io/services', 2017, 'Vietnam', 'n/a', 'https://x.com/verichains'],

  ['Braavos', 'Wallets', ['Wallets'], ['Starknet'], 'Smart contract wallet with account abstraction features.', 'https://braavos.app', 'https://braavos.app/download', 2022, 'Israel', 'n/a', 'https://x.com/myBraavos'],
  ['Nightly Wallet', 'Wallets', ['Wallets'], ['Solana', 'Sui', 'Aptos'], 'Cross-chain wallet for next-gen ecosystems.', 'https://nightly.app', 'https://nightly.app/download', 2022, 'Czech Republic', 'n/a', 'https://x.com/Nightly_app'],
  ['Frontier Wallet', 'Wallets', ['Wallets'], ['Ethereum', 'Solana', 'Multiple'], 'Mobile wallet and DeFi aggregation interface.', 'https://www.frontier.xyz', 'https://www.frontier.xyz/download', 2019, 'India', 'FRONT', 'https://x.com/FrontierDotXYZ'],
  ['Xaman', 'Wallets', ['Wallets'], ['XRP Ledger'], 'Wallet and identity hub for XRP Ledger ecosystem.', 'https://xaman.app', 'https://xaman.app/download', 2023, 'Netherlands', 'n/a', 'https://x.com/XamanWallet'],

  ['Bitrefill', 'Payments', ['Payments'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Crypto commerce platform for gift cards and bills.', 'https://www.bitrefill.com', 'https://www.bitrefill.com', 2014, 'Sweden', 'n/a', 'https://x.com/bitrefill'],
  ['Flexa', 'Payments', ['Payments', 'Infrastructure'], ['Ethereum'], 'Merchant payments network for digital assets.', 'https://flexa.network', 'https://flexa.network/merchant', 2018, 'United States', 'AMP', 'https://x.com/flexahq'],
  ['OpenNode', 'Payments', ['Payments', 'Bitcoin'], ['Bitcoin'], 'Bitcoin payment processing and settlement infrastructure.', 'https://opennode.com', 'https://opennode.com/business', 2018, 'United States', 'n/a', 'https://x.com/opennode'],
  ['IvendPay', 'Payments', ['Payments', 'Infrastructure'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Crypto payment terminals and merchant checkout infrastructure.', 'https://ivendpay.com', 'https://ivendpay.com/products', 2022, 'United Arab Emirates', 'n/a', 'https://x.com/IvendPay'],

  ['Casa', 'Custody', ['Custody', 'Security'], ['Bitcoin'], 'Self-custody and key management services for Bitcoin holders.', 'https://casa.io', 'https://casa.io/for-individuals', 2016, 'United States', 'n/a', 'https://x.com/CasaHODL'],
  ['Unchained', 'Custody', ['Custody', 'Bitcoin'], ['Bitcoin'], 'Bitcoin-native custody and financial services platform.', 'https://unchained.com', 'https://unchained.com/services', 2016, 'United States', 'n/a', 'https://x.com/unchainedcom'],
  ['Nunchuk', 'Custody', ['Custody', 'Bitcoin'], ['Bitcoin'], 'Multisig wallet and collaborative custody platform for Bitcoin.', 'https://nunchuk.io', 'https://nunchuk.io/download', 2020, 'Singapore', 'n/a', 'https://x.com/nunchuk_io'],

  ['Space ID', 'Identity', ['Identity'], ['Ethereum', 'BNB Chain'], 'Multi-chain name service and identity protocol.', 'https://space.id', 'https://space.id/name', 2022, 'Singapore', 'ID', 'https://x.com/SpaceIDProtocol'],
  ['DID.id', 'Identity', ['Identity'], ['Kusama', 'Polkadot'], 'Decentralized identity protocol and DID toolkit.', 'https://www.did.id', 'https://www.did.id/docs', 2021, 'Metaverse', 'n/a', 'https://x.com/dotdid'],

  ['Coordinape', 'DAOs & Governance', ['DAOs & Governance'], ['Ethereum'], 'Peer allocation and contributor reward tooling for DAOs.', 'https://coordinape.com', 'https://coordinape.com/product', 2021, 'United States', 'n/a', 'https://x.com/coordinape'],
  ['CharmVerse Governance', 'DAOs & Governance', ['DAOs & Governance', 'Developer Tools'], ['Ethereum', 'Multiple'], 'Governance modules and collaboration stack for onchain communities.', 'https://charmverse.io', 'https://charmverse.io/governance', 2022, 'United States', 'n/a', 'https://x.com/charmverse'],

  ['PREMINT', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Ethereum'], 'Creator and collector tooling for NFT campaigns and allowlists.', 'https://www.premint.xyz', 'https://www.premint.xyz/collectors', 2021, 'United States', 'n/a', 'https://x.com/PREMINT_NFT'],
  ['HeyMint', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Ethereum', 'Base'], 'No-code NFT launch and community campaign platform.', 'https://heymint.xyz', 'https://heymint.xyz/create', 2022, 'United States', 'n/a', 'https://x.com/heymintxyz'],
  ['Transient Labs', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Ethereum'], 'Creator tools and protocol infrastructure for programmable media.', 'https://transientlabs.xyz', 'https://transientlabs.xyz/products', 2021, 'United States', 'n/a', 'https://x.com/transientlabs'],

  ['Star Atlas', 'Gaming', ['Gaming'], ['Solana'], 'Space strategy gaming ecosystem with onchain assets.', 'https://staratlas.com', 'https://staratlas.com/play', 2021, 'United States', 'ATLAS', 'https://x.com/staratlas'],
  ['Aurory', 'Gaming', ['Gaming'], ['Solana'], 'Creature collection gaming ecosystem with tokenized assets.', 'https://aurory.io', 'https://aurory.io/games', 2021, 'France', 'AURY', 'https://x.com/AuroryProject'],
  ['DeFi Kingdoms', 'Gaming', ['Gaming', 'DeFi'], ['Avalanche'], 'Gamefi ecosystem blending RPG gameplay with DeFi mechanics.', 'https://defikingdoms.com', 'https://defikingdoms.com/play', 2021, 'Metaverse', 'JEWEL', 'https://x.com/DefiKingdoms'],
  ['Gods Unchained', 'Gaming', ['Gaming'], ['Immutable', 'Ethereum'], 'Trading card game ecosystem with onchain ownership.', 'https://godsunchained.com', 'https://godsunchained.com/play', 2019, 'Australia', 'GODS', 'https://x.com/GodsUnchained']
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

