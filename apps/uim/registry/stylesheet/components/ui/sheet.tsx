import { XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutLeft,
  FadeOutRight,
  FadeOutUp,
  ReduceMotion,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as DrawerPrimitive from "@/components/primitives/drawer"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

type SheetSide = "top" | "right" | "bottom" | "left"

const SWIPE_DIRECTION: Record<SheetSide, DrawerPrimitive.SwipeDirection> = {
  top: "up",
  right: "right",
  bottom: "down",
  left: "left",
}

const ENTERING = {
  top: FadeInUp,
  right: FadeInRight,
  bottom: FadeInDown,
  left: FadeInLeft,
} as const

const EXITING = {
  top: FadeOutUp,
  right: FadeOutRight,
  bottom: FadeOutDown,
  left: FadeOutLeft,
} as const

const POSITION: Record<SheetSide, ViewStyle> = {
  top: { top: 8, left: 8, right: 8 },
  right: { top: 8, bottom: 8, right: 8, width: "75%" },
  bottom: { bottom: 8, left: 8, right: 8 },
  left: { top: 8, bottom: 8, left: 8, width: "75%" },
}

const DURATION = 400

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFill, zIndex: 50, pointerEvents: "box-none" },
  fill: { ...StyleSheet.absoluteFill },
  frame: { position: "absolute", zIndex: 50 },
  popup: {
    display: "flex",
    flexDirection: "column",
    borderRadius: radius["3xl"],
    ...shadow.xl,
  },
  popupFill: { flex: 1 },
  close: { position: "absolute", top: 19, right: 16 },
  closeIcon: { flexShrink: 0 },
  closeLabel: { ...fontSize.base },
  header: { display: "flex", flexDirection: "column", gap: 6, padding: 24 },
  footer: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 24,
  },
  title: { ...fontSize.base, fontWeight: "600" },
  description: { ...fontSize.sm },
})

const SheetSideContext = React.createContext<
  ((side: SheetSide) => void) | null
>(null)

const SheetCloseContext = React.createContext({
  hasCloseButton: false,
  hasCloseLabel: false,
})

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function Sheet({
  children,
  ...props
}: Omit<
  DrawerPrimitive.RootProps,
  | "swipeDirection"
  | "snapPoints"
  | "snapPoint"
  | "defaultSnapPoint"
  | "onSnapPointChange"
  | "snapToSequentialPoints"
>) {
  const [side, setSide] = React.useState<SheetSide>("right")
  return (
    <SheetSideContext.Provider value={setSide}>
      <DrawerPrimitive.Root swipeDirection={SWIPE_DIRECTION[side]} {...props}>
        {children}
      </DrawerPrimitive.Root>
    </SheetSideContext.Provider>
  )
}

const SheetTrigger = DrawerPrimitive.Trigger

const SheetClose = DrawerPrimitive.Close

const SheetPortal = DrawerPrimitive.Portal

function SheetOverlay({
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Backdrop>) {
  const { colors } = useTheme()
  return (
    <AnimatedView
      entering={FadeIn.duration(DURATION).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(DURATION).reduceMotion(ReduceMotion.System)}
      style={styles.layer}
    >
      <DrawerPrimitive.Backdrop
        style={(state) => [
          styles.fill,
          { backgroundColor: colors.scrim },
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      />
    </AnimatedView>
  )
}

function SheetContent({
  style,
  children,
  portalHost,
  side = "right",
  showCloseButton = true,
  closeLabel,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Popup> & {
  portalHost?: string
  side?: SheetSide
  showCloseButton?: boolean
  closeLabel?: string
}) {
  const { colors } = useTheme()
  const setSide = React.useContext(SheetSideContext)
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const horizontal = side === "left" || side === "right"

  React.useLayoutEffect(() => {
    setSide?.(side)
  }, [setSide, side])

  const frameStyle = React.useMemo<ViewStyle>(
    () => ({
      ...POSITION[side],
      maxWidth: horizontal && width >= 640 ? 384 : undefined,
      pointerEvents: "box-none",
      marginTop: side === "bottom" ? 0 : insets.top,
      marginBottom: side === "top" ? 0 : insets.bottom,
      marginLeft: side === "right" ? 0 : insets.left,
      marginRight: side === "left" ? 0 : insets.right,
    }),
    [side, horizontal, width, insets]
  )

  const closeContext = React.useMemo(
    () => ({
      hasCloseButton: showCloseButton,
      hasCloseLabel: showCloseButton && closeLabel !== undefined,
    }),
    [showCloseButton, closeLabel]
  )

  return (
    <SheetPortal hostName={portalHost}>
      <FullWindowOverlay>
        <SheetOverlay />
        <DrawerPrimitive.Viewport style={styles.layer}>
          <AnimatedView
            entering={ENTERING[side]
              .duration(DURATION)
              .reduceMotion(ReduceMotion.System)}
            exiting={EXITING[side]
              .duration(DURATION)
              .reduceMotion(ReduceMotion.System)}
            style={[styles.frame, frameStyle]}
          >
            <DrawerPrimitive.Popup
              style={(state) => [
                styles.popup,
                { backgroundColor: colors.surfaceRaised },
                horizontal && styles.popupFill,
                typeof style === "function" ? style(state) : style,
              ]}
              {...props}
            >
              <SheetCloseContext.Provider value={closeContext}>
                {children}
              </SheetCloseContext.Provider>
              {showCloseButton ? (
                <DrawerPrimitive.Close
                  render={
                    <Button
                      variant={closeLabel ? "plain" : "ghost"}
                      size={closeLabel ? "sm" : "icon-sm"}
                      style={({ pressed }) => [
                        styles.close,
                        !closeLabel && {
                          backgroundColor: pressed
                            ? colors.separator
                            : colors.surfaceTertiary,
                        },
                      ]}
                    />
                  }
                  hitSlop={8}
                  accessibilityLabel={closeLabel ? undefined : "Close"}
                >
                  {closeLabel ? (
                    <Text style={styles.closeLabel}>{closeLabel}</Text>
                  ) : (
                    <Icon
                      as={XIcon}
                      size={16}
                      color={colors.label}
                      style={styles.closeIcon}
                    />
                  )}
                </DrawerPrimitive.Close>
              ) : null}
            </DrawerPrimitive.Popup>
          </AnimatedView>
        </DrawerPrimitive.Viewport>
      </FullWindowOverlay>
    </SheetPortal>
  )
}

function SheetHeader({ style, ...props }: ViewProps) {
  const { hasCloseButton, hasCloseLabel } = React.useContext(SheetCloseContext)
  return (
    <View
      style={[
        styles.header,
        hasCloseButton && { paddingRight: hasCloseLabel ? 96 : 56 },
        style,
      ]}
      {...props}
    />
  )
}

function SheetFooter({ style, ...props }: ViewProps) {
  return <View style={[styles.footer, style]} {...props} />
}

function SheetTitle({
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  const { colors } = useTheme()
  return (
    <DrawerPrimitive.Title
      style={(state) => [
        styles.title,
        { color: colors.label },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function SheetDescription({
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  const { colors } = useTheme()
  return (
    <DrawerPrimitive.Description
      style={(state) => [
        styles.description,
        { color: colors.labelSecondary },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}
