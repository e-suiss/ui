import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { page } from "vitest/browser"
import { render, renderHook } from "vitest-browser-react"

import {
  type Theme,
  ThemeProvider,
  ThemeToggle,
  themeScript,
  useTheme,
} from "@/components/ui/theme"

const root = document.documentElement

function emulate({ dark = false, reducedMotion = false } = {}) {
  const listeners = new Set<() => void>()
  const media = { dark }
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        get matches() {
          if (query.includes("prefers-color-scheme: dark")) return media.dark
          if (query.includes("prefers-reduced-motion")) return reducedMotion
          return false
        },
        media: query,
        addEventListener: (_: string, listener: () => void) =>
          listeners.add(listener),
        removeEventListener: (_: string, listener: () => void) =>
          listeners.delete(listener),
      }) as unknown as MediaQueryList
  )
  return {
    setDark(next: boolean) {
      media.dark = next
      for (const listener of listeners) listener()
    },
  }
}

function renderTheme(options: { defaultTheme?: Theme; storageKey?: string }) {
  return renderHook(() => useTheme(), {
    wrapper: ({ children }) => (
      <ThemeProvider {...options}>{children}</ThemeProvider>
    ),
  })
}

beforeEach(() => {
  localStorage.clear()
  root.classList.remove("dark")
  root.style.colorScheme = ""
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  root.classList.remove("dark")
})

describe("useTheme", () => {
  it("must be used inside ThemeProvider", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    await expect(renderHook(() => useTheme())).rejects.toThrow(
      "useTheme must be used within a <ThemeProvider />"
    )
  })
})

describe("ThemeProvider", () => {
  it("starts from the default theme and resolves system to the OS setting", async () => {
    emulate({ dark: true })
    const { result } = await renderTheme({})
    await expect.poll(() => result.current.resolvedTheme).toBe("dark")
    expect(result.current.theme).toBe("system")
    expect(root.classList.contains("dark")).toBe(true)
    expect(root.style.colorScheme).toBe("dark")
  })

  it("restores the theme saved under its storage key", async () => {
    emulate()
    localStorage.setItem("app-theme", "dark")
    const { result } = await renderTheme({ storageKey: "app-theme" })
    await expect.poll(() => result.current.theme).toBe("dark")
    expect(root.classList.contains("dark")).toBe(true)
  })

  it("ignores an invalid saved value", async () => {
    emulate()
    localStorage.setItem("theme", "sepia")
    const { result } = await renderTheme({ defaultTheme: "light" })
    await expect.poll(() => result.current.resolvedTheme).toBe("light")
    expect(result.current.theme).toBe("light")
  })

  it("saves and applies a theme set by the user", async () => {
    emulate()
    const { result, act } = await renderTheme({})
    await act(() => result.current.setTheme("dark"))
    expect(localStorage.getItem("theme")).toBe("dark")
    expect(result.current.resolvedTheme).toBe("dark")
    expect(root.classList.contains("dark")).toBe(true)

    await act(() => result.current.setTheme("light"))
    expect(root.classList.contains("dark")).toBe(false)
    expect(root.style.colorScheme).toBe("light")
  })

  it("follows the OS while the theme is system", async () => {
    const os = emulate({ dark: false })
    const { result, act } = await renderTheme({})
    await expect.poll(() => result.current.resolvedTheme).toBe("light")
    await act(() => os.setDark(true))
    expect(result.current.resolvedTheme).toBe("dark")
    expect(root.classList.contains("dark")).toBe(true)
  })

  it("stops following the OS once a theme is chosen", async () => {
    const os = emulate({ dark: false })
    const { result, act } = await renderTheme({})
    await act(() => result.current.setTheme("light"))
    await act(() => os.setDark(true))
    expect(result.current.resolvedTheme).toBe("light")
  })

  it("picks up a theme changed in another tab", async () => {
    emulate()
    const { result, act } = await renderTheme({ defaultTheme: "light" })
    await act(() => {
      localStorage.setItem("theme", "dark")
      window.dispatchEvent(new StorageEvent("storage", { key: "theme" }))
    })
    expect(result.current.theme).toBe("dark")
    expect(root.classList.contains("dark")).toBe(true)
  })

  it("ignores storage changes under other keys", async () => {
    emulate()
    const { result, act } = await renderTheme({ defaultTheme: "light" })
    await act(() => {
      localStorage.setItem("other", "dark")
      window.dispatchEvent(new StorageEvent("storage", { key: "other" }))
    })
    expect(result.current.theme).toBe("light")
  })
})

describe("theme transitions", () => {
  function captureTransitions() {
    const variables: Record<string, string>[] = []
    const transition = vi.fn(
      (update?: ViewTransitionUpdateCallback | StartViewTransitionOptions) => {
        variables.push({
          effect: root.dataset.themeTransition ?? "",
          from: root.style.getPropertyValue("--theme-transition-from"),
          to: root.style.getPropertyValue("--theme-transition-to"),
        })
        if (typeof update === "function") update()
        return {
          ready: Promise.resolve(),
          finished: Promise.resolve(),
        } as unknown as ViewTransition
      }
    )
    vi.spyOn(document, "startViewTransition").mockImplementation(transition)
    return { transition, variables }
  }

  it("animates a change with the requested effect and cleans up afterwards", async () => {
    emulate()
    const { transition, variables } = captureTransitions()
    const { result, act } = await renderTheme({ defaultTheme: "light" })
    await expect.poll(() => result.current.resolvedTheme).toBe("light")
    await act(() =>
      result.current.setTheme("dark", { effect: "circle", origin: "top-left" })
    )
    expect(transition).toHaveBeenCalledOnce()
    expect(variables[0]).toEqual({
      effect: "circle",
      from: "circle(0% at 0% 0%)",
      to: "circle(150% at 0% 0%)",
    })
    await expect.poll(() => root.dataset.themeTransition).toBeUndefined()
    expect(root.style.getPropertyValue("--theme-transition-from")).toBe("")
    expect(root.classList.contains("dark")).toBe(true)
  })

  it("handles a second change while a transition is still running", async () => {
    emulate()
    const rejections: unknown[] = []
    const onRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault()
      rejections.push(event.reason)
    }
    window.addEventListener("unhandledrejection", onRejection)
    const { result, act } = await renderTheme({ defaultTheme: "light" })
    await expect.poll(() => result.current.resolvedTheme).toBe("light")
    await act(() => {
      result.current.setTheme("dark", { effect: "circle" })
      result.current.setTheme("light", { effect: "polygon" })
    })
    await expect.poll(() => root.dataset.themeTransition).toBeUndefined()
    await new Promise((resolve) => setTimeout(resolve, 100))
    window.removeEventListener("unhandledrejection", onRejection)
    expect(rejections).toEqual([])
    expect(root.classList.contains("dark")).toBe(false)
    expect(root.style.getPropertyValue("--theme-transition-from")).toBe("")
  })

  it("skips the animation for users who prefer reduced motion", async () => {
    emulate({ reducedMotion: true })
    const { transition } = captureTransitions()
    const { result, act } = await renderTheme({ defaultTheme: "light" })
    await expect.poll(() => result.current.resolvedTheme).toBe("light")
    await act(() => result.current.setTheme("dark", { effect: "circle" }))
    expect(transition).not.toHaveBeenCalled()
    expect(root.classList.contains("dark")).toBe(true)
  })

  it("skips the animation when the theme does not change", async () => {
    emulate()
    const { transition } = captureTransitions()
    const { result, act } = await renderTheme({ defaultTheme: "light" })
    await expect.poll(() => result.current.resolvedTheme).toBe("light")
    await act(() => result.current.setTheme("light", { effect: "circle" }))
    expect(transition).not.toHaveBeenCalled()
  })
})

describe("ThemeToggle", () => {
  it("switches between light and dark and describes the next action", async () => {
    emulate()
    const screen = await render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    )
    const toLight = page.getByRole("button", { name: "Switch to light theme" })
    const toDark = screen.getByRole("button", { name: "Switch to dark theme" })
    await toDark.click()
    await expect.element(toLight).toBeVisible()
    expect(root.classList.contains("dark")).toBe(true)
    await toLight.click()
    await expect.element(toDark).toBeVisible()
    expect(root.classList.contains("dark")).toBe(false)
  })
})

describe("themeScript", () => {
  function run(script: string) {
    new Function(script)()
  }

  it("applies the saved theme before React loads", () => {
    emulate()
    localStorage.setItem("theme", "dark")
    run(themeScript())
    expect(root.classList.contains("dark")).toBe(true)
    expect(root.style.colorScheme).toBe("dark")
  })

  it("falls back to the OS setting for system", () => {
    emulate({ dark: true })
    run(themeScript("theme", "system"))
    expect(root.classList.contains("dark")).toBe(true)
  })

  it("uses its own storage key and default", () => {
    emulate({ dark: true })
    localStorage.setItem("theme", "dark")
    run(themeScript("app-theme", "light"))
    expect(root.classList.contains("dark")).toBe(false)
    expect(root.style.colorScheme).toBe("light")
  })
})
