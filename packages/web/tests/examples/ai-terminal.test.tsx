import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import TerminalDemo from "@/examples/terminal-demo"
import TerminalError from "@/examples/terminal-error"
import { renderExample } from "@/tests/render-example"

const RAN_PNPM_BUILD = /Ran pnpm build/
const RAN_PNPM_TEST = /Ran pnpm test/
const COMPILED = /Compiled successfully/
const TESTS_PASSED = /15 passed/
const LINT_FAILED = /pnpm lint exited with code 1/
const PROBLEMS = /2 problems/

test("Default", async () => {
  const { canvas, step } = await renderExample(<TerminalDemo />)

  await step("opens the last command", async () => {
    await expect(
      canvas.getByRole("button", { name: RAN_PNPM_BUILD })
    ).toHaveAttribute("aria-expanded", "true")
    await expect(canvas.getByText(COMPILED)).toBeVisible()
  })

  await step("expands an earlier command", async () => {
    const test = canvas.getByRole("button", { name: RAN_PNPM_TEST })
    await expect(test).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(test)
    await expect(test).toHaveAttribute("aria-expanded", "true")
    await expect(await canvas.findByText(TESTS_PASSED)).toBeVisible()
  })
})
test("Error", async () => {
  const { canvas, canvasElement } = await renderExample(<TerminalError />)

  await expect(
    canvas.getByRole("button", { name: LINT_FAILED })
  ).toHaveAttribute("aria-expanded", "true")
  await expect(canvas.getByText(PROBLEMS)).toBeVisible()
  await expect(
    canvasElement.querySelector('[data-status="error"]')
  ).not.toBeNull()
})
