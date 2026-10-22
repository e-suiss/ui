"use client"

import { ContextMenu as ContextMenuPrimitive } from "radix-ui"
import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { useModifierKey } from "@/hooks/use-platform"
import { cn } from "@/lib/utils"

const ContextMenuGroupContext = React.createContext<
  ((id: string | undefined) => void) | undefined
>(undefined)

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn("cn-context-menu-trigger select-none", className)}
      {...props}
    />
  )
}

function ContextMenuContent({
  className,
  alignOffset = 4,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        alignOffset={alignOffset}
        className={cn(
          "cn-menu-target cn-menu-translucent cn-context-menu-content outline-none z-50 max-h-(--radix-context-menu-content-available-height) origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  const [labelId, setLabelId] = React.useState<string>()

  return (
    <ContextMenuGroupContext.Provider value={setLabelId}>
      <ContextMenuPrimitive.Group
        data-slot="context-menu-group"
        aria-labelledby={labelId}
        {...props}
      />
    </ContextMenuGroupContext.Provider>
  )
}

function ContextMenuLabel({
  className,
  inset,
  id,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}) {
  const generatedId = React.useId()
  const labelId = id ?? generatedId
  const setLabelId = React.useContext(ContextMenuGroupContext)

  React.useLayoutEffect(() => {
    setLabelId?.(labelId)
    return () => setLabelId?.(undefined)
  }, [labelId, setLabelId])

  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      id={labelId}
      data-inset={inset ? "" : undefined}
      className={cn("cn-context-menu-label", className)}
      {...props}
    />
  )
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  disabled,
  onClick,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset ? "" : undefined}
      data-variant={variant}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "cn-context-menu-item group/context-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset ? "" : undefined}
      className={cn(
        "cn-context-menu-sub-trigger flex cursor-default items-center outline-hidden select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
    </ContextMenuPrimitive.SubTrigger>
  )
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.SubContent
        data-slot="context-menu-sub-content"
        className={cn(
          "cn-menu-target cn-menu-translucent cn-context-menu-sub-content overflow-x-hidden overflow-y-auto z-50 origin-(--radix-context-menu-content-transform-origin)",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  defaultChecked,
  onCheckedChange,
  inset,
  closeOnClick = false,
  disabled,
  onClick,
  onSelect,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> & {
  inset?: boolean
  closeOnClick?: boolean
  defaultChecked?: boolean
}) {
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultChecked ?? false
  )

  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset ? "" : undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onSelect={(event) => {
        onSelect?.(event)
        if (!closeOnClick) event.preventDefault()
      }}
      className={cn(
        "cn-context-menu-checkbox-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked ?? uncontrolled}
      onCheckedChange={(next) => {
        setUncontrolled(next)
        onCheckedChange?.(next)
      }}
      {...props}
    >
      <span className="pointer-events-none absolute inset-e-2">
        <ContextMenuPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

function ContextMenuRadioGroup({
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup> & {
  defaultValue?: string
}) {
  const [labelId, setLabelId] = React.useState<string>()
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)

  return (
    <ContextMenuGroupContext.Provider value={setLabelId}>
      <ContextMenuPrimitive.RadioGroup
        data-slot="context-menu-radio-group"
        aria-labelledby={labelId}
        value={value ?? uncontrolled}
        onValueChange={(next) => {
          setUncontrolled(next)
          onValueChange?.(next)
        }}
        {...props}
      />
    </ContextMenuGroupContext.Provider>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  closeOnClick = false,
  disabled,
  onClick,
  onSelect,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> & {
  inset?: boolean
  closeOnClick?: boolean
}) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset ? "" : undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onSelect={(event) => {
        onSelect?.(event)
        if (!closeOnClick) event.preventDefault()
      }}
      className={cn(
        "cn-context-menu-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-e-2">
        <ContextMenuPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("cn-context-menu-separator", className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  mod,
  children,
  ...props
}: React.ComponentProps<"span"> & { mod?: boolean }) {
  const modifier = useModifierKey(children != null)

  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn("cn-context-menu-shortcut", className)}
      {...props}
    >
      {mod && modifier}
      {children}
    </span>
  )
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
