"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { ListIcon, XIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"
import { flushSync } from "react-dom"

import { Button, buttonVariants } from "@/components/ui/button"

type TabBarProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

type TabBarContextProps = {
  open: boolean
  present: boolean
  setOpen: (open: boolean) => void
  contentId: string
  triggerRef: React.RefObject<HTMLButtonElement | null>
  overflow: React.ReactElement[]
  setOverflow: (overflow: React.ReactElement[]) => void
  hasSections: boolean
  setHasSections: (hasSections: boolean) => void
}

const TabBarContext = React.createContext<TabBarContextProps | null>(null)

const TabBarOverflowContext = React.createContext(false)

const tabBarLinkClassName =
  "relative ms-0.5 flex min-h-9 items-center border-s border-dotted border-separator-strong ps-3.25 text-sm text-label md:text-base outline-none transition-colors select-none hover:text-label-secondary focus-visible:focus-ring data-active:text-link"

function useTabBar() {
  const context = React.useContext(TabBarContext)

  if (!context) {
    throw new Error("useTabBar must be used within a <TabBar />")
  }

  return context
}

function TabBar({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  style,
  ...props
}: React.ComponentProps<"nav"> & TabBarProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const ref = React.useRef<HTMLElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentId = React.useId()
  const [closedWidth, setClosedWidth] = React.useState<number>()
  const [overflow, setOverflow] = React.useState<React.ReactElement[]>([])
  const [hasSections, setHasSections] = React.useState(false)
  const [present, setPresent] = React.useState(open)

  React.useEffect(() => {
    if (open) {
      setPresent(true)
      return
    }
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reducedMotion) {
      setPresent(false)
      return
    }
    const timeout = setTimeout(() => setPresent(false), 400)
    return () => clearTimeout(timeout)
  }, [open])

  React.useLayoutEffect(() => {
    const nav = ref.current
    if (!nav || ((open || present) && closedWidth !== undefined)) return
    const measure = () => setClosedWidth(nav.offsetWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [open, present, closedWidth])

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  React.useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, setOpen])

  const contextValue = React.useMemo<TabBarContextProps>(
    () => ({
      open,
      present,
      setOpen,
      contentId,
      triggerRef,
      overflow,
      setOverflow,
      hasSections,
      setHasSections,
    }),
    [open, present, setOpen, contentId, overflow, hasSections]
  )

  return (
    <TabBarContext.Provider value={contextValue}>
      <nav
        ref={ref}
        data-slot="tab-bar"
        data-open={open ? "" : undefined}
        data-overflowing={overflow.length > 0 ? "" : undefined}
        data-sections={hasSections ? "" : undefined}
        className={cn(
          "group/tab-bar fixed inset-x-0 [--tab-bar-spring:linear(0,0.032,0.112,0.219,0.338,0.459,0.573,0.676,0.766,0.84,0.9,0.947,0.982,1.007,1.023,1.033,1.037,1.038,1.037,1.033,1.029,1.024,1.02,1.015,1.012,1.008,1.006,1.003,1.002,1,1,0.999,1)] bottom-[max(--spacing(4),env(safe-area-inset-bottom))] z-20 mx-auto grid max-h-[calc(100%-(--spacing(8)))] w-fit max-w-[calc(100%-(--spacing(8)))] grid-cols-[minmax(0,1fr)_auto] grid-rows-[minmax(0,1fr)_auto] rounded-xl bg-surface-secondary/75 p-1 transition-[border-radius] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] data-open:rounded-2xl data-open:duration-650 data-open:ease-(--tab-bar-spring) shadow-xl ring-1 ring-separator backdrop-blur-3xl backdrop-saturate-180 data-overflowing:w-full dark:bg-surface-tertiary/60",
          className
        )}
        style={
          {
            width: open || present ? closedWidth : undefined,
            "--tab-bar-width": closedWidth ? `${closedWidth}px` : undefined,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    </TabBarContext.Provider>
  )
}

function TabBarList({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, present, setOverflow } = useTabBar()
  const ref = React.useRef<HTMLDivElement>(null)
  const widthsRef = React.useRef<number[]>([])
  const items = React.Children.toArray(children).filter(React.isValidElement)
  const itemCount = items.length
  const [visibleCount, setVisibleCount] = React.useState(itemCount)

  React.useLayoutEffect(() => {
    const list = ref.current
    if (!list || open || present || itemCount === 0) return
    widthsRef.current = widthsRef.current.slice(0, itemCount)
    const measure = () => {
      const nav = list.closest<HTMLElement>("[data-slot=tab-bar]")
      const trigger = nav?.querySelector<HTMLElement>(
        "[data-slot=tab-bar-trigger]"
      )
      const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0
      const stretched = nav?.hasAttribute("data-overflowing") ?? false
      const widths = [...list.children].map((child, index) => {
        const item = child as HTMLElement
        if (
          !stretched ||
          item.hasAttribute("data-overflow") ||
          widthsRef.current[index] === undefined
        ) {
          widthsRef.current[index] = item.getBoundingClientRect().width
        }
        return widthsRef.current[index]
      })
      const triggerSpace = trigger
        ? trigger.getBoundingClientRect().width + gap
        : 0
      const space =
        list.getBoundingClientRect().width +
        (trigger?.hasAttribute("data-idle") ? 0 : triggerSpace)
      const fits = (available: number) => {
        let used = 0
        let count = 0
        for (const width of widths) {
          used += width + (count > 0 ? gap : 0)
          if (used > available + 1) break
          count++
        }
        return count
      }
      const needsTrigger =
        nav?.hasAttribute("data-sections") || fits(space) < widths.length
      return needsTrigger ? fits(space - triggerSpace) : widths.length
    }
    setVisibleCount(measure())
    const observer = new ResizeObserver(() =>
      flushSync(() => setVisibleCount(measure()))
    )
    observer.observe(list)
    return () => observer.disconnect()
  }, [itemCount, open, present])

  React.useLayoutEffect(() => {
    setOverflow(
      React.Children.toArray(children)
        .filter(React.isValidElement)
        .slice(visibleCount)
    )
  }, [children, visibleCount, setOverflow])

  return (
    <div
      ref={ref}
      data-slot="tab-bar-list"
      inert={open || undefined}
      className={cn(
        "relative col-start-1 row-start-2 flex min-w-0 gap-1 overflow-hidden rounded-md transition-[opacity,visibility] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-open/tab-bar:duration-100 group-data-open/tab-bar:pointer-events-none group-data-open/tab-bar:invisible group-data-open/tab-bar:opacity-0 group-has-[[data-slot=tab-bar-trigger]:not([data-idle])]/tab-bar:me-1 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      {items.map((item, index) =>
        index < visibleCount
          ? item
          : React.cloneElement(
              item as React.ReactElement<object>,
              {
                "data-overflow": "",
                "aria-hidden": true,
                tabIndex: -1,
              } as object
            )
      )}
    </div>
  )
}

function TabBarItem({
  render,
  isActive = false,
  className,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    isActive?: boolean
  }) {
  const inOverflow = React.useContext(TabBarOverflowContext)
  const { setOpen } = useTabBar()

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? undefined : "button",
        "aria-current": isActive ? "page" : undefined,
        onClick: inOverflow ? () => setOpen(false) : undefined,
        className: cn(
          inOverflow
            ? cn(tabBarLinkClassName, "text-start")
            : cn(
                buttonVariants({ variant: "outline" }),
                "shrink-0 rounded-md border-separator bg-transparent text-label-secondary transition-[color,border-color] duration-200 hover:border-separator-strong hover:bg-transparent hover:text-label active:bg-transparent data-active:border-separator-strong data-active:text-label data-overflow:invisible data-overflow:absolute group-data-overflowing/tab-bar:flex-1 dark:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent"
              ),
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: inOverflow ? "tab-bar-link" : "tab-bar-item",
      active: isActive,
    },
  })
}

function TabBarTrigger({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open, setOpen, contentId, triggerRef, overflow, hasSections } =
    useTabBar()

  const idle = !open && overflow.length === 0 && !hasSections

  return (
    <Button
      ref={triggerRef}
      data-slot="tab-bar-trigger"
      data-idle={idle ? "" : undefined}
      aria-hidden={idle || undefined}
      tabIndex={idle ? -1 : undefined}
      aria-expanded={open}
      aria-controls={contentId}
      variant="secondary"
      className={cn(
        "col-start-2 row-start-2 w-auto justify-self-end gap-2 data-idle:pointer-events-none data-idle:invisible data-idle:absolute rounded-md bg-surface/70 transition-[width,color] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-open/tab-bar:duration-650 group-data-open/tab-bar:ease-(--tab-bar-spring) [interpolate-size:allow-keywords] group-data-open/tab-bar:w-[calc(var(--tab-bar-width,auto)-(--spacing(2)))] max-w-[calc(var(--tab-bar-width,100vw)-(--spacing(2)))] motion-reduce:transition-none text-label-secondary hover:bg-surface/70 hover:text-label active:bg-surface/70 dark:bg-surface-secondary/70 dark:hover:bg-surface-secondary/70 dark:active:bg-surface-secondary/70",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setOpen(!open)
      }}
      {...props}
    >
      <span
        aria-hidden
        className="relative size-4 *:absolute *:inset-0 *:size-4 *:transition-[opacity,rotate,scale] *:duration-400 *:ease-[cubic-bezier(0.32,0.72,0,1)] group-data-open/tab-bar:*:duration-650 group-data-open/tab-bar:*:ease-(--tab-bar-spring) motion-reduce:*:transition-none"
      >
        <ListIcon className="group-data-open/tab-bar:scale-50 group-data-open/tab-bar:rotate-90 group-data-open/tab-bar:opacity-0" />
        <XIcon className="scale-50 -rotate-90 opacity-0 group-data-open/tab-bar:scale-100 group-data-open/tab-bar:rotate-0 group-data-open/tab-bar:opacity-100" />
      </span>
      {children}
    </Button>
  )
}

function TabBarContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, present, contentId, overflow, setHasSections } = useTabBar()
  const hasSections = React.Children.toArray(children).length > 0
  const [settled, setSettled] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setSettled(false)
      return
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSettled(true)
    }
  }, [open])

  React.useEffect(() => {
    setHasSections(hasSections)
    return () => setHasSections(false)
  }, [hasSections, setHasSections])

  if (!present) return null

  return (
    <div
      id={contentId}
      data-slot="tab-bar-content"
      data-closing={open ? undefined : ""}
      data-settled={settled ? "" : undefined}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && open) setSettled(true)
      }}
      className={cn(
        "col-span-2 row-start-1 mb-1 grid h-auto max-h-full self-end [interpolate-size:allow-keywords] min-h-0 w-full overflow-hidden overscroll-contain data-settled:overflow-y-auto grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-x-4 gap-y-5 px-3 py-3 transition-[height,opacity,margin,padding] duration-650 ease-(--tab-bar-spring) data-closing:duration-400 data-closing:ease-[cubic-bezier(0.32,0.72,0,1)] starting:mb-0 starting:h-0 starting:py-0 starting:opacity-0 data-closing:mb-0 data-closing:h-0 data-closing:py-0 data-closing:opacity-0 *:transition-[opacity,filter,scale] *:delay-100 *:duration-450 *:ease-[cubic-bezier(0.32,0.72,0,1)] *:starting:scale-95 *:starting:opacity-0 *:starting:blur-sm data-closing:*:scale-95 data-closing:*:opacity-0 data-closing:*:blur-sm data-closing:*:delay-0 data-closing:*:duration-150 motion-reduce:transition-none motion-reduce:*:transition-none md:px-4",
        className
      )}
      {...props}
    >
      {overflow.length > 0 && (
        <TabBarOverflowContext.Provider value>
          <TabBarSection>{overflow}</TabBarSection>
        </TabBarOverflowContext.Provider>
      )}
      {children}
    </div>
  )
}

function TabBarSection({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tab-bar-section"
      className={cn("flex min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function TabBarSectionTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tab-bar-section-title"
      className={cn(
        "relative flex h-7 items-center ps-4 text-sm text-label-secondary before:absolute before:inset-s-0 before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-label-tertiary",
        className
      )}
      {...props}
    />
  )
}

function TabBarLink({
  render,
  isActive = false,
  className,
  ...props
}: useRender.ComponentProps<"a"> &
  React.ComponentProps<"a"> & {
    isActive?: boolean
  }) {
  const { setOpen } = useTabBar()

  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        "aria-current": isActive ? "page" : undefined,
        onClick: () => setOpen(false),
        className: cn(tabBarLinkClassName, className),
      },
      props
    ),
    render,
    state: {
      slot: "tab-bar-link",
      active: isActive,
    },
  })
}

export {
  TabBar,
  TabBarContent,
  TabBarItem,
  TabBarLink,
  TabBarList,
  TabBarSection,
  TabBarSectionTitle,
  TabBarTrigger,
  useTabBar,
}
