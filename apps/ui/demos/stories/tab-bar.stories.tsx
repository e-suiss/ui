// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  TabBar,
  TabBarContent,
  TabBarItem,
  TabBarLink,
  TabBarList,
  TabBarSection,
  TabBarSectionTitle,
  TabBarTrigger,
} from "@/components/ui/tab-bar"

const defaultItems = ["Home", "Nominees", "Directory", "Collections"]

const manyItems = [...defaultItems, "Market", "Academy", "Conferences"]

const sections = [
  { title: "Awards", links: ["Winners", "Site of the Day", "Nominees"] },
  { title: "Inspiration", links: ["Collections", "Elements", "Resources"] },
  { title: "Directory", links: ["Professionals", "Agencies", "Freelancers"] },
  { title: "Market", links: ["Jobs", "New Events", "Products"] },
]

function TabBarExample({
  defaultOpen,
  items = defaultItems,
  withSections = true,
}: {
  defaultOpen?: boolean
  items?: string[]
  withSections?: boolean
}) {
  const [value, setValue] = React.useState("Home")

  return (
    <div className="h-full min-h-svh bg-surface">
      <Backdrop />
      <TabBar aria-label="Main" defaultOpen={defaultOpen}>
        <TabBarList>
          {items.map((item) => (
            <TabBarItem
              key={item}
              isActive={value === item}
              onClick={() => setValue(item)}
            >
              {item}
            </TabBarItem>
          ))}
        </TabBarList>
        <TabBarContent>
          {withSections &&
            sections.map((section) => (
              <TabBarSection key={section.title}>
                <TabBarSectionTitle>{section.title}</TabBarSectionTitle>
                {section.links.map((link) => (
                  <TabBarLink
                    key={link}
                    href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
                    isActive={value === link}
                    onClick={() => setValue(link)}
                  >
                    {link}
                  </TabBarLink>
                ))}
              </TabBarSection>
            ))}
        </TabBarContent>
        <TabBarTrigger>More</TabBarTrigger>
      </TabBar>
    </div>
  )
}

function Backdrop() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
      {Array.from({ length: 16 }, (_, index) => `Card ${index + 1}`).map(
        (card) => (
          <div
            key={card}
            className="flex aspect-[4/3] items-end rounded-2xl bg-accent/15 p-4 text-sm font-semibold text-link odd:bg-surface-tertiary odd:text-label"
          >
            {card}
          </div>
        )
      )}
    </div>
  )
}

const meta = {
  title: "Components/Tab Bar",
  component: TabBar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, { viewMode }) => (
      <div
        className={
          viewMode === "docs"
            ? "h-[32rem] transform-gpu overflow-hidden"
            : "min-h-svh"
        }
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TabBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <TabBarExample />,
  play: async ({ canvas, step }) => {
    const nav = canvas.getByRole("navigation", { name: "Main" })
    const more = within(nav).getByRole("button", { name: "More" })

    await step("marks the tapped item as active", async () => {
      const nominees = within(nav).getByRole("button", { name: "Nominees" })
      await userEvent.click(nominees)
      await expect(nominees).toHaveAttribute("aria-current", "page")
      await expect(
        within(nav).getByRole("button", { name: "Home" })
      ).not.toHaveAttribute("aria-current")
    })

    await step("opens the sections from More", async () => {
      await userEvent.click(more)
      await expect(more).toHaveAttribute("aria-expanded", "true")
      await expect(
        await within(nav).findByRole("link", { name: "Site of the Day" })
      ).toBeInTheDocument()
    })

    await step("closes with Escape and returns focus", async () => {
      await userEvent.keyboard("{Escape}")
      await expect(more).toHaveAttribute("aria-expanded", "false")
      await expect(more).toHaveFocus()
      await waitFor(() =>
        expect(
          within(nav).queryByRole("link", { name: "Site of the Day" })
        ).toBeNull()
      )
    })
  },
}

export const Open: Story = {
  render: () => <TabBarExample defaultOpen />,
  play: async ({ canvas, step }) => {
    await step("opens on mount and closes on an outside click", async () => {
      const more = canvas.getByRole("button", { name: "More" })
      await expect(more).toHaveAttribute("aria-expanded", "true")
      await expect(
        canvas.getByRole("link", { name: "Professionals" })
      ).toBeInTheDocument()
      await userEvent.click(canvas.getByText("Card 1"))
      await expect(more).toHaveAttribute("aria-expanded", "false")
    })
  },
}

export const FitsWithoutMore: Story = {
  render: () => (
    <TabBarExample items={defaultItems.slice(0, 3)} withSections={false} />
  ),
  play: async ({ canvas, step }) => {
    await step("hides More when every item fits", async () => {
      await expect(canvas.getAllByRole("button")).toHaveLength(3)
      await expect(canvas.queryByRole("button", { name: "More" })).toBeNull()
    })
  },
}

export const OverflowIntoMore: Story = {
  render: () => <TabBarExample items={manyItems} withSections={false} />,
  play: async ({ canvas, step }) => {
    await step("keeps every item reachable at desktop width", async () => {
      const nav = canvas.getByRole("navigation", { name: "Main" })
      for (const name of manyItems) {
        await expect(within(nav).getByRole("button", { name })).toBeVisible()
      }
    })
  },
}

export const Links: Story = {
  render: () => (
    <div className="h-full min-h-svh bg-surface">
      <Backdrop />
      <TabBar aria-label="Main">
        <TabBarList>
          {defaultItems.map((item, index) => (
            <TabBarItem
              key={item}
              isActive={index === 0}
              render={<a href={`#${item.toLowerCase()}`} />}
            >
              {item}
            </TabBarItem>
          ))}
        </TabBarList>
        <TabBarContent />
        <TabBarTrigger>More</TabBarTrigger>
      </TabBar>
    </div>
  ),
  play: async ({ canvas, step }) => {
    const nav = canvas.getByRole("navigation", { name: "Main" })

    await step("renders every item as a link to its route", async () => {
      await expect(within(nav).getAllByRole("link")).toHaveLength(
        defaultItems.length
      )
      for (const item of defaultItems) {
        await expect(
          within(nav).getByRole("link", { name: item })
        ).toHaveAttribute("href", `#${item.toLowerCase()}`)
      }
    })

    await step("marks only the active link as the current page", async () => {
      await expect(
        within(nav).getByRole("link", { name: "Home" })
      ).toHaveAttribute("aria-current", "page")
      for (const item of defaultItems.slice(1)) {
        await expect(
          within(nav).getByRole("link", { name: item })
        ).not.toHaveAttribute("aria-current")
      }
    })

    await step("reaches the links from the keyboard", async () => {
      await userEvent.tab()
      await expect(
        within(nav).getByRole("link", { name: "Home" })
      ).toHaveFocus()
      await userEvent.tab()
      await expect(
        within(nav).getByRole("link", { name: "Nominees" })
      ).toHaveFocus()
    })
  },
}

export const DisabledItem: Story = {
  render: () => (
    <div className="h-full min-h-svh bg-surface">
      <Backdrop />
      <TabBar aria-label="Main">
        <TabBarList>
          <TabBarItem isActive>Home</TabBarItem>
          <TabBarItem>Nominees</TabBarItem>
          <TabBarItem disabled>Directory</TabBarItem>
        </TabBarList>
        <TabBarContent />
        <TabBarTrigger>More</TabBarTrigger>
      </TabBar>
    </div>
  ),
  play: async ({ canvas, step }) => {
    await step("disables the item", async () => {
      await expect(
        canvas.getByRole("button", { name: "Directory" })
      ).toBeDisabled()
      await expect(
        canvas.getByRole("button", { name: "Home" })
      ).toHaveAttribute("aria-current", "page")
    })
  },
}
