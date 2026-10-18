import * as React from "react"
import { jsx, jsxs } from "react/jsx-runtime"
import {
  AccessibilityInfo,
  Appearance,
  type BoxShadowValue,
  type StyleProp,
  Text,
  useColorScheme,
  View,
  type ViewStyle,
} from "react-native"
import Animated, {
  Easing,
  LinearTransition,
  ReduceMotion,
  type SharedValue,
  useAnimatedProps,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import Svg, {
  Circle,
  Defs,
  Mask,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Image as SvgImage,
} from "react-native-svg"
import { useEffectEvent } from "@/components/primitives/hooks"
import { Portal } from "@/components/primitives/portal"
import { Toggle as TogglePrimitive } from "@/components/primitives/toggle"
import {
  ToggleGroupIndicator as ToggleGroupIndicatorPrimitive,
  ToggleGroup as ToggleGroupPrimitive,
  type ToggleGroupState,
} from "@/components/primitives/toggle-group"

const light = {
  background: "#ffffff",
  foreground: "#1d1d1f",
  card: "#ffffff",
  cardForeground: "#1d1d1f",
  popover: "#ffffff",
  popoverForeground: "#1d1d1f",
  primary: "#0071e3",
  primaryForeground: "#ffffff",
  secondary: "rgba(0, 0, 0, 0.04)",
  secondaryForeground: "#1d1d1f",
  muted: "#f5f5f7",
  mutedForeground: "#6e6e73",
  accent: "rgba(0, 0, 0, 0.06)",
  accentForeground: "#1d1d1f",
  destructive: "#d0000a",
  border: "#d2d2d7",
  input: "#86868b",
  ring: "#0071e3",
  chart1: "#007aff",
  chart2: "#30b0c7",
  chart3: "#5856d6",
  chart4: "#ff9500",
  chart5: "#8e8e93",
  sidebar: "#f5f5f7",
  sidebarForeground: "#1d1d1f",
  sidebarPrimary: "#0071e3",
  sidebarPrimaryForeground: "#ffffff",
  sidebarAccent: "rgba(0, 0, 0, 0.06)",
  sidebarAccentForeground: "#1d1d1f",
  sidebarBorder: "#d2d2d7",
  sidebarRing: "#0071e3",
  menu: "#ffffff",
  menuForeground: "#1d1d1f",
  menuMutedForeground: "#6e6e73",
  menuAccent: "rgba(0, 0, 0, 0.06)",
  menuAccentForeground: "#1d1d1f",
  menuBorder: "#d2d2d7",
}

type ThemeColors = typeof light

const dark: ThemeColors = {
  background: "#000000",
  foreground: "#f5f5f7",
  card: "#1d1d1f",
  cardForeground: "#f5f5f7",
  popover: "#1d1d1f",
  popoverForeground: "#f5f5f7",
  primary: "#2997ff",
  primaryForeground: "#ffffff",
  secondary: "rgba(255, 255, 255, 0.1)",
  secondaryForeground: "#f5f5f7",
  muted: "#161617",
  mutedForeground: "#a1a1a6",
  accent: "rgba(255, 255, 255, 0.1)",
  accentForeground: "#f5f5f7",
  destructive: "#ff5447",
  border: "#424245",
  input: "#6e6e73",
  ring: "#0071e3",
  chart1: "#0a84ff",
  chart2: "#40c8e0",
  chart3: "#5e5ce6",
  chart4: "#ff9f0a",
  chart5: "#8e8e93",
  sidebar: "#161617",
  sidebarForeground: "#f5f5f7",
  sidebarPrimary: "#2997ff",
  sidebarPrimaryForeground: "#ffffff",
  sidebarAccent: "rgba(255, 255, 255, 0.1)",
  sidebarAccentForeground: "#f5f5f7",
  sidebarBorder: "#424245",
  sidebarRing: "#0071e3",
  menu: "#1d1d1f",
  menuForeground: "#f5f5f7",
  menuMutedForeground: "#a1a1a6",
  menuAccent: "rgba(255, 255, 255, 0.1)",
  menuAccentForeground: "#f5f5f7",
  menuBorder: "#424245",
}

const palette = {
  black: "#000000",
  white: "#ffffff",
  red500: "#fb2c36",
  orange500: "#ff6900",
  amber400: "#ffb900",
  amber500: "#fe9a00",
  amber600: "#e17100",
  yellow500: "#f0b100",
  green400: "#05df72",
  green500: "#00c950",
  green600: "#00a63e",
  teal400: "#00d5be",
  teal500: "#00bba7",
  cyan500: "#00b8db",
  blue500: "#2b7fff",
  indigo500: "#615fff",
  purple500: "#ad46ff",
  pink500: "#f6339a",
  zinc500: "#71717b",
}

const radius = {
  xs: 3,
  sm: 5,
  md: 8,
  lg: 10,
  xl: 12,
  "2xl": 18,
  "3xl": 28,
  full: 9999,
}

const fontSize = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
  "2xl": { fontSize: 24, lineHeight: 32 },
  "3xl": { fontSize: 30, lineHeight: 36 },
}

const shadow = {
  xs: { boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
  sm: {
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  },
  md: {
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  },
  lg: {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  },
  xl: {
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  },
} satisfies Record<string, { boxShadow: string | BoxShadowValue[] }>

const metrics = {
  radius: {
    button: 0,
    input: 0,
    textarea: 0,
    card: 0,
    dialog: 0,
    popover: 0,
    menu: 0,
    menuItem: 0,
    badge: 0,
    checkbox: 0,
    tabs: 0,
    tabsTrigger: 0,
    toggle: 0,
    alert: 0,
    item: 0,
  },
  height: {
    buttonXs: 24,
    buttonSm: 28,
    button: 32,
    buttonLg: 36,
    input: 32,
  },
  paddingX: {
    buttonXs: 8,
    buttonSm: 10,
    button: 10,
    buttonLg: 10,
    input: 10,
    menuItem: 8,
  },
  paddingY: {
    menuItem: 8,
  },
  padding: {
    dialog: 16,
    popover: 10,
    menu: 0,
  },
  fontWeight: {
    button: "500" as const,
    title: "500" as const,
  },
  shadow: {
    card: undefined,
    dialog: undefined,
    popover: {
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    },
    menu: {
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    },
  },
}

type Theme = "light" | "dark" | "system"

type ResolvedTheme = "light" | "dark"

type ThemeTransitionEffect = "circle" | "rectangle" | "polygon" | "circle-blur"

type ThemeTransitionOrigin =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center"
  | "bottom-up"
  | "top-down"
  | "left-right"
  | "right-left"

type ThemeTransition = {
  effect?: ThemeTransitionEffect
  origin?: ThemeTransitionOrigin
  blur?: boolean
}

type ThemeStorage = {
  getItem: (key: string) => string | null | Promise<string | null>
  setItem: (key: string, value: string) => void | Promise<void>
}

type ThemeSnapshot = () => Promise<{ uri: string }>

type ThemeReveal = {
  id: number
  uri: string
  theme: Theme
  target: ResolvedTheme
  transition: ThemeTransition
}

const THEMES: readonly Theme[] = ["light", "dark", "system"]

const LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
}

const CENTER: readonly [number, number] = [0.5, 0.5]

const POINTS: Partial<
  Record<ThemeTransitionOrigin, readonly [number, number]>
> = {
  center: CENTER,
  "top-left": [0, 0],
  "top-right": [1, 0],
  "bottom-left": [0, 1],
  "bottom-right": [1, 1],
  "top-center": [0.5, 0],
  "bottom-center": [0.5, 1],
}

const FULL = [0, 0, 1, 0, 1, 1, 0, 1]

const BOTTOM_UP = [0, 1, 1, 1, 1, 1, 0, 1]

const EDGES: Partial<Record<ThemeTransitionOrigin, number[]>> = {
  "bottom-up": BOTTOM_UP,
  "top-down": [0, 0, 1, 0, 1, 0, 0, 0],
  "left-right": [0, 0, 0, 0, 0, 1, 0, 1],
  "right-left": [1, 0, 1, 0, 1, 1, 1, 1],
}

type Diagonal = Record<ResolvedTheme, readonly [number[], number[]]>

const TOP_LEFT: Diagonal = {
  dark: [
    [0.5, -0.71, -0.5, 0.71, -0.5, 0.71, 0.5, -0.71],
    [0.5, -0.71, -0.5, 0.71, 0.5, 1.71, 1.71, 0.5],
  ],
  light: [
    [1.71, 0.5, 0.5, 1.71, 0.5, 1.71, 1.71, 0.5],
    [1.71, 0.5, 0.5, 1.71, -0.5, 0.71, 0.5, -0.71],
  ],
}

const DIAGONALS: Partial<Record<ThemeTransitionOrigin, Diagonal>> = {
  "top-left": TOP_LEFT,
  "top-right": {
    dark: [
      [1.5, -0.71, 2.5, 0.71, 2.5, 0.71, 1.5, -0.71],
      [1.5, -0.71, 2.5, 0.71, 0.5, 1.71, -0.71, 0.5],
    ],
    light: [
      [-0.71, 0.5, 0.5, 1.71, 0.5, 1.71, -0.71, 0.5],
      [-0.71, 0.5, 0.5, 1.71, 2.5, 0.71, 1.5, -0.71],
    ],
  },
}

const DURATION = 900

const EASE = Easing.bezier(0.65, 0, 0.35, 1)

const BLUR = 8

const FEATHER = [4, 8 / 3, 4 / 3]

const SOFT_EDGE = 22 / 40

const SOFT_CORE = 14 / 22

const SOFT_SCALE = 3.5

const READY_TIMEOUT = 1000

const MASK_ID = "theme-reveal-mask"

const GRADIENT_ID = "theme-reveal-edge"

type RevealGeometry = {
  kind: "circle" | "polygon" | "soft"
  from: number[]
  to: number[]
  duration: number
}

function scalePoints(points: number[], width: number, height: number) {
  return points.map((value, index) => value * (index % 2 ? height : width))
}

function revealGeometry(
  { effect = "circle", origin }: ThemeTransition,
  target: ResolvedTheme,
  width: number,
  height: number
): RevealGeometry {
  if (effect === "rectangle") {
    return {
      kind: "polygon",
      from: scalePoints(
        EDGES[origin ?? "bottom-up"] ?? BOTTOM_UP,
        width,
        height
      ),
      to: scalePoints(FULL, width, height),
      duration: DURATION,
    }
  }
  if (effect === "polygon") {
    const [from, to] = (DIAGONALS[origin ?? "top-left"] ?? TOP_LEFT)[target]
    return {
      kind: "polygon",
      from: scalePoints(from, width, height),
      to: scalePoints(to, width, height),
      duration: DURATION,
    }
  }
  const [x, y] = POINTS[origin ?? "center"] ?? CENTER
  if (effect === "circle-blur") {
    return {
      kind: "soft",
      from: [x, y, 0],
      to: [x, y, SOFT_SCALE * Math.max(width, height)],
      duration: DURATION,
    }
  }
  const centered = x === CENTER[0] && y === CENTER[1]
  const radius = ((centered ? 1 : 1.5) * Math.hypot(width, height)) / Math.SQRT2
  return {
    kind: "circle",
    from: [x * width, y * height, 0],
    to: [x * width, y * height, radius],
    duration: DURATION,
  }
}

const AnimatedPath = Animated.createAnimatedComponent(Path)

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

function ThemeRevealEdge({
  geometry,
  progress,
  blur,
  spread,
}: {
  geometry: RevealGeometry
  progress: SharedValue<number>
  blur: SharedValue<number>
  spread: number
}) {
  const { kind, from, to } = geometry
  const animatedProps = useAnimatedProps(() => {
    const amount = progress.value
    const p: number[] = []
    for (let index = 0; index < from.length; index++) {
      const start = from[index] ?? 0
      p.push(start + ((to[index] ?? start) - start) * amount)
    }
    const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0] = p
    return {
      d:
        kind === "circle"
          ? `M${a - c} ${b}A${c} ${c} 0 1 0 ${a + c} ${b}A${c} ${c} 0 1 0 ${a - c} ${b}Z`
          : `M${a} ${b}L${c} ${d}L${e} ${f}L${g} ${h}Z`,
      strokeWidth: blur.value * spread,
    }
  })
  return spread
    ? jsx(AnimatedPath, {
        animatedProps,
        fill: "none",
        stroke: "black",
        strokeOpacity: 1 / FEATHER.length,
        strokeLinejoin: "round",
      })
    : jsx(AnimatedPath, { animatedProps, fill: "black" })
}

function ThemeRevealSoft({
  geometry,
  progress,
  blur,
  width,
  height,
}: {
  geometry: RevealGeometry
  progress: SharedValue<number>
  blur: SharedValue<number>
  width: number
  height: number
}) {
  const [x = 0, y = 0] = geometry.from
  const end = geometry.to[2] ?? 0
  const animatedProps = useAnimatedProps(() => {
    const size = end * progress.value
    return {
      cx: (width - size) * x + size / 2,
      cy: (height - size) * y + size / 2,
      r: size * SOFT_EDGE + blur.value * 2,
    }
  })
  return jsx(AnimatedCircle, {
    animatedProps,
    fill: `url(#${GRADIENT_ID})`,
  })
}

function ThemeRevealOverlay({
  uri,
  transition,
  target,
  onReady,
  onDone,
}: {
  uri: string
  transition: ThemeTransition
  target: ResolvedTheme
  onReady: () => void
  onDone: () => void
}) {
  const [size, setSize] = React.useState<{
    width: number
    height: number
  } | null>(null)
  const [loaded, setLoaded] = React.useState(false)
  const blurred = transition.blur === true
  const progress = useSharedValue(0)
  const blur = useSharedValue(blurred ? BLUR : 0)
  const ready = useEffectEvent(onReady)
  const done = useEffectEvent(onDone)
  const geometry = size
    ? revealGeometry(transition, target, size.width, size.height)
    : null
  const duration = geometry?.duration ?? 0
  const started = loaded && geometry !== null

  React.useEffect(() => {
    if (!started) return
    ready()
    let timer: ReturnType<typeof setTimeout> | undefined
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        progress.value = withTiming(1, { duration, easing: EASE })
        if (blurred) {
          blur.value = withSequence(
            withTiming(BLUR / 2, { duration: duration / 2, easing: EASE }),
            withTiming(0, { duration: duration / 2, easing: EASE })
          )
        }
        timer = setTimeout(done, duration)
      })
    })
    return () => {
      cancelAnimationFrame(frame)
      if (timer) clearTimeout(timer)
    }
  }, [started, duration, blurred, progress, blur, ready, done])

  let shape: React.ReactNode = null
  if (geometry?.kind === "soft") {
    shape = jsx(ThemeRevealSoft, {
      geometry,
      progress,
      blur,
      width: size?.width ?? 0,
      height: size?.height ?? 0,
    })
  } else if (geometry) {
    shape = jsxs(React.Fragment, {
      children: [
        blurred
          ? FEATHER.map((spread) =>
              jsx(ThemeRevealEdge, { geometry, progress, blur, spread }, spread)
            )
          : null,
        jsx(ThemeRevealEdge, { geometry, progress, blur, spread: 0 }),
      ],
    })
  }

  return jsx(View, {
    pointerEvents: "none",
    accessibilityElementsHidden: true,
    importantForAccessibility: "no-hide-descendants",
    style: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
    onLayout: (event: {
      nativeEvent: { layout: { width: number; height: number } }
    }) => {
      const { width, height } = event.nativeEvent.layout
      setSize((current) =>
        current?.width === width && current.height === height
          ? current
          : { width, height }
      )
    },
    children:
      size && shape
        ? jsxs(Svg, {
            width: size.width,
            height: size.height,
            children: [
              jsxs(Defs, {
                children: [
                  jsxs(RadialGradient, {
                    id: GRADIENT_ID,
                    children: [
                      jsx(Stop, { offset: 0, stopColor: "black" }),
                      jsx(Stop, { offset: SOFT_CORE, stopColor: "black" }),
                      jsx(Stop, {
                        offset: 1,
                        stopColor: "black",
                        stopOpacity: 0,
                      }),
                    ],
                  }),
                  jsxs(Mask, {
                    id: MASK_ID,
                    maskUnits: "userSpaceOnUse",
                    x: 0,
                    y: 0,
                    width: size.width,
                    height: size.height,
                    children: [
                      jsx(Rect, {
                        width: size.width,
                        height: size.height,
                        fill: "white",
                      }),
                      shape,
                    ],
                  }),
                ],
              }),
              jsx(SvgImage, {
                href: uri,
                width: size.width,
                height: size.height,
                preserveAspectRatio: "none",
                mask: `url(#${MASK_ID})`,
                onLoad: () => setLoaded(true),
              }),
            ],
          })
        : null,
  })
}

const memory = new Map<string, string>()

const memoryStorage: ThemeStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => {
    memory.set(key, value)
  },
}

const store = {
  theme: "system" as Theme,
  storage: memoryStorage,
  storageKey: "theme",
  snapshot: undefined as ThemeSnapshot | undefined,
  request: 0,
  ready: 0,
  reveal: null as ThemeReveal | null,
  listeners: new Set<() => void>(),
}

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system"
}

function subscribe(listener: () => void) {
  store.listeners.add(listener)
  return () => {
    store.listeners.delete(listener)
  }
}

function emit() {
  for (const listener of store.listeners) listener()
}

function getTheme() {
  return store.theme
}

function getReveal() {
  return store.reveal
}

function applyTheme(theme: Theme) {
  if (store.theme === theme) return
  store.theme = theme
  Appearance.setColorScheme(theme === "system" ? "unspecified" : theme)
  emit()
}

function setReveal(reveal: ThemeReveal | null) {
  if (store.reveal === reveal) return
  store.reveal = reveal
  emit()
}

function commitTheme(request: number, theme: Theme) {
  if (request !== store.request) return
  setReveal(null)
  applyTheme(theme)
}

function persistTheme(theme: Theme) {
  try {
    Promise.resolve(store.storage.setItem(store.storageKey, theme)).catch(
      () => undefined
    )
  } catch {
    return
  }
}

function setTheme(theme: Theme, transition?: ThemeTransition) {
  persistTheme(theme)
  const request = ++store.request
  const current: ResolvedTheme =
    Appearance.getColorScheme() === "dark" ? "dark" : "light"
  let known: ResolvedTheme | null = null
  if (theme !== "system") known = theme
  else if (store.theme === "system") known = current
  const snapshot = store.snapshot
  if (!transition || !snapshot || known === current) {
    commitTheme(request, theme)
    return
  }
  const target = known ?? (current === "dark" ? "light" : "dark")
  AccessibilityInfo.isReduceMotionEnabled()
    .then((reduced) => (reduced ? null : snapshot()))
    .then((shot) => {
      if (request !== store.request) return
      if (!shot?.uri) {
        commitTheme(request, theme)
        return
      }
      setReveal({ id: request, uri: shot.uri, theme, target, transition })
    })
    .catch(() => commitTheme(request, theme))
}

function readStoredTheme(storage: ThemeStorage, storageKey: string) {
  try {
    return Promise.resolve(storage.getItem(storageKey)).catch(() => null)
  } catch {
    return Promise.resolve(null)
  }
}

function ThemeRevealHost({ name }: { name: string }) {
  const reveal = React.useSyncExternalStore(subscribe, getReveal)

  React.useEffect(() => {
    if (!reveal) return
    const timer = setTimeout(() => {
      if (store.ready !== reveal.id) commitTheme(reveal.id, reveal.theme)
    }, READY_TIMEOUT)
    return () => clearTimeout(timer)
  }, [reveal])

  if (!reveal) return null
  return jsx(Portal, {
    name,
    children: jsx(
      ThemeRevealOverlay,
      {
        uri: reveal.uri,
        transition: reveal.transition,
        target: reveal.target,
        onReady: () => {
          store.ready = reveal.id
          if (reveal.id === store.request) applyTheme(reveal.theme)
        },
        onDone: () => {
          if (store.reveal === reveal) setReveal(null)
        },
      },
      reveal.id
    ),
  })
}

function ThemeProvider({
  defaultTheme = "system",
  storage = memoryStorage,
  storageKey = "theme",
  snapshot,
  children,
}: {
  defaultTheme?: Theme
  storage?: ThemeStorage
  storageKey?: string
  snapshot?: ThemeSnapshot
  children?: React.ReactNode
}) {
  const defaultRef = React.useRef(defaultTheme)
  const name = `theme-reveal-${React.useId()}`

  React.useLayoutEffect(() => {
    let active = true
    store.storage = storage
    store.storageKey = storageKey
    const initial = store.theme
    applyTheme(defaultRef.current)
    readStoredTheme(storage, storageKey).then((stored) => {
      if (active && store.theme === defaultRef.current && isTheme(stored)) {
        applyTheme(stored)
      }
    })
    return () => {
      active = false
      store.storage = memoryStorage
      store.storageKey = "theme"
      applyTheme(initial)
    }
  }, [storage, storageKey])

  React.useLayoutEffect(() => {
    store.snapshot = snapshot
    return () => {
      store.snapshot = undefined
      setReveal(null)
    }
  }, [snapshot])

  return jsxs(React.Fragment, {
    children: [children, jsx(ThemeRevealHost, { name })],
  })
}

function useTheme() {
  const scheme = useColorScheme()
  const theme = React.useSyncExternalStore(subscribe, getTheme)
  const systemTheme: ResolvedTheme = scheme === "dark" ? "dark" : "light"
  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme
  const isDark = resolvedTheme === "dark"
  return {
    colors: isDark ? dark : light,
    isDark,
    radius,
    fontSize,
    shadow,
    metrics,
    theme,
    resolvedTheme,
    setTheme,
  }
}

const INDICATOR_TRANSITION = LinearTransition.duration(300)
  .easing(Easing.bezier(0.32, 0.72, 0, 1))
  .reduceMotion(ReduceMotion.System)

function ThemeToggle({
  labels,
  effect,
  origin,
  blur,
  style,
  ...props
}: Omit<
  React.ComponentProps<typeof ToggleGroupPrimitive>,
  "children" | "defaultValue" | "multiple" | "onValueChange" | "value"
> &
  ThemeTransition & {
    labels?: Partial<Record<Theme, string>>
  }) {
  const { colors, isDark, theme } = useTheme()
  const transition =
    effect !== undefined || origin !== undefined || blur !== undefined
      ? { effect, origin, blur }
      : undefined
  return jsxs(ToggleGroupPrimitive, {
    accessibilityLabel: "Theme",
    value: [theme],
    onValueChange: (value: string[], details: { cancel: () => void }) => {
      const next = value[0]
      if (!isTheme(next)) {
        details.cancel()
        return
      }
      setTheme(next, transition)
    },
    ...props,
    style: (state: ToggleGroupState): StyleProp<ViewStyle> => [
      {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 4,
        padding: 4,
        borderRadius: radius.xl,
        backgroundColor: colors.secondary,
      },
      state.disabled && { opacity: 0.5 },
      typeof style === "function" ? style(state) : style,
    ],
    children: [
      jsx(
        ToggleGroupIndicatorPrimitive,
        {
          style: [
            {
              borderRadius: radius.md,
              backgroundColor: isDark ? colors.border : colors.card,
            },
            shadow.sm,
          ],
          render: jsx(Animated.View, { layout: INDICATOR_TRANSITION }),
        },
        "indicator"
      ),
      ...THEMES.map((value) =>
        jsx(
          TogglePrimitive,
          {
            value,
            style: {
              height: 36,
              minWidth: 36,
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 12,
              borderRadius: radius.md,
            },
            children: jsx(Text, {
              style: {
                ...fontSize.sm,
                color:
                  theme === value
                    ? colors.cardForeground
                    : colors.mutedForeground,
              },
              children: labels?.[value] ?? LABELS[value],
            }),
          },
          value
        )
      ),
    ],
  })
}

export type {
  ResolvedTheme,
  Theme,
  ThemeColors,
  ThemeStorage,
  ThemeTransition,
  ThemeTransitionEffect,
  ThemeTransitionOrigin,
}
export {
  dark,
  fontSize,
  light,
  metrics,
  palette,
  radius,
  shadow,
  ThemeProvider,
  ThemeToggle,
  useTheme,
}
