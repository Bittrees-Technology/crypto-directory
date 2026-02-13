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
  ['Across Prime', 'DeFi', ['DeFi', 'Cross-chain'], ['Ethereum', 'Arbitrum', 'Base'], 'Cross-chain transfer and settlement interface for professional users.', 'https://across.to', 'https://across.to/bridge', 2024, 'United States', 'ACX', 'https://x.com/AcrossProtocol'],
  ['Swaap', 'DeFi', ['DeFi', 'DEX'], ['Ethereum'], 'Market maker and AMM protocol for institutional-grade liquidity.', 'https://www.swaap.finance', 'https://www.swaap.finance/app', 2022, 'France', 'SWAAP', 'https://x.com/SwaapFinance'],
  ['Mavryk', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'Layer 1 / Layer 2'], ['Mavryk'], 'Tokenization-focused blockchain ecosystem for real-world assets.', 'https://www.mavryk.org', 'https://www.mavryk.org/ecosystem', 2024, 'Switzerland', 'n/a', 'https://x.com/MavrykNetwork'],
  ['Etherlink', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Tezos'], 'EVM-compatible L2 ecosystem in Tezos stack.', 'https://etherlink.com', 'https://etherlink.com/build', 2024, 'Switzerland', 'n/a', 'https://x.com/etherlink'],
  ['Neutron', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Cosmos'], 'Cosmos appchain ecosystem for smart contracts and DeFi.', 'https://neutron.org', 'https://neutron.org/ecosystem', 2023, 'Metaverse', 'NTRN', 'https://x.com/Neutron_org'],
  ['Stride', 'DeFi', ['DeFi', 'Staking'], ['Cosmos'], 'Liquid staking protocol for Cosmos ecosystem assets.', 'https://stride.zone', 'https://app.stride.zone', 2022, 'Metaverse', 'STRD', 'https://x.com/stride_zone'],
  ['Quasar', 'DeFi', ['DeFi', 'Asset Management'], ['Cosmos'], 'Cross-chain asset management and vault protocol.', 'https://quasar.fi', 'https://app.quasar.fi', 2023, 'Metaverse', 'QSR', 'https://x.com/quasarfi'],
  ['Mars Protocol', 'DeFi', ['DeFi', 'Lending'], ['Cosmos'], 'Credit and lending protocol in Cosmos ecosystem.', 'https://marsprotocol.io', 'https://app.marsprotocol.io', 2022, 'Metaverse', 'MARS', 'https://x.com/mars_protocol'],
  ['Helix', 'DeFi', ['DeFi', 'DEX'], ['Injective'], 'Orderbook exchange protocol in Injective ecosystem.', 'https://helixapp.com', 'https://helixapp.com/trade', 2023, 'Metaverse', 'n/a', 'https://x.com/helixapp_'],
  ['DojoSwap', 'DeFi', ['DeFi', 'DEX'], ['Injective'], 'AMM and liquidity protocol on Injective.', 'https://dojoswap.xyz', 'https://dojoswap.xyz/swap', 2023, 'Metaverse', 'DOJO', 'https://x.com/Dojo_Swap'],
  ['Hydro Protocol', 'DeFi', ['DeFi', 'Orderbook'], ['Injective'], 'Liquidity and market infrastructure for Injective ecosystem.', 'https://hydroprotocol.finance', 'https://hydroprotocol.finance/app', 2024, 'Metaverse', 'n/a', 'https://x.com/Hydro_Protocol'],
  ['Namada', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Privacy'], ['Namada'], 'Privacy-preserving proof-of-stake chain ecosystem.', 'https://namada.net', 'https://namada.net/ecosystem', 2024, 'Switzerland', 'n/a', 'https://x.com/namada'],
  ['Penumbra', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Privacy'], ['Penumbra'], 'Private DEX and shielded transaction network.', 'https://penumbra.zone', 'https://penumbra.zone/learn', 2024, 'Metaverse', 'n/a', 'https://x.com/penumbrazone'],
  ['Nym', 'Infrastructure', ['Infrastructure', 'Privacy'], ['Nym'], 'Privacy infrastructure and mixnet network for metadata protection.', 'https://nymtech.net', 'https://nymtech.net/products', 2018, 'Switzerland', 'NYM', 'https://x.com/nymproject'],
  ['Mysterium', 'Infrastructure', ['Infrastructure', 'Privacy'], ['Ethereum'], 'Decentralized VPN and privacy network marketplace.', 'https://www.mysterium.network', 'https://www.mysterium.network/products', 2017, 'Switzerland', 'MYST', 'https://x.com/MysteriumNet'],
  ['Aleo Wallet', 'Wallets', ['Wallets'], ['Aleo'], 'Wallet ecosystem for Aleo users and developers.', 'https://aleo.org/ecosystem#wallets', 'https://aleo.org/ecosystem#wallets', 2024, 'Metaverse', 'n/a', 'https://x.com/AleoHQ'],
  ['Leapfrog Wallet', 'Wallets', ['Wallets'], ['Sui'], 'Consumer wallet experience for Sui ecosystem.', 'https://leapfrogwallet.xyz', 'https://leapfrogwallet.xyz/download', 2024, 'Metaverse', 'n/a', 'https://x.com/leapfrogwallet'],
  ['Nuon', 'DeFi', ['DeFi', 'Stablecoin'], ['Ethereum'], 'Flatcoin protocol aiming for inflation-resistant assets.', 'https://nuon.fi', 'https://app.nuon.fi', 2023, 'Metaverse', 'NUON', 'https://x.com/nuonfinance'],
  ['Sperax', 'DeFi', ['DeFi', 'Stablecoin'], ['Arbitrum'], 'Stablecoin and yield ecosystem for Arbitrum users.', 'https://www.sperax.io', 'https://app.sperax.io', 2020, 'United States', 'SPA', 'https://x.com/SperaxUSD'],
  ['Cypher Capital Markets', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional brokerage and market services for digital assets.', 'https://cyphercm.com', 'https://cyphercm.com/services', 2022, 'United Arab Emirates', 'n/a', 'https://x.com/cyphercapitals'],
  ['B2C2', 'Payments', ['Payments', 'Liquidity'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional digital asset liquidity and execution provider.', 'https://www.b2c2.com', 'https://www.b2c2.com/services', 2015, 'United Kingdom', 'n/a', 'https://x.com/b2c2group'],
  ['Wintermute', 'Payments', ['Payments', 'Liquidity'], ['Ethereum', 'Multiple'], 'Global digital asset market maker and liquidity provider.', 'https://www.wintermute.com', 'https://www.wintermute.com/services', 2017, 'United Kingdom', 'n/a', 'https://x.com/wintermute_t'],
  ['GSR', 'Payments', ['Payments', 'Liquidity'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional crypto trading, liquidity, and investment firm.', 'https://www.gsr.io', 'https://www.gsr.io/services', 2013, 'United States', 'n/a', 'https://x.com/GSR_io'],
  ['FalconX', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional digital asset prime brokerage platform.', 'https://www.falconx.io', 'https://www.falconx.io/products', 2018, 'United States', 'n/a', 'https://x.com/falconxnetwork'],
  ['Cumberland', 'Payments', ['Payments', 'Liquidity'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Institutional OTC liquidity provider for digital assets.', 'https://cumberland.io', 'https://cumberland.io/services', 2014, 'United States', 'n/a', 'https://x.com/cumberlandDRW'],
  ['BitMEX Custody', 'Custody', ['Custody', 'Infrastructure'], ['Bitcoin', 'Ethereum'], 'Custody services linked to BitMEX institutional offerings.', 'https://www.bitmex.com/custody', 'https://www.bitmex.com/custody', 2024, 'Seychelles', 'n/a', 'https://x.com/BitMEX'],
  ['Hex Trust Prime', 'Custody', ['Custody', 'Payments'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Prime brokerage and custody services for institutions.', 'https://hextrust.com', 'https://hextrust.com/prime', 2023, 'Hong Kong', 'n/a', 'https://x.com/Hex_Trust'],
  ['Notabene', 'Identity', ['Identity', 'Compliance'], ['Ethereum', 'Multiple'], 'Travel Rule and identity compliance infrastructure for VASPs.', 'https://www.notabene.id', 'https://www.notabene.id/platform', 2020, 'United States', 'n/a', 'https://x.com/notabene_id'],
  ['Sardine', 'Identity', ['Identity', 'Compliance'], ['Ethereum', 'Multiple'], 'Fraud prevention and identity infrastructure for web3 onboarding.', 'https://www.sardine.ai', 'https://www.sardine.ai/products', 2020, 'United States', 'n/a', 'https://x.com/sardine'],
  ['Persona', 'Identity', ['Identity', 'Compliance'], ['Ethereum', 'Multiple'], 'Identity verification and KYB/KYC platform for web3 apps.', 'https://withpersona.com', 'https://withpersona.com/products', 2018, 'United States', 'n/a', 'https://x.com/withpersona'],
  ['Tally Governance API', 'Developer Tools', ['Developer Tools', 'DAOs & Governance'], ['Ethereum', 'Base', 'Arbitrum'], 'Developer APIs and governance data products from Tally.', 'https://www.tally.xyz', 'https://www.tally.xyz/api', 2023, 'United States', 'n/a', 'https://x.com/tallyxyz'],
  ['Snapshot X', 'DAOs & Governance', ['DAOs & Governance', 'Infrastructure'], ['Ethereum'], 'Onchain governance execution framework within Snapshot ecosystem.', 'https://snapshot.org', 'https://snapshot.org/#/x', 2024, 'France', 'n/a', 'https://x.com/SnapshotLabs'],
  ['Metalabel', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Ethereum'], 'Tooling and marketplaces for creative collectives.', 'https://www.metalabel.com', 'https://www.metalabel.com/explore', 2023, 'United States', 'n/a', 'https://x.com/metalabel_'],
  ['Bonfire', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Base', 'Ethereum'], 'Creator-focused minting and community infrastructure.', 'https://www.bonfire.xyz', 'https://www.bonfire.xyz/tools', 2023, 'United States', 'n/a', 'https://x.com/bonfire_xyz'],
  ['Mocana Gaming', 'Gaming', ['Gaming'], ['Immutable', 'Ethereum'], 'Web3 gaming studio and ecosystem publisher.', 'https://mocanagaming.com', 'https://mocanagaming.com/games', 2024, 'Metaverse', 'n/a', 'https://x.com/mocanagaming'],
  ['Parallelland', 'Gaming', ['Gaming'], ['Base'], 'Onchain gaming world and player-owned assets ecosystem.', 'https://parallelland.xyz', 'https://parallelland.xyz/play', 2024, 'Metaverse', 'n/a', 'https://x.com/parallelland'],
  ['Blocklords', 'Gaming', ['Gaming'], ['Immutable'], 'Medieval strategy game ecosystem with tokenized assets.', 'https://blocklords.com', 'https://blocklords.com/play', 2023, 'United Kingdom', 'LRDS', 'https://x.com/blocklords'],
  ['Helika', 'Gaming', ['Gaming', 'Data & Analytics'], ['Ethereum', 'Solana'], 'Analytics and growth infrastructure for web3 games.', 'https://www.helika.io', 'https://www.helika.io/products', 2022, 'United States', 'n/a', 'https://x.com/HelikaIO'],
  ['Nod Games', 'Gaming', ['Gaming'], ['Solana'], 'Mobile and social web3 gaming publisher ecosystem.', 'https://nodgames.io', 'https://nodgames.io/games', 2023, 'Singapore', 'n/a', 'https://x.com/nodgames_io'],
  ['PlayEmber', 'Gaming', ['Gaming'], ['Ethereum'], 'Casual gaming platform experimenting with onchain ownership.', 'https://playember.com', 'https://playember.com/games', 2023, 'Metaverse', 'n/a', 'https://x.com/playember']
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

