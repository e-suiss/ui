import {
  BookOpenIcon,
  ChartLineIcon,
  CodeIcon,
  LifebuoyIcon,
  LightningIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

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

export const Default: Story = {}

export const WithActions: Story = {
  args: {
    actions: (
      <Button size="sm" variant="secondary">
        Sign in
      </Button>
    ),
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
}
