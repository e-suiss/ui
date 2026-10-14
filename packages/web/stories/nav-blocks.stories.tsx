import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { NavCategories } from "@/components/blocks/nav-categories"
import { NavGlobal } from "@/components/blocks/nav-global"
import { NavLocal } from "@/components/blocks/nav-local"

const meta = {
  title: "Blocks/Navigation",
  component: NavGlobal,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof NavGlobal>

export default meta

type Story = StoryObj<typeof meta>

export const Global: Story = {
  play: async ({ canvas, step }) => {
    const phone = canvas.getByRole("button", { name: "Phone" })

    await step("opening a menu shows its panel of links", async () => {
      await userEvent.click(phone)
      await expect(
        await screen.findByRole("link", { name: "Phone Pro" })
      ).toHaveAttribute("href", "#phone-pro")
      await expect(phone).toHaveAttribute("aria-expanded", "true")
    })

    await step("Escape closes the panel", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() =>
        expect(screen.queryByRole("link", { name: "Phone Pro" })).toBeNull()
      )
      await expect(phone).toHaveAttribute("aria-expanded", "false")
    })
  },
}

export const Local: Story = {
  render: () => <NavLocal />,
  play: async ({ canvas, step }) => {
    await step("marks the current section and offers Buy", async () => {
      await expect(
        canvas.getByRole("link", { name: "Overview" })
      ).toHaveAttribute("aria-current", "page")
      await expect(
        canvas.getByRole("link", { name: "Tech Specs" })
      ).toHaveAttribute("href", "#specs")
      await expect(canvas.getByRole("button", { name: "Buy" })).toBeVisible()
    })
  },
}

export const Categories: Story = {
  render: () => <NavCategories />,
  play: async ({ canvas, step }) => {
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
  },
}
