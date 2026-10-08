"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-xl p-1 text-label-secondary group-data-horizontal/tabs:h-11 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none data-[variant=line]:p-0.5 group-data-horizontal/tabs:data-[variant=line]:h-10.25 group-data-horizontal/tabs:data-[variant=line]:pb-1.75",
  {
    variants: {
      variant: {
        default: "bg-control",
        line: "gap-1 bg-transparent",
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
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const list = ref.current
    if (!list) return
    const reveal = () => {
      const active = list.querySelector<HTMLElement>(
        "[data-slot=tabs-trigger][data-active]"
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
      attributeFilter: ["data-active"],
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

  return (
    <TabsPrimitive.List
      ref={ref}
      data-slot="tabs-list"
      data-variant={variant}
      className="no-scrollbar relative flex max-w-full overflow-x-auto overscroll-x-contain group-data-vertical/tabs:w-fit group-data-horizontal/tabs:data-[variant=line]:-mb-1.25 max-md:group-data-horizontal/tabs:-ms-(--tabs-list-bleed-start) max-md:group-data-horizontal/tabs:-me-(--tabs-list-bleed-end) max-md:group-data-horizontal/tabs:max-w-[calc(100%+var(--tabs-list-bleed-start,0px)+var(--tabs-list-bleed-end,0px))] max-md:group-data-horizontal/tabs:ps-(--tabs-list-bleed-start) max-md:group-data-horizontal/tabs:pe-(--tabs-list-bleed-end)"
      {...props}
    >
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        data-variant={variant}
        renderBeforeHydration
        className="pointer-events-none absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-md bg-surface-raised shadow-sm transition-[left,top,width,height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-[variant=line]:rounded-none data-[variant=line]:bg-label data-[variant=line]:shadow-none group-data-horizontal/tabs:data-[variant=line]:top-[calc(var(--active-tab-top)+var(--active-tab-height)+(--spacing(0.75)))] group-data-horizontal/tabs:data-[variant=line]:h-0.5 group-data-vertical/tabs:data-[variant=line]:left-[calc(var(--active-tab-left)+var(--active-tab-width)+(--spacing(0.5)))] group-data-vertical/tabs:data-[variant=line]:w-0.5 motion-reduce:transition-none dark:bg-label-quaternary dark:data-[variant=line]:bg-label"
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

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex flex-1 group-data-horizontal/tabs:h-full group-data-[variant=line]/tabs-list:h-[calc(100%-1px)] items-center justify-center gap-2 rounded-md border border-transparent! px-3 py-1 text-sm whitespace-nowrap text-label-secondary transition-colors group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:h-9 group-data-vertical/tabs:flex-none group-data-vertical/tabs:px-3 hover:text-label focus-visible:focus-ring disabled:pointer-events-none disabled:text-label-quaternary has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 aria-disabled:pointer-events-none aria-disabled:text-label-quaternary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-active:text-label",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        "flex-1 rounded-lg text-base outline-none focus-visible:focus-ring [--focus-ring-offset:3px]",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
