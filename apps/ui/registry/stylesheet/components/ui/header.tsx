import { CaretLeftIcon } from "phosphor-react-native"
import * as React from "react"
import {
  I18nManager,
  Pressable,
  type ScrollViewProps,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type HeaderScroll = {
  scrollY: SharedValue<number>
  largeTitleHeight: SharedValue<number>
  onScroll: ReturnType<typeof useAnimatedScrollHandler>
}

const HeaderContext = React.createContext<HeaderScroll | null>(null)

function useHeaderScroll(): HeaderScroll {
  const scrollY = useSharedValue(0)
  const largeTitleHeight = useSharedValue(0)
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })
  return React.useMemo(
    () => ({ scrollY, largeTitleHeight, onScroll }),
    [scrollY, largeTitleHeight, onScroll]
  )
}

const styles = StyleSheet.create({
  bar: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  slot: {
    minWidth: 44,
    flex: 1,
    flexBasis: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  border: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    pointerEvents: "none",
  },
  title: { flexShrink: 1, alignItems: "center", paddingHorizontal: 8 },
  titleText: { ...fontSize.base, fontWeight: "600" },
  subtitleText: { ...fontSize.xs },
  largeTitle: {
    gap: 2,
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 8,
  },
  largeTitleText: { ...fontSize["3xl"], fontWeight: "700" },
  largeSubtitleText: { ...fontSize.sm },
  back: {
    height: 36,
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderRadius: radius.full,
    paddingStart: 2,
    paddingEnd: 12,
  },
  backIconOnly: { paddingEnd: 2 },
  backText: { ...fontSize.base, flexShrink: 1 },
  flipped: { transform: [{ rotate: "180deg" }] },
  actions: { flexDirection: "row", alignItems: "center", gap: 4 },
  scroll: { flex: 1 },
})

function wrapText(children: React.ReactNode, style: TextStyle) {
  if (typeof children === "string" || typeof children === "number") {
    return (
      <Text numberOfLines={1} style={style}>
        {children}
      </Text>
    )
  }
  return children
}

function Header({
  scroll,
  style,
  children,
  ...props
}: ViewProps & {
  scroll?: HeaderScroll
}) {
  const { colors } = useTheme()
  const leading: React.ReactNode[] = []
  const trailing: React.ReactNode[] = []
  const title: React.ReactNode[] = []

  for (const child of React.Children.toArray(children)) {
    if (React.isValidElement<{ side?: "leading" | "trailing" }>(child)) {
      if (child.type === HeaderTitle) {
        title.push(child)
        continue
      }
      if (
        child.type === HeaderBack ||
        (child.type === HeaderActions && child.props.side === "leading")
      ) {
        leading.push(child)
        continue
      }
    }
    trailing.push(child)
  }

  const scrollY = scroll?.scrollY

  const largeTitleHeight = scroll?.largeTitleHeight

  const borderStyle = useAnimatedStyle(() => {
    if (!scrollY || !largeTitleHeight) return { opacity: 0 }
    return {
      opacity: interpolate(
        scrollY.value - largeTitleHeight.value,
        [0, 8],
        [0, 1],
        "clamp"
      ),
    }
  })

  return (
    <HeaderContext.Provider value={scroll ?? null}>
      <View style={[styles.bar, style]} {...props}>
        <View style={[styles.slot, { justifyContent: "flex-start" }]}>
          {leading}
        </View>
        {title}
        <View style={[styles.slot, { justifyContent: "flex-end" }]}>
          {trailing}
        </View>
        <AnimatedView
          style={[
            styles.border,
            { backgroundColor: colors.separator },
            borderStyle,
          ]}
        />
      </View>
    </HeaderContext.Provider>
  )
}

function HeaderTitle({
  subtitle,
  style,
  children,
  ...props
}: ViewProps & {
  subtitle?: React.ReactNode
}) {
  const { colors } = useTheme()
  const scroll = React.useContext(HeaderContext)
  const scrollY = scroll?.scrollY
  const largeTitleHeight = scroll?.largeTitleHeight
  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollY || !largeTitleHeight || largeTitleHeight.value <= 0)
      return { opacity: 1 }
    const height = largeTitleHeight.value
    return {
      opacity: interpolate(
        scrollY.value,
        [height * 0.6, height],
        [0, 1],
        "clamp"
      ),
    }
  })
  return (
    <AnimatedView
      role="heading"
      style={[styles.title, animatedStyle, style]}
      {...props}
    >
      {wrapText(children, styles.titleText)}
      {subtitle !== undefined
        ? wrapText(subtitle, {
            ...styles.subtitleText,
            color: colors.labelSecondary,
          })
        : null}
    </AnimatedView>
  )
}

function HeaderLargeTitle({
  subtitle,
  style,
  children,
  onLayout,
  ...props
}: ViewProps & {
  subtitle?: React.ReactNode
}) {
  const { colors } = useTheme()
  const scroll = React.useContext(HeaderContext)
  const scrollY = scroll?.scrollY
  const largeTitleHeight = scroll?.largeTitleHeight

  React.useEffect(() => {
    if (!scroll) return
    return () => {
      scroll.largeTitleHeight.value = 0
    }
  }, [scroll])

  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollY || !largeTitleHeight) return {}
    return {
      transform: [
        {
          scale: interpolate(scrollY.value, [-160, 0], [1.12, 1], "clamp"),
        },
      ],
    }
  })

  return (
    <AnimatedView
      style={[
        styles.largeTitle,
        { transformOrigin: I18nManager.isRTL ? "right" : "left" },
        animatedStyle,
        style,
      ]}
      onLayout={(event) => {
        if (scroll) {
          scroll.largeTitleHeight.value = event.nativeEvent.layout.height
        }
        onLayout?.(event)
      }}
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text role="heading" style={styles.largeTitleText}>
          {children}
        </Text>
      ) : (
        children
      )}
      {subtitle !== undefined
        ? wrapText(subtitle, {
            ...styles.largeSubtitleText,
            color: colors.labelSecondary,
          })
        : null}
    </AnimatedView>
  )
}

function HeaderBack({
  style,
  children,
  accessibilityLabel,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children" | "style"> & {
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}) {
  const { colors } = useTheme()
  return (
    <Pressable
      role="button"
      hitSlop={4}
      accessibilityLabel={
        accessibilityLabel ??
        (typeof children === "string" ? children : undefined) ??
        "Back"
      }
      style={({ pressed }) => [
        styles.back,
        children === undefined && styles.backIconOnly,
        pressed && { backgroundColor: colors.itemPressed },
        style,
      ]}
      {...props}
    >
      <Icon
        as={CaretLeftIcon}
        weight="bold"
        size={24}
        color={colors.link}
        style={I18nManager.isRTL ? styles.flipped : undefined}
      />
      {wrapText(children, { ...styles.backText, color: colors.link })}
    </Pressable>
  )
}

function HeaderActions({
  side = "trailing",
  style,
  ...props
}: ViewProps & {
  side?: "leading" | "trailing"
}) {
  return (
    <View
      style={[
        styles.actions,
        { justifyContent: side === "leading" ? "flex-start" : "flex-end" },
        style,
      ]}
      {...props}
    />
  )
}

function HeaderScrollView({
  scroll,
  style,
  scrollEventThrottle = 16,
  ...props
}: Omit<ScrollViewProps, "onScroll"> & {
  scroll: HeaderScroll
}) {
  return (
    <HeaderContext.Provider value={scroll}>
      <Animated.ScrollView
        onScroll={scroll.onScroll}
        scrollEventThrottle={scrollEventThrottle}
        style={[styles.scroll, style]}
        {...props}
      />
    </HeaderContext.Provider>
  )
}

export type { HeaderScroll }
export {
  Header,
  HeaderActions,
  HeaderBack,
  HeaderLargeTitle,
  HeaderScrollView,
  HeaderTitle,
  useHeaderScroll,
}
