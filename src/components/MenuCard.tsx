import { Plus, Minus } from 'lucide-react'
import type { MenuItem } from '../types'
import { formatINR } from '../utils/format'
import VegBadge from './VegBadge'
import FoodImage from './FoodImage'

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
  const active = quantity > 0
  return (
    <div
      className={`group relative flex gap-3.5 overflow-hidden rounded-2xl p-3 transition-all duration-300 ${
        active
          ? 'glass-strong shadow-glow-gold'
          : 'glass hover:-translate-y-0.5 hover:border-white/20'
      }`}
    >
      {/* Dish photo */}
      <div className="relative h-28 w-28 flex-none">
        <div className="absolute -inset-1 rounded-xl bg-gold/20 opacity-0 blur-lg transition group-hover:opacity-100" />
        <FoodImage
          src={item.image}
          alt={item.name}
          emoji={item.emoji}
          className="relative h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start gap-2">
          <VegBadge isVeg={item.isVeg} />
          <h3 className="truncate text-[15px] font-bold leading-tight text-white">{item.name}</h3>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-white/45">{item.description}</p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="font-display text-base font-bold text-gradient-gold">
            {formatINR(item.price)}
          </span>

          {quantity === 0 ? (
            <button
              onClick={() => onAdd(item)}
              className="rounded-lg border border-gold/40 bg-gold/10 px-5 py-1.5 text-sm font-bold text-gold transition active:scale-95 hover:bg-gradient-gold hover:text-charcoal hover:shadow-glow-gold"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-lg bg-gradient-gold px-2 py-1 text-charcoal shadow-glow-gold">
              <button
                onClick={() => onDecrement(item)}
                aria-label="Decrease quantity"
                className="transition active:scale-90"
              >
                <Minus size={16} strokeWidth={3} />
              </button>
              <span className="w-4 text-center text-sm font-black">{quantity}</span>
              <button
                onClick={() => onIncrement(item)}
                aria-label="Increase quantity"
                className="transition active:scale-90"
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
