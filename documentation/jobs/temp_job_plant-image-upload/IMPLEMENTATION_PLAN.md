# Plant Detail Page – Image Upload UI

## 1. Feature Type

- [x] **UI Component** – New upload control in Images section
- [x] **API Integration** – Uses existing `usePlantImages.upload()` (Supabase Storage + plant_images table)

---

## 2. Required Information Checklist

**Always required:**
- [x] Clear description: User can upload an image with a tag on the plant detail page; image appears in the Images section.
- [x] Who uses this: Authenticated users (RLS requires `authenticated` role; anonymous users may fail).
- [x] Where: Plant detail page (`/plants/:id`), in the Images section of `PlantDetailContent`.

**API Integration (existing):**
- [x] `uploadPlantImage` service and `usePlantImages.upload(tag, file, displayOrder)` already implemented.
- [x] Storage RLS: `authenticated` can INSERT/UPDATE/DELETE in `plant-images` bucket.
- [x] Table RLS: `authenticated` can manage `plant_images`.

**UI Component:**
- [x] Design: MUI Button + hidden file input; tag Select (presets only).
- [x] Placement: In or above `ImagesSection` in `PlantDetailContent`.
- [x] States: loading during upload, error on failure, empty Images section when no images.

---

## 3. Foundation Validation

**What was tested:**
- `plantImagesService.uploadPlantImage` and `usePlantImages` exist and are used.
- Storage and table RLS policies allow authenticated users to upload.
- No file upload UI exists yet; this is the first.

**Result:** Backend is in place. Foundation risk is low because we are adding UI only. If upload fails (e.g. unauthenticated), we surface the error.

**Gate:** After implementation, manual test: sign in → open plant detail → upload image with tag → image appears.

---

## 4. User Stories

**US1: Upload image (happy path)**  
As a user on a plant detail page, I can select a file and choose a tag, then upload, so the image appears in the Images section.

- Acceptance: File input + tag Select visible; upload succeeds; image shows with correct tag; loading state during upload.

**US2: Error handling**  
As a user, if upload fails (network, auth, etc.), I see a clear error message.

- Acceptance: Error message displayed; user can retry.

**US3: Unauthenticated user (temporary)**  
As an unauthenticated user, I can upload images for now (app not hosted yet).

- Acceptance: Upload UI visible to all; RLS allows anon uploads. **Vulnerability:** Must restrict to authenticated before hosting (see DOC_PLANT_IMAGES.md).

**US4: Delete image (optional)**  
As a user, I can remove an image I uploaded.

- Acceptance: Delete control per image; image removed after delete.

---

## 5. Existing Functionality

| Item | Location | Purpose |
|------|----------|---------|
| `usePlantImages` | `src/features/plants/hooks/usePlantImages.ts` | `images`, `loading`, `error`, `upload`, `remove`, `refetch` |
| `PlantDetailContent` | `src/features/plants/components/PlantDetailContent/PlantDetailContent.tsx` | Renders plant + `ImagesSection` |
| `PlantDetailPage` | `src/pages/PlantDetailPage.tsx` | Uses `usePlantImages`, passes `images` only |
| `useAuthContext` | `src/shared/context/AuthContext.tsx` | `user` for auth checks |

---

## 6. Implementation Phases

### Phase 1: Upload UI (core)

- **Risk level:** 🟡 Medium (new UI, existing backend)
- **Work:**
  - Pass `upload`, `loading`, `error` from `PlantDetailPage` to `PlantDetailContent`.
  - Add upload control in `ImagesSection` (or new `ImageUploadSection`):
    - Hidden `<input type="file" accept="image/png,image/jpeg,image/webp" />` triggered by MUI Button.
    - Tag: MUI Select with presets only (small, medium, large, dying).
    - On file select: validate tag selected, call `upload(tag, file)`.
  - Show loading state during upload.
  - Show error message when `error` is set.
- **Gate test:** Plant detail → upload image with tag → image appears in Images section.
- **If gate fails:** Check network, Supabase config, RLS, and auth state.

**Files to modify:**
- `src/pages/PlantDetailPage.tsx` – pass `upload`, `loading`, `error`.
- `src/features/plants/components/PlantDetailContent/PlantDetailContent.tsx` – add upload UI, wire props.

---

### Phase 2: Delete and polish

- **Risk level:** 🟢 Low
- **Work:**
  - Add delete button per image; call `remove(tag)`.
  - Ensure Images section shows even when empty, with upload control visible.
  - Keep image area small; MUI compliant; simple.
- **Gate test:** Upload + delete work; layout compact.
- **If gate fails:** Adjust layout and handlers.

**Files to modify:**
- `PlantDetailContent.tsx` – delete buttons, compact image sizing.
- `PlantDetailPage.tsx` – pass `remove` to `PlantDetailContent`.

**Note:** No auth check in UI; unauthenticated uploads allowed temporarily (see vulnerability doc).

---

## 7. Technical Notes

- **Tag input:** Select with presets only (small, medium, large, dying). No free text.
- **File types:** `accept="image/png,image/jpeg,image/webp"` to align with bucket config.
- **Size:** Bucket limit 2MB; optional client-side validation before upload.
- **Project structure:** All changes in existing files; no new files required.
- **Architecture:** UI in `PlantDetailContent`; data flow via `PlantDetailPage` from `usePlantImages`.
- **Image area:** Keep small; MUI compliant; simple layout.

---

## 8. Decisions (user-confirmed)

1. **Tag input:** Select with presets only (small, medium, large, dying).
2. **Unauthenticated:** Temporarily allow uploads (app not hosted). Document vulnerability. RLS migration adds anon policies.
3. **UI:** Simple, MUI compliant, small image area.
4. **Delete:** Include in either phase.
