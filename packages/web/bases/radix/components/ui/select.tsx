"use client"

import { Select as SelectPrimitive } from "radix-ui"
import type * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function trackHighlight(list: HTMLDivElement | null) {
  const indicator = list?.querySelector<HTMLElement>(
    "[data-slot=select-highlight]"
  )
  if (!list || !indicator) return
  const update = () => {
    const item = list.querySelector<HTMLElement>(
      "[data-slot=select-item][data-highlighted]"
    )
    if (!item) {
      delete indicator.dataset.visible
      return
    }
    const instant = !("visible" in indicator.dataset)
    if (instant) indicator.dataset.instant = ""
    indicator.style.top = `${item.offsetTop}px`
    indicator.style.left = `${item.offsetLeft}px`
    indicator.style.width = `${item.offsetWidth}px`
    indicator.style.height = `${item.offsetHeight}px`
    indicator.dataset.visible = ""
    if (instant) {
      void indicator.offsetHeight
      delete indicator.dataset.instant
    }
  }
  update()
  const observer = new MutationObserver(update)
  observer.observe(list, {
    subtree: true,
    attributeFilter: ["data-highlighted"],
  })
  return () => observer.disconnect()
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("cn-select-group", className)}
      {...props}
    />
  )
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("cn-select-value", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "cn-select-trigger flex items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0 disabled:opacity-50 *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <IconPlaceholder
          lucide="ChevronsUpDownIcon"
          tabler="IconSelector"
          hugeicons="UnfoldMoreIcon"
          phosphor="CaretUpDownIcon"
          remixicon="RiExpandUpDownLine"
          className="pointer-events-none size-4 text-muted-foreground"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        position={position}
        side={position === "popper" ? side : undefined}
        sideOffset={position === "popper" ? sideOffset : undefined}
        align={position === "popper" ? align : undefined}
        alignOffset={position === "popper" ? alignOffset : undefined}
        className={cn(
          "cn-menu-target cn-menu-translucent cn-select-content relative z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none",
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          ref={trackHighlight}
          data-position={position}
          className="relative data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)"
        >
          <span
            aria-hidden="true"
            data-slot="select-highlight"
            className="cn-select-highlight"
          />
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("cn-select-label", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "cn-select-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50 not-data-[variant=destructive]:focus:**:text-foreground [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-e-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
            className="pointer-events-none text-primary! **:text-primary!"
          />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("cn-select-separator pointer-events-none", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "cn-select-scroll-up-button [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <IconPlaceholder
        lucide="ChevronUpIcon"
        tabler="IconChevronUp"
        hugeicons="ArrowUp01Icon"
        phosphor="CaretUpIcon"
        remixicon="RiArrowUpSLine"
      />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "cn-select-scroll-down-button [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <IconPlaceholder
        lucide="ChevronDownIcon"
        tabler="IconChevronDown"
        hugeicons="ArrowDown01Icon"
        phosphor="CaretDownIcon"
        remixicon="RiArrowDownSLine"
      />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
