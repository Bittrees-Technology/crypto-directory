# CryptoDirectory Next Steps

Deferred roadmap items to revisit later.

1. Add a lightweight submission intake flow now.
Use the existing `site/submit.html`, store incoming submissions in `content/submissions/inbox/`, and review monthly with a fixed checklist.

2. Add a changelog section on homepage.
Show a "Last updated" date and latest IPFS CID on `site/index.html` so visitors can see freshness and provenance.

3. Add backup pinning for IPFS.
Pin each release CID on a second pinning service (or second node) to improve availability and resilience.

4. Tighten link quality rules.
During monthly passes, auto-mark entries as `needs_update` if primary URL or X profile is unreachable for two consecutive cycles.

5. Add basic privacy-first analytics.
Integrate a simple script (e.g., Plausible or Umami) for traffic insight without adding major complexity.

6. Keep a strict release ritual. [DONE]
Implemented via `npm run release:monthly -- "notes"`:
`audit -> build -> publish -> ENS update -> append releases.md`.
