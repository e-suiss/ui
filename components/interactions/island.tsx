"use client"

import { cn } from "cn"
import * as React from "react"

type IslandView = "hidden" | "compact" | "expanded" | "notice"

type IslandNotice = {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  duration?: number
}

type IslandContextProps = {
  view: IslandView
  notice: IslandNotice | null
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  notify: (notice: IslandNotice) => void
  dismiss: () => void
  registerCompact: () => () => void
}

const IslandContext = React.createContext<IslandContextProps | null>(null)

function useIsland() {
  const context = React.useContext(IslandContext)

  if (!context) {
    throw new Error("useIsland must be used within an <Island />")
  }

  return context
}

const NOTICE_DURATION = 4000
const HIDDEN_SIZE = { width: 126, height: 36 }
const PART =
  "shrink-0 transition-[opacity,scale,filter] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-active:delay-100 data-active:duration-450 not-data-active:pointer-events-none not-data-active:invisible not-data-active:absolute not-data-active:top-0 not-data-active:left-1/2 not-data-active:-translate-x-1/2 not-data-active:scale-90 not-data-active:opacity-0 not-data-active:blur-sm not-data-active:duration-150 motion-reduce:transition-none"

function islandView(
  notice: IslandNotice | null,
  expanded: boolean,
  compactCount: number
): IslandView {
  if (notice) return "notice"
  if (compactCount <= 0) return "hidden"
  return expanded ? "expanded" : "compact"
}

function IslandProvider({ children }: { children?: React.ReactNode }) {
  const [expanded, setExpanded] = React.useState(false)
  const [notice, setNotice] = React.useState<IslandNotice | null>(null)
  const [compactCount, setCompactCount] = React.useState(0)
  const timerRef = React.useRef(0)

  const view = islandView(notice, expanded, compactCount)

  const dismiss = React.useCallback(() => {
    window.clearTimeout(timerRef.current)
    setNotice(null)
  }, [])

  const notify = React.useCallback(
    (next: IslandNotice) => {
      window.clearTimeout(timerRef.current)
      setNotice(next)
      timerRef.current = window.setTimeout(
        dismiss,
        next.duration ?? NOTICE_DURATION
      )
    },
    [dismiss]
  )

  const registerCompact = React.useCallback(() => {
    setCompactCount((count) => count + 1)
    return () => {
      setCompactCount((count) => count - 1)
      setExpanded(false)
    }
  }, [])

  React.useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const contextValue = React.useMemo(
    () => ({
      view,
      notice,
      expanded,
      setExpanded,
      notify,
      dismiss,
      registerCompact,
    }),
    [view, notice, expanded, notify, dismiss, registerCompact]
  )

  return (
    <IslandContext.Provider value={contextValue}>
      {children}
    </IslandContext.Provider>
  )
}

function Island({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { view, notice, setExpanded, dismiss } = useIsland()
  const [size, setSize] = React.useState<{ width: number; height: number }>()
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const measure = () => {
      const active = root.querySelector<HTMLElement>(
        `:scope > [data-island-part=${view}]`
      )
      setSize(
        active
          ? { width: active.offsetWidth, height: active.offsetHeight }
          : HIDDEN_SIZE
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    for (const part of root.querySelectorAll(":scope > [data-island-part]"))
      observer.observe(part)
    return () => observer.disconnect()
  }, [view])

  React.useEffect(() => {
    if (view !== "expanded") return
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setExpanded(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      const root = ref.current
      const inside = root?.contains(document.activeElement)
      setExpanded(false)
      if (inside)
        requestAnimationFrame(() =>
          root
            ?.querySelector<HTMLElement>("[data-island-part=compact]")
            ?.focus()
        )
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [view, setExpanded])

  return (
    <>
      <div
        ref={ref}
        data-slot="island"
        data-view={view}
        style={size}
        className={cn(
          "fixed inset-x-0 top-[max(--spacing(3),env(safe-area-inset-top))] z-50 mx-auto flex items-start justify-center overflow-hidden rounded-[1.125rem] bg-label text-start text-surface shadow-xl [--island-spring:linear(0,0.032,0.112,0.219,0.338,0.459,0.573,0.676,0.766,0.84,0.9,0.947,0.982,1.007,1.023,1.033,1.037,1.038,1.037,1.033,1.029,1.024,1.02,1.015,1.012,1.008,1.006,1.003,1.002,1,1,0.999,1)] transition-[width,height,border-radius,opacity,scale,visibility] duration-650 ease-(--island-spring) transition-discrete data-[view=expanded]:rounded-[1.75rem] data-[view=hidden]:invisible data-[view=hidden]:scale-75 data-[view=hidden]:opacity-0 data-[view=hidden]:duration-400 data-[view=hidden]:ease-[cubic-bezier(0.32,0.72,0,1)] data-[view=notice]:rounded-[1.75rem] motion-reduce:transition-none dark:bg-surface dark:text-label dark:ring-1 dark:ring-separator",
          className
        )}
        {...props}
      >
        {children}
        <button
          type="button"
          data-island-part="notice"
          data-slot="island-notice"
          data-active={view === "notice" ? "" : undefined}
          tabIndex={view === "notice" ? 0 : -1}
          aria-hidden={view !== "notice"}
          onClick={dismiss}
          className={cn(
            PART,
            "flex w-[min(calc(100vw-(--spacing(6))),24rem)] items-center gap-3 p-3.5 text-start outline-none focus-visible:focus-ring rounded-[inherit] in-data-[slot=island]:focus-visible:outline-offset-[-3px] [&_svg:not([class*='size-'])]:size-6"
          )}
        >
          {notice?.icon && (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface/15 dark:bg-label/15">
              {notice.icon}
            </span>
          )}
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold">
              {notice?.title}
            </span>
            {notice?.description && (
              <span className="truncate text-sm text-surface/70 dark:text-label-secondary">
                {notice.description}
              </span>
            )}
          </span>
        </button>
      </div>
      <div aria-live="polite" className="sr-only">
        {notice && (
          <>
            {notice.title} {notice.description}
          </>
        )}
      </div>
    </>
  )
}

function IslandCompact({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { view, setExpanded, registerCompact } = useIsland()

  React.useEffect(() => registerCompact(), [registerCompact])

  return (
    <button
      type="button"
      data-island-part="compact"
      data-slot="island-compact"
      data-active={view === "compact" ? "" : undefined}
      aria-expanded={view === "expanded"}
      tabIndex={view === "compact" ? 0 : -1}
      onClick={(event) => {
        const root = event.currentTarget.parentElement
        setExpanded(true)
        requestAnimationFrame(() =>
          root
            ?.querySelector<HTMLElement>(
              "[data-island-part=expanded] :is(button, [href], input):not(:disabled)"
            )
            ?.focus()
        )
      }}
      className={cn(
        PART,
        "flex h-9 min-w-36 items-center justify-between gap-6 px-2.5 outline-none focus-visible:focus-ring rounded-[inherit] in-data-[slot=island]:focus-visible:outline-offset-[-3px] [&_svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function IslandExpanded({ className, ...props }: React.ComponentProps<"div">) {
  const { view } = useIsland()

  return (
    <div
      role="group"
      data-island-part="expanded"
      data-slot="island-expanded"
      data-active={view === "expanded" ? "" : undefined}
      inert={view !== "expanded"}
      className={cn(
        PART,
        "flex w-[min(calc(100vw-(--spacing(6))),24rem)] flex-col gap-3 p-4",
        className
      )}
      {...props}
    />
  )
}

function IslandRing({
  value,
  className,
  ...props
}: React.ComponentProps<"svg"> & { value: number }) {
  const radius = 8
  const circumference = 2 * Math.PI * radius

  return (
    <svg
      data-slot="island-ring"
      viewBox="0 0 20 20"
      aria-hidden
      className={cn("size-5 -rotate-90 text-accent", className)}
      {...props}
    >
      <circle
        cx="10"
        cy="10"
        r={radius}
        fill="none"
        strokeWidth="2.5"
        className="stroke-current opacity-25"
      />
      <circle
        cx="10"
        cy="10"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - Math.min(Math.max(value, 0), 1))}
        className="transition-[stroke-dashoffset] duration-300"
      />
    </svg>
  )
}

export {
  Island,
  IslandCompact,
  IslandExpanded,
  IslandProvider,
  IslandRing,
  useIsland,
}
