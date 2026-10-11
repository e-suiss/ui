// @ts-nocheck
import {
  BookOpenIcon,
  ChartLineIcon,
  CodeIcon,
  LifebuoyIcon,
  LightningIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import { Navbar, type NavbarItem } from "@/components/patterns/navbar"
import { Button } from "@/components/ui/button"

const items: NavbarItem[] = [
  {
    label: "Products",
    items: [
      {
        label: "Analytics",
        href: "#analytics",
        description: "Track traffic and conversions in real time.",
        icon: <ChartLineIcon className="mt-0.5" />,
      },
      {
        label: "Automations",
        href: "#automations",
        description: "Run workflows when events happen.",
        icon: <LightningIcon className="mt-0.5" />,
      },
      {
        label: "Security",
        href: "#security",
        description: "Single sign-on, audit logs, and roles.",
        icon: <ShieldCheckIcon className="mt-0.5" />,
      },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Documentation", href: "#docs", icon: <BookOpenIcon /> },
      { label: "API reference", href: "#api", icon: <CodeIcon /> },
      { label: "Help center", href: "#help", icon: <LifebuoyIcon /> },
    ],
  },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
]

const analyticsLink = /Analytics/

const brand = <span className="text-base font-semibold">Acme</span>

const meta = {
  title: "Patterns/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
  args: { items, brand },
  decorators: [
    (Story) => (
      <div className="min-h-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Navbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
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
      await expect(
        canvas.getByRole("link", { name: "Pricing" })
      ).toHaveAttribute("href", "#pricing")
    })
  },
}

export const WithActions: Story = {
  args: {
    actions: (
      <Button size="sm" variant="secondary">
        Sign in
      </Button>
    ),
  },
  play: async ({ canvas, step }) => {
    await step("shows the actions next to the menu", async () => {
      await expect(
        canvas.getByRole("button", { name: "Sign in" })
      ).toBeVisible()
      await expect(
        canvas.getByRole("button", { name: "Products" })
      ).toBeVisible()
    })
  },
}

export const LinksOnly: Story = {
  args: {
    items: [
      { label: "Overview", href: "#overview", active: true },
      { label: "Customers", href: "#customers" },
      { label: "Changelog", href: "#changelog" },
      { label: "Blog", href: "#blog" },
    ],
  },
  play: async ({ canvas, step }) => {
    await step("renders links only and marks the active one", async () => {
      await expect(canvas.queryByRole("button")).toBeNull()
      await expect(
        canvas.getByRole("link", { name: "Overview" })
      ).toHaveAttribute("aria-current", "page")
      await expect(
        canvas.getByRole("link", { name: "Customers" })
      ).not.toHaveAttribute("aria-current")
    })
  },
}

export const Crowded: Story = {
  args: {
    items: [
      "Store",
      "Laptop",
      "Tablet",
      "Phone",
      "Watch",
      "Headphones",
      "Speakers",
      "Accessories",
      "Support",
    ].map((label) => ({ label, href: `#${label.toLowerCase()}` })),
    actions: (
      <Button size="sm" variant="secondary">
        Sign in
      </Button>
    ),
  },
  render: (args) => (
    <div data-testid="frame" className="w-160 max-w-full">
      <Navbar {...args} />
    </div>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    const frame = canvas.getByTestId("frame")
    const navbar = canvasElement.querySelector("[data-slot=navbar]")

    await step(
      "moves the items into the menu when they do not fit",
      async () => {
        await waitFor(() => expect(navbar).toHaveAttribute("data-compact"))
        await expect(canvas.getByRole("button", { name: "Menu" })).toBeVisible()
        await expect(canvas.queryByRole("link", { name: "Store" })).toBeNull()
      }
    )

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
  },
}

export const WithCloseLabel: Story = {
  args: { closeLabel: "Done" },
}

export const MegaPanel: Story = {
  args: {
    layout: "panel",
    items: [
      {
        label: "Products",
        columns: [
          {
            label: "Explore",
            featured: true,
            links: [
              { label: "Analytics", href: "#analytics" },
              { label: "Automations", href: "#automations" },
              { label: "Security", href: "#security" },
            ],
          },
          {
            label: "Get started",
            links: [
              { label: "Pricing", href: "#pricing" },
              { label: "Customers", href: "#customers" },
            ],
          },
          {
            label: "Learn",
            links: [
              { label: "Documentation", href: "#docs" },
              { label: "Help center", href: "#help" },
            ],
          },
        ],
      },
      { label: "Pricing", href: "#pricing" },
      { label: "Blog", href: "#blog" },
    ],
  },
  play: async ({ canvas, step }) => {
    const products = canvas.getByRole("button", { name: "Products" })

    await step("opens the full-width panel with its columns", async () => {
      await userEvent.click(products)
      await expect(
        await screen.findByRole("link", { name: "Analytics" })
      ).toHaveAttribute("href", "#analytics")
      await waitFor(() =>
        expect(
          screen.getByRole("link", { name: "Documentation" })
        ).toBeVisible()
      )
    })

    await step("closes the panel with Escape", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() =>
        expect(screen.queryByRole("link", { name: "Analytics" })).toBeNull()
      )
    })
  },
}
