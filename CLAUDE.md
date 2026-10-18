# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GenealogyTree is an **offline-first** application for digitizing genealogy: Vue 3 + TypeScript + Vite, local storage (IndexedDB via Dexie for structured data, OPFS for media), an extensible graph-based relationship model, and D3.js tree visualization. Installable as a PWA; backup/restore via ZIP export/import.

> ⚠️ **The project is mid-rebuild.** The codebase is being migrated away from Nuxt + PrimeVue/Volt to plain Vite + Vue 3 with a custom UI kit. The authoritative plan is **[docs/ROADMAP.md](docs/ROADMAP.md)** (phase details in `docs/roadmap/phase-*.md`). Follow the roadmap, not the legacy code, when they conflict.

## Rebuild Status & Required Work

Per the project directive, all scheduled in **Phase 0** (`docs/roadmap/phase-0-cleanup.md`):

1. **Remove Nuxt** → plain Vite + Vue 3 + vue-router (`vite:*` scripts and root `index.html` already exist).
2. **Remove the UI kit** (PrimeVue, `app/volt/`, `tailwindcss-primeui`) → own component library in `src/ui/`, grown incrementally from Phase 2.
3. **Update all packages** after the removals settle.
4. **Add oxlint** (runs before eslint in `npm run lint`).

Until Phase 0 completes, the legacy stack below still describes parts of the repo.

## Target Architecture (post-rebuild)

### Data Service Layer — the key principle

Vue components and Pinia stores **never access Dexie or OPFS directly**. All data access goes through service interfaces (`IPersonService`, media, relationships) exported from a single injection point (`src/services/index.ts`). The local implementation (`src/services/local/LocalPersonService.ts`) can later be swapped for a remote API without UI changes.

### Atomic relationships only

The DB stores only basic edges: `PARENT_CHILD` (from=parent → to=child), `SPOUSE` (symmetric, stored once), `GODPARENT`, `FRIEND`, etc. Derived kinship (siblings, grandparents, cousins) is **computed on the fly** by pure functions in `src/domain/kinship.ts` — never stored as records. Adding a new relationship type should touch ≤3 files (type union, label, display section).

### Media storage

Binary files (avatars, photos) live in **OPFS**, keyed like `avatars/<personId>_<ts>`; IndexedDB holds only metadata and keys. Display via `URL.createObjectURL()`, and revoke URLs when done. Feature-detect `navigator.storage?.getDirectory`.

### Planned directory structure

```
src/
├── types/domain.ts        # Person, Relationship, UUID; zod schemas in schemas.ts
├── services/              # Interfaces + index.ts injection point
│   └── local/             # LocalPersonService, db.ts (Dexie), opfs.ts
├── domain/                # Pure logic: kinship.ts, tree-build.ts (testable, no I/O)
├── stores/                # Pinia stores wrapping the services
├── ui/                    # Own UI kit (BaseButton, BaseInput, BaseModal, ...)
├── views/ + router/       # vue-router pages
└── features/              # Feature components (person form, kinship panel, ...)
legacy/                    # Old D3 experiments for reference; deleted after Phase 4
```

### Domain model (target)

- `Person`: all name parts optional; `birthDate`/`deathDate` as ISO 8601 strings with partial dates allowed (`"1894"`, `"1894-07"`); places, comment, `avatarKey`, `photoKeys[]`, timestamps.
- `Relationship`: `type`, `fromPersonId`, `toPersonId`, free-form `metadata` (marriage date, role, ...).
- `UUID = string` via `crypto.randomUUID()`.
- zod schemas mirror the types — used to validate imports before touching the DB.
- Person delete is **cascading** (relationships where the person is either endpoint + all media keys), in a Dexie transaction.

### Dexie schema

```ts
persons:       'id, lastName, firstName, birthDate, deathDate'
relationships: 'id, type, fromPersonId, toPersonId, [fromPersonId+toPersonId]'
```
Schema changes = `db.version(n+1)` with `.upgrade()`.

## Development Commands

Current (pre-Phase-0) — see `package.json`; target scripts after cleanup:

```bash
npm run dev          # Vite dev server
npm run build        # vue-tsc -b && vite build
npm run preview      # Preview production build
npm run lint         # oxlint && eslint
npm run typecheck    # vue-tsc
npm run test         # Vitest (fake-indexeddb for Dexie tests)
npm run generate-icons  # Icon font from SVGs (kept — it's ours)
```

## Conventions

- **Explicit imports everywhere** — no auto-import magic (carried over from the Nuxt config philosophy).
- **Strict TypeScript**; `vue-tsc` typecheck must pass.
- **Tailwind CSS v4** via `@tailwindcss/vite`; dark mode via `prefers-color-scheme` (Tailwind `dark:` variant later).
- **No third-party UI components** after Phase 0 — everything from `src/ui/`, styled with Tailwind.
- ESLint flat config, `@stylistic` with 120-char line limit (Vue `@apply` lines exempt), Prettier for formatting.
- UI labels are in **Russian**.
- Tests: Vitest + `@vue/test-utils` + `fake-indexeddb`; data-layer logic must have unit tests (see Definition of Done in docs/ROADMAP.md).

## Legacy Notes (valid only until Phase 0 lands)

- `app/` Nuxt structure (`pages/`, `layouts/`, `plugins/prime-vue.ts`, `middleware/`) is being removed.
- `app/volt/` PrimeVue wrappers and `app/features/person/mock-person-data.ts` are disposable; the D3 experiments (`app/components/tree.ts`, `romanov-tree*.ts`, `flare.ts`) move to `legacy/` as Phase 4 reference material.
- Old date helper formats segmented dates as `YYYY.MM.DD` with `XX` for unknown parts — the new model uses ISO strings instead.
