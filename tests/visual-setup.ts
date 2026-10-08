import { afterEach, beforeEach, expect, vi } from "vitest"
import { page } from "vitest/browser"

import { settle } from "./settle"

vi.useFakeTimers({ toFake: ["Date"], shouldAdvanceTime: true })
vi.setSystemTime(new Date(2026, 0, 15, 9, 41))

const RTL =
  (globalThis as { storybookDirection?: string }).storybookDirection === "rtl"
const THEMES = RTL ? (["light"] as const) : (["light", "dark"] as const)
const SUFFIX = RTL ? "-rtl" : ""

beforeEach(() => {
  vi.setSystemTime(new Date(2026, 0, 15, 9, 41))
  document.body.style.padding = "1rem"
})

afterEach(async ({ task }) => {
  if (task.result?.state === "fail") return
  const root = document.documentElement
  const wasDark = root.classList.contains("dark")
  try {
    for (const theme of THEMES) {
      root.classList.toggle("dark", theme === "dark")
      await settle()
      await expect(page).toMatchScreenshot(`${task.name}-${theme}${SUFFIX}`, {
        screenshotOptions: {
          mask: Array.from(
            document.querySelectorAll("[data-visual-mask]"),
            (element) => page.elementLocator(element)
          ),
        },
      })
    }
  } finally {
    root.classList.toggle("dark", wasDark)
  }
})
