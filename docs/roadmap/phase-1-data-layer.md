# Phase 1 — Foundation: Domain Model & Data Layer

**Goal:** typed domain model, service interfaces, and a fully working local
implementation (Dexie + OPFS) with unit tests. No UI work in this phase.

---

### 1.1 Domain types

- `src/types/domain.ts`:
  - `Person` — all name parts optional; `birthDate`/`deathDate` as ISO strings
    (partial dates allowed, e.g. `"1894"` or `"1894-07"`); places, comment,
    `avatarKey`, `photoKeys[]`, `createdAt`/`updatedAt`.
  - `Relationship` — `type: RelationshipType` (`'PARENT_CHILD' | 'SPOUSE' |
    'GODPARENT' | 'FRIEND' | ...`), `fromPersonId`, `toPersonId`, free-form
    `metadata` (marriage date, role, ...). Direction conventions documented:
    `PARENT_CHILD`: from=parent → to=child; `GODPARENT`: from=godparent →
    to=godchild; `SPOUSE`: symmetric but stored once.
  - `UUID = string` (use `crypto.randomUUID()`).
- zod schemas mirroring these types (`src/types/schemas.ts`) — needed for
  import validation in Phase 5 anyway.

**Done when:** types + schemas compile; schema round-trip test passes.

### 1.2 Service interfaces

- `src/services/IPersonService.ts`, `IRelationshipService.ts`,
  `IMediaService.ts` (or one `IGenealogyService` — decide and record).
- Methods per the plan: full person CRUD (delete is cascading: relationships +
  media), relationship CRUD + `getRelationshipsForPerson`, media
  upload/getURL/delete, `exportAllData(): Promise<Blob>` /
  `importAllData(file): Promise<void>` (stubs until Phase 5 — throw
  `NotImplemented`).
- Document the contract: errors thrown, `undefined` vs throw on missing entity.

**Done when:** interfaces are written and documented.

### 1.3 Dexie setup

- `src/services/local/db.ts` — Dexie database `GenealogyDB`, version 1:
  - `persons: 'id, lastName, firstName, birthDate, deathDate'`
  - `relationships: 'id, type, fromPersonId, toPersonId, [fromPersonId+toPersonId]'`
- Migration strategy note: every schema change = `db.version(n+1)` with
  `.upgrade()`.

**Done when:** DB opens in a Vitest test with `fake-indexeddb`.

### 1.4 OPFS media store

- `src/services/local/opfs.ts` — save/read/delete by key
  (`avatars/<personId>_<ts>`, `photos/<personId>_<ts>_<i>`);
  `getObjectUrl(key)` with `URL.revokeObjectURL` discipline documented;
  graceful error when OPFS is unavailable (feature-detect
  `navigator.storage?.getDirectory`).

**Done when:** unit tests (mocked OPFS or manual browser verification) cover
save/read/delete.

### 1.5 `LocalPersonService` implementation

- `src/services/local/LocalPersonService.ts` implements 1.2 using 1.3 + 1.4.
- Cascading person delete: remove relationships where the person is either
  endpoint + all their media keys, in a Dexie transaction.

**Done when:** unit tests cover every method, including cascade delete and
referential integrity (no relationship pointing at a deleted person).

### 1.6 Kinship computation utilities (pure functions)

- `src/domain/kinship.ts` — pure functions over `(persons, relationships)`:
  `getParents`, `getChildren`, `getSpouses`, `getSiblings` (via shared parents,
  excluding self), `getGrandparents`, extensible for more.
- These are pure and trivially testable; the UI and Phase 4 both consume them.

**Done when:** unit tests for each function, incl. edge cases (half-siblings
with one shared parent, no parents, cycles guarded).

---

**Phase 1 exit criteria:** the entire data layer is usable from a test file
with zero UI; all tests green.
