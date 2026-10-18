# Phase 2 — App Shell & Person CRUD

**Goal:** a usable app: routing, layout, Pinia store over the service layer,
full person create/read/update/delete UI. Start of our own UI kit.

---

### 2.1 Routing & layout

- `src/router/index.ts` — routes: `/` (person list), `/person/new`,
  `/person/:id`, `/person/:id/edit`, `/person/:id/tree` (placeholder view
  until Phase 4), `/search` (optional, can merge into list).
- `src/App.vue` + `src/layouts/AppLayout.vue` — header with app title/nav,
  `<RouterView>`, footer.

**Done when:** navigation between stub pages works.

### 2.2 Own UI kit — first components (`src/ui/`)

Only what the CRUD needs; each component: props/events typed, minimal
accessible markup (label association, focus styles, keyboard), Tailwind styling.

- `BaseButton` (variants: primary/secondary/danger)
- `BaseInput`, `BaseTextarea`, `BaseSelect`
- `BaseCard`, `BaseModal`, `BaseAvatar` (image or initials fallback)
- `AppIcon` wrapper (whichever icon approach Phase 0.3 settled on)

**Done when:** components render in the app; no third-party UI deps.

### 2.3 Pinia store

- `src/stores/persons.ts` — holds the person list in a `ref`, exposes actions
  (`loadAll`, `create`, `update`, `remove`) that call `IPersonService` and
  update local state. Service provided via a single injection point
  (`src/services/index.ts` exporting the active implementation) so swapping
  local → remote later touches one file.
- Optionally `dexie-react-hooks`-style reactivity via Dexie `liveQuery` —
  decide: liveQuery-driven store vs explicit reload after mutations. Record
  the decision.

**Done when:** store unit test with a mocked service passes.

### 2.4 Person list page

- `src/views/PersonListView.vue` — cards or table: avatar, full name (any
  parts present), life years, comment excerpt; empty state; "Add person"
  button; click → detail. Simple client-side filter by name substring.

**Done when:** list reflects create/update/delete without reload.

### 2.5 Person form (create/edit)

- `src/views/PersonFormView.vue` / `src/features/person/PersonForm.vue` —
  all fields optional; date inputs tolerant of partial dates (validate against
  the zod schema); avatar upload (file picker → `IMediaService.uploadAvatar`,
  preview via object URL); save/cancel; delete with confirm modal (warn about
  cascade).

**Done when:** data survives page reload (verify in DevTools → IndexedDB).

### 2.6 Person detail page

- `src/views/PersonDetailView.vue` — all known fields, avatar + photo gallery,
  "Edit"/"Delete" actions, and a **Relationships** section (placeholder list
  fed by `getRelationshipsForPerson`; full management lands in Phase 3).

**Done when:** full CRUD loop works end to end in the browser.

---

**Phase 2 exit criteria:** a person can be created with avatar, viewed, edited,
and deleted; data persists across reloads; lint/typecheck/tests green.
