import { useCallback, useEffect, useState } from 'react'
import { fetchMenuItems } from '../firebase/menuService'
import type { MenuItem } from '../types'

interface UseMenuItemsResult {
  items: MenuItem[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/** Loads the menu (from Firestore or demo data) with loading + error state. */
export function useMenuItems(): UseMenuItemsResult {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMenuItems()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { items, loading, error, refresh: load }
}
