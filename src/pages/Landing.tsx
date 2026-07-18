import { Link } from 'react-router-dom'
import {
  Smartphone,
  ChefHat,
  Settings,
  QrCode,
  UtensilsCrossed,
  MonitorSmartphone,
  ArrowRight,
  Zap,
  Wifi,
  Sparkles,
} from 'lucide-react'
import { DEMO_MODE } from '../firebase/config'
import AuroraBackground from '../components/AuroraBackground'

const STEPS = [
  {
    icon: QrCode,
    title: 'Scan QR at the table',
    desc: 'Every table has a unique QR code. Customers scan it — no app download, no sign-up.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Select items & order',
    desc: 'Browse a rich visual menu, build a cart and place the order right from their phone.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Kitchen gets it instantly',
    desc: 'Orders stream live onto the kitchen screen with the table number. Zero wait, zero errors.',
  },
]

const DEMO_LINKS = [
  {
    to: '/menu/table-5',
    emoji: '📱',
    label: 'Customer Menu',
    sub: 'Order as a guest at Table 5',
    glow: 'group-hover:shadow-glow-gold',
  },
  {
    to: '/kitchen',
    emoji: '👨‍🍳',
    label: 'Kitchen Display',
    sub: 'Live order board for the chef',
    glow: 'group-hover:shadow-glow-violet',
  },
  {
    to: '/admin',
    emoji: '⚙️',
    label: 'Admin Panel',
    sub: 'Menu, QR codes & analytics',
    glow: 'group-hover:shadow-glow-cyan',
  },
]

const STATS = [
  { value: '0s', label: 'Wait to order' },
  { value: '3', label: 'Live interfaces' },
  { value: '100%', label: 'Contactless' },
  { value: '↓ 40%', label: 'Order errors' },
]

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <AuroraBackground />

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-gold text-charcoal shadow-glow-gold">
            <UtensilsCrossed size={22} strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Café Spice</span>
        </div>
        <div className="flex items-center gap-3">
          {DEMO_MODE && (
            <span className="hidden items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold sm:flex">
              <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-gold" /> Live Demo
            </span>
          )}
          <Link
            to="/admin"
            className="rounded-full border border-white/10 px-4 py-1.5 text-sm font-semibold text-white/70 transition hover:border-white/25 hover:text-white"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-10 pt-10 text-center md:pt-20">
        <div className="animate-fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur">
          <Sparkles size={15} className="text-gold" />
          The future of dine-in ordering
        </div>

        <h1
          className="animate-fade-up font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-8xl"
          style={{ animationDelay: '0.05s' }}
        >
          Smart Ordering.
          <br />
          <span className="text-gradient-aurora">Zero Wait.</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-7 max-w-2xl text-lg text-white/60 md:text-xl"
          style={{ animationDelay: '0.12s' }}
        >
          Customers order from their phone. Orders go straight to your kitchen —
          no waiters running back and forth, no missed tickets, no wait.
        </p>

        {/* Primary CTAs */}
        <div
          className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: '0.18s' }}
        >
          <Link
            to="/menu/table-5"
            className="group flex items-center gap-2 rounded-xl bg-gradient-gold px-6 py-3.5 font-bold text-charcoal shadow-glow-gold transition hover:scale-[1.03]"
          >
            <Smartphone size={18} /> Try the live demo
            <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>
          <Link
            to="/kitchen"
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10"
          >
            <ChefHat size={18} /> Watch the kitchen
          </Link>
        </div>

        {/* Demo entry cards */}
        <div
          className="animate-fade-up mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-3"
          style={{ animationDelay: '0.24s' }}
        >
          {DEMO_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`group relative overflow-hidden rounded-2xl glass p-5 text-left transition-all duration-300 hover:-translate-y-1.5 ${link.glow}`}
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/5 blur-2xl transition group-hover:bg-gold/20" />
              <span className="text-3xl">{link.emoji}</span>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold">{link.label}</span>
                <ArrowRight
                  size={18}
                  className="text-gold opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                />
              </div>
              <p className="mt-1 text-sm text-white/45">{link.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl glass sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white/[0.02] px-4 py-6 text-center">
              <p className="font-display text-3xl font-bold text-gradient-gold">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">How it works</span>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
            From scan to kitchen in seconds
          </h2>
        </div>

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="relative rounded-2xl glass p-6 transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-gold text-sm font-black text-charcoal shadow-glow-gold">
                  {i + 1}
                </div>
                <div className="mb-4 mt-3 flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-white/55">{step.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Feature highlight band */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Zap, title: 'Real-time sync', desc: 'Orders appear on the kitchen screen the instant they are placed.' },
            { icon: Wifi, title: 'Works offline-first', desc: 'Runs in a smart demo mode with live simulated orders — no backend needed.' },
            { icon: QrCode, title: 'Print & go', desc: 'Generate and print QR codes for every table in one click.' },
          ].map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="rounded-2xl glass p-5">
                <Icon size={22} className="text-gold" />
                <h4 className="mt-3 font-bold">{f.title}</h4>
                <p className="mt-1 text-sm text-white/50">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="border-gradient relative overflow-hidden rounded-3xl glass-strong p-10 text-center">
          <div className="absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />
          <h3 className="relative font-display text-3xl font-bold md:text-4xl">
            Ready to see it in action?
          </h3>
          <p className="relative mx-auto mt-3 max-w-xl text-white/60">
            Open the kitchen on a laptop and the menu on your phone, then place an order —
            watch it land instantly. That moment sells it.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/menu/table-5"
              className="flex items-center gap-2 rounded-xl bg-gradient-gold px-6 py-3.5 font-bold text-charcoal shadow-glow-gold transition hover:scale-[1.03]"
            >
              <Smartphone size={18} /> Customer Menu
            </Link>
            <Link
              to="/kitchen"
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
            >
              <ChefHat size={18} /> Kitchen
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
            >
              <Settings size={18} /> Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-sm text-white/35">
        Built for local restaurants in Hyderabad 🍛 &nbsp;•&nbsp; Café Spice QR Ordering
      </footer>
    </div>
  )
}
