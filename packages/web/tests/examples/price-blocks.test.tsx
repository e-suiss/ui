import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { PriceBundle } from "@/components/blocks/price-bundle"
import { PriceCare } from "@/components/blocks/price-care"
import { PriceStorage } from "@/components/blocks/price-storage"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const SINGLE = byBase({
  base: { group: "group", role: "button", pressed: "aria-pressed" },
  radix: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
} as const)

const TWO_TB_PLAN = /^2 TB\b/
const SIX_TB_PLAN = /^6 TB\b/
const PLAN_ACTION = /^(Switch to|Your plan)/
const PREMIER_PLAN = /^Premier\b/
const FAMILY_PLAN = /^Family\b/
const SAVING = /^Save \$\d+ compared/

test("Storage", async () => {
  const { canvas, step } = await renderExample(<PriceStorage />)

  await step("yearly billing changes the prices", async () => {
    const yearly = canvas.getByRole(SINGLE.role, {
      name: "Yearly · 2 months free",
    })
    await userEvent.click(yearly)
    await expect(yearly).toHaveAttribute(SINGLE.pressed, "true")
    const sixTb = canvas
      .getByRole("radio", { name: SIX_TB_PLAN })
      .closest("label")
    await waitFor(() => expect(sixTb).toHaveTextContent("$299.90 /yr"))
  })

  await step("picking a plan offers to switch to it", async () => {
    const plan = canvas.getByRole("radio", { name: TWO_TB_PLAN })
    const card = plan.closest("label")
    if (!card) throw new Error("Missing plan card")
    await userEvent.click(card)
    await expect(plan).toBeChecked()
    const action = canvas.getByRole("button", { name: PLAN_ACTION })
    await expect(action).toHaveAccessibleName("Switch to 2 TB")
    await userEvent.click(action)
    await expect(action).toHaveAccessibleName("Your plan is updated")
  })
})
test("Bundle", async () => {
  const { canvas, step } = await renderExample(<PriceBundle />)

  await step("picking a plan updates the saving", async () => {
    await expect(canvas.getByRole("radio", { name: FAMILY_PLAN })).toBeChecked()
    const saving = canvas.getByRole("link", { name: SAVING })
    await expect(saving).toHaveAccessibleName(
      "Save $8 compared to buying separately ›"
    )
    const premier = canvas.getByRole("radio", { name: PREMIER_PLAN })
    const card = premier.closest("label")
    if (!card) throw new Error("Missing plan card")
    await userEvent.click(card)
    await expect(premier).toBeChecked()
    await waitFor(() =>
      expect(saving).toHaveAccessibleName(
        "Save $29 compared to buying separately ›"
      )
    )
  })
})
test("Care", async () => {
  const { canvas, step } = await renderExample(<PriceCare />)

  const total = canvas.getByText("Total", { exact: true }).nextElementSibling

  await step("theft and loss protection adds to the total", async () => {
    await expect(total).toHaveTextContent("$99.99")
    const theft = canvas.getByRole("switch", {
      name: "Add theft and loss protection",
    })
    await userEvent.click(theft)
    await expect(theft).toBeChecked()
    await waitFor(() => expect(total).toHaveTextContent("$149.99"))
  })

  await step("another device brings its own price", async () => {
    const devices = canvas.getByRole(SINGLE.group, { name: "Device" })
    const watch = within(devices).getByRole(SINGLE.role, { name: "Watch" })
    await userEvent.click(watch)
    await expect(watch).toHaveAttribute(SINGLE.pressed, "true")
    await waitFor(() => expect(total).toHaveTextContent("$79.00"))
  })
})
