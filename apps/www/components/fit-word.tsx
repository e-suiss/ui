"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function FitWord({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const box = React.useRef<HTMLDivElement>(null)
  const word = React.useRef<HTMLSpanElement>(null)

  React.useLayoutEffect(() => {
    const container = box.current
    const text = word.current
    if (!container || !text) return
    const fit = () => {
      text.style.fontSize = "100px"
      text.style.fontSize = `${(100 * container.clientWidth) / text.scrollWidth}px`
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(container)
    document.fonts?.ready.then(fit)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={box} className="w-full">
      <span
        ref={word}
        className={cn("block w-max whitespace-nowrap", className)}
      >
        {children}
      </span>
    </div>
  )
}
