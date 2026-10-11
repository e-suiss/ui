"use client"

import { cn } from "cn"
import * as React from "react"

import { Button } from "@/components/ui/button"

type UndoBarOptions = {
  title: React.ReactNode
  actionLabel?: React.ReactNode
  onUndo: () => void
  onCommit?: () => void
}

type UndoBarEntry = UndoBarOptions & { id: number }

type UndoBarContextProps = {
  show: (options: UndoBarOptions) => void
  undo: () => void
  dismiss: () => void
}

const UndoBarContext = React.createContext<UndoBarContextProps | null>(null)

function useUndoBar() {
  const context = React.useContext(UndoBarContext)

  if (!context) {
    throw new Error("useUndoBar must be used within an <UndoBarProvider />")
  }

  return context
}

const RADIUS = 8
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

let nextId = 0

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest("input, textarea, select") !== null)
  )
}

function UndoBarProvider({
  timeout = 5000,
  className,
  children,
}: {
  timeout?: number
  className?: string
  children?: React.ReactNode
}) {
  const [entry, setEntry] = React.useState<UndoBarEntry | null>(null)
  const [visible, setVisible] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  const entryRef = React.useRef<UndoBarEntry | null>(null)
  const ringRef = React.useRef<SVGCircleElement>(null)
  const animationRef = React.useRef<Animation | null>(null)
  const paused = hovered || focused || hidden
  const titleId = React.useId()

  const settle = React.useCallback((undo: boolean) => {
    const current = entryRef.current
    if (!current) return
    entryRef.current = null
    setVisible(false)
    setHovered(false)
    setFocused(false)
    if (undo) current.onUndo()
    else current.onCommit?.()
  }, [])

  const show = React.useCallback((options: UndoBarOptions) => {
    entryRef.current?.onCommit?.()
    nextId += 1
    const next = { ...options, id: nextId }
    entryRef.current = next
    setEntry(next)
    setVisible(true)
  }, [])

  const undo = React.useCallback(() => settle(true), [settle])
  const dismiss = React.useCallback(() => settle(false), [settle])

  React.useLayoutEffect(() => {
    if (!entry || !visible || !ringRef.current) return
    animationRef.current?.cancel()
    const animation = ringRef.current.animate(
      [{ strokeDashoffset: 0 }, { strokeDashoffset: CIRCUMFERENCE }],
      { duration: timeout, fill: "forwards" }
    )
    animation.onfinish = dismiss
    animationRef.current = animation
    return () => {
      animation.onfinish = null
      animation.pause()
    }
  }, [entry, visible, timeout, dismiss])

  React.useEffect(() => {
    const animation = animationRef.current
    if (!animation || !visible || !entry) return
    if (paused) animation.pause()
    else animation.play()
  }, [paused, visible, entry])

  React.useEffect(() => {
    const onVisibilityChange = () => setHidden(document.hidden)
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange)
  }, [])

  React.useEffect(() => {
    if (!visible) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        event.key.toLowerCase() === "z" &&
        !isEditable(event.target)
      ) {
        event.preventDefault()
        undo()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [visible, undo])

  const contextValue = React.useMemo(
    () => ({ show, undo, dismiss }),
    [show, undo, dismiss]
  )

  return (
    <UndoBarContext.Provider value={contextValue}>
      {children}
      <div
        data-slot="undo-bar-region"
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-sm justify-center",
          className
        )}
      >
        {entry && (
          <div
            data-slot="undo-bar"
            role="group"
            aria-labelledby={titleId}
            data-closed={visible ? undefined : ""}
            data-paused={paused ? "" : undefined}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setHovered(true)
            }}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setFocused(false)
            }}
            className="pointer-events-auto flex h-13 w-full items-center gap-3 rounded-full bg-surface-raised/80 ps-4 pe-1 text-label shadow-xl ring-1 ring-separator backdrop-blur-3xl backdrop-saturate-180 transition-[translate,opacity,scale,visibility] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] transition-discrete starting:opacity-0 data-closed:invisible data-closed:opacity-0 data-closed:duration-300 motion-safe:starting:translate-y-[calc(100%+1rem)] motion-safe:starting:scale-95 motion-safe:data-closed:translate-y-[calc(100%+1rem)] motion-safe:data-closed:scale-95 dark:bg-surface-secondary/75"
          >
            <svg
              viewBox="0 0 20 20"
              aria-hidden
              className="size-5 shrink-0 -rotate-90 text-label-secondary rtl:scale-x-[-1]"
            >
              <circle
                cx="10"
                cy="10"
                r={RADIUS}
                fill="none"
                strokeWidth="2"
                className="stroke-separator"
              />
              <circle
                ref={ringRef}
                cx="10"
                cy="10"
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
              />
            </svg>
            <span
              id={titleId}
              data-slot="undo-bar-title"
              className="min-w-0 flex-1 truncate text-sm font-medium"
            >
              {entry.title}
            </span>
            <Button
              variant="plain"
              size="lg"
              data-slot="undo-bar-action"
              onClick={undo}
              className="px-4 font-semibold"
            >
              {entry.actionLabel ?? "Undo"}
            </Button>
          </div>
        )}
      </div>
    </UndoBarContext.Provider>
  )
}

export { UndoBarProvider, useUndoBar }
