import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { NavCategories } from "@/components/blocks/nav-categories"
import { NavGlobal } from "@/components/blocks/nav-global"
import { NavLocal } from "@/components/blocks/nav-local"
import { renderExample } from "@/tests/render-example"
import { transitionsDone } from "@/tests/settle"

test("Global", async () => {
  const { canvas, step } = await renderExample(<NavGlobal />)

  const phone = canvas.getByRole("button", { name: "Phone" })

  await step("opening a menu shows its panel of links", async () => {
    await userEvent.click(phone)
    await expect(
      await screen.findByRole("link", { name: "Phone Pro" })
    ).toHaveAttribute("href", "#phone-pro")
    await expect(phone).toHaveAttribute("aria-expanded", "true")
    await transitionsDone()
  })

  await step("Escape closes the panel", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "Phone Pro" })).toBeNull()
    )
    await expect(phone).toHaveAttribute("aria-expanded", "false")
  })
})
test("Local", async () => {
  const { canvas, step } = await renderExample(<NavLocal />)

  await step("marks the current section and offers Buy", async () => {
    await expect(
      canvas.getByRole("link", { name: "Overview" })
    ).toHaveAttribute("aria-current", "page")
    await expect(
      canvas.getByRole("link", { name: "Tech Specs" })
    ).toHaveAttribute("href", "#specs")
    await expect(canvas.getByRole("button", { name: "Buy" })).toBeVisible()
  })
})
test("Categories", async () => {
  const { canvas, step } = await renderExample(<NavCategories />)

  const categories = canvas.getByRole("region", { name: "Categories" })

  await step("picking a category updates the latest line", async () => {
    const watch = within(categories).getByRole("button", { name: "Watch" })
    await userEvent.click(watch)
    await expect(watch).toHaveAttribute("aria-pressed", "true")
    await expect(
      within(categories).getByRole("button", { name: "Phone" })
    ).toHaveAttribute("aria-pressed", "false")
    await expect(
      await canvas.findByText("Take a look at what's new in Watch.", {
        exact: false,
      })
    ).toBeVisible()
  })
})
