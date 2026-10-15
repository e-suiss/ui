import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import CollapsibleDemo from "@/examples/collapsible-demo"
import CollapsibleDisabled from "@/examples/collapsible-disabled"
import CollapsibleOpenByDefault from "@/examples/collapsible-open-by-default"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<CollapsibleDemo />)

  const trigger = canvas.getByRole("button", { name: "Toggle list" })

  await step("starts collapsed", async () => {
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(canvas.queryByText("esuiss/docs")).toBeNull()
  })

  await step("expands on click", async () => {
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(await canvas.findByText("esuiss/docs")).toBeVisible()
  })

  await step("collapses with Enter", async () => {
    await userEvent.keyboard("{Enter}")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await waitFor(() => expect(canvas.queryByText("esuiss/docs")).toBeNull())
  })
})
test("Open By Default", async () => {
  const { canvas } = await renderExample(<CollapsibleOpenByDefault />)

  await expect(
    canvas.getByRole("button", { name: "Toggle list" })
  ).toHaveAttribute("aria-expanded", "true")
  await expect(canvas.getByText("esuiss/cli")).toBeVisible()
})
test("Disabled", async () => {
  const { canvas } = await renderExample(<CollapsibleDisabled />)

  const trigger = canvas.getByRole("button", { name: "Toggle list" })
  await userEvent.click(trigger, { pointerEventsCheck: 0 })
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(canvas.queryByText("esuiss/docs")).toBeNull()
})
