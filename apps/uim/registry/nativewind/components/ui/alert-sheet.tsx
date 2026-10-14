import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"
import { Platform, View, type ViewProps } from "react-native"
import {
  Easing,
  FadeIn,
  FadeOut,
  ReduceMotion,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as AlertSheetPrimitive from "@/components/primitives/alert-dialog"
import * as DialogPrimitive from "@/components/primitives/dialog"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

function AlertSheet({
  dismissible = true,
  ...props
}: AlertSheetPrimitive.RootProps & { dismissible?: boolean }) {
  if (dismissible) {
    return <DialogPrimitive.Root {...props} />
  }
  return <AlertSheetPrimitive.Root {...props} />
}

const AlertSheetTrigger = AlertSheetPrimitive.Trigger

const AlertSheetPortal = AlertSheetPrimitive.Portal

function AlertSheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Backdrop>) {
  return (
    <AlertSheetPrimitive.Backdrop
      render={
        <AnimatedView
          as="Pressable"
          entering={FadeIn.duration(300).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(250).reduceMotion(ReduceMotion.System)}
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

function AlertSheetContent({
  className,
  style,
  portalHost,
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Popup> & {
  portalHost?: string
}) {
  const insets = useSafeAreaInsets()
  return (
    <AlertSheetPortal hostName={portalHost}>
      <FullWindowOverlay>
        <AlertSheetOverlay />
        <View
          className="absolute top-0 right-0 bottom-0 left-0 z-50 items-center justify-end"
          style={{ pointerEvents: "box-none" }}
        >
          <AnimatedView
            entering={SlideInDown.duration(300)
              .easing(EASING)
              .reduceMotion(ReduceMotion.System)}
            exiting={SlideOutDown.duration(250)
              .easing(EASING)
              .reduceMotion(ReduceMotion.System)}
            className="w-full max-w-md"
            style={{ pointerEvents: "box-none" }}
          >
            <AlertSheetPrimitive.Popup
              className={(state) =>
                cn(
                  "w-full flex-col gap-2 p-2",
                  resolveClassName(className, state)
                )
              }
              style={(state) => [
                {
                  paddingBottom: Math.max(8, insets.bottom),
                  paddingLeft: Math.max(8, insets.left),
                  paddingRight: Math.max(8, insets.right),
                },
                typeof style === "function" ? style(state) : style,
              ]}
              {...props}
            />
          </AnimatedView>
        </View>
      </FullWindowOverlay>
    </AlertSheetPortal>
  )
}

function AlertSheetGroup({ className, children, ...props }: ViewProps) {
  const items = React.Children.toArray(children).filter(Boolean)
  return (
    <View
      className={cn(
        "flex-col overflow-hidden rounded-2xl bg-surface-raised",
        className
      )}
      {...props}
    >
      {items.map((child, index) => (
        <React.Fragment
          key={React.isValidElement(child) ? (child.key ?? index) : index}
        >
          {index > 0 ? (
            <View accessible={false} className="h-px bg-separator" />
          ) : null}
          {child}
        </React.Fragment>
      ))}
    </View>
  )
}

function AlertSheetHeader({ className, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-center">
      <View
        className={cn("flex-col items-center gap-1 p-4", className)}
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function AlertSheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Title>) {
  return (
    <AlertSheetPrimitive.Title
      className={(state) =>
        cn(
          "text-center text-sm font-semibold text-label-secondary",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function AlertSheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertSheetPrimitive.Description>) {
  return (
    <AlertSheetPrimitive.Description
      className={(state) =>
        cn(
          "text-center text-sm text-label-secondary",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

const alertSheetActionVariants = cva(
  "min-h-14 w-full flex-row items-center justify-center gap-3 px-4 active:bg-item-pressed"
)

const alertSheetActionTextVariants = cva("text-center text-lg", {
  variants: {
    variant: {
      default: "text-link",
      destructive: "text-danger",
    },
    disabled: {
      true: "text-label-quaternary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function wrapText(children: React.ReactNode) {
  if (typeof children === "string" || typeof children === "number") {
    return <Text>{children}</Text>
  }
  return children
}

type AlertSheetActionProps = Omit<
  React.ComponentProps<typeof AlertSheetPrimitive.Close>,
  "children"
> &
  VariantProps<typeof alertSheetActionTextVariants> & {
    children?: React.ReactNode
  }

function AlertSheetAction({
  className,
  variant,
  disabled,
  children,
  ...props
}: AlertSheetActionProps) {
  const textClass = alertSheetActionTextVariants({
    variant,
    disabled: Boolean(disabled),
  })
  return (
    <TextClassContext.Provider value={textClass}>
      <IconClassContext.Provider value={cn("size-5", textClass)}>
        <AlertSheetPrimitive.Close
          disabled={disabled}
          className={(state) =>
            cn(alertSheetActionVariants(), resolveClassName(className, state))
          }
          {...props}
        >
          {wrapText(children)}
        </AlertSheetPrimitive.Close>
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

function AlertSheetCancel({
  className,
  disabled,
  children,
  ...props
}: Omit<AlertSheetActionProps, "variant">) {
  const textClass = cn(
    alertSheetActionTextVariants({ disabled: Boolean(disabled) }),
    "font-semibold"
  )
  return (
    <TextClassContext.Provider value={textClass}>
      <IconClassContext.Provider value={cn("size-5", textClass)}>
        <AlertSheetPrimitive.Close
          disabled={disabled}
          className={(state) =>
            cn(
              alertSheetActionVariants(),
              "rounded-2xl bg-surface-raised active:bg-surface-tertiary",
              resolveClassName(className, state)
            )
          }
          {...props}
        >
          {wrapText(children)}
        </AlertSheetPrimitive.Close>
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

export {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetDescription,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetOverlay,
  AlertSheetPortal,
  AlertSheetTitle,
  AlertSheetTrigger,
}
