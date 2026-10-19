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

function ThemePicker() {
  const { theme, setTheme } = useTheme()

  return (
    <ToggleGroup
      spacing={0}
      type="single"
      value={theme}
      onValueChange={(value: string) => {
        if (value)
          setTheme(value as Theme, {
            effect: "circle",
            origin: "top-center",
          })
      }}
      aria-label="Appearance"
    >
      <ToggleGroupItem value="light" className="px-5 capitalize">
        light
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" className="px-5 capitalize">
        dark
      </ToggleGroupItem>
      <ToggleGroupItem value="system" className="px-5 capitalize">
        system
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export default function ThemeLightDarkSystem() {
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
        <ThemePicker />
      </div>
    </ThemeProvider>
  )
}
