import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { BentoCloserLook } from "@/components/blocks/bento-closer-look"
import { BentoFeatures } from "@/components/blocks/bento-features"
import { BentoStats } from "@/components/blocks/bento-stats"
import { renderExample } from "@/tests/render-example"

test("Features", async () => {
  const { canvas, step } = await renderExample(<BentoFeatures />)

  await step("shows the feature tiles under the heading", async () => {
    await expect(
      canvas.getByRole("heading", { name: "Why Phone Pro?" })
    ).toBeVisible()
    await expect(canvas.getByText("S19 Pro")).toBeVisible()
    await expect(canvas.getByText("33 hrs")).toBeVisible()
    await expect(
      canvas.getByRole("img", { name: "A close-up of a camera lens" })
    ).toBeVisible()
  })
})
test("Stats", async () => {
  const { canvas, step } = await renderExample(<BentoStats />)

  await step("fills the charge meter to half", async () => {
    await expect(
      canvas.getByRole("heading", { name: "50% in 20 minutes." })
    ).toBeVisible()
    const charge = canvas.getByRole("progressbar", {
      name: "Charge after 20 minutes",
    })
    await waitFor(() => expect(charge).toHaveAttribute("aria-valuenow", "50"))
  })
})
test("Closer Look", async () => {
  const { canvas, step } = await renderExample(<BentoCloserLook />)

  await step("picking a feature opens it with its photo", async () => {
    const trigger = canvas.getByRole("button", { name: "Aluminum body" })
    await userEvent.click(trigger)
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true")
    )
    await expect(
      canvas.getByRole("button", { name: "Camera Control" })
    ).toHaveAttribute("aria-expanded", "false")
    await expect(
      await canvas.findByText("A unibody design", { exact: false })
    ).toBeVisible()
  })
})
