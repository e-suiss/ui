"use client"

import { DropdownMenu as DropdownMenuPrimitive, Portal } from "radix-ui"
import * as React from "react"
import { cn } from "@/lib/utils"

type PreviewMenuFrame = {
  top: number
  left: number
  width: number
  height: number
  from: string
  clip: string
  source: { width: number; height: number; scale: number }
}

type PreviewMenuContextProps = {
  open: boolean
  setOpen: (open: boolean) => void
  lifted: boolean
  setLifted: (lifted: boolean) => void
  frame: PreviewMenuFrame | null
  triggerRef: React.RefObject<HTMLElement | null>
  contentRef: React.RefObject<React.ReactNode>
}

const PreviewMenuContext = React.createContext<PreviewMenuContextProps | null>(
  null
)

function usePreviewMenu() {
  const context = React.useContext(PreviewMenuContext)

  if (!context) {
    throw new Error("usePreviewMenu must be used within a <PreviewMenu />")
  }

  return context
}

const EDGE = 16
const LONG_PRESS_DELAY = 500
const LONG_PRESS_TOLERANCE = 10
const MENU_SPACE = 260
const MAX_WIDTH = 360

function cornerRadius(trigger: HTMLElement) {
  for (const element of [trigger, trigger.firstElementChild]) {
    if (!element) continue
    const radius = Number.parseFloat(
      getComputedStyle(element).borderTopLeftRadius
    )
    if (radius > 0) return radius
  }
  return 0
}

function measureFrame(
  trigger: HTMLElement,
  aspectRatio: number | undefined
): PreviewMenuFrame {
  const rect = trigger.getBoundingClientRect()
  const viewportWidth = document.documentElement.clientWidth
  const viewportHeight = window.innerHeight
  const ratio = aspectRatio
    ? 1 / aspectRatio
    : rect.height / Math.max(rect.width, 1)
  let width = Math.min(viewportWidth - EDGE * 2, MAX_WIDTH)
  let height = width * ratio
  const maxHeight = viewportHeight - MENU_SPACE - EDGE * 2
  if (height > maxHeight) {
    height = Math.max(maxHeight, rect.height)
    width = height / Math.max(ratio, 0.01)
  }
  const left = (viewportWidth - width) / 2
  const centered = rect.top + rect.height / 2 - height / 2
  const top = Math.min(
    Math.max(centered, EDGE),
    Math.max(EDGE, viewportHeight - MENU_SPACE - height)
  )
  const scale = Math.max(rect.width / width, rect.height / height)
  const dx = rect.left + rect.width / 2 - (left + (width * scale) / 2)
  const dy = rect.top + rect.height / 2 - (top + (height * scale) / 2)
  const insetX = (width - rect.width / scale) / 2
  const insetY = (height - rect.height / scale) / 2
  const radius = cornerRadius(trigger) / scale
  return {
    top,
    left,
    width,
    height,
    from: `translate(${dx}px, ${dy}px) scale(${scale})`,
    clip: `inset(${insetY}px ${insetX}px round ${radius}px)`,
    source: { width: rect.width, height: rect.height, scale: 1 / scale },
  }
}

function PreviewMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  aspectRatio,
  children,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  aspectRatio?: number
  children?: React.ReactNode
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const [frame, setFrame] = React.useState<PreviewMenuFrame | null>(null)
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const contentRef = React.useRef<React.ReactNode>(null)

  const [lifted, setLifted] = React.useState(open)

  const setOpen = (next: boolean) => {
    if (next) setLifted(true)
    if (next && triggerRef.current)
      setFrame(measureFrame(triggerRef.current, aspectRatio))
    if (openProp === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  React.useLayoutEffect(() => {
    if (open && !frame && triggerRef.current) {
      setFrame(measureFrame(triggerRef.current, aspectRatio))
    }
  }, [open, frame, aspectRatio])

  return (
    <PreviewMenuContext.Provider
      value={{
        open,
        setOpen,
        lifted,
        setLifted,
        frame,
        triggerRef,
        contentRef,
      }}
    >
      <DropdownMenuPrimitive.Root
        open={open}
        onOpenChange={(next) => setOpen(next)}
      >
        {children}
      </DropdownMenuPrimitive.Root>
    </PreviewMenuContext.Provider>
  )
}

function PreviewMenuTrigger({
  className,
  children,
  onContextMenu,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  ref,
  ...props
}: React.ComponentProps<"div">) {
  const { open, setOpen, lifted, triggerRef, contentRef } = usePreviewMenu()
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const startRef = React.useRef<{ x: number; y: number } | null>(null)
  contentRef.current = children as React.ReactNode

  React.useEffect(() => () => clearTimeout(timerRef.current), [])

  const cancel = () => {
    clearTimeout(timerRef.current)
    startRef.current = null
  }

  return (
    <div
      ref={(node) => {
        triggerRef.current = node
        if (typeof ref === "function") return ref(node)
        if (ref) ref.current = node
      }}
      data-slot="preview-menu-trigger"
      className={cn(
        "touch-manipulation select-none [-webkit-touch-callout:none] data-lifted:invisible",
        className
      )}
      data-previewing={open ? "" : undefined}
      data-lifted={open || lifted ? "" : undefined}
      onContextMenu={(event) => {
        event.preventDefault()
        cancel()
        setOpen(true)
        onContextMenu?.(event)
      }}
      onKeyDown={(event) => {
        if (
          event.key === "ContextMenu" ||
          (event.shiftKey && event.key === "F10")
        ) {
          event.preventDefault()
          setOpen(true)
        }
        onKeyDown?.(event)
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse") {
          startRef.current = { x: event.clientX, y: event.clientY }
          clearTimeout(timerRef.current)
          timerRef.current = setTimeout(() => {
            startRef.current = null
            setOpen(true)
          }, LONG_PRESS_DELAY)
        }
        onPointerDown?.(event)
      }}
      onPointerMove={(event) => {
        const start = startRef.current
        if (
          start &&
          Math.hypot(event.clientX - start.x, event.clientY - start.y) >
            LONG_PRESS_TOLERANCE
        )
          cancel()
        onPointerMove?.(event)
      }}
      onPointerUp={(event) => {
        cancel()
        onPointerUp?.(event)
      }}
      onPointerCancel={(event) => {
        cancel()
        onPointerCancel?.(event)
      }}
      onPointerLeave={(event) => {
        cancel()
        onPointerLeave?.(event)
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function Unmounted({ onUnmount }: { onUnmount: () => void }) {
  const callback = React.useRef(onUnmount)
  callback.current = onUnmount
  React.useEffect(() => () => callback.current(), [])
  return null
}

function PreviewMenuContent({
  preview,
  previewClassName,
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  preview?: React.ReactNode
  previewClassName?: string
}) {
  const { open, lifted, setLifted, frame, contentRef, triggerRef } =
    usePreviewMenu()
  const previewRef = React.useRef<HTMLDivElement>(null)
  const custom = preview !== undefined

  const attachSnapshot = React.useCallback(
    (holder: HTMLDivElement | null) => {
      const trigger = triggerRef.current
      if (!holder || !trigger) return
      const snapshot = trigger.cloneNode(true) as HTMLElement
      for (const name of [
        "data-lifted",
        "data-previewing",
        "data-state",
        "data-slot",
        "id",
      ])
        snapshot.removeAttribute(name)
      snapshot.style.margin = "0"
      snapshot.style.width = "100%"
      snapshot.style.height = "100%"
      holder.replaceChildren(snapshot)
    },
    [triggerRef]
  )

  return (
    <>
      {(open || lifted) && (
        <Portal.Root>
          <div
            data-slot="preview-menu-backdrop"
            data-closed={open ? undefined : ""}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xl transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] starting:opacity-0 data-closed:opacity-0 motion-reduce:transition-none"
          />
        </Portal.Root>
      )}
      {(open || lifted) && frame && (
        <Portal.Root>
          <DropdownMenuPrimitive.Trigger asChild>
            <div
              ref={previewRef}
              data-slot="preview-menu-preview"
              data-closed={open ? undefined : ""}
              aria-hidden
              style={
                {
                  top: frame.top,
                  left: frame.left,
                  width: frame.width,
                  height: frame.height,
                  "--preview-menu-from": frame.from,
                  "--preview-menu-clip": frame.clip,
                } as React.CSSProperties
              }
              className="pointer-events-none fixed z-50 origin-top-left drop-shadow-2xl transition-[transform,filter] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] starting:transform-(--preview-menu-from) starting:drop-shadow-none data-closed:transform-(--preview-menu-from) data-closed:drop-shadow-none data-closed:duration-300 motion-reduce:transition-none"
            >
              <div
                className={cn(
                  "relative size-full overflow-hidden transition-[clip-path] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] [clip-path:inset(0_round_var(--radius-2xl))] starting:[clip-path:var(--preview-menu-clip)] in-data-closed:duration-300 in-data-closed:[clip-path:var(--preview-menu-clip)] motion-reduce:transition-none *:size-full",
                  previewClassName
                )}
              >
                {preview ?? contentRef.current}
              </div>
              {custom && (
                <div
                  ref={attachSnapshot}
                  inert
                  style={{
                    width: frame.source.width,
                    height: frame.source.height,
                    transform: `translate(-50%, -50%) scale(${frame.source.scale})`,
                  }}
                  className="absolute top-1/2 left-1/2 opacity-0 transition-opacity duration-150 ease-out starting:opacity-100 in-data-closed:opacity-100 in-data-closed:delay-100 in-data-closed:duration-200 motion-reduce:transition-none"
                />
              )}
            </div>
          </DropdownMenuPrimitive.Trigger>
        </Portal.Root>
      )}
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          data-slot="preview-menu-content"
          side="bottom"
          align="center"
          sideOffset={12}
          collisionPadding={EDGE}
          onCloseAutoFocus={(event) => event.preventDefault()}
          className={cn(
            "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-60 origin-(--radix-dropdown-menu-content-transform-origin) overflow-y-auto rounded-2xl bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-90 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-90 motion-reduce:animate-none dark:ring-foreground/10",
            className
          )}
          {...props}
        >
          {children}
          <Unmounted onUnmount={() => setLifted(false)} />
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </>
  )
}

function PreviewMenuItem({
  className,
  variant = "default",
  disabled,
  onClick,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="preview-menu-item"
      data-variant={variant}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "flex min-h-11 cursor-default items-center justify-between gap-6 px-4 py-2.75 text-base outline-none select-none not-first:border-t not-first:border-border data-disabled:pointer-events-none data-highlighted:bg-accent data-[variant=destructive]:text-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 data-highlighted:text-accent-foreground data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function PreviewMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="preview-menu-separator"
      className={cn("h-2 bg-border/40", className)}
      {...props}
    />
  )
}

export {
  PreviewMenu,
  PreviewMenuContent,
  PreviewMenuItem,
  PreviewMenuSeparator,
  PreviewMenuTrigger,
  usePreviewMenu,
}
