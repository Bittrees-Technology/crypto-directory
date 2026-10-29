# Surf — Surf the new web

A coastal, StumbleUpon-inspired discovery experience for CryptoDirectory.

## Run

Node 22 or later. No dependencies, accounts, or secrets required.

```sh
npm run build
npm test
npm run dev
```

## Vercel

Create a separate Vercel project from this repository with **Root Directory = surf**, **Framework = Other**, **Build Command = npm run build**, **Output Directory = public**. The API is a Node serverless function. Assign `surf.bittrees.org` to this project. Track the dedicated `surf-production` branch in the Vercel Production environment. Keep CryptoDirectory's existing project configuration intact. The source is also proposed for main in PR #21, which remains subject to its normal review and merge rules.

## Synchronization contract

- CryptoDirectory is the source of truth. GET `/api/catalog` fetches `https://cd.bittrees.org/data/projects.json` on the server, avoiding browser CORS dependencies.
- Only `verification_status: verified` entries appear. Website and product links retain their own URLs and types. Unsafe URL schemes and local addresses are excluded; destinations are not embedded in iframes.
- Vercel caches successful feed responses for five minutes, with up to ten minutes of stale-while-revalidate. Visible pages refresh every five minutes, and visitors can manually refresh. This is eventual synchronization, not a transaction across both sites.
- Directory additions, edits, and removals appear from the next uncached successful fetch without rebuilding Surf. Surf does not write personal activity into the directory.
- If the directory is down, a bundled October 29, 2026 snapshot is used and labeled clearly. Snapshot responses are cached for only 30 seconds. The build prefers the repository's current `site/data/projects.json` when available; it falls back to `public/data/source.json` for standalone builds.
- The directory itself still deploys from its normal workflow. Keep its feed stable and public.

## Personal tracking

Bookmarks, actual outbound website/product visits (up to 300), and preferences persist in localStorage under `bittrees.surf.v1`. A discovery alone is not counted as an outbound visit. History can be cleared separately; the privacy dialog resets all Surf data. There is no central analytics database or cross-device sync.

## Validation

`npm test` covers filtering, destination URL safety, distinct product URLs, no-repeat selection, live data changes/removals, and feed-outage fallback. Browser QA covers discovery, categories, bookmarks, history, modal navigation, share links, responsive layout, and feed status.
