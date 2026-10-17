import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import TestResultsDemo from "@/examples/test-results-demo"
import TestResultsSuites from "@/examples/test-results-suites"
import { renderExample } from "@/tests/render-example"

const SUMMARY_DEMO = /Ran 5 tests, 1 failed/
const PAYMENT = /payment\.test\.ts/
const CART = /cart\.test\.ts/
const SUMMARY_SUITES = /Ran 8 tests, 2 failed, 1 skipped/
const AUTH = /auth\.test\.ts/
const USER_API = /user-api\.test\.ts/
const UPDATES = /updates a user profile/

test("Default", async () => {
  const { canvas, step } = await renderExample(<TestResultsDemo />)

  await step("opens the failing suite and test", async () => {
    await expect(
      canvas.getByRole("button", { name: SUMMARY_DEMO })
    ).toHaveAttribute("aria-expanded", "true")
    await expect(canvas.getByRole("button", { name: PAYMENT })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await expect(
      canvas.getByText(
        (_, element) =>
          element?.tagName === "CODE" &&
          (element.textContent ?? "").includes(
            "Expected 2 charge attempts, received 1"
          )
      )
    ).toBeVisible()
  })

  await step("keeps the passing suite closed", async () => {
    await expect(canvas.getByRole("button", { name: CART })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
  })
})
test("Suites", async () => {
  const { canvas, step } = await renderExample(<TestResultsSuites />)

  await step("summarizes every suite", async () => {
    await expect(
      canvas.getByRole("button", { name: SUMMARY_SUITES })
    ).toHaveAttribute("aria-expanded", "true")
    await expect(canvas.getByRole("button", { name: AUTH })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    await expect(
      canvas.getByRole("button", { name: USER_API })
    ).toHaveAttribute("aria-expanded", "true")
    await expect(canvas.getByText("Skipped deletes a user")).toBeVisible()
  })

  await step("expands a failed test into its error", async () => {
    const failed = canvas.getByRole("button", { name: UPDATES })
    await expect(failed).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(failed)
    await expect(failed).toHaveAttribute("aria-expanded", "true")
  })
})
