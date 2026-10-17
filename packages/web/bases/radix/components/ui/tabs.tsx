"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"
import * as React from "react"
import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  activationMode = "manual",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      activationMode={activationMode}
      data-orientation={orientation}
      className={cn(
        "cn-tabs group/tabs flex data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "cn-tabs-list group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "cn-tabs-list-variant-default",
        line: "cn-tabs-list-variant-line",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  children,
  ref: forwardedRef,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  const ref = React.useRef<HTMLDivElement>(null)
  const indicator = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const list = ref.current
    if (!list) return
    const reveal = () => {
      const active = list.querySelector<HTMLElement>(
        "[data-slot=tabs-trigger][data-state=active]"
      )
      const first = list.querySelector<HTMLElement>("[data-slot=tabs-trigger]")
      if (!active || !first || list.clientWidth === 0) return
      const style = getComputedStyle(list)
      const padStart = Number.parseFloat(style.paddingInlineStart) || 0
      const padEnd = Number.parseFloat(style.paddingInlineEnd) || 0
      const inset = first.offsetLeft - padStart
      const left = active.offsetLeft - first.offsetLeft
      const right =
        active.offsetLeft +
        active.offsetWidth +
        inset +
        padEnd -
        list.clientWidth
      if (left < list.scrollLeft) {
        list.scrollTo({ left, behavior })
      } else if (right > list.scrollLeft) {
        list.scrollTo({ left: right, behavior })
      }
    }
    let behavior: ScrollBehavior = "instant"
    reveal()
    behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth"
    const observer = new MutationObserver(reveal)
    observer.observe(list, {
      subtree: true,
      attributeFilter: ["data-state"],
    })
    return () => observer.disconnect()
  }, [])

  React.useLayoutEffect(() => {
    const list = ref.current
    const parent = list?.parentElement
    if (!list || !parent) return
    const boundary = () => {
      for (let node = parent.parentElement; node; node = node.parentElement) {
        if (node === document.body || node === document.documentElement) break
        if (getComputedStyle(node).overflowX === "visible") continue
        const rect = node.getBoundingClientRect()
        const start = rect.left + node.clientLeft
        return { start, end: start + node.clientWidth }
      }
      return { start: 0, end: document.documentElement.clientWidth }
    }
    const measure = () => {
      const rect = parent.getBoundingClientRect()
      const edge = boundary()
      const rtl = getComputedStyle(list).direction === "rtl"
      const left = Math.max(0, rect.left - edge.start)
      const right = Math.max(0, edge.end - rect.right)
      list.style.setProperty(
        "--tabs-list-bleed-start",
        `${rtl ? right : left}px`
      )
      list.style.setProperty("--tabs-list-bleed-end", `${rtl ? left : right}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(parent)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  React.useLayoutEffect(() => {
    const list = ref.current
    const span = indicator.current
    if (!list || !span) return
    const measure = () => {
      const active = list.querySelector<HTMLElement>(
        "[data-slot=tabs-trigger][data-state=active]"
      )
      if (!active) {
        span.hidden = true
        return
      }
      span.style.setProperty("--active-tab-left", `${active.offsetLeft}px`)
      span.style.setProperty("--active-tab-top", `${active.offsetTop}px`)
      span.style.setProperty("--active-tab-width", `${active.offsetWidth}px`)
      span.style.setProperty("--active-tab-height", `${active.offsetHeight}px`)
      span.hidden = false
    }
    measure()
    const mutations = new MutationObserver(measure)
    mutations.observe(list, {
      subtree: true,
      childList: true,
      attributeFilter: ["data-state"],
    })
    const resize = new ResizeObserver(measure)
    resize.observe(list)
    for (const trigger of list.querySelectorAll("[data-slot=tabs-trigger]"))
      resize.observe(trigger)
    return () => {
      mutations.disconnect()
      resize.disconnect()
    }
  }, [])

  return (
    <TabsPrimitive.List
      ref={(node) => {
        ref.current = node
        if (typeof forwardedRef === "function") return forwardedRef(node)
        if (forwardedRef) forwardedRef.current = node
      }}
      data-slot="tabs-list"
      data-variant={variant}
      className="no-scrollbar relative flex max-w-full overflow-x-auto overscroll-x-contain group-data-vertical/tabs:w-fit group-data-horizontal/tabs:data-[variant=line]:-mb-1.25 max-md:group-data-horizontal/tabs:-ms-(--tabs-list-bleed-start) max-md:group-data-horizontal/tabs:-me-(--tabs-list-bleed-end) max-md:group-data-horizontal/tabs:max-w-[calc(100%+var(--tabs-list-bleed-start,0px)+var(--tabs-list-bleed-end,0px))] max-md:group-data-horizontal/tabs:ps-(--tabs-list-bleed-start) max-md:group-data-horizontal/tabs:pe-(--tabs-list-bleed-end)"
      {...props}
    >
      <span
        data-slot="tabs-indicator"
        data-variant={variant}
        ref={indicator}
        aria-hidden
        className="cn-tabs-indicator"
      />
      <div
        data-slot="tabs-list-content"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
      >
        {children}
      </div>
    </TabsPrimitive.List>
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "cn-tabs-trigger relative inline-flex items-center justify-center whitespace-nowrap group-data-vertical/tabs:justify-start focus-visible:border-ring focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg]:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-active:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("cn-tabs-content flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
