"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { ListIcon, XIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"

import { Button, buttonVariants } from "@/components/ui/button"

type TabBarContextProps = {
  open: boolean
  setOpen: (open: boolean) => void
  contentId: string
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const TabBarContext = React.createContext<TabBarContextProps | null>(null)

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
  ...props
}: React.ComponentProps<"nav"> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const ref = React.useRef<HTMLElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentId = React.useId()

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

  return (
    <TabBarContext.Provider value={{ open, setOpen, contentId, triggerRef }}>
      <nav
        ref={ref}
        data-slot="tab-bar"
        data-open={open ? "" : undefined}
        className={cn(
          "group/tab-bar fixed inset-x-0 bottom-[max(--spacing(4),env(safe-area-inset-bottom))] z-20 mx-auto flex w-fit max-w-[calc(100%-(--spacing(8)))] flex-wrap gap-1 rounded-xl bg-surface-secondary p-1 shadow-xl dark:bg-surface-tertiary ring-1 ring-separator data-open:w-[min(44rem,calc(100%-(--spacing(8))))]",
          className
        )}
        {...props}
      />
    </TabBarContext.Provider>
  )
}

function TabBarList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tab-bar-list"
      className={cn(
        "no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto overscroll-x-contain rounded-md group-data-open/tab-bar:hidden",
        className
      )}
      {...props}
    />
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
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? undefined : "button",
        "aria-current": isActive ? "page" : undefined,
        className: cn(
          buttonVariants({ variant: "outline" }),
          "min-w-0 rounded-md border-separator bg-transparent text-label-secondary transition-[color,border-color] duration-200 hover:border-separator-strong hover:bg-transparent hover:text-label active:bg-transparent data-active:border-separator-strong data-active:text-label dark:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "tab-bar-item",
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
  const { open, setOpen, contentId, triggerRef } = useTabBar()

  return (
    <Button
      ref={triggerRef}
      data-slot="tab-bar-trigger"
      aria-expanded={open}
      aria-controls={contentId}
      variant="secondary"
      className={cn(
        "gap-2 rounded-md bg-surface text-label-secondary group-data-open/tab-bar:flex-1 hover:bg-surface hover:text-label active:bg-surface dark:bg-surface-secondary dark:hover:bg-surface-secondary dark:active:bg-surface-secondary",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setOpen(!open)
      }}
      {...props}
    >
      {open ? <XIcon /> : <ListIcon />}
      {children}
    </Button>
  )
}

function TabBarContent({ className, ...props }: React.ComponentProps<"div">) {
  const { open, contentId } = useTabBar()

  if (!open) return null

  return (
    <div
      id={contentId}
      data-slot="tab-bar-content"
      className={cn(
        "order-first grid max-h-[calc(100dvh-(--spacing(32)))] w-full grid-cols-2 gap-x-4 gap-y-5 overflow-y-auto rounded-lg bg-surface px-4 py-4 transition-[opacity,translate] duration-300 ease-out starting:translate-y-2 starting:opacity-0 md:grid-cols-4 md:px-5",
        className
      )}
      {...props}
    />
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
        "relative flex h-7 items-center ps-4 text-sm text-label-secondary before:absolute before:start-0 before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-label-tertiary",
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
        className: cn(
          "relative ms-0.5 flex min-h-9 items-center border-s border-dotted border-separator-strong ps-3.25 text-sm text-label md:text-base outline-none transition-colors select-none hover:text-label-secondary focus-visible:focus-ring data-active:text-link",
          className
        ),
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
