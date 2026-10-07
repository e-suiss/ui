"use client"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { XIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"

type TipContextProps = {
  id: string
  titleId: string
  descriptionId: string
  visible: boolean
  dismiss: () => void
  anchorRef: React.RefObject<HTMLSpanElement | null>
}

const TipContext = React.createContext<TipContextProps | null>(null)

type TipGroupContextProps = {
  current: string | null
  register: (id: string) => () => void
  complete: (id: string) => void
}

const TipGroupContext = React.createContext<TipGroupContextProps | null>(null)

function useTip() {
  const context = React.useContext(TipContext)

  if (!context) {
    throw new Error("useTip must be used within a <Tip />")
  }

  return context
}

const STORAGE_PREFIX = "tip:"

function isDismissed(id: string) {
  try {
    return localStorage.getItem(STORAGE_PREFIX + id) === "dismissed"
  } catch {
    return false
  }
}

function remember(id: string) {
  try {
    localStorage.setItem(STORAGE_PREFIX + id, "dismissed")
    return true
  } catch {
    return false
  }
}

function resetTips(ids: string[]) {
  try {
    for (const id of ids) localStorage.removeItem(STORAGE_PREFIX + id)
    return true
  } catch {
    return false
  }
}

function TipGroup({ children }: { children?: React.ReactNode }) {
  const [order, setOrder] = React.useState<string[]>([])
  const [completed, setCompleted] = React.useState<string[]>([])
  const current =
    order.find((id) => !completed.includes(id) && !isDismissed(id)) ?? null

  const register = React.useCallback((id: string) => {
    setOrder((ids) => (ids.includes(id) ? ids : [...ids, id]))
    return () => setOrder((ids) => ids.filter((entry) => entry !== id))
  }, [])

  const complete = React.useCallback((id: string) => {
    setCompleted((ids) => [...ids, id])
  }, [])

  const contextValue = React.useMemo(
    () => ({ current, register, complete }),
    [current, register, complete]
  )

  return (
    <TipGroupContext.Provider value={contextValue}>
      {children}
    </TipGroupContext.Provider>
  )
}

function Tip({
  id,
  delay = 0,
  onDismiss,
  children,
}: {
  id: string
  delay?: number
  onDismiss?: () => void
  children?: React.ReactNode
}) {
  const group = React.useContext(TipGroupContext)
  const [ready, setReady] = React.useState(false)
  const [dismissed, setDismissed] = React.useState(false)
  const anchorRef = React.useRef<HTMLSpanElement>(null)
  const titleId = React.useId()
  const descriptionId = React.useId()
  const register = group?.register
  const complete = group?.complete
  const turn = !group || group.current === id
  const visible = ready && turn && !dismissed

  React.useEffect(() => register?.(id), [register, id])

  React.useEffect(() => {
    if (isDismissed(id) || !turn) return
    const timer = window.setTimeout(() => setReady(true), delay)
    return () => window.clearTimeout(timer)
  }, [id, delay, turn])

  const dismiss = React.useCallback(() => {
    setDismissed(true)
    remember(id)
    complete?.(id)
    onDismiss?.()
  }, [id, complete, onDismiss])

  const contextValue = React.useMemo(
    () => ({ id, titleId, descriptionId, visible, dismiss, anchorRef }),
    [id, titleId, descriptionId, visible, dismiss]
  )

  return (
    <TipContext.Provider value={contextValue}>{children}</TipContext.Provider>
  )
}

function TipCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { visible } = useTip()
  const [mounted, setMounted] = React.useState(visible)

  React.useEffect(() => {
    if (visible) setMounted(true)
    else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMounted(false)
    }
  }, [visible])

  if (!mounted) return null

  return (
    <div
      data-slot="tip-card-frame"
      data-closed={visible ? undefined : ""}
      inert={!visible}
      onTransitionEnd={(event) => {
        if (!visible && event.target === event.currentTarget) setMounted(false)
      }}
      className="grid grid-rows-[1fr] transition-[grid-template-rows,opacity,translate] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] starting:grid-rows-[0fr] starting:opacity-0 data-closed:grid-rows-[0fr] data-closed:opacity-0 data-closed:duration-300 motion-safe:starting:-translate-y-2 motion-reduce:transition-none"
    >
      <div className="min-h-0 overflow-hidden">
        <div
          role="note"
          data-slot="tip-card"
          className={cn(
            "relative flex items-start gap-3 rounded-2xl bg-surface-secondary p-4 pe-12",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function TipAnchor({ className, ...props }: React.ComponentProps<"span">) {
  const { anchorRef, visible, dismiss } = useTip()

  return (
    <span
      ref={anchorRef}
      data-slot="tip-anchor"
      onClickCapture={() => {
        if (visible) dismiss()
      }}
      className={cn("inline-flex", className)}
      {...props}
    />
  )
}

function TipPopover({
  className,
  children,
  side = "bottom",
  align = "center",
  sideOffset = 10,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, "side" | "align" | "sideOffset">) {
  const { visible, dismiss, anchorRef, titleId, descriptionId } = useTip()

  return (
    <PopoverPrimitive.Root
      open={visible}
      modal={false}
      onOpenChange={(open) => {
        if (!open) dismiss()
      }}
    >
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          anchor={anchorRef}
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={16}
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="tip-popover"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initialFocus={false}
            finalFocus={false}
            className={cn(
              "relative flex w-[min(20rem,calc(100vw-2rem))] origin-(--transform-origin) items-start gap-3 rounded-2xl bg-surface-raised p-4 pe-12 text-label [filter:drop-shadow(0_0_0.5px_var(--color-separator-strong))_drop-shadow(0_12px_24px_color-mix(in_oklab,var(--color-label)_14%,transparent))] outline-none transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 motion-reduce:transition-none",
              className
            )}
            {...props}
          >
            <PopoverPrimitive.Arrow className="size-4 data-[side=bottom]:-top-2 data-[side=left]:-right-2 data-[side=right]:-left-2 data-[side=top]:-bottom-2">
              <span className="block size-3 translate-x-0.5 translate-y-0.5 rotate-45 rounded-xs bg-surface-raised" />
            </PopoverPrimitive.Arrow>
            {children}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

function TipIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="tip-icon"
      className={cn(
        "flex shrink-0 text-accent [&_svg:not([class*='size-'])]:size-8",
        className
      )}
      {...props}
    />
  )
}

function TipContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tip-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function TipTitle({ className, ...props }: React.ComponentProps<"p">) {
  const { titleId } = useTip()

  return (
    <p
      id={titleId}
      data-slot="tip-title"
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  )
}

function TipDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { descriptionId } = useTip()

  return (
    <p
      id={descriptionId}
      data-slot="tip-description"
      className={cn("text-sm text-label-secondary", className)}
      {...props}
    />
  )
}

function TipClose({
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "children">) {
  const { dismiss } = useTip()

  return (
    <button
      type="button"
      data-slot="tip-close"
      aria-label="Dismiss tip"
      onClick={dismiss}
      className={cn(
        "absolute inset-e-2 top-2 flex size-8 items-center justify-center rounded-full text-label-secondary outline-none after:absolute after:-inset-1.5 after:content-[''] hover:bg-item-hover hover:text-label focus-visible:focus-ring",
        className
      )}
      {...props}
    >
      <XIcon weight="bold" className="size-4" />
    </button>
  )
}

export {
  resetTips,
  Tip,
  TipAnchor,
  TipCard,
  TipClose,
  TipContent,
  TipDescription,
  TipGroup,
  TipIcon,
  TipPopover,
  TipTitle,
  useTip,
}
