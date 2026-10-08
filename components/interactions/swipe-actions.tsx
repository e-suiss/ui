"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"

type SwipeActionsSide = "leading" | "trailing"

type SwipeActionsContextProps = {
  close: () => void
  onContentPointerDown: (event: React.PointerEvent<HTMLElement>) => void
  onContentClickCapture: (event: React.MouseEvent<HTMLElement>) => void
}

const SwipeActionsContext =
  React.createContext<SwipeActionsContextProps | null>(null)

function useSwipeActions() {
  const context = React.useContext(SwipeActionsContext)

  if (!context) {
    throw new Error("useSwipeActions must be used within a <SwipeActions />")
  }

  return context
}

const AXIS_LOCK = 8
const FULL_SWIPE_RATIO = 0.6
const OPEN_EVENT = "swipe-actions:open"

function actionsOf(root: HTMLElement, side: SwipeActionsSide) {
  return root.querySelector<HTMLElement>(
    `[data-slot=swipe-actions-actions][data-side=${side}]`
  )
}

function measureActions(root: HTMLElement, side: SwipeActionsSide) {
  const actions = actionsOf(root, side)
  if (!actions) return 0
  const previous = actions.style.width
  actions.style.width = ""
  const width = actions.scrollWidth
  actions.style.width = previous
  return width
}

function directionOf(root: HTMLElement) {
  return getComputedStyle(root).direction === "rtl" ? -1 : 1
}

function applyOffset(
  root: HTMLElement,
  offset: number,
  animate: boolean,
  full: SwipeActionsSide | null
) {
  root.toggleAttribute("data-animating", animate)
  root.style.setProperty(
    "--swipe-actions-offset",
    `${offset * directionOf(root)}px`
  )
  for (const side of ["leading", "trailing"] as const) {
    const actions = actionsOf(root, side)
    if (!actions) continue
    const revealed = side === "leading" ? offset : -offset
    actions.style.width = revealed > 0 ? `${revealed}px` : "0px"
  }
  if (full) root.dataset.full = full
  else delete root.dataset.full
  if (offset > 0) root.dataset.open = "leading"
  else if (offset < 0) root.dataset.open = "trailing"
  else delete root.dataset.open
}

function SwipeActions({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const offsetRef = React.useRef(0)
  const draggedRef = React.useRef(false)
  const idRef = React.useRef(Symbol("swipe-actions"))

  const apply = (
    offset: number,
    animate: boolean,
    full: SwipeActionsSide | null = null
  ) => {
    const root = rootRef.current
    if (!root) return
    offsetRef.current = offset
    applyOffset(root, offset, animate, full)
  }

  const close = () => apply(0, true)
  const closeRef = React.useRef(close)
  closeRef.current = close

  const actionsFor = (side: SwipeActionsSide) =>
    rootRef.current ? actionsOf(rootRef.current, side) : null

  const naturalWidth = (side: SwipeActionsSide) =>
    rootRef.current ? measureActions(rootRef.current, side) : 0

  const direction = () => (rootRef.current ? directionOf(rootRef.current) : 1)

  const open = (side: SwipeActionsSide, width: number = naturalWidth(side)) => {
    if (!width) return close()
    apply(side === "leading" ? width : -width, true)
    document.dispatchEvent(
      new CustomEvent(OPEN_EVENT, { detail: idRef.current })
    )
  }

  const fullSwipe = (side: SwipeActionsSide) => {
    const root = rootRef.current
    const action =
      actionsFor(side)?.querySelector<HTMLElement>("[data-full-swipe]")
    if (!root || !action) return
    const width = root.offsetWidth
    apply(side === "leading" ? width : -width, true, side)
    const height = root.offsetHeight
    root.style.height = `${height}px`
    root.dataset.removing = ""
    window.setTimeout(() => {
      root.style.height = "0px"
      window.setTimeout(() => {
        action.click()
        window.setTimeout(() => {
          if (!root.isConnected) return
          delete root.dataset.removing
          root.style.height = ""
          apply(0, false)
        }, 50)
      }, 220)
    }, 180)
  }

  const onContentPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    const root = rootRef.current
    if (!root || root.hasAttribute("data-removing")) return
    const target = event.currentTarget
    const start = {
      x: event.clientX,
      y: event.clientY,
      offset: offsetRef.current,
    }
    let axis: "x" | "y" | null = null
    let full: SwipeActionsSide | null = null
    draggedRef.current = false
    root.removeAttribute("data-animating")
    const widths = {
      leading: naturalWidth("leading"),
      trailing: naturalWidth("trailing"),
    }
    const canFull = {
      leading: !!actionsFor("leading")?.querySelector("[data-full-swipe]"),
      trailing: !!actionsFor("trailing")?.querySelector("[data-full-swipe]"),
    }
    const rowWidth = root.offsetWidth

    const move = (moveEvent: PointerEvent) => {
      const dx = (moveEvent.clientX - start.x) * direction()
      const dy = moveEvent.clientY - start.y
      if (!axis) {
        if (Math.abs(dx) > AXIS_LOCK && Math.abs(dx) > Math.abs(dy)) {
          axis = "x"
          draggedRef.current = true
          target.setPointerCapture(moveEvent.pointerId)
        } else if (Math.abs(dy) > AXIS_LOCK) {
          axis = "y"
          return end()
        } else {
          return
        }
      }
      let next = start.offset + dx
      if (next > 0 && !widths.leading) next = 0
      if (next < 0 && !widths.trailing) next = 0
      const side: SwipeActionsSide = next > 0 ? "leading" : "trailing"
      const limit = side === "leading" ? widths.leading : widths.trailing
      const revealed = Math.abs(next)
      if (!canFull[side] && revealed > limit) {
        const extra = revealed - limit
        next = Math.sign(next) * (limit + extra / (1 + extra / 40))
      }
      full =
        canFull[side] && revealed > rowWidth * FULL_SWIPE_RATIO ? side : null
      apply(next, false, full)
    }

    const up = () => {
      end()
      if (axis !== "x") return
      const offset = offsetRef.current
      const side: SwipeActionsSide = offset > 0 ? "leading" : "trailing"
      if (full) return fullSwipe(full)
      const width = widths[side]
      if (width && Math.abs(offset) > width / 2) open(side, width)
      else close()
    }

    const end = () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", up)
    }

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    window.addEventListener("pointercancel", up)
  }

  const onContentClickCapture = (event: React.MouseEvent<HTMLElement>) => {
    if (!draggedRef.current && offsetRef.current === 0) return
    event.preventDefault()
    event.stopPropagation()
    if (!draggedRef.current) close()
    draggedRef.current = false
  }

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const handleOpen = (event: Event) => {
      if ((event as CustomEvent).detail !== idRef.current) closeRef.current()
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (offsetRef.current !== 0 && !root.contains(event.target as Node)) {
        closeRef.current()
      }
    }
    document.addEventListener(OPEN_EVENT, handleOpen)
    document.addEventListener("pointerdown", handlePointerDown)
    return () => {
      document.removeEventListener(OPEN_EVENT, handleOpen)
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [])

  return (
    <SwipeActionsContext.Provider
      value={{ close, onContentPointerDown, onContentClickCapture }}
    >
      <div
        ref={rootRef}
        role="group"
        data-slot="swipe-actions"
        className={cn(
          "group/swipe-actions relative overflow-hidden [--swipe-actions-offset:0px] data-removing:transition-[height] data-removing:duration-200 data-removing:ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:data-removing:transition-none",
          className
        )}
        onKeyDown={(event) => {
          if (event.key === "Escape" && offsetRef.current !== 0) {
            event.stopPropagation()
            close()
          }
        }}
        onFocus={(event) => {
          const actions = (event.target as HTMLElement).closest<HTMLElement>(
            "[data-slot=swipe-actions-actions]"
          )
          const side = actions?.dataset.side as SwipeActionsSide | undefined
          if (side && rootRef.current?.dataset.open !== side) open(side)
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            close()
          }
        }}
        {...props}
      >
        {children}
      </div>
    </SwipeActionsContext.Provider>
  )
}

function SwipeActionsContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { onContentPointerDown, onContentClickCapture } = useSwipeActions()

  return (
    <div
      data-slot="swipe-actions-content"
      className={cn(
        "relative z-10 translate-x-(--swipe-actions-offset) touch-pan-y bg-surface select-none group-data-animating/swipe-actions:transition-transform group-data-animating/swipe-actions:duration-300 group-data-animating/swipe-actions:ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
        className
      )}
      onPointerDown={onContentPointerDown}
      onClickCapture={onContentClickCapture}
      {...props}
    />
  )
}

function SwipeActionsActions({
  side = "trailing",
  className,
  ...props
}: React.ComponentProps<"div"> & { side?: SwipeActionsSide }) {
  return (
    <div
      data-slot="swipe-actions-actions"
      data-side={side}
      className={cn(
        "absolute inset-y-0 flex w-0 overflow-hidden group-data-animating/swipe-actions:transition-[width] group-data-animating/swipe-actions:duration-300 group-data-animating/swipe-actions:ease-[cubic-bezier(0.32,0.72,0,1)] data-[side=leading]:inset-s-0 data-[side=leading]:flex-row-reverse data-[side=trailing]:inset-e-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

const swipeActionVariants = cva(
  "flex min-w-18 flex-1 basis-0 flex-col items-center justify-center gap-1 overflow-hidden px-3 text-center text-xs font-medium wrap-break-word text-on-accent outline-none transition-[flex-grow,opacity] duration-200 focus-visible:-outline-offset-4 focus-visible:focus-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-accent",
        destructive:
          "bg-danger dark:bg-[color-mix(in_oklab,var(--danger),var(--surface)_30%)]",
        archive:
          "bg-[color-mix(in_oklab,var(--purple),var(--label)_15%)] dark:bg-[color-mix(in_oklab,var(--purple),var(--surface)_30%)]",
        neutral:
          "bg-[color-mix(in_oklab,var(--gray),var(--label)_35%)] dark:bg-[color-mix(in_oklab,var(--gray),var(--surface)_40%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function SwipeAction({
  variant,
  fullSwipe = false,
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof swipeActionVariants> & {
    fullSwipe?: boolean
  }) {
  const { close } = useSwipeActions()

  return (
    <button
      type="button"
      data-slot="swipe-action"
      data-full-swipe={fullSwipe ? "" : undefined}
      className={cn(
        swipeActionVariants({ variant }),
        "group-data-full/swipe-actions:not-data-full-swipe:min-w-0 group-data-full/swipe-actions:not-data-full-swipe:grow-0 group-data-full/swipe-actions:not-data-full-swipe:px-0 group-data-full/swipe-actions:not-data-full-swipe:opacity-0 group-data-full/swipe-actions:data-full-swipe:grow-100",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.currentTarget.closest("[data-removing]")) close()
      }}
      {...props}
    />
  )
}

export {
  SwipeAction,
  SwipeActions,
  SwipeActionsActions,
  SwipeActionsContent,
  swipeActionVariants,
  useSwipeActions,
}
