import { cn } from "cn"
import * as React from "react"
import { Platform, View } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as PreviewMenuPrimitive from "@/components/primitives/preview-menu"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function usePreviewMenu() {
  const context = PreviewMenuPrimitive.useRootContext("usePreviewMenu")
  return { open: context.open, lifted: context.lifted, frame: context.frame }
}

function PreviewMenu({
  open,
  defaultOpen,
  onOpenChange,
  aspectRatio,
  children,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  aspectRatio?: number
  children?: React.ReactNode
}) {
  const insets = useSafeAreaInsets()
  const safeArea = React.useMemo(
    () => ({ top: insets.top, bottom: insets.bottom }),
    [insets.top, insets.bottom]
  )
  return (
    <PreviewMenuPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(next) => onOpenChange?.(next)}
      aspectRatio={aspectRatio}
      insets={safeArea}
    >
      {children}
    </PreviewMenuPrimitive.Root>
  )
}

function PreviewMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof PreviewMenuPrimitive.Trigger>) {
  return (
    <PreviewMenuPrimitive.Trigger
      className={(state) =>
        cn(state.lifted && "opacity-0", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

function PreviewMenuLayer({
  layer,
  children,
}: {
  layer: PreviewMenuPrimitive.PreviewLayer
  children?: React.ReactNode
}) {
  const motion = PreviewMenuPrimitive.useLayer(layer)
  if (!motion) return null
  return (
    <AnimatedView
      entering={motion.entering}
      exiting={motion.exiting}
      style={motion.style}
    >
      {children ?? motion.content}
    </AnimatedView>
  )
}

function PreviewMenuPreviewBody({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { contentRef } =
    PreviewMenuPrimitive.useRootContext("PreviewMenuContent")
  return (
    <View
      className={cn(
        "h-full w-full overflow-hidden rounded-2xl bg-surface",
        className
      )}
    >
      {children ? (
        <>
          <PreviewMenuLayer layer="source" />
          <PreviewMenuLayer layer="preview">{children}</PreviewMenuLayer>
        </>
      ) : (
        contentRef.current
      )}
    </View>
  )
}

function PreviewMenuBackdrop() {
  const { ready } = PreviewMenuPrimitive.useRootContext("PreviewMenuContent")
  if (!ready) return null
  return (
    <AnimatedView
      entering={FadeIn.duration(300).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(300).reduceMotion(ReduceMotion.System)}
      className="absolute top-0 right-0 bottom-0 left-0"
      style={{ pointerEvents: "none" }}
    >
      <PreviewMenuPrimitive.Backdrop className="bg-scrim" />
    </AnimatedView>
  )
}

function PreviewMenuContent({
  preview,
  previewClassName,
  portalHost,
  className,
  children,
  ...props
}: React.ComponentProps<typeof PreviewMenuPrimitive.Popup> & {
  preview?: React.ReactNode
  previewClassName?: string
  portalHost?: string
}) {
  return (
    <PreviewMenuPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <PreviewMenuBackdrop />
        <PreviewMenuPrimitive.Preview className="rounded-2xl shadow-xl">
          <PreviewMenuPreviewBody className={previewClassName}>
            {preview}
          </PreviewMenuPreviewBody>
        </PreviewMenuPrimitive.Preview>
        <PreviewMenuPrimitive.Positioner>
          <View className="rounded-2xl shadow-xl">
            <PreviewMenuPrimitive.Popup
              className={(state) =>
                cn(
                  "min-w-60 overflow-hidden rounded-2xl border border-label-5 bg-surface-raised dark:border-label-10",
                  resolveClassName(className, state)
                )
              }
              {...props}
            >
              <View className="-mt-px">{children}</View>
            </PreviewMenuPrimitive.Popup>
          </View>
        </PreviewMenuPrimitive.Positioner>
      </FullWindowOverlay>
    </PreviewMenuPrimitive.Portal>
  )
}

function PreviewMenuItem({
  className,
  variant = "default",
  children,
  ...props
}: Omit<React.ComponentProps<typeof PreviewMenuPrimitive.Item>, "children"> & {
  variant?: "default" | "destructive"
  children?: React.ReactNode
}) {
  return (
    <TextClassContext.Provider
      value={cn(
        "text-base text-label",
        variant === "destructive" && "text-danger",
        props.disabled && "text-label-quaternary"
      )}
    >
      <IconClassContext.Provider value="size-5">
        <PreviewMenuPrimitive.Item
          className={(state) =>
            cn(
              "min-h-11 flex-row items-center justify-between gap-6 border-t border-separator px-4 py-[0.6875rem]",
              state.highlighted && "bg-item-pressed",
              resolveClassName(className, state)
            )
          }
          {...props}
        >
          {React.Children.map(children, (child) =>
            typeof child === "string" || typeof child === "number" ? (
              <Text className="shrink">{child}</Text>
            ) : (
              child
            )
          )}
        </PreviewMenuPrimitive.Item>
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

function PreviewMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof PreviewMenuPrimitive.Separator>) {
  return (
    <PreviewMenuPrimitive.Separator
      className={(state) =>
        cn("h-2 bg-separator-40", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

export {
  PreviewMenu,
  PreviewMenuContent,
  PreviewMenuItem,
  PreviewMenuSeparator,
  PreviewMenuTrigger,
  usePreviewMenu,
}
