# ZenDraw | 禅抽 v5.7.11

[中文版本](./README_CN.md)

ZenDraw is a professional, full-screen random draw application with Apple-inspired design. Built with Next.js 15 App Router, React 19, Tailwind CSS v4 and Motion. It runs entirely in the browser — no backend, no HTTP API, no database.

## Features

- **Slot-machine draw**: character-level rolling with staggered freeze; duration configurable from 1 to 30 seconds.
- **Draw rules**: numeric range (min/max, span ≤ 10,000,000), draw count (≤ 1000), allow/deny duplicates, zero-padding digits, prefix/suffix.
- **Custom lists**: import names or prizes (≤ 1000 items, ≤ 200 chars each), deduplicated, exportable as text.
- **Cryptographic randomness**: `crypto.getRandomValues()` with rejection sampling; `Math.random()` is only a fallback when crypto is unavailable.
- **Theming**: 11 presets (Default, Ocean, Forest, Sunset, Purple, Neon, Sakura, Midnight, Retro, Pixel, Rose) × 3 font families (Sans / Mono / Serif), with light / dark / system modes.
- **Experience settings**: Web Audio sounds, confetti, reduced motion, UI density, auto-hide panel, reset all settings.
- **History**: up to 100 entries, copy-to-clipboard, clear.
- **Bilingual**: Simplified Chinese / English, 110 translation keys with compile-time parity.
- **Settings persistence**: 19 `zendraw-*` localStorage keys with cross-tab sync.
- **Accessibility**: semantic containers with kebab-case ids, ARIA labels, keyboard shortcuts (Space / Escape), i18n error & 404 pages.
- **Build identity**: the footer shows `V5.7.11 · build yymmddhhmm` — a 10-digit build id injected by `next.config.ts` (falls back to the version alone when missing).

## Tech Stack

| Layer | Package | Version |
|---|---|---|
| Framework | Next.js (App Router) | ^15.4.9 |
| UI | React / React DOM | ^19.2.1 |
| Styling | Tailwind CSS v4 + @tailwindcss/postcss | 4.1.11 |
| Animation | motion | ^12.23.24 |
| Icons | lucide-react | ^0.553.0 |
| Theme | next-themes | ^0.4.6 |
| Component primitives | @base-ui/react | ^1.3.0 |
| Language | TypeScript (strict) | 5.9.3 |
| Lint | ESLint + eslint-config-next | 9.39.1 / 16.0.8 |
| Test | Vitest + @testing-library/react + jsdom | ^3.0.0 / ^16.0.0 / ^26.0.0 |

## Getting Started

```bash
npm install       # CI uses npm ci when package-lock.json is present
npm run dev       # http://localhost:3000
```

Quality gate (mirrors `.github/workflows/ci.yml`, Node 22):

```bash
npm run type-check
npm run lint -- --max-warnings=0
npm test
npm run build
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (`output: 'standalone'`) |
| `npm run start` | Start production server |
| `npm run lint` / `lint:fix` | ESLint check / auto-fix |
| `npm run type-check` | `tsc --noEmit` |
| `npm test` / `test:watch` / `test:coverage` | Vitest run / watch / coverage |
| `npm run clean` | Clear Next.js cache (`next clean`) |

## Project Structure

```
app/
├── layout.tsx / page.tsx / error.tsx / not-found.tsx / style.css
├── components/
│   ├── layout/app-header.tsx
│   ├── ui/                 # 16 .tsx files (13 top-level + sheet/{context,index,parts})
│   ├── draw/
│   │   ├── draw-button.tsx / draw-settings.tsx / custom-list-settings.tsx
│   │   ├── appearance-settings.tsx + appearance-settings.parts.tsx
│   │   ├── draw-display/   # welcome, error, result card/grid, confetti, celebration
│   │   ├── history-list/   # index, history-card, empty-state
│   │   └── settings-panel/ # index (4 tabs), header-bar, experience, custom-list-inline
│   └── number-roller.tsx / theme-provider.tsx
├── hooks/                  # 12 hooks: draw-types, draw-helpers, draw-reducer,
│                           # use-draw, use-draw-actions, use-draw-settings-actions,
│                           # use-draw-utils, use-draw-persistence, use-local-storage,
│                           # use-sound, use-stored-language, use-mounted-reduced-motion
├── lib/                    # version.ts / i18n.ts / utils.ts
├── locales/                # types.ts (TranslationKey), zh.ts, en.ts, index.ts
├── test/setup.ts            # Vitest environment setup
└── **/__tests__/            # 7 test files, 69 cases
prototype/                   # 4 HTML prototypes + tokens.css + design-system.md
docs/design/                 # color-system.html / motion.html / typography.html
docs/tasks.md / tasks-done.md
openspec/SPEC.md             # authoritative specification
.github/                     # CI workflow, review standard, PR template
```

## Interfaces & Data

ZenDraw is a **pure client-side app**: there are no Route Handlers, Server Actions, middleware or HTTP endpoints. All state lives in `useReducer` + `localStorage`. Internal module contracts (signatures, parameters, return values) are documented in `openspec/SPEC.md` §14; the 19 persistence keys are listed in §9. A separate API reference is therefore not applicable.

## Recent Changes

- v5.7.11 — documentation realigned with code (structure, dependencies, counts, interfaces, build identity).
- v5.7.10 — footer now shows `V{version} · build yymmddhhmm`; build id injected at build time; version removed from the settings HeaderBar.
- v5.7.9 — settings panel fix (single Sheet), 4-tab layout, i18n error/404 pages, `SETTINGS_FIELDS` single source of truth, 16 dead locale keys and 4 unused UI components removed.

See [CHANGELOG.md](./CHANGELOG.md) for the full history.

## Contributing

Read the [Code Review Standard](./.github/CODE_REVIEW_STANDARD.md) and [PR Template](./.github/PULL_REQUEST_TEMPLATE.md). Create a feature branch from `main`, complete the self-checklist, ensure CI passes, and request review. Keep source files ≤ 200 lines, add semantic kebab-case ids to major containers, and bump the patch version on every change.

## Security

- `crypto.getRandomValues()` for randomness; input sanitisation for lists and prefix/suffix.
- No `dangerouslySetInnerHTML`, no `eval`; CSP + HSTS + 6 other security headers in `next.config.ts`.
- All data stays in the browser; no secrets in code or logs.

## License

MIT License
