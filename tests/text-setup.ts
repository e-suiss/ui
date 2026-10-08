import { afterEach, beforeEach } from "vitest"
import { cdp, commands } from "vitest/browser"

import { findLayoutIssues } from "./layout"
import { settle } from "./settle"

function setFontSize(standard: number) {
  return cdp().send("Page.setFontSizes", {
    fontSizes: { standard, fixed: Math.round(standard * 0.8125) },
  })
}

beforeEach(async () => {
  await setFontSize(32)
  document.body.style.padding = "1rem"
})

afterEach(async ({ task }) => {
  try {
    await settle()
    const found = findLayoutIssues("text-200")
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
