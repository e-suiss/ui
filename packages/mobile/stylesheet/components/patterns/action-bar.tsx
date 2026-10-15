import { CaretRightIcon, DotsThreeIcon } from "phosphor-react-native"
import * as React from "react"
import {
  I18nManager,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
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
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

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

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  docked: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  rows: { margin: 16, overflow: "hidden", borderRadius: radius["2xl"] },
  row: { marginStart: 16 },
  trigger: {
    minHeight: 44,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    paddingVertical: 11,
    paddingEnd: 16,
  },
  triggerText: { flex: 1 },
})

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
  style,
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
  const { colors } = useTheme()
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
      <View style={[styles.root, style]} {...props}>
        <Drawer open={open} onOpenChange={setOpen} floating={floating}>
          <DrawerTrigger
            accessibilityLabel={moreLabel}
            render={<Button variant="ghost" size="icon" />}
          >
            <Icon as={DotsThreeIcon} weight="bold" />
          </DrawerTrigger>
          <DrawerContent
            accessibilityLabel={moreLabel}
            style={floating ? undefined : styles.docked}
          >
            <ActionBarContext.Provider value={contextValue}>
              <View style={[styles.rows, { backgroundColor: colors.muted }]}>
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
  const { colors } = useTheme()
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
          style={[
            styles.row,
            menu.index > 0 && {
              borderTopWidth: 1,
              borderTopColor: colors.border,
            },
          ]}
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
  style,
  disabled,
  children,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children"> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  const { showMenu } = useActionBar()
  const menu = React.useContext(ActionBarMenuContext)

  if (!menu || menu.part === "sheet") return null

  return (
    <TextStyleContext.Provider
      value={{
        ...fontSize.base,
        color: colors.foreground,
      }}
    >
      <Pressable
        role="button"
        disabled={disabled}
        accessibilityState={{ disabled: Boolean(disabled) }}
        onPress={(event) => {
          onPress?.(event)
          showMenu(menu.index)
          menu.onOpen?.()
        }}
        style={(state): StyleProp<ViewStyle> => [
          styles.trigger,
          disabled && { opacity: 0.5 },
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      >
        {typeof children === "string" || typeof children === "number" ? (
          <Text style={styles.triggerText}>{children}</Text>
        ) : (
          children
        )}
        <Icon
          as={CaretRightIcon}
          size={16}
          color={colors.mutedForeground}
          style={
            I18nManager.isRTL
              ? { transform: [{ rotate: "180deg" }] }
              : undefined
          }
        />
      </Pressable>
    </TextStyleContext.Provider>
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

function ActionBarSeparator(_props: { style?: StyleProp<ViewStyle> }) {
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
