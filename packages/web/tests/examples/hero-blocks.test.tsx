import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { HeroCinematic } from "@/components/blocks/hero-cinematic"
import { HeroProduct } from "@/components/blocks/hero-product"
import { HeroTiles } from "@/components/blocks/hero-tiles"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const SINGLE = byBase({
  base: { group: "group", role: "button", pressed: "aria-pressed" },
  radix: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
  aria: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
} as const)

test("Product", async () => {
  const { canvas, step } = await renderExample(<HeroProduct />)

  await step("shows the product with its calls to action", async () => {
    await waitFor(() =>
      expect(
        canvas.getByRole("heading", { level: 1, name: "Phone Pro" })
      ).toBeVisible()
    )
    await expect(
      canvas.getByRole("button", { name: "Learn more" })
    ).toBeEnabled()
    await expect(canvas.getByRole("button", { name: "Buy" })).toBeEnabled()
    await expect(
      canvas.getByText("From $999 or $41.62/mo. for 24 mo.")
    ).toBeVisible()
  })
})
test("Cinematic", async () => {
  const { canvas, canvasElement, step } = await renderExample(<HeroCinematic />)

  await step("picking a finish swaps the caption and photo", async () => {
    const finish = canvas.getByRole(SINGLE.group, { name: "Finish" })
    const silver = within(finish).getByRole(SINGLE.role, { name: "Silver" })
    await userEvent.click(silver)
    await expect(silver).toHaveAttribute(SINGLE.pressed, "true")
    await expect(
      within(finish).getByRole(SINGLE.role, { name: "Cosmic Orange" })
    ).toHaveAttribute(SINGLE.pressed, "false")
    await waitFor(() =>
      expect(
        canvasElement.querySelector("p[aria-live=polite]")
      ).toHaveTextContent("Silver")
    )
    await expect(
      canvas.getByRole("img", {
        name: "A silver phone on a light grey background",
      })
    ).toBeInTheDocument()
  })
})
test("Tiles", async () => {
  const { canvas, step } = await renderExample(<HeroTiles />)

  await step("shows both tiles with their actions", async () => {
    for (const name of ["Book Air", "suissWatch"]) {
      const tile = canvas.getByRole("heading", { name }).closest("article")
      if (!(tile instanceof HTMLElement)) throw new Error(`Missing ${name}`)
      await expect(
        within(tile).getByRole("button", { name: "Learn more" })
      ).toBeEnabled()
      await expect(
        within(tile).getByRole("button", { name: "Buy" })
      ).toBeEnabled()
    }
  })
})
