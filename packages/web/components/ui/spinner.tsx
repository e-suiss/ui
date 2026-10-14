import { cn } from "cn"

const spokes = Array.from({ length: 8 }, (_, index) => ({
  angle: index * 45,
  opacity: Number((0.2 + (0.8 * index) / 7).toFixed(2)),
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
        "size-4 shrink-0 animate-[spin_0.8s_steps(8)_infinite]",
        className
      )}
      {...props}
    >
      {spokes.map(({ angle, opacity }) => (
        <rect
          key={angle}
          x="10.44"
          y="0.5"
          width="3.12"
          height="7.2"
          rx="1.56"
          opacity={opacity}
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </svg>
  )
}

export { Spinner }
