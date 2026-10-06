"use client"

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
import { cn } from "cn"
import * as React from "react"

type PreviewMenuFrame = {
  top: number
  left: number
  width: number
  height: number
  from: string
}

type PreviewMenuContextProps = {
  open: boolean
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
const MENU_SPACE = 260
const MAX_WIDTH = 360

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
  const scaleX = rect.width / width
  const scaleY = rect.height / height
  const dx = rect.left - left
  const dy = rect.top - top
  return {
    top,
    left,
    width,
    height,
    from: `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`,
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

  const setOpen = (next: boolean) => {
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
      value={{ open, frame, triggerRef, contentRef }}
    >
      <ContextMenuPrimitive.Root
        open={open}
        onOpenChange={(next) => setOpen(next)}
      >
        {children}
      </ContextMenuPrimitive.Root>
    </PreviewMenuContext.Provider>
  )
}

function PreviewMenuTrigger({
  className,
  children,
  ...props
}: ContextMenuPrimitive.Trigger.Props) {
  const { open, triggerRef, contentRef } = usePreviewMenu()
  contentRef.current = children as React.ReactNode

  return (
    <ContextMenuPrimitive.Trigger
      ref={triggerRef as React.Ref<HTMLDivElement>}
      data-slot="preview-menu-trigger"
      className={cn(
        "touch-manipulation select-none [-webkit-touch-callout:none] data-popup-open:invisible",
        className
      )}
      data-previewing={open ? "" : undefined}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Trigger>
  )
}

function PreviewMenuContent({
  preview,
  previewClassName,
  className,
  children,
  ...props
}: ContextMenuPrimitive.Popup.Props & {
  preview?: React.ReactNode
  previewClassName?: string
}) {
  const { open, frame, contentRef } = usePreviewMenu()
  const previewRef = React.useRef<HTMLDivElement>(null)

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Backdrop
        data-slot="preview-menu-backdrop"
        className="fixed inset-0 z-50 bg-scrim/40 backdrop-blur-xl transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
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
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none fixed z-50 origin-top-left overflow-hidden rounded-2xl shadow-2xl transition-[transform,border-radius] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] starting:transform-(--preview-menu-from) starting:rounded-lg data-closed:transform-(--preview-menu-from) data-closed:rounded-lg data-closed:shadow-none data-closed:duration-300 motion-reduce:transition-none [&>*]:size-full",
            previewClassName
          )}
        >
          {preview ?? contentRef.current}
        </div>
      )}
      <ContextMenuPrimitive.Positioner
        anchor={previewRef}
        side="bottom"
        align="center"
        sideOffset={12}
        collisionPadding={EDGE}
        className="isolate z-50 outline-none"
      >
        <ContextMenuPrimitive.Popup
          data-slot="preview-menu-content"
          className={cn(
            "max-h-(--available-height) min-w-60 origin-(--transform-origin) overflow-y-auto rounded-2xl bg-surface-raised text-label shadow-xl ring-1 ring-label/5 transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-300 data-starting-style:scale-90 data-starting-style:opacity-0 motion-reduce:transition-none dark:ring-label/10",
            className
          )}
          {...props}
        >
          {children}
        </ContextMenuPrimitive.Popup>
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  )
}

function PreviewMenuItem({
  className,
  variant = "default",
  ...props
}: ContextMenuPrimitive.Item.Props & {
  variant?: "default" | "destructive"
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="preview-menu-item"
      data-variant={variant}
      className={cn(
        "flex min-h-11 cursor-default items-center justify-between gap-6 px-4 py-2.75 text-base outline-none select-none not-first:border-t not-first:border-separator data-disabled:pointer-events-none data-disabled:text-label-quaternary data-highlighted:bg-item-hover data-[variant=destructive]:text-danger [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    />
  )
}

function PreviewMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="preview-menu-separator"
      className={cn("h-2 bg-separator/40", className)}
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
