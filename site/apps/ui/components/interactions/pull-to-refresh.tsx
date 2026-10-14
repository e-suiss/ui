"use client"

import { cn } from "cn"
import * as React from "react"

import { Spinner } from "@/components/ui/spinner"

type PullToRefreshPhase = "idle" | "pulling" | "refreshing" | "settling"

const THRESHOLD = 64
const HOLD = 52
const MAX = 128
const MIN_REFRESH = 600
const SETTLE = 400
const WHEEL_GAP = 250
const WHEEL_IDLE = 200
const SPOKES = 8

const spokes = Array.from({ length: SPOKES }, (_, index) => ({
  angle: index * (360 / SPOKES),
  index,
}))

function resist(distance: number) {
  return MAX * (1 - Math.exp(-distance / (MAX * 1.6)))
}

function wheelDelta(event: WheelEvent) {
  return event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY
}

function PullToRefresh({
  onRefresh,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  onRefresh: () => Promise<unknown> | unknown
}) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const onRefreshRef = React.useRef(onRefresh)
  const [phase, setPhase] = React.useState<PullToRefreshPhase>("idle")

  React.useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let current: PullToRefreshPhase = "idle"
    let pull = 0
    let touchStart: number | null = null
    let wheelPull = 0
    let lastWheel = 0
    let wheelAtTop = false
    let wheelTimer = 0
    let settleTimer = 0

    const enter = (next: PullToRefreshPhase) => {
      current = next
      root.dataset.phase = next
      setPhase(next)
    }

    const setPull = (value: number) => {
      pull = value
      root.style.setProperty("--pull", `${value}px`)
      root.style.setProperty(
        "--pull-progress",
        String(Math.min(value / THRESHOLD, 1))
      )
    }

    const release = async () => {
      if (pull < THRESHOLD) {
        enter("idle")
        setPull(0)
        return
      }
      enter("refreshing")
      setPull(HOLD)
      const started = performance.now()
      await Promise.allSettled([
        new Promise((resolve) => resolve(onRefreshRef.current())),
      ])
      const elapsed = performance.now() - started
      await new Promise((resolve) =>
        setTimeout(resolve, Math.max(0, MIN_REFRESH - elapsed))
      )
      enter("settling")
      setPull(0)
      settleTimer = window.setTimeout(() => enter("idle"), SETTLE)
    }

    const pullTo = (distance: number) => {
      if (current !== "pulling") enter("pulling")
      setPull(resist(Math.max(distance, 0)))
    }

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      touchStart =
        touch &&
        current === "idle" &&
        root.scrollTop <= 0 &&
        event.touches.length === 1
          ? touch.clientY
          : null
    }

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touchStart === null || !touch) return
      const distance = touch.clientY - touchStart
      if (distance <= 0 && current !== "pulling") {
        touchStart = null
        return
      }
      if (event.cancelable) event.preventDefault()
      pullTo(distance)
    }

    const onTouchEnd = () => {
      if (touchStart === null) return
      touchStart = null
      if (current === "pulling") release()
    }

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || (current !== "idle" && current !== "pulling")) return
      const delta = wheelDelta(event)
      const now = performance.now()
      if (now - lastWheel > WHEEL_GAP)
        wheelAtTop = root.scrollTop <= 0 && delta < 0
      lastWheel = now
      if (!wheelAtTop || root.scrollTop > 0) return
      if (delta > 0 && current !== "pulling") return
      event.preventDefault()
      wheelPull = Math.max(0, wheelPull - delta)
      pullTo(wheelPull)
      window.clearTimeout(wheelTimer)
      wheelTimer = window.setTimeout(() => {
        wheelPull = 0
        release()
      }, WHEEL_IDLE)
    }

    root.addEventListener("touchstart", onTouchStart, { passive: true })
    root.addEventListener("touchmove", onTouchMove, { passive: false })
    root.addEventListener("touchend", onTouchEnd)
    root.addEventListener("touchcancel", onTouchEnd)
    root.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      window.clearTimeout(wheelTimer)
      window.clearTimeout(settleTimer)
      root.removeEventListener("touchstart", onTouchStart)
      root.removeEventListener("touchmove", onTouchMove)
      root.removeEventListener("touchend", onTouchEnd)
      root.removeEventListener("touchcancel", onTouchEnd)
      root.removeEventListener("wheel", onWheel)
    }
  }, [])

  const spinning = phase === "refreshing" || phase === "settling"

  return (
    <div
      ref={rootRef}
      data-slot="pull-to-refresh"
      data-phase={phase}
      aria-busy={phase === "refreshing"}
      className={cn(
        "group/pull-to-refresh relative overflow-y-auto overscroll-y-contain [--pull-progress:0] [--pull:0px]",
        className
      )}
      {...props}
    >
      <div
        data-slot="pull-to-refresh-indicator"
        className="pointer-events-none absolute inset-x-0 top-0 flex h-(--pull) items-center justify-center overflow-hidden text-label-secondary transition-[height] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[phase=pulling]/pull-to-refresh:transition-none motion-reduce:transition-none"
      >
        {spinning ? (
          <Spinner
            aria-label="Refreshing"
            className="size-6 transition-[scale,opacity] duration-300 group-data-[phase=settling]/pull-to-refresh:scale-50 group-data-[phase=settling]/pull-to-refresh:opacity-0"
          />
        ) : (
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 shrink-0"
          >
            {spokes.map(({ angle, index }) => (
              <rect
                key={angle}
                x="10.44"
                y="0.5"
                width="3.12"
                height="7.2"
                rx="1.56"
                transform={`rotate(${angle} 12 12)`}
                style={{
                  opacity: `clamp(0, calc(var(--pull-progress) * ${SPOKES} - ${index}), 1)`,
                }}
              />
            ))}
          </svg>
        )}
      </div>
      <div
        data-slot="pull-to-refresh-content"
        className="translate-y-(--pull) transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[phase=pulling]/pull-to-refresh:transition-none motion-reduce:transition-none"
      >
        {children}
      </div>
    </div>
  )
}

export { PullToRefresh }
