import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import NavigationMenuDemo from "@/examples/navigation-menu-demo"
import NavigationMenuLinksOnly from "@/examples/navigation-menu-links-only"
import NavigationMenuOpenByDefault from "@/examples/navigation-menu-open-by-default"
import NavigationMenuPanel from "@/examples/navigation-menu-panel"
import { renderExample } from "@/tests/render-example"

const ANALYTICS = /^Analytics/

test("Default", async () => {
  const { canvas, step } = await renderExample(<NavigationMenuDemo />)

  const products = canvas.getByRole("button", { name: "Products" })
  const resources = canvas.getByRole("button", { name: "Resources" })

  await step("opens a panel from its trigger", async () => {
    await userEvent.click(products)
    await expect(
      await screen.findByRole("link", { name: ANALYTICS })
    ).toBeInTheDocument()
    await expect(products).toHaveAttribute("aria-expanded", "true")
  })

  await step("switches to another panel on hover", async () => {
    await userEvent.hover(resources)
    await expect(
      await screen.findByRole("link", { name: "API reference" })
    ).toBeInTheDocument()
    await expect(resources).toHaveAttribute("aria-expanded", "true")
    await expect(products).toHaveAttribute("aria-expanded", "false")
  })

  await step("closes with Escape", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "API reference" })).toBeNull()
    )
    await expect(resources).toHaveAttribute("aria-expanded", "false")
  })

  await step("opens from the keyboard and tabs into the panel", async () => {
    resources.focus()
    await userEvent.keyboard("{Enter}")
    await screen.findByRole("link", { name: "Documentation" })
    await userEvent.tab()
    await expect(
      screen.getByRole("link", { name: "Documentation" })
    ).toHaveFocus()
  })

  await step("returns focus to the trigger on Escape", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "Documentation" })).toBeNull()
    )
    await expect(resources).toHaveFocus()
  })
})
test("Open By Default", async () => {
  const { canvas, step } = await renderExample(<NavigationMenuOpenByDefault />)

  await step("opens the products panel on mount", async () => {
    await expect(
      await screen.findByRole("link", { name: ANALYTICS })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("button", { name: "Products" })
    ).toHaveAttribute("aria-expanded", "true")
  })
})
test("Links Only", async () => {
  const { canvas, step } = await renderExample(<NavigationMenuLinksOnly />)

  await step("marks the active link as the current page", async () => {
    await expect(
      canvas.getByRole("link", { name: "Overview" })
    ).toHaveAttribute("aria-current", "page")
    await expect(
      canvas.getByRole("link", { name: "Blog" })
    ).not.toHaveAttribute("aria-current")
  })
})
test("Panel", async () => {
  const { canvas, step } = await renderExample(<NavigationMenuPanel />)

  const pos = canvas.getByRole("button", { name: "POS" })

  await step("opens the full-width panel", async () => {
    await userEvent.click(pos)
    await expect(
      await screen.findByRole("link", { name: "Terminals" })
    ).toBeInTheDocument()
    await expect(screen.getByText("Explore POS")).toBeInTheDocument()
  })

  await step("swaps content when another menu is hovered", async () => {
    await userEvent.hover(canvas.getByRole("button", { name: "Kitchen" }))
    await expect(
      await screen.findByRole("link", { name: "Displays" })
    ).toBeInTheDocument()
    await expect(pos).toHaveAttribute("aria-expanded", "false")
  })

  await step("closes with Escape", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "Displays" })).toBeNull()
    )
  })
})
