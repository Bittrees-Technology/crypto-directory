# Block Lottos — issue #5 curation review

Reviewed: 28 October 2026

Submission: https://github.com/Bittrees-Technology/crypto-directory/issues/5

Public decision: https://github.com/Bittrees-Technology/crypto-directory/issues/5#issuecomment-6459089566

Decision: **accepted for a factual Gaming listing**, subject to the normal pull-request checks and independent repository approval.

Reviewed against [Curation Policy v1](https://github.com/Bittrees-Technology/crypto-directory/blob/5a54341258808178380a8a5ace1fd61c665574a9/content/curation-policy.md):

- Active website and product: [games](https://blocklottos.com/games), [Polygon game](https://blocklottos.com/polygon-future-ledger), and [Base game](https://blocklottos.com/base-future-ledger) are available.
- Onchain focus: the [official API documentation](https://blocklottos.com/api-docs) identifies Polygon and Base contracts. Independent, read-only `eth_getCode` requests returned deployed code at `0x07F62Ff6697eD9b475FEed9dc90a5A157936839c` on Polygon (19,668 bytes) and `0xe5a9cF597ec65523BD71a8433B620eB1F3Eb0d0a` on Base (19,811 bytes). Public stats returned `status: ok` for both chains (draw numbers 35 and 24 respectively). Contract existence is not a security audit.
- Developer resources: the [OpenAPI document](https://blocklottos.com/openapi.json) returned valid JSON (OpenAPI 3.1.0, API v1.2.0, 20 paths); the [agent manifest](https://blocklottos.com/.well-known/agent.json) also returned JSON. Their presence does not establish agent protocol conformance or authorize integration.
- Classification: Gaming; tags Gaming, Gambling, Lottery, dApp, API; ecosystems Polygon and Base. Solana/Cardano are planned rather than live lottery games and will not be listed as supported game networks.
- The submitter explicitly disclosed affiliation. The listing will use direct, non-affiliate URLs and neutral language, with no payout guarantees, fairness claims, or promotional copy. No official country or founding year was established; use `Metaverse` per policy and `n/a` for unknown fields.

No obvious policy exclusion was established in this bounded review. `verified` means manually reviewed and accepted under this directory policy; it does **not** certify contract security, random-number fairness, solvency, payouts, licensing, or suitability in any jurisdiction. No wallet was connected, transaction signed, ticket purchased, or payment made.

Approval trail: this issue records the curation decision; this review and the approved submission retain the listing rationale. Publication still requires the protected branch’s exact-commit build/check and independent approval. This comment is not a substitute for those gates.
