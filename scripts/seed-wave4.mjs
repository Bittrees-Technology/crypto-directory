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
  ['Pendulum', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'Payments'], ['Polkadot'], 'Network focused on bridging traditional finance rails with DeFi.', 'https://pendulumchain.org', 'https://pendulumchain.org/ecosystem', 2021, 'Germany', 'PEN', 'https://x.com/pendulum_chain'],
  ['Canton Network', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'Infrastructure'], ['Canton'], 'Institutional blockchain network for tokenized financial markets.', 'https://canton.network', 'https://canton.network/learn', 2023, 'United States', 'n/a', 'https://x.com/CantonNetwork'],
  ['Archax', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'Exchange'], ['Ethereum'], 'Regulated digital asset exchange and tokenization platform.', 'https://archax.com', 'https://archax.com/platform', 2018, 'United Kingdom', 'n/a', 'https://x.com/ArchaxEx'],
  ['INX', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'Exchange'], ['Ethereum'], 'Regulated marketplace for digital securities and tokenized assets.', 'https://www.inx.co', 'https://www.inx.co/trading', 2017, 'United States', 'INX', 'https://x.com/INX_Group'],
  ['Propbase', 'Real World Assets (RWA)', ['Real World Assets (RWA)'], ['Aptos'], 'Real estate tokenization platform for fractional ownership.', 'https://propbase.app', 'https://propbase.app/properties', 2023, 'Singapore', 'PROPS', 'https://x.com/PropbaseApp'],
  ['Midas', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'DeFi'], ['Ethereum'], 'Tokenized yield and treasury strategy products for onchain users.', 'https://midas.app', 'https://midas.app/products', 2022, 'Metaverse', 'n/a', 'https://x.com/MidasRWA'],
  ['Anzen', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'DeFi'], ['Ethereum'], 'Protocol offering collateralized real-world credit exposure onchain.', 'https://anzen.finance', 'https://anzen.finance/app', 2024, 'Metaverse', 'n/a', 'https://x.com/anzenfinance'],
  ['Superstate', 'Real World Assets (RWA)', ['Real World Assets (RWA)'], ['Ethereum', 'Solana'], 'Asset management firm building tokenized regulated investment products.', 'https://superstate.co', 'https://superstate.co/products', 2023, 'United States', 'n/a', 'https://x.com/superstatefunds'],
  ['Maple Institutional', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'Lending'], ['Ethereum'], 'Institutional credit products bridging real-world borrowing and onchain capital.', 'https://maple.finance', 'https://maple.finance/institutional', 2021, 'Australia', 'SYRUP', 'https://x.com/maplefinance'],
  ['OpenEden', 'Real World Assets (RWA)', ['Real World Assets (RWA)', 'DeFi'], ['Ethereum'], 'Tokenized treasury and institutional-grade onchain fixed-income products.', 'https://openeden.com', 'https://openeden.com/products', 2022, 'Singapore', 'n/a', 'https://x.com/OpenEden_Labs'],

  ['OKLink', 'Data & Analytics', ['Data & Analytics', 'Explorer'], ['Bitcoin', 'Ethereum', 'Multiple'], 'Blockchain explorer and data analytics platform.', 'https://www.oklink.com', 'https://www.oklink.com/explorer', 2019, 'Seychelles', 'n/a', 'https://x.com/OKLink'],
  ['Arkham Oracle', 'Data & Analytics', ['Data & Analytics', 'Intelligence'], ['Ethereum', 'Bitcoin'], 'Entity and wallet intelligence products for onchain investigations.', 'https://arkhamintelligence.com', 'https://platform.arkhamintelligence.com', 2020, 'United Kingdom', 'ARKM', 'https://x.com/arkham'],
  ['Breadcrumbs', 'Data & Analytics', ['Data & Analytics', 'Compliance'], ['Ethereum', 'Multiple'], 'Visual blockchain analytics platform for investigations and compliance.', 'https://www.breadcrumbs.app', 'https://www.breadcrumbs.app/pricing', 2019, 'United States', 'n/a', 'https://x.com/breadcrumbsapp'],
  ['TRM Labs', 'Data & Analytics', ['Data & Analytics', 'Compliance'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Blockchain intelligence platform for compliance and risk teams.', 'https://www.trmlabs.com', 'https://www.trmlabs.com/platform', 2018, 'United States', 'n/a', 'https://x.com/trmlabs'],
  ['Chainalysis', 'Data & Analytics', ['Data & Analytics', 'Compliance'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Blockchain intelligence and compliance tooling for institutions and governments.', 'https://www.chainalysis.com', 'https://www.chainalysis.com/product', 2014, 'United States', 'n/a', 'https://x.com/chainalysis'],
  ['Elliptic', 'Data & Analytics', ['Data & Analytics', 'Compliance'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Risk and AML analytics provider for digital asset businesses.', 'https://www.elliptic.co', 'https://www.elliptic.co/products', 2013, 'United Kingdom', 'n/a', 'https://x.com/elliptic'],
  ['Nansen Query', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Solana', 'Multiple'], 'Onchain SQL and dashboard products for blockchain analytics teams.', 'https://www.nansen.ai', 'https://www.nansen.ai/query', 2023, 'Singapore', 'n/a', 'https://x.com/nansen_ai'],
  ['TokenFlow', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum'], 'Transaction-level analytics tooling for protocol and market research.', 'https://tokenflow.live', 'https://tokenflow.live/dashboard', 2022, 'Metaverse', 'n/a', 'https://x.com/tokenflow_live'],
  ['Bubblemaps', 'Data & Analytics', ['Data & Analytics', 'Intelligence'], ['Ethereum', 'BNB Chain', 'Multiple'], 'Visualization platform for token holder and wallet relationship analysis.', 'https://www.bubblemaps.io', 'https://app.bubblemaps.io', 2021, 'France', 'BMT', 'https://x.com/bubblemaps'],
  ['DeBank', 'Data & Analytics', ['Data & Analytics', 'Wallets'], ['Ethereum', 'Base', 'Arbitrum'], 'Portfolio and social analytics platform for DeFi users.', 'https://debank.com', 'https://debank.com/profile', 2018, 'Metaverse', 'n/a', 'https://x.com/DebankDeFi'],

  ['BloXroute', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'BSC', 'Multiple'], 'High-performance blockchain connectivity and transaction propagation network.', 'https://bloxroute.com', 'https://bloxroute.com/products', 2018, 'United States', 'n/a', 'https://x.com/bloXrouteLabs'],
  ['Flashbots', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum'], 'Research and infrastructure organization focused on MEV and block building.', 'https://www.flashbots.net', 'https://docs.flashbots.net', 2020, 'United States', 'n/a', 'https://x.com/flashbots'],
  ['MEV Blocker', 'Infrastructure', ['Infrastructure', 'DeFi'], ['Ethereum'], 'Transaction routing product aimed at reducing harmful MEV for users.', 'https://mevblocker.io', 'https://mevblocker.io/#how', 2023, 'Metaverse', 'n/a', 'https://x.com/mevblocker'],
  ['Anoma', 'Infrastructure', ['Infrastructure', 'Privacy'], ['Anoma'], 'Intent-centric architecture for decentralized applications.', 'https://anoma.net', 'https://anoma.net/research', 2020, 'Switzerland', 'n/a', 'https://x.com/anoma'],
  ['Risc Zero', 'Infrastructure', ['Infrastructure', 'Zero Knowledge'], ['Ethereum'], 'Zero-knowledge virtual machine and proving infrastructure.', 'https://www.risczero.com', 'https://dev.risczero.com', 2022, 'United States', 'n/a', 'https://x.com/risczero'],
  ['Succinct', 'Infrastructure', ['Infrastructure', 'Zero Knowledge'], ['Ethereum'], 'ZK proof generation and interoperability infrastructure.', 'https://www.succinct.xyz', 'https://docs.succinct.xyz', 2022, 'United States', 'n/a', 'https://x.com/succinctlabs'],
  ['Aleo', 'Infrastructure', ['Infrastructure', 'Privacy'], ['Aleo'], 'Privacy-preserving blockchain platform and developer tools.', 'https://aleo.org', 'https://developer.aleo.org', 2024, 'United States', 'ALEO', 'https://x.com/AleoHQ'],
  ['Mina Foundation', 'Infrastructure', ['Infrastructure', 'Zero Knowledge'], ['Mina'], 'Ecosystem steward for lightweight zk-powered Mina protocol.', 'https://mina.foundation', 'https://minaprotocol.com', 2021, 'United States', 'MINA', 'https://x.com/minaprotocol'],
  ['EigenDA', 'Infrastructure', ['Infrastructure', 'Data Availability'], ['Ethereum'], 'Data availability service for rollups and modular blockchain stacks.', 'https://www.eigenda.xyz', 'https://www.eigenda.xyz/docs', 2024, 'United States', 'n/a', 'https://x.com/eigen_da'],
  ['Symbiotic', 'Infrastructure', ['Infrastructure', 'Restaking'], ['Ethereum'], 'Shared security and restaking coordination layer.', 'https://symbiotic.fi', 'https://docs.symbiotic.fi', 2024, 'Metaverse', 'n/a', 'https://x.com/symbioticfi'],

  ['Argus', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Multiple'], 'Onchain threat detection and security operations tooling.', 'https://argus.xyz', 'https://argus.xyz/platform', 2023, 'United States', 'n/a', 'https://x.com/arguslabs'],
  ['Hypernative', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Multiple'], 'Real-time threat prevention and incident response for web3 protocols.', 'https://www.hypernative.io', 'https://www.hypernative.io/platform', 2022, 'Israel', 'n/a', 'https://x.com/HypernativeLabs'],
  ['Forta', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Multiple'], 'Decentralized monitoring network for smart contract and protocol threats.', 'https://forta.org', 'https://docs.forta.network', 2022, 'United States', 'FORT', 'https://x.com/FortaNetwork'],
  ['OpenAudit', 'Security', ['Security', 'Auditing'], ['Ethereum'], 'Audit marketplace connecting protocols with security providers.', 'https://openaudit.org', 'https://openaudit.org/marketplace', 2024, 'Metaverse', 'n/a', 'https://x.com/openauditorg'],
  ['Guardian Audits', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Solana'], 'Smart contract audit and security review provider.', 'https://guardianaudits.com', 'https://guardianaudits.com/services', 2022, 'United States', 'n/a', 'https://x.com/GuardianAudits'],
  ['Paladin Blockchain Security', 'Security', ['Security', 'Auditing'], ['Ethereum', 'BSC', 'Multiple'], 'Security firm providing audits and risk reviews for blockchain projects.', 'https://paladinsec.co', 'https://paladinsec.co/services', 2020, 'United Kingdom', 'n/a', 'https://x.com/0xPaladinSec'],
  ['Cyberscope', 'Security', ['Security', 'Auditing'], ['Ethereum', 'BSC', 'Multiple'], 'Blockchain audit and security assessment provider.', 'https://www.cyberscope.io', 'https://www.cyberscope.io/audits', 2021, 'United Kingdom', 'n/a', 'https://x.com/Cyberscope_io'],
  ['WatchPug', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Security reviews and smart contract auditing services.', 'https://watchpug.com', 'https://watchpug.com/services', 2022, 'Metaverse', 'n/a', 'https://x.com/watchpugsec'],
  ['Beosin', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Multiple'], 'Security and compliance solutions for blockchain organizations.', 'https://beosin.com', 'https://beosin.com/services', 2018, 'Singapore', 'n/a', 'https://x.com/Beosin_com'],
  ['BlockSec', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'BSC', 'Multiple'], 'Security products focused on onchain monitoring and incident defense.', 'https://blocksec.com', 'https://blocksec.com/products', 2021, 'Singapore', 'n/a', 'https://x.com/BlockSecTeam'],

  ['Aptos Wallet', 'Wallets', ['Wallets'], ['Aptos'], 'Wallet application for Aptos ecosystem asset and app usage.', 'https://aptosfoundation.org/ecosystem/wallets', 'https://aptosfoundation.org/ecosystem/wallets', 2022, 'Metaverse', 'n/a', 'https://x.com/Aptos'],
  ['Petra Wallet', 'Wallets', ['Wallets'], ['Aptos'], 'Self-custody wallet for Aptos users and developers.', 'https://petra.app', 'https://petra.app/download', 2022, 'United States', 'n/a', 'https://x.com/PetraWallet'],
  ['Martian Wallet', 'Wallets', ['Wallets'], ['Aptos', 'Sui'], 'Wallet for Move-based ecosystems and multichain users.', 'https://martianwallet.xyz', 'https://martianwallet.xyz/download', 2022, 'United States', 'n/a', 'https://x.com/martian_wallet'],
  ['Sui Wallet', 'Wallets', ['Wallets'], ['Sui'], 'Official wallet experience for Sui ecosystem participants.', 'https://sui.io/wallet', 'https://sui.io/wallet', 2023, 'United States', 'n/a', 'https://x.com/SuiNetwork'],
  ['Backpack Exchange', 'Payments', ['Payments', 'Exchange'], ['Solana', 'Ethereum'], 'Exchange platform integrated with Backpack ecosystem.', 'https://backpack.exchange', 'https://backpack.exchange/markets', 2024, 'United Arab Emirates', 'n/a', 'https://x.com/Backpack'],

  ['Privy', 'Developer Tools', ['Developer Tools', 'Wallets'], ['Ethereum', 'Base', 'Arbitrum'], 'Embedded wallet and auth infrastructure for web3 onboarding.', 'https://www.privy.io', 'https://docs.privy.io', 2021, 'United States', 'n/a', 'https://x.com/privy_io'],
  ['Dynamic', 'Developer Tools', ['Developer Tools', 'Wallets'], ['Ethereum', 'Solana', 'Multiple'], 'Wallet-based authentication and user management for web3 apps.', 'https://www.dynamic.xyz', 'https://docs.dynamic.xyz', 2021, 'United States', 'n/a', 'https://x.com/dynamic_xyz'],
  ['Turnkey', 'Developer Tools', ['Developer Tools', 'Security'], ['Ethereum', 'Solana', 'Multiple'], 'Secure key management and signing infrastructure for developers.', 'https://www.turnkey.com', 'https://docs.turnkey.com', 2022, 'United States', 'n/a', 'https://x.com/turnkeyhq'],
  ['Reown', 'Developer Tools', ['Developer Tools', 'Wallets'], ['Ethereum', 'Multiple'], 'Wallet connectivity and developer tooling, including WalletConnect stack.', 'https://reown.com', 'https://docs.reown.com', 2024, 'Switzerland', 'n/a', 'https://x.com/reown_'],
  ['WalletConnect Foundation', 'Developer Tools', ['Developer Tools', 'Infrastructure'], ['Ethereum', 'Multiple'], 'Stewardship organization for WalletConnect protocol and ecosystem.', 'https://walletconnect.com', 'https://docs.walletconnect.com', 2024, 'Switzerland', 'WCT', 'https://x.com/WalletConnect'],
  ['Alchemy Pay', 'Payments', ['Payments', 'Infrastructure'], ['Ethereum', 'BNB Chain', 'Multiple'], 'Fiat-crypto payment gateway and on/off-ramp infrastructure.', 'https://alchemypay.org', 'https://alchemypay.org/solutions', 2018, 'Singapore', 'ACH', 'https://x.com/AlchemyPay'],
  ['SimpleHash', 'Developer Tools', ['Developer Tools', 'Data & Analytics'], ['Ethereum', 'Solana', 'Multiple'], 'NFT and token data APIs for developers and marketplaces.', 'https://simplehash.com', 'https://simplehash.readme.io', 2022, 'United States', 'n/a', 'https://x.com/simplehash'],
  ['Reservoir', 'Developer Tools', ['Developer Tools', 'NFTs & Creator Economy'], ['Ethereum', 'Polygon', 'Base'], 'Liquidity and marketplace infrastructure for NFT products.', 'https://reservoir.tools', 'https://docs.reservoir.tools', 2022, 'United States', 'n/a', 'https://x.com/reservoir0x'],
  ['Crossmint', 'Developer Tools', ['Developer Tools', 'Payments'], ['Ethereum', 'Solana', 'Multiple'], 'Developer APIs for wallet creation, minting, and fiat checkout.', 'https://www.crossmint.com', 'https://docs.crossmint.com', 2021, 'United States', 'n/a', 'https://x.com/crossmint'],
  ['Helio', 'Payments', ['Payments', 'Infrastructure'], ['Solana', 'Ethereum'], 'Crypto checkout and merchant payment infrastructure.', 'https://hel.io', 'https://hel.io/business', 2022, 'United Kingdom', 'n/a', 'https://x.com/helio_pay'],
  ['Sphere', 'Payments', ['Payments', 'Infrastructure'], ['Ethereum', 'Solana', 'Multiple'], 'Stablecoin payments and treasury operations infrastructure.', 'https://www.spherepay.co', 'https://www.spherepay.co/products', 2022, 'United States', 'n/a', 'https://x.com/sphere_labs'],
  ['Reap', 'Payments', ['Payments', 'Infrastructure'], ['Ethereum', 'Multiple'], 'Web3-enabled corporate card and treasury payment platform.', 'https://reap.global', 'https://reap.global/products', 2018, 'Hong Kong', 'n/a', 'https://x.com/reap_global'],

  ['Parallel Finance', 'DeFi', ['DeFi', 'Lending'], ['Polkadot'], 'Lending, staking, and DeFi primitives for the Polkadot ecosystem.', 'https://parallel.fi', 'https://app.parallel.fi', 2021, 'Singapore', 'PARA', 'https://x.com/ParallelFi'],
  ['Bifrost', 'DeFi', ['DeFi', 'Staking'], ['Polkadot', 'Kusama'], 'Liquid staking protocol for multi-chain ecosystems.', 'https://bifrost.io', 'https://bifrost.app', 2021, 'Singapore', 'BNC', 'https://x.com/Bifrost'],
  ['HydraDX', 'DeFi', ['DeFi', 'DEX'], ['Polkadot'], 'Omnipool-based liquidity protocol for Polkadot assets.', 'https://hydradx.io', 'https://app.hydradx.io', 2021, 'Metaverse', 'HDX', 'https://x.com/hydra_dx'],
  ['Minswap', 'DeFi', ['DeFi', 'DEX'], ['Cardano'], 'Cardano-native decentralized exchange and liquidity protocol.', 'https://minswap.org', 'https://app.minswap.org', 2021, 'Metaverse', 'MIN', 'https://x.com/MinswapDEX'],
  ['SundaeSwap', 'DeFi', ['DeFi', 'DEX'], ['Cardano'], 'Cardano AMM DEX for token swaps and liquidity.', 'https://sundaeswap.finance', 'https://exchange.sundaeswap.finance', 2021, 'Metaverse', 'SUNDAE', 'https://x.com/SundaeSwap'],
  ['WingRiders', 'DeFi', ['DeFi', 'DEX'], ['Cardano'], 'Cardano DEX focused on efficient swaps and liquidity.', 'https://www.wingriders.com', 'https://app.wingriders.com', 2022, 'Metaverse', 'WRT', 'https://x.com/wingriderscom'],
  ['JEX', 'DeFi', ['DeFi', 'Derivatives'], ['Solana'], 'Decentralized derivatives protocol and trading stack.', 'https://jex.trade', 'https://app.jex.trade', 2024, 'Metaverse', 'n/a', 'https://x.com/jex_trade'],

  ['Guild.xyz Connect', 'Identity', ['Identity', 'DAOs & Governance'], ['Ethereum', 'Multiple'], 'Token-gated access and identity coordination for online communities.', 'https://guild.xyz', 'https://guild.xyz/explore', 2021, 'Hungary', 'n/a', 'https://x.com/guildxyz'],
  ['Humanity Protocol', 'Identity', ['Identity', 'Zero Knowledge'], ['Ethereum'], 'Human identity verification network for sybil resistance.', 'https://humanity.org', 'https://humanity.org/technology', 2024, 'Metaverse', 'n/a', 'https://x.com/Humanityprot'],
  ['Civic Pass', 'Identity', ['Identity', 'Compliance'], ['Ethereum', 'Solana'], 'Reusable identity and compliance pass for applications.', 'https://www.civic.com/pass', 'https://www.civic.com/pass', 2022, 'United States', 'CVC', 'https://x.com/civickey']
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
