"use client"

import { cn } from "cn"
import * as React from "react"

const LETTERS = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "#"]
const ROW_HEIGHT = 16
const PAGE = 5

function scrollParent(element: HTMLElement) {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node)
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight
    )
      return node
  }
  return document.scrollingElement as HTMLElement
}

function displayItems(letters: string[], capacity: number) {
  if (capacity >= letters.length)
    return letters.map((letter) => ({ key: letter, label: letter }))
  const slots = Math.max(3, capacity % 2 === 0 ? capacity - 1 : capacity)
  const letterAt = (slot: number) =>
    letters[Math.round((slot / (slots - 1)) * (letters.length - 1))]
  return Array.from({ length: slots }, (_, slot) =>
    slot % 2 === 0
      ? { key: letterAt(slot), label: letterAt(slot) }
      : { key: `after-${letterAt(slot - 1)}`, label: "•" }
  )
}

function SectionIndex({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-index"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function SectionIndexSection({
  value,
  className,
  ...props
}: React.ComponentProps<"section"> & { value: string }) {
  return (
    <section
      data-slot="section-index-section"
      data-value={value}
      className={className}
      {...props}
    />
  )
}

function SectionIndexHeader({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="section-index-header"
      className={cn(
        "sticky top-0 bg-surface/85 px-4 py-1.5 text-sm font-semibold text-label-secondary backdrop-blur-xl",
        className
      )}
      {...props}
    />
  )
}

function SectionIndexBar({
  letters = LETTERS,
  onValueChange,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  letters?: string[]
  onValueChange?: (value: string) => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [current, setCurrent] = React.useState(0)
  const [drag, setDrag] = React.useState<{ index: number; y: number } | null>(
    null
  )
  const [capacity, setCapacity] = React.useState(letters.length)

  React.useEffect(() => {
    const root = ref.current?.closest<HTMLElement>("[data-slot=section-index]")
    if (!root) return
    const observer = new ResizeObserver(() =>
      setCapacity(Math.floor((root.clientHeight - ROW_HEIGHT) / ROW_HEIGHT))
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const jump = (index: number) => {
    setCurrent(index)
    const root = ref.current?.closest("[data-slot=section-index]")
    const sections = Array.from(
      root?.querySelectorAll<HTMLElement>(
        "[data-slot=section-index-section]"
      ) ?? []
    )
    const target =
      sections.find(
        (section) => letters.indexOf(section.dataset.value ?? "") >= index
      ) ?? sections.at(-1)
    if (!target) return
    const parent = scrollParent(target)
    const offset =
      parent === document.scrollingElement
        ? 0
        : parent.getBoundingClientRect().top + parent.clientTop
    parent.scrollTop += target.getBoundingClientRect().top - offset
    const letter = letters[index]
    if (letter !== undefined) onValueChange?.(letter)
  }

  const indexAt = (clientY: number) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return 0
    const fraction = Math.min(
      Math.max((clientY - rect.top) / rect.height, 0),
      0.9999
    )
    return Math.floor(fraction * letters.length)
  }

  const track = (clientY: number) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const index = indexAt(clientY)
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height)
    setDrag({ index, y })
    if (index !== current || drag === null) jump(index)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const last = letters.length - 1
    const steps: Record<string, number> = {
      ArrowDown: current + 1,
      ArrowRight: current + 1,
      ArrowUp: current - 1,
      ArrowLeft: current - 1,
      PageDown: current + PAGE,
      PageUp: current - PAGE,
      Home: 0,
      End: last,
    }
    let next = steps[event.key]
    if (next === undefined && event.key.length === 1) {
      const typed = letters.indexOf(event.key.toUpperCase())
      if (typed !== -1) next = typed
    }
    if (next === undefined) return
    event.preventDefault()
    jump(Math.min(Math.max(next, 0), last))
  }

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      data-slot="section-index-bar"
      data-dragging={drag ? "" : undefined}
      aria-label="Section index"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={letters.length - 1}
      aria-valuenow={current}
      aria-valuetext={letters[current]}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        track(event.clientY)
      }}
      onPointerMove={(event) => {
        if (drag) track(event.clientY)
      }}
      onPointerUp={() => setDrag(null)}
      onPointerCancel={() => setDrag(null)}
      onKeyDown={onKeyDown}
      className={cn(
        "absolute end-3 top-1/2 z-20 flex max-h-[calc(100%-1rem)] -translate-y-1/2 cursor-pointer touch-none flex-col items-center rounded-full px-1.5 text-2xs leading-4 font-semibold text-link outline-none select-none before:absolute before:inset-y-0 before:-inset-s-3 before:inset-e-0 before:content-[''] focus-visible:focus-ring",
        className
      )}
      {...props}
    >
      {displayItems(letters, capacity).map((item) => (
        <span
          key={item.key}
          aria-hidden
          className="flex h-4 min-w-3 items-center justify-center"
        >
          {item.label}
        </span>
      ))}
      {drag && (
        <span
          aria-hidden
          data-slot="section-index-bubble"
          style={{ top: drag.y }}
          className="pointer-events-none absolute end-full me-4 flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-surface-raised text-3xl font-semibold text-label shadow-xl ring-1 ring-separator transition-[scale,opacity] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] starting:scale-50 starting:opacity-0"
        >
          {letters[drag.index]}
        </span>
      )}
    </div>
  )
}

export {
  SectionIndex,
  SectionIndexBar,
  SectionIndexHeader,
  SectionIndexSection,
}
