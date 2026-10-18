# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GenealogyTree is an **offline-first** application for digitizing genealogy: Vue 3 + TypeScript + Vite, local storage (IndexedDB via Dexie for structured data, OPFS for media), an extensible graph-based relationship model, and D3.js tree visualization. Installable as a PWA; backup/restore via ZIP export/import.

> ✅ **Phase 0 complete.** The codebase is now plain Vite + Vue 3 + vue-router + Tailwind v4 with oxlint/eslint/prettier tooling and Vitest. The authoritative plan is **[docs/ROADMAP.md](docs/ROADMAP.md)** (phase details in `docs/roadmap/phase-*.md`). Next up: Phase 1 (domain model & data layer).

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
persons: 'id, lastName, firstName, birthDate, deathDate';
relationships: 'id, type, fromPersonId, toPersonId, [fromPersonId+toPersonId]';
```

Schema changes = `db.version(n+1)` with `.upgrade()`.

## Development Commands

```bash
npm run dev          # Vite dev server
npm run build        # vue-tsc -b && vite build
npm run preview      # Preview production build
npm run lint         # oxlint && eslint
npm run lint:fix     # oxlint --fix && eslint --fix
npm run typecheck    # vue-tsc -b
npm run test         # Vitest (fake-indexeddb for Dexie tests)
npm run format       # prettier --write .
npm run format:check # prettier --check .
npm run generate-icons  # Icon font from SVGs in src/assets/icons/ (kept — it's ours)
```

Pre-commit: `simple-git-hooks` + `lint-staged` run oxlint/eslint/prettier on staged files.

## Conventions

- **Explicit imports everywhere** — no auto-import magic (carried over from the Nuxt config philosophy).
- **Strict TypeScript**; `vue-tsc` typecheck must pass.
- **Tailwind CSS v4** via `@tailwindcss/vite`; dark mode via `prefers-color-scheme` (Tailwind `dark:` variant later).
- **No third-party UI components** after Phase 0 — everything from `src/ui/`, styled with Tailwind.
- ESLint flat config, `@stylistic` with 120-char line limit (Vue `@apply` lines exempt), Prettier for formatting.
- UI labels are in **Russian**.
- Tests: Vitest + `@vue/test-utils` + `fake-indexeddb`; data-layer logic must have unit tests (see Definition of Done in docs/ROADMAP.md).

## Legacy notes

- `legacy/` holds the old D3 experiments (`tree.ts`, `romanov-tree*.ts`, `flare.ts`) and the old mock person module as Phase 4 reference material; excluded from tsconfig/eslint/oxlint/prettier; deleted once Phase 4 lands.
- Old date helper formats segmented dates as `YYYY.MM.DD` with `XX` for unknown parts — the new model uses ISO strings instead.
- `typescript` stays on ^6 until vue-tsc supports TypeScript 7 (see phase-0 doc).
