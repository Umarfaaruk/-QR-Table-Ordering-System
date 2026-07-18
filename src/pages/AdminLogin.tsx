import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Lock, Mail, Loader2, ArrowLeft, UtensilsCrossed } from 'lucide-react'
import { signIn, DEMO_CREDENTIALS } from '../firebase/authService'
import { DEMO_MODE } from '../firebase/config'
import AuroraBackground from '../components/AuroraBackground'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Welcome back, Admin 👋')
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email)
    setPassword(DEMO_CREDENTIALS.password)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 text-white">
      <AuroraBackground />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="border-gradient relative overflow-hidden rounded-3xl glass-strong p-8 shadow-glass-lg">
          <div className="absolute -top-16 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />

          {/* Brand */}
          <div className="relative mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold text-charcoal shadow-glow-gold">
              <UtensilsCrossed size={28} strokeWidth={2.5} />
            </div>
            <h1 className="font-display text-2xl font-bold">Café Spice Admin</h1>
            <p className="mt-1 text-sm text-white/50">Sign in to manage your restaurant</p>
          </div>

          <form onSubmit={submit} className="relative space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white/70">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cafespice.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none transition focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white/70">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none transition focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold py-3 font-bold text-charcoal shadow-glow-gold transition hover:brightness-105 disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {DEMO_MODE && (
            <button
              onClick={fillDemo}
              className="relative mt-4 w-full rounded-xl border border-dashed border-gold/40 bg-gold/5 px-4 py-3 text-left text-xs text-gold/90 transition hover:bg-gold/10"
            >
              <span className="font-bold">Demo credentials</span> — tap to autofill
              <br />
              {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
