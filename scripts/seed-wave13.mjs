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
  ['Nouns DAO', 'DAOs & Governance', ['DAOs & Governance', 'Community'], ['Ethereum'], 'Community-owned DAO centered on Nouns NFT governance and public goods.', 'https://nouns.wtf', 'https://nouns.wtf/vote', 2021, 'Metaverse', 'n/a', 'https://x.com/nounsdao'],
  ['BanklessDAO', 'DAOs & Governance', ['DAOs & Governance', 'Media'], ['Ethereum'], 'Decentralized media and contributor DAO focused on crypto education and coordination.', 'https://bankless.community', 'https://bankless.community/join', 2021, 'Metaverse', 'BANK', 'https://x.com/banklessDAO'],
  ['Friends With Benefits', 'DAOs & Governance', ['DAOs & Governance', 'Community'], ['Ethereum'], 'Token-gated cultural collective and DAO for creators and builders.', 'https://www.fwb.help', 'https://www.fwb.help/membership', 2020, 'United States', 'FWB', 'https://x.com/fwbDAO'],
  ['Cabin', 'DAOs & Governance', ['DAOs & Governance', 'Community'], ['Ethereum'], 'Network city and community coordination project with onchain governance.', 'https://cabin.city', 'https://cabin.city/join', 2021, 'United States', 'n/a', 'https://x.com/CabinDAO'],
  ['PleasrDAO', 'DAOs & Governance', ['DAOs & Governance', 'Community'], ['Ethereum'], 'Collector and community DAO focused on culturally significant digital assets.', 'https://pleasr.org', 'https://pleasr.org/projects', 2021, 'Metaverse', 'n/a', 'https://x.com/PleasrDAO'],
  ['OpenSats', 'DAOs & Governance', ['DAOs & Governance', 'Public Goods'], ['Bitcoin'], 'Nonprofit supporting open-source Bitcoin and Nostr contributors via grants.', 'https://opensats.org', 'https://opensats.org/grants', 2022, 'United States', 'n/a', 'https://x.com/OpenSats'],
  ['Gitcoin', 'DAOs & Governance', ['DAOs & Governance', 'Public Goods'], ['Ethereum'], 'Public goods funding and grants ecosystem for web3 builders.', 'https://www.gitcoin.co', 'https://www.gitcoin.co/grants', 2017, 'United States', 'GTC', 'https://x.com/gitcoin'],
  ['Developer DAO', 'DAOs & Governance', ['DAOs & Governance', 'Developer Tools'], ['Ethereum'], 'Developer-focused DAO for education, collaboration, and opportunities.', 'https://www.developerdao.com', 'https://www.developerdao.com/membership', 2021, 'United States', 'n/a', 'https://x.com/developer_dao'],

  ['Art Blocks', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Ethereum'], 'Generative art platform and marketplace for artists and collectors.', 'https://www.artblocks.io', 'https://www.artblocks.io/collections', 2020, 'United States', 'n/a', 'https://x.com/artblocks_io'],
  ['OnCyber', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Creator Tools'], ['Ethereum'], 'Immersive 3D world creation platform for digital communities and assets.', 'https://oncyber.io', 'https://oncyber.io/spaces', 2021, 'United States', 'n/a', 'https://x.com/oncyber'],

  ['Lightning Labs', 'Infrastructure', ['Infrastructure', 'Bitcoin'], ['Bitcoin'], 'Core Lightning Network infrastructure company building developer protocols and tools.', 'https://lightning.engineering', 'https://lightning.engineering/products', 2016, 'United States', 'n/a', 'https://x.com/lightning'],
  ['Voltage', 'Infrastructure', ['Infrastructure', 'Bitcoin'], ['Bitcoin'], 'Managed Lightning and Bitcoin infrastructure for businesses and developers.', 'https://voltage.cloud', 'https://voltage.cloud/products', 2020, 'United States', 'n/a', 'https://x.com/voltage_cloud'],
  ['Amboss', 'Infrastructure', ['Infrastructure', 'Bitcoin'], ['Bitcoin'], 'Lightning Network analytics, liquidity, and routing marketplace platform.', 'https://amboss.space', 'https://amboss.space/magma', 2021, 'Germany', 'n/a', 'https://x.com/ambosstech'],
  ['Alby', 'Wallets', ['Wallets', 'Bitcoin'], ['Bitcoin'], 'Bitcoin Lightning wallet and web integration ecosystem.', 'https://getalby.com', 'https://getalby.com/products', 2021, 'Germany', 'n/a', 'https://x.com/getAlby'],
  ['Breez', 'Payments', ['Payments', 'Bitcoin'], ['Bitcoin'], 'Lightning payments SDK and wallet infrastructure for apps.', 'https://breez.technology', 'https://breez.technology/sdk', 2018, 'Israel', 'n/a', 'https://x.com/Breez_Tech'],
  ['Lightspark', 'Payments', ['Payments', 'Bitcoin'], ['Bitcoin'], 'Bitcoin Lightning enterprise payments infrastructure platform.', 'https://www.lightspark.com', 'https://www.lightspark.com/products', 2022, 'United States', 'n/a', 'https://x.com/lightspark'],
  ['Galoy', 'Infrastructure', ['Infrastructure', 'Payments'], ['Bitcoin'], 'Open-source Bitcoin banking and payments infrastructure provider.', 'https://galoy.io', 'https://galoy.io/solutions', 2019, 'United States', 'n/a', 'https://x.com/GaloyMoney'],
  ['BTCPay Server', 'Payments', ['Payments', 'Infrastructure'], ['Bitcoin'], 'Open-source self-hosted Bitcoin payment processor.', 'https://btcpayserver.org', 'https://btcpayserver.org/use-cases', 2017, 'Metaverse', 'n/a', 'https://x.com/btcpayserver'],
  ['Fedi', 'Wallets', ['Wallets', 'Bitcoin'], ['Bitcoin'], 'Federated Bitcoin app and custody stack for communities.', 'https://fedi.xyz', 'https://fedi.xyz/products', 2023, 'United States', 'n/a', 'https://x.com/fedibtc'],
  ['Fedimint', 'Infrastructure', ['Infrastructure', 'Bitcoin'], ['Bitcoin'], 'Open-source federated custody and payments protocol.', 'https://fedimint.org', 'https://fedimint.org/docs', 2022, 'Metaverse', 'n/a', 'https://x.com/fedimint'],
  ['Zaprite', 'Payments', ['Payments', 'Infrastructure'], ['Bitcoin'], 'Bitcoin invoicing and payments platform for merchants and creators.', 'https://zaprite.com', 'https://zaprite.com/features', 2022, 'United States', 'n/a', 'https://x.com/zapriteapp'],
  ['Fold', 'Payments', ['Payments', 'Bitcoin'], ['Bitcoin'], 'Bitcoin rewards and payments platform for consumers.', 'https://foldapp.com', 'https://foldapp.com/card', 2019, 'United States', 'n/a', 'https://x.com/fold_app']
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
