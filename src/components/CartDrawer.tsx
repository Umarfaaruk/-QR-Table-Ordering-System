import { useState } from 'react'
import { X, Plus, Minus, Trash2, Loader2, ShoppingBag } from 'lucide-react'
import type { CartItem } from '../types'
import { formatINR } from '../utils/format'
import VegBadge from './VegBadge'

interface CartDrawerProps {
  open: boolean
  items: CartItem[]
  tableNumber: string
  submitting: boolean
  onClose: () => void
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
  onConfirm: (specialInstructions: string) => void
}

export default function CartDrawer({
  open,
  items,
  tableNumber,
  submitting,
  onClose,
  onIncrement,
  onDecrement,
  onConfirm,
}: CartDrawerProps) {
  const [instructions, setInstructions] = useState('')
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0)
  const itemCount = items.reduce((s, it) => s + it.quantity, 0)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-sm"
        onClick={submitting ? undefined : onClose}
      />

      <div className="relative w-full max-w-[480px] animate-slide-up rounded-t-3xl glass-strong shadow-glass-lg sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Your Order</h2>
              <p className="text-xs text-white/45">{tableNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="thin-scrollbar max-h-[40vh] overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <p className="py-8 text-center text-white/40">Your cart is empty.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xl">
                    {it.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <VegBadge isVeg={it.isVeg} size={14} />
                      <p className="truncate text-sm font-semibold text-white">{it.name}</p>
                    </div>
                    <p className="text-xs text-white/45">{formatINR(it.price)}</p>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-2 py-1 text-gold">
                    <button
                      onClick={() => onDecrement(it.id)}
                      className="transition active:scale-90"
                      aria-label="Decrease"
                    >
                      {it.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} strokeWidth={3} />}
                    </button>
                    <span className="w-4 text-center text-sm font-bold">{it.quantity}</span>
                    <button
                      onClick={() => onIncrement(it.id)}
                      className="transition active:scale-90"
                      aria-label="Increase"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>

                  <span className="w-16 text-right text-sm font-bold text-white">
                    {formatINR(it.price * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Special instructions */}
        {items.length > 0 && (
          <div className="px-5 pb-2">
            <label className="text-xs font-semibold text-white/60">Special Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less spicy, no onions…"
              rows={2}
              className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
            />
          </div>
        )}

        {/* Footer / confirm */}
        <div className="border-t border-white/10 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-white/50">
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </span>
            <span className="font-display text-xl font-bold text-gradient-gold">{formatINR(total)}</span>
          </div>
          <button
            disabled={items.length === 0 || submitting}
            onClick={() => onConfirm(instructions.trim())}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold py-3.5 text-base font-bold text-charcoal shadow-glow-gold transition active:scale-[0.98] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Placing order…
              </>
            ) : (
              'Confirm Order'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
