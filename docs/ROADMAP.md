# GenealogyTree — Development Roadmap

An offline-first application for digitizing genealogy: Vue 3 + TypeScript + Vite,
local storage (IndexedDB via Dexie + OPFS for media), an extensible graph-based
relationship model, and D3.js visualization.

## Guiding architecture

- **Data Service Layer** — Vue components and Pinia stores never touch Dexie/OPFS
  directly. All data access goes through a service interface (`IPersonService`,
  later `IRelationshipService`, `IMediaService`). The local implementation can be
  swapped for a remote API without UI changes.
- **Atomic relationships** — the DB stores only basic edges (`PARENT_CHILD`,
  `SPOUSE`, `GODPARENT`, ...). Derived kinship (siblings, grandparents, cousins)
  is computed on the fly, never stored.
- **Offline-first PWA** — all data lives on the device; export/import as a ZIP
  archive for backup and migration.

## Phase overview

| Phase | Name                                  | File                                                         | Depends on      |
| ----- | ------------------------------------- | ------------------------------------------------------------ | --------------- |
| 0     | Cleanup & tooling                     | [phase-0-cleanup.md](roadmap/phase-0-cleanup.md)             | —               |
| 1     | Foundation: domain model & data layer | [phase-1-data-layer.md](roadmap/phase-1-data-layer.md)       | 0               |
| 2     | App shell & person CRUD               | [phase-2-person-crud.md](roadmap/phase-2-person-crud.md)     | 1               |
| 3     | Relationship management               | [phase-3-relationships.md](roadmap/phase-3-relationships.md) | 2               |
| 4     | Tree visualization (D3)               | [phase-4-visualization.md](roadmap/phase-4-visualization.md) | 3               |
| 5     | Export/import & PWA                   | [phase-5-export-pwa.md](roadmap/phase-5-export-pwa.md)       | 1 (PWA: also 2) |
| 6     | Polish & hardening                    | [phase-6-polish.md](roadmap/phase-6-polish.md)               | 2–5             |

## Required work items (from project directive)

These four items are all scheduled in **Phase 0**, since everything else builds
on the cleaned-up base:

1. ✅ **Remove Nuxt** → task 0.2 (plain Vite + Vue 3 + vue-router).
2. ✅ **Remove the UI kit** (PrimeVue / Volt / tailwindcss-primeui) → task 0.3;
   our own component library grows incrementally starting in Phase 2.
3. ✅ **Update the packages** → task 0.4.
4. ✅ **Add linters (oxlint)** → task 0.5.

## Sequencing notes

- Phases are mostly sequential, but **Phase 4 (visualization)** and **Phase 5
  (export/PWA)** are independent of each other and can be done in either order —
  or in parallel by two people.
- The existing D3 experiments (`app/components/tree.ts`, `romanov-tree*.ts`)
  are reference material for Phase 4, not part of the final architecture. They
  survive the Phase 0 cleanup in a `legacy/` folder and are deleted once Phase 4
  lands.
- Each phase ends in a working, type-checked, linted application. No phase
  leaves the repo in a broken state.

## Definition of done (applies to every task)

- `npm run typecheck` passes.
- `npm run lint` (oxlint + eslint) and `npm run format:check` pass.
- New logic in the data layer has unit tests (Vitest).
- The app builds (`npm run build`) and runs (`npm run dev`).
