import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Text } from "@/components/ui/text"

const people = [
  {
    name: "Ada Lovelace",
    initials: "AL",
    uri: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Alan Turing",
    initials: "AT",
    uri: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Grace Hopper",
    initials: "GH",
    uri: "https://i.pravatar.cc/150?img=47",
  },
]

const meta = {
  title: "Components/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        alt="Ada Lovelace"
        source={{ uri: "https://i.pravatar.cc/150?img=5" }}
      />
      <AvatarFallback>
        <Text>AL</Text>
      </AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  render: () => (
    <Avatar accessibilityLabel="Alan Turing">
      <AvatarFallback>
        <Text className="text-sm">AT</Text>
      </AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      <Avatar className="size-6">
        <AvatarImage
          alt="Ada Lovelace"
          source={{ uri: "https://i.pravatar.cc/150?img=5" }}
        />
        <AvatarFallback>
          <Text className="text-xs">SM</Text>
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          alt="Ada Lovelace"
          source={{ uri: "https://i.pravatar.cc/150?img=5" }}
        />
        <AvatarFallback>
          <Text className="text-sm">MD</Text>
        </AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarImage
          alt="Ada Lovelace"
          source={{ uri: "https://i.pravatar.cc/150?img=5" }}
        />
        <AvatarFallback>
          <Text>LG</Text>
        </AvatarFallback>
      </Avatar>
    </View>
  ),
}

export const Group: Story = {
  render: () => (
    <View className="flex-row">
      {people.map((person) => (
        <Avatar key={person.name} className="border-background -mr-2 border-2">
          <AvatarImage alt={person.name} source={{ uri: person.uri }} />
          <AvatarFallback>
            <Text className="text-xs">{person.initials}</Text>
          </AvatarFallback>
        </Avatar>
      ))}
      <Avatar accessibilityLabel="More" className="border-background border-2">
        <AvatarFallback>
          <Text className="text-xs">+4</Text>
        </AvatarFallback>
      </Avatar>
    </View>
  ),
}
