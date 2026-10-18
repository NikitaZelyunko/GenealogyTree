# Phase 3 — Relationship Management

**Goal:** users can link people with atomic relationships and see **computed**
kinship on the detail page. This is the core domain value of the app.

---

### 3.1 Relationship store

- `src/stores/relationships.ts` — cache relationships per person, actions
  wrapping the service (`create`, `remove`, `loadForPerson`); keep the person
  store in sync where needed.

### 3.2 "Add relationship" UI

- On `PersonDetailView`: "Add relationship" button → `RelationshipFormModal`:
  1. Pick `RelationshipType` from a select (list derived from the type union,
     with i18n-ready labels).
  2. Pick the other person — searchable person picker component
     (`PersonPicker.vue`: type-ahead over the persons store).
  3. Direction toggle where applicable: for `PARENT_CHILD`, "X is parent of
     Y" / "X is child of Y" — maps to from/to; for symmetric types, hidden.
  4. Optional metadata fields per type (e.g. marriage date for `SPOUSE`).
- Validation: no self-links, no exact duplicates (same type + same endpoints),
  no `PARENT_CHILD` cycles (walk ancestors via kinship utils before saving).

**Done when:** creating each relationship type works; invalid cases are
rejected with a clear message.

### 3.3 Computed kinship on the detail page

- `src/features/relationships/KinshipPanel.vue` — sections computed via
  `src/domain/kinship.ts` (Phase 1.6): Parents, Spouses, Children, Siblings,
  Grandparents, plus non-kin sections (Godparents/Godchildren, Friends) read
  directly. Each entry links to that person's detail page.
- Delete action per raw relationship (with confirm).

**Done when:** e.g. adding a `PARENT_CHILD` edge makes the child appear under
"Children" of the parent and the parent under "Parents" of the child, and
siblings appear once a second child shares a parent — all without any
"sibling" record in the DB. Verified in the browser + unit tests.

### 3.4 Relationship type extensibility check

- Add one new type end-to-end (e.g. `COLLEAGUE`) as a drill: should require
  only the type union entry, a label, and (optionally) a display section.

**Done when:** the drill touches ≤ 3 files — proves the extensibility
requirement.

---

**Phase 3 exit criteria:** full relationship lifecycle works; derived kinship
is always consistent with raw edges; adding a type is a near-trivial change.
