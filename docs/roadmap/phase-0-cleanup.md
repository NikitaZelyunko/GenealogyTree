# Phase 0 — Cleanup & Tooling

**Goal:** strip the project down to a lean Vite + Vue 3 + TypeScript base:
no Nuxt, no external UI kit, up-to-date dependencies, fast linting with oxlint.

**Current state:** Nuxt 4 (`nuxt.config.ts`, `app/` dir, `pages/`, `layouts/`,
`middleware/`, `plugins/`), PrimeVue + Volt + tailwindcss-primeui, mock-data
`features/person` module, D3 experiments in `app/components/`.

> Note: `package.json` already has `vite:dev` / `vite:build` / `vite:preview`
> scripts and a root `index.html` — the migration is partly prepared.

---

### 0.1 Inventory and quarantine of existing code

- Audit `app/` and decide per file: keep / rewrite / delete.
- Move keep-for-reference code (D3 experiments `tree.ts`, `romanov-tree*.ts`,
  `flare.ts`, `PersonCard.vue`, `mock-person-data.ts`) into `legacy/` — excluded
  from the build, deleted after Phase 4.
- Delete Nuxt-only code: `app/middleware/`, `app/plugins/myTestPlugin.ts`,
  `app/layouts/` (rebuilt in Phase 2), `app/pages/` (re-created under `src/views/`
  with vue-router).

**Done when:** a list of keep/delete decisions is recorded in this file or a
commit message; `legacy/` exists.

### 0.2 Remove Nuxt → plain Vite + Vue 3

- Remove deps: `nuxt`; remove `nuxt.config.ts`, `.nuxt/`, `.output/`.
- Restructure to a standard Vite layout: `src/` with `main.ts`, `App.vue`,
  `router/`, `assets/`; keep the root `index.html` as the entry.
- Add `vue-router` explicitly (Nuxt routing is gone).
- Replace `~/` alias with `@/ → src/` in `vite.config.ts` and `tsconfig`.
- Port `app/app.vue` → `src/App.vue` (drop Nuxt components: `NuxtPage`,
  `NuxtLayout`, etc.).
- Rework scripts: `dev`/`build`/`preview` become the Vite ones; drop
  `postinstall: nuxt prepare`, `generate`, Nuxt-based `typecheck`
  (use `vue-tsc -b`).
- Merge/adjust tsconfigs: keep `tsconfig.app.json` + `tsconfig.node.json`
  based on `@vue/tsconfig`; remove Nuxt-generated tsconfig references.

**Done when:** `npm run dev` and `npm run build` work without Nuxt;
`npm run typecheck` (vue-tsc) passes; no `nuxt` imports remain (`grep -r "nuxt" src package.json` is clean except docs).

### 0.3 Remove the UI kit (PrimeVue / Volt)

- Remove deps: `primevue`, `tailwindcss-primeui`; delete `app/volt/`,
  `app/plugins/prime-vue.ts`, `app/assets/css/theme.css` (PrimeVue theme).
- Replace usages of PrimeVue/Volt components in kept code with plain HTML +
  Tailwind stubs (a minimal local `BaseButton` etc. where needed to compile).
- Create an empty home for the future kit: `src/ui/` (our own components land
  here from Phase 2 onward).
- Decide on icons: keep the `icons-font-generator` pipeline (it is ours) or
  replace with inline SVGs — record the decision.

**Done when:** no `primevue` / `volt` imports anywhere; the app compiles and
renders with Tailwind-only styling.

### 0.4 Update packages

- After 0.2–0.3 settle, bump everything: `npm outdated`, update `vue`,
  `vite`, `typescript`, `vue-tsc`, `tailwindcss`, `d3*`, eslint stack, prettier
  stack to latest stable (respecting breaking changes — read changelogs for
  majors, e.g. Tailwind 4, ESLint flat config).
- Re-run the full verification: dev, build, typecheck, lint.

**Done when:** `npm outdated` shows nothing actionable; the app works.

### 0.5 Add oxlint

- Install `oxlint` as a devDependency; add `oxlintrc.json` (start with
  `correctness` + `suspicious` categories, enable the `typescript` and `vue`
  plugins as supported).
- Scripts: `"lint": "oxlint && eslint"` (oxlint for speed/CI, eslint kept for
  Vue/ stylistic rules oxlint doesn't cover yet); add `lint:fix`.
- Wire into a pre-commit hook (`simple-git-hooks` + `lint-staged`, or document
  manual usage).
- Fix or consciously suppress all findings.

**Done when:** `npm run lint` runs oxlint first and passes clean.

### 0.6 Test runner scaffolding (Vitest)

- Add `vitest` + `@vue/test-utils` + `happy-dom` (or `jsdom`); add
  `fake-indexeddb` for the Dexie tests coming in Phase 1.
- `npm run test` script; one smoke test to prove the setup.

**Done when:** `npm run test` runs and passes.

---

**Phase 0 exit criteria:** Vite-only app boots; zero Nuxt/PrimeVue code;
all deps current; `typecheck` + `lint` + `test` + `build` all green.
