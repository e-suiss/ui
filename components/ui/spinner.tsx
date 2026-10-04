import { cn } from "cn"

const spokes = Array.from({ length: 12 }, (_, index) => ({
  angle: index * 30,
  opacity: Number((0.15 + (0.85 * index) / 11).toFixed(2)),
}))

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(
        "size-4 shrink-0 animate-[spin_1s_steps(12)_infinite]",
        className
      )}
      {...props}
    >
      {spokes.map(({ angle, opacity }) => (
        <rect
          key={angle}
          x="10.8"
          y="1"
          width="2.4"
          height="6.8"
          rx="1.2"
          opacity={opacity}
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </svg>
  )
}

export { Spinner }
