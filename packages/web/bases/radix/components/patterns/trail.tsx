"use client"

import { DropdownMenu as MenuPrimitive, Portal, Slot } from "radix-ui"
import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

type TrailItem = {
  label: string
  href?: string
}

const LONG_PRESS_DELAY = 500
const LONG_PRESS_TOLERANCE = 10

function TrailAnchor(props: React.ComponentProps<"a">) {
  return <a {...props} />
}

function TrailLink({
  render,
  children,
  ...props
}: React.ComponentProps<"a"> & { render: React.ReactElement }) {
  return (
    <Slot.Root {...props}>
      {React.cloneElement(render, undefined, children)}
    </Slot.Root>
  )
}

function collapse(items: TrailItem[], maxItems: number | undefined) {
  const [first] = items
  if (!first || !maxItems || items.length <= maxItems) {
    return { items, hidden: 0 }
  }
  const tail = Math.max(maxItems - 1, 1)
  return {
    items: [first, ...items.slice(items.length - tail)],
    hidden: items.length - tail - 1,
  }
}

function Trail({
  items,
  maxItems,
  backLabel,
  ellipsisLabel = "More",
  render = <TrailAnchor />,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: TrailItem[]
  maxItems?: number
  backLabel?: string
  ellipsisLabel?: string
  render?: React.ReactElement
}) {
  const isMobile = useIsMobile()
  const parent = items.at(-2)
  const ancestors = items.slice(0, -1).reverse()
  const hasHistory = ancestors.length > 1
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const startRef = React.useRef<{ x: number; y: number } | null>(null)
  const pressedRef = React.useRef(false)
  const touchingRef = React.useRef(false)
  const backRef = React.useRef<HTMLAnchorElement>(null)
  const [anchor, setAnchor] = React.useState<DOMRect | null>(null)

  React.useEffect(() => () => clearTimeout(timerRef.current), [])

  const cancelPress = () => {
    clearTimeout(timerRef.current)
    startRef.current = null
  }

  const showHistory = () => {
    setAnchor(backRef.current?.getBoundingClientRect() ?? null)
    setHistoryOpen(true)
  }

  const openHistory = () => {
    pressedRef.current = touchingRef.current
    showHistory()
  }

  const release = () => {
    cancelPress()
    touchingRef.current = false
    if (!pressedRef.current) return
    setTimeout(() => {
      pressedRef.current = false
    }, 300)
  }

  const historyProps: React.ComponentProps<"a"> = hasHistory
    ? {
        "aria-haspopup": "menu" as const,
        "aria-expanded": historyOpen,
        onClick: (event: React.MouseEvent) => {
          if (pressedRef.current) event.preventDefault()
        },
        onContextMenu: (event: React.MouseEvent) => {
          event.preventDefault()
          cancelPress()
          openHistory()
        },
        onKeyDown: (event: React.KeyboardEvent) => {
          if (
            event.key === "ContextMenu" ||
            (event.shiftKey && event.key === "F10")
          ) {
            event.preventDefault()
            showHistory()
          }
        },
        onPointerDown: (event: React.PointerEvent) => {
          pressedRef.current = false
          if (event.pointerType === "mouse") return
          touchingRef.current = true
          startRef.current = { x: event.clientX, y: event.clientY }
          clearTimeout(timerRef.current)
          timerRef.current = setTimeout(() => {
            startRef.current = null
            openHistory()
          }, LONG_PRESS_DELAY)
        },
        onPointerMove: (event: React.PointerEvent) => {
          const start = startRef.current
          if (!start) return
          const moved = Math.hypot(
            event.clientX - start.x,
            event.clientY - start.y
          )
          if (moved > LONG_PRESS_TOLERANCE) cancelPress()
        },
        onPointerUp: release,
        onPointerCancel: release,
        onPointerLeave: cancelPress,
      }
    : {}

  const back = (
    <TrailLink
      ref={backRef}
      render={render}
      href={parent?.href}
      data-slot="trail-back"
      className="-ms-1.5 inline-flex min-h-11 touch-manipulation items-center gap-0.5 rounded-md pe-1.5 text-base text-primary outline-none select-none [-webkit-touch-callout:none] focus-visible:ring-3 focus-visible:ring-ring/50"
      {...historyProps}
    >
      <IconPlaceholder
        lucide="ChevronLeftIcon"
        tabler="IconChevronLeft"
        hugeicons="ArrowLeft01Icon"
        phosphor="CaretLeftIcon"
        remixicon="RiArrowLeftSLine"
        className="size-4.5 shrink-0 rtl:rotate-180"
        aria-hidden
      />
      <span className="truncate">{backLabel ?? parent?.label}</span>
    </TrailLink>
  )

  if (isMobile) {
    if (!parent) return null
    return (
      <nav
        data-slot="trail"
        aria-label="Back"
        className={cn("flex", className)}
        {...props}
      >
        {back}
        {hasHistory && (
          <MenuPrimitive.Root
            open={historyOpen}
            onOpenChange={(next) => {
              if (!next && pressedRef.current) return
              setHistoryOpen(next)
            }}
          >
            {anchor && (
              <Portal.Root>
                <MenuPrimitive.Trigger asChild>
                  <span
                    aria-hidden
                    tabIndex={-1}
                    className="pointer-events-none fixed"
                    style={{
                      top: anchor.top,
                      left: anchor.left,
                      width: anchor.width,
                      height: anchor.height,
                    }}
                  />
                </MenuPrimitive.Trigger>
              </Portal.Root>
            )}
            <MenuPrimitive.Portal>
              <MenuPrimitive.Content
                data-slot="trail-history"
                side="bottom"
                align="start"
                sideOffset={6}
                onCloseAutoFocus={(event) => {
                  event.preventDefault()
                  backRef.current?.focus()
                }}
                className="z-50 min-w-60 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-90 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-90 motion-reduce:animate-none dark:ring-foreground/10"
              >
                {ancestors.map((item) => (
                  <MenuPrimitive.Item
                    key={item.href ?? item.label}
                    data-slot="trail-history-item"
                    asChild
                    className="flex min-h-11 items-center justify-between gap-6 px-4 py-2.75 text-base outline-none select-none not-first:border-t not-first:border-border data-highlighted:bg-accent [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 data-highlighted:text-accent-foreground"
                  >
                    <TrailLink render={render} href={item.href}>
                      <span className="truncate">{item.label}</span>
                      <IconPlaceholder
                        lucide="ReplyIcon"
                        tabler="IconArrowBackUp"
                        hugeicons="ArrowTurnBackwardIcon"
                        phosphor="ArrowBendUpLeftIcon"
                        remixicon="RiReplyLine"
                        className="rtl:-scale-x-100"
                      />
                    </TrailLink>
                  </MenuPrimitive.Item>
                ))}
              </MenuPrimitive.Content>
            </MenuPrimitive.Portal>
          </MenuPrimitive.Root>
        )}
      </nav>
    )
  }

  const { items: shown, hidden } = collapse(items, maxItems)

  return (
    <Breadcrumb data-slot="trail" className={className} {...props}>
      <BreadcrumbList>
        {shown.map((item, index) => {
          const last = index === shown.length - 1
          return (
            <React.Fragment key={item.href ?? item.label}>
              {index > 0 && <BreadcrumbSeparator />}
              {index === 1 && hidden > 0 && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis>{ellipsisLabel}</BreadcrumbEllipsis>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                {last ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild href={item.href}>
                    <TrailLink render={render}>{item.label}</TrailLink>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { Trail, type TrailItem }
