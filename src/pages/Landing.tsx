import { Link } from 'react-router-dom'
import { Smartphone, ChefHat, Settings, QrCode, UtensilsCrossed, MonitorSmartphone, ArrowRight } from 'lucide-react'
import { DEMO_MODE } from '../firebase/config'

const STEPS = [
  {
    icon: QrCode,
    title: 'Scan QR at the table',
    desc: 'Every table has a unique QR code. Customers scan it — no app download needed.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Select items & order',
    desc: 'Browse the menu, build a cart and place the order right from their phone.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Kitchen gets it instantly',
    desc: 'Orders appear live on the kitchen screen with the table number. Zero wait.',
  },
]

const DEMO_LINKS = [
  {
    to: '/menu/table-5',
    emoji: '📱',
    label: 'View Customer Menu',
    sub: 'Order as a guest at Table 5',
  },
  {
    to: '/kitchen',
    emoji: '👨‍🍳',
    label: 'Kitchen Display',
    sub: 'Live order board for the chef',
  },
  {
    to: '/admin',
    emoji: '⚙️',
    label: 'Admin Panel',
    sub: 'Manage menu, QR codes & orders',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-charcoal text-white overflow-hidden">
      {/* Ambient gradient glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative">
        {/* Nav */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-charcoal">
              <UtensilsCrossed size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Café Spice
            </span>
          </div>
          {DEMO_MODE && (
            <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
              ● Live Demo Mode
            </span>
          )}
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pb-8 pt-12 text-center md:pt-20">
          <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-gold">
            QR Table Ordering System
          </span>
          <h1 className="mx-auto max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Smart Ordering.{' '}
            <span className="text-gold">Zero Wait.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70 md:text-xl">
            Customers order from their phone. Orders go straight to your kitchen.
            No waiters running back and forth, no missed tickets.
          </p>

          {/* Demo buttons */}
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            {DEMO_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition-all hover:-translate-y-1 hover:border-gold/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-gold/10"
              >
                <span className="text-3xl">{link.emoji}</span>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold">{link.label}</span>
                  <ArrowRight
                    size={18}
                    className="text-gold opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </div>
                <p className="mt-1 text-sm text-white/50">{link.sub}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-center text-white/60">
            From scan to kitchen in three simple steps.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-black text-charcoal">
                    {i + 1}
                  </div>
                  <div className="mb-4 mt-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Secondary CTA strip */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-8 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="text-2xl font-extrabold">Ready to see it in action?</h3>
              <p className="mt-1 text-white/60">
                Try the full experience — scan, order, and watch the kitchen light up.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/menu/table-5"
                className="flex items-center gap-2 rounded-xl bg-gold px-5 py-3 font-bold text-charcoal transition hover:bg-gold-dark"
              >
                <Smartphone size={18} /> Customer Menu
              </Link>
              <Link
                to="/kitchen"
                className="flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-bold text-white transition hover:bg-white/10"
              >
                <ChefHat size={18} /> Kitchen
              </Link>
              <Link
                to="/admin"
                className="flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-bold text-white transition hover:bg-white/10"
              >
                <Settings size={18} /> Admin
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 text-center text-sm text-white/40">
          Built for local restaurants in Hyderabad 🍛 &nbsp;•&nbsp; Café Spice QR Ordering
        </footer>
      </div>
    </div>
  )
}
