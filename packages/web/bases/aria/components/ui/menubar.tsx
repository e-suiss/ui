"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"
import type * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { useModifierKey } from "@/hooks/use-platform"
import { cn } from "@/lib/utils"

function MenuPart({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function MenuPartPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function MenuPartTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function MenuPartContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "cn-menu-target cn-menu-translucent cn-dropdown-menu-content overflow-x-hidden overflow-y-auto z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) outline-none data-closed:overflow-hidden",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function MenuPartGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function MenuPartLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset ? "" : undefined}
      className={cn("cn-dropdown-menu-label", className)}
      {...props}
    />
  )
}

function MenuPartItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset ? "" : undefined}
      data-variant={variant}
      className={cn(
        "cn-dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 group/dropdown-menu-item not-data-[variant=destructive]:focus:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function MenuPartSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function MenuPartSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset ? "" : undefined}
      className={cn(
        "cn-menubar-sub-trigger flex [&_svg:not([class*='size-'])]:size-4 not-data-[variant=destructive]:focus:**:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <IconPlaceholder
        lucide="ChevronRightIcon"
        tabler="IconChevronRight"
        hugeicons="ArrowRight01Icon"
        phosphor="CaretRightIcon"
        remixicon="RiArrowRightSLine"
        className="rtl:rotate-180 ms-auto"
      />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function MenuPartSubContent({
  align = "start",
  alignOffset = -3,
  side = "inline-end",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof MenuPartContent>) {
  return (
    <MenuPartContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "cn-menu-target cn-menu-translucent cn-dropdown-menu-sub-content w-auto",
        className
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function MenuPartRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function MenuPartSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("cn-dropdown-menu-separator", className)}
      {...props}
    />
  )
}

function MenuPartShortcut({
  className,
  mod,
  children,
  ...props
}: React.ComponentProps<"span"> & { mod?: boolean }) {
  const modifier = useModifierKey(children != null)

  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("cn-dropdown-menu-shortcut", className)}
      {...props}
    >
      {mod && modifier}
      {children}
    </span>
  )
}

function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn("cn-menubar flex items-center", className)}
      {...props}
    />
  )
}

function MenubarMenu({ ...props }: React.ComponentProps<typeof MenuPart>) {
  return <MenuPart data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenuPartGroup>) {
  return <MenuPartGroup data-slot="menubar-group" {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenuPartPortal>) {
  return <MenuPartPortal data-slot="menubar-portal" {...props} />
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenuPartTrigger>) {
  return (
    <MenuPartTrigger
      data-slot="menubar-trigger"
      className={cn(
        "cn-menubar-trigger flex items-center outline-hidden select-none",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenuPartContent>) {
  return (
    <MenuPartContent
      data-slot="menubar-content"
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "cn-menu-target cn-menu-translucent cn-menubar-content cn-menubar-content-logical",
        className
      )}
      {...props}
    />
  )
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenuPartItem>) {
  return (
    <MenuPartItem
      data-slot="menubar-item"
      data-inset={inset ? "" : undefined}
      data-variant={variant}
      className={cn(
        "cn-menubar-item group/menubar-item not-data-[variant=destructive]:focus:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive!",
        className
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      data-inset={inset ? "" : undefined}
      className={cn(
        "cn-menubar-checkbox-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50 focus:**:text-accent-foreground",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute inset-s-3 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
        <MenuPrimitive.CheckboxItemIndicator>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenuPartRadioGroup>) {
  return <MenuPartRadioGroup data-slot="menubar-radio-group" {...props} />
}

function MenubarRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menubar-radio-item"
      data-inset={inset ? "" : undefined}
      className={cn(
        "cn-menubar-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 focus:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-s-3 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
        <MenuPrimitive.RadioItemIndicator>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPartLabel> & {
  inset?: boolean
}) {
  return (
    <MenuPartLabel
      data-slot="menubar-label"
      data-inset={inset ? "" : undefined}
      className={cn("cn-menubar-label", className)}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPartSeparator>) {
  return (
    <MenuPartSeparator
      data-slot="menubar-separator"
      className={cn("cn-menubar-separator -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<typeof MenuPartShortcut>) {
  return (
    <MenuPartShortcut
      data-slot="menubar-shortcut"
      className={cn("cn-menubar-shortcut", className)}
      {...props}
    />
  )
}

function MenubarSub({ ...props }: React.ComponentProps<typeof MenuPartSub>) {
  return <MenuPartSub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPartSubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenuPartSubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset ? "" : undefined}
      className={cn(
        "cn-menubar-sub-trigger flex [&_svg:not([class*='size-'])]:size-4 not-data-[variant=destructive]:focus:**:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPartSubContent>) {
  return (
    <MenuPartSubContent
      data-slot="menubar-sub-content"
      className={cn(
        "cn-menu-target cn-menu-translucent cn-menubar-sub-content",
        className
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
}
