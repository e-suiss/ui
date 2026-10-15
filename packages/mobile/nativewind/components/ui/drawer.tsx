import { cn } from "cn"
import { XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
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
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

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
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.IndentBackground>) {
  return (
    <DrawerPrimitive.IndentBackground
      className={(state) =>
        cn(
          "absolute top-0 right-0 bottom-0 left-0 -z-10 bg-foreground dark:bg-background",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

const INDENT_ORIGIN: ViewStyle = { transformOrigin: "top" }

function DrawerIndent({
  className,
  style,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Indent>) {
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
      borderRadius: withTiming(raised ? 18 : 0, config),
      transform: [
        { translateY: withTiming(raised ? offset : 0, config) },
        { scale: withTiming(raised ? 0.94 : 1, config) },
      ],
    }
  }, [raised, offset])

  return (
    <DrawerPrimitive.Indent
      render={<AnimatedView style={[INDENT_ORIGIN, animatedStyle]} />}
      className={(state) =>
        cn(
          "relative flex-1 overflow-hidden bg-background",
          resolveClassName(className, state)
        )
      }
      style={style}
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
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Backdrop>) {
  return (
    <AnimatedView
      entering={FadeIn.duration(EASE_DURATION).reduceMotion(
        ReduceMotion.System
      )}
      exiting={FadeOut.duration(300).reduceMotion(ReduceMotion.System)}
      className="absolute top-0 right-0 bottom-0 left-0 z-50"
      style={{ pointerEvents: "box-none" }}
    >
      <DrawerPrimitive.Backdrop
        className={(state) =>
          cn(
            "absolute top-0 right-0 bottom-0 left-0 bg-black/50",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </AnimatedView>
  )
}

function DrawerSwipeHandle({ className, ...props }: ViewProps) {
  const { swipeDirection } = useDrawer()
  const horizontal = swipeDirection === "left" || swipeDirection === "right"
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      className={cn(
        "relative z-10 shrink-0 flex",
        horizontal
          ? "h-full w-3 items-center justify-center"
          : "h-3 w-full items-center justify-center",
        swipeDirection === "down" && "justify-end",
        swipeDirection === "up" && "justify-start",
        className
      )}
      {...props}
    >
      <View
        className={cn(
          "shrink-0 rounded-full bg-border",
          horizontal ? "h-9 w-[5px]" : "h-[5px] w-9"
        )}
      />
    </View>
  )
}

const POSITION: Record<SwipeDirection, string> = {
  down: "bottom-0 left-0 right-0",
  up: "top-0 left-0 right-0",
  left: "top-0 bottom-0 left-0 w-3/4 sm:max-w-sm",
  right: "top-0 bottom-0 right-0 w-3/4 sm:max-w-sm",
}

const DOCKED_RADIUS: Record<SwipeDirection, string> = {
  down: "rounded-b-none",
  up: "rounded-t-none",
  left: "rounded-l-none",
  right: "rounded-r-none",
}

const BLEED: Record<SwipeDirection, string> = {
  down: "top-full left-0 right-0 h-12",
  up: "bottom-full left-0 right-0 h-12",
  left: "right-full top-0 bottom-0 w-12",
  right: "left-full top-0 bottom-0 w-12",
}

function DrawerContent({
  className,
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
  const drawerContext = useDrawer()
  const { floating, hasSnapPoints, modal, showSwipeHandle, swipeDirection } =
    drawerContext
  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const horizontal = swipeDirection === "left" || swipeDirection === "right"
  const inset = floating ? 8 : 0
  const handleLast = swipeDirection === "up" || swipeDirection === "left"

  const frameStyle = React.useMemo<ViewStyle>(() => {
    const style: ViewStyle = { pointerEvents: "box-none" }
    if (floating) {
      if (swipeDirection !== "down") style.top = insets.top
      if (swipeDirection !== "up") style.bottom = insets.bottom
      if (swipeDirection !== "right") style.left = insets.left
      if (swipeDirection !== "left") style.right = insets.right
    }
    return style
  }, [floating, swipeDirection, insets])

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
          <DrawerPrimitive.Viewport className="absolute top-0 right-0 bottom-0 left-0 z-50">
            <AnimatedView
              entering={ENTERING[swipeDirection]
                .duration(EASE_DURATION)
                .reduceMotion(ReduceMotion.System)}
              exiting={EXITING[swipeDirection]
                .duration(300)
                .reduceMotion(ReduceMotion.System)}
              className={cn("absolute z-50", POSITION[swipeDirection])}
              style={frameStyle}
            >
              <DrawerPrimitive.Popup
                className={(state) =>
                  cn(
                    "flex min-h-0 flex-col rounded-3xl bg-popover shadow-xl",
                    horizontal && "flex-1 flex-row",
                    !floating && DOCKED_RADIUS[swipeDirection],
                    resolveClassName(className, state)
                  )
                }
                style={(state) => [
                  popupStyle,
                  typeof style === "function" ? style(state) : style,
                ]}
                {...props}
              >
                {floating ? null : (
                  <View
                    accessible={false}
                    className={cn("absolute bg-popover", BLEED[swipeDirection])}
                    style={{ pointerEvents: "none" }}
                  />
                )}
                {showSwipeHandle && !handleLast ? <DrawerSwipeHandle /> : null}
                <DrawerContentContext.Provider value={contentContext}>
                  <DrawerPrimitive.Content
                    className={cn(
                      "flex min-h-0 shrink flex-col overflow-hidden rounded-3xl",
                      (hasSnapPoints || horizontal) && "flex-1"
                    )}
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
                        className={cn(
                          "absolute right-4",
                          showSwipeHandle ? "top-[23px]" : "top-[11px]",
                          !closeLabel && "bg-secondary active:opacity-80"
                        )}
                      />
                    }
                    hitSlop={8}
                    accessibilityLabel={closeLabel ? undefined : "Close"}
                  >
                    {closeLabel ? (
                      <Text className="text-base">{closeLabel}</Text>
                    ) : (
                      <Icon as={XIcon} className="size-4 text-foreground" />
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

function DrawerHeader({ className, ...props }: ViewProps) {
  const { swipeDirection } = useDrawer()
  const { hasCloseButton, hasCloseLabel } =
    React.useContext(DrawerContentContext)
  const vertical = swipeDirection === "down" || swipeDirection === "up"
  return (
    <View
      className={cn(
        "flex shrink-0 flex-col gap-0.5 p-4 pb-0",
        hasCloseButton && "px-14",
        hasCloseLabel && "px-24",
        vertical && "items-center",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("mt-auto flex shrink-0 flex-col gap-2 p-4 pt-0", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  const { swipeDirection } = useDrawer()
  const vertical = swipeDirection === "down" || swipeDirection === "up"
  return (
    <DrawerPrimitive.Title
      className={(state) =>
        cn(
          "text-base font-semibold text-foreground",
          vertical && "text-center",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  const { swipeDirection } = useDrawer()
  const vertical = swipeDirection === "down" || swipeDirection === "up"
  return (
    <DrawerPrimitive.Description
      className={(state) =>
        cn(
          "text-sm text-muted-foreground",
          vertical && "text-center",
          resolveClassName(className, state)
        )
      }
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
