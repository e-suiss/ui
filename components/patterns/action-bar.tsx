"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { CaretRightIcon, DotsThreeIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"

import {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetTitle,
} from "@/components/ui/alert-sheet"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { useIsMobile } from "@/hooks/use-mobile"

type ActionBarContextProps = {
  isMobile: boolean
  dismissible: boolean
  cancelLabel: string
  active: number | null
  showMenu: (index: number) => void
  hideMenu: () => void
}

type ActionBarMenuContextProps = {
  index: number
  part: "row" | "sheet"
  onOpen?: () => void
}

const ActionBarMenuContext =
  React.createContext<ActionBarMenuContextProps | null>(null)

const ActionBarContext = React.createContext<ActionBarContextProps | null>(null)

function useActionBar() {
  const context = React.useContext(ActionBarContext)

  if (!context) {
    throw new Error("useActionBar must be used within an <ActionBar />")
  }

  return context
}

function ActionBar({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  dismissible = true,
  floating,
  moreLabel = "More actions",
  cancelLabel = "Cancel",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  dismissible?: boolean
  floating?: boolean
  moreLabel?: string
  cancelLabel?: string
}) {
  const isMobile = useIsMobile()
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const [active, setActive] = React.useState<number | null>(null)

  const contextValue = React.useMemo<ActionBarContextProps>(
    () => ({
      isMobile,
      dismissible,
      cancelLabel,
      active,
      showMenu: (index) => {
        setOpen(false)
        setActive(index)
      },
      hideMenu: () => setActive(null),
    }),
    [isMobile, dismissible, cancelLabel, active, setOpen]
  )

  const menus = (part: ActionBarMenuContextProps["part"]) =>
    React.Children.map(children, (child, index) => (
      <ActionBarMenuContext.Provider value={{ index, part }}>
        {child}
      </ActionBarMenuContext.Provider>
    ))

  if (!isMobile) {
    return (
      <ActionBarContext.Provider value={contextValue}>
        <Menubar data-slot="action-bar" className={className} {...props}>
          {children}
        </Menubar>
      </ActionBarContext.Provider>
    )
  }

  return (
    <ActionBarContext.Provider value={contextValue}>
      <div
        data-slot="action-bar"
        className={cn("flex items-center justify-end", className)}
        {...props}
      >
        <Drawer
          open={open}
          onOpenChange={(next) => setOpen(next)}
          floating={floating}
        >
          <DrawerTrigger
            data-slot="action-bar-more"
            aria-label={moreLabel}
            render={<Button variant="ghost" size="icon" />}
          >
            <DotsThreeIcon weight="bold" />
          </DrawerTrigger>
          <DrawerContent
            data-slot="action-bar-content"
            className={cn(!floating && "rounded-t-none")}
          >
            <DrawerHeader className="sr-only">
              <DrawerTitle>{moreLabel}</DrawerTitle>
            </DrawerHeader>
            <div className="m-4 mb-[max(--spacing(4),env(safe-area-inset-bottom))] overflow-hidden rounded-2xl bg-surface-secondary">
              {menus("row")}
            </div>
          </DrawerContent>
        </Drawer>
        {menus("sheet")}
      </div>
    </ActionBarContext.Provider>
  )
}

function ActionBarMenu({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: Pick<React.ComponentProps<typeof MenubarMenu>, "open" | "defaultOpen"> & {
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}) {
  const { isMobile, dismissible, active, showMenu, hideMenu } = useActionBar()
  const menu = React.useContext(ActionBarMenuContext)
  const sheet = isMobile && menu?.part === "sheet"
  const openedByDefault = React.useRef(false)

  React.useEffect(() => {
    if (!sheet || !menu || !defaultOpen || openedByDefault.current) return
    openedByDefault.current = true
    showMenu(menu.index)
  }, [sheet, menu, defaultOpen, showMenu])

  if (isMobile && menu?.part === "row") {
    return (
      <ActionBarMenuContext.Provider
        value={{ ...menu, onOpen: () => onOpenChange?.(true) }}
      >
        <div data-slot="action-bar-menu" className="ms-4 not-first:border-t">
          {children}
        </div>
      </ActionBarMenuContext.Provider>
    )
  }

  if (isMobile && menu) {
    return (
      <AlertSheet
        open={open ?? active === menu.index}
        onOpenChange={(next) => {
          if (!next) hideMenu()
          onOpenChange?.(next)
        }}
        dismissible={dismissible}
      >
        {children}
      </AlertSheet>
    )
  }

  return (
    <MenubarMenu
      data-slot="action-bar-menu"
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(next) => onOpenChange?.(next)}
    >
      {children}
    </MenubarMenu>
  )
}

function ActionBarTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isMobile, showMenu } = useActionBar()
  const menu = React.useContext(ActionBarMenuContext)

  if (isMobile && menu?.part === "sheet") return null

  if (isMobile && menu) {
    return (
      <button
        type="button"
        data-slot="action-bar-trigger"
        aria-haspopup="dialog"
        className={cn(
          "relative flex min-h-11 w-full cursor-pointer items-center justify-between gap-6 py-2.75 pe-4 text-start text-base outline-none after:absolute after:-inset-s-2 after:inset-e-2 after:top-2 after:h-[calc(100%-1rem)] after:rounded-md focus-visible:after:focus-ring disabled:pointer-events-none disabled:text-label-quaternary",
          className
        )}
        {...mergeProps<"button">(props, {
          onClick: () => {
            showMenu(menu.index)
            menu.onOpen?.()
          },
        })}
      >
        {children}
        <CaretRightIcon className="pointer-events-none size-4 shrink-0 text-label-secondary rtl:rotate-180" />
      </button>
    )
  }

  return (
    <MenubarTrigger
      data-slot="action-bar-trigger"
      className={className}
      {...props}
    >
      {children}
    </MenubarTrigger>
  )
}

function ActionBarContent({
  align,
  alignOffset,
  side,
  sideOffset,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> &
  Pick<
    React.ComponentProps<typeof MenubarContent>,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const { isMobile, cancelLabel } = useActionBar()
  const menu = React.useContext(ActionBarMenuContext)

  if (isMobile && menu?.part === "row") return null

  if (isMobile) {
    return (
      <AlertSheetContent
        data-slot="action-bar-content"
        className={className}
        {...props}
      >
        <AlertSheetGroup>{children}</AlertSheetGroup>
        <AlertSheetCancel>{cancelLabel}</AlertSheetCancel>
      </AlertSheetContent>
    )
  }

  return (
    <MenubarContent
      data-slot="action-bar-content"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      className={className}
      {...props}
    >
      {children}
    </MenubarContent>
  )
}

function ActionBarLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { isMobile } = useActionBar()

  if (isMobile) {
    return (
      <AlertSheetHeader data-slot="action-bar-label">
        <AlertSheetTitle className={className} {...props}>
          {children}
        </AlertSheetTitle>
      </AlertSheetHeader>
    )
  }

  return (
    <MenubarGroup>
      <MenubarLabel
        data-slot="action-bar-label"
        className={className}
        {...props}
      >
        {children}
      </MenubarLabel>
    </MenubarGroup>
  )
}

function ActionBarItem({
  variant,
  disabled,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  variant?: "default" | "destructive"
  disabled?: boolean
}) {
  const { isMobile } = useActionBar()

  if (isMobile) {
    return (
      <AlertSheetAction
        data-slot="action-bar-item"
        variant={variant}
        disabled={disabled}
        {...props}
      />
    )
  }

  return (
    <MenubarItem
      data-slot="action-bar-item"
      variant={variant}
      disabled={disabled}
      {...props}
    />
  )
}

function ActionBarSeparator(props: React.HTMLAttributes<HTMLElement>) {
  const { isMobile } = useActionBar()

  if (isMobile) return null

  return <MenubarSeparator data-slot="action-bar-separator" {...props} />
}

function ActionBarShortcut(
  props: React.ComponentProps<typeof MenubarShortcut>
) {
  const { isMobile } = useActionBar()

  if (isMobile) return null

  return <MenubarShortcut data-slot="action-bar-shortcut" {...props} />
}

export {
  ActionBar,
  ActionBarContent,
  ActionBarItem,
  ActionBarLabel,
  ActionBarMenu,
  ActionBarSeparator,
  ActionBarShortcut,
  ActionBarTrigger,
}
