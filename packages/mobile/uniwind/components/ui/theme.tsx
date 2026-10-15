import * as React from "react"
import { AccessibilityInfo, useColorScheme, View } from "react-native"
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
import { Uniwind } from "uniwind"
import { useEffectEvent } from "@/components/primitives/hooks"
import { Portal } from "@/components/primitives/portal"
import { Text } from "@/components/ui/text"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

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

type ThemeContextProps = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme, transition?: ThemeTransition) => void
}

const ThemeContext = React.createContext<ThemeContextProps | null>(null)

function knownTheme(
  next: Theme,
  current: { theme: Theme; resolvedTheme: ResolvedTheme }
): ResolvedTheme | null {
  if (next !== "system") return next
  return current.theme === "system" ? current.resolvedTheme : null
}

function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider />")
  }
  return context
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

type ThemeReveal = {
  id: number
  uri: string
  theme: Theme
  target: ResolvedTheme
  transition: ThemeTransition
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
  return spread ? (
    <AnimatedPath
      animatedProps={animatedProps}
      fill="none"
      stroke="black"
      strokeOpacity={1 / FEATHER.length}
      strokeLinejoin="round"
    />
  ) : (
    <AnimatedPath animatedProps={animatedProps} fill="black" />
  )
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
  return (
    <AnimatedCircle
      animatedProps={animatedProps}
      fill={`url(#${GRADIENT_ID})`}
    />
  )
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

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="absolute inset-0"
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout
        setSize((current) =>
          current?.width === width && current.height === height
            ? current
            : { width, height }
        )
      }}
    >
      {size && geometry ? (
        <Svg width={size.width} height={size.height}>
          <Defs>
            <RadialGradient id={GRADIENT_ID}>
              <Stop offset={0} stopColor="black" />
              <Stop offset={SOFT_CORE} stopColor="black" />
              <Stop offset={1} stopColor="black" stopOpacity={0} />
            </RadialGradient>
            <Mask
              id={MASK_ID}
              maskUnits="userSpaceOnUse"
              x={0}
              y={0}
              width={size.width}
              height={size.height}
            >
              <Rect width={size.width} height={size.height} fill="white" />
              {geometry.kind === "soft" ? (
                <ThemeRevealSoft
                  geometry={geometry}
                  progress={progress}
                  blur={blur}
                  width={size.width}
                  height={size.height}
                />
              ) : (
                <>
                  {blurred
                    ? FEATHER.map((spread) => (
                        <ThemeRevealEdge
                          key={spread}
                          geometry={geometry}
                          progress={progress}
                          blur={blur}
                          spread={spread}
                        />
                      ))
                    : null}
                  <ThemeRevealEdge
                    geometry={geometry}
                    progress={progress}
                    blur={blur}
                    spread={0}
                  />
                </>
              )}
            </Mask>
          </Defs>
          <SvgImage
            href={uri}
            width={size.width}
            height={size.height}
            preserveAspectRatio="none"
            mask={`url(#${MASK_ID})`}
            onLoad={() => setLoaded(true)}
          />
        </Svg>
      ) : null}
    </View>
  )
}

const memory = new Map<string, string>()

const memoryStorage: ThemeStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => {
    memory.set(key, value)
  },
}

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system"
}

function readStoredTheme(storage: ThemeStorage, storageKey: string) {
  try {
    return Promise.resolve(storage.getItem(storageKey)).catch(() => null)
  } catch {
    return Promise.resolve(null)
  }
}

function writeStoredTheme(
  storage: ThemeStorage,
  storageKey: string,
  theme: Theme
) {
  try {
    Promise.resolve(storage.setItem(storageKey, theme)).catch(() => undefined)
  } catch {
    return
  }
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
  snapshot?: () => Promise<{ uri: string }>
  children?: React.ReactNode
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [reveal, setReveal] = React.useState<ThemeReveal | null>(null)
  const scheme = useColorScheme()
  const changedRef = React.useRef(false)
  const requestRef = React.useRef(0)
  const readyRef = React.useRef(0)
  const portalName = `theme-reveal-${React.useId()}`

  const systemTheme: ResolvedTheme = scheme === "dark" ? "dark" : "light"
  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme

  const currentRef = React.useRef({ theme, resolvedTheme })

  React.useLayoutEffect(() => {
    currentRef.current = { theme, resolvedTheme }
  })

  React.useEffect(() => {
    let active = true
    changedRef.current = false
    readStoredTheme(storage, storageKey).then((stored) => {
      if (active && !changedRef.current && isTheme(stored)) {
        setThemeState(stored)
      }
    })
    return () => {
      active = false
    }
  }, [storage, storageKey])

  React.useLayoutEffect(() => {
    Uniwind.setTheme(theme)
  }, [theme])

  React.useEffect(
    () => () => {
      Uniwind.setTheme("system")
    },
    []
  )

  const commit = React.useCallback((request: number, next: Theme) => {
    if (request !== requestRef.current) return
    setReveal(null)
    setThemeState(next)
  }, [])

  const setTheme = React.useCallback(
    (next: Theme, transition?: ThemeTransition) => {
      changedRef.current = true
      writeStoredTheme(storage, storageKey, next)
      const request = ++requestRef.current
      const current = currentRef.current
      const known = knownTheme(next, current)
      if (!transition || !snapshot || known === current.resolvedTheme) {
        commit(request, next)
        return
      }
      const target =
        known ?? (current.resolvedTheme === "dark" ? "light" : "dark")
      AccessibilityInfo.isReduceMotionEnabled()
        .then((reduced) => (reduced ? null : snapshot()))
        .then((shot) => {
          if (request !== requestRef.current) return
          if (!shot?.uri) {
            commit(request, next)
            return
          }
          setReveal({
            id: request,
            uri: shot.uri,
            theme: next,
            target,
            transition,
          })
        })
        .catch(() => commit(request, next))
    },
    [storage, storageKey, snapshot, commit]
  )

  React.useEffect(() => {
    if (!reveal) return
    const timer = setTimeout(() => {
      if (readyRef.current !== reveal.id) commit(reveal.id, reveal.theme)
    }, READY_TIMEOUT)
    return () => clearTimeout(timer)
  }, [reveal, commit])

  const contextValue = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
      {reveal ? (
        <Portal name={portalName}>
          <ThemeRevealOverlay
            key={reveal.id}
            uri={reveal.uri}
            transition={reveal.transition}
            target={reveal.target}
            onReady={() => {
              readyRef.current = reveal.id
              if (reveal.id === requestRef.current) setThemeState(reveal.theme)
            }}
            onDone={() =>
              setReveal((current) =>
                current?.id === reveal.id ? null : current
              )
            }
          />
        </Portal>
      ) : null}
    </ThemeContext.Provider>
  )
}

function ThemeToggle({
  labels,
  effect,
  origin,
  blur,
  ...props
}: Omit<
  React.ComponentProps<typeof ToggleGroup>,
  | "children"
  | "defaultValue"
  | "multiple"
  | "onValueChange"
  | "spacing"
  | "value"
  | "variant"
> &
  ThemeTransition & {
    labels?: Partial<Record<Theme, string>>
  }) {
  const { theme, setTheme } = useTheme()
  const transition =
    effect !== undefined || origin !== undefined || blur !== undefined
      ? { effect, origin, blur }
      : undefined

  return (
    <ToggleGroup
      accessibilityLabel="Theme"
      spacing={0}
      value={[theme]}
      onValueChange={(value, details) => {
        const next = value[0]
        if (!isTheme(next)) {
          details.cancel()
          return
        }
        setTheme(next, transition)
      }}
      {...props}
    >
      {THEMES.map((value) => (
        <ToggleGroupItem key={value} value={value}>
          <Text>{labels?.[value] ?? LABELS[value]}</Text>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export type {
  ResolvedTheme,
  Theme,
  ThemeStorage,
  ThemeTransition,
  ThemeTransitionEffect,
  ThemeTransitionOrigin,
}
export { ThemeProvider, ThemeToggle, useTheme }
