import { execFileSync } from "node:child_process"
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

import {
  convertColors,
  loadTokens,
  scopedBiome,
  toRgb,
  toRgba,
} from "./theme.mjs"

const IDENTIFIER = /^[a-z]\w*$/i
const NUMBERED_NAME = /^(\d+)(\w+)$/
const COLOR_VALUE = /(?:oklch|rgb)\([^)]*\)|#[\da-f]{6}\b/i
const WHITESPACE = /\s+/
const SHADOW_LAYER = /,(?![^(]*\))/

const ROOT = path.resolve(import.meta.dirname, "..")
const REPO = path.join(ROOT, "../..")
const CSS = "styles/uniwind.css"
const THEME = "stylesheet/components/ui/theme.ts"
const SWIFT = "swiftui/Sources/EsuissUI/Theme/Tokens.swift"
const KOTLIN = "kotlin/ui/src/main/kotlin/com/esuiss/ui/theme/Tokens.kt"
const OUTPUTS = [CSS, THEME, SWIFT, KOTLIN]
const FORMATTED = [CSS, THEME]
const DEFAULT_SHADOWS = {
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
}
function camelCase(name) {
  return name.replace(/-(\w)/g, (_match, letter) => letter.toUpperCase())
}

function key(name) {
  return IDENTIFIER.test(name) ? name : `"${name}"`
}

function nativeName(name) {
  return name.replace(NUMBERED_NAME, "$2$1")
}

function hex(channels) {
  return channels
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()
}

function double(value) {
  return Number.isInteger(value) ? `${value}.0` : String(value)
}

function parseShadow(value) {
  return value.split(SHADOW_LAYER).map((layer) => {
    const color = layer.match(COLOR_VALUE)
    if (!color) throw new Error(`Unsupported shadow value "${value}"`)
    const [x = 0, y = 0, blur = 0, spread = 0] = layer
      .replace(color[0], "")
      .trim()
      .split(WHITESPACE)
      .map((part) => Number.parseFloat(part))
    return { x, y, blur, spread, ...toRgba(color[0]) }
  })
}

function buildCss(tokens) {
  const colors = (mode) =>
    Object.entries(tokens.color)
      .map(([name, value]) => `      --color-${name}: ${value[mode]};`)
      .join("\n")
  const text = Object.entries(tokens.text)
    .map(
      ([name, size]) =>
        `  --text-${name}: ${size.fontSize};\n  --text-${name}--line-height: ${size.lineHeight};`
    )
    .join("\n")
  const shadow = Object.entries(tokens.shadow)
    .map(([name, value]) => `  --shadow-${name}: ${value};`)
    .join("\n")
  const radius = Object.entries(tokens.radius)
    .map(([name, value]) => `  --radius-${name}: ${value};`)
    .join("\n")

  return `@import "tailwindcss";
@import "uniwind";

@layer theme {
  :root {
    @variant light {
${colors("light")}
    }

    @variant dark {
${colors("dark")}
    }
  }
}

@theme {
${text}
${shadow}

${radius}
}
`
}

function colorObject(colors) {
  return Object.entries(colors)
    .map(([name, value]) => `  ${camelCase(name)}: "${toRgb(value)}",`)
    .join("\n")
}

function buildTheme(theme) {
  const radius = Object.entries({ ...theme.radius, full: 9999 })
    .map(([name, value]) => `  ${key(name)}: ${value},`)
    .join("\n")
  const fontSize = Object.entries(theme.text)
    .map(
      ([name, size]) =>
        `  ${key(name)}: { fontSize: ${size.fontSize}, lineHeight: ${size.lineHeight} },`
    )
    .join("\n")
  const shadows = { ...DEFAULT_SHADOWS, ...theme.shadow }
  const shadow = ["xs", "sm", "md", "lg", "xl"]
    .filter((name) => shadows[name])
    .map(
      (name) =>
        `  ${key(name)}: { boxShadow: "${convertColors(shadows[name])}" },`
    )
    .join("\n")

  return `import * as React from "react"
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
${colorObject(theme.light)}
}

type ThemeColors = typeof light

const dark: ThemeColors = {
${colorObject(theme.dark)}
}

const palette = {
${colorObject(theme.palette)}
}

const radius = {
${radius}
}

const fontSize = {
${fontSize}
}

const shadow = {
${shadow}
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
          ? \`M\${a - c} \${b}A\${c} \${c} 0 1 0 \${a + c} \${b}A\${c} \${c} 0 1 0 \${a - c} \${b}Z\`
          : \`M\${a} \${b}L\${c} \${d}L\${e} \${f}L\${g} \${h}Z\`,
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
    fill: \`url(#\${GRADIENT_ID})\`,
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
                mask: \`url(#\${MASK_ID})\`,
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
  const name = \`theme-reveal-\${React.useId()}\`

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
        backgroundColor: colors.secondary,
      },
      disabled && { opacity: 0.5 },
      style,
    ],
    children: THEMES.map((value) => {
      const selected = theme === value
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
            selected && {
              backgroundColor: isDark ? colors.border : colors.card,
              ...shadow.sm,
            },
          ],
          children: jsx(Text, {
            style: {
              ...fontSize.sm,
              color: selected ? colors.cardForeground : colors.mutedForeground,
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
  palette,
  radius,
  shadow,
  ThemeProvider,
  ThemeToggle,
  useTheme,
}
`
}

function swiftColor(value) {
  const { channels, alpha } = toRgba(value)
  return alpha === 1
    ? `.init(0x${hex(channels)})`
    : `.init(0x${hex(channels)}, ${alpha})`
}

function swiftShadowColor({ channels, alpha }) {
  if (hex(channels) === "000000") return `.black.opacity(${alpha})`
  return `Color(uiColor: RGBA(0x${hex(channels)}, ${alpha}).uiColor)`
}

function buildSwift(theme) {
  const colors = Object.keys(theme.light)
    .map(
      (name) =>
        `  public static let ${camelCase(name)} = Color.adaptive(light: ${swiftColor(theme.light[name])}, dark: ${swiftColor(theme.dark[name])})`
    )
    .join("\n")
  const palette = Object.entries(theme.palette)
    .map(
      ([name, value]) =>
        `  public static let ${camelCase(name)} = Color.fixed(${swiftColor(value)})`
    )
    .join("\n")
  const radius = Object.entries({ ...theme.radius, full: 9999 })
    .map(
      ([name, value]) =>
        `  public static let ${nativeName(name)}: CGFloat = ${value}`
    )
    .join("\n")
  const textNames = Object.keys(theme.text).map(nativeName)
  const text = Object.entries(theme.text)
    .map(
      ([name, size]) =>
        `  public static let ${nativeName(name)} = TextStyle(size: ${size.fontSize}, lineHeight: ${size.lineHeight})`
    )
    .join("\n")
  const shadow = Object.entries(theme.shadow)
    .map(([name, value]) => {
      const layers = parseShadow(value).map((layer) => {
        const offsets = [
          layer.x !== 0 ? `, x: ${layer.x}` : "",
          layer.y !== 0 ? `, y: ${layer.y}` : "",
        ].join("")
        return `.init(color: ${swiftShadowColor(layer)}, radius: ${layer.blur / 2}${offsets})`
      })
      return `  public static let ${nativeName(name)} = Shadow(${layers.join(", ")})`
    })
    .join("\n")

  return `import SwiftUI

public enum EsuissColor {
${colors}
}

public enum Palette {
${palette}
}

public enum Radius {
${radius}
}

extension TextStyle {
${text}

  public static let allCases: [TextStyle] = [${textNames.map((name) => `.${name}`).join(", ")}]
}

extension Shadow {
${shadow}
}
`
}

function kotlinColor(value) {
  const { channels, alpha } = toRgba(value)
  const color = `Color(0xFF${hex(channels)})`
  return alpha === 1 ? color : `${color}.copy(alpha = ${alpha}f)`
}

function kotlinShadowColor({ channels, alpha }) {
  const color =
    hex(channels) === "000000" ? "Color.Black" : `Color(0xFF${hex(channels)})`
  return `${color}.copy(alpha = ${alpha}f)`
}

function dp(value) {
  return value < 0 ? `(${value}).dp` : `${value}.dp`
}

function kotlinColors(colors, isDark) {
  return `${Object.entries(colors)
    .map(([name, value]) => `    ${camelCase(name)} = ${kotlinColor(value)},`)
    .join("\n")}\n    isDark = ${isDark},`
}

function buildKotlin(theme) {
  const fields = Object.keys(theme.light)
    .map((name) => `    val ${camelCase(name)}: Color,`)
    .join("\n")
  const radius = Object.entries({ ...theme.radius, full: 9999 })
    .map(([name, value]) => `    val ${nativeName(name)} = ${value}.dp`)
    .join("\n")
  const textNames = Object.keys(theme.text).map(nativeName)
  const text = Object.entries(theme.text)
    .map(
      ([name, size]) =>
        `    val ${nativeName(name)} = textStyle(${double(size.fontSize)}, ${double(size.lineHeight)})`
    )
    .join("\n")
  const palette = Object.entries(theme.palette)
    .map(
      ([name, value]) => `    val ${camelCase(name)} = ${kotlinColor(value)}`
    )
    .join("\n")
  const shadow = Object.entries(theme.shadow)
    .map(([name, value]) => {
      const layers = parseShadow(value).map(
        (layer) =>
          `ShadowLayer(${dp(layer.x)}, ${dp(layer.y)}, ${dp(layer.blur)}, ${dp(layer.spread)}, ${kotlinShadowColor(layer)})`
      )
      return `    val ${nativeName(name)} = Shadow(${layers.join(", ")})`
    })
    .join("\n")

  return `package com.esuiss.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Immutable
data class Colors(
${fields}
    val isDark: Boolean,
)

val LightColors = Colors(
${kotlinColors(theme.light, false)}
)

val DarkColors = Colors(
${kotlinColors(theme.dark, true)}
)

object Palette {
${palette}
}

object Radius {
${radius}
}

object Typography {
${text}

    val all = listOf(${textNames.join(", ")})
}

object Shadows {
${shadow}
}
`
}

function generate(target) {
  const theme = loadTokens()
  const files = {
    [CSS]: buildCss(theme.source),
    [THEME]: buildTheme(theme),
    [SWIFT]: buildSwift(theme),
    [KOTLIN]: buildKotlin(theme),
  }
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(target, file)), { recursive: true })
    writeFileSync(path.join(target, file), content)
  }
  execFileSync(
    path.join(ROOT, "../../node_modules/.bin/biome"),
    ["check", "--write", ...FORMATTED],
    { cwd: target, stdio: "ignore" }
  )
}

function read(base, file) {
  try {
    return readFileSync(path.join(base, file), "utf8")
  } catch {
    return ""
  }
}

if (process.argv.includes("--check")) {
  const temp = mkdtempSync(path.join(tmpdir(), "esuiss-tokens-"))
  try {
    writeFileSync(
      path.join(temp, "biome.json"),
      JSON.stringify(scopedBiome(JSON.parse(read(REPO, "biome.json"))))
    )
    generate(temp)
    const stale = OUTPUTS.filter(
      (file) => read(temp, file) !== read(ROOT, file)
    )
    if (stale.length > 0) {
      console.error("Tokens are out of date. Run `pnpm tokens`.")
      for (const file of stale) console.error(`  ${file}`)
      process.exit(1)
    }
    console.log(`Tokens are up to date: ${OUTPUTS.length} files`)
  } finally {
    rmSync(temp, { recursive: true, force: true })
  }
} else {
  generate(ROOT)
  for (const file of OUTPUTS) console.log(`Wrote ${file}`)
}
