import { cn } from "cn"
import { CaretRightIcon, DotsThreeIcon } from "phosphor-react-native"
import * as React from "react"
import { I18nManager, Pressable, View, type ViewProps } from "react-native"
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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Icon } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

type ActionBarContextProps = {
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

const ActionBarContext = React.createContext<ActionBarContextProps | null>(null)

const ActionBarMenuContext =
  React.createContext<ActionBarMenuContextProps | null>(null)

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
}: ViewProps & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  dismissible?: boolean
  floating?: boolean
  moreLabel?: string
  cancelLabel?: string
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const [active, setActive] = React.useState<number | null>(null)

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const contextValue = React.useMemo<ActionBarContextProps>(
    () => ({
      dismissible,
      cancelLabel,
      active,
      showMenu: (index) => {
        setOpen(false)
        setActive(index)
      },
      hideMenu: () => setActive(null),
    }),
    [dismissible, cancelLabel, active, setOpen]
  )

  const menus = (part: ActionBarMenuContextProps["part"]) =>
    React.Children.map(children, (child, index) => (
      <ActionBarMenuContext.Provider value={{ index, part }}>
        {child}
      </ActionBarMenuContext.Provider>
    ))

  return (
    <ActionBarContext.Provider value={contextValue}>
      <View
        className={cn("flex-row items-center justify-end", className)}
        {...props}
      >
        <Drawer open={open} onOpenChange={setOpen} floating={floating}>
          <DrawerTrigger
            accessibilityLabel={moreLabel}
            render={<Button variant="ghost" size="icon" />}
          >
            <Icon as={DotsThreeIcon} weight="bold" />
          </DrawerTrigger>
          <DrawerContent
            accessibilityLabel={moreLabel}
            className={cn(!floating && "rounded-t-none")}
          >
            <ActionBarContext.Provider value={contextValue}>
              <View className="m-4 overflow-hidden rounded-2xl bg-muted">
                {menus("row")}
              </View>
            </ActionBarContext.Provider>
          </DrawerContent>
        </Drawer>
        {menus("sheet")}
      </View>
    </ActionBarContext.Provider>
  )
}

function ActionBarMenu({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}) {
  const { dismissible, active, showMenu, hideMenu } = useActionBar()
  const menu = React.useContext(ActionBarMenuContext)
  const sheet = menu?.part === "sheet"
  const openedByDefault = React.useRef(false)

  React.useEffect(() => {
    if (!sheet || !menu || !defaultOpen || openedByDefault.current) return
    openedByDefault.current = true
    showMenu(menu.index)
  }, [sheet, menu, defaultOpen, showMenu])

  if (!menu) return null

  if (menu.part === "row") {
    return (
      <ActionBarMenuContext.Provider
        value={{ ...menu, onOpen: () => onOpenChange?.(true) }}
      >
        <View
          className={cn("ms-4", menu.index > 0 && "border-t border-border")}
        >
          {children}
        </View>
      </ActionBarMenuContext.Provider>
    )
  }

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

function ActionBarTrigger({
  className,
  disabled,
  children,
  onPress,
  accessibilityState,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children"> & {
  children?: React.ReactNode
}) {
  const { showMenu } = useActionBar()
  const menu = React.useContext(ActionBarMenuContext)

  if (!menu || menu.part === "sheet") return null

  return (
    <TextClassContext.Provider
      value={cn("text-base", disabled && "opacity-50")}
    >
      <Pressable
        role="button"
        disabled={disabled}
        accessibilityState={{
          ...accessibilityState,
          disabled: Boolean(disabled),
        }}
        onPress={(event) => {
          onPress?.(event)
          showMenu(menu.index)
          menu.onOpen?.()
        }}
        className={cn(
          "min-h-11 w-full flex-row items-center justify-between gap-6 py-2.75 pe-4",
          className
        )}
        {...props}
      >
        {typeof children === "string" || typeof children === "number" ? (
          <Text className="flex-1">{children}</Text>
        ) : (
          children
        )}
        <Icon
          as={CaretRightIcon}
          className={cn(
            "size-4 shrink-0 text-muted-foreground",
            I18nManager.isRTL && "rotate-180"
          )}
        />
      </Pressable>
    </TextClassContext.Provider>
  )
}

function ActionBarContent({
  children,
  ...props
}: React.ComponentProps<typeof AlertSheetContent>) {
  const { cancelLabel } = useActionBar()
  const menu = React.useContext(ActionBarMenuContext)

  if (menu?.part === "row") return null

  return (
    <AlertSheetContent {...props}>
      <AlertSheetGroup>{children}</AlertSheetGroup>
      <AlertSheetCancel>{cancelLabel}</AlertSheetCancel>
    </AlertSheetContent>
  )
}

function ActionBarLabel(props: React.ComponentProps<typeof AlertSheetTitle>) {
  return (
    <AlertSheetHeader>
      <AlertSheetTitle {...props} />
    </AlertSheetHeader>
  )
}

function ActionBarItem(props: React.ComponentProps<typeof AlertSheetAction>) {
  return <AlertSheetAction {...props} />
}

function ActionBarSeparator(_props: { className?: string }) {
  return null
}

export {
  ActionBar,
  ActionBarContent,
  ActionBarItem,
  ActionBarLabel,
  ActionBarMenu,
  ActionBarSeparator,
  ActionBarTrigger,
}
