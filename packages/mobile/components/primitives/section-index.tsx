import * as React from "react"
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type HostInstance,
  type LayoutChangeEvent,
  ScrollView,
  View,
} from "react-native"
import { useHaptics } from "./haptics"
import type { BaseUIComponentProps } from "./types"
import { useRender } from "./use-render"

const LETTERS = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "#"]

const ROW_HEIGHT = 16

interface SectionIndexItem {
  key: string
  label: string
}

interface RootContextValue {
  height: number
  scrollRef: React.RefObject<ScrollView | null>
  contentRef: React.RefObject<View | null>
  registerSection: (value: string, node: HostInstance | null) => void
  scrollToSection: (letters: string[], index: number) => void
}

interface RootState {
  height: number
}

interface SectionState {
  value: string
}

interface BarState {
  items: SectionIndexItem[]
  index: number
  letter: string | undefined
  dragging: boolean
  dragY: number
}

type RootProps = BaseUIComponentProps<typeof View, RootState>

type ScrollViewProps = Omit<
  React.ComponentProps<typeof ScrollView>,
  "className" | "children"
> & {
  className?: string | undefined
  children?: React.ReactNode
}

type SectionProps = BaseUIComponentProps<typeof View, SectionState> & {
  value: string
}

type BarProps = Omit<
  BaseUIComponentProps<typeof View, BarState>,
  "children"
> & {
  letters?: string[] | undefined
  onValueChange?: ((value: string) => void) | undefined
  children?: React.ReactNode | ((state: BarState) => React.ReactNode)
}

const RootContext = React.createContext<RootContextValue | null>(null)

function accessibilityStep(event: AccessibilityActionEvent) {
  if (event.nativeEvent.actionName === "increment") return 1
  if (event.nativeEvent.actionName === "decrement") return -1
  return 0
}

function useRootContext(componentName = "SectionIndex part") {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      `${componentName} must be rendered inside SectionIndex.Root`
    )
  }
  return context
}

function displayItems(letters: string[], capacity: number) {
  if (capacity >= letters.length) {
    return letters.map((letter) => ({ key: letter, label: letter }))
  }
  const slots = Math.max(3, capacity % 2 === 0 ? capacity - 1 : capacity)
  const letterAt = (slot: number) =>
    letters[Math.round((slot / (slots - 1)) * (letters.length - 1))] ?? ""
  return Array.from({ length: slots }, (_, slot) =>
    slot % 2 === 0
      ? { key: letterAt(slot), label: letterAt(slot) }
      : { key: `after-${letterAt(slot - 1)}`, label: "•" }
  )
}

function Root({
  render,
  className,
  style,
  ref,
  onLayout,
  ...elementProps
}: RootProps) {
  const [height, setHeight] = React.useState(0)
  const scrollRef = React.useRef<ScrollView>(null)
  const contentRef = React.useRef<View>(null)
  const sectionsRef = React.useRef(new Map<string, HostInstance>())

  const registerSection = React.useCallback(
    (value: string, node: HostInstance | null) => {
      if (node) sectionsRef.current.set(value, node)
      else sectionsRef.current.delete(value)
    },
    []
  )

  const scrollToSection = React.useCallback(
    (letters: string[], index: number) => {
      const sections = [...sectionsRef.current.entries()]
        .map(([value, node]) => ({
          node,
          position: letters.indexOf(value),
        }))
        .filter((section) => section.position !== -1)
        .sort((a, b) => a.position - b.position)
      const target =
        sections.find((section) => section.position >= index) ?? sections.at(-1)
      const content = contentRef.current
      if (!target || !content) return
      target.node.measureLayout(content, (_x, y) => {
        scrollRef.current?.scrollTo({ x: 0, y, animated: false })
      })
    },
    []
  )

  const context = React.useMemo<RootContextValue>(
    () => ({ height, scrollRef, contentRef, registerSection, scrollToSection }),
    [height, registerSection, scrollToSection]
  )

  const state = React.useMemo<RootState>(() => ({ height }), [height])

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        onLayout: (event: LayoutChangeEvent) => {
          const next = event.nativeEvent.layout.height
          setHeight((current) => (current === next ? current : next))
          onLayout?.(event)
        },
      },
      elementProps,
    ],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "SectionIndexRoot"

function SectionIndexScrollView({ children, ...props }: ScrollViewProps) {
  const { scrollRef, contentRef } = useRootContext("SectionIndex.ScrollView")
  return (
    <ScrollView ref={scrollRef} {...props}>
      <View ref={contentRef} collapsable={false}>
        {children}
      </View>
    </ScrollView>
  )
}

SectionIndexScrollView.displayName = "SectionIndexScrollView"

function Section({
  value,
  render,
  className,
  style,
  ref,
  ...elementProps
}: SectionProps) {
  const { registerSection } = useRootContext("SectionIndex.Section")
  const nodeRef = React.useRef<View>(null)

  React.useEffect(() => {
    registerSection(value, nodeRef.current)
    return () => registerSection(value, null)
  }, [value, registerSection])

  const state = React.useMemo<SectionState>(() => ({ value }), [value])

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref: [ref, nodeRef],
    props: [{ collapsable: false }, elementProps],
  })
}

Section.displayName = "SectionIndexSection"

interface BarRect {
  pageY: number
  height: number
}

const BAR_ACTIONS = [{ name: "increment" }, { name: "decrement" }]

function Bar({
  letters = LETTERS,
  onValueChange,
  accessibilityLabel = "Section index",
  render,
  className,
  style,
  ref,
  children,
  ...elementProps
}: BarProps) {
  const { height, scrollToSection } = useRootContext("SectionIndex.Bar")
  const haptics = useHaptics()
  const barRef = React.useRef<View>(null)
  const rectRef = React.useRef<BarRect | null>(null)
  const [current, setCurrent] = React.useState(0)
  const currentRef = React.useRef(0)
  const [drag, setDrag] = React.useState<{ index: number; y: number } | null>(
    null
  )
  const draggingRef = React.useRef(false)
  const capacity =
    height > 0 ? Math.floor((height - ROW_HEIGHT) / ROW_HEIGHT) : letters.length
  const items = React.useMemo(
    () => displayItems(letters, capacity),
    [letters, capacity]
  )

  const jump = (index: number, fromTouch: boolean) => {
    const changed = index !== currentRef.current
    currentRef.current = index
    setCurrent(index)
    scrollToSection(letters, index)
    if (fromTouch) haptics.selection()
    const letter = letters[index]
    if (letter !== undefined && (changed || fromTouch)) onValueChange?.(letter)
  }

  const track = (pageY: number, first: boolean) => {
    const rect = rectRef.current
    if (!rect || rect.height <= 0) return
    const fraction = Math.min(
      Math.max((pageY - rect.pageY) / rect.height, 0),
      0.9999
    )
    const index = Math.floor(fraction * letters.length)
    const y = Math.min(Math.max(pageY - rect.pageY, 0), rect.height)
    setDrag({ index, y })
    if (first || index !== currentRef.current) jump(index, true)
  }

  const onGrant = (event: GestureResponderEvent) => {
    const pageY = event.nativeEvent.pageY
    draggingRef.current = true
    barRef.current?.measure((_x, _y, _width, barHeight, _pageX, barPageY) => {
      rectRef.current = { pageY: barPageY, height: barHeight }
      if (draggingRef.current) track(pageY, true)
    })
  }

  const onMove = (event: GestureResponderEvent) => {
    if (!draggingRef.current) return
    track(event.nativeEvent.pageY, false)
  }

  const onEnd = () => {
    draggingRef.current = false
    setDrag(null)
  }

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    const step = accessibilityStep(event)
    if (step === 0) return
    const next = Math.min(
      Math.max(currentRef.current + step, 0),
      letters.length - 1
    )
    if (next !== currentRef.current) jump(next, false)
  }

  const state = React.useMemo<BarState>(
    () => ({
      items,
      index: drag ? drag.index : current,
      letter: letters[drag ? drag.index : current],
      dragging: drag !== null,
      dragY: drag ? drag.y : 0,
    }),
    [items, drag, current, letters]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref: [ref, barRef],
    props: [
      {
        accessible: true,
        accessibilityRole: "adjustable",
        accessibilityLabel,
        accessibilityValue: { text: letters[current] },
        accessibilityActions: BAR_ACTIONS,
        onAccessibilityAction,
        hitSlop: { left: 12, top: 8, bottom: 8 },
        onStartShouldSetResponder: () => true,
        onMoveShouldSetResponder: () => true,
        onResponderTerminationRequest: () => false,
        onResponderGrant: onGrant,
        onResponderMove: onMove,
        onResponderRelease: onEnd,
        onResponderTerminate: onEnd,
        children: typeof children === "function" ? children(state) : children,
      },
      elementProps,
    ],
  })
}

Bar.displayName = "SectionIndexBar"

export type {
  BarProps,
  BarState,
  RootProps,
  RootState,
  ScrollViewProps,
  SectionIndexItem,
  SectionProps,
  SectionState,
}
export {
  Bar,
  LETTERS,
  Root,
  Section,
  SectionIndexScrollView as ScrollView,
  useRootContext,
}
