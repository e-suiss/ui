import { BellIcon, GearIcon, UserIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { cn } from "cn"

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
]

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

export const Default: Story = {}

export const Line: Story = {
  args: { variant: "line" },
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
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
}

export const ManyTabsLine: Story = {
  ...ManyTabs,
  args: { variant: "line" },
}
