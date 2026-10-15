import { cn } from "cn"
import { XIcon } from "phosphor-react-native"
import * as React from "react"
import { Platform, View } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as ImageViewerPrimitive from "@/components/primitives/image-viewer"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

type ImageViewerImage = ImageViewerPrimitive.ImageViewerImage

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function defaultIndexLabel(index: number, count: number) {
  return `${index + 1} of ${count}`
}

function useImageViewer() {
  const context = ImageViewerPrimitive.useRootContext("useImageViewer")
  return {
    open: context.open,
    index: context.index,
    count: context.count,
    images: context.images,
  }
}

function ImageViewer({
  onOpenChange,
  onIndexChange,
  ...props
}: Omit<
  React.ComponentProps<typeof ImageViewerPrimitive.Root>,
  "onOpenChange" | "onIndexChange"
> & {
  onOpenChange?: (open: boolean) => void
  onIndexChange?: (index: number) => void
}) {
  return (
    <ImageViewerPrimitive.Root
      onOpenChange={(open) => onOpenChange?.(open)}
      onIndexChange={(index) => onIndexChange?.(index)}
      {...props}
    />
  )
}

function ImageViewerTrigger({
  className,
  ...props
}: React.ComponentProps<typeof ImageViewerPrimitive.Trigger>) {
  return (
    <ImageViewerPrimitive.Trigger
      className={(state) =>
        cn("active:opacity-80", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

function ImageViewerContent({
  portalHost,
  closeLabel = "Close",
  indexLabel = defaultIndexLabel,
  className,
}: {
  portalHost?: string
  closeLabel?: string
  indexLabel?: (index: number, count: number) => string
  className?: string
}) {
  const insets = useSafeAreaInsets()
  const { index, count } = useImageViewer()
  const label = indexLabel(index, count)
  return (
    <ImageViewerPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <AnimatedView
          entering={FadeIn.duration(250).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(200).reduceMotion(ReduceMotion.System)}
          className="absolute top-0 right-0 bottom-0 left-0 z-50"
        >
          <ImageViewerPrimitive.Popup className={className}>
            <ImageViewerPrimitive.Backdrop className="bg-black" />
            <ImageViewerPrimitive.Pages accessibilityValue={{ text: label }} />
            <ImageViewerPrimitive.Controls
              className="absolute top-0 right-0 left-0 flex-row items-center justify-between px-4"
              style={{ paddingTop: insets.top + 8 }}
            >
              <View className="size-8" />
              <View className="rounded-full bg-white/15 px-3 py-1">
                <Text className="text-sm font-semibold text-white">
                  {label}
                </Text>
              </View>
              <ImageViewerPrimitive.Close
                accessibilityLabel={closeLabel}
                hitSlop={8}
                className="size-8 items-center justify-center rounded-full bg-white/15 active:opacity-80"
              >
                <Icon as={XIcon} weight="bold" className="size-4 text-white" />
              </ImageViewerPrimitive.Close>
            </ImageViewerPrimitive.Controls>
          </ImageViewerPrimitive.Popup>
        </AnimatedView>
      </FullWindowOverlay>
    </ImageViewerPrimitive.Portal>
  )
}

export type { ImageViewerImage }
export { ImageViewer, ImageViewerContent, ImageViewerTrigger, useImageViewer }
