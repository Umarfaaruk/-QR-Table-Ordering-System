import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { CATEGORIES, type Category, type MenuItem } from '../types'

interface MenuItemModalProps {
  initial?: MenuItem | null
  saving: boolean
  onClose: () => void
  onSave: (item: Omit<MenuItem, 'id'>) => void
}

const EMOJI_OPTIONS = ['🍛', '🍗', '🥘', '🍚', '🧀', '🥟', '🍲', '🐟', '☕', '🥤', '🍋', '🥭', '🍮', '🍫', '🍦', '🍰', '🥗', '🍜']

export default function MenuItemModal({ initial, saving, onClose, onSave }: MenuItemModalProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState<Category>(initial?.category ?? CATEGORIES[0])
  const [price, setPrice] = useState(initial?.price?.toString() ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [isVeg, setIsVeg] = useState(initial?.isVeg ?? true)
  const [emoji, setEmoji] = useState(initial?.emoji ?? '🍛')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: name.trim(),
      category,
      price: Number(price) || 0,
      description: description.trim(),
      isVeg,
      emoji,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md animate-scale-in rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-extrabold text-gray-900">
            {initial ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Butter Chicken"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-600">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-600">Price (₹)</label>
              <input
                required
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="349"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short, appetising one-liner"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-600">Emoji</label>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${
                    emoji === e ? 'bg-gold/20 ring-2 ring-gold' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm font-semibold text-gray-600">Vegetarian</span>
            <button
              type="button"
              onClick={() => setIsVeg((v) => !v)}
              className={`relative h-7 w-12 rounded-full transition ${isVeg ? 'bg-green-500' : 'bg-red-500'}`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${isVeg ? 'left-6' : 'left-1'}`}
              />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-3 font-bold text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold py-3 font-bold text-white transition hover:bg-gold-dark disabled:opacity-60"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : null}
              {initial ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
