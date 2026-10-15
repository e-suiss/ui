import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import NavbarCrowded from "@/examples/navbar-crowded"
import NavbarDemo from "@/examples/navbar-demo"
import NavbarLinksOnly from "@/examples/navbar-links-only"
import NavbarMegaPanel from "@/examples/navbar-mega-panel"
import NavbarWithActions from "@/examples/navbar-with-actions"
import { renderExample } from "@/tests/render-example"

const analyticsLink = /Analytics/

test("Default", async () => {
  const { canvas, step } = await renderExample(<NavbarDemo />)

  const products = canvas.getByRole("button", { name: "Products" })

  await step("opens a group and shows its links", async () => {
    await userEvent.click(products)
    await expect(
      await screen.findByRole("link", { name: analyticsLink })
    ).toHaveAttribute("href", "#analytics")
    await expect(products).toHaveAttribute("aria-expanded", "true")
  })

  await step("closes the group with Escape", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("link", { name: analyticsLink })).toBeNull()
    )
    await expect(products).toHaveAttribute("aria-expanded", "false")
  })

  await step("keeps plain items as direct links", async () => {
    await expect(canvas.getByRole("link", { name: "Pricing" })).toHaveAttribute(
      "href",
      "#pricing"
    )
  })
})
test("With Actions", async () => {
  const { canvas, step } = await renderExample(<NavbarWithActions />)

  await step("shows the actions next to the menu", async () => {
    await expect(canvas.getByRole("button", { name: "Sign in" })).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Products" })).toBeVisible()
  })
})
test("Links Only", async () => {
  const { canvas, step } = await renderExample(<NavbarLinksOnly />)

  await step("renders links only and marks the active one", async () => {
    await expect(canvas.queryByRole("button")).toBeNull()
    await expect(
      canvas.getByRole("link", { name: "Overview" })
    ).toHaveAttribute("aria-current", "page")
    await expect(
      canvas.getByRole("link", { name: "Customers" })
    ).not.toHaveAttribute("aria-current")
  })
})
test("Crowded", async () => {
  const { canvas, canvasElement, step } = await renderExample(<NavbarCrowded />)

  const frame = canvas.getByTestId("frame")
  const navbar = canvasElement.querySelector("[data-slot=navbar]")

  await step("moves the items into the menu when they do not fit", async () => {
    await waitFor(() => expect(navbar).toHaveAttribute("data-compact"))
    await expect(canvas.getByRole("button", { name: "Menu" })).toBeVisible()
    await expect(canvas.queryByRole("link", { name: "Store" })).toBeNull()
  })

  await step("shows the items again once there is room", async () => {
    frame.style.width = "90rem"
    await waitFor(() => expect(navbar).not.toHaveAttribute("data-compact"))
    await expect(canvas.getByRole("link", { name: "Store" })).toBeVisible()
    await expect(canvas.queryByRole("button", { name: "Menu" })).toBeNull()
  })

  await step("folds them away again when it narrows", async () => {
    frame.style.width = ""
    await waitFor(() => expect(navbar).toHaveAttribute("data-compact"))
  })
})
test("Mega Panel", async () => {
  const { canvas, step } = await renderExample(<NavbarMegaPanel />)

  const products = canvas.getByRole("button", { name: "Products" })

  await step("opens the full-width panel with its columns", async () => {
    await userEvent.click(products)
    await expect(
      await screen.findByRole("link", { name: "Analytics" })
    ).toHaveAttribute("href", "#analytics")
    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Documentation" })).toBeVisible()
    )
  })

  await step("closes the panel with Escape", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "Analytics" })).toBeNull()
    )
  })
})
