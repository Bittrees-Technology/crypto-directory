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
  ['Synapse Protocol', 'DeFi', ['DeFi', 'Cross-chain'], ['Ethereum', 'Arbitrum', 'Multiple'], 'Cross-chain liquidity and messaging protocol.', 'https://synapseprotocol.com', 'https://synapseprotocol.com/explore', 2021, 'Metaverse', 'SYN', 'https://x.com/SynapseProtocol'],
  ['Across Protocol', 'DeFi', ['DeFi', 'Cross-chain'], ['Ethereum', 'Arbitrum', 'Base'], 'Cross-chain bridge and intents-based transfer protocol.', 'https://across.to', 'https://across.to/bridge', 2021, 'United States', 'ACX', 'https://x.com/AcrossProtocol'],
  ['Stargate', 'DeFi', ['DeFi', 'Cross-chain'], ['Ethereum', 'Arbitrum', 'Multiple'], 'Cross-chain liquidity transport protocol.', 'https://stargate.finance', 'https://stargate.finance/transfer', 2022, 'Metaverse', 'STG', 'https://x.com/StargateFinance'],
  ['Hop Protocol', 'DeFi', ['DeFi', 'Cross-chain'], ['Ethereum', 'Arbitrum', 'Optimism'], 'Bridge protocol for Ethereum rollup and L2 transfers.', 'https://hop.exchange', 'https://app.hop.exchange', 2021, 'Metaverse', 'HOP', 'https://x.com/HopProtocol'],
  ['Maverick Protocol', 'DeFi', ['DeFi', 'DEX'], ['Ethereum', 'Base'], 'AMM infrastructure focused on capital-efficient liquidity.', 'https://www.mav.xyz', 'https://www.mav.xyz/trade', 2023, 'Metaverse', 'MAV', 'https://x.com/mavprotocol'],
  ['Camelot', 'DeFi', ['DeFi', 'DEX'], ['Arbitrum'], 'Native Arbitrum liquidity and DEX protocol.', 'https://camelot.exchange', 'https://app.camelot.exchange', 2022, 'Metaverse', 'GRAIL', 'https://x.com/CamelotDEX'],
  ['ParaSwap', 'DeFi', ['DeFi', 'Aggregator'], ['Ethereum', 'Polygon', 'Arbitrum'], 'DEX aggregator for optimized swap routing.', 'https://www.paraswap.io', 'https://app.paraswap.io', 2019, 'Metaverse', 'PSP', 'https://x.com/paraswap'],
  ['KyberSwap', 'DeFi', ['DeFi', 'Aggregator'], ['Ethereum', 'Arbitrum', 'Polygon'], 'DEX aggregation and liquidity protocol suite.', 'https://kyberswap.com', 'https://kyberswap.com/swap', 2017, 'Singapore', 'KNC', 'https://x.com/KyberNetwork'],
  ['Hashflow', 'DeFi', ['DeFi', 'DEX'], ['Ethereum', 'Solana', 'Base'], 'RFQ-based decentralized trading protocol.', 'https://www.hashflow.com', 'https://app.hashflow.com', 2021, 'United States', 'HFT', 'https://x.com/hashflow'],
  ['CoW Protocol', 'DeFi', ['DeFi', 'DEX'], ['Ethereum', 'Gnosis'], 'Intent-based trading protocol with MEV-aware order flow.', 'https://cow.fi', 'https://swap.cow.fi', 2021, 'Germany', 'COW', 'https://x.com/CoWSwap'],
  ['Blast', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Blast', 'Ethereum'], 'Ethereum L2 ecosystem focused on native yield primitives.', 'https://blast.io', 'https://blast.io/en-US', 2024, 'Metaverse', 'BLAST', 'https://x.com/Blast_L2'],
  ['Taiko', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Zero Knowledge'], ['Taiko', 'Ethereum'], 'Ethereum-equivalent ZK rollup ecosystem.', 'https://taiko.xyz', 'https://bridge.taiko.xyz', 2022, 'Hong Kong', 'TAIKO', 'https://x.com/taikoxyz'],
  ['Metis', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Metis', 'Ethereum'], 'Ethereum L2 network and governance ecosystem.', 'https://www.metis.io', 'https://www.metis.io/ecosystem', 2021, 'Canada', 'METIS', 'https://x.com/MetisL2'],
  ['Boba Network', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2'], ['Boba', 'Ethereum'], 'Optimistic rollup network and tooling ecosystem.', 'https://boba.network', 'https://boba.network/developers', 2021, 'United States', 'BOBA', 'https://x.com/bobanetwork'],
  ['Celo Foundation', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Payments'], ['Celo'], 'Foundation supporting Celo ecosystem growth and public goods.', 'https://celo.org', 'https://docs.celo.org', 2020, 'United States', 'CELO', 'https://x.com/Celo'],
  ['ZetaChain', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Cross-chain'], ['ZetaChain'], 'Universal blockchain for cross-chain app logic.', 'https://www.zetachain.com', 'https://www.zetachain.com/docs', 2023, 'United States', 'ZETA', 'https://x.com/zetablockchain'],
  ['Kaia', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'Infrastructure'], ['Kaia'], 'Layer 1 ecosystem formed from Klaytn and Finschia networks.', 'https://www.kaia.io', 'https://docs.kaia.io', 2024, 'Singapore', 'KAIA', 'https://x.com/KaiaChain'],
  ['Gnosis', 'Layer 1 / Layer 2', ['Layer 1 / Layer 2', 'DAOs & Governance'], ['Gnosis'], 'Ecosystem organization behind Gnosis Chain and governance tooling.', 'https://gnosis.io', 'https://gnosis.io/products', 2017, 'Germany', 'GNO', 'https://x.com/gnosisDAO'],
  ['AltLayer', 'Infrastructure', ['Infrastructure', 'Layer 1 / Layer 2'], ['Ethereum', 'Multiple'], 'Rollup-as-a-service and restaked rollup infrastructure.', 'https://www.altlayer.io', 'https://www.altlayer.io/products', 2022, 'Singapore', 'ALT', 'https://x.com/alt_layer'],
  ['Avail', 'Infrastructure', ['Infrastructure', 'Layer 1 / Layer 2'], ['Avail'], 'Data availability and modular blockchain infrastructure stack.', 'https://www.availproject.org', 'https://www.availproject.org/products', 2023, 'India', 'n/a', 'https://x.com/AvailProject'],
  ['Espresso Systems', 'Infrastructure', ['Infrastructure', 'Zero Knowledge'], ['Ethereum', 'Multiple'], 'Coordination and sequencing infrastructure for scalable chains.', 'https://www.espressosys.com', 'https://www.espressosys.com/technology', 2020, 'United States', 'n/a', 'https://x.com/EspressoSys'],
  ['Cartesi', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum'], 'Application-specific rollup framework with Linux runtime.', 'https://cartesi.io', 'https://docs.cartesi.io', 2018, 'Brazil', 'CTSI', 'https://x.com/cartesiproject'],
  ['Fuel Labs', 'Infrastructure', ['Infrastructure', 'Layer 1 / Layer 2'], ['Fuel', 'Ethereum'], 'Modular execution layer and tooling for high-throughput apps.', 'https://fuel.network', 'https://docs.fuel.network', 2020, 'United States', 'n/a', 'https://x.com/fuel_network'],
  ['Nillion', 'Infrastructure', ['Infrastructure', 'Privacy'], ['Nillion'], 'Decentralized privacy-preserving computation network.', 'https://nillion.com', 'https://nillion.com/developers', 2022, 'Metaverse', 'n/a', 'https://x.com/nillionnetwork'],
  ['Obol', 'Infrastructure', ['Infrastructure', 'Staking'], ['Ethereum'], 'Distributed validator technology for resilient Ethereum staking.', 'https://obol.org', 'https://obol.org/learn', 2021, 'United States', 'n/a', 'https://x.com/Obol_Collective'],
  ['Nethermind', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum'], 'Engineering organization building Ethereum clients and tooling.', 'https://www.nethermind.io', 'https://www.nethermind.io/services', 2017, 'United Kingdom', 'n/a', 'https://x.com/NethermindEth'],
  ['ChainSafe', 'Infrastructure', ['Infrastructure', 'Developer Tools'], ['Ethereum', 'Filecoin', 'Polkadot'], 'Blockchain R&D and protocol engineering company.', 'https://chainsafe.io', 'https://chainsafe.io/services', 2017, 'Canada', 'n/a', 'https://x.com/chainsafeth'],
  ['Unisat Wallet', 'Wallets', ['Wallets', 'Bitcoin'], ['Bitcoin'], 'Bitcoin wallet for ordinals, runes, and asset management.', 'https://unisat.io', 'https://unisat.io/download', 2023, 'Metaverse', 'n/a', 'https://x.com/unisat_wallet'],
  ['Leather Wallet', 'Wallets', ['Wallets', 'Bitcoin'], ['Bitcoin'], 'Bitcoin wallet for onchain assets and app connectivity.', 'https://leather.io', 'https://leather.io/download', 2018, 'United States', 'n/a', 'https://x.com/LeatherBTC'],
  ['BlueWallet', 'Wallets', ['Wallets', 'Bitcoin'], ['Bitcoin'], 'Mobile Bitcoin wallet focused on self-custody and payments.', 'https://bluewallet.io', 'https://bluewallet.io', 2018, 'Metaverse', 'n/a', 'https://x.com/bluewalletio'],
  ['Electrum', 'Wallets', ['Wallets', 'Bitcoin'], ['Bitcoin'], 'Long-standing lightweight Bitcoin wallet software.', 'https://electrum.org', 'https://electrum.org/#download', 2011, 'Metaverse', 'n/a', 'https://x.com/ElectrumWallet'],
  ['Frame', 'Wallets', ['Wallets'], ['Ethereum'], 'Desktop wallet for Ethereum and EVM networks.', 'https://frame.sh', 'https://frame.sh/download', 2018, 'United States', 'n/a', 'https://x.com/frame_eth'],
  ['Certora', 'Security', ['Security', 'Developer Tools'], ['Ethereum'], 'Formal verification tooling and services for smart contracts.', 'https://www.certora.com', 'https://www.certora.com/prover', 2018, 'United States', 'n/a', 'https://x.com/CertoraInc'],
  ['Runtime Verification', 'Security', ['Security', 'Formal Verification'], ['Ethereum', 'Multiple'], 'Formal methods and security analysis for blockchain systems.', 'https://runtimeverification.com', 'https://runtimeverification.com/services', 2010, 'United States', 'n/a', 'https://x.com/rv_inc'],
  ['Hexens', 'Security', ['Security', 'Auditing'], ['Ethereum', 'Solana', 'Multiple'], 'Blockchain security company focused on audits and threat research.', 'https://hexens.io', 'https://hexens.io/services', 2021, 'Cyprus', 'n/a', 'https://x.com/Hexensio'],
  ['Veridise', 'Security', ['Security', 'Formal Verification'], ['Ethereum', 'Zero Knowledge'], 'Security auditing and formal verification for smart contracts and ZK systems.', 'https://veridise.com', 'https://veridise.com/services', 2021, 'United States', 'n/a', 'https://x.com/veridiseInc'],
  ['Cyvers', 'Security', ['Security', 'Monitoring'], ['Ethereum', 'Multiple'], 'Real-time blockchain threat detection and risk intelligence platform.', 'https://cyvers.ai', 'https://cyvers.ai/platform', 2023, 'Israel', 'n/a', 'https://x.com/cyvers_'],
  ['DappRadar', 'Data & Analytics', ['Data & Analytics'], ['Ethereum', 'Polygon', 'Multiple'], 'Discovery and analytics platform for dapps and NFT activity.', 'https://dappradar.com', 'https://dappradar.com/rankings', 2018, 'Lithuania', 'RADAR', 'https://x.com/DappRadar'],
  ['CryptoSlam', 'Data & Analytics', ['Data & Analytics', 'NFTs & Creator Economy'], ['Ethereum', 'Solana', 'Multiple'], 'NFT sales and collection analytics platform.', 'https://cryptoslam.io', 'https://cryptoslam.io/collections', 2021, 'United States', 'n/a', 'https://x.com/cryptoslamio'],
  ['Footprint Analytics', 'Data & Analytics', ['Data & Analytics'], ['Ethereum', 'BNB Chain', 'Multiple'], 'Web3 analytics platform for dashboards and protocol insights.', 'https://www.footprint.network', 'https://www.footprint.network/dashboard', 2021, 'Singapore', 'n/a', 'https://x.com/Footprint_Data'],
  ['TokenInsight', 'Data & Analytics', ['Data & Analytics', 'Research'], ['Ethereum', 'Multiple'], 'Market research and data platform for digital assets.', 'https://tokeninsight.com', 'https://tokeninsight.com/en', 2018, 'Singapore', 'n/a', 'https://x.com/TokenInsight'],
  ['Pixels', 'Gaming', ['Gaming'], ['Ronin'], 'Web3 social farming game and ecosystem.', 'https://www.pixels.xyz', 'https://www.pixels.xyz/play', 2022, 'Metaverse', 'PIXEL', 'https://x.com/pixels_online'],
  ['Open Loot', 'Gaming', ['Gaming', 'NFTs & Creator Economy'], ['Ethereum', 'Immutable'], 'Gaming marketplace and publisher infrastructure platform.', 'https://openloot.com', 'https://openloot.com/games', 2023, 'United States', 'OL', 'https://x.com/OpenLoot'],
  ['Mocaverse', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Identity'], ['Ethereum'], 'Consumer identity and membership ecosystem by Animoca Brands.', 'https://www.mocaverse.xyz', 'https://www.mocaverse.xyz', 2023, 'Hong Kong', 'MOCA', 'https://x.com/Moca_Network'],
  ['Azuki', 'NFTs & Creator Economy', ['NFTs & Creator Economy', 'Consumer Brands'], ['Ethereum'], 'Anime-inspired NFT brand and creator ecosystem.', 'https://www.azuki.com', 'https://www.azuki.com/collectibles', 2022, 'United States', 'n/a', 'https://x.com/Azuki'],
  ['Paxos', 'Payments', ['Payments', 'Infrastructure'], ['Ethereum', 'Solana'], 'Regulated blockchain infrastructure and stablecoin issuer.', 'https://www.paxos.com', 'https://www.paxos.com/products', 2012, 'United States', 'USDP', 'https://x.com/Paxos'],
  ['PayPal USD', 'Payments', ['Payments', 'Stablecoin'], ['Ethereum', 'Solana'], 'Stablecoin payment product ecosystem associated with PayPal.', 'https://www.paypal.com/pyusd', 'https://www.paypal.com/pyusd', 2023, 'United States', 'PYUSD', 'https://x.com/PayPal'],
  ['Robinhood Crypto', 'Payments', ['Payments', 'Exchange'], ['Bitcoin', 'Ethereum', 'Solana'], 'Crypto trading and custody products integrated in Robinhood.', 'https://robinhood.com/us/en/crypto', 'https://robinhood.com/us/en/crypto', 2018, 'United States', 'n/a', 'https://x.com/RobinhoodApp'],
  ['Strike', 'Payments', ['Payments', 'Bitcoin'], ['Bitcoin'], 'Bitcoin payments platform focused on fast settlements.', 'https://strike.me', 'https://strike.me/app', 2020, 'United States', 'n/a', 'https://x.com/Strike'],
  ['River', 'Payments', ['Payments', 'Bitcoin'], ['Bitcoin'], 'Bitcoin financial services platform focused on long-term holders.', 'https://river.com', 'https://river.com/product', 2019, 'United States', 'n/a', 'https://x.com/River'],
  ['ForDeFi', 'Custody', ['Custody', 'Wallets', 'Security'], ['Ethereum', 'Multiple'], 'Institutional wallet and policy engine for secure operations.', 'https://www.fordefi.com', 'https://www.fordefi.com/platform', 2021, 'United States', 'n/a', 'https://x.com/ForDeFiHQ'],
  ['Qredo', 'Custody', ['Custody', 'Infrastructure'], ['Ethereum', 'Bitcoin', 'Multiple'], 'Institutional digital asset infrastructure for custody and settlement.', 'https://www.qredo.com', 'https://www.qredo.com/solutions', 2018, 'United Kingdom', 'QRDO', 'https://x.com/QredoNetwork']
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

