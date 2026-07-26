import { useState } from 'react'

interface FoodImageProps {
  src?: string
  alt: string
  /** Shown while loading and if the photo fails to load. */
  emoji: string
  className?: string
  /** Emoji size class for the fallback tile. */
  emojiClassName?: string
  /** Rounding applied to the wrapper. */
  rounded?: string
}

/**
 * Renders a dish photo with a graceful, on-brand fallback.
 *
 * Photos are the star of a food menu, but a broken image during a live
 * client demo is worse than no image at all. So this component:
 *   1. shows a shimmering placeholder while the photo loads,
 *   2. fades the photo in once decoded,
 *   3. falls back to a gradient tile + emoji if the photo 404s, the
 *      device is offline, or no `src` was provided at all.
 *
 * The result: the menu always looks intentional, never broken.
 */
export default function FoodImage({
  src,
  alt,
  emoji,
  className = '',
  emojiClassName = 'text-4xl',
  rounded = 'rounded-xl',
}: FoodImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    src ? 'loading' : 'error',
  )

  const showFallback = status === 'error'

  return (
    <div
      className={`relative overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-transparent ${rounded} ${className}`}
    >
      {/* Shimmer placeholder while the photo is in flight */}
      {status === 'loading' && <div className="absolute inset-0 shimmer" />}

      {/* Fallback: gradient tile + emoji */}
      {showFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/15 via-white/5 to-transparent">
          <span className={`${emojiClassName} drop-shadow-lg`}>{emoji}</span>
        </div>
      )}

      {/* The photo itself */}
      {src && !showFallback && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Subtle inner vignette so white text stays readable over any photo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
    </div>
  )
}
