import { Plus, Minus } from 'lucide-react'
import type { MenuItem } from '../types'
import { formatINR } from '../utils/format'
import VegBadge from './VegBadge'

interface MenuCardProps {
  item: MenuItem
  quantity: number
  onAdd: (item: MenuItem) => void
  onIncrement: (item: MenuItem) => void
  onDecrement: (item: MenuItem) => void
}

export default function MenuCard({
  item,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
}: MenuCardProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:shadow-md">
      {/* Image / emoji tile */}
      <div className="flex h-24 w-24 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-amber-100 text-4xl">
        {item.emoji}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start gap-2">
          <VegBadge isVeg={item.isVeg} />
          <h3 className="truncate text-[15px] font-bold leading-tight text-gray-900">
            {item.name}
          </h3>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.description}</p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="text-base font-extrabold text-gray-900">
            {formatINR(item.price)}
          </span>

          {quantity === 0 ? (
            <button
              onClick={() => onAdd(item)}
              className="rounded-lg border border-gold bg-gold/10 px-5 py-1.5 text-sm font-bold text-gold-dark transition active:scale-95 hover:bg-gold hover:text-white"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-gold bg-gold/10 px-2 py-1">
              <button
                onClick={() => onDecrement(item)}
                aria-label="Decrease quantity"
                className="text-gold-dark transition active:scale-90"
              >
                <Minus size={16} strokeWidth={3} />
              </button>
              <span className="w-4 text-center text-sm font-bold text-gold-dark">
                {quantity}
              </span>
              <button
                onClick={() => onIncrement(item)}
                aria-label="Increase quantity"
                className="text-gold-dark transition active:scale-90"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
