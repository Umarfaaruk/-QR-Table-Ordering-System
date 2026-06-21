interface VegBadgeProps {
  isVeg: boolean
  size?: number
}

/** Standard Indian veg/non-veg indicator: a dot inside a square outline. */
export default function VegBadge({ isVeg, size = 16 }: VegBadgeProps) {
  const color = isVeg ? '#16a34a' : '#dc2626'
  return (
    <span
      className="flex flex-none items-center justify-center rounded-[3px] border"
      style={{ width: size, height: size, borderColor: color }}
      aria-label={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      title={isVeg ? 'Veg' : 'Non-veg'}
    >
      <span
        className="rounded-full"
        style={{ width: size * 0.5, height: size * 0.5, backgroundColor: color }}
      />
    </span>
  )
}
