import { cn } from "cn"
import { CaretLeftIcon } from "phosphor-react-native"
import * as React from "react"
import {
  I18nManager,
  Pressable,
  type ScrollViewProps,
  View,
  type ViewProps,
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

function wrapText(children: React.ReactNode, className: string) {
  if (typeof children === "string" || typeof children === "number") {
    return (
      <Text numberOfLines={1} className={className}>
        {children}
      </Text>
    )
  }
  return children
}

function Header({
  scroll,
  className,
  children,
  ...props
}: ViewProps & {
  scroll?: HeaderScroll
}) {
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
      <View
        className={cn("h-11 flex-row items-center px-2", className)}
        {...props}
      >
        <View className="min-w-11 flex-1 basis-0 flex-row items-center justify-start">
          {leading}
        </View>
        {title}
        <View className="min-w-11 flex-1 basis-0 flex-row items-center justify-end">
          {trailing}
        </View>
        <AnimatedView
          className="absolute inset-x-0 bottom-0 h-px bg-border"
          style={[{ pointerEvents: "none" }, borderStyle]}
        />
      </View>
    </HeaderContext.Provider>
  )
}

function HeaderTitle({
  subtitle,
  className,
  style,
  children,
  ...props
}: ViewProps & {
  subtitle?: React.ReactNode
}) {
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
      {...props}
      className={cn("shrink items-center px-2", className)}
      style={[style, animatedStyle]}
    >
      {wrapText(children, "text-base font-semibold")}
      {subtitle !== undefined
        ? wrapText(subtitle, "text-xs text-muted-foreground")
        : null}
    </AnimatedView>
  )
}

function HeaderLargeTitle({
  subtitle,
  className,
  style,
  children,
  onLayout,
  ...props
}: ViewProps & {
  subtitle?: React.ReactNode
}) {
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
      {...props}
      className={cn("gap-0.5 px-4 pt-0.5 pb-2", className)}
      style={[
        { transformOrigin: I18nManager.isRTL ? "right" : "left" },
        style,
        animatedStyle,
      ]}
      onLayout={(event) => {
        if (scroll) {
          scroll.largeTitleHeight.value = event.nativeEvent.layout.height
        }
        onLayout?.(event)
      }}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text role="heading" className="text-3xl font-bold">
          {children}
        </Text>
      ) : (
        children
      )}
      {subtitle !== undefined
        ? wrapText(subtitle, "text-sm text-muted-foreground")
        : null}
    </AnimatedView>
  )
}

function HeaderBack({
  className,
  children,
  accessibilityLabel,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children"> & {
  children?: React.ReactNode
}) {
  return (
    <Pressable
      role="button"
      hitSlop={4}
      accessibilityLabel={
        accessibilityLabel ??
        (typeof children === "string" ? children : undefined) ??
        "Back"
      }
      className={cn(
        "h-9 shrink flex-row items-center gap-0.5 rounded-full ps-0.5 pe-3 active:opacity-80",
        children === undefined && "pe-0.5",
        className
      )}
      {...props}
    >
      <Icon
        as={CaretLeftIcon}
        weight="bold"
        className={cn("size-6 text-primary", I18nManager.isRTL && "rotate-180")}
      />
      {wrapText(children, "shrink text-base text-primary")}
    </Pressable>
  )
}

function HeaderActions({
  side = "trailing",
  className,
  ...props
}: ViewProps & {
  side?: "leading" | "trailing"
}) {
  return (
    <View
      className={cn(
        "flex-row items-center gap-1",
        side === "leading" ? "justify-start" : "justify-end",
        className
      )}
      {...props}
    />
  )
}

function HeaderScrollView({
  scroll,
  className,
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
        className={cn("flex-1", className)}
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
