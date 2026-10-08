import axe from "axe-core"
import { afterEach, beforeEach } from "vitest"
import { commands, page, userEvent } from "vitest/browser"

import { settle, transitionsDone } from "./settle"

type Finding = {
  check: "axe" | "focus" | "text-200"
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

function visuallyHidden(element: Element) {
  const box = element.getBoundingClientRect()
  return box.width <= 1 || box.height <= 1
}

function clipsText(element: Element) {
  if (visuallyHidden(element)) return false
  const style = getComputedStyle(element)
  if (style.textOverflow === "ellipsis") return false
  if (style.webkitLineClamp !== "none") return false
  const ownText = Array.from(element.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
  )
  if (!ownText) return false
  const clipsX =
    ["hidden", "clip"].includes(style.overflowX) &&
    element.scrollWidth > element.clientWidth + 1
  const clipsY =
    ["hidden", "clip"].includes(style.overflowY) &&
    element.scrollHeight > element.clientHeight + 1
  return clipsX || clipsY
}

async function largeTextFindings(theme: Finding["theme"]) {
  const root = document.documentElement
  root.style.fontSize = "200%"
  try {
    await settle()
    const findings: Finding[] = []
    const scroller = document.scrollingElement
    if (scroller && scroller.scrollWidth > scroller.clientWidth + 1) {
      findings.push({
        check: "text-200",
        theme,
        rule: "page-scrolls-sideways",
        targets: [
          `${scroller.scrollWidth}px wide in ${scroller.clientWidth}px`,
        ],
      })
    }
    const clipped = Array.from(document.body.querySelectorAll("*"))
      .filter(clipsText)
      .map(describe)
    if (clipped.length > 0) {
      findings.push({
        check: "text-200",
        theme,
        rule: "text-clipped",
        targets: clipped,
      })
    }
    return findings
  } finally {
    root.style.fontSize = ""
    await settle()
  }
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
    found.push(...(await largeTextFindings("light")))
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
