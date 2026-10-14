// @ts-nocheck
import { BellIcon, GearIcon, UserIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { cn } from "cn"
import { expect, userEvent, waitFor } from "storybook/test"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = [
  {
    value: "account",
    label: "Account",
    icon: UserIcon,
    content: "Update your name, email address, and profile photo.",
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: BellIcon,
    content: "Choose which updates you receive by email and push.",
  },
  {
    value: "settings",
    label: "Settings",
    icon: GearIcon,
    content: "Manage language, time zone, and privacy preferences.",
  },
] as const

type TabsStoryArgs = React.ComponentProps<typeof Tabs> & {
  variant?: "default" | "line"
}

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    defaultValue: "account",
    orientation: "horizontal",
    variant: "default",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "line"],
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  decorators: [
    (Story, { parameters }) => (
      <div className={cn("w-full", !parameters.wide && "max-w-96")}>
        <Story />
      </div>
    ),
  ],
  render: ({ variant, ...args }) => (
    <Tabs {...args}>
      <TabsList variant={variant}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="text-label-secondary"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  ),
} satisfies Meta<TabsStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const account = canvas.getByRole("tab", { name: "Account" })
    const notifications = canvas.getByRole("tab", { name: "Notifications" })

    await step("selects the default tab and its panel", async () => {
      await expect(canvas.getByRole("tablist")).toBeVisible()
      await expect(account).toHaveAttribute("aria-selected", "true")
      await expect(canvas.getByRole("tabpanel")).toHaveTextContent(
        tabs[0].content
      )
    })

    await step("switches panels on click", async () => {
      await userEvent.click(notifications)
      await expect(notifications).toHaveAttribute("aria-selected", "true")
      await expect(account).toHaveAttribute("aria-selected", "false")
      await waitFor(() =>
        expect(canvas.getByRole("tabpanel")).toHaveTextContent(tabs[1].content)
      )
    })

    await step(
      "moves focus with arrow keys and selects with Enter",
      async () => {
        await userEvent.keyboard("{ArrowRight}")
        const settings = canvas.getByRole("tab", { name: "Settings" })
        await expect(settings).toHaveFocus()
        await userEvent.keyboard("{Enter}")
        await expect(settings).toHaveAttribute("aria-selected", "true")
        await userEvent.keyboard("{ArrowRight}")
        await expect(account).toHaveFocus()
      }
    )
  },
}

export const Line: Story = {
  args: { variant: "line" },
  play: async ({ canvas, step }) => {
    await step("switches tabs on click", async () => {
      const settings = canvas.getByRole("tab", { name: "Settings" })
      await userEvent.click(settings)
      await expect(settings).toHaveAttribute("aria-selected", "true")
    })
  },
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  play: async ({ canvas, step }) => {
    await step("moves between tabs with up and down keys", async () => {
      await expect(canvas.getByRole("tablist")).toHaveAttribute(
        "aria-orientation",
        "vertical"
      )
      await userEvent.click(canvas.getByRole("tab", { name: "Account" }))
      await userEvent.keyboard("{ArrowDown}")
      const notifications = canvas.getByRole("tab", { name: "Notifications" })
      await expect(notifications).toHaveFocus()
      await userEvent.keyboard(" ")
      await expect(notifications).toHaveAttribute("aria-selected", "true")
    })
  },
}

export const WithIcons: Story = {
  render: ({ variant, ...args }) => (
    <Tabs {...args}>
      <TabsList variant={variant}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            <tab.icon data-icon="inline-start" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="text-label-secondary"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  ),
  play: async ({ canvas, step }) => {
    const account = canvas.getByRole("tab", { name: "Account" })
    const notifications = canvas.getByRole("tab", { name: "Notifications" })
    const settingsTab = canvas.getByRole("tab", { name: "Settings" })

    await step("names each tab by its text beside the icon", async () => {
      await expect(account).toHaveAttribute("aria-selected", "true")
      await expect(account.querySelector("svg")).toBeInTheDocument()
    })

    await step("switches panels on click", async () => {
      await userEvent.click(settingsTab)
      await expect(settingsTab).toHaveAttribute("aria-selected", "true")
      await waitFor(() =>
        expect(canvas.getByRole("tabpanel")).toHaveTextContent(tabs[2].content)
      )
    })

    await step("selects with the arrow keys", async () => {
      await userEvent.keyboard("{ArrowLeft}")
      await expect(notifications).toHaveFocus()
      await userEvent.keyboard("{Enter}")
      await expect(notifications).toHaveAttribute("aria-selected", "true")
      await waitFor(() =>
        expect(canvas.getByRole("tabpanel")).toHaveTextContent(tabs[1].content)
      )
    })
  },
}

export const DisabledTab: Story = {
  render: ({ variant, ...args }) => (
    <Tabs {...args}>
      <TabsList variant={variant}>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="text-label-secondary">
        {tabs[0].content}
      </TabsContent>
      <TabsContent value="notifications" className="text-label-secondary">
        {tabs[1].content}
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas, step }) => {
    const billing = canvas.getByRole("tab", { name: "Billing" })

    await step("cannot select the disabled tab from the keyboard", async () => {
      await expect(billing).toHaveAttribute("aria-disabled", "true")
      await userEvent.click(canvas.getByRole("tab", { name: "Notifications" }))
      await userEvent.keyboard("{ArrowRight}{Enter}")
      await expect(billing).toHaveAttribute("aria-selected", "false")
      await expect(
        canvas.getByRole("tab", { name: "Notifications" })
      ).toHaveAttribute("aria-selected", "true")
    })

    await step("ignores clicks on the disabled tab", async () => {
      await userEvent.click(billing, { pointerEventsCheck: 0 })
      await expect(billing).toHaveAttribute("aria-selected", "false")
    })
  },
}

const settings = [
  { value: "general", label: "General" },
  { value: "account", label: "Account" },
  { value: "notifications", label: "Notifications" },
  { value: "privacy", label: "Privacy" },
  { value: "appearance", label: "Appearance" },
  { value: "language", label: "Language" },
  { value: "billing", label: "Billing" },
]

export const ManyTabs: Story = {
  parameters: { layout: "padded", wide: true },
  render: ({ variant, ...args }) => (
    <Tabs {...args} defaultValue="general" className="w-full max-w-3xl">
      <TabsList variant={variant}>
        {settings.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {settings.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <p className="text-label-secondary">{tab.label} settings</p>
        </TabsContent>
      ))}
    </Tabs>
  ),
  play: async ({ canvas, step }) => {
    await step("jumps to the first and last tabs", async () => {
      await userEvent.click(canvas.getByRole("tab", { name: "General" }))
      await userEvent.keyboard("{End}")
      const billing = canvas.getByRole("tab", { name: "Billing" })
      await expect(billing).toHaveFocus()
      await userEvent.keyboard("{Enter}")
      await expect(billing).toHaveAttribute("aria-selected", "true")
      await waitFor(() =>
        expect(canvas.getByRole("tabpanel")).toHaveTextContent(
          "Billing settings"
        )
      )
      await userEvent.keyboard("{Home}")
      await expect(canvas.getByRole("tab", { name: "General" })).toHaveFocus()
    })
  },
}

export const ManyTabsLine: Story = {
  args: { variant: "line" },
  parameters: { layout: "padded", wide: true },
  render: ManyTabs.render,
  play: async ({ canvas, step }) => {
    const privacy = canvas.getByRole("tab", { name: "Privacy" })
    const appearance = canvas.getByRole("tab", { name: "Appearance" })

    await step("switches panels on click", async () => {
      await expect(
        canvas.getByRole("tab", { name: "General" })
      ).toHaveAttribute("aria-selected", "true")
      await userEvent.click(privacy)
      await expect(privacy).toHaveAttribute("aria-selected", "true")
      await waitFor(() =>
        expect(canvas.getByRole("tabpanel")).toHaveTextContent(
          "Privacy settings"
        )
      )
    })

    await step("selects with the arrow keys", async () => {
      await userEvent.keyboard("{ArrowRight}")
      await expect(appearance).toHaveFocus()
      await userEvent.keyboard("{Enter}")
      await expect(appearance).toHaveAttribute("aria-selected", "true")
      await expect(privacy).toHaveAttribute("aria-selected", "false")
      await waitFor(() =>
        expect(canvas.getByRole("tabpanel")).toHaveTextContent(
          "Appearance settings"
        )
      )
    })
  },
}
