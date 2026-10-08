import { afterEach, beforeEach } from "vitest"
import { cdp, commands } from "vitest/browser"

import { settle } from "./settle"

function setFontSize(standard: number) {
  return cdp().send("Page.setFontSizes", {
    fontSizes: { standard, fixed: Math.round(standard * 0.8125) },
  })
}

function describe(element: Element) {
  const slot = element.getAttribute("data-slot")
  const name = (element.textContent ?? "").trim().slice(0, 40)
  return `${element.tagName.toLowerCase()}${slot ? `[${slot}]` : ""} "${name}"`
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

function overflowing(width: number) {
  return Array.from(document.body.querySelectorAll("*")).filter((element) => {
    const parent = element.parentElement
    return (
      element.getBoundingClientRect().right > width + 1 &&
      parent !== null &&
      parent.getBoundingClientRect().right <= width + 1
    )
  })
}

beforeEach(async () => {
  await setFontSize(32)
  document.body.style.padding = "1rem"
})

afterEach(async ({ task }) => {
  try {
    await settle()
    const found: { check: string; rule: string; targets: string[] }[] = []
    const scroller = document.scrollingElement
    if (scroller && scroller.scrollWidth > scroller.clientWidth + 1) {
      found.push({
        check: "text-200",
        rule: "page-scrolls-sideways",
        targets: [
          `${scroller.scrollWidth}px wide in ${scroller.clientWidth}px`,
          ...overflowing(scroller.clientWidth).map(describe),
        ],
      })
    }
    const clipped = Array.from(document.body.querySelectorAll("*"))
      .filter(clipsText)
      .map(describe)
    if (clipped.length > 0) {
      found.push({ check: "text-200", rule: "text-clipped", targets: clipped })
    }
    if (found.length > 0) {
      await commands.writeFile(
        `.vitest/text/${`${task.file.name}-${task.name}`.replace(/\W+/g, "-")}.json`,
        JSON.stringify(
          { story: `${task.file.name} > ${task.name}`, found },
          null,
          2
        )
      )
    }
  } finally {
    await setFontSize(16)
  }
})
