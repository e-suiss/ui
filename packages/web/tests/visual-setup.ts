import axe from "axe-core"
import { beforeEach, expect, inject, type TestContext, vi } from "vitest"
import { commands, page } from "vitest/browser"

import { findLayoutIssues, type LayoutFinding } from "./layout"
import { holdingTimers, settle, transitionsDone } from "./settle"

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

async function capture(task: TestContext["task"]) {
  const root = document.documentElement
  const wasDark = root.classList.contains("dark")
  const padding = document.body.style.padding
  const name = `${task.name}${SUFFIX}`
  const found: Finding[] = []
  document.body.style.padding = "16px"
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
          animations: "disabled",
          caret: "hide",
          mask: Array.from(
            document.querySelectorAll("[data-visual-mask]"),
            (element) => page.elementLocator(element)
          ),
        },
      })
    }
  } finally {
    root.classList.toggle("dark", wasDark)
    document.body.style.padding = padding
    window.dispatchEvent(new Event("resize"))
    await transitionsDone()
  }
  if (found.length === 0) return
  await commands.writeFile(
    `${FINDINGS}/${`${task.file.name}-${name}`.replace(/\W+/g, "-")}.json`,
    JSON.stringify({ example: `${task.file.name} > ${name}`, found }, null, 2)
  )
}

let current: TestContext | undefined

beforeEach((context) => {
  vi.setSystemTime(new Date(2026, 0, 15, 9, 41))
  current = context
})

Object.assign(globalThis, {
  afterExampleRender: async () => {
    const context = current
    current = undefined
    if (!context) return
    await holdingTimers(() => capture(context.task))
    if (RTL) context.skip()
  },
})
