"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import type { VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"

import { toggleVariants } from "@/components/ui/toggle"

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
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const segmented = spacing === 0 && variant === "default"

  React.useLayoutEffect(() => {
    const group = ref.current
    if (!group || !segmented) return
    let frame = 0
    const measure = () => {
      const pressed = group.querySelectorAll<HTMLElement>(
        ":scope > [aria-pressed=true]"
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
      attributeFilter: ["aria-pressed"],
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
      data-orientation={orientation}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group relative flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-[spacing=0]:data-[variant=outline]:rounded-lg data-[spacing=0]:data-[variant=default]:rounded-xl data-[spacing=0]:data-[variant=default]:bg-control data-[spacing=0]:data-[variant=default]:gap-1 data-[spacing=0]:data-[variant=default]:p-1 data-vertical:flex-col data-vertical:items-stretch",
        className
      )}
      {...props}
    >
      {segmented && (
        <span
          aria-hidden
          data-slot="toggle-group-indicator"
          className="pointer-events-none absolute top-(--active-toggle-top) left-(--active-toggle-left) hidden h-(--active-toggle-height) w-(--active-toggle-width) rounded-md bg-surface-raised shadow-sm group-data-indicator/toggle-group:block group-data-indicator-ready/toggle-group:transition-[left,top,width,height] group-data-indicator-ready/toggle-group:duration-300 group-data-indicator-ready/toggle-group:ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none dark:bg-label-quaternary"
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
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        "shrink-0 group-data-[spacing=0]/toggle-group:relative group-data-[spacing=0]/toggle-group:data-[variant=default]:active:scale-100! group-data-indicator/toggle-group:aria-pressed:bg-transparent! group-data-indicator/toggle-group:aria-pressed:shadow-none! dark:group-data-indicator/toggle-group:aria-pressed:bg-transparent! group-data-[spacing=0]/toggle-group:data-[variant=default]:rounded-md! group-data-[spacing=0]/toggle-group:data-[variant=default]:hover:bg-transparent group-data-[spacing=0]/toggle-group:data-[variant=default]:hover:text-label-secondary group-data-[spacing=0]/toggle-group:data-[variant=default]:aria-pressed:bg-surface-raised group-data-[spacing=0]/toggle-group:data-[variant=default]:aria-pressed:text-label group-data-[spacing=0]/toggle-group:data-[variant=default]:aria-pressed:shadow-sm group-data-[spacing=0]/toggle-group:data-[variant=default]:aria-pressed:hover:bg-surface-raised group-data-[spacing=0]/toggle-group:data-[variant=default]:aria-pressed:hover:text-label dark:group-data-[spacing=0]/toggle-group:data-[variant=default]:aria-pressed:bg-label-quaternary dark:group-data-[spacing=0]/toggle-group:data-[variant=default]:aria-pressed:hover:bg-label-quaternary group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-3 group-data-[spacing=0]/toggle-group:shadow-none focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pe-2.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:ps-2.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-s-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-xl group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-e-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-xl group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-s-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-s group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
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
