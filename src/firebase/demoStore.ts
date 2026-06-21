// ─────────────────────────────────────────────────────────────
// In-memory demo store
// ─────────────────────────────────────────────────────────────
// Simulates a real-time Firestore "orders" collection when no Firebase
// project is configured. Supports subscribe() (onSnapshot equivalent),
// add/update/remove, and an automatic fake-order generator so the
// Kitchen Display feels alive during a live demo.
// ─────────────────────────────────────────────────────────────

import type { Order, OrderStatus, OrderItem } from '../types'
import { DEMO_MENU } from '../data/menuData'

type Listener = (orders: Order[]) => void

const TABLE_POOL = ['table-1', 'table-2', 'table-3', 'table-5', 'table-7', 'table-9', 'table-12']

let orders: Order[] = []
let listeners: Listener[] = []
let orderCounter = 0
let autoTimer: ReturnType<typeof setInterval> | null = null
let seeded = false

function nextOrderId(): string {
  orderCounter += 1
  return `ORD-${String(orderCounter).padStart(3, '0')}`
}

function emit() {
  // Newest first — matches the Firestore query ordering.
  const sorted = [...orders].sort((a, b) => b.timestamp - a.timestamp)
  listeners.forEach((l) => l(sorted))
}

function pickItems(): OrderItem[] {
  const count = 1 + Math.floor(Math.random() * 3)
  const chosen = new Map<string, OrderItem>()
  for (let i = 0; i < count; i++) {
    const m = DEMO_MENU[Math.floor(Math.random() * DEMO_MENU.length)]
    const existing = chosen.get(m.id)
    if (existing) {
      existing.quantity += 1
    } else {
      chosen.set(m.id, {
        id: m.id,
        name: m.name,
        price: m.price,
        quantity: 1 + Math.floor(Math.random() * 2),
        isVeg: m.isVeg,
      })
    }
  }
  return Array.from(chosen.values())
}

const INSTRUCTIONS_POOL = [
  '',
  '',
  'Extra spicy please 🌶️',
  'No onion, no garlic',
  'Less oil',
  'Make it Jain',
  'Birthday — add a candle 🎂',
]

function makeFakeOrder(status: OrderStatus = 'pending', ageMins = 0): Order {
  const items = pickItems()
  const totalAmount = items.reduce((s, it) => s + it.price * it.quantity, 0)
  const tableId = TABLE_POOL[Math.floor(Math.random() * TABLE_POOL.length)]
  const tableNumber = `Table ${tableId.split('-')[1]}`
  const oid = nextOrderId()
  return {
    id: oid,
    orderId: oid,
    tableId,
    tableNumber,
    items,
    totalAmount,
    status,
    specialInstructions: INSTRUCTIONS_POOL[Math.floor(Math.random() * INSTRUCTIONS_POOL.length)],
    timestamp: Date.now() - ageMins * 60 * 1000,
  }
}

// Seed a few orders so the kitchen/admin screens aren't empty on first load.
function seed() {
  if (seeded) return
  seeded = true
  orders = [
    makeFakeOrder('pending', 1),
    makeFakeOrder('preparing', 6),
    makeFakeOrder('ready', 11),
    makeFakeOrder('completed', 35),
    makeFakeOrder('completed', 52),
    makeFakeOrder('completed', 70),
  ]
}

export const demoStore = {
  subscribe(listener: Listener): () => void {
    seed()
    listeners.push(listener)
    // Push current state immediately (like onSnapshot does).
    const sorted = [...orders].sort((a, b) => b.timestamp - a.timestamp)
    listener(sorted)
    this.startAutoGenerator()
    return () => {
      listeners = listeners.filter((l) => l !== listener)
      if (listeners.length === 0) this.stopAutoGenerator()
    }
  },

  addOrder(order: Omit<Order, 'id' | 'orderId' | 'timestamp'>): Order {
    seed()
    const oid = nextOrderId()
    const full: Order = { ...order, id: oid, orderId: oid, timestamp: Date.now() }
    orders.push(full)
    emit()
    return full
  },

  updateStatus(id: string, status: OrderStatus) {
    const o = orders.find((x) => x.id === id)
    if (o) {
      o.status = status
      emit()
    }
  },

  getAll(): Order[] {
    seed()
    return [...orders].sort((a, b) => b.timestamp - a.timestamp)
  },

  // Drops a fresh "pending" order onto the board every 30s — gives the
  // Kitchen Display a live, demo-friendly heartbeat.
  startAutoGenerator() {
    if (autoTimer) return
    autoTimer = setInterval(() => {
      orders.push(makeFakeOrder('pending', 0))
      emit()
    }, 30000)
  },

  stopAutoGenerator() {
    if (autoTimer) {
      clearInterval(autoTimer)
      autoTimer = null
    }
  },
}
