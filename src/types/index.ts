// ─────────────────────────────────────────────────────────────
// Shared domain types for the QR Table Ordering System
// ─────────────────────────────────────────────────────────────

export type Category = 'Starters' | 'Main Course' | 'Beverages' | 'Desserts'

export const CATEGORIES: Category[] = [
  'Starters',
  'Main Course',
  'Beverages',
  'Desserts',
]

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: Category
  isVeg: boolean
  emoji: string
}

export interface CartItem extends MenuItem {
  quantity: number
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  isVeg: boolean
}

export interface Order {
  id: string
  orderId: string
  tableId: string
  tableNumber: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  specialInstructions: string
  // Stored as a Firestore Timestamp in production; normalised to a JS
  // number (epoch millis) when read so the UI can format it consistently.
  timestamp: number
}
