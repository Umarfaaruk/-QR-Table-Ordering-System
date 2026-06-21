import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShoppingBag, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react'
import { CATEGORIES, type Category, type MenuItem, type CartItem, type Order } from '../types'
import { useMenuItems } from '../hooks/useMenuItems'
import { placeOrder } from '../firebase/orderService'
import { formatINR, summariseItems } from '../utils/format'
import MenuCard from '../components/MenuCard'
import CartDrawer from '../components/CartDrawer'

function tableLabel(tableId: string): string {
  const num = tableId.replace(/^table-?/i, '')
  return `Table ${num || tableId}`
}

export default function CustomerMenu() {
  const { tableId = 'table-1' } = useParams()
  const { items, loading } = useMenuItems()

  const [cart, setCart] = useState<Record<string, CartItem>>({})
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0])
  const [cartOpen, setCartOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const isManualScroll = useRef(false)

  const tableNumber = tableLabel(tableId)

  // Group items by category, preserving the canonical category order.
  const grouped = useMemo(() => {
    const map: Record<Category, MenuItem[]> = {
      Starters: [],
      'Main Course': [],
      Beverages: [],
      Desserts: [],
    }
    items.forEach((it) => map[it.category]?.push(it))
    return map
  }, [items])

  const cartList = Object.values(cart)
  const cartTotal = cartList.reduce((s, it) => s + it.price * it.quantity, 0)
  const cartCount = cartList.reduce((s, it) => s + it.quantity, 0)

  // ── Cart mutations ─────────────────────────────────────────
  const addToCart = (item: MenuItem) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: { ...item, quantity: (prev[item.id]?.quantity ?? 0) + 1 },
    }))
  }
  const decrement = (id: string) => {
    setCart((prev) => {
      const existing = prev[id]
      if (!existing) return prev
      const next = { ...prev }
      if (existing.quantity <= 1) delete next[id]
      else next[id] = { ...existing, quantity: existing.quantity - 1 }
      return next
    })
  }
  const incrementById = (id: string) => {
    setCart((prev) => {
      const existing = prev[id]
      if (!existing) return prev
      return { ...prev, [id]: { ...existing, quantity: existing.quantity + 1 } }
    })
  }

  // ── Category tab smooth scroll ─────────────────────────────
  const scrollToCategory = (cat: Category) => {
    setActiveCategory(cat)
    isManualScroll.current = true
    sectionRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => {
      isManualScroll.current = false
    }, 700)
  }

  // Highlight the tab for whichever section is in view while scrolling.
  useEffect(() => {
    const handler = () => {
      if (isManualScroll.current) return
      const offset = 160
      let current = CATEGORIES[0]
      for (const cat of CATEGORIES) {
        const el = sectionRefs.current[cat]
        if (el && el.getBoundingClientRect().top <= offset) current = cat
      }
      setActiveCategory((prev) => (prev === current ? prev : current))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // ── Place order ────────────────────────────────────────────
  const confirmOrder = async (specialInstructions: string) => {
    setSubmitting(true)
    try {
      const order = await placeOrder({
        tableId,
        tableNumber,
        items: cartList.map((it) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          isVeg: it.isVeg,
        })),
        totalAmount: cartTotal,
        specialInstructions,
      })
      setPlacedOrder(order)
      setCart({})
      setCartOpen(false)
    } catch (err) {
      toast.error('Could not place order. Please try again.')
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ─────────────────────────────────────────
  if (placedOrder) {
    return <OrderSuccess order={placedOrder} onNewOrder={() => setPlacedOrder(null)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative mx-auto min-h-screen max-w-[480px] bg-gray-50 shadow-xl">
        {/* Top banner */}
        <header className="sticky top-0 z-30 bg-charcoal text-white">
          <div className="flex items-center justify-between px-4 py-3.5">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-charcoal">
                🌶️
              </span>
              <div className="leading-tight">
                <p className="text-base font-extrabold">Café Spice</p>
                <p className="text-[11px] text-white/50">Hyderabad</p>
              </div>
            </Link>
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-charcoal">
              {tableNumber}
            </span>
          </div>

          {/* Category tabs */}
          <nav className="no-scrollbar flex gap-2 overflow-x-auto border-t border-white/10 px-3 py-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`flex-none whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-gold text-charcoal'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </header>

        {/* Menu list */}
        <main className="px-3 pb-32 pt-4">
          {loading ? (
            <MenuSkeleton />
          ) : (
            CATEGORIES.map((cat) => {
              const list = grouped[cat]
              if (!list || list.length === 0) return null
              return (
                <section
                  key={cat}
                  ref={(el) => {
                    sectionRefs.current[cat] = el
                  }}
                  className="scroll-anchor mb-6"
                >
                  <h2 className="mb-3 px-1 text-lg font-extrabold text-gray-900">
                    {cat}
                    <span className="ml-2 text-sm font-medium text-gray-400">
                      {list.length}
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {list.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        quantity={cart[item.id]?.quantity ?? 0}
                        onAdd={addToCart}
                        onIncrement={(i) => incrementById(i.id)}
                        onDecrement={(i) => decrement(i.id)}
                      />
                    ))}
                  </div>
                </section>
              )
            })
          )}
        </main>

        {/* Floating cart bar */}
        {cartCount > 0 && (
          <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 px-3 pb-3">
            <button
              onClick={() => setCartOpen(true)}
              className="flex w-full items-center justify-between rounded-2xl bg-gold px-5 py-3.5 text-charcoal shadow-2xl shadow-gold/30 transition active:scale-[0.98] animate-slide-up"
            >
              <span className="flex items-center gap-2 font-bold">
                <ShoppingBag size={20} />
                {cartCount} item{cartCount === 1 ? '' : 's'} • {formatINR(cartTotal)}
              </span>
              <span className="flex items-center gap-1 font-extrabold">
                Place Order →
              </span>
            </button>
          </div>
        )}

        <CartDrawer
          open={cartOpen}
          items={cartList}
          tableNumber={tableNumber}
          submitting={submitting}
          onClose={() => setCartOpen(false)}
          onIncrement={incrementById}
          onDecrement={decrement}
          onConfirm={confirmOrder}
        />
      </div>
    </div>
  )
}

// ── Success screen ───────────────────────────────────────────
function OrderSuccess({ order, onNewOrder }: { order: Order; onNewOrder: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-white px-6 py-10 shadow-xl">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-24 w-24 animate-bounce-in items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 size={56} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Order Placed! 🎉</h1>
          <p className="mt-2 text-gray-500">Your food is being prepared.</p>

          <div className="mt-3 flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 text-gold-dark">
            <Clock size={18} />
            <span className="font-bold">Estimated wait: ~20 minutes</span>
          </div>

          {/* Order summary */}
          <div className="mt-8 w-full rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left">
            <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-3">
              <span className="font-bold text-gray-900">{order.orderId}</span>
              <span className="rounded-full bg-charcoal px-3 py-0.5 text-xs font-bold text-gold">
                {order.tableNumber}
              </span>
            </div>
            <ul className="space-y-2 py-3">
              {order.items.map((it) => (
                <li key={it.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {it.quantity}× {it.name}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatINR(it.price * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            {order.specialInstructions && (
              <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                📝 {order.specialInstructions}
              </p>
            )}
            <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-lg font-black text-gray-900">
                {formatINR(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={onNewOrder}
            className="w-full rounded-xl bg-gold py-3.5 font-bold text-white transition hover:bg-gold-dark"
          >
            Order More Items
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          {summariseItems(order.items)}
        </p>
      </div>
    </div>
  )
}

// ── Loading skeleton ─────────────────────────────────────────
function MenuSkeleton() {
  return (
    <div className="space-y-3">
      <div className="mb-3 h-6 w-32 animate-pulse rounded bg-gray-200" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3">
          <div className="h-24 w-24 flex-none animate-pulse rounded-xl bg-gray-200" />
          <div className="flex flex-1 flex-col gap-2 py-1">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
            <div className="mt-auto flex justify-between">
              <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
              <div className="h-7 w-16 animate-pulse rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
