import * as React from "react"
import { Platform, StyleSheet, View, type ViewStyle } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as PreviewMenuPrimitive from "@/components/primitives/preview-menu"
import { resolveStyle } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  backdropFrame: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: "none",
  },
  preview: { borderRadius: radius["2xl"], ...shadow.xl },
  previewBody: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: radius["2xl"],
  },
  popupFrame: { borderRadius: radius["2xl"], ...shadow.xl },
  popup: {
    minWidth: 240,
    overflow: "hidden",
    borderRadius: radius["2xl"],
    borderWidth: 1,
  },
  list: { marginTop: -1 },
  item: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  itemText: { flexShrink: 1 },
  separator: { height: 8 },
})

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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
  style,
  ...props
}: React.ComponentProps<typeof PreviewMenuPrimitive.Trigger>) {
  return (
    <PreviewMenuPrimitive.Trigger
      style={(state) => [
        state.lifted && { opacity: 0 },
        resolveStyle(style, state) as ViewStyle,
      ]}
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
  style,
  children,
}: {
  style?: ViewStyle
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  const { contentRef } =
    PreviewMenuPrimitive.useRootContext("PreviewMenuContent")
  return (
    <View
      style={[styles.previewBody, { backgroundColor: colors.surface }, style]}
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
  const { colors } = useTheme()
  const { ready } = PreviewMenuPrimitive.useRootContext("PreviewMenuContent")
  if (!ready) return null
  return (
    <AnimatedView
      entering={FadeIn.duration(300).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(300).reduceMotion(ReduceMotion.System)}
      style={styles.backdropFrame}
    >
      <PreviewMenuPrimitive.Backdrop
        style={{ backgroundColor: colors.scrim }}
      />
    </AnimatedView>
  )
}

function PreviewMenuContent({
  preview,
  previewStyle,
  portalHost,
  style,
  children,
  ...props
}: React.ComponentProps<typeof PreviewMenuPrimitive.Popup> & {
  preview?: React.ReactNode
  previewStyle?: ViewStyle
  portalHost?: string
}) {
  const { colors, isDark } = useTheme()
  return (
    <PreviewMenuPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <PreviewMenuBackdrop />
        <PreviewMenuPrimitive.Preview style={styles.preview}>
          <PreviewMenuPreviewBody style={previewStyle}>
            {preview}
          </PreviewMenuPreviewBody>
        </PreviewMenuPrimitive.Preview>
        <PreviewMenuPrimitive.Positioner>
          <View style={styles.popupFrame}>
            <PreviewMenuPrimitive.Popup
              style={(state) => [
                styles.popup,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: withAlpha(colors.label, isDark ? 0.1 : 0.05),
                },
                resolveStyle(style, state) as ViewStyle,
              ]}
              {...props}
            >
              <View style={styles.list}>{children}</View>
            </PreviewMenuPrimitive.Popup>
          </View>
        </PreviewMenuPrimitive.Positioner>
      </FullWindowOverlay>
    </PreviewMenuPrimitive.Portal>
  )
}

function PreviewMenuItem({
  style,
  variant = "default",
  children,
  ...props
}: Omit<React.ComponentProps<typeof PreviewMenuPrimitive.Item>, "children"> & {
  variant?: "default" | "destructive"
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  let color = variant === "destructive" ? colors.danger : colors.label
  if (props.disabled) color = colors.labelQuaternary
  return (
    <TextStyleContext.Provider value={{ ...fontSize.base, color }}>
      <IconSizeContext.Provider value={20}>
        <PreviewMenuPrimitive.Item
          style={(state) => [
            styles.item,
            { borderColor: colors.separator },
            state.highlighted && { backgroundColor: colors.itemPressed },
            resolveStyle(style, state) as ViewStyle,
          ]}
          {...props}
        >
          {React.Children.map(children, (child) =>
            typeof child === "string" || typeof child === "number" ? (
              <Text style={styles.itemText}>{child}</Text>
            ) : (
              child
            )
          )}
        </PreviewMenuPrimitive.Item>
      </IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

function PreviewMenuSeparator({
  style,
  ...props
}: React.ComponentProps<typeof PreviewMenuPrimitive.Separator>) {
  const { colors } = useTheme()
  return (
    <PreviewMenuPrimitive.Separator
      style={(state) => [
        styles.separator,
        { backgroundColor: withAlpha(colors.separator, 0.4) },
        resolveStyle(style, state) as ViewStyle,
      ]}
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
