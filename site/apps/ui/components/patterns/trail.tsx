"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { useRender } from "@base-ui/react/use-render"
import { ArrowBendUpLeftIcon, CaretLeftIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"

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

type TrailItem = {
  label: string
  href?: string
}

const LONG_PRESS_DELAY = 500
const LONG_PRESS_TOLERANCE = 10

function TrailAnchor(props: React.ComponentProps<"a">) {
  return <a {...props} />
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

  const back = useRender({
    defaultTagName: "a",
    render,
    props: {
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
        "-ms-1.5 inline-flex min-h-11 touch-manipulation items-center gap-0.5 rounded-md pe-1.5 text-base text-link outline-none select-none [-webkit-touch-callout:none] focus-visible:focus-ring",
      children: (
        <>
          <CaretLeftIcon
            weight="bold"
            className="size-4.5 shrink-0 rtl:rotate-180"
            aria-hidden
          />
          <span className="truncate">{backLabel ?? parent?.label}</span>
        </>
      ),
    },
  })

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
            <MenuPrimitive.Portal>
              <MenuPrimitive.Positioner
                anchor={backRef}
                side="bottom"
                align="start"
                sideOffset={6}
                className="isolate z-50 outline-none"
              >
                <MenuPrimitive.Popup
                  data-slot="trail-history"
                  className="min-w-60 origin-(--transform-origin) overflow-hidden rounded-2xl bg-surface-raised text-label shadow-xl ring-1 ring-label/5 transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 motion-reduce:transition-none dark:ring-label/10"
                >
                  {ancestors.map((item) => (
                    <MenuPrimitive.LinkItem
                      key={item.href ?? item.label}
                      data-slot="trail-history-item"
                      closeOnClick
                      href={item.href}
                      render={render}
                      className="flex min-h-11 items-center justify-between gap-6 px-4 py-2.75 text-base outline-none select-none not-first:border-t not-first:border-separator data-highlighted:bg-item-hover [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5"
                    >
                      <span className="truncate">{item.label}</span>
                      <ArrowBendUpLeftIcon className="rtl:-scale-x-100" />
                    </MenuPrimitive.LinkItem>
                  ))}
                </MenuPrimitive.Popup>
              </MenuPrimitive.Positioner>
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
                  <BreadcrumbLink render={render} href={item.href}>
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
