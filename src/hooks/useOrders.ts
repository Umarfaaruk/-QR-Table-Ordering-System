import { useEffect, useRef, useState } from 'react'
import { subscribeToOrders } from '../firebase/orderService'
import type { Order } from '../types'

interface UseOrdersResult {
  orders: Order[]
  loading: boolean
  /** True only when a brand-new order arrives after the initial load. */
  newOrderId: string | null
  clearNewOrder: () => void
}

/**
 * Subscribes to the live orders feed. Tracks when a *new* order arrives
 * (vs. the initial snapshot) so the Kitchen Display can play a sound.
 */
export function useOrders(): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [newOrderId, setNewOrderId] = useState<string | null>(null)
  const knownIds = useRef<Set<string>>(new Set())
  const initialised = useRef(false)

  useEffect(() => {
    const unsub = subscribeToOrders((next) => {
      if (initialised.current) {
        const fresh = next.find((o) => !knownIds.current.has(o.id))
        if (fresh) setNewOrderId(fresh.id)
      }
      knownIds.current = new Set(next.map((o) => o.id))
      initialised.current = true
      setOrders(next)
      setLoading(false)
    })
    return unsub
  }, [])

  return {
    orders,
    loading,
    newOrderId,
    clearNewOrder: () => setNewOrderId(null),
  }
}
