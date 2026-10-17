"use client"

import { Menubar as MenubarPrimitive } from "radix-ui"
import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const MenubarGroupContext = React.createContext<
  ((id: string | undefined) => void) | undefined
>(undefined)

const MenubarContext = React.createContext<{
  value: string
  setValue?: (value: string) => void
  disabled?: boolean
}>({ value: "" })

function Menubar({
  className,
  value,
  defaultValue,
  onValueChange,
  disabled,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root> & {
  disabled?: boolean
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "")
  const current = value ?? uncontrolled
  const setValue = React.useCallback(
    (next: string) => {
      setUncontrolled(next)
      onValueChange?.(next)
    },
    [onValueChange]
  )

  return (
    <MenubarContext.Provider value={{ value: current, setValue, disabled }}>
      <MenubarPrimitive.Root
        data-slot="menubar"
        data-disabled={disabled ? "" : undefined}
        value={current}
        onValueChange={setValue}
        className={cn("cn-menubar flex items-center", className)}
        {...props}
      />
    </MenubarContext.Provider>
  )
}

function MenubarMenu({
  value,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const generatedValue = React.useId()
  const menuValue = value ?? generatedValue
  const menubar = React.useContext(MenubarContext)
  const isOpen = menubar.value === menuValue
  const wasOpen = React.useRef(isOpen)
  const openedByDefault = React.useRef(false)

  React.useLayoutEffect(() => {
    if (!defaultOpen || openedByDefault.current) return
    openedByDefault.current = true
    menubar.setValue?.(menuValue)
  }, [defaultOpen, menubar, menuValue])

  React.useEffect(() => {
    if (open === undefined) return
    if (open && !isOpen) menubar.setValue?.(menuValue)
    if (!open && isOpen) menubar.setValue?.("")
  }, [open])

  React.useEffect(() => {
    if (wasOpen.current === isOpen) return
    wasOpen.current = isOpen
    onOpenChange?.(isOpen)
  }, [isOpen, onOpenChange])

  return (
    <MenubarPrimitive.Menu
      data-slot="menubar-menu"
      value={menuValue}
      {...props}
    />
  )
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  const [labelId, setLabelId] = React.useState<string>()

  return (
    <MenubarGroupContext.Provider value={setLabelId}>
      <MenubarPrimitive.Group
        data-slot="menubar-group"
        aria-labelledby={labelId}
        {...props}
      />
    </MenubarGroupContext.Provider>
  )
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

function MenubarTrigger({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  const menubar = React.useContext(MenubarContext)

  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      disabled={disabled ?? menubar.disabled}
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
  side = "bottom",
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  const menubar = React.useContext(MenubarContext)

  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        data-instant={menubar.value === "" ? undefined : "group"}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "cn-menu-target cn-menu-translucent cn-menubar-content z-50 origin-(--radix-menubar-content-transform-origin)",
          "cn-menu-target cn-menu-translucent min-w-48 rounded-xl bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[instant=group]:data-closed:animate-none",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  disabled,
  onClick,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset ? "" : undefined}
      data-variant={variant}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "cn-menubar-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 group/menubar-item group/dropdown-menu-item not-data-[variant=destructive]:focus:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive! data-[variant=destructive]:*:[svg]:text-destructive",
        "group/menubar-item gap-2.5 rounded-md px-3 py-2 text-base focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:ps-9.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive! data-disabled:opacity-50",
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
  defaultChecked,
  onCheckedChange,
  inset,
  closeOnClick = false,
  disabled,
  onClick,
  onSelect,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> & {
  inset?: boolean
  closeOnClick?: boolean
  defaultChecked?: boolean
}) {
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultChecked ?? false
  )

  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      data-inset={inset ? "" : undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onSelect={(event) => {
        onSelect?.(event)
        if (!closeOnClick) event.preventDefault()
      }}
      className={cn(
        "cn-menubar-checkbox-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 focus:**:text-accent-foreground",
        className
      )}
      checked={checked ?? uncontrolled}
      onCheckedChange={(next) => {
        setUncontrolled(next)
        onCheckedChange?.(next)
      }}
      {...props}
    >
      <span className="pointer-events-none absolute inset-s-3 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
        <MenubarPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioGroup({
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup> & {
  defaultValue?: string
}) {
  const [labelId, setLabelId] = React.useState<string>()
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)

  return (
    <MenubarGroupContext.Provider value={setLabelId}>
      <MenubarPrimitive.RadioGroup
        data-slot="menubar-radio-group"
        aria-labelledby={labelId}
        value={value ?? uncontrolled}
        onValueChange={(next) => {
          setUncontrolled(next)
          onValueChange?.(next)
        }}
        {...props}
      />
    </MenubarGroupContext.Provider>
  )
}

function MenubarRadioItem({
  className,
  children,
  inset,
  closeOnClick = false,
  disabled,
  onClick,
  onSelect,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem> & {
  inset?: boolean
  closeOnClick?: boolean
}) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      data-inset={inset ? "" : undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onSelect={(event) => {
        onSelect?.(event)
        if (!closeOnClick) event.preventDefault()
      }}
      className={cn(
        "cn-menubar-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 focus:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-s-3 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
        <MenubarPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  id,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  const generatedId = React.useId()
  const labelId = id ?? generatedId
  const setLabelId = React.useContext(MenubarGroupContext)

  React.useLayoutEffect(() => {
    setLabelId?.(labelId)
    return () => setLabelId?.(undefined)
  }, [labelId, setLabelId])

  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      id={labelId}
      data-inset={inset ? "" : undefined}
      className={cn(
        "cn-menubar-label",
        "px-3.5 py-2.5 text-xs text-muted-foreground data-inset:ps-9.5",
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn(
        "cn-menubar-separator h-px",
        "-mx-1 my-1 h-px bg-border/50",
        className
      )}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return (
    <DropdownMenuShortcut
      data-slot="menubar-shortcut"
      className={cn("cn-menubar-shortcut", className)}
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset ? "" : undefined}
      className={cn(
        "cn-menubar-sub-trigger flex cursor-default items-center select-none [&_svg:not([class*='size-'])]:size-4 not-data-[variant=destructive]:focus:**:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "gap-2 rounded-md px-3 py-2 text-base focus:bg-accent focus:text-accent-foreground data-inset:ps-9.5 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='size-'])]:size-4",
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
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({
  alignOffset = -3,
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.SubContent
        data-slot="menubar-sub-content"
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "cn-menu-target cn-menu-translucent cn-menubar-sub-content z-50 origin-(--radix-menubar-content-transform-origin)",
          "cn-menu-target cn-menu-translucent min-w-32 rounded-xl bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
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
