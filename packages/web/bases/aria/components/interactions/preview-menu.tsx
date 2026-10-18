"use client"

import * as React from "react"
import {
  MenuItem as MenuItemPrimitive,
  type MenuItemProps as MenuItemPrimitiveProps,
  Menu as MenuPrimitive,
  type MenuProps as MenuPrimitiveProps,
  MenuTrigger as MenuTriggerPrimitive,
  Popover as PopoverPrimitive,
  Pressable,
  Separator as SeparatorPrimitive,
} from "react-aria-components"
import { createPortal } from "react-dom"
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

function createContentStore() {
  let content: React.ReactNode = null
  const listeners = new Set<() => void>()
  return {
    get: () => content,
    set: (next: React.ReactNode) => {
      content = next
      for (const listener of listeners) listener()
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

type PreviewMenuContextProps = {
  open: boolean
  lifted: boolean
  frame: PreviewMenuFrame | null
  triggerRef: React.RefObject<HTMLElement | null>
  content: ReturnType<typeof createContentStore>
  setLifted: (lifted: boolean) => void
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
  const [content] = React.useState(createContentStore)

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
      value={{ open, lifted, frame, triggerRef, content, setLifted }}
    >
      <MenuTriggerPrimitive
        trigger="contextMenu"
        isOpen={open}
        onOpenChange={(next) => setOpen(next)}
      >
        {children}
      </MenuTriggerPrimitive>
    </PreviewMenuContext.Provider>
  )
}

function PreviewMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, lifted, triggerRef, content } = usePreviewMenu()

  React.useLayoutEffect(
    () => content.set(children as React.ReactNode),
    [content, children]
  )

  return (
    <Pressable>
      <div
        ref={triggerRef as React.Ref<HTMLDivElement>}
        role="button"
        tabIndex={0}
        data-slot="preview-menu-trigger"
        className={cn(
          "touch-manipulation select-none [-webkit-touch-callout:none] data-lifted:invisible",
          className
        )}
        data-previewing={open ? "" : undefined}
        data-lifted={open || lifted ? "" : undefined}
        {...props}
      >
        {children}
      </div>
    </Pressable>
  )
}

function PreviewMenuContent({
  preview,
  previewClassName,
  className,
  children,
  ...props
}: Omit<MenuPrimitiveProps<object>, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
  preview?: React.ReactNode
  previewClassName?: string
}) {
  const { open, lifted, frame, content, triggerRef } = usePreviewMenu()
  const triggerContent = React.useSyncExternalStore(
    content.subscribe,
    content.get,
    content.get
  )
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
        "data-popup-open",
        "data-pressed",
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

  if (!open && !lifted) return null

  return (
    <>
      {createPortal(
        <>
          <div
            data-slot="preview-menu-backdrop"
            data-closed={open ? undefined : ""}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xl transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] starting:opacity-0 data-closed:opacity-0 motion-reduce:transition-none"
          />
          {frame && (
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
                {preview ?? triggerContent}
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
          )}
        </>,
        document.body
      )}
      <PopoverPrimitive
        {...{
          getTargetRect: () =>
            frame
              ? new DOMRect(frame.left, frame.top, frame.width, frame.height)
              : null,
        }}
        triggerRef={previewRef}
        placement="bottom"
        offset={12}
        containerPadding={EDGE}
        data-slot="preview-menu-content"
        className={cn(
          "isolate z-50 min-w-60 origin-(--trigger-anchor-point) overflow-y-auto rounded-2xl bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/5 transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none data-exiting:scale-90 data-exiting:opacity-0 data-exiting:duration-300 data-entering:scale-90 data-entering:opacity-0 motion-reduce:transition-none dark:ring-foreground/10",
          className
        )}
      >
        <PreviewMenuPresence />
        <MenuPrimitive className="outline-none" {...props}>
          {children}
        </MenuPrimitive>
      </PopoverPrimitive>
    </>
  )
}

function PreviewMenuPresence() {
  const { setLifted } = usePreviewMenu()
  React.useEffect(() => () => setLifted(false), [setLifted])
  return null
}

function textOf(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (React.isValidElement<{ children?: unknown }>(node))
    return textOf(node.props.children)
  return ""
}

function PreviewMenuItem({
  className,
  variant = "default",
  children,
  textValue,
  ...props
}: Omit<MenuItemPrimitiveProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
  variant?: "default" | "destructive"
}) {
  return (
    <MenuItemPrimitive
      data-slot="preview-menu-item"
      data-variant={variant}
      textValue={textValue ?? textOf(children).trim()}
      className={cn(
        "flex min-h-11 cursor-default items-center justify-between gap-6 px-4 py-2.75 text-base outline-none select-none not-first:border-t not-first:border-border data-disabled:pointer-events-none data-focused:bg-accent data-[variant=destructive]:text-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 data-focused:text-accent-foreground data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </MenuItemPrimitive>
  )
}

function PreviewMenuSeparator({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SeparatorPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <SeparatorPrimitive
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
