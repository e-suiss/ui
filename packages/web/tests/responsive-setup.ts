import { afterEach, beforeEach, inject } from "vitest"
import { commands, page } from "vitest/browser"

import { findLayoutIssues } from "./layout"
import { settle } from "./settle"

declare module "vitest" {
  interface ProvidedContext {
    responsiveWidth: number
  }
}

const WIDTH = inject("responsiveWidth")
const HEIGHT = 900

const fixed = page as typeof page & { resizeToWidth?: typeof page.viewport }

if (!fixed.resizeToWidth) {
  const resize = page.viewport
  fixed.resizeToWidth = resize
  page.viewport = function (this: typeof page) {
    return resize.call(this, WIDTH, HEIGHT)
  }
}

beforeEach(() => {
  document.body.style.padding = "1rem"
})

afterEach(async ({ task }) => {
  await settle()
  const found = findLayoutIssues(`${WIDTH}px`)
  if (found.length === 0) return
  await commands.writeFile(
    `.vitest/responsive/${WIDTH}-${`${task.file.name}-${task.name}`.replace(/\W+/g, "-")}.json`,
    JSON.stringify(
      { story: `${task.file.name} > ${task.name}`, found },
      null,
      2
    )
  )
})
