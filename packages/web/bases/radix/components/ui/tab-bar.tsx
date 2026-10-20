"use client"

import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"
import * as React from "react"
import { flushSync } from "react-dom"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

const tabBarLinkVariants = cva(
  "relative ms-0.5 flex min-h-9 items-center border-s border-dotted border-input ps-3.25 text-sm text-foreground md:text-base outline-none transition-colors select-none hover:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-active:text-primary"
)

function useTabBar() {
  const context = React.useContext(TabBarContext)

  if (!context) {
    throw new Error("useTabBar must be used within a <TabBar />")
  }

  return context
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function useReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )
}

function TabBar({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  style,
  ref: forwardedRef,
  ...props
}: React.ComponentProps<"nav"> & TabBarProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const ref = React.useRef<HTMLElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentId = React.useId()
  const [closedWidth, setClosedWidth] = React.useState<number>()
  const [innerWidth, setInnerWidth] = React.useState<number>()
  const [overflow, setOverflow] = React.useState<React.ReactElement[]>([])
  const [hasSections, setHasSections] = React.useState(false)
  const [present, setPresent] = React.useState(open)
  const [previousOpen, setPreviousOpen] = React.useState(open)
  const reducedMotion = useReducedMotion()

  if (open !== previousOpen) {
    setPreviousOpen(open)
    if (open) setPresent(true)
    else if (reducedMotion) setPresent(false)
  }

  React.useEffect(() => {
    if (open || !present) return
    const timeout = setTimeout(() => setPresent(false), 400)
    return () => clearTimeout(timeout)
  }, [open, present])

  React.useLayoutEffect(() => {
    const nav = ref.current
    if (!nav || ((open || present) && closedWidth !== undefined)) return
    const measure = () => {
      setClosedWidth(nav.offsetWidth)
      setInnerWidth(nav.clientWidth)
    }
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
        ref={(node) => {
          ref.current = node
          if (typeof forwardedRef === "function") return forwardedRef(node)
          if (forwardedRef) forwardedRef.current = node
        }}
        data-slot="tab-bar"
        data-open={open ? "" : undefined}
        data-overflowing={overflow.length > 0 ? "" : undefined}
        data-sections={hasSections ? "" : undefined}
        className={cn("cn-tab-bar group/tab-bar", className)}
        style={
          {
            width: open || present ? closedWidth : undefined,
            "--tab-bar-width": innerWidth ? `${innerWidth}px` : undefined,
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
  ref: forwardedRef,
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
      ref={(node) => {
        ref.current = node
        if (typeof forwardedRef === "function") return forwardedRef(node)
        if (forwardedRef) forwardedRef.current = node
      }}
      data-slot="tab-bar-list"
      inert={open || undefined}
      className={cn("cn-tab-bar-list", className)}
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
  asChild = false,
  isActive = false,
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
}) {
  const inOverflow = React.useContext(TabBarOverflowContext)
  const { setOpen } = useTabBar()
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot={inOverflow ? "tab-bar-link" : "tab-bar-item"}
      data-active={isActive ? "" : undefined}
      type={asChild ? undefined : "button"}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        inOverflow
          ? tabBarLinkVariants()
          : buttonVariants({ variant: "ghost" }),
        inOverflow
          ? "text-start"
          : "shrink-0 font-medium text-muted-foreground transition-[color,background-color] duration-200 data-active:bg-secondary data-active:text-[color-mix(in_oklab,var(--primary)_80%,var(--foreground))] data-overflow:invisible data-overflow:absolute group-data-overflowing/tab-bar:flex-1 disabled:opacity-50",
        className
      )}
      {...props}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (inOverflow) setOpen(false)
      }}
    />
  )
}

function TabBarTrigger({
  className,
  children,
  onClick,
  ref,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open, setOpen, contentId, triggerRef, overflow, hasSections } =
    useTabBar()

  const idle = !open && overflow.length === 0 && !hasSections

  return (
    <Button
      ref={(node) => {
        triggerRef.current = node
        if (typeof ref === "function") return ref(node)
        if (ref) ref.current = node
      }}
      data-slot="tab-bar-trigger"
      data-idle={idle ? "" : undefined}
      aria-hidden={idle || undefined}
      tabIndex={idle ? -1 : undefined}
      aria-expanded={open}
      aria-controls={contentId}
      variant="secondary"
      className={cn("cn-tab-bar-trigger", className)}
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
        <IconPlaceholder
          lucide="MenuIcon"
          tabler="IconMenu2"
          hugeicons="Menu01Icon"
          phosphor="ListIcon"
          remixicon="RiMenuLine"
          className="group-data-open/tab-bar:scale-50 group-data-open/tab-bar:rotate-90 group-data-open/tab-bar:opacity-0"
        />
        <IconPlaceholder
          lucide="XIcon"
          tabler="IconX"
          hugeicons="Cancel01Icon"
          phosphor="XIcon"
          remixicon="RiCloseLine"
          className="scale-50 -rotate-90 opacity-0 group-data-open/tab-bar:scale-100 group-data-open/tab-bar:rotate-0 group-data-open/tab-bar:opacity-100"
        />
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
  const [transitioned, setTransitioned] = React.useState(false)
  const [previousOpen, setPreviousOpen] = React.useState(open)
  const reducedMotion = useReducedMotion()
  const settled = open && (transitioned || reducedMotion)

  if (open !== previousOpen) {
    setPreviousOpen(open)
    if (!open) setTransitioned(false)
  }

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
        if (event.target === event.currentTarget && open) {
          setTransitioned(true)
        }
      }}
      className={cn(
        "cn-tab-bar-content *:transition-[opacity,filter,scale] *:delay-100 *:duration-450 *:ease-[cubic-bezier(0.32,0.72,0,1)] *:starting:scale-95 *:starting:opacity-0 *:starting:blur-sm data-closing:*:scale-95 data-closing:*:opacity-0 data-closing:*:blur-sm data-closing:*:delay-0 data-closing:*:duration-150 motion-reduce:*:transition-none",
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
      className={cn("cn-tab-bar-section", className)}
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
      className={cn("cn-tab-bar-section-title", className)}
      {...props}
    />
  )
}

function TabBarLink({
  asChild = false,
  isActive = false,
  className,
  onClick,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  isActive?: boolean
}) {
  const { setOpen } = useTabBar()
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="tab-bar-link"
      data-active={isActive ? "" : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(tabBarLinkVariants(), className)}
      {...props}
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        setOpen(false)
      }}
    />
  )
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
