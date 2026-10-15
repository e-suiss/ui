import * as React from "react"
import {
  Platform,
  ScrollView,
  type ScrollViewProps,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native"
import { useComposedRefs } from "@/components/primitives/hooks"
import { useKeyboard } from "@/components/primitives/keyboard"

type KeyboardScrollViewContextValue = {
  scrollToFocused: () => void
}

const KeyboardScrollViewContext =
  React.createContext<KeyboardScrollViewContextValue | null>(null)

function KeyboardScrollView({
  bottomOffset = 16,
  keyboardShouldPersistTaps = "handled",
  keyboardDismissMode = Platform.OS === "ios" ? "interactive" : "on-drag",
  style,
  ref,
  onScroll,
  onLayout,
  onTouchEnd,
  scrollEventThrottle = 16,
  children,
  ...props
}: ScrollViewProps &
  React.RefAttributes<React.ComponentRef<typeof ScrollView>> & {
    bottomOffset?: number
  }) {
  const scrollRef = React.useRef<React.ComponentRef<typeof ScrollView>>(null)
  const composedRef = useComposedRefs(ref, scrollRef)
  const offsetRef = React.useRef(0)
  const keyboard = useKeyboard()
  const { height: windowHeight } = useWindowDimensions()
  const keyboardTop = windowHeight - keyboard.height
  const keyboardTopRef = React.useRef(keyboardTop)
  keyboardTopRef.current = keyboardTop
  const [frameBottom, setFrameBottom] = React.useState<number | null>(null)

  const measure = React.useCallback(() => {
    scrollRef.current
      ?.getNativeScrollRef()
      ?.measureInWindow((_x, y, _width, height) => {
        setFrameBottom(y + height)
      })
  }, [])

  const scrollToFocused = React.useCallback(() => {
    const input = TextInput.State.currentlyFocusedInput()
    const scroll = scrollRef.current
    const node = scroll?.getNativeScrollRef()
    if (!input || !scroll || !node || keyboard.height <= 0) return
    input.measureInWindow((_x, y, _width, height) => {
      node.measureInWindow((_sx, top, _sw, viewport) => {
        if (y < top || y >= top + viewport) return
        const visibleBottom =
          Math.min(top + viewport, keyboardTopRef.current) - bottomOffset
        const overflow = y + height - visibleBottom
        if (overflow <= 0) return
        scroll.scrollTo({ y: offsetRef.current + overflow, animated: true })
      })
    })
  }, [bottomOffset, keyboard.height])

  React.useEffect(() => {
    if (keyboard.height <= 0) return
    measure()
    const frame = requestAnimationFrame(scrollToFocused)
    return () => cancelAnimationFrame(frame)
  }, [keyboard.height, measure, scrollToFocused])

  const overlap =
    keyboard.height > 0 && frameBottom !== null
      ? Math.max(0, frameBottom - keyboardTop)
      : 0

  const context = React.useMemo(() => ({ scrollToFocused }), [scrollToFocused])

  return (
    <KeyboardScrollViewContext.Provider value={context}>
      <ScrollView
        ref={composedRef}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode={keyboardDismissMode}
        scrollEventThrottle={scrollEventThrottle}
        scrollIndicatorInsets={{ bottom: overlap }}
        style={[{ flex: 1 }, style]}
        onScroll={(event) => {
          offsetRef.current = event.nativeEvent.contentOffset.y
          onScroll?.(event)
        }}
        onLayout={(event) => {
          measure()
          onLayout?.(event)
        }}
        onTouchEnd={(event) => {
          if (keyboard.height > 0) setTimeout(scrollToFocused, 50)
          onTouchEnd?.(event)
        }}
        {...props}
      >
        {children}
        <View style={{ height: overlap }} />
      </ScrollView>
    </KeyboardScrollViewContext.Provider>
  )
}

export { KeyboardScrollView, KeyboardScrollViewContext }
