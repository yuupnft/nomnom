# nomnom

Character site for Nomnom, a hungry hamster who eats everything. Formerly a
Solana memecoin landing page ($NOMNOM); pivoted (2026) to be character-first —
building a fanbase around Nomnom himself before the crypto angle matters again.
Crypto content now lives in one quiet `/token` page linked from a coin icon in
the nav, not the main site flow.

## Tech stack

- **Client**: Next.js 14 (Pages Router), React 18, Tailwind CSS v3, `client/`
- **Server**: Express (ESM), Node, `server/`, deployed on Render
  (`https://nomnom-1u79.onrender.com`)
- Fonts: Bowlby One (headings), Gaegu (playful body text, used almost
  everywhere), Rubik (base body font)
- Custom Tailwind palette: `nomnom-white/cream/ink/pink/red/yellow/blush/
  brown/mint/sky` — see `client/tailwind.config.js`. Component classes
  (`.btn-kawaii`, `.card-kawaii`, `.section-heading`, etc.) live in
  `client/styles/globals.css`.

## Page structure

`/` (`client/pages/index.js`): NavBar → Hero → WhoIsNomnom → TwitterMentions →
FeedNomnom → footer. (StickerSection and NomnomCares exist but are currently
commented out of both the page and the nav — easy to re-enable later.)

`/memes` (`client/pages/memes.js`): a **legacy, self-contained meme editor**,
unrelated to the React component tree. Renders raw HTML via
`dangerouslySetInnerHTML` and loads `client/public/static/meme-maker.js`
(vanilla JS + fabric.js from a CDN) dynamically. See "Bugs fixed" below —
this page has a real quirk around how it's navigated to.

`/token`: quiet page with contract address / DEX links, kept for anyone who
wants the crypto details.

## Recently added (this session)

**Hero** (`client/components/Hero.js`) — the floating Nomnom image now cycles
through hand-drawn "Nomnom eating ___" images every ~3.5s (fade transition),
sourced from `client/public/nomnom-eating/*.png`. Add new art there and list
it in `NOMNOM_EATING_IMAGES` to include it in the rotation.

**Feed Nomnom → tag-based meme search** (`client/components/TagSearch.js`,
`client/components/ResultsOverlay.js`) — replaced an earlier local-JSON
phrase-lookup placeholder. Now:
- Tags are fetched lazily from `GET /api/tags` (only on first focus/keystroke
  in the input, not on page load) — backed by a Firestore `tags` collection
  (shared with the sibling `nomnom-memes` project's Firebase project).
- Users multi-select tags as removable pills under the input, then hit
  Search, which POSTs to `/api/memes/search` — a Cloudinary Search API call
  (`tags:a OR tags:b ...`, sorted by `created_at` desc, capped at 100
  results), also sharing the `nomnom-memes` Cloudinary account.
- Results render in a full-screen overlay (`z-[100]`, above the navbar's
  `z-50`): a CSS-columns masonry grid, click an image to focus it centered,
  "back to results" returns to the grid, a separate close button (or Escape)
  dismisses the whole overlay. Body scroll is locked while it's open.
- No upload functionality was ported — that stays exclusive to the
  `nomnom-memes` app.

**Feed Nomnom → "Make Your Own" canvas editor**
(`client/components/NomnomEditor.js`) — ported from the standalone
`nomnom-editor` Vite app (fabric.js v7, compatible with this repo's fabric
v6.5.0). Upload a photo, drag/scale/rotate a two-part Nomnom (leg + body)
group onto it, mask-erase the leg layer to create an "eating" illusion,
pinch/pan/zoom via Hammer.js, download as PNG. Loaded via `next/dynamic`
with `ssr: false` (hammerjs touches `window` at import time, which breaks
Next's server-side prerender otherwise). Toolbar and flip/mask quick-actions
use `lucide-react` icons styled to match the site's kawaii button system.

A link to the older, more feature-complete meme maker (`/memes` — extra
features, Nomnom costumes) sits just under the canvas.

**Restored `TwitterMentions`** (`client/components/TwitterMentions.js`) — a
brand-mentions marquee, recovered from an uncommitted deletion. Renders in a
`.light`-forced theme wrapper (see "Bugs fixed") on a `bg-nomnom-sky` section.

## Bugs fixed

- **react-tweet crash on reply-shaped tweets** — `react-tweet@3.3.0`'s
  `addEntities()` does `for (const entity of entities)` with no guard for
  `entities` being `undefined`, which Twitter's syndication API returns for
  tweets that are replies (no `hashtags`/`urls`/`symbols` keys at all, not
  even empty arrays). Confirmed via the actual API response, then confirmed
  `3.3.1` ships exactly this guard. Upgraded the dependency; also wrapped
  each `<Tweet>` in an error boundary as defense-in-depth.
- **Dark-mode tweet cards** — `react-tweet` auto-switches to a dark navy
  theme based on the visitor's OS `prefers-color-scheme`, which this
  otherwise all-light-pastel site never intended. Forced light theme via a
  wrapping `.light` class (matches `react-tweet`'s own CSS selector).
- **NomnomEditor upload prompt not centered / not clickable** — the "Tap to
  upload image" div had no `position: absolute`, so it collapsed to ~0
  height in normal flow instead of overlaying the canvas; and even after
  fixing that, fabric.js's `upper-canvas` interaction layer painted on top
  of it (later in DOM order, no z-index on either), swallowing clicks.
  Fixed with `position: absolute; inset: 0; zIndex: 10`.
- **Download cropped to the wrong region** — `download()` used
  `canvas.toDataURL({left: 0, top: 0, width: backgroundImg.width, height:
  backgroundImg.height})`, i.e. canvas-origin crop with the image's
  *original unscaled* pixel size — ignoring that the image actually renders
  centered/scaled/panned. Fixed by computing the actual on-screen crop from
  `backgroundImg.getBoundingRect()`.
- **Download broke after panning** — turned out `getBoundingRect()` in this
  fabric version returns absolute **scene** coordinates (unaffected by
  `viewportTransform`), but `canvas.toDataURL()`'s crop options are
  interpreted in current **viewport** pixel space. They only lined up by
  coincidence at the default (unpanned) viewport transform. Fixed by running
  both rect corners through `fabric.util.transformPoint(point,
  canvas.viewportTransform)` before passing them to `toDataURL`.
- **Download resolution was low** — export defaulted to the small on-screen
  editor size (a few hundred px) rather than the uploaded photo's native
  resolution. Fixed with a `multiplier = backgroundImg.width / cropWidth` on
  the `toDataURL` call, so output always matches the original upload's pixel
  width (fabric re-renders vector content at the higher resolution rather
  than upscaling a raster).
- **Quick-actions row (flip/mask) didn't track the object** — same
  scene-vs-viewport coordinate mismatch as the download bug, applied to
  positioning a DOM overlay under the selected object. Fixed the same way;
  recomputed on every `after:render` so it live-tracks drag/scale/pan/zoom,
  clamped so it can't render below the canvas's own bottom edge.
- **Vertical flip did nothing / did the wrong thing** — the quick-actions
  "vertical-flip" and "mask" controls had no `onClick` at all (pre-existing,
  from the ported app). While wiring them up, also found `flip()`'s vertical
  branch checked `group.flipX` instead of `group.flipY` — a copy-paste bug
  that would've made vertical flip behave incorrectly once clickable. Fixed
  both.
- **`/memes` broken on client-side navigation (e.g. clicking a `next/link`
  to it) but fine on a hard reload/direct URL** — the whole page body is
  injected via `dangerouslySetInnerHTML`, including `<script>` tags for the
  fabric.js CDN and `meme-maker.js`. Browsers only execute `<script>` tags
  parsed as part of a real HTML document load, not ones set via
  `innerHTML` (which is what `dangerouslySetInnerHTML` does under a
  client-side route change). Fixed by loading both scripts via a
  `useEffect` in `memes.js` instead. That surfaced a second bug:
  `meme-maker.js`'s own top-level code was wrapped in
  `document.addEventListener('DOMContentLoaded', ...)`, which never fires if
  the document already finished loading before the script runs (always true
  once it's injected dynamically) — changed it to check `document.readyState`
  and run immediately if already loaded.

## Removed

- Old crypto-landing-page components: `Button.js`, `Buy.js`, `HowToBuy.js`,
  `Tokenomics.js`, `RandomMeme.js`, `ImageCanvas.js`, and their CSS modules.
- The placeholder phrase-lookup autocomplete + `client/data/feed-memes.json`
  (superseded by the real tag search feature above).
- "Feed" link from the navbar (the Hero CTA still scrolls to `#feed`, it's
  just not in the nav anymore); "Meme Maker" and "$nomnom token" links from
  the footer (token access moved to a navbar coin icon; meme maker link
  moved under the canvas editor).
- `NomnomCares` and `StickerSection` are commented out (imports + usage),
  not deleted — easy to bring back.

## Environment / secrets

Not committed (see `.gitignore` in each of `client/` and `server/`):
- `server/.env` — `COIN_GECKO_API_KEY`, `CLOUD_NAME`, `API_KEY`,
  `API_SECRET` (Cloudinary; shared with the `nomnom-memes` project)
- `server/secrets/firebaseAdminKey.json` — Firebase Admin service account
  (shared with `nomnom-memes`'s Firestore `tags` collection). Falls back to
  `/etc/secrets/firebaseAdminKey.json` in production (Render secret file).
- `client/.env.local` — `NEXT_PUBLIC_SERVER_URL` (point at `localhost:3001`
  for local dev against a local server; falls back to the Render production
  URL if unset)

For local dev, both `client/` and `server/` need their dev servers running;
the client needs `NEXT_PUBLIC_SERVER_URL` set and restarted after adding it
(Next only reads `.env*` at boot).

## Gotchas worth remembering

- **fabric.js coordinate spaces**: `object.getBoundingRect()` returns
  absolute *scene* coordinates in this version, not current-viewport pixels.
  Anything that needs to line up with `canvas.toDataURL()`'s crop options or
  a DOM overlay's on-screen position needs `fabric.util.transformPoint(pt,
  canvas.viewportTransform)` first.
- **`dangerouslySetInnerHTML` + `<script>` tags**: never execute on a
  client-side route change, only on a genuine document load. Any future
  work on `/memes` should keep script loading in the `useEffect`, not move
  it back into the HTML string.
- Node 20 is required to build (`nvm use 20`); Tailwind must stay on v3 (v4
  changed the PostCSS plugin API in a way that breaks this Next.js version).
