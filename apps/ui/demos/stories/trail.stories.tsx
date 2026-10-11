// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

import { Trail, type TrailItem } from "@/components/patterns/trail"

const article: TrailItem[] = [
  { label: "Support", href: "#support" },
  { label: "Account", href: "#account" },
  { label: "Security", href: "#security" },
  { label: "Turn on two-factor authentication" },
]

const deep: TrailItem[] = [
  { label: "Support", href: "#support" },
  { label: "Products", href: "#products" },
  { label: "Workspace", href: "#workspace" },
  { label: "Billing", href: "#billing" },
  { label: "Invoices", href: "#invoices" },
  { label: "Download an invoice as PDF" },
]

const meta = {
  title: "Patterns/Trail",
  component: Trail,
  parameters: { layout: "padded" },
  args: { items: article },
} satisfies Meta<typeof Trail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const nav = canvas.getByRole("navigation", { name: "breadcrumb" })

    await step("links every ancestor to its page", async () => {
      const links = within(nav).getAllByRole("link")
      await expect(
        links.map((link) => [link.textContent, link.getAttribute("href")])
      ).toEqual([
        ["Support", "#support"],
        ["Account", "#account"],
        ["Security", "#security"],
      ])
    })

    await step("marks the last item as the current page", async () => {
      await expect(
        within(nav).getByText("Turn on two-factor authentication")
      ).toHaveAttribute("aria-current", "page")
    })
  },
}

export const Collapsed: Story = {
  args: { items: deep, maxItems: 4 },
  play: async ({ canvas, step }) => {
    const nav = canvas.getByRole("navigation", { name: "breadcrumb" })

    await step("keeps the root and the nearest ancestors", async () => {
      const links = within(nav).getAllByRole("link")
      await expect(links.map((link) => link.textContent)).toEqual([
        "Support",
        "Billing",
        "Invoices",
      ])
      await expect(
        within(nav).getByText("Download an invoice as PDF")
      ).toHaveAttribute("aria-current", "page")
    })

    await step("folds the middle into a labelled ellipsis", async () => {
      await expect(within(nav).getByText("More")).toBeInTheDocument()
      await expect(within(nav).queryByText("Products")).toBeNull()
      await expect(within(nav).queryByText("Workspace")).toBeNull()
    })
  },
}

export const BackLabel: Story = {
  args: { backLabel: "Back" },
}

export const TwoLevels: Story = {
  args: { items: article.slice(2) },
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "breadcrumb" })
    await expect(
      within(nav).getByRole("link", { name: "Security" })
    ).toHaveAttribute("href", "#security")
    await expect(within(nav).getAllByRole("link")).toHaveLength(1)
    await expect(
      within(nav).getByText("Turn on two-factor authentication")
    ).toHaveAttribute("aria-current", "page")
  },
}
