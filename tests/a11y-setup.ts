import axe from "axe-core"
import { afterEach, beforeEach } from "vitest"
import { commands, page, userEvent } from "vitest/browser"

import { settle, transitionsDone } from "./settle"

type Finding = {
  check: "axe" | "focus"
  theme: "light" | "dark"
  rule: string
  targets: string[]
}

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

function describe(element: Element) {
  const slot = element.getAttribute("data-slot")
  const name = (element.getAttribute("aria-label") ?? element.textContent ?? "")
    .trim()
    .slice(0, 40)
  return `${element.tagName.toLowerCase()}${slot ? `[${slot}]` : ""} "${name}"`
}

async function axeFindings(theme: Finding["theme"]) {
  const { violations } = await axe.run(document, {
    runOnly: { type: "tag", values: WCAG },
    resultTypes: ["violations"],
  })
  return violations.map(
    (violation): Finding => ({
      check: "axe",
      theme,
      rule: violation.id,
      targets: violation.nodes.map(
        (node) =>
          `${node.target.join(" ")} — ${node.failureSummary?.split("\n").slice(1).join(" ").trim()}`
      ),
    })
  )
}

function screenshot() {
  return page.screenshot({
    save: false,
    caret: "hide",
    animations: "disabled",
    scale: "css",
  })
}

async function focusFindings(
  theme: Finding["theme"],
  name: string
): Promise<Finding[]> {
  const missing: string[] = []
  const seen = new Set<Element>()
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
  for (let step = 0; step < 25; step++) {
    await userEvent.tab()
    const element = document.activeElement
    if (!(element instanceof HTMLElement) || element === document.body) break
    if (seen.has(element)) break
    seen.add(element)
    await transitionsDone()
    const focused = await screenshot()
    element.blur()
    await transitionsDone()
    const blurred = await screenshot()
    if (focused === blurred) {
      missing.push(describe(element))
      await commands.writeFile(
        `.vitest/a11y-focus/${name}-${missing.length}.png`,
        focused,
        "base64"
      )
    }
  }
  return missing.length > 0
    ? [{ check: "focus", theme, rule: "no-visible-focus", targets: missing }]
    : []
}

beforeEach(() => {
  document.body.style.padding = "1rem"
})

afterEach(async ({ task }) => {
  if (task.result?.state === "fail") return
  const root = document.documentElement
  const wasDark = root.classList.contains("dark")
  const found: Finding[] = []
  try {
    for (const theme of ["light", "dark"] as const) {
      root.classList.toggle("dark", theme === "dark")
      await settle()
      found.push(...(await axeFindings(theme)))
    }
    root.classList.toggle("dark", false)
    await settle()
    found.push(
      ...(await focusFindings(
        "light",
        `${task.file.name}-${task.name}`.replace(/\W+/g, "-")
      ))
    )
  } finally {
    root.classList.toggle("dark", wasDark)
  }
  if (found.length > 0) {
    await commands.writeFile(
      `.vitest/a11y/${task.file.name.replace(/\W+/g, "-")}-${task.name.replace(/\W+/g, "-")}.json`,
      JSON.stringify(
        { story: `${task.file.name} > ${task.name}`, found },
        null,
        2
      )
    )
  }
})
