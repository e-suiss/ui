import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { GridAccessories } from "@/components/blocks/grid-accessories"
import { GridCarousel } from "@/components/blocks/grid-carousel"
import { GridLineup } from "@/components/blocks/grid-lineup"
import { renderExample } from "@/tests/render-example"

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
    const phone = canvas.getByRole("group", { name: "Phone finish" })
    const sage = within(phone).getByRole("button", { name: "Sage" })
    await userEvent.click(sage)
    await expect(sage).toHaveAttribute("aria-pressed", "true")
    await expect(
      within(phone).getByRole("button", { name: "Lavender" })
    ).toHaveAttribute("aria-pressed", "false")
    const phoneE = canvas.getByRole("group", { name: "Phone e finish" })
    await expect(
      within(phoneE).getByRole("button", { name: "Black" })
    ).toHaveAttribute("aria-pressed", "true")
  })
})
test("Accessories", async () => {
  const { canvas, step } = await renderExample(<GridAccessories />)

  const status = canvas.getByRole("status")

  await step("a category filter narrows the products", async () => {
    const audio = canvas.getByRole("button", { name: "Audio" })
    await userEvent.click(audio)
    await expect(audio).toHaveAttribute("aria-pressed", "true")
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
