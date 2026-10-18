# Phase 4 — Tree Visualization (D3.js)

**Goal:** interactive family tree view per person. Reference material lives in
`legacy/` (the old `tree.ts` / `romanov-tree*.ts` experiments) — mine it for
layout ideas, write fresh code against the service layer. Delete `legacy/`
when this phase ships.

---

### 4.1 Data → hierarchy transformer

- `src/domain/tree-build.ts` — pure functions:
  - `buildDescendantTree(rootId, persons, relationships)` — nested
    `{ person, children[] }` via `PARENT_CHILD` edges; cycle guard.
  - `buildAncestorTree(rootId, ...)` — same, upward.
  - Depth limit parameter (performance + readability for large families).
- Unit tests with synthetic graphs (incl. cycles, remarriage/multiple partners:
  a child's parents both appear even when not spouses).

**Done when:** transformers are tested pure functions, independent of D3.

### 4.2 `FamilyTree.vue` component

- `<div ref="chartContainer">`; D3 render function called from `onMounted` and
  re-run via `watch` on data (or `watchEffect` on the store).
- `d3-hierarchy` `tree()` layout; nodes = person cards (name, years, avatar
  thumbnail); links = curved paths; click node → navigate to that person's
  tree/detail.
- Zoom/pan via `d3-zoom`; fit-to-view on load.
- Ancestors/descendants mode toggle (and/or combined pedigree+descendant view).

**Done when:** `/person/:id/tree` renders the real tree from IndexedDB and
updates live when relationships change (no manual refresh).

### 4.3 Non-kin network view (stretch)

- `ConnectionsGraph.vue` — `d3-force` layout over `FRIEND` / `GODPARENT` /
  other non-kin edges. Global view (`/connections`), not per-person.
- Lower priority than 4.1–4.2; can slip to Phase 6 if time is tight.

**Done when (if in scope):** the graph renders and is stable/interactive.

### 4.4 Cleanup

- Delete `legacy/` D3 experiments; remove any leftover mock datasets
  (`romanov-tree*.ts`, `flare.ts`).

---

**Phase 4 exit criteria:** tree view works on real data for any person,
handles multi-partner families and missing data gracefully; `legacy/` is gone.
