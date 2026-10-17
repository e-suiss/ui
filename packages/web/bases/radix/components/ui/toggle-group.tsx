"use client"

import type { VariantProps } from "class-variance-authority"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import * as React from "react"
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
  ref: forwardedRef,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
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
        ":scope > [data-state=on]"
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
      attributeFilter: ["data-state"],
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
    <ToggleGroupPrimitive.Root
      ref={(node) => {
        ref.current = node
        if (typeof forwardedRef === "function") return forwardedRef(node)
        if (forwardedRef) forwardedRef.current = node
      }}
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      orientation={orientation}
      data-orientation={orientation}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "cn-toggle-group group/toggle-group flex w-fit flex-row items-center data-vertical:flex-col data-vertical:items-stretch",
        className
      )}
      {...props}
    >
      {segmented && (
        <span
          aria-hidden
          data-slot="toggle-group-indicator"
          className="cn-toggle-group-indicator"
        />
      )}
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        "cn-toggle-group-item shrink-0 focus:z-10 focus-visible:z-10 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
