import { cn } from "cn"
import { MagnifyingGlassIcon, XCircleIcon } from "phosphor-react-native"
import * as React from "react"
import {
  type LayoutChangeEvent,
  Pressable,
  type ScrollView,
  type ScrollViewProps,
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
  className,
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
        className={cn("flex-1", className)}
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
  className,
  onFocus,
  ...props
}: Omit<React.ComponentProps<typeof TextInput>, "value" | "onChangeText"> & {
  value: string
  onValueChange: (value: string) => void
}) {
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
      className="px-4 pb-2"
      style={revealStyle}
      onLayout={(event) => setFieldHeight(event.nativeEvent.layout.height)}
    >
      <View className="h-9 flex-row items-center gap-1.5 rounded-lg bg-secondary px-2">
        <Icon
          as={MagnifyingGlassIcon}
          className="size-4.5 shrink-0 text-muted-foreground"
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
          className={cn(
            "h-full min-w-0 flex-1 py-0 text-base text-foreground",
            className
          )}
          placeholderTextColorClassName="accent-muted-foreground"
          cursorColorClassName="accent-primary"
          selectionColorClassName="accent-primary"
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
            className="-me-1 size-7 shrink-0 items-center justify-center rounded-full"
          >
            <Icon
              as={XCircleIcon}
              weight="fill"
              className="size-4.5 text-muted-foreground"
            />
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  )
}

function SearchRevealContent({ className, style, ...props }: ViewProps) {
  const { viewportHeight } = useSearchReveal("SearchRevealContent")
  return (
    <View
      className={className}
      style={[{ minHeight: viewportHeight }, style]}
      {...props}
    />
  )
}

export { SearchReveal, SearchRevealContent, SearchRevealField }
