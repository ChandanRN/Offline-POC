# Offline functionality (how it works)

This app is an **offline-first** Next.js + Firebase Firestore POC. The key idea is:

- Reads/writes go through **Firestore’s offline persistence (IndexedDB)**.
- While offline, changes are written to the local cache immediately.
- When the browser reconnects, the Firebase SDK automatically syncs pending writes to Firestore.
- The UI reflects sync status using Firestore document metadata.

---

## 1) Persistence: local cache + multi-tab support

File: `lib/firebase.ts`

Firestore is initialized with persistent local caching:

- `persistentLocalCache(...)` stores data in the browser **IndexedDB**.
- `persistentMultipleTabManager()` coordinates the cache across multiple browser tabs.

As a result, the app can still:
- query previously cached candidate data
- enqueue writes while offline

---

## 2) Connectivity UI

File: `components/OfflineBanner.tsx`

The banner uses:
- `window.navigator.onLine` to show an initial online/offline state
- `online` / `offline` event listeners to update the banner reactively

This is purely user feedback. The real offline behavior comes from Firestore persistence.

---

## 3) Writing while offline (create/update)

File: `components/CandidateForm.tsx`

### Add candidate
When you submit the form and **it’s offline**:
- `addDoc(collection(db, "candidates"), candidateData)` is still called.
- Because Firestore is configured with `persistentLocalCache`, the SDK queues the write in the local IndexedDB cache.
- The UI updates based on the listener (see next section) rather than waiting for the server.

Extra offline-related fields are also set:
- `offlineCreated = !window.navigator.onLine`
- `synced = window.navigator.onLine`

### Update candidate
When editing while offline:
- `updateDoc(doc(db, "candidates", editingCandidate.id), candidateData)` is called.
- The write is queued locally and merged into the cached document.

---

## 4) Reading while offline + real-time updates

File: `components/CandidateTable.tsx`

The candidate list uses Firestore’s realtime listener:

- `onSnapshot(q, { includeMetadataChanges: true }, ...)`
- Query: `collection(db, "candidates"), orderBy("createdAt", "desc")`

Because of persistence, `onSnapshot` can still return results from the local cache while offline.

---

## 5) Sync status: Pending vs Synced

File: `components/CandidateTable.tsx`

Each row sets:

- `hasPendingWrites: doc.metadata.hasPendingWrites`

Then renders:
- **Pending Sync** (amber + pulsing clock icon) when `hasPendingWrites === true`
- **Synced** (green + check icon) when `hasPendingWrites === false`

Firestore flips this automatically once queued writes have been acknowledged by the server.

---

## 6) Offline test procedure

1. Open: `/candidates`
2. Open browser DevTools → **Network**
3. Set throttling to **Offline**
4. Add or edit a candidate
5. Verify:
   - the row appears immediately
   - the row shows **Pending Sync**
6. Switch Network back to **No throttling** / online
7. Verify the badge changes to **Synced** automatically

---

## Files involved

- `lib/firebase.ts` — Firestore init with `persistentLocalCache` + `persistentMultipleTabManager`
- `components/OfflineBanner.tsx` — online/offline indicator UI
- `components/CandidateForm.tsx` — writes via `addDoc` / `updateDoc` (queued locally when offline)
- `components/CandidateTable.tsx` — `onSnapshot` + `doc.metadata.hasPendingWrites` for sync status

