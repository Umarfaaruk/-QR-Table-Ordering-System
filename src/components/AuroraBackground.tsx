interface AuroraBackgroundProps {
  /** Show the faint grid overlay on top of the aurora. */
  grid?: boolean
  /** Tone down the glow intensity for content-dense screens. */
  subtle?: boolean
}

/**
 * Fixed, animated aurora background — layered gradient blobs drifting behind
 * the whole app for the "futuristic" premium feel. Purely decorative.
 */
export default function AuroraBackground({ grid = true, subtle = false }: AuroraBackgroundProps) {
  const op = subtle ? 'opacity-40' : 'opacity-70'
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className={`absolute inset-0 ${op}`}>
        <div className="absolute -top-32 -left-24 h-[32rem] w-[32rem] animate-aurora-shift rounded-full bg-gold/25 blur-[120px]" />
        <div
          className="absolute top-1/3 -right-24 h-[30rem] w-[30rem] animate-aurora-shift rounded-full bg-violet/25 blur-[120px]"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="absolute -bottom-32 left-1/4 h-[28rem] w-[28rem] animate-aurora-shift rounded-full bg-cyan/15 blur-[120px]"
          style={{ animationDelay: '-12s' }}
        />
      </div>
      {grid && <div className="grid-overlay absolute inset-0 opacity-60" />}
      {/* Vignette so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,10,0.85)_100%)]" />
    </div>
  )
}
