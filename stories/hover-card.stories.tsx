import type { Meta, StoryObj } from "@storybook/react-native"
import { CalendarIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

function ProfileCard() {
  return (
    <View className="flex-row gap-4">
      <Avatar alt="Expo">
        <AvatarImage source={{ uri: "https://github.com/expo.png" }} />
        <AvatarFallback>
          <Text className="text-xs">EX</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-1 gap-1">
        <Text className="text-sm font-semibold">@expo</Text>
        <Text className="text-sm">
          An open-source framework for making universal native apps.
        </Text>
        <View className="flex-row items-center gap-2 pt-2">
          <Icon as={CalendarIcon} className="text-muted-foreground size-4" />
          <Text variant="muted" className="text-xs">
            Joined December 2015
          </Text>
        </View>
      </View>
    </View>
  )
}

const meta = {
  title: "Components/Hover Card",
  component: HoverCard,
} satisfies Meta<typeof HoverCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="items-start">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">
            <Text>@expo</Text>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80" align="start">
          <ProfileCard />
        </HoverCardContent>
      </HoverCard>
    </View>
  ),
}

export const Sides: Story = {
  render: () => (
    <View className="items-center gap-4 py-24">
      {(["top", "bottom"] as const).map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger asChild>
            <Button variant="outline">
              <Text className="capitalize">{side}</Text>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side={side} className="w-64">
            <Text className="text-sm">This card opens on the {side}.</Text>
          </HoverCardContent>
        </HoverCard>
      ))}
    </View>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <View className="items-start">
      <HoverCard defaultOpen>
        <HoverCardTrigger asChild>
          <Button variant="link">
            <Text>@expo</Text>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80" align="start">
          <ProfileCard />
        </HoverCardContent>
      </HoverCard>
    </View>
  ),
}
