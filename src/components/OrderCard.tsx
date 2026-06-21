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
    border: string
    badge: string
    label: string
    next: OrderStatus
    cta: string
    ctaClass: string
    icon: typeof Clock
  }
> = {
  pending: {
    border: 'border-red-500',
    badge: 'bg-red-500/15 text-red-400 border border-red-500/30',
    label: 'PENDING',
    next: 'preparing',
    cta: 'Start Preparing',
    ctaClass: 'bg-orange-500 hover:bg-orange-600',
    icon: Clock,
  },
  preparing: {
    border: 'border-gold animate-pulse-border',
    badge: 'bg-gold/15 text-gold border border-gold/30',
    label: 'PREPARING',
    next: 'ready',
    cta: 'Mark Ready',
    ctaClass: 'bg-gold hover:bg-gold-dark text-charcoal',
    icon: ChefHat,
  },
  ready: {
    border: 'border-green-500',
    badge: 'bg-green-500/15 text-green-400 border border-green-500/30',
    label: 'READY',
    next: 'completed',
    cta: 'Complete',
    ctaClass: 'bg-green-600 hover:bg-green-700',
    icon: CheckCircle2,
  },
}

export default function OrderCard({ order, onAdvance }: OrderCardProps) {
  const [, forceTick] = useState(0)

  // Re-render every 20s so the "x mins ago" label stays fresh.
  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 20000)
    return () => clearInterval(t)
  }, [])

  if (order.status === 'completed') return null
  const cfg = STATUS_CONFIG[order.status]
  const Icon = cfg.icon

  return (
    <div
      className={`flex flex-col rounded-2xl border-2 bg-kitchen-card shadow-lg transition ${cfg.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 p-4">
        <div>
          <h3 className="text-2xl font-black leading-none text-white">
            {order.orderId}
          </h3>
          <p className="mt-1 text-lg font-bold text-gold">{order.tableNumber}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold tracking-wide ${cfg.badge}`}
          >
            <Icon size={13} /> {cfg.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-white/40">
            <Clock size={12} /> {timeAgo(order.timestamp)}
          </span>
        </div>
      </div>

      {/* Items */}
      <ul className="flex-1 space-y-2 p-4">
        {order.items.map((it) => (
          <li key={it.id} className="flex items-center gap-2 text-white">
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-white/10 text-sm font-black text-gold">
              {it.quantity}
            </span>
            <VegBadge isVeg={it.isVeg} size={14} />
            <span className="flex-1 text-[15px] font-semibold">{it.name}</span>
          </li>
        ))}
      </ul>

      {/* Special instructions */}
      {order.specialInstructions && (
        <div className="mx-4 mb-3 rounded-lg bg-yellow-400/15 px-3 py-2">
          <p className="text-sm font-medium text-yellow-300">
            📝 {order.specialInstructions}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-white/10 p-4">
        <span className="text-lg font-extrabold text-white">
          {formatINR(order.totalAmount)}
        </span>
        <button
          onClick={() => onAdvance(order, cfg.next)}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition active:scale-95 ${cfg.ctaClass}`}
        >
          <Check size={16} strokeWidth={3} /> {cfg.cta}
        </button>
      </div>
    </div>
  )
}
