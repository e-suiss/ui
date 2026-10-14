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
import * as React from "react"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const ANALYTICS = /^Analytics/

const products = [
  {
    title: "Analytics",
    description: "Track traffic and conversions in real time.",
    icon: ChartLineIcon,
  },
  {
    title: "Automations",
    description: "Run workflows when events happen.",
    icon: LightningIcon,
  },
  {
    title: "Security",
    description: "Single sign-on, audit logs, and roles.",
    icon: ShieldCheckIcon,
  },
]

const resources = [
  { title: "Documentation", icon: BookOpenIcon },
  { title: "API reference", icon: CodeIcon },
  { title: "Help center", icon: LifebuoyIcon },
]

const meta = {
  title: "Components/Navigation Menu",
  component: NavigationMenu,
  args: {
    align: "start",
  },
  argTypes: {
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
  },
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-96 items-start justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavigationMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-96 gap-1">
              {products.map((product) => (
                <li key={product.title}>
                  <NavigationMenuLink href="#" className="items-start gap-3">
                    <product.icon className="mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{product.title}</span>
                      <span className="text-label-secondary">
                        {product.description}
                      </span>
                    </div>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="resources">
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-56 gap-1">
              {resources.map((resource) => (
                <li key={resource.title}>
                  <NavigationMenuLink href="#">
                    <resource.icon />
                    {resource.title}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvas, step }) => {
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
  },
}

export const OpenByDefault: Story = {
  args: { defaultValue: "products" },
  render: Default.render,
  play: async ({ canvas, step }) => {
    await step("opens the products panel on mount", async () => {
      await expect(
        await screen.findByRole("link", { name: ANALYTICS })
      ).toBeInTheDocument()
      await expect(
        canvas.getByRole("button", { name: "Products" })
      ).toHaveAttribute("aria-expanded", "true")
    })
  },
}

export const LinksOnly: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        {["Overview", "Customers", "Changelog", "Blog"].map((label, index) => (
          <NavigationMenuItem key={label}>
            <NavigationMenuLink
              href="#"
              active={index === 0}
              className={navigationMenuTriggerStyle()}
            >
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvas, step }) => {
    await step("marks the active link as the current page", async () => {
      await expect(
        canvas.getByRole("link", { name: "Overview" })
      ).toHaveAttribute("aria-current", "page")
      await expect(
        canvas.getByRole("link", { name: "Blog" })
      ).not.toHaveAttribute("aria-current")
    })
  },
}

const panelMenus = [
  {
    value: "pos",
    label: "POS",
    explore: ["Terminals", "Handhelds", "Compare models"],
    shop: ["Shop POS", "Accessories", "Financing", "Trade in"],
    more: ["POS support", "Setup guide", "Integrations"],
  },
  {
    value: "kitchen",
    label: "Kitchen",
    explore: ["Displays", "Printers"],
    shop: ["Shop Kitchen", "Mounts", "Cables"],
    more: ["Kitchen support", "Station layouts"],
  },
  {
    value: "reservations",
    label: "Reservations",
    explore: ["Floor plans", "Waitlist", "Guest profiles", "Online booking"],
    shop: ["Plans", "Add-ons"],
    more: ["Reservations support", "Booking widget", "Calendar sync"],
  },
  {
    value: "analytics",
    label: "Analytics",
    explore: ["Reports", "Forecasts"],
    shop: ["Plans", "Data exports"],
    more: ["Analytics support"],
  },
]

function PanelColumn({
  label,
  links,
  size,
}: {
  label: string
  links: string[]
  size?: "default" | "lg"
}) {
  return (
    <div className="flex flex-col">
      <NavigationMenuLabel>{label}</NavigationMenuLabel>
      <ul className="flex flex-col gap-1.5">
        {links.map((link) => (
          <li key={link}>
            <NavigationMenuLink href="#" size={size}>
              {link}
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PanelExample() {
  const ref = React.useRef<HTMLDivElement>(null)

  return (
    <div className="w-full">
      <div
        ref={ref}
        className="sticky top-0 z-50 flex w-full justify-center bg-surface/80 backdrop-blur-xl transition-colors duration-300 has-data-popup-open:bg-surface dark:bg-surface-secondary/80 dark:has-data-popup-open:bg-surface-secondary"
      >
        <NavigationMenu layout="panel" anchor={ref}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                className={navigationMenuTriggerStyle()}
              >
                Store
              </NavigationMenuLink>
            </NavigationMenuItem>
            {panelMenus.map((menu) => (
              <NavigationMenuItem key={menu.value} value={menu.value}>
                <NavigationMenuTrigger>{menu.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="mx-auto flex max-w-245 gap-16 px-6 pt-10 pb-16">
                    <PanelColumn
                      label={`Explore ${menu.label}`}
                      links={menu.explore}
                      size="lg"
                    />
                    <PanelColumn
                      label={`Shop ${menu.label}`}
                      links={menu.shop}
                    />
                    <PanelColumn
                      label={`More from ${menu.label}`}
                      links={menu.more}
                    />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                className={navigationMenuTriggerStyle()}
              >
                Support
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="mx-auto flex max-w-245 flex-col items-center gap-3 px-6 py-24 text-center">
        <h2 className="text-5xl font-semibold">Hestia POS</h2>
        <p className="text-xl text-label-secondary">
          Orders, kitchen and tables in one place.
        </p>
        <div className="mt-8 grid w-full grid-cols-3 gap-4">
          {["bg-blue", "bg-orange", "bg-green"].map((tint) => (
            <div key={tint} className={`aspect-4/3 rounded-3xl ${tint}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const Panel: Story = {
  parameters: { layout: "fullscreen" },
  render: () => <PanelExample />,
  play: async ({ canvas, step }) => {
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
  },
}
