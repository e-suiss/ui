import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { LogActivity } from "@/components/blocks/log-activity"
import { LogLive } from "@/components/blocks/log-live"
import { LogSecurity } from "@/components/blocks/log-security"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const TYPE_TRIGGER = byBase<[string, { name: string | RegExp }]>({
  base: ["combobox", { name: "Type" }],
  radix: ["combobox", { name: "Type" }],
  aria: ["button", { name: /Type$/ }],
})

test("Activity", async () => {
  const { canvas, step } = await renderExample(<LogActivity />)

  await step("filtering by type narrows the events", async () => {
    await expect(canvas.getByText("Price: Phone Pro")).toBeInTheDocument()
    await userEvent.click(canvas.getByRole(...TYPE_TRIGGER))
    await userEvent.click(await screen.findByRole("option", { name: "Order" }))
    await waitFor(() =>
      expect(canvas.queryByText("Price: Phone Pro")).toBeNull()
    )
    await expect(canvas.getByText("Order W1044 · $999")).toBeInTheDocument()
  })
})
test("Live", async () => {
  const { canvas, step } = await renderExample(<LogLive />)

  await step("pausing stops the feed", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Pause" }))
    await expect(
      await canvas.findByRole("button", { name: "Resume" })
    ).toBeVisible()
    await expect(canvas.getByText("Paused")).toBeInTheDocument()
    await expect(canvas.queryByText("Live", { exact: true })).toBeNull()
  })

  await step("resuming restarts it", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Resume" }))
    await expect(
      await canvas.findByText("Events appear as they happen")
    ).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: "Pause" })).toBeVisible()
  })
})
test("Security", async () => {
  const { canvas, step } = await renderExample(<LogSecurity />)

  await step("resolving an alert lowers the open count", async () => {
    await expect(canvas.getByText("4 open alerts")).toBeInTheDocument()
    const alert = canvas
      .getByText("Sign-in from an unusual location")
      .closest("li")
    if (!(alert instanceof HTMLElement)) throw new Error("Missing alert")
    await userEvent.click(
      within(alert).getByRole("button", { name: "Resolve" })
    )
    await expect(await canvas.findByText("3 open alerts")).toBeInTheDocument()
  })
})
