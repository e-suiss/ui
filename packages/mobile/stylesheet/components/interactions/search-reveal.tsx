import { MagnifyingGlassIcon, XCircleIcon } from "phosphor-react-native"
import * as React from "react"
import {
  type LayoutChangeEvent,
  Pressable,
  type ScrollView,
  type ScrollViewProps,
  StyleSheet,
  TextInput,
  View,
  type ViewProps,
} from "react-native"
import Animated, {
  type SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import { Icon } from "@/components/ui/icon"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: { flex: 1 },
  field: { paddingHorizontal: 16, paddingBottom: 8 },
  box: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.lg,
    paddingHorizontal: 8,
  },
  icon: { flexShrink: 0 },
  input: {
    height: "100%",
    minWidth: 0,
    flex: 1,
    paddingVertical: 0,
    ...fontSize.base,
  },
  clear: {
    marginEnd: -4,
    width: 28,
    height: 28,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
})

type SearchRevealContextProps = {
  offset: SharedValue<number>
  fieldHeight: number
  viewportHeight: number
  setFieldHeight: (height: number) => void
  setHasQuery: (hasQuery: boolean) => void
  reveal: () => void
}

const SearchRevealContext =
  React.createContext<SearchRevealContextProps | null>(null)

function useSearchReveal(componentName: string) {
  const context = React.useContext(SearchRevealContext)
  if (!context) {
    throw new Error(`${componentName} must be used within a <SearchReveal />`)
  }
  return context
}

function SearchReveal({
  style,
  onLayout,
  children,
  ...props
}: Omit<ScrollViewProps, "onScroll">) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const offset = useSharedValue(0)
  const [fieldHeight, setFieldHeight] = React.useState(0)
  const [viewportHeight, setViewportHeight] = React.useState(0)
  const [hasQuery, setHasQuery] = React.useState(false)
  const positioned = React.useRef(false)

  const onScroll = useAnimatedScrollHandler((event) => {
    offset.value = event.contentOffset.y
  })

  React.useEffect(() => {
    if (positioned.current || fieldHeight <= 0 || viewportHeight <= 0) return
    positioned.current = true
    if (hasQuery) return
    const frame = requestAnimationFrame(() => {
      const scroll = scrollRef.current as ScrollView | null
      scroll?.scrollTo({ y: fieldHeight, animated: false })
    })
    return () => cancelAnimationFrame(frame)
  }, [fieldHeight, viewportHeight, hasQuery, scrollRef])

  const reveal = React.useCallback(() => {
    const scroll = scrollRef.current as ScrollView | null
    scroll?.scrollTo({ y: 0, animated: true })
  }, [scrollRef])

  const contextValue = React.useMemo(
    () => ({
      offset,
      fieldHeight,
      viewportHeight,
      setFieldHeight,
      setHasQuery,
      reveal,
    }),
    [offset, fieldHeight, viewportHeight, reveal]
  )

  return (
    <SearchRevealContext.Provider value={contextValue}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToOffsets={
          fieldHeight > 0 && !hasQuery ? [0, fieldHeight] : undefined
        }
        snapToEnd={false}
        keyboardShouldPersistTaps="handled"
        style={[styles.root, style]}
        onLayout={(event: LayoutChangeEvent) => {
          setViewportHeight(event.nativeEvent.layout.height)
          onLayout?.(event)
        }}
        {...props}
      >
        {children}
      </Animated.ScrollView>
    </SearchRevealContext.Provider>
  )
}

function SearchRevealField({
  value,
  onValueChange,
  placeholder = "Search",
  style,
  onFocus,
  ...props
}: Omit<React.ComponentProps<typeof TextInput>, "value" | "onChangeText"> & {
  value: string
  onValueChange: (value: string) => void
}) {
  const { colors } = useTheme()
  const { offset, fieldHeight, setFieldHeight, setHasQuery, reveal } =
    useSearchReveal("SearchRevealField")
  const inputRef = React.useRef<TextInput>(null)

  React.useEffect(() => setHasQuery(value.length > 0), [value, setHasQuery])

  const revealStyle = useAnimatedStyle(() => {
    if (fieldHeight <= 0) return { opacity: 1 }
    return {
      opacity: Math.min(Math.max(1 - offset.value / fieldHeight, 0), 1),
    }
  }, [fieldHeight])

  return (
    <Animated.View
      style={[styles.field, revealStyle]}
      onLayout={(event) => setFieldHeight(event.nativeEvent.layout.height)}
    >
      <View style={[styles.box, { backgroundColor: colors.secondary }]}>
        <Icon
          as={MagnifyingGlassIcon}
          size={18}
          color={colors.mutedForeground}
          style={styles.icon}
        />
        <TextInput
          ref={inputRef}
          role="searchbox"
          value={value}
          placeholder={placeholder}
          accessibilityLabel={placeholder}
          onChangeText={onValueChange}
          onFocus={(event) => {
            reveal()
            onFocus?.(event)
          }}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          style={[styles.input, { color: colors.foreground }, style]}
          placeholderTextColor={colors.mutedForeground}
          cursorColor={colors.primary}
          selectionColor={colors.primary}
          {...props}
        />
        {value ? (
          <Pressable
            role="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
            onPress={() => {
              onValueChange("")
              inputRef.current?.focus()
            }}
            style={styles.clear}
          >
            <Icon
              as={XCircleIcon}
              weight="fill"
              size={18}
              color={colors.mutedForeground}
            />
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  )
}

function SearchRevealContent({ style, ...props }: ViewProps) {
  const { viewportHeight } = useSearchReveal("SearchRevealContent")
  return <View style={[{ minHeight: viewportHeight }, style]} {...props} />
}

export { SearchReveal, SearchRevealContent, SearchRevealField }
