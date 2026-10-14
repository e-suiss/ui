// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import {
  FullscreenMenu,
  FullscreenMenuContent,
  FullscreenMenuGroup,
  FullscreenMenuLabel,
  FullscreenMenuLink,
  FullscreenMenuTitle,
  FullscreenMenuTrigger,
} from "@/components/ui/fullscreen-menu"

const primary = ["Store", "Products", "Services", "Company", "Support"]

const sections = [
  { label: "Explore", links: ["Overview", "Compare", "Accessories"] },
  { label: "Shop", links: ["Shop online", "Find a store", "Order status"] },
]

function MenuExample({
  defaultOpen,
  closeLabel,
  withSections = true,
}: {
  defaultOpen?: boolean
  closeLabel?: string
  withSections?: boolean
}) {
  const [active, setActive] = React.useState("Store")

  return (
    <div className="flex h-14 items-center justify-between px-4">
      <span className="font-semibold">Acme</span>
      <FullscreenMenu defaultOpen={defaultOpen}>
        <FullscreenMenuTrigger aria-label="Menu" />
        <FullscreenMenuContent closeLabel={closeLabel}>
          <FullscreenMenuTitle>Menu</FullscreenMenuTitle>
          <FullscreenMenuGroup>
            {primary.map((link) => (
              <FullscreenMenuLink
                key={link}
                href={`#${link.toLowerCase()}`}
                isActive={active === link}
                onClick={() => setActive(link)}
              >
                {link}
              </FullscreenMenuLink>
            ))}
          </FullscreenMenuGroup>
          {withSections &&
            sections.map((section) => (
              <FullscreenMenuGroup key={section.label}>
                <FullscreenMenuLabel>{section.label}</FullscreenMenuLabel>
                {section.links.map((link) => (
                  <FullscreenMenuLink
                    key={link}
                    href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
                  >
                    {link}
                  </FullscreenMenuLink>
                ))}
              </FullscreenMenuGroup>
            ))}
        </FullscreenMenuContent>
      </FullscreenMenu>
    </div>
  )
}

const meta = {
  title: "Components/Fullscreen Menu",
  component: FullscreenMenu,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FullscreenMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <MenuExample />,
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Menu" })

    await step("opens a named full-screen dialog", async () => {
      await userEvent.click(trigger)
      const menu = await screen.findByRole("dialog", { name: "Menu" })
      await expect(
        within(menu).getByRole("link", { name: "Store" })
      ).toHaveAttribute("aria-current", "page")
      await expect(trigger).toHaveAttribute("aria-expanded", "true")
      await waitFor(() =>
        expect(menu).toContainElement(document.activeElement as HTMLElement)
      )
    })

    await step(
      "closes with Escape and returns focus to the trigger",
      async () => {
        await userEvent.keyboard("{Escape}")
        await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
        await expect(trigger).toHaveFocus()
      }
    )

    await step("closes from the close button", async () => {
      await userEvent.click(trigger)
      await userEvent.click(
        await screen.findByRole("button", { name: "Close" })
      )
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const Open: Story = {
  render: () => <MenuExample />,
  play: async ({ step }) => {
    await step("renders the primary links and sections", async () => {
      const menu = await screen.findByRole("dialog", { name: "Menu" })
      await expect(within(menu).getAllByRole("link")).toHaveLength(11)
      await expect(within(menu).getByText("Explore")).toBeVisible()
    })
  },
}

export const LinksOnly: Story = {
  render: () => <MenuExample withSections={false} />,
  play: async ({ canvas, step }) => {
    await step("lists only the primary links", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Menu" }))
      const menu = await screen.findByRole("dialog", { name: "Menu" })
      await expect(within(menu).getAllByRole("link")).toHaveLength(5)
    })
  },
}

export const WithCloseLabel: Story = {
  render: () => <MenuExample closeLabel="Done" />,
  play: async ({ canvas, step }) => {
    await step("closes from the text close button", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Menu" }))
      await userEvent.click(await screen.findByRole("button", { name: "Done" }))
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}
