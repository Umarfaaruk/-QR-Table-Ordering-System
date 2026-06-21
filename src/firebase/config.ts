// ─────────────────────────────────────────────────────────────
// Firebase configuration
// ─────────────────────────────────────────────────────────────
// 1. Create a project at https://console.firebase.google.com
// 2. Add a Web App, then copy the config values into a `.env` file
//    (see `.env.example`).
// 3. Enable Cloud Firestore and Email/Password Authentication.
//
// If the env vars below are missing, the app falls back to DEMO MODE,
// which uses in-memory mock data + simulated real-time updates so the
// whole product can be explored with zero backend setup.
// ─────────────────────────────────────────────────────────────

import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// The app is considered "configured" only when the essential keys exist.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
)

let app: FirebaseApp | undefined
let db: Firestore | undefined
let auth: Auth | undefined

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } catch (err) {
    // Initialisation failed (e.g. malformed config) — degrade gracefully.
    // eslint-disable-next-line no-console
    console.error('Firebase init failed, falling back to demo mode:', err)
  }
}

// `DEMO_MODE` is true whenever we don't have a working Firestore instance.
export const DEMO_MODE = !isFirebaseConfigured || !db

export { app, db, auth }
