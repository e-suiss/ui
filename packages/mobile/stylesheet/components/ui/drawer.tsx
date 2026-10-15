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
  FadeOut,
  ReduceMotion,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as DrawerPrimitive from "@/components/primitives/drawer"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

type SwipeDirection = DrawerPrimitive.SwipeDirection

type DrawerContextProps = {
  floating: boolean
  hasSnapPoints: boolean
  modal: DrawerPrimitive.RootProps["modal"]
  showSwipeHandle: boolean
  swipeDirection: SwipeDirection
}

const DrawerContext = React.createContext<DrawerContextProps | null>(null)

type DrawerIndentContextProps = {
  raised: boolean
  setRaised: (raised: boolean) => void
}

const DrawerIndentContext =
  React.createContext<DrawerIndentContextProps | null>(null)

type DrawerContentContextProps = {
  hasCloseButton: boolean
  hasCloseLabel: boolean
}

const DrawerContentContext = React.createContext<DrawerContentContextProps>({
  hasCloseButton: false,
  hasCloseLabel: false,
})

function useDrawer() {
  const context = React.useContext(DrawerContext)
  if (!context) {
    throw new Error("useDrawer must be used within a Drawer.")
  }
  return context
}

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const EASE_DURATION = 450

const ENTERING = {
  down: SlideInDown,
  up: SlideInUp,
  left: SlideInLeft,
  right: SlideInRight,
} as const

const EXITING = {
  down: SlideOutDown,
  up: SlideOutUp,
  left: SlideOutLeft,
  right: SlideOutRight,
} as const

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFill },
  layer: { ...StyleSheet.absoluteFill, zIndex: 50, pointerEvents: "box-none" },
  indentBackground: { ...StyleSheet.absoluteFill, zIndex: -10 },
  indent: {
    position: "relative",
    flex: 1,
    overflow: "hidden",
    transformOrigin: "top",
  },
  frame: { position: "absolute", zIndex: 50 },
  popup: {
    display: "flex",
    minHeight: 0,
    flexDirection: "column",
    borderRadius: radius["3xl"],
    ...shadow.xl,
  },
  popupHorizontal: { flex: 1, flexDirection: "row" },
  bleed: { position: "absolute", pointerEvents: "none" },
  content: {
    display: "flex",
    minHeight: 0,
    flexShrink: 1,
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: radius["3xl"],
  },
  contentFill: { flex: 1 },
  handle: {
    position: "relative",
    zIndex: 10,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  handleVertical: { height: 12, width: "100%" },
  handleHorizontal: { height: "100%", width: 12 },
  handleBar: { flexShrink: 0, borderRadius: radius.full },
  handleBarVertical: { height: 5, width: 36 },
  handleBarHorizontal: { height: 36, width: 5 },
  close: { position: "absolute", right: 16 },
  closeIcon: { flexShrink: 0 },
  closeLabel: { ...fontSize.base },
  header: {
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",
    gap: 2,
    padding: 16,
    paddingBottom: 0,
  },
  headerCentered: { alignItems: "center" },
  footer: {
    marginTop: "auto",
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",
    gap: 8,
    padding: 16,
    paddingTop: 0,
  },
  title: { ...fontSize.base, fontWeight: "600" },
  description: { ...fontSize.sm },
  centered: { textAlign: "center" },
})

const POSITION: Record<SwipeDirection, ViewStyle> = {
  down: { bottom: 0, left: 0, right: 0 },
  up: { top: 0, left: 0, right: 0 },
  left: { top: 0, bottom: 0, left: 0, width: "75%" },
  right: { top: 0, bottom: 0, right: 0, width: "75%" },
}

const DOCKED_RADIUS: Record<SwipeDirection, ViewStyle> = {
  down: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  up: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  left: { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
  right: { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
}

const BLEED: Record<SwipeDirection, ViewStyle> = {
  down: { top: "100%", left: 0, right: 0, height: 48 },
  up: { bottom: "100%", left: 0, right: 0, height: 48 },
  left: { right: "100%", top: 0, bottom: 0, width: 48 },
  right: { left: "100%", top: 0, bottom: 0, width: 48 },
}

function DrawerProvider({ children }: DrawerPrimitive.ProviderProps) {
  const [raised, setRaised] = React.useState(false)
  const contextValue = React.useMemo(() => ({ raised, setRaised }), [raised])
  return (
    <DrawerIndentContext.Provider value={contextValue}>
      <DrawerPrimitive.Provider>{children}</DrawerPrimitive.Provider>
    </DrawerIndentContext.Provider>
  )
}

function DrawerIndentBackground({
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.IndentBackground>) {
  const { colors, isDark } = useTheme()
  return (
    <DrawerPrimitive.IndentBackground
      style={(state) => [
        styles.indentBackground,
        { backgroundColor: isDark ? colors.background : colors.foreground },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function DrawerIndent({
  style,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Indent>) {
  const { colors } = useTheme()
  const indent = React.useContext(DrawerIndentContext)
  const raised = indent?.raised ?? false
  const insets = useSafeAreaInsets()
  const offset = Math.max(insets.top, 12)

  const animatedStyle = useAnimatedStyle(() => {
    const config = {
      duration: EASE_DURATION,
      reduceMotion: ReduceMotion.System,
    }
    return {
      borderRadius: withTiming(raised ? radius["2xl"] : 0, config),
      transform: [
        { translateY: withTiming(raised ? offset : 0, config) },
        { scale: withTiming(raised ? 0.94 : 1, config) },
      ],
    }
  }, [raised, offset])

  return (
    <DrawerPrimitive.Indent
      render={<AnimatedView style={animatedStyle} />}
      style={(state) => [
        styles.indent,
        { backgroundColor: colors.background },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {children}
    </DrawerPrimitive.Indent>
  )
}

function DrawerRaise({ floating }: { floating: boolean }) {
  const indent = React.useContext(DrawerIndentContext)
  const setRaised = indent?.setRaised
  const { dialog, swipeDirection, expanded } =
    DrawerPrimitive.useDrawerRootContext("Drawer")
  const raised =
    dialog.root.open && !floating && swipeDirection === "down" && expanded

  React.useEffect(() => {
    if (!setRaised) return
    setRaised(raised)
    return () => setRaised(false)
  }, [setRaised, raised])

  return null
}

function Drawer({
  floating = false,
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = "down",
  children,
  ...props
}: DrawerPrimitive.RootProps & {
  floating?: boolean
  showSwipeHandle?: boolean
}) {
  const hasSnapPoints = snapPoints != null && snapPoints.length > 0
  const contextValue = React.useMemo(
    () => ({ floating, hasSnapPoints, modal, showSwipeHandle, swipeDirection }),
    [floating, hasSnapPoints, modal, showSwipeHandle, swipeDirection]
  )
  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        modal={modal}
        snapPoints={snapPoints}
        swipeDirection={swipeDirection}
        {...props}
      >
        <DrawerRaise floating={floating} />
        {children}
      </DrawerPrimitive.Root>
    </DrawerContext.Provider>
  )
}

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

function DrawerOverlay({
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Backdrop>) {
  return (
    <AnimatedView
      entering={FadeIn.duration(EASE_DURATION).reduceMotion(
        ReduceMotion.System
      )}
      exiting={FadeOut.duration(300).reduceMotion(ReduceMotion.System)}
      style={styles.layer}
    >
      <DrawerPrimitive.Backdrop
        style={(state) => [
          styles.fill,
          { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      />
    </AnimatedView>
  )
}

function DrawerSwipeHandle({ style, ...props }: ViewProps) {
  const { colors } = useTheme()
  const { swipeDirection } = useDrawer()
  const horizontal = swipeDirection === "left" || swipeDirection === "right"
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.handle,
        horizontal ? styles.handleHorizontal : styles.handleVertical,
        swipeDirection === "down" && { justifyContent: "flex-end" },
        swipeDirection === "up" && { justifyContent: "flex-start" },
        style,
      ]}
      {...props}
    >
      <View
        style={[
          styles.handleBar,
          horizontal ? styles.handleBarHorizontal : styles.handleBarVertical,
          { backgroundColor: colors.border },
        ]}
      />
    </View>
  )
}

function DrawerContent({
  style,
  children,
  portalHost,
  showCloseButton = false,
  closeLabel,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Popup> & {
  portalHost?: string
  showCloseButton?: boolean
  closeLabel?: string
}) {
  const { colors } = useTheme()
  const drawerContext = useDrawer()
  const { floating, hasSnapPoints, modal, showSwipeHandle, swipeDirection } =
    drawerContext
  const insets = useSafeAreaInsets()
  const { width, height } = useWindowDimensions()
  const horizontal = swipeDirection === "left" || swipeDirection === "right"
  const inset = floating ? 8 : 0
  const handleLast = swipeDirection === "up" || swipeDirection === "left"

  const frameStyle = React.useMemo<ViewStyle>(() => {
    const style: ViewStyle = {
      ...POSITION[swipeDirection],
      pointerEvents: "box-none",
    }
    if (horizontal && width >= 640) style.maxWidth = 384
    if (floating) {
      if (swipeDirection !== "down") style.top = insets.top
      if (swipeDirection !== "up") style.bottom = insets.bottom
      if (swipeDirection !== "right") style.left = insets.left
      if (swipeDirection !== "left") style.right = insets.right
    }
    return style
  }, [floating, horizontal, swipeDirection, insets, width])

  const popupStyle = React.useMemo<ViewStyle>(() => {
    const style: ViewStyle = { margin: inset }
    if (!horizontal) style.maxHeight = height - Math.max(96, insets.top + 24)
    if (floating) return style
    if (swipeDirection === "down") style.paddingBottom = insets.bottom
    else if (swipeDirection === "up") style.paddingTop = insets.top
    else {
      style.paddingTop = insets.top
      style.paddingBottom = insets.bottom
    }
    return style
  }, [floating, horizontal, swipeDirection, insets, height, inset])

  const contentContext = React.useMemo(
    () => ({
      hasCloseButton: showCloseButton,
      hasCloseLabel: showCloseButton && closeLabel !== undefined,
    }),
    [showCloseButton, closeLabel]
  )

  return (
    <DrawerPortal hostName={portalHost}>
      <DrawerContext.Provider value={drawerContext}>
        <FullWindowOverlay>
          {modal === true ? <DrawerOverlay /> : null}
          <DrawerPrimitive.Viewport style={styles.layer}>
            <AnimatedView
              entering={ENTERING[swipeDirection]
                .duration(EASE_DURATION)
                .reduceMotion(ReduceMotion.System)}
              exiting={EXITING[swipeDirection]
                .duration(300)
                .reduceMotion(ReduceMotion.System)}
              style={[styles.frame, frameStyle]}
            >
              <DrawerPrimitive.Popup
                style={(state) => [
                  styles.popup,
                  { backgroundColor: colors.popover },
                  horizontal && styles.popupHorizontal,
                  !floating && DOCKED_RADIUS[swipeDirection],
                  popupStyle,
                  typeof style === "function" ? style(state) : style,
                ]}
                {...props}
              >
                {floating ? null : (
                  <View
                    accessible={false}
                    style={[
                      styles.bleed,
                      BLEED[swipeDirection],
                      { backgroundColor: colors.popover },
                    ]}
                  />
                )}
                {showSwipeHandle && !handleLast ? <DrawerSwipeHandle /> : null}
                <DrawerContentContext.Provider value={contentContext}>
                  <DrawerPrimitive.Content
                    style={[
                      styles.content,
                      (hasSnapPoints || horizontal) && styles.contentFill,
                    ]}
                  >
                    {children}
                  </DrawerPrimitive.Content>
                </DrawerContentContext.Provider>
                {showSwipeHandle && handleLast ? <DrawerSwipeHandle /> : null}
                {showCloseButton ? (
                  <DrawerPrimitive.Close
                    render={
                      <Button
                        variant={closeLabel ? "plain" : "ghost"}
                        size={closeLabel ? "sm" : "icon-sm"}
                        style={({ pressed }) => [
                          styles.close,
                          { top: showSwipeHandle ? 23 : 11 },
                          !closeLabel && {
                            backgroundColor: pressed
                              ? colors.border
                              : colors.secondary,
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
                        color={colors.foreground}
                        style={styles.closeIcon}
                      />
                    )}
                  </DrawerPrimitive.Close>
                ) : null}
              </DrawerPrimitive.Popup>
            </AnimatedView>
          </DrawerPrimitive.Viewport>
        </FullWindowOverlay>
      </DrawerContext.Provider>
    </DrawerPortal>
  )
}

function DrawerHeader({ style, ...props }: ViewProps) {
  const { swipeDirection } = useDrawer()
  const { hasCloseButton, hasCloseLabel } =
    React.useContext(DrawerContentContext)
  const vertical = swipeDirection === "down" || swipeDirection === "up"
  return (
    <View
      style={[
        styles.header,
        hasCloseButton && { paddingHorizontal: hasCloseLabel ? 96 : 56 },
        vertical && styles.headerCentered,
        style,
      ]}
      {...props}
    />
  )
}

function DrawerFooter({ style, ...props }: ViewProps) {
  return <View style={[styles.footer, style]} {...props} />
}

function DrawerTitle({
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  const { colors } = useTheme()
  const { swipeDirection } = useDrawer()
  const vertical = swipeDirection === "down" || swipeDirection === "up"
  return (
    <DrawerPrimitive.Title
      style={(state) => [
        styles.title,
        { color: colors.foreground },
        vertical && styles.centered,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function DrawerDescription({
  style,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  const { colors } = useTheme()
  const { swipeDirection } = useDrawer()
  const vertical = swipeDirection === "down" || swipeDirection === "up"
  return (
    <DrawerPrimitive.Description
      style={(state) => [
        styles.description,
        { color: colors.mutedForeground },
        vertical && styles.centered,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerIndent,
  DrawerIndentBackground,
  DrawerOverlay,
  DrawerPortal,
  DrawerProvider,
  DrawerSwipeHandle,
  DrawerTitle,
  DrawerTrigger,
}
