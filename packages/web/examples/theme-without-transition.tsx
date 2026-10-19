import { Button } from "@/components/ui/button"
import { ThemeProvider, useTheme } from "@/components/ui/theme"

const STORAGE_KEY = "esuiss-theme-example"

function clearStoredTheme() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

function InstantSwitch() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="secondary"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      Switch theme instantly
    </Button>
  )
}

export default function ThemeWithoutTransition() {
  clearStoredTheme()

  return (
    <ThemeProvider defaultTheme="light" storageKey={STORAGE_KEY}>
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
        <InstantSwitch />
      </div>
    </ThemeProvider>
  )
}
