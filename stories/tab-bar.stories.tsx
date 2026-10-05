import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

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

const items = ["Home", "Nominees", "Directory", "Collections"]

const sections = [
  { title: "Awards", links: ["Winners", "Site of the Day", "Nominees"] },
  { title: "Inspiration", links: ["Collections", "Elements", "Resources"] },
  { title: "Directory", links: ["Professionals", "Agencies", "Freelancers"] },
  { title: "Market", links: ["Jobs", "New Events", "Products"] },
]

function TabBarExample({
  defaultOpen,
  withMore = true,
}: {
  defaultOpen?: boolean
  withMore?: boolean
}) {
  const [value, setValue] = React.useState("Home")

  return (
    <div className="h-full min-h-svh bg-surface-secondary">
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
        {withMore && (
          <>
            <TabBarContent>
              {sections.map((section) => (
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
          </>
        )}
      </TabBar>
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
}

export const Open: Story = {
  render: () => <TabBarExample defaultOpen />,
}

export const WithoutMore: Story = {
  render: () => <TabBarExample withMore={false} />,
}

export const Links: Story = {
  render: () => (
    <div className="h-full min-h-svh bg-surface-secondary">
      <TabBar aria-label="Main">
        <TabBarList>
          {items.map((item, index) => (
            <TabBarItem
              key={item}
              isActive={index === 0}
              render={<a href={`#${item.toLowerCase()}`} />}
            >
              {item}
            </TabBarItem>
          ))}
        </TabBarList>
      </TabBar>
    </div>
  ),
}

export const DisabledItem: Story = {
  render: () => (
    <div className="h-full min-h-svh bg-surface-secondary">
      <TabBar aria-label="Main">
        <TabBarList>
          <TabBarItem isActive>Home</TabBarItem>
          <TabBarItem>Nominees</TabBarItem>
          <TabBarItem disabled>Directory</TabBarItem>
        </TabBarList>
      </TabBar>
    </div>
  ),
}
