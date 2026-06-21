import { useState } from 'react'
import { X, Plus, Minus, Trash2, Loader2 } from 'lucide-react'
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={submitting ? undefined : onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-[480px] animate-slide-up rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Your Order</h2>
            <p className="text-xs text-gray-500">{tableNumber}</p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 disabled:opacity-40"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="max-h-[40vh] overflow-y-auto px-5 py-3 thin-scrollbar">
          {items.length === 0 ? (
            <p className="py-8 text-center text-gray-400">Your cart is empty.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="flex items-center gap-3">
                  <span className="text-2xl">{it.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <VegBadge isVeg={it.isVeg} size={14} />
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {it.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">{formatINR(it.price)}</p>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-gold bg-gold/10 px-2 py-1">
                    <button
                      onClick={() => onDecrement(it.id)}
                      className="text-gold-dark active:scale-90"
                      aria-label="Decrease"
                    >
                      {it.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} strokeWidth={3} />}
                    </button>
                    <span className="w-4 text-center text-sm font-bold text-gold-dark">
                      {it.quantity}
                    </span>
                    <button
                      onClick={() => onIncrement(it.id)}
                      className="text-gold-dark active:scale-90"
                      aria-label="Increase"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>

                  <span className="w-16 text-right text-sm font-bold text-gray-900">
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
            <label className="text-xs font-semibold text-gray-600">
              Special Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less spicy, no onions…"
              rows={2}
              className="mt-1 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>
        )}

        {/* Footer / confirm */}
        <div className="border-t border-gray-100 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </span>
            <span className="text-xl font-extrabold text-gray-900">
              {formatINR(total)}
            </span>
          </div>
          <button
            disabled={items.length === 0 || submitting}
            onClick={() => onConfirm(instructions.trim())}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-base font-bold text-white transition active:scale-[0.98] hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
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
