# Phase 6 — Polish & Hardening

**Goal:** turn the working app into a pleasant, robust product. Items here are
pull-as-needed; none block earlier phases.

---

### 6.1 Search & list UX

- Proper `/search` (or upgrade list filter): multi-field (name parts, place,
  year), tolerant of partial input; consider a tiny inverted index in memory
  if lists grow large (Dexie indexes cover exact/prefix matches).

### 6.2 UI kit maturation

- Flesh out `src/ui/`: form validation states, `Toast` notifications (success/
  error feedback for all mutations), `ConfirmDialog` standardization,
  `DateInput` with partial-date support, dark mode (Tailwind `dark:` variant).
- A simple `src/ui/README.md` documenting components and conventions.

### 6.3 Data model extensions (on demand)

- Life events as a new entity: `Event` (education, work, residence, illness,
  military service) linked to a person with date/place — same service-layer
  pattern, new Dexie table + version bump.
- More `RelationshipType`s per the Phase 3.4 drill.
- Multiple photos management UI (reorder, captions in metadata).

### 6.4 Quality gates

- CI (GitHub Actions): install → typecheck → oxlint/eslint → tests → build.
- E2E smoke tests with Playwright: create person → link two persons → tree
  renders → export → reimport.
- Error boundary + friendly fallback UI; OPFS/IndexedDB unavailable warnings
  (private-mode browsers).

### 6.5 Remote backend readiness (future, design only)

- Sketch `RemoteGenealogyService` implementing the Phase 1 interfaces over
  `fetch`; auth strategy; sync/conflict questions listed as open issues.
  **No implementation until a server exists.**

---

**Phase 6 exit criteria:** CI green on every commit; the app feels finished
for daily offline use.
