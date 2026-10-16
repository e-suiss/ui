"use client"

import * as React from "react"
import {
  MenuItem as MenuItemPrimitive,
  Menu as MenuPrimitive,
  Popover as PopoverPrimitive,
} from "react-aria-components"
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

type TrailRender = (props: React.ComponentProps<"a">) => React.ReactNode

function TrailAnchor(props: React.ComponentProps<"a">) {
  return <a {...props} />
}

function renderAnchor(props: React.ComponentProps<"a">) {
  return <TrailAnchor {...props} />
}

function collapse(items: TrailItem[], maxItems: number | undefined) {
  const [first] = items
  if (!first || !maxItems || items.length <= maxItems) {
    return { items, hidden: 0, ellipsisAt: -1 }
  }
  if (maxItems === 1) {
    return { items: items.slice(-1), hidden: items.length - 1, ellipsisAt: 0 }
  }
  const tail = maxItems - 1
  return {
    items: [first, ...items.slice(items.length - tail)],
    hidden: items.length - tail - 1,
    ellipsisAt: 1,
  }
}

function Trail({
  items,
  maxItems,
  backLabel,
  ellipsisLabel = "More",
  render = renderAnchor,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: TrailItem[]
  maxItems?: number
  backLabel?: string
  ellipsisLabel?: string
  render?: TrailRender
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

  React.useEffect(() => () => clearTimeout(timerRef.current), [])

  const cancelPress = () => {
    clearTimeout(timerRef.current)
    startRef.current = null
  }

  const openHistory = () => {
    pressedRef.current = touchingRef.current
    setHistoryOpen(true)
  }

  const release = () => {
    cancelPress()
    touchingRef.current = false
    if (!pressedRef.current) return
    setTimeout(() => {
      pressedRef.current = false
    }, 300)
  }

  const back = render({
    ref: backRef,
    href: parent?.href,
    "data-slot": "trail-back",
    ...(hasHistory && {
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
          setHistoryOpen(true)
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
    }),
    className:
      "-ms-1.5 inline-flex min-h-11 touch-manipulation items-center gap-0.5 rounded-md pe-1.5 text-base text-primary outline-none select-none [-webkit-touch-callout:none] focus-visible:ring-3 focus-visible:ring-ring/50",
    children: (
      <>
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
      </>
    ),
  } as React.ComponentProps<"a">)

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
          <PopoverPrimitive
            triggerRef={backRef}
            isOpen={historyOpen}
            onOpenChange={(next) => {
              if (!next && pressedRef.current) return
              setHistoryOpen(next)
            }}
            placement="bottom start"
            offset={6}
            data-slot="trail-history"
            className="isolate z-50 min-w-60 origin-(--trigger-anchor-point) overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/5 transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none data-exiting:scale-90 data-exiting:opacity-0 data-entering:scale-90 data-entering:opacity-0 motion-reduce:transition-none dark:ring-foreground/10"
          >
            <MenuPrimitive
              aria-label={backLabel ?? parent.label}
              autoFocus="first"
              onAction={() => setHistoryOpen(false)}
              className="outline-none"
            >
              {ancestors.map((item) => (
                <MenuItemPrimitive
                  key={item.href ?? item.label}
                  id={item.href ?? item.label}
                  textValue={item.label}
                  data-slot="trail-history-item"
                  href={item.href}
                  render={(props) =>
                    render(
                      props as React.ComponentProps<"a">
                    ) as React.ReactElement
                  }
                  className="flex min-h-11 items-center justify-between gap-6 px-4 py-2.75 text-base outline-none select-none not-first:border-t not-first:border-border data-focused:bg-accent [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 data-focused:text-accent-foreground"
                >
                  <span className="truncate">{item.label}</span>
                  <IconPlaceholder
                    lucide="ReplyIcon"
                    tabler="IconArrowBackUp"
                    hugeicons="ArrowTurnBackwardIcon"
                    phosphor="ArrowBendUpLeftIcon"
                    remixicon="RiReplyLine"
                    className="rtl:-scale-x-100"
                  />
                </MenuItemPrimitive>
              ))}
            </MenuPrimitive>
          </PopoverPrimitive>
        )}
      </nav>
    )
  }

  const { items: shown, hidden, ellipsisAt } = collapse(items, maxItems)

  return (
    <Breadcrumb data-slot="trail" className={className} {...props}>
      <BreadcrumbList>
        {shown.map((item, index) => {
          const last = index === shown.length - 1
          return (
            <React.Fragment key={item.href ?? item.label}>
              {index > 0 && <BreadcrumbSeparator />}
              {index === ellipsisAt && hidden > 0 && (
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
                  <BreadcrumbLink
                    render={(props) =>
                      render({
                        ...(props as React.ComponentProps<"a">),
                        href: item.href,
                      })
                    }
                  >
                    {item.label}
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
