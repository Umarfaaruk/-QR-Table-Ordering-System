import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  UtensilsCrossed,
  QrCode,
  History,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  IndianRupee,
  Receipt,
  Home,
  Loader2,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useMenuItems } from '../hooks/useMenuItems'
import { useOrders } from '../hooks/useOrders'
import { signOut } from '../firebase/authService'
import { addMenuItem, updateMenuItem, deleteMenuItem } from '../firebase/menuService'
import { CATEGORIES, type MenuItem, type Order, type OrderStatus } from '../types'
import { formatINR, formatTime, summariseItems, timeAgo } from '../utils/format'
import { DEMO_MODE } from '../firebase/config'
import AdminLogin from './AdminLogin'
import MenuItemModal from '../components/MenuItemModal'
import QRGenerator from '../components/QRGenerator'
import VegBadge from '../components/VegBadge'
import AuroraBackground from '../components/AuroraBackground'
import FoodImage from '../components/FoodImage'

type Tab = 'menu' | 'qr' | 'history'

const TABS: { id: Tab; label: string; icon: typeof QrCode }[] = [
  { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
  { id: 'qr', label: 'QR Codes', icon: QrCode },
  { id: 'history', label: 'Order History', icon: History },
]

export default function AdminPanel() {
  const { isAuthed, loading } = useAuth()
  const [tab, setTab] = useState<Tab>('menu')

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center text-gold">
        <AuroraBackground />
        <Loader2 size={32} className="relative animate-spin" />
      </div>
    )
  }

  if (!isAuthed) return <AdminLogin />

  return (
    <div className="relative min-h-screen text-white">
      <AuroraBackground subtle />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 glass-strong">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold text-charcoal shadow-glow-gold">
              <UtensilsCrossed size={20} strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <p className="font-display font-bold">Café Spice</p>
              <p className="text-[11px] text-white/40">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              <Home size={16} /> <span className="hidden sm:inline">Home</span>
            </Link>
            <button
              onClick={async () => {
                await signOut()
                toast.success('Signed out')
              }}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-6xl px-5">
          <nav className="flex gap-1 overflow-x-auto">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition ${
                    active ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white/70'
                  }`}
                >
                  <Icon size={16} /> {t.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {DEMO_MODE && (
        <div className="border-b border-gold/20 bg-gold/5 px-5 py-2 text-center text-xs text-gold/90">
          <span className="mr-1 inline-block h-1.5 w-1.5 animate-glow-pulse rounded-full bg-gold align-middle" />
          Demo mode — changes are stored in-memory for this session only.
        </div>
      )}

      <main className="mx-auto max-w-6xl px-5 py-6">
        {tab === 'menu' && <MenuManagement />}
        {tab === 'qr' && <QRGenerator />}
        {tab === 'history' && <OrderHistory />}
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Tab 1 — Menu Management
// ─────────────────────────────────────────────────────────────
function MenuManagement() {
  const { items, loading, refresh } = useMenuItems()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [saving, setSaving] = useState(false)

  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      cat,
      items: items.filter((i) => i.category === cat),
    })).filter((g) => g.items.length > 0)
  }, [items])

  const openAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (item: MenuItem) => {
    setEditing(item)
    setModalOpen(true)
  }

  const handleSave = async (data: Omit<MenuItem, 'id'>) => {
    setSaving(true)
    try {
      if (editing) {
        await updateMenuItem(editing.id, data)
        toast.success(`${data.name} updated`)
      } else {
        await addMenuItem(data)
        toast.success(`${data.name} added`)
      }
      await refresh()
      setModalOpen(false)
    } catch {
      toast.error('Failed to save item')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item: MenuItem) => {
    try {
      await deleteMenuItem(item.id)
      await refresh()
      toast.success(`${item.name} deleted`)
    } catch {
      toast.error('Failed to delete item')
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Menu Management</h1>
          <p className="text-sm text-white/40">{items.length} items across {grouped.length} categories</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-gradient-gold px-4 py-2.5 font-bold text-charcoal shadow-glow-gold transition hover:brightness-105"
        >
          <Plus size={18} /> Add New Item
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl glass shimmer" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ cat, items: list }) => (
            <div key={cat} className="overflow-hidden rounded-2xl glass">
              <div className="border-b border-white/10 bg-white/5 px-5 py-3">
                <h2 className="font-display font-bold text-white/80">{cat}</h2>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-white/5">
                  {list.map((item) => (
                    <tr key={item.id} className="transition hover:bg-white/[0.03]">
                      <td className="w-16 py-3 pl-5">
                        <FoodImage
                          src={item.image}
                          alt={item.name}
                          emoji={item.emoji}
                          className="h-11 w-11"
                          emojiClassName="text-lg"
                          rounded="rounded-lg"
                        />
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <VegBadge isVeg={item.isVeg} size={14} />
                          <span className="font-bold text-white">{item.name}</span>
                        </div>
                        <p className="text-xs text-white/40">{item.description}</p>
                      </td>
                      <td className="hidden py-3 text-white/50 sm:table-cell">{item.category}</td>
                      <td className="py-3 font-bold text-gradient-gold">{formatINR(item.price)}</td>
                      <td className="py-3 pr-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="rounded-lg p-2 text-white/40 transition hover:bg-gold/10 hover:text-gold"
                            aria-label="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="rounded-lg p-2 text-white/40 transition hover:bg-red-500/10 hover:text-red-400"
                            aria-label="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <MenuItemModal
          initial={editing}
          saving={saving}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Tab 3 — Order History
// ─────────────────────────────────────────────────────────────
type DateFilter = 'today' | 'week' | 'all'

const STATUS_PILL: Record<OrderStatus, string> = {
  pending: 'bg-red-500/15 text-red-300 border border-red-500/25',
  preparing: 'bg-gold/15 text-gold border border-gold/25',
  ready: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  completed: 'bg-green-500/15 text-green-300 border border-green-500/25',
}

function OrderHistory() {
  const { orders, loading } = useOrders()
  const [filter, setFilter] = useState<DateFilter>('today')

  const filtered = useMemo(() => {
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    return orders.filter((o) => {
      if (filter === 'today') return now - o.timestamp < dayMs
      if (filter === 'week') return now - o.timestamp < 7 * dayMs
      return true
    })
  }, [orders, filter])

  const revenue = filtered.reduce((s, o) => s + o.totalAmount, 0)

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Order History</h1>
          <p className="text-sm text-white/40">Track every order placed across all tables</p>
        </div>
        <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
          {(['today', 'week', 'all'] as DateFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition ${
                filter === f ? 'bg-gradient-gold text-charcoal' : 'text-white/50 hover:text-white'
              }`}
            >
              {f === 'week' ? 'This Week' : f === 'all' ? 'All Time' : 'Today'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <SummaryCard
          icon={IndianRupee}
          label={filter === 'today' ? "Today's Revenue" : 'Revenue'}
          value={formatINR(revenue)}
          glow="shadow-glow-gold"
          iconClass="text-gold"
        />
        <SummaryCard
          icon={Receipt}
          label="Orders"
          value={String(filtered.length)}
          glow="shadow-glow-violet"
          iconClass="text-violet-light"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl glass shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 glass py-16 text-center text-white/40">
          No orders for this period yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl glass">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-left text-white/50">
              <tr>
                <th className="px-5 py-3 font-semibold">Order ID</th>
                <th className="px-5 py-3 font-semibold">Table</th>
                <th className="px-5 py-3 font-semibold">Items</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((o) => (
                <OrderRow key={o.id} order={o} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function OrderRow({ order }: { order: Order }) {
  return (
    <tr className="transition hover:bg-white/[0.03]">
      <td className="px-5 py-3 font-bold text-white">{order.orderId}</td>
      <td className="px-5 py-3 text-white/60">{order.tableNumber}</td>
      <td className="max-w-xs truncate px-5 py-3 text-white/50">{summariseItems(order.items)}</td>
      <td className="px-5 py-3 font-bold text-gradient-gold">{formatINR(order.totalAmount)}</td>
      <td className="px-5 py-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${STATUS_PILL[order.status]}`}>
          {order.status}
        </span>
      </td>
      <td className="px-5 py-3 text-white/50">
        <span title={formatTime(order.timestamp)}>{timeAgo(order.timestamp)}</span>
      </td>
    </tr>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  glow,
  iconClass,
}: {
  icon: typeof IndianRupee
  label: string
  value: string
  glow: string
  iconClass: string
}) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl glass p-5 ${glow}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
        <Icon size={24} className={iconClass} />
      </div>
      <div>
        <p className="text-sm font-medium text-white/50">{label}</p>
        <p className="font-display text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  )
}
