import { ChatCircleIcon, GearSixIcon, HouseIcon } from "phosphor-react-native"
import type * as React from "react"
import { View } from "react-native"
import { TabBar, TabBarItem, TabBarList } from "@/components/ui/tab-bar"
import { Text } from "@/components/ui/text"

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

export default function TabBarLargeBadge() {
  return (
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
  )
}
