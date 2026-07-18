import { useEffect, useState } from 'react'
import { Clock, ChefHat, CheckCircle2, Check } from 'lucide-react'
import type { Order, OrderStatus } from '../types'
import { formatINR, timeAgo } from '../utils/format'
import VegBadge from './VegBadge'

interface OrderCardProps {
  order: Order
  onAdvance: (order: Order, next: OrderStatus) => void
}

const STATUS_CONFIG: Record<
  Exclude<OrderStatus, 'completed'>,
  {
    ring: string
    glow: string
    badge: string
    dot: string
    label: string
    next: OrderStatus
    cta: string
    ctaClass: string
    icon: typeof Clock
  }
> = {
  pending: {
    ring: 'border-red-500/70',
    glow: 'shadow-[0_0_40px_-12px_rgba(239,68,68,0.6)]',
    badge: 'bg-red-500/15 text-red-300 border border-red-500/30',
    dot: 'bg-red-400',
    label: 'PENDING',
    next: 'preparing',
    cta: 'Start Preparing',
    ctaClass: 'bg-orange-500 hover:bg-orange-400 text-white',
    icon: Clock,
  },
  preparing: {
    ring: 'border-gold/70 animate-pulse-border',
    glow: 'shadow-[0_0_44px_-10px_rgba(245,166,35,0.6)]',
    badge: 'bg-gold/15 text-gold border border-gold/30',
    dot: 'bg-gold',
    label: 'PREPARING',
    next: 'ready',
    cta: 'Mark Ready',
    ctaClass: 'bg-gradient-gold hover:brightness-105 text-charcoal',
    icon: ChefHat,
  },
  ready: {
    ring: 'border-green-500/70',
    glow: 'shadow-[0_0_40px_-12px_rgba(34,197,94,0.6)]',
    badge: 'bg-green-500/15 text-green-300 border border-green-500/30',
    dot: 'bg-green-400',
    label: 'READY',
    next: 'completed',
    cta: 'Complete',
    ctaClass: 'bg-green-600 hover:bg-green-500 text-white',
    icon: CheckCircle2,
  },
}

export default function OrderCard({ order, onAdvance }: OrderCardProps) {
  const [, forceTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 20000)
    return () => clearInterval(t)
  }, [])

  if (order.status === 'completed') return null
  const cfg = STATUS_CONFIG[order.status]

  return (
    <div
      className={`flex animate-scale-in flex-col rounded-2xl border-2 glass-strong ${cfg.ring} ${cfg.glow}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 p-4">
        <div>
          <h3 className="font-display text-2xl font-bold leading-none text-white">{order.orderId}</h3>
          <p className="mt-1 font-display text-lg font-bold text-gradient-gold">{order.tableNumber}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide ${cfg.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} animate-glow-pulse`} />
            {cfg.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-white/40">
            <Clock size={12} /> {timeAgo(order.timestamp)}
          </span>
        </div>
      </div>

      {/* Items */}
      <ul className="flex-1 space-y-2 p-4">
        {order.items.map((it) => (
          <li key={it.id} className="flex items-center gap-2.5 text-white">
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-gold/15 text-sm font-black text-gold">
              {it.quantity}
            </span>
            <VegBadge isVeg={it.isVeg} size={14} />
            <span className="flex-1 text-[15px] font-semibold">{it.name}</span>
          </li>
        ))}
      </ul>

      {/* Special instructions */}
      {order.specialInstructions && (
        <div className="mx-4 mb-3 rounded-lg border border-yellow-400/25 bg-yellow-400/10 px-3 py-2">
          <p className="text-sm font-medium text-yellow-200">📝 {order.specialInstructions}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-white/10 p-4">
        <span className="font-display text-lg font-bold text-white">{formatINR(order.totalAmount)}</span>
        <button
          onClick={() => onAdvance(order, cfg.next)}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-95 ${cfg.ctaClass}`}
        >
          <Check size={16} strokeWidth={3} /> {cfg.cta}
        </button>
      </div>
    </div>
  )
}
