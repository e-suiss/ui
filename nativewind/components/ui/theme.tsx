import { colorScheme } from "nativewind"
import * as React from "react"
import { useColorScheme } from "react-native"
import { Text } from "@/components/ui/text"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Theme = "light" | "dark" | "system"

type ResolvedTheme = "light" | "dark"

type ThemeStorage = {
  getItem: (key: string) => string | null | Promise<string | null>
  setItem: (key: string, value: string) => void | Promise<void>
}

type ThemeContextProps = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextProps | null>(null)

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
  children,
}: {
  defaultTheme?: Theme
  storage?: ThemeStorage
  storageKey?: string
  children?: React.ReactNode
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const scheme = useColorScheme()
  const changedRef = React.useRef(false)

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
    colorScheme.set(theme)
  }, [theme])

  React.useEffect(
    () => () => {
      colorScheme.set("system")
    },
    []
  )

  const setTheme = React.useCallback(
    (next: Theme) => {
      changedRef.current = true
      setThemeState(next)
      writeStoredTheme(storage, storageKey, next)
    },
    [storage, storageKey]
  )

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (scheme === "dark" ? "dark" : "light") : theme

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

function ThemeToggle({
  labels,
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
> & {
  labels?: Partial<Record<Theme, string>>
}) {
  const { theme, setTheme } = useTheme()

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
        setTheme(next)
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

export type { ResolvedTheme, Theme, ThemeStorage }
export { ThemeProvider, ThemeToggle, useTheme }
