/** Format a number as Indian Rupees, e.g. 627 → "₹627". */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

/** Human-friendly relative time, e.g. "just now", "2 mins ago". */
export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 10) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

/** Format a timestamp as a clock time, e.g. "2:45 PM". */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/** Collapse order items into a readable summary, e.g. "2x Butter Chicken, 1x Lassi". */
export function summariseItems(items: { name: string; quantity: number }[]): string {
  return items.map((it) => `${it.quantity}x ${it.name}`).join(', ')
}
