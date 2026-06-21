import { Link, useLocation } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'

interface NavbarProps {
  /** Optional right-aligned content (e.g. table pill, actions). */
  right?: React.ReactNode
  /** Visual theme — defaults to the dark charcoal bar. */
  variant?: 'dark' | 'light'
}

/**
 * Shared brand navbar. Individual screens (kitchen, menu, admin) ship
 * their own purpose-built headers, but this is available for any simple
 * page that just needs the Café Spice brand + a back link home.
 */
export default function Navbar({ right, variant = 'dark' }: NavbarProps) {
  const { pathname } = useLocation()
  const dark = variant === 'dark'

  return (
    <header
      className={`sticky top-0 z-30 border-b ${
        dark ? 'border-white/10 bg-charcoal text-white' : 'border-gray-200 bg-white text-gray-900'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-charcoal">
            <UtensilsCrossed size={20} strokeWidth={2.5} />
          </span>
          <span className="font-extrabold tracking-tight">Café Spice</span>
        </Link>
        {right ?? (
          pathname !== '/' && (
            <Link
              to="/"
              className={`text-sm font-semibold ${dark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Home
            </Link>
          )
        )}
      </div>
    </header>
  )
}
