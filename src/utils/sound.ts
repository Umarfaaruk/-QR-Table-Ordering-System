// Generates a short, pleasant two-tone "ding" using the Web Audio API,
// so no audio asset needs to be bundled. Used by the Kitchen Display
// when a new order arrives.

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

function tone(audio: AudioContext, freq: number, start: number, duration: number) {
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  osc.connect(gain)
  gain.connect(audio.destination)

  const t = audio.currentTime + start
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(0.25, t + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)

  osc.start(t)
  osc.stop(t + duration)
}

export function playDing() {
  try {
    const audio = getCtx()
    if (!audio) return
    // Resume if the browser suspended the context (autoplay policies).
    if (audio.state === 'suspended') void audio.resume()
    tone(audio, 880, 0, 0.18) // A5
    tone(audio, 1318.5, 0.12, 0.22) // E6
  } catch {
    // Audio is best-effort — ignore failures silently.
  }
}
