import * as React from "react"
import { jsx, jsxs } from "react/jsx-runtime"
import {
  AccessibilityInfo,
  Appearance,
  type BoxShadowValue,
  Pressable,
  type StyleProp,
  Text,
  useColorScheme,
  View,
  type ViewStyle,
} from "react-native"
import Animated, {
  Easing,
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

const light = {
  surface: "#ffffff",
  surfaceSecondary: "#f5f5f7",
  surfaceTertiary: "#e8e8ed",
  surfaceRaised: "#ffffff",
  label: "#1d1d1f",
  labelSecondary: "#6e6e73",
  labelTertiary: "#86868b",
  labelQuaternary: "#d2d2d7",
  control: "rgba(0, 0, 0, 0.04)",
  controlPressed: "rgba(0, 0, 0, 0.12)",
  controlSelected: "#1d1d1f",
  controlDisabled: "rgba(0, 0, 0, 0.03)",
  onControlSelected: "#ffffff",
  itemPressed: "rgba(0, 0, 0, 0.08)",
  itemSelected: "rgba(0, 0, 0, 0.06)",
  separator: "#d2d2d7",
  separatorStrong: "#86868b",
  accent: "#0071e3",
  accentPressed: "#005bb8",
  accentSelected: "#0071e3",
  accentDisabled: "rgba(0, 113, 227, 0.4)",
  onAccent: "#ffffff",
  accentSurface: "rgba(0, 113, 227, 0.09)",
  accentSurfacePressed: "rgba(0, 113, 227, 0.18)",
  link: "#0066cc",
  focus: "#0071e3",
  scrim: "rgba(0, 0, 0, 0.48)",
  media: "#000000",
  onMedia: "#ffffff",
  danger: "#d0000a",
  dangerSurface: "rgba(215, 0, 21, 0.08)",
  dangerSurfacePressed: "rgba(215, 0, 21, 0.16)",
  success: "#008009",
  successSurface: "#effaf1",
  warning: "#b64400",
  warningSurface: "#fff5ea",
  blue: "#007aff",
  green: "#34c759",
  orange: "#ff9500",
  red: "#ff3b30",
  yellow: "#ffcc00",
  purple: "#af52de",
  pink: "#ff2d55",
  indigo: "#5856d6",
  teal: "#30b0c7",
  mint: "#00c7be",
  cyan: "#32ade6",
  brown: "#a2845e",
  gray: "#8e8e93",
}

type ThemeColors = typeof light

const dark: ThemeColors = {
  surface: "#000000",
  surfaceSecondary: "#161617",
  surfaceTertiary: "#2c2c2e",
  surfaceRaised: "#1d1d1f",
  label: "#f5f5f7",
  labelSecondary: "#a1a1a6",
  labelTertiary: "#86868b",
  labelQuaternary: "#424245",
  control: "rgba(255, 255, 255, 0.1)",
  controlPressed: "rgba(255, 255, 255, 0.22)",
  controlSelected: "#f5f5f7",
  controlDisabled: "rgba(255, 255, 255, 0.05)",
  onControlSelected: "#000000",
  itemPressed: "rgba(255, 255, 255, 0.12)",
  itemSelected: "rgba(255, 255, 255, 0.1)",
  separator: "#424245",
  separatorStrong: "#6e6e73",
  accent: "#0071e3",
  accentPressed: "#004d9e",
  accentSelected: "#0071e3",
  accentDisabled: "rgba(0, 113, 227, 0.4)",
  onAccent: "#ffffff",
  accentSurface: "rgba(0, 113, 227, 0.18)",
  accentSurfacePressed: "rgba(0, 113, 227, 0.3)",
  link: "#2997ff",
  focus: "#0071e3",
  scrim: "rgba(0, 0, 0, 0.48)",
  media: "#000000",
  onMedia: "#ffffff",
  danger: "#ff5447",
  dangerSurface: "rgba(255, 69, 58, 0.2)",
  dangerSurfacePressed: "rgba(255, 69, 58, 0.36)",
  success: "#30d158",
  successSurface: "rgba(48, 209, 88, 0.16)",
  warning: "#ff9f0a",
  warningSurface: "rgba(255, 159, 10, 0.16)",
  blue: "#0a84ff",
  green: "#30d158",
  orange: "#ff9f0a",
  red: "#ff453a",
  yellow: "#ffd60a",
  purple: "#bf5af2",
  pink: "#ff375f",
  indigo: "#5e5ce6",
  teal: "#40c8e0",
  mint: "#66d4cf",
  cyan: "#64d2ff",
  brown: "#ac8e68",
  gray: "#8e8e93",
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
  "3xs": { fontSize: 11, lineHeight: 13, letterSpacing: 0.066 },
  "2xs": { fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  xs: { fontSize: 13, lineHeight: 18, letterSpacing: -0.078 },
  sm: { fontSize: 15, lineHeight: 20, letterSpacing: -0.24 },
  md: { fontSize: 16, lineHeight: 21, letterSpacing: -0.32 },
  base: { fontSize: 17, lineHeight: 22, letterSpacing: -0.442 },
  lg: { fontSize: 20, lineHeight: 25, letterSpacing: -0.46 },
  xl: { fontSize: 22, lineHeight: 28, letterSpacing: -0.264 },
  "2xl": { fontSize: 28, lineHeight: 34, letterSpacing: 0.392 },
  "3xl": { fontSize: 34, lineHeight: 41, letterSpacing: 0.408 },
}

const shadow = {
  xs: { boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
  sm: {
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  },
  md: { boxShadow: "2px 4px 12px rgba(0, 0, 0, 0.08)" },
  lg: { boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)" },
  xl: {
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  },
} satisfies Record<string, { boxShadow: string | BoxShadowValue[] }>

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
    theme,
    resolvedTheme,
    setTheme,
  }
}

function ThemeToggle({
  labels,
  disabled = false,
  effect,
  origin,
  blur,
  style,
}: ThemeTransition & {
  labels?: Partial<Record<Theme, string>>
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}) {
  const { colors, isDark, theme } = useTheme()
  const transition =
    effect !== undefined || origin !== undefined || blur !== undefined
      ? { effect, origin, blur }
      : undefined
  return jsx(View, {
    role: "radiogroup",
    accessibilityLabel: "Theme",
    style: [
      {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 4,
        padding: 4,
        borderRadius: radius.xl,
        backgroundColor: colors.control,
      },
      style,
    ],
    children: THEMES.map((value) => {
      const selected = theme === value
      let labelColor = colors.labelSecondary
      if (disabled) labelColor = colors.labelQuaternary
      else if (selected) labelColor = colors.label
      return jsx(
        Pressable,
        {
          role: "radio",
          accessibilityState: { checked: selected, disabled },
          disabled,
          onPress: () => {
            if (!selected) setTheme(value, transition)
          },
          style: [
            {
              height: 36,
              minWidth: 36,
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 12,
              borderRadius: radius.md,
            },
            selected &&
              (disabled
                ? { backgroundColor: colors.controlDisabled }
                : {
                    backgroundColor: isDark
                      ? colors.labelQuaternary
                      : colors.surfaceRaised,
                    ...shadow.sm,
                  }),
          ],
          children: jsx(Text, {
            style: {
              ...fontSize.sm,
              color: labelColor,
            },
            children: labels?.[value] ?? LABELS[value],
          }),
        },
        value
      )
    }),
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
  radius,
  shadow,
  ThemeProvider,
  ThemeToggle,
  useTheme,
}
