"use client"

import { DesktopIcon, MoonIcon, SunIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"

type Theme = "system" | "light" | "dark"

const STORAGE_KEY = "theme"
const order: Theme[] = ["system", "light", "dark"]
const icons = { system: DesktopIcon, light: SunIcon, dark: MoonIcon }

const script = `(()=>{try{var t=localStorage.getItem("${STORAGE_KEY}");var d=t==="dark"||((!t||t==="system")&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})()`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

function apply(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
  document.documentElement.style.colorScheme = dark ? "dark" : "light"
}

function read(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === "light" || value === "dark" ? value : "system"
  } catch {
    return "system"
  }
}

function remember(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
    return true
  } catch {
    return false
  }
}

export function ThemeToggle({
  labels,
  className,
}: {
  labels: Record<Theme, string>
  className?: string
}) {
  const [theme, setTheme] = React.useState<Theme>("system")

  React.useEffect(() => setTheme(read()), [])

  React.useEffect(() => {
    if (theme !== "system") return
    const media = matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => apply("system")
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [theme])

  const Icon = icons[theme]
  const next = order[(order.indexOf(theme) + 1) % order.length]

  return (
    <button
      type="button"
      aria-label={labels[theme]}
      title={labels[theme]}
      onClick={() => {
        remember(next)
        apply(next)
        setTheme(next)
      }}
      className={cn(
        "flex size-10 items-center justify-center rounded-full outline-none transition-colors focus-visible:focus-ring",
        className
      )}
    >
      <Icon className="size-4.5" />
    </button>
  )
}
