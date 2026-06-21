import { useEffect, useState } from 'react'
import { watchAuth } from '../firebase/authService'

interface UseAuthResult {
  isAuthed: boolean
  loading: boolean
}

/** Tracks admin authentication state (Firebase Auth or demo session). */
export function useAuth(): UseAuthResult {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = watchAuth((authed) => {
      setIsAuthed(authed)
      setLoading(false)
    })
    return unsub
  }, [])

  return { isAuthed, loading }
}
