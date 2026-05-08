# Firebase Offline Candidate Management POC

This project is a production-ready Proof of Concept (POC) demonstrating **Offline-First Architecture** using Next.js 14, Firebase Firestore, and Tailwind CSS. It allows recruiters to manage candidate entries seamlessly, regardless of their internet connectivity.

## 🚀 How It Works

### 1. Offline-First Design
The application is designed to be fully functional without an active internet connection. This is achieved using **Firestore's Persistent Cache**:
- **IndexedDB Storage**: When data is written or read, it is first stored in a local IndexedDB instance within the browser.
- **Immediate UI Updates**: The UI responds instantly to user actions because it interacts with the local cache first, rather than waiting for a server response.
- **Multi-Tab Support**: Persistence is shared across multiple browser tabs using a specialized tab manager.

### 2. The Offline Workflow
- **Adding a Candidate (Offline)**: When a user submits the form while offline, the data is saved to the local cache immediately. The table updates instantly to show the new entry.
- **Pending Sync State**: Entries that haven't reached the server yet are marked with a **"Pending Sync"** badge. This is detected using Firestore's `hasPendingWrites` metadata.
- **Automatic Reconnection**: As soon as the browser detects an internet connection, the Firebase SDK automatically pushes all "pending" local changes to the cloud Firestore database.
- **Server Confirmation**: Once the server acknowledges the write, the local cache is updated, and the UI badge switches from "Pending Sync" to **"Synced"**.

## 🛠 Functionality

- **Candidate Entry Form**: Capture name, email, phone, and skills.
- **Real-time Data Table**: Uses `onSnapshot` to listen for changes. It updates in real-time whether the change came from the local user or the server.
- **Connectivity Monitoring**: An `OfflineBanner` component tracks the browser's online/offline status using the `window.navigator.onLine` API and event listeners.
- **Visual Feedback**:
    - **Synced Badge**: Green badge indicating data is safe on the server.
    - **Pending Sync Badge**: Amber badge indicating data is stored locally and waiting for internet.
    - **Banner**: Notifies the user if they are currently working in offline mode.

## 🏗 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Firebase Firestore
- **Persistence**: Firestore Offline Persistence (IndexedDB)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## 📂 Project Structure

- `lib/firebase.ts`: Configuration for Firestore with persistent local cache.
- `components/OfflineBanner.tsx`: Logic for monitoring connectivity.
- `components/CandidateForm.tsx`: Logic for adding candidates with offline-aware flags.
- `components/CandidateTable.tsx`: Real-time listener that differentiates between local and server data.
- `app/candidates/page.tsx`: The main dashboard layout.

## 🚦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Development Server**:
   ```bash
   npm run dev
   ```

3. **Open the App**:
   Navigate to [http://localhost:3000/candidates](http://localhost:3000/candidates).

## 🧪 How to Test Offline Mode
1. Open the Candidates dashboard.
2. Open Browser DevTools (F12) -> **Network** tab.
3. Change the throttling dropdown from "No throttling" to **"Offline"**.
4. Fill out the candidate form and submit.
5. Notice the entry appears instantly with a **Pending Sync** badge.
6. Switch the Network back to **"No throttling"** (Online).
7. Watch the badge change to **Synced** automatically.
