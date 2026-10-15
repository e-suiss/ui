import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { GridAccessories } from "@/components/blocks/grid-accessories"
import { GridCarousel } from "@/components/blocks/grid-carousel"
import { GridLineup } from "@/components/blocks/grid-lineup"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const SINGLE = byBase({
  base: { group: "group", role: "button", pressed: "aria-pressed" },
  radix: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
} as const)

test("Carousel", async () => {
  const { canvas, step } = await renderExample(<GridCarousel />)

  await step("the arrows page through the products", async () => {
    const previous = canvas.getByRole("button", { name: "Previous slide" })
    const next = canvas.getByRole("button", { name: "Next slide" })
    await expect(previous).toBeDisabled()
    await userEvent.click(next)
    await waitFor(() => expect(previous).toBeEnabled())
    await userEvent.click(previous)
    await waitFor(() => expect(previous).toBeDisabled())
  })
})
test("Lineup", async () => {
  const { canvas, step } = await renderExample(<GridLineup />)

  await step("picking a finish selects it for that model only", async () => {
    const phone = canvas.getByRole(SINGLE.group, { name: "Phone finish" })
    const sage = within(phone).getByRole(SINGLE.role, { name: "Sage" })
    await userEvent.click(sage)
    await expect(sage).toHaveAttribute(SINGLE.pressed, "true")
    await expect(
      within(phone).getByRole(SINGLE.role, { name: "Lavender" })
    ).toHaveAttribute(SINGLE.pressed, "false")
    const phoneE = canvas.getByRole(SINGLE.group, { name: "Phone e finish" })
    await expect(
      within(phoneE).getByRole(SINGLE.role, { name: "Black" })
    ).toHaveAttribute(SINGLE.pressed, "true")
  })
})
test("Accessories", async () => {
  const { canvas, step } = await renderExample(<GridAccessories />)

  const status = canvas.getByRole("status")

  await step("a category filter narrows the products", async () => {
    const audio = canvas.getByRole(SINGLE.role, { name: "Audio" })
    await userEvent.click(audio)
    await expect(audio).toHaveAttribute(SINGLE.pressed, "true")
    await waitFor(() =>
      expect(
        canvas.queryByRole("button", { name: "Add Sport Band to bag" })
      ).toBeNull()
    )
  })

  await step("adding an item counts it in the bag", async () => {
    await expect(status).toHaveAccessibleName("0 items in bag")
    await userEvent.click(
      canvas.getByRole("button", { name: "Add Pods Sage Headphones to bag" })
    )
    await expect(
      canvas.getByRole("button", {
        name: "Remove Pods Sage Headphones from bag",
      })
    ).toHaveAttribute("aria-pressed", "true")
    await expect(status).toHaveAccessibleName("1 items in bag")
  })
})
