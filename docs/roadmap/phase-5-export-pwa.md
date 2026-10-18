# Phase 5 — Export / Import & PWA

**Goal:** full data portability (ZIP backup/restore) and true offline install.

---

### 5.1 Export

- Implement `exportAllData()` in `LocalPersonService`:
  - Dump Dexie tables to JSON (with a `formatVersion` field).
  - Read all OPFS files referenced by `avatarKey`/`photoKeys`.
  - Pack JSON + files into a ZIP via `fflate` (preferred — small, fast) or
    `jszip`; trigger browser download (`genealogy-backup-<date>.zip`).

### 5.2 Import

- Implement `importAllData(file)`:
  - Unzip; **validate JSON with the zod schemas** from Phase 1.1 before
    touching the DB; reject with a clear error on mismatch or unsupported
    `formatVersion`.
  - In a transaction: clear Dexie tables + OPFS, load persons/relationships,
    write media files back to OPFS.
- UI: `SettingsView.vue` (new route `/settings`) with Export button and
  Import file picker + destructive-action confirm ("replaces all current
  data").

**Done when:** round-trip test — export from profile A, import into a clean
profile B, trees and avatars identical. Include a corrupted-file negative
test.

### 5.3 PWA

- Add `vite-plugin-pwa`:
  - `manifest.webmanifest` (name, icons — generate from our icon pipeline,
    theme color), install prompt handling.
  - Service worker (Workbox, via the plugin): precache the app shell so it
    opens fully offline; runtime caching not needed for data (IndexedDB/OPFS
    are already local).
  - Update flow: prompt user to reload when a new version is available.
- Verify: Lighthouse PWA check; "Add to home screen" on desktop + Android;
  airplane-mode smoke test.

**Done when:** installed app launches offline with all data available;
export/import verified on the installed build.

---

**Phase 5 exit criteria:** backup/restore is lossless and validated; the app
is installable and fully functional offline.
