import { cn } from "cn"
import * as React from "react"
import { Platform, View, type ViewProps } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as AlertDialogPrimitive from "@/components/primitives/alert-dialog"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { TextClassContext } from "@/components/ui/text"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Backdrop>) {
  return (
    <AlertDialogPrimitive.Backdrop
      render={
        <AnimatedView
          as="Pressable"
          entering={FadeIn.duration(200)
            .delay(50)
            .reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
        />
      }
      className={(state) =>
        cn(
          "absolute top-0 right-0 bottom-0 left-0 z-50 bg-black/30",
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
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Popup> & {
  portalHost?: string
}) {
  return (
    <AlertDialogPortal hostName={portalHost}>
      <FullWindowOverlay>
        <AlertDialogOverlay />
        <View
          className="absolute top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center p-4"
          style={{ pointerEvents: "box-none" }}
        >
          <AnimatedView
            entering={FadeIn.duration(200)
              .delay(50)
              .reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
            style={{
              flex: 1,
              alignSelf: "stretch",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 16,
              pointerEvents: "box-none",
            }}
          >
            <AlertDialogPrimitive.Popup
              className={(state) =>
                cn(
                  "z-50 w-full max-w-xs flex-col gap-6 rounded-4xl border border-foreground/5 bg-popover p-6 shadow-xl sm:max-w-md dark:border-foreground/10",
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
    <TextClassContext.Provider value="text-center sm:text-left">
      <View
        className={cn(
          "flex flex-col items-center gap-1.5 sm:items-start",
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function AlertDialogFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
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
          "text-lg font-medium text-foreground",
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
        cn("text-sm text-muted-foreground", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

function AlertDialogAction({
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Close> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Close
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  )
}

function AlertDialogCancel({
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Close> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Close
      render={<Button variant={variant} size={size} />}
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
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
