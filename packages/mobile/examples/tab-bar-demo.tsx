import {
  ChatCircleIcon,
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
    <View className="-m-4 flex-1 bg-background">
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

export default function TabBarDemo() {
  return <TabBarExample />
}
