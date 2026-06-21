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
      <div className="flex min-h-screen items-center justify-center bg-charcoal text-gold">
        <Loader2 size={32} className="animate-spin" />
      </div>
    )
  }

  if (!isAuthed) return <AdminLogin />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-charcoal">
              <UtensilsCrossed size={20} strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <p className="font-extrabold text-gray-900">Café Spice</p>
              <p className="text-[11px] text-gray-400">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 transition hover:bg-gray-100"
            >
              <Home size={16} /> <span className="hidden sm:inline">Home</span>
            </Link>
            <button
              onClick={async () => {
                await signOut()
                toast.success('Signed out')
              }}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
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
                    active
                      ? 'border-gold text-gold-dark'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
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
        <div className="border-b border-gold/20 bg-gold/5 px-5 py-2 text-center text-xs text-gold-dark">
          🔴 Demo mode — changes are stored in-memory for this session only.
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
          <h1 className="text-xl font-black text-gray-900">Menu Management</h1>
          <p className="text-sm text-gray-400">{items.length} items across {grouped.length} categories</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 font-bold text-white transition hover:bg-gold-dark"
        >
          <Plus size={18} /> Add New Item
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ cat, items: list }) => (
            <div key={cat} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
                <h2 className="font-bold text-gray-700">{cat}</h2>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-50">
                  {list.map((item) => (
                    <tr key={item.id} className="transition hover:bg-gray-50/50">
                      <td className="w-12 py-3 pl-5 text-2xl">{item.emoji}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <VegBadge isVeg={item.isVeg} size={14} />
                          <span className="font-bold text-gray-900">{item.name}</span>
                        </div>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </td>
                      <td className="hidden py-3 text-gray-500 sm:table-cell">{item.category}</td>
                      <td className="py-3 font-bold text-gray-900">{formatINR(item.price)}</td>
                      <td className="py-3 pr-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-gold/10 hover:text-gold-dark"
                            aria-label="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
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
  pending: 'bg-red-100 text-red-700',
  preparing: 'bg-amber-100 text-amber-700',
  ready: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
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
          <h1 className="text-xl font-black text-gray-900">Order History</h1>
          <p className="text-sm text-gray-400">Track every order placed across all tables</p>
        </div>
        {/* Filter */}
        <div className="flex rounded-xl border border-gray-200 bg-white p-1">
          {(['today', 'week', 'all'] as DateFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition ${
                filter === f ? 'bg-gold text-white' : 'text-gray-500 hover:bg-gray-50'
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
          accent="from-gold/20 to-gold/5 text-gold-dark"
        />
        <SummaryCard
          icon={Receipt}
          label="Orders"
          value={String(filtered.length)}
          accent="from-charcoal/10 to-transparent text-charcoal"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-white" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center text-gray-400">
          No orders for this period yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Order ID</th>
                <th className="px-5 py-3 font-semibold">Table</th>
                <th className="px-5 py-3 font-semibold">Items</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
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
    <tr className="transition hover:bg-gray-50/50">
      <td className="px-5 py-3 font-bold text-gray-900">{order.orderId}</td>
      <td className="px-5 py-3 text-gray-600">{order.tableNumber}</td>
      <td className="max-w-xs truncate px-5 py-3 text-gray-500">{summariseItems(order.items)}</td>
      <td className="px-5 py-3 font-bold text-gray-900">{formatINR(order.totalAmount)}</td>
      <td className="px-5 py-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${STATUS_PILL[order.status]}`}>
          {order.status}
        </span>
      </td>
      <td className="px-5 py-3 text-gray-500">
        <span title={formatTime(order.timestamp)}>{timeAgo(order.timestamp)}</span>
      </td>
    </tr>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof IndianRupee
  label: string
  value: string
  accent: string
}) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl border border-gray-100 bg-gradient-to-br p-5 shadow-sm ${accent}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/60">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium opacity-70">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  )
}
