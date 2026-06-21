// ─────────────────────────────────────────────────────────────
// Auth service — Firebase Auth with a demo-mode fallback
// ─────────────────────────────────────────────────────────────
// In DEMO MODE there is no real backend, so we validate against the
// hardcoded demo credentials and persist a flag in localStorage.
// With Firebase configured, this uses Email/Password auth — create the
// admin user in the Firebase console first.
// ─────────────────────────────────────────────────────────────

import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, DEMO_MODE } from './config'

const DEMO_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@cafespice.com'
const DEMO_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'demo1234'
const DEMO_KEY = 'cafespice_admin_session'

export async function signIn(email: string, password: string): Promise<void> {
  if (DEMO_MODE || !auth) {
    if (email.trim().toLowerCase() === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD) {
      localStorage.setItem(DEMO_KEY, 'true')
      return
    }
    throw new Error('Invalid credentials')
  }
  await signInWithEmailAndPassword(auth, email, password)
}

export async function signOut(): Promise<void> {
  if (DEMO_MODE || !auth) {
    localStorage.removeItem(DEMO_KEY)
    return
  }
  await fbSignOut(auth)
}

/** Subscribe to auth state. Returns an unsubscribe fn. */
export function watchAuth(callback: (isAuthed: boolean) => void): () => void {
  if (DEMO_MODE || !auth) {
    callback(localStorage.getItem(DEMO_KEY) === 'true')
    // Listen for changes from other tabs.
    const handler = () => callback(localStorage.getItem(DEMO_KEY) === 'true')
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }
  return onAuthStateChanged(auth, (user) => callback(Boolean(user)))
}

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD }
