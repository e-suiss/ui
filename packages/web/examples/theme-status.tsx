import type * as React from "react"
import { ThemeProvider, ThemeToggle, useTheme } from "@/components/ui/theme"

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

function ThemeStatus() {
  const { theme, resolvedTheme } = useTheme()

  return (
    <div className="flex flex-col items-center gap-3">
      <ThemeToggle />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Theme: {theme} · Showing: {resolvedTheme ?? "…"}
      </p>
    </div>
  )
}

export default function ThemeStatusExample() {
  return (
    <ExampleTheme>
      <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-6 py-16 text-center text-foreground">
        <div className="flex max-w-md flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            Light and dark.
          </h1>
          <p className="text-lg text-muted-foreground">
            Every surface, label and accent follows the theme tokens, so the
            whole page changes at once.
          </p>
        </div>
        <ThemeStatus />
      </div>
    </ExampleTheme>
  )
}
