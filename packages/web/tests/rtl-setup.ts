import { afterEach } from "vitest"
import { commands } from "vitest/browser"

import { findLayoutIssues } from "./layout"
import { settle } from "./settle"

Object.assign(globalThis, { storybookDirection: "rtl" })

afterEach(async ({ task }) => {
  await settle()
  const found = findLayoutIssues("rtl")
  if (found.length === 0) return
  await commands.writeFile(
    `.vitest/rtl/${`${task.file.name}-${task.name}`.replace(/\W+/g, "-")}.json`,
    JSON.stringify(
      { story: `${task.file.name} > ${task.name}`, found },
      null,
      2
    )
  )
})
