import type * as React from "react"
import { type Theme, ThemeProvider, useTheme } from "@/components/ui/theme"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const STORAGE_KEY = "esuiss-theme-example"

function clearStoredTheme() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

function ExampleTheme({ children }: { children?: React.ReactNode }) {
  clearStoredTheme()

  return (
    <ThemeProvider defaultTheme="light" storageKey={STORAGE_KEY}>
      {children}
    </ThemeProvider>
  )
}

function ThemePicker() {
  const { theme, setTheme } = useTheme()

  return (
    <ToggleGroup
      spacing={0}
      value={[theme]}
      onValueChange={(value: string[]) => {
        if (value[0])
          setTheme(value[0] as Theme, {
            effect: "circle",
            origin: "top-center",
          })
      }}
      aria-label="Appearance"
    >
      {(["light", "dark", "system"] as const).map((item) => (
        <ToggleGroupItem key={item} value={item} className="px-5 capitalize">
          {item}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default function ThemeLightDarkSystem() {
  return (
    <ExampleTheme>
      <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-surface px-6 py-16 text-center text-label">
        <div className="flex max-w-md flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            Light and dark.
          </h1>
          <p className="text-lg text-label-secondary">
            Every surface, label and accent follows the theme tokens, so the
            whole page changes at once.
          </p>
        </div>
        <ThemePicker />
      </div>
    </ExampleTheme>
  )
}
