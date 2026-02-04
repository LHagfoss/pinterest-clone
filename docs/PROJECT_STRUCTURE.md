# Project Architecture & Data Flow

This document outlines the structure and key data flows of the Pinterest Clone application.

## 1. Tech Stack

-   **Frontend:** React Native (Expo), TypeScript, NativeWind (Tailwind CSS).
-   **State Management:** TanStack Query (React Query) + Zustand (Auth Store).
-   **Backend:** Firebase (Auth, Firestore, Storage, Cloud Functions).
-   **Navigation:** Expo Router.

## 2. Directory Structure

```
src/
├── api/             # Direct Firebase interactions (No state, just Promises)
│   ├── likes/       # Like/Unlike logic
│   ├── pins/        # CRUD for Pins
│   └── favorites/   # Save/Unsave logic
├── hooks/           # React Query wrappers (State, Caching, Optimistic Updates)
│   ├── likes/       # useIsLiked, useToggleLike
│   └── ...
├── components/      # Reusable UI components
│   ├── PinItem.tsx  # The main feed card
│   └── ui/          # Atomic components (Buttons, Text)
├── app/             # Screens & Navigation (File-based routing)
│   ├── (tabs)/      # Main app tabs
│   └── ...
├── stores/          # Global client state (User session)
└── schemas/         # Zod schemas for type validation
```

## 3. Key Feature Flows

### A. The "Like" Flow (Heart Button)

This system allows users to "Like" a pin. It uses a **transactional** sub-collection pattern to avoid write contention and allow scalable counting.

1.  **User Interaction:**
    *   User taps the **Heart Icon** on `PinDetailScreen`.
2.  **State Management (Optimistic Update):**
    *   The `useToggleLike` hook (React Query) immediately flips the `isLiked` boolean in the local cache.
    *   **Result:** The heart turns red instantly, zero latency.
3.  **API Request:**
    *   The hook calls `toggleLike(userId, pinId)`.
4.  **Database (Firestore):**
    *   **Path:** `pins/{pinId}/likes/{userId}`.
    *   **Action:**
        *   If document exists → **Delete it** (Unlike).
        *   If document is missing → **Create it** (Like) with `{ likedAt: timestamp }`.
5.  **Error Handling:**
    *   If the database write fails, React Query rolls back the optimistic update (Heart turns back white) and shows a Toast error.

### B. The "Save/Favorite" Flow (Star Button)

This allows users to save pins to their personal profile.

1.  **Database (Firestore):**
    *   **Path:** `users/{userId}/favorites/{pinId}`.
    *   **Data:** Stores a copy of the Pin data (denormalized) for easy rendering on the profile.

### C. Pin Creation & Image Processing

1.  **Upload:** Client uploads image to Firebase Storage (`pins/{pinId}/{filename}`).
2.  **Create Doc:** Client creates a Firestore document in `pins/{pinId}`.
3.  **Cloud Function (`processPinImage`):**
    *   Trigger: Storage `onFinalize`.
    *   Action: Downloads image, calculates **Dominant Color** and **Exact Ratio**.
    *   Update: Writes these values back to the `pins/{pinId}` document.
4.  **Result:** The feed displays the correct aspect ratio and a colored placeholder instantly.

## 4. Optimization Techniques

*   **Optimistic Updates:** All interactions (Like, Save) update the UI before the server responds.
*   **Memoization:** Heavy components (like `PinDetailImage`) are wrapped in `React.memo` to prevent flickering during parent re-renders.
*   **Masonry Layout:** Uses `FlashList` for high-performance recycling of views in the feed.
