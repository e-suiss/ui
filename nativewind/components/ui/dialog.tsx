import { cn } from "cn"
import { XIcon } from "phosphor-react-native"
import * as React from "react"
import { Platform, View, type ViewProps } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as DialogPrimitive from "@/components/primitives/dialog"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      render={
        <AnimatedView
          as="Pressable"
          entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
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

function DialogContent({
  className,
  portalHost,
  showCloseButton = true,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & {
  portalHost?: string
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal hostName={portalHost}>
      <FullWindowOverlay>
        <DialogOverlay />
        <View
          className="absolute top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center p-4"
          style={{ pointerEvents: "box-none" }}
        >
          <AnimatedView
            entering={FadeIn.delay(50).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
            style={{
              width: "100%",
              maxWidth: 448,
              paddingHorizontal: 16,
              pointerEvents: "box-none",
            }}
          >
            <DialogPrimitive.Popup
              className={(state) =>
                cn(
                  "z-50 mx-auto flex w-full flex-col gap-6 rounded-4xl border border-foreground-5 bg-popover p-6 shadow-xl sm:max-w-md dark:border-foreground-10",
                  resolveClassName(className, state)
                )
              }
              {...props}
            >
              {children}
              {showCloseButton ? (
                <DialogPrimitive.Close
                  className="absolute top-4 right-4 size-8 items-center justify-center rounded-full bg-secondary active:bg-muted dark:active:bg-muted-50"
                  hitSlop={12}
                  accessibilityLabel="Close"
                >
                  <Icon
                    as={XIcon}
                    className="size-4 shrink-0 text-foreground"
                  />
                </DialogPrimitive.Close>
              ) : null}
            </DialogPrimitive.Popup>
          </AnimatedView>
        </View>
      </FullWindowOverlay>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: ViewProps) {
  return <View className={cn("flex flex-col gap-1.5", className)} {...props} />
}

function DialogFooter({ className, ...props }: ViewProps) {
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

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={(state) =>
        cn(
          "text-base font-medium leading-none text-foreground",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={(state) =>
        cn("text-sm text-muted-foreground", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
