// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"

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

type Page = { label: string; parent?: string; children: string[] }

const pages: Record<string, Page> = {
  support: { label: "Support", children: ["account", "billing"] },
  account: {
    label: "Account",
    parent: "support",
    children: ["security", "profile"],
  },
  billing: { label: "Billing", parent: "support", children: [] },
  security: {
    label: "Security",
    parent: "account",
    children: ["two-factor", "passwords"],
  },
  profile: { label: "Profile", parent: "account", children: [] },
  "two-factor": {
    label: "Turn on two-factor authentication",
    parent: "security",
    children: [],
  },
  passwords: {
    label: "Change your password",
    parent: "security",
    children: [],
  },
}

function pageOf(id: string) {
  const page = pages[id]
  if (!page) throw new Error(`Unknown page ${id}`)
  return page
}

function trailTo(id: string): TrailItem[] {
  const items: TrailItem[] = []
  for (let key: string | undefined = id; key; key = pageOf(key).parent) {
    items.unshift({ label: pageOf(key).label, href: `#${key}` })
  }
  return items.map((item, index) =>
    index === items.length - 1 ? { label: item.label } : item
  )
}

function TrailExample(args: Partial<React.ComponentProps<typeof Trail>>) {
  const [page, setPage] = React.useState("two-factor")
  const current = pageOf(page)

  const navigation = {
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
      const id = event.currentTarget.getAttribute("href")?.slice(1)
      if (!(id && pages[id])) return
      event.preventDefault()
      setPage(id)
    },
  }

  return (
    <div className="flex flex-col gap-6">
      <Trail {...args} items={trailTo(page)} render={<a {...navigation} />} />
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          {current.label}
        </h2>
        {current.children.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {current.children.map((child) => (
              <li key={child}>
                <a
                  href={`#${child}`}
                  {...navigation}
                  className="text-link outline-none hover:underline focus-visible:focus-ring"
                >
                  {pageOf(child).label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-label-secondary">
            Pick an earlier page in the trail to go back up.
          </p>
        )}
      </section>
    </div>
  )
}

const meta = {
  title: "Patterns/Trail",
  component: Trail,
  parameters: { layout: "padded" },
  args: { items: article },
} satisfies Meta<typeof Trail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <TrailExample {...args} />,
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

    await step("goes up to an earlier page from the trail", async () => {
      await userEvent.click(within(nav).getByRole("link", { name: "Account" }))
      await waitFor(() =>
        expect(within(nav).getByText("Account")).toHaveAttribute(
          "aria-current",
          "page"
        )
      )
      await expect(
        canvas.getByRole("heading", { name: "Account" })
      ).toBeVisible()
      await expect(within(nav).queryByText("Security")).toBeNull()
    })

    await step("goes down to a child page from the content", async () => {
      await userEvent.click(canvas.getByRole("link", { name: "Profile" }))
      await waitFor(() =>
        expect(within(nav).getByText("Profile")).toHaveAttribute(
          "aria-current",
          "page"
        )
      )
      await expect(
        within(nav).getByRole("link", { name: "Account" })
      ).toHaveAttribute("href", "#account")
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
