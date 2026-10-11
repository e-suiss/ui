import * as React from "react"
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import * as ProgressPrimitive from "@/components/primitives/progress"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"
import { Button, buttonTextStyle } from "@/components/ui/button"
import { IconSizeContext } from "@/components/ui/icon"
import {
  ProgressIndicator,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done"

type AttachmentSize = "default" | "sm" | "xs"

type AttachmentOrientation = "horizontal" | "vertical"

type AttachmentContextValue = {
  state: AttachmentState
  size: AttachmentSize
  orientation: AttachmentOrientation
  grouped: boolean
}

const AttachmentContext = React.createContext<AttachmentContextValue>({
  state: "done",
  size: "default",
  orientation: "horizontal",
  grouped: false,
})

const AttachmentGroupItemContext = React.createContext<number | null>(null)

const AttachmentContentContext = React.createContext(false)

const SIZE: Record<AttachmentSize, ViewStyle> = {
  default: { gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  sm: { gap: 10 },
  xs: { gap: 6, borderRadius: radius.lg },
}

const SIZE_WITH_CONTENT: Record<AttachmentSize, ViewStyle> = {
  default: { paddingHorizontal: 10, paddingVertical: 8 },
  sm: { paddingHorizontal: 8, paddingVertical: 6 },
  xs: { paddingHorizontal: 6, paddingVertical: 4 },
}

const SIZE_WITH_MEDIA: Record<AttachmentSize, ViewStyle> = {
  default: { paddingHorizontal: 8, paddingVertical: 8 },
  sm: { paddingHorizontal: 6, paddingVertical: 6 },
  xs: { paddingHorizontal: 4, paddingVertical: 4 },
}

const SEPARATOR_START: Record<AttachmentSize, [number, number]> = {
  default: [16, 64],
  sm: [8, 48],
  xs: [6, 38],
}

const MEDIA_SIZE: Record<AttachmentSize, ViewStyle> = {
  default: { height: 44, width: 36 },
  sm: { height: 40, width: 32 },
  xs: { height: 34, width: 28, borderRadius: radius.sm },
}

const ACTION_SIZE: Record<AttachmentSize, [number, number]> = {
  default: [28, 9],
  sm: [24, 11],
  xs: [20, 13],
}

const styles = StyleSheet.create({
  root: {
    position: "relative",
    minWidth: 0,
    maxWidth: "100%",
    flexShrink: 0,
    borderRadius: radius["2xl"],
  },
  horizontal: { minWidth: 160, flexDirection: "row", alignItems: "center" },
  vertical: { flexDirection: "column" },
  dashed: { borderWidth: 1, borderStyle: "dashed" },
  separator: { position: "absolute", top: 0, end: 0, height: 1 },
  media: {
    position: "relative",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radius.md,
  },
  mediaFramed: { borderRadius: radius.sm, borderWidth: 1 },
  document: { justifyContent: "flex-end", paddingBottom: 6 },
  square: { width: "100%", height: undefined, aspectRatio: 1 },
  label: {
    borderRadius: radius.xs,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  labelText: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  content: { minWidth: 0, maxWidth: "100%" },
  progress: { position: "relative", marginTop: 8, width: "100%" },
  progressValue: {
    ...fontSize.sm,
    position: "absolute",
    end: 0,
    bottom: "100%",
    marginBottom: 8,
  },
  track: { height: 4, borderRadius: radius.full },
  indicator: { borderRadius: radius.full },
  actions: {
    position: "relative",
    zIndex: 20,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  actionsVertical: { position: "absolute", top: 12, end: 12, gap: 4 },
  trigger: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  group: {
    width: "100%",
    minWidth: 0,
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: radius["2xl"],
  },
})

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function wrapText(children: React.ReactNode) {
  const output: React.ReactNode[] = []
  let run: (string | number)[] = []
  const flush = () => {
    if (run.length === 0) return
    output.push(<Text key={`text-${output.length}`}>{run.join("")}</Text>)
    run = []
  }
  for (const child of React.Children.toArray(children)) {
    if (typeof child === "string" || typeof child === "number") {
      run.push(child)
    } else {
      flush()
      output.push(child)
    }
  }
  flush()
  return output
}

function containsType(children: React.ReactNode, type: unknown) {
  let found = false
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === type) found = true
  })
  return found
}

function Attachment({
  style,
  state = "done",
  size = "default",
  orientation = "horizontal",
  children,
  ...props
}: ViewProps & {
  state?: AttachmentState
  size?: AttachmentSize
  orientation?: AttachmentOrientation
}) {
  const { colors } = useTheme()
  const groupIndex = React.useContext(AttachmentGroupItemContext)
  const grouped = groupIndex !== null
  const hasMedia = containsType(children, AttachmentMedia)
  const hasContent = containsType(children, AttachmentContent)
  const vertical = orientation === "vertical"
  const context = React.useMemo(
    () => ({ state, size, orientation, grouped }),
    [state, size, orientation, grouped]
  )
  const padding =
    vertical || size !== "default"
      ? hasContent
        ? SIZE_WITH_CONTENT[size]
        : hasMedia
          ? SIZE_WITH_MEDIA[size]
          : null
      : null
  return (
    <AttachmentContext.Provider value={context}>
      <TextStyleContext.Provider
        value={{
          ...(size === "default" ? fontSize.sm : fontSize.xs),
          color: colors.label,
        }}
      >
        <View
          style={[
            styles.root,
            { backgroundColor: colors.surfaceSecondary },
            SIZE[size],
            vertical
              ? [styles.vertical, { width: hasContent ? 120 : 96 }]
              : styles.horizontal,
            vertical && size === "default" && { gap: 8 },
            padding,
            grouped
              ? { width: "100%", borderRadius: 0 }
              : { alignSelf: "flex-start" },
            !grouped &&
              state === "idle" && [
                styles.dashed,
                { borderColor: colors.separator },
              ],
            style,
          ]}
          {...props}
        >
          {grouped && groupIndex > 0 ? (
            <View
              style={[
                styles.separator,
                {
                  start: SEPARATOR_START[size][hasMedia ? 1 : 0],
                  backgroundColor: colors.separator,
                },
              ]}
            />
          ) : null}
          {children}
        </View>
      </TextStyleContext.Provider>
    </AttachmentContext.Provider>
  )
}

function AttachmentMedia({
  style,
  variant = "icon",
  ...props
}: ViewProps & { variant?: "icon" | "document" | "image" }) {
  const { colors } = useTheme()
  const { size, orientation } = React.useContext(AttachmentContext)
  const vertical = orientation === "vertical"
  return (
    <TextStyleContext.Provider
      value={variant === "icon" ? { color: colors.labelSecondary } : undefined}
    >
      <IconSizeContext.Provider value={vertical ? 24 : size === "xs" ? 14 : 16}>
        <View
          style={[
            styles.media,
            { backgroundColor: colors.surfaceSecondary },
            MEDIA_SIZE[size],
            vertical && { width: "100%" },
            variant !== "image" && [
              styles.mediaFramed,
              {
                borderColor: colors.separator,
                backgroundColor: colors.surface,
              },
            ],
            variant === "document" && styles.document,
            vertical && variant !== "document" && styles.square,
            style,
          ]}
          {...props}
        />
      </IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

function AttachmentLabel({ style, children, ...props }: ViewProps) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...styles.labelText, color: colors.onAccent }}
    >
      <View
        style={[styles.label, { backgroundColor: colors.accent }, style]}
        {...props}
      >
        {wrapText(children)}
      </View>
    </TextStyleContext.Provider>
  )
}

function AttachmentContent({ style, children, ...props }: ViewProps) {
  const { orientation } = React.useContext(AttachmentContext)
  const progress = containsType(children, AttachmentProgress)
  return (
    <AttachmentContentContext.Provider value={progress}>
      <View
        style={[
          styles.content,
          orientation === "vertical" ? { paddingHorizontal: 4 } : { flex: 1 },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    </AttachmentContentContext.Provider>
  )
}

function AttachmentTitle({
  style,
  numberOfLines = 1,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { size } = React.useContext(AttachmentContext)
  const progress = React.useContext(AttachmentContentContext)
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        size === "default" ? fontSize.base : { fontWeight: "600" },
        progress && { paddingEnd: 48 },
        style,
      ]}
      {...props}
    />
  )
}

function AttachmentDescription({
  style,
  numberOfLines = 1,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  const { size, state } = React.useContext(AttachmentContext)
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        size === "default" ? fontSize.sm : fontSize.xs,
        {
          marginTop: 2,
          color: state === "error" ? colors.danger : colors.labelSecondary,
        },
        style,
      ]}
      {...props}
    />
  )
}

function AttachmentProgress({
  style,
  ...props
}: Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "children">) {
  const { colors } = useTheme()
  return (
    <ProgressPrimitive.Root
      style={(state) => [
        styles.progress,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <ProgressValue style={styles.progressValue} />
      <ProgressTrack
        style={[
          styles.track,
          { backgroundColor: withAlpha(colors.label, 0.1) },
        ]}
      >
        <ProgressIndicator style={styles.indicator} />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function AttachmentActions({ style, ...props }: ViewProps) {
  const { orientation } = React.useContext(AttachmentContext)
  return (
    <View
      style={[
        styles.actions,
        orientation === "vertical" && styles.actionsVertical,
        style,
      ]}
      {...props}
    />
  )
}

function AttachmentAction({
  style,
  variant = "secondary",
  size,
  hitSlop,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "style"> & {
  style?: StyleProp<ViewStyle>
}) {
  const { colors } = useTheme()
  const { size: attachmentSize, orientation } =
    React.useContext(AttachmentContext)
  const isText = variant === "link"
  const resolvedSize = size ?? (isText ? "sm" : "icon-xs")
  const [actionSize, slop] = ACTION_SIZE[attachmentSize]
  const vertical = orientation === "vertical"
  const disabled = Boolean(props.disabled)
  const textStyle = buttonTextStyle(variant, resolvedSize, colors, disabled)
  return (
    <Button
      variant={variant}
      size={resolvedSize}
      hitSlop={hitSlop ?? (isText ? undefined : slop)}
      style={[
        isText
          ? { height: undefined, paddingHorizontal: 0 }
          : { width: actionSize, height: actionSize },
        !isText && vertical && { backgroundColor: colors.scrim },
        style,
      ]}
      {...props}
    >
      <TextStyleContext.Provider
        value={
          isText
            ? { ...textStyle, ...fontSize.base }
            : {
                ...textStyle,
                color: vertical ? colors.onAccent : colors.labelSecondary,
              }
        }
      >
        <IconSizeContext.Provider
          value={
            !isText && attachmentSize === "xs"
              ? 10
              : resolvedSize === "xs" || resolvedSize === "icon-xs"
                ? 12
                : 16
          }
        >
          {wrapText(children as React.ReactNode)}
        </IconSizeContext.Provider>
      </TextStyleContext.Provider>
    </Button>
  )
}

function AttachmentTrigger({
  style,
  render,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "style"> &
  React.RefAttributes<View> & {
    style?: StyleProp<ViewStyle>
    render?: RenderProp<Record<string, unknown>, Record<string, never>>
  }) {
  const { colors } = useTheme()
  const { size, grouped } = React.useContext(AttachmentContext)
  const borderRadius = grouped ? 0 : size === "xs" ? radius.lg : radius["2xl"]
  return useRender({
    defaultComponent: Pressable,
    render,
    props: [
      {
        style: ({ pressed }: { pressed: boolean }) => [
          styles.trigger,
          { borderRadius },
          pressed && { backgroundColor: colors.itemPressed },
          style,
        ],
        role: "button",
      },
      props,
    ],
  })
}

function AttachmentGroup({ style, children, ...props }: ViewProps) {
  const { colors } = useTheme()
  let index = 0
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    const value = index
    index += 1
    return (
      <AttachmentGroupItemContext.Provider value={value}>
        {child}
      </AttachmentGroupItemContext.Provider>
    )
  })
  return (
    <View
      style={[
        styles.group,
        { backgroundColor: colors.surfaceSecondary },
        style,
      ]}
      {...props}
    >
      {items}
    </View>
  )
}

export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentLabel,
  AttachmentMedia,
  AttachmentProgress,
  AttachmentTitle,
  AttachmentTrigger,
}
