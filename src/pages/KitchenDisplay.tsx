import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ChefHat,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Inbox,
} from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { updateOrderStatus } from '../firebase/orderService'
import type { Order, OrderStatus } from '../types'
import { formatINR, formatTime, summariseItems } from '../utils/format'
import { playDing } from '../utils/sound'
import { DEMO_MODE } from '../firebase/config'
import OrderCard from '../components/OrderCard'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

export default function KitchenDisplay() {
  const { orders, loading, newOrderId, clearNewOrder } = useOrders()
  const now = useClock()
  const [soundOn, setSoundOn] = useState(true)
  const [showCompleted, setShowCompleted] = useState(false)
  const soundOnRef = useRef(soundOn)
  soundOnRef.current = soundOn

  // Ding + toast whenever a new order lands.
  useEffect(() => {
    if (!newOrderId) return
    const order = orders.find((o) => o.id === newOrderId)
    if (order) {
      if (soundOnRef.current) playDing()
      toast.success(`New order — ${order.tableNumber}`, { icon: '🔔' })
    }
    clearNewOrder()
  }, [newOrderId, orders, clearNewOrder])

  const active = useMemo(
    () => orders.filter((o) => o.status !== 'completed'),
    [orders],
  )
  const completed = useMemo(
    () => orders.filter((o) => o.status === 'completed'),
    [orders],
  )

  const advance = async (order: Order, next: OrderStatus) => {
    try {
      await updateOrderStatus(order.id, next)
      if (next === 'completed') {
        toast.success(`${order.orderId} completed ✓`)
      }
    } catch {
      toast.error('Failed to update order')
    }
  }

  return (
    <div className="min-h-screen bg-kitchen text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-kitchen/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-lg p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
              aria-label="Back to home"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-charcoal">
              <ChefHat size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black leading-tight md:text-2xl">
                Kitchen Display
              </h1>
              <p className="text-xs text-white/40">Café Spice — Hyderabad</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Counts */}
            <div className="hidden items-center gap-4 sm:flex">
              <Stat label="Active" value={active.length} accent="text-gold" />
              <Stat label="Completed Today" value={completed.length} accent="text-green-400" />
            </div>
            {/* Sound toggle */}
            <button
              onClick={() => setSoundOn((s) => !s)}
              className="rounded-lg border border-white/10 p-2.5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label={soundOn ? 'Mute notifications' : 'Unmute notifications'}
              title={soundOn ? 'Sound on' : 'Sound off'}
            >
              {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            {/* Live clock */}
            <div className="rounded-xl bg-white/5 px-4 py-2 text-center font-mono tabular-nums">
              <p className="text-xl font-bold leading-none">
                {now.toLocaleTimeString('en-GB')}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-widest text-white/40">
                {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile counts */}
        <div className="flex items-center justify-center gap-6 border-t border-white/5 py-2 sm:hidden">
          <Stat label="Active" value={active.length} accent="text-gold" />
          <Stat label="Completed" value={completed.length} accent="text-green-400" />
        </div>
      </header>

      {DEMO_MODE && (
        <div className="border-b border-gold/20 bg-gold/5 px-5 py-2 text-center text-xs text-gold/80">
          🔴 Demo mode — a fresh order drops in automatically every 30 seconds.
        </div>
      )}

      {/* Board */}
      <main className="mx-auto max-w-7xl px-5 py-6">
        {loading ? (
          <KitchenSkeleton />
        ) : active.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {active.map((order) => (
              <OrderCard key={order.id} order={order} onAdvance={advance} />
            ))}
          </div>
        )}

        {/* Completed today */}
        {completed.length > 0 && (
          <section className="mt-10">
            <button
              onClick={() => setShowCompleted((s) => !s)}
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-left transition hover:bg-white/10"
            >
              <span className="font-bold text-white/80">
                Completed Today
                <span className="ml-2 rounded-full bg-green-500/20 px-2.5 py-0.5 text-sm text-green-400">
                  {completed.length}
                </span>
              </span>
              {showCompleted ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showCompleted && (
              <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-left text-white/40">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Order</th>
                      <th className="px-4 py-2.5 font-semibold">Table</th>
                      <th className="hidden px-4 py-2.5 font-semibold md:table-cell">Items</th>
                      <th className="px-4 py-2.5 font-semibold">Time</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {completed.map((o) => (
                      <tr key={o.id} className="text-white/70">
                        <td className="px-4 py-2.5 font-semibold text-white">{o.orderId}</td>
                        <td className="px-4 py-2.5">{o.tableNumber}</td>
                        <td className="hidden max-w-xs truncate px-4 py-2.5 md:table-cell">
                          {summariseItems(o.items)}
                        </td>
                        <td className="px-4 py-2.5">{formatTime(o.timestamp)}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-white">
                          {formatINR(o.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-black leading-none ${accent}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-white/40">{label}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/5">
        <Inbox size={48} className="text-white/30" />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-white/80">No active orders</h2>
      <p className="mt-2 text-white/40">
        New orders will appear here the moment a customer places them.
      </p>
    </div>
  )
}

function KitchenSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-2xl border-2 border-white/5 bg-kitchen-card"
        />
      ))}
    </div>
  )
}
