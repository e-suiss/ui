import axe from "axe-core"
import { afterEach, beforeEach, expect, inject, vi } from "vitest"
import { commands, page } from "vitest/browser"

import { findLayoutIssues, type LayoutFinding } from "./layout"
import { settle } from "./settle"

vi.useFakeTimers({ toFake: ["Date"], shouldAdvanceTime: true })
vi.setSystemTime(new Date(2026, 0, 15, 9, 41))

const RTL =
  (globalThis as { exampleDirection?: string }).exampleDirection === "rtl"
const THEMES = ["light", "dark"] as const
const SUFFIX = RTL ? "-rtl" : ""
const FINDINGS = `.vitest/visual-findings/${inject("base")}/${inject("style") ?? "suiss"}`

type Finding = LayoutFinding & { theme: (typeof THEMES)[number] }

function blank() {
  return !Array.from(document.body.querySelectorAll("*")).some((element) => {
    const box = element.getBoundingClientRect()
    if (box.width < 1 || box.height < 1) return false
    const style = getComputedStyle(element)
    return style.visibility !== "hidden" && Number(style.opacity) > 0
  })
}

async function contrast(): Promise<LayoutFinding[]> {
  const { violations } = await axe.run(document, {
    runOnly: { type: "rule", values: ["color-contrast"] },
    resultTypes: ["violations"],
  })
  return violations.map((violation) => ({
    check: "visual",
    rule: violation.id,
    targets: violation.nodes.map((node) => node.target.join(" ")),
  }))
}

beforeEach(() => {
  vi.setSystemTime(new Date(2026, 0, 15, 9, 41))
})

afterEach(async ({ task }) => {
  if (task.result?.state === "fail") return
  const root = document.documentElement
  const wasDark = root.classList.contains("dark")
  const name = `${task.name}${SUFFIX}`
  const found: Finding[] = []
  try {
    for (const theme of THEMES) {
      root.classList.toggle("dark", theme === "dark")
      await settle()
      expect(blank(), `${name} rendered nothing in ${theme}`).toBe(false)
      for (const finding of [
        ...findLayoutIssues("visual"),
        ...(await contrast()),
      ]) {
        found.push({ ...finding, theme })
      }
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
  if (found.length === 0) return
  await commands.writeFile(
    `${FINDINGS}/${`${task.file.name}-${name}`.replace(/\W+/g, "-")}.json`,
    JSON.stringify({ example: `${task.file.name} > ${name}`, found }, null, 2)
  )
})
