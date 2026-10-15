import { cn } from "cn"
import { XIcon } from "phosphor-react-native"
import * as React from "react"
import { Platform, View, type ViewProps, type ViewStyle } from "react-native"
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
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

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

const POSITION: Record<SheetSide, string> = {
  top: "top-2 left-2 right-2",
  right: "top-2 bottom-2 right-2 w-3/4 sm:max-w-sm",
  bottom: "bottom-2 left-2 right-2",
  left: "top-2 bottom-2 left-2 w-3/4 sm:max-w-sm",
}

const DURATION = 400

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
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Backdrop>) {
  return (
    <AnimatedView
      entering={FadeIn.duration(DURATION).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(DURATION).reduceMotion(ReduceMotion.System)}
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

function SheetContent({
  className,
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
  const setSide = React.useContext(SheetSideContext)
  const insets = useSafeAreaInsets()

  React.useLayoutEffect(() => {
    setSide?.(side)
  }, [setSide, side])

  const frameStyle = React.useMemo<ViewStyle>(
    () => ({
      pointerEvents: "box-none",
      marginTop: side === "bottom" ? 0 : insets.top,
      marginBottom: side === "top" ? 0 : insets.bottom,
      marginLeft: side === "right" ? 0 : insets.left,
      marginRight: side === "left" ? 0 : insets.right,
    }),
    [side, insets]
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
        <DrawerPrimitive.Viewport className="absolute top-0 right-0 bottom-0 left-0 z-50">
          <AnimatedView
            entering={ENTERING[side]
              .duration(DURATION)
              .reduceMotion(ReduceMotion.System)}
            exiting={EXITING[side]
              .duration(DURATION)
              .reduceMotion(ReduceMotion.System)}
            className={cn("absolute z-50", POSITION[side])}
            style={frameStyle}
          >
            <DrawerPrimitive.Popup
              className={(state) =>
                cn(
                  "flex flex-col rounded-3xl bg-popover shadow-xl",
                  (side === "left" || side === "right") && "flex-1",
                  resolveClassName(className, state)
                )
              }
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
                      className={cn(
                        "absolute top-[19px] right-4",
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
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: ViewProps) {
  const { hasCloseButton, hasCloseLabel } = React.useContext(SheetCloseContext)
  return (
    <View
      className={cn(
        "flex flex-col gap-1.5 p-6",
        hasCloseButton && "pr-14",
        hasCloseLabel && "pr-24",
        className
      )}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("mt-auto flex flex-col gap-2 p-6", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={(state) =>
        cn(
          "text-base font-semibold text-foreground",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={(state) =>
        cn("text-sm text-muted-foreground", resolveClassName(className, state))
      }
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
