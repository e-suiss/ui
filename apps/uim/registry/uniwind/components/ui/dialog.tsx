import { cn } from "cn"
import { XIcon } from "phosphor-react-native"
import * as React from "react"
import { Platform, View, type ViewProps } from "react-native"
import {
  FadeIn,
  FadeOut,
  Keyframe,
  ReduceMotion,
} from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as DialogPrimitive from "@/components/primitives/dialog"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

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

const DialogCloseContext = React.createContext({
  hasCloseButton: false,
  hasCloseLabel: false,
})

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      render={
        <AnimatedView
          as="Pressable"
          entering={FadeIn.duration(150).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(100).reduceMotion(ReduceMotion.System)}
        />
      }
      className={(state) =>
        cn(
          "absolute top-0 right-0 bottom-0 left-0 z-50 bg-scrim",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function DialogCloseButton({ closeLabel }: { closeLabel?: string }) {
  return (
    <DialogPrimitive.Close
      render={
        <Button
          variant={closeLabel ? "plain" : "ghost"}
          size={closeLabel ? "sm" : "icon-sm"}
          className={cn(
            "absolute top-[19px] right-4",
            !closeLabel && "bg-surface-tertiary active:bg-separator"
          )}
        />
      }
      hitSlop={8}
      accessibilityLabel={closeLabel ? undefined : "Close"}
    >
      {closeLabel ? (
        <Text className="text-base">{closeLabel}</Text>
      ) : (
        <Icon as={XIcon} className="size-4 text-label" />
      )}
    </DialogPrimitive.Close>
  )
}

function DialogContent({
  className,
  portalHost,
  showCloseButton = true,
  closeLabel,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & {
  portalHost?: string
  showCloseButton?: boolean
  closeLabel?: string
}) {
  const closeContext = React.useMemo(
    () => ({
      hasCloseButton: showCloseButton,
      hasCloseLabel: showCloseButton && closeLabel !== undefined,
    }),
    [showCloseButton, closeLabel]
  )
  return (
    <DialogPortal hostName={portalHost}>
      <FullWindowOverlay>
        <DialogOverlay />
        <View
          className="absolute top-0 right-0 bottom-0 left-0 z-50 items-center justify-center p-4"
          style={{ pointerEvents: "box-none" }}
        >
          <AnimatedView
            entering={POPUP_ENTERING}
            exiting={POPUP_EXITING}
            className="w-full max-w-md"
            style={{ pointerEvents: "box-none" }}
          >
            <DialogPrimitive.Popup
              className={(state) =>
                cn(
                  "z-50 w-full flex-col gap-6 rounded-2xl border border-label/5 bg-surface-raised p-6 shadow-xl dark:border-label/10",
                  resolveClassName(className, state)
                )
              }
              {...props}
            >
              <DialogCloseContext.Provider value={closeContext}>
                {children}
              </DialogCloseContext.Provider>
              {showCloseButton ? (
                <DialogCloseButton closeLabel={closeLabel} />
              ) : null}
            </DialogPrimitive.Popup>
          </AnimatedView>
        </View>
      </FullWindowOverlay>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: ViewProps) {
  const { hasCloseButton, hasCloseLabel } = React.useContext(DialogCloseContext)
  return (
    <View
      className={cn(
        "flex-col gap-1.5",
        hasCloseButton && "pr-8",
        hasCloseLabel && "pr-18",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: ViewProps & { showCloseButton?: boolean }) {
  return (
    <View
      className={cn(
        "flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogPrimitive.Close render={<Button variant="secondary" />}>
          <Text>Close</Text>
        </DialogPrimitive.Close>
      ) : null}
    </View>
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
          "text-base font-semibold text-label",
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
        cn("text-sm text-label-secondary", resolveClassName(className, state))
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
