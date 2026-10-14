import { XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as ImageViewerPrimitive from "@/components/primitives/image-viewer"
import { resolveStyle } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type ImageViewerImage = ImageViewerPrimitive.ImageViewerImage

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  frame: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 50,
  },
  pressed: { opacity: 0.8 },
  controls: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  spacer: { width: 32, height: 32 },
  label: {
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  labelText: { ...fontSize.sm, fontWeight: "600" },
  close: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
})

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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
  style,
  ...props
}: React.ComponentProps<typeof ImageViewerPrimitive.Trigger>) {
  return (
    <ImageViewerPrimitive.Trigger
      style={(state) => resolveStyle(style, state) as ViewStyle}
      render={(renderProps) => {
        const { style: baseStyle, ...rest } = renderProps
        return (
          <Pressable
            {...rest}
            style={({ pressed }) => [
              baseStyle as ViewStyle,
              pressed && styles.pressed,
            ]}
          />
        )
      }}
      {...props}
    />
  )
}

function ImageViewerContent({
  portalHost,
  closeLabel = "Close",
  indexLabel = defaultIndexLabel,
  style,
}: {
  portalHost?: string
  closeLabel?: string
  indexLabel?: (index: number, count: number) => string
  style?: ViewStyle
}) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const { index, count } = useImageViewer()
  const label = indexLabel(index, count)
  return (
    <ImageViewerPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <AnimatedView
          entering={FadeIn.duration(250).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(200).reduceMotion(ReduceMotion.System)}
          style={styles.frame}
        >
          <ImageViewerPrimitive.Popup style={style}>
            <ImageViewerPrimitive.Backdrop
              style={{ backgroundColor: colors.media }}
            />
            <ImageViewerPrimitive.Pages accessibilityValue={{ text: label }} />
            <ImageViewerPrimitive.Controls
              style={[styles.controls, { paddingTop: insets.top + 8 }]}
            >
              <View style={styles.spacer} />
              <View
                style={[
                  styles.label,
                  { backgroundColor: withAlpha(colors.onMedia, 0.15) },
                ]}
              >
                <Text style={[styles.labelText, { color: colors.onMedia }]}>
                  {label}
                </Text>
              </View>
              <ImageViewerPrimitive.Close
                accessibilityLabel={closeLabel}
                hitSlop={8}
                render={(renderProps) => {
                  const { style: baseStyle, ...rest } = renderProps
                  return (
                    <Pressable
                      {...rest}
                      style={({ pressed }) => [
                        baseStyle as ViewStyle,
                        styles.close,
                        {
                          backgroundColor: withAlpha(
                            colors.onMedia,
                            pressed ? 0.25 : 0.15
                          ),
                        },
                      ]}
                    />
                  )
                }}
              >
                <Icon
                  as={XIcon}
                  weight="bold"
                  size={16}
                  color={colors.onMedia}
                />
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
