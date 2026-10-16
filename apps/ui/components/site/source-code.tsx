"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const FOLDED = 320
const LINE_HEIGHT = 25
const CHROME = 72

const isLong = (height: number) => height > FOLDED + 40

export function SourceCode({
  children,
  lines,
  onExpand,
}: {
  children: React.ReactNode
  lines?: number
  onExpand?: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [long, setLong] = React.useState(
    lines === undefined || isLong(lines * LINE_HEIGHT + CHROME)
  )
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const content = ref.current
    if (!content) return
    const measure = () => {
      if (content.scrollHeight > 0) setLong(isLong(content.scrollHeight))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    measure()
    return () => observer.disconnect()
  }, [])

  const folded = long && !open

  return (
    <div data-not-prose className="relative mt-[1.2em] [&_figure]:mt-0">
      <div
        ref={ref}
        className={cn(
          long &&
            "overflow-hidden rounded-[20px] transition-[max-height] duration-700 ease-[cubic-bezier(0.32,0.08,0.24,1)]",
          folded
            ? "max-h-80"
            : long &&
                "max-h-[40rem] [&_[data-slot=code-viewport]]:max-h-[32rem] [&_[data-slot=code-viewport]]:overscroll-contain"
        )}
      >
        {children}
      </div>
      {long && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex h-32 items-end justify-center rounded-b-[20px] bg-linear-to-t from-muted via-muted/85 to-transparent pb-5 transition-opacity duration-500",
            !folded && "pointer-events-none opacity-0"
          )}
        >
          <button
            type="button"
            tabIndex={folded ? undefined : -1}
            onClick={() => {
              setOpen(true)
              onExpand?.()
            }}
            className="h-8 cursor-pointer rounded-full bg-foreground px-4 text-[13px] font-medium text-background outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Expand
          </button>
        </div>
      )}
    </div>
  )
}
