import { GearIcon, UserIcon } from "phosphor-react-native"
import * as React from "react"
import { Icon } from "@/components/ui/icon"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Text } from "@/components/ui/text"

type ListVariant = "default" | "line"

function WithIconsDemo({ variant }: { variant?: ListVariant }) {
  const [value, setValue] = React.useState("profile")
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList variant={variant}>
        <TabsTrigger value="profile">
          <Icon as={UserIcon} className="size-4" />
          <Text>Profile</Text>
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Icon as={GearIcon} className="size-4" />
          <Text>Settings</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Text className="text-sm text-muted-foreground">
          Your public profile information.
        </Text>
      </TabsContent>
      <TabsContent value="settings">
        <Text className="text-sm text-muted-foreground">
          Manage your preferences.
        </Text>
      </TabsContent>
    </Tabs>
  )
}

export default function TabsWithIconsLine() {
  return <WithIconsDemo variant="line" />
}
