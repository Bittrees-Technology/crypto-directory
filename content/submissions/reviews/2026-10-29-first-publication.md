# First publication proposal from the 500-site research batch

The earlier research PR added a category and candidate files. It added no
`content/projects/` entries, so production correctly stayed at 1,031 listings.
This proposal adds **100 actual listings across all 15 categories**, including
**13 crypto/Web3 AI Agents**, bringing the source total to **1,131**.

The [machine-readable review](2026-10-29-first-publication.json) maps each
candidate to its project file, official website, current product/developer page,
observation time, sampled-content hash and rationale. Descriptions are rewritten
in neutral language. Historical discovery attribution is preserved.

## What was reviewed

- Current official identity and product/developer interfaces, category fit,
  names, domains and known project-family aliases.
- Current public-page availability: every selected project and product page
  returned HTTPS 200 during the bounded read-only check.
- New AI entries have an explicit crypto/Web3 use case. Bankr and Zyfai move
  into AI Agents based on their current agent products.
- Version-specific registry names become the current project names where
  appropriate. For example, GONDI V3 becomes GONDI; several registry “Bridge”
  labels become the actual network or infrastructure project names.

These checks establish listing eligibility, not that a protocol is safe or an
investment is suitable. Product transactions, wallet connections, sign-ins and
downloads were not exercised. All 100 entries remain **`pending_audit`**.
Unknown founding dates, tokens and social accounts stay `n/a`; unknown country
stays `Metaverse`, following the existing policy.

## Remaining research

**400 candidates are not part of this publication proposal.** All 500 received
availability/product-link screening, but the remainder has not completed
individual content review. They are not automatically rejected or imported.
The JSON review records concrete holds, including:

- Existing project-family overlaps: Aero/Aerodrome, Auto Finance/Tokemak,
  Spark, Superfluid, Yearn and HydraDX/Hydration.
- Redirected or changed product identities, including Xion/Verona, and Cyber's
  wallet sunset notice.
- App-access failures for Elsa and Griffin, a wallet-service startup error on
  Pieverse, and a rate-limited Zama app check.
- A need to establish a current explicit onchain product for OpenServ before
  accepting it within the crypto/Web3 AI Agents scope.
- Yield/referral claims that need closer exclusion-criteria review.

## Release acceptance

An eligible reviewer must independently approve the exact protected PR head.
Required CI then builds the actual project files into the public directory;
browser validation checks that every selected entry reaches public data, that
AI entries render, and that search finds a new agent listing. Research-only
suggestions are not imported by that build.

After merge, the existing production deployment and approved IPNS publisher must
show the same source, project count and AI entries at `cd.bittrees.org` and
`cryptodirectory.eth.limo`. A passing preview or merged research PR alone does
not establish that publication.
