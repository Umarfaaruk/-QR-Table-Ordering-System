// ─────────────────────────────────────────────────────────────
// Menu service — abstracts Firestore vs. demo data
// ─────────────────────────────────────────────────────────────

import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db, DEMO_MODE } from './config'
import { DEMO_MENU } from '../data/menuData'
import type { MenuItem } from '../types'

const MENU = 'menuItems'

// Mutable in-memory copy used in DEMO MODE so admin edits persist for
// the lifetime of the session.
let demoMenu: MenuItem[] = [...DEMO_MENU]

/** Fetch all menu items. Falls back to demo data on any error. */
export async function fetchMenuItems(): Promise<MenuItem[]> {
  if (DEMO_MODE || !db) {
    return [...demoMenu]
  }
  try {
    const snap = await getDocs(collection(db, MENU))
    if (snap.empty) {
      // Nothing seeded yet — return demo data so the menu isn't blank.
      return [...DEMO_MENU]
    }
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MenuItem, 'id'>) }))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('fetchMenuItems failed, using demo data:', err)
    return [...DEMO_MENU]
  }
}

/** Add a new menu item. Returns the created item (with id). */
export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  if (DEMO_MODE || !db) {
    const created: MenuItem = { ...item, id: `item-${Date.now()}` }
    demoMenu = [...demoMenu, created]
    return created
  }
  const ref = await addDoc(collection(db, MENU), item)
  return { ...item, id: ref.id }
}

/** Update an existing menu item. */
export async function updateMenuItem(id: string, item: Omit<MenuItem, 'id'>): Promise<void> {
  if (DEMO_MODE || !db) {
    demoMenu = demoMenu.map((m) => (m.id === id ? { ...item, id } : m))
    return
  }
  await updateDoc(doc(db, MENU, id), item)
}

/** Delete a menu item. */
export async function deleteMenuItem(id: string): Promise<void> {
  if (DEMO_MODE || !db) {
    demoMenu = demoMenu.filter((m) => m.id !== id)
    return
  }
  await deleteDoc(doc(db, MENU, id))
}
