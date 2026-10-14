"use client"

import { cn } from "cn"
import * as React from "react"
import { flushSync } from "react-dom"

import { Button } from "@/components/ui/button"

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

type ThemeContextProps = {
  theme: Theme
  resolvedTheme: ResolvedTheme | undefined
  setTheme: (theme: Theme, transition?: ThemeTransition) => void
}

const ThemeContext = React.createContext<ThemeContextProps | null>(null)

function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider />")
  }

  return context
}

const DARK_QUERY = "(prefers-color-scheme: dark)"

const POINTS: Partial<Record<ThemeTransitionOrigin, string>> = {
  center: "50% 50%",
  "top-left": "0% 0%",
  "top-right": "100% 0%",
  "bottom-left": "0% 100%",
  "bottom-right": "100% 100%",
  "top-center": "50% 0%",
  "bottom-center": "50% 100%",
}

const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"

const EDGES: Partial<Record<ThemeTransitionOrigin, string>> = {
  "bottom-up": "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  "top-down": "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  "left-right": "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
  "right-left": "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
}

const DIAGONALS: Partial<
  Record<ThemeTransitionOrigin, Record<ResolvedTheme, [string, string]>>
> = {
  "top-left": {
    dark: [
      "polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%)",
      "polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%)",
    ],
    light: [
      "polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%)",
      "polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%)",
    ],
  },
  "top-right": {
    dark: [
      "polygon(150% -71%, 250% 71%, 250% 71%, 150% -71%)",
      "polygon(150% -71%, 250% 71%, 50% 171%, -71% 50%)",
    ],
    light: [
      "polygon(-71% 50%, 50% 171%, 50% 171%, -71% 50%)",
      "polygon(-71% 50%, 50% 171%, 250% 71%, 150% -71%)",
    ],
  },
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light"
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle("dark", resolved === "dark")
  root.style.colorScheme = resolved
}

function transitionVariables(
  { effect = "circle", origin }: ThemeTransition,
  target: ResolvedTheme
): Record<string, string> {
  if (effect === "rectangle") {
    const from = EDGES[origin ?? "bottom-up"] ?? EDGES["bottom-up"]
    return {
      "--theme-transition-from": from ?? FULL,
      "--theme-transition-to": FULL,
    }
  }

  if (effect === "polygon") {
    const paths = (DIAGONALS[origin ?? "top-left"] ?? DIAGONALS["top-left"])?.[
      target
    ]
    return {
      "--theme-transition-from": paths?.[0] ?? FULL,
      "--theme-transition-to": paths?.[1] ?? FULL,
    }
  }

  const point = POINTS[origin ?? "center"] ?? "50% 50%"
  const centered = point === "50% 50%"

  if (effect === "circle-blur") {
    return { "--theme-transition-at": point }
  }

  return {
    "--theme-transition-from": `circle(0% at ${point})`,
    "--theme-transition-to": `circle(${centered ? 100 : 150}% at ${point})`,
    "--theme-transition-duration": centered ? "0.7s" : "1s",
  }
}

function readStoredTheme(storageKey: string, fallback: Theme): Theme {
  try {
    const stored = localStorage.getItem(storageKey)
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : fallback
  } catch {
    return fallback
  }
}

function writeStoredTheme(storageKey: string, theme: Theme) {
  try {
    localStorage.setItem(storageKey, theme)
    return true
  } catch {
    return false
  }
}

function ThemeProvider({
  defaultTheme = "system",
  storageKey = "theme",
  children,
}: {
  defaultTheme?: Theme
  storageKey?: string
  children?: React.ReactNode
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>()
  const transitionRef = React.useRef<ViewTransition | null>(null)
  const requestRef = React.useRef(0)

  React.useEffect(() => {
    const stored = readStoredTheme(storageKey, defaultTheme)
    setThemeState(stored)
    setResolvedTheme(stored === "system" ? systemTheme() : stored)
  }, [storageKey, defaultTheme])

  React.useEffect(() => {
    if (resolvedTheme) applyTheme(resolvedTheme)
  }, [resolvedTheme])

  React.useEffect(() => {
    if (theme !== "system") return
    const query = window.matchMedia(DARK_QUERY)
    const update = () => setResolvedTheme(query.matches ? "dark" : "light")
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [theme])

  React.useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== storageKey) return
      const next = readStoredTheme(storageKey, defaultTheme)
      setThemeState(next)
      setResolvedTheme(next === "system" ? systemTheme() : next)
    }
    window.addEventListener("storage", sync)
    return () => window.removeEventListener("storage", sync)
  }, [storageKey, defaultTheme])

  const setTheme = React.useCallback(
    (next: Theme, transition?: ThemeTransition) => {
      const resolved = next === "system" ? systemTheme() : next
      writeStoredTheme(storageKey, next)

      const request = ++requestRef.current
      const commit = () => {
        if (request !== requestRef.current) return
        applyTheme(resolved)
        setThemeState(next)
        setResolvedTheme(resolved)
      }

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      const current = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light"

      if (
        !transition ||
        reduced ||
        resolved === current ||
        typeof document.startViewTransition !== "function"
      ) {
        commit()
        return
      }

      const root = document.documentElement
      const variables = transitionVariables(transition, resolved)
      root.dataset.themeTransition = transition.effect ?? "circle"
      if (transition.blur) root.dataset.themeTransitionBlur = ""
      for (const [name, value] of Object.entries(variables)) {
        root.style.setProperty(name, value)
      }

      const viewTransition = document.startViewTransition(() =>
        flushSync(commit)
      )
      transitionRef.current = viewTransition
      viewTransition.ready.catch(() => undefined)
      viewTransition.finished.finally(() => {
        if (transitionRef.current !== viewTransition) return
        transitionRef.current = null
        delete root.dataset.themeTransition
        delete root.dataset.themeTransitionBlur
        for (const name of Object.keys(variables)) {
          root.style.removeProperty(name)
        }
      })
    },
    [storageKey]
  )

  const contextValue = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

const SCRIPT_UNSAFE = /</g

function scriptString(value: string) {
  return JSON.stringify(value).replace(SCRIPT_UNSAFE, "\\u003c")
}

function themeScript(storageKey = "theme", defaultTheme: Theme = "system") {
  return `(()=>{try{var t=localStorage.getItem(${scriptString(storageKey)})||${scriptString(defaultTheme)};var d=t==="dark"||(t==="system"&&matchMedia(${scriptString(DARK_QUERY)}).matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`
}

function ThemeScript({
  storageKey,
  defaultTheme,
  nonce,
}: {
  storageKey?: string
  defaultTheme?: Theme
  nonce?: string
}) {
  return (
    <script
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: themeScript(storageKey, defaultTheme),
      }}
    />
  )
}

function ThemeToggle({
  effect = "circle",
  origin,
  blur = false,
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof Button>,
  "onClick" | "children" | "variant"
> &
  ThemeTransition) {
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === "dark"

  return (
    <Button
      size="icon-lg"
      data-slot="theme-toggle"
      data-dark={dark ? "" : undefined}
      data-ready={resolvedTheme ? "" : undefined}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() =>
        setTheme(dark ? "light" : "dark", { effect, origin, blur })
      }
      className={cn(
        "group/theme-toggle rounded-full bg-label p-0 transition-[scale,background-color] duration-300 hover:bg-label/90 active:scale-95 active:bg-label/80",
        className
      )}
      {...props}
    >
      <svg aria-hidden viewBox="0 0 240 240" fill="none" className="size-full">
        <g className="origin-center transform-fill group-data-dark/theme-toggle:-rotate-180 group-data-ready/theme-toggle:transition-[rotate] group-data-ready/theme-toggle:duration-500 group-data-ready/theme-toggle:ease-in-out">
          <path
            d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
            className="fill-surface"
          />
          <path
            d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
            className="fill-label"
          />
        </g>
        <path
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          className="origin-center fill-surface transform-fill group-data-dark/theme-toggle:rotate-180 group-data-ready/theme-toggle:transition-[rotate] group-data-ready/theme-toggle:duration-500 group-data-ready/theme-toggle:ease-in-out"
        />
      </svg>
    </Button>
  )
}

export {
  type Theme,
  ThemeProvider,
  ThemeScript,
  ThemeToggle,
  type ThemeTransition,
  type ThemeTransitionEffect,
  type ThemeTransitionOrigin,
  themeScript,
  useTheme,
}
