"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import {
  ToggleButtonGroup as ToggleGroupPrimitive,
  type ToggleButtonGroupProps as ToggleGroupPrimitiveProps,
  ToggleButton as TogglePrimitive,
  type ToggleButtonProps as TogglePrimitiveProps,
} from "react-aria-components"
import { toggleVariants } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }
>({
  size: "default",
  variant: "default",
  spacing: 2,
  orientation: "horizontal",
})

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  spacing = 2,
  orientation = "horizontal",
  children,
  ...props
}: Omit<ToggleGroupPrimitiveProps, "className" | "children"> &
  VariantProps<typeof toggleVariants> & {
    className?: string
    children?: React.ReactNode
    spacing?: number
  }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const segmented = spacing === 0 && variant === "default"

  React.useLayoutEffect(() => {
    const group = ref.current
    if (!group || !segmented) return
    let frame = 0
    const measure = () => {
      const pressed = group.querySelectorAll<HTMLElement>(
        ":scope > [data-selected]"
      )
      const item = pressed[0]
      if (pressed.length !== 1 || !item) {
        delete group.dataset.indicator
        return
      }
      group.style.setProperty("--active-toggle-left", `${item.offsetLeft}px`)
      group.style.setProperty("--active-toggle-top", `${item.offsetTop}px`)
      group.style.setProperty("--active-toggle-width", `${item.offsetWidth}px`)
      group.style.setProperty(
        "--active-toggle-height",
        `${item.offsetHeight}px`
      )
      group.dataset.indicator = ""
      if (!("indicatorReady" in group.dataset)) {
        frame = window.requestAnimationFrame(() => {
          group.dataset.indicatorReady = ""
        })
      }
    }
    measure()
    const mutations = new MutationObserver(measure)
    mutations.observe(group, {
      subtree: true,
      childList: true,
      attributeFilter: ["data-selected"],
    })
    const resize = new ResizeObserver(measure)
    resize.observe(group)
    return () => {
      window.cancelAnimationFrame(frame)
      mutations.disconnect()
      resize.disconnect()
    }
  }, [segmented])

  return (
    <ToggleGroupPrimitive
      ref={ref}
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      orientation={orientation}
      data-horizontal={orientation === "horizontal" || undefined}
      data-vertical={orientation === "vertical" || undefined}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group relative flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-[spacing=0]:data-[variant=outline]:rounded-lg data-[spacing=0]:data-[variant=default]:rounded-xl data-[spacing=0]:data-[variant=default]:bg-secondary data-[spacing=0]:data-[variant=default]:gap-1 data-[spacing=0]:data-[variant=default]:p-1 data-vertical:flex-col data-vertical:items-stretch",
        className
      )}
      {...props}
    >
      {segmented && (
        <span
          aria-hidden
          data-slot="toggle-group-indicator"
          className="pointer-events-none absolute top-(--active-toggle-top) left-(--active-toggle-left) hidden h-(--active-toggle-height) w-(--active-toggle-width) rounded-md bg-card shadow-sm group-data-indicator/toggle-group:block group-data-indicator-ready/toggle-group:transition-[left,top,width,height] group-data-indicator-ready/toggle-group:duration-300 group-data-indicator-ready/toggle-group:ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none dark:bg-border"
        />
      )}
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: Omit<TogglePrimitiveProps, "className" | "children"> &
  VariantProps<typeof toggleVariants> & {
    className?: string
    children?: React.ReactNode
  }) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        "shrink-0 group-data-[spacing=0]/toggle-group:relative group-data-[spacing=0]/toggle-group:data-[variant=default]:active:scale-100! group-data-indicator/toggle-group:data-selected:bg-transparent! group-data-indicator/toggle-group:data-selected:shadow-none! dark:group-data-indicator/toggle-group:data-selected:bg-transparent! group-data-[spacing=0]/toggle-group:data-[variant=default]:rounded-md! group-data-[spacing=0]/toggle-group:data-[variant=default]:hover:bg-transparent group-data-[spacing=0]/toggle-group:data-[variant=default]:hover:text-muted-foreground group-data-[spacing=0]/toggle-group:data-[variant=default]:data-selected:bg-card group-data-[spacing=0]/toggle-group:data-[variant=default]:data-selected:text-card-foreground group-data-[spacing=0]/toggle-group:data-[variant=default]:data-selected:shadow-sm group-data-[spacing=0]/toggle-group:data-[variant=default]:data-selected:hover:bg-card group-data-[spacing=0]/toggle-group:data-[variant=default]:data-selected:hover:text-card-foreground dark:group-data-[spacing=0]/toggle-group:data-[variant=default]:data-selected:bg-border dark:group-data-[spacing=0]/toggle-group:data-[variant=default]:data-selected:hover:bg-border group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-3 group-data-[spacing=0]/toggle-group:shadow-none focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pe-2.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:ps-2.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-s-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-xl group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-e-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-xl group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-s-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-s group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
