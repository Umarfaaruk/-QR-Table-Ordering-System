// ─────────────────────────────────────────────────────────────
// Order service — abstracts Firestore vs. demo store
// ─────────────────────────────────────────────────────────────

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db, DEMO_MODE } from './config'
import { demoStore } from './demoStore'
import type { Order, OrderStatus } from '../types'

const ORDERS = 'orders'

type NewOrder = {
  tableId: string
  tableNumber: string
  items: Order['items']
  totalAmount: number
  specialInstructions: string
}

/** Normalise a Firestore document into our `Order` shape. */
function fromDoc(id: string, data: Record<string, unknown>): Order {
  const ts = data.timestamp as Timestamp | null
  return {
    id,
    orderId: (data.orderId as string) ?? id,
    tableId: (data.tableId as string) ?? '',
    tableNumber: (data.tableNumber as string) ?? '',
    items: (data.items as Order['items']) ?? [],
    totalAmount: (data.totalAmount as number) ?? 0,
    status: (data.status as OrderStatus) ?? 'pending',
    specialInstructions: (data.specialInstructions as string) ?? '',
    timestamp: ts?.toMillis ? ts.toMillis() : Date.now(),
  }
}

/** Place a new order. Returns the created order. */
export async function placeOrder(input: NewOrder): Promise<Order> {
  if (DEMO_MODE || !db) {
    return demoStore.addOrder({ ...input, status: 'pending' })
  }

  const orderId = `ORD-${Date.now().toString().slice(-6)}`
  const docRef = await addDoc(collection(db, ORDERS), {
    ...input,
    orderId,
    status: 'pending',
    timestamp: serverTimestamp(),
  })
  return {
    ...input,
    id: docRef.id,
    orderId,
    status: 'pending',
    timestamp: Date.now(),
  }
}

/** Subscribe to live order updates (newest first). Returns an unsubscribe fn. */
export function subscribeToOrders(callback: (orders: Order[]) => void): () => void {
  if (DEMO_MODE || !db) {
    return demoStore.subscribe(callback)
  }

  const q = query(collection(db, ORDERS), orderBy('timestamp', 'desc'))
  return onSnapshot(
    q,
    (snap) => {
      const orders = snap.docs.map((d) => fromDoc(d.id, d.data()))
      callback(orders)
    },
    (err) => {
      // eslint-disable-next-line no-console
      console.error('orders snapshot error:', err)
    },
  )
}

/** Update an order's status. */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (DEMO_MODE || !db) {
    demoStore.updateStatus(id, status)
    return
  }
  await updateDoc(doc(db, ORDERS, id), { status })
}
