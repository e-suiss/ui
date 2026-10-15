import { cn } from "cn"
import * as React from "react"
import { Platform, View, type ViewProps } from "react-native"
import {
  FadeIn,
  FadeOut,
  Keyframe,
  ReduceMotion,
} from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as AlertDialogPrimitive from "@/components/primitives/alert-dialog"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { IconClassContext } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const POPUP_ENTERING = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.95 }] },
  100: { opacity: 1, transform: [{ scale: 1 }] },
})
  .duration(150)
  .reduceMotion(ReduceMotion.System)

const POPUP_EXITING = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: 0.95 }] },
})
  .duration(100)
  .reduceMotion(ReduceMotion.System)

const AlertDialogFooterContext = React.createContext(false)

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Backdrop>) {
  return (
    <AlertDialogPrimitive.Backdrop
      render={
        <AnimatedView
          as="Pressable"
          entering={FadeIn.duration(150).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(100).reduceMotion(ReduceMotion.System)}
        />
      }
      className={(state) =>
        cn(
          "absolute top-0 right-0 bottom-0 left-0 z-50 bg-black/50",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  portalHost,
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Popup> & {
  portalHost?: string
  size?: "default" | "sm"
}) {
  return (
    <AlertDialogPortal hostName={portalHost}>
      <FullWindowOverlay>
        <AlertDialogOverlay />
        <View
          className="absolute top-0 right-0 bottom-0 left-0 z-50 items-center justify-center p-4"
          style={{ pointerEvents: "box-none" }}
        >
          <AnimatedView
            entering={POPUP_ENTERING}
            exiting={POPUP_EXITING}
            className={cn("w-full", size === "sm" ? "max-w-xs" : "max-w-85")}
            style={{ pointerEvents: "box-none" }}
          >
            <AlertDialogPrimitive.Popup
              className={(state) =>
                cn(
                  "z-50 w-full flex-col gap-6 rounded-2xl border border-foreground-5 bg-popover p-6 shadow-xl dark:border-foreground-10",
                  resolveClassName(className, state)
                )
              }
              {...props}
            />
          </AnimatedView>
        </View>
      </FullWindowOverlay>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ className, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-center">
      <View
        className={cn("flex-col items-center gap-1.5", className)}
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function AlertDialogFooter({ className, ...props }: ViewProps) {
  return (
    <AlertDialogFooterContext.Provider value={true}>
      <View className={cn("flex-row gap-2", className)} {...props} />
    </AlertDialogFooterContext.Provider>
  )
}

function AlertDialogMedia({ className, ...props }: ViewProps) {
  return (
    <IconClassContext.Provider value="size-8">
      <View
        className={cn(
          "mb-2 size-16 items-center justify-center rounded-full bg-muted",
          className
        )}
        {...props}
      />
    </IconClassContext.Provider>
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={(state) =>
        cn(
          "text-center text-lg font-semibold text-foreground",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={(state) =>
        cn(
          "text-center text-sm text-muted-foreground",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Close> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  const inFooter = React.useContext(AlertDialogFooterContext)
  return (
    <AlertDialogPrimitive.Close
      render={<Button variant={variant} size={size} />}
      className={(state) =>
        cn(inFooter && "flex-1", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant = "secondary",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Close> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  const inFooter = React.useContext(AlertDialogFooterContext)
  return (
    <AlertDialogPrimitive.Close
      render={<Button variant={variant} size={size} />}
      className={(state) =>
        cn(inFooter && "flex-1", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
