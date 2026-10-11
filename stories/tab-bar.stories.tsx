import type { Meta, StoryObj } from "@storybook/react-native"
import {
  ChatCircleIcon,
  GearSixIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { TabBar, TabBarItem, TabBarList } from "@/components/ui/tab-bar"
import { Text } from "@/components/ui/text"

const items = [
  { value: "home", label: "Home", icon: HouseIcon },
  { value: "search", label: "Search", icon: MagnifyingGlassIcon },
  { value: "messages", label: "Messages", icon: ChatCircleIcon, badge: 3 },
  { value: "profile", label: "Profile", icon: UserIcon, badge: true },
]

function Page({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <View className="-m-4 flex-1">
      <View className="flex-1 gap-2 p-4">
        <Text variant="h3">{title}</Text>
        <Text variant="muted">Tap a tab to switch screens.</Text>
      </View>
      {children}
    </View>
  )
}

function TabBarExample({
  badges = true,
  disabled,
}: {
  badges?: boolean
  disabled?: string
}) {
  const [value, setValue] = React.useState("home")
  const current = items.find((item) => item.value === value)
  return (
    <Page title={current?.label ?? ""}>
      <TabBar value={value} onValueChange={setValue}>
        <TabBarList>
          {items.map((item) => (
            <TabBarItem
              key={item.value}
              value={item.value}
              icon={item.icon}
              badge={badges ? item.badge : undefined}
              disabled={item.value === disabled}
            >
              {item.label}
            </TabBarItem>
          ))}
        </TabBarList>
      </TabBar>
    </Page>
  )
}

const meta = {
  title: "Components/Tab Bar",
  component: TabBar,
} satisfies Meta<typeof TabBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <TabBarExample />,
}

export const WithoutBadges: Story = {
  render: () => <TabBarExample badges={false} />,
}

export const LargeBadge: Story = {
  render: () => (
    <Page title="Home">
      <TabBar defaultValue="home">
        <TabBarList>
          <TabBarItem value="home" icon={HouseIcon}>
            Home
          </TabBarItem>
          <TabBarItem value="messages" icon={ChatCircleIcon} badge={128}>
            Messages
          </TabBarItem>
          <TabBarItem value="settings" icon={GearSixIcon} badge="New">
            Settings
          </TabBarItem>
        </TabBarList>
      </TabBar>
    </Page>
  ),
}

export const DisabledItem: Story = {
  render: () => <TabBarExample disabled="search" />,
}
