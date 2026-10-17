import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import TraceCollapsible from "@/examples/trace-collapsible"
import TraceCommit from "@/examples/trace-commit"
import TraceDemo from "@/examples/trace-demo"
import TraceDescription from "@/examples/trace-description"
import TraceDialog from "@/examples/trace-dialog"
import TraceGroup from "@/examples/trace-group"
import TraceLink from "@/examples/trace-link"
import TraceOpen from "@/examples/trace-open"
import TraceSheet from "@/examples/trace-sheet"
import TraceSources from "@/examples/trace-sources"
import TraceStatic from "@/examples/trace-static"
import TraceStatus from "@/examples/trace-status"
import TraceSteps from "@/examples/trace-steps"
import TraceThinking from "@/examples/trace-thinking"
import TraceToolCalls from "@/examples/trace-tool-calls"
import TraceTurn from "@/examples/trace-turn"
import { renderExample } from "@/tests/render-example"

const FAILED_TO_RUN_PNPM_INSTALL = /Failed to run pnpm install/
const ERR_PNPM_OUTDATED_LOCKFILE = /ERR_PNPM_OUTDATED_LOCKFILE/
const THOUGHT_FOR_5S = /Thought for 5s/
const RAN_NODE_VERSION = /Ran node --version/
const V24_18_0 = /v24\.18\.0/
const RAN_PNPM_VERSION = /Ran pnpm --version/
const INSTALL_ASTRO_OPENS_IN_A_NEW_TAB = /Install Astro.*opens in a new tab/
const SEARCHED_THE_WEB_FOR_CACHE_KEYS = /Searched the web for cache keys/
const EXPLORED_4_FILES = /Explored 4 files/
const SOURCES = /sources/
const LOOKING_INTO_THE_SLOW_DEPLOY = /Looking into the slow deploy/
const COMMITTED_A1B2C3 = /Committed a1b2c3/
const WORKED_FOR_2M_4S = /Worked for 2m 4s/
const THOUGHT = /Thought/

test("Default", async () => {
  const { canvas, step } = await renderExample(<TraceDemo />)

  await step("opens the failed command by default", async () => {
    const failed = canvas.getByRole("button", {
      name: FAILED_TO_RUN_PNPM_INSTALL,
    })
    await expect(failed).toHaveAttribute("aria-expanded", "true")
    await expect(canvas.getByText(ERR_PNPM_OUTDATED_LOCKFILE)).toBeVisible()
  })

  await step("keeps the other rows closed", async () => {
    await expect(
      canvas.getByRole("button", { name: THOUGHT_FOR_5S })
    ).toHaveAttribute("aria-expanded", "false")
  })
})
test("Static", async () => {
  const { canvas, step } = await renderExample(<TraceStatic />)

  await step("reads as text, not a control", async () => {
    await expect(
      canvas.getByText("Created branch fix/frozen-lockfile")
    ).toBeVisible()
    await expect(canvas.queryByRole("button")).toBeNull()
  })

  await step("hides the icon from assistive tech", async () => {
    const icon = canvas
      .getByText("Created branch fix/frozen-lockfile")
      .closest('[data-slot="trace-line"]')
      ?.querySelector('[data-slot="trace-icon"]')
    await expect(icon).toHaveAttribute("aria-hidden", "true")
  })
})
test("Status", async () => {
  const { canvasElement } = await renderExample(<TraceStatus />)

  const statuses = [
    ...canvasElement.querySelectorAll('[data-slot="trace-line"]'),
  ].map((line) => line.getAttribute("data-status"))
  await expect(statuses).toEqual([null, "error", "running", "pending"])
})
test("Description", async () => {
  const { canvas } = await renderExample(<TraceDescription />)

  await expect(canvas.getByText("Ran pnpm test")).toBeVisible()
})
test("Collapsible", async () => {
  const { canvas, step } = await renderExample(<TraceCollapsible />)

  const trigger = canvas.getByRole("button", { name: RAN_NODE_VERSION })

  await step("starts collapsed", async () => {
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  await step("expands on click", async () => {
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(await canvas.findByText(V24_18_0)).toBeVisible()
  })

  await step("collapses with Enter", async () => {
    await userEvent.keyboard("{Enter}")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await waitFor(() => expect(canvas.queryByText(V24_18_0)).toBeNull())
  })
})
test("Controlled", async () => {
  const { canvas, step } = await renderExample(<TraceOpen />)

  await step("opens the first row by default", async () => {
    await expect(
      canvas.getByRole("button", { name: RAN_NODE_VERSION })
    ).toHaveAttribute("aria-expanded", "true")
  })

  await step("opens the second row from the button", async () => {
    const row = canvas.getByRole("button", { name: RAN_PNPM_VERSION })
    await expect(row).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(
      canvas.getByRole("button", { name: "Show the pnpm output" })
    )
    await expect(row).toHaveAttribute("aria-expanded", "true")
    await expect(
      canvas.getByRole("button", { name: "Hide the pnpm output" })
    ).toBeVisible()
  })
})
test("Link", async () => {
  const { canvas } = await renderExample(<TraceLink />)

  await expect(
    canvas.getByRole("link", { name: INSTALL_ASTRO_OPENS_IN_A_NEW_TAB })
  ).toHaveAttribute("target", "_blank")
})
test("Dialog", async () => {
  const { canvas, step } = await renderExample(<TraceDialog />)

  await step("opens the results in a dialog", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: SEARCHED_THE_WEB_FOR_CACHE_KEYS })
    )
    const dialog = await screen.findByRole("dialog", {
      name: "Searched the web for cache keys",
    })
    await waitFor(() => expect(dialog).toBeVisible())
  })

  await step("closes with Escape", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Sheet", async () => {
  const { canvas } = await renderExample(<TraceSheet />)

  await userEvent.click(canvas.getByRole("button", { name: EXPLORED_4_FILES }))
  const sheet = await screen.findByRole("dialog", { name: "Explored 4 files" })
  await waitFor(() => expect(sheet).toBeVisible())
  await userEvent.keyboard("{Escape}")
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
})
test("Group", async () => {
  const { canvasElement } = await renderExample(<TraceGroup />)

  await expect(
    canvasElement.querySelectorAll('[data-slot="trace-line"]')
  ).toHaveLength(3)
})
test("Sources", async () => {
  const { canvas } = await renderExample(<TraceSources />)

  await expect(canvas.getByRole("button", { name: SOURCES })).toHaveAttribute(
    "aria-expanded",
    "true"
  )
  await expect(canvas.getAllByRole("link").length).toBeGreaterThan(0)
})
test("Steps", async () => {
  const { canvas } = await renderExample(<TraceSteps />)

  await expect(
    canvas.getByRole("button", { name: LOOKING_INTO_THE_SLOW_DEPLOY })
  ).toHaveAttribute("aria-expanded", "true")
  await expect(
    canvas.getByText("Searching for the cache key").closest("[data-status]")
  ).toHaveAttribute("data-status", "running")
})
test("Commit", async () => {
  const { canvas } = await renderExample(<TraceCommit />)

  await expect(
    canvas.getByRole("button", { name: COMMITTED_A1B2C3 })
  ).toHaveAttribute("aria-expanded", "true")
})
test("Whole Turn", async () => {
  const { canvas } = await renderExample(<TraceTurn />)

  await expect(
    canvas.getByRole("button", { name: WORKED_FOR_2M_4S })
  ).toHaveAttribute("aria-expanded", "true")
})
test("Reasoning", async () => {
  const { canvas } = await renderExample(<TraceThinking />)

  const trigger = canvas.getByRole("button", { name: THOUGHT })
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await userEvent.click(trigger)
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
})
test("Tool Calls", async () => {
  const { canvasElement } = await renderExample(<TraceToolCalls />)

  await expect(
    canvasElement.querySelector('[data-status="error"]')
  ).not.toBeNull()
})
