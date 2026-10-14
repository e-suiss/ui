import type { Meta, StoryObj } from "@storybook/react-native"
import { CheckIcon } from "phosphor-react-native"
import { View } from "react-native"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
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
        <Text>AT</Text>
      </AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage
            alt="Ada Lovelace"
            source={{ uri: "https://i.pravatar.cc/150?img=5" }}
          />
          <AvatarFallback>
            <Text>AL</Text>
          </AvatarFallback>
        </Avatar>
      ))}
    </View>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {people.map((person) => (
        <Avatar key={person.name}>
          <AvatarImage alt={person.name} source={{ uri: person.uri }} />
          <AvatarFallback>
            <Text>{person.initials}</Text>
          </AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount accessibilityLabel="4 more">
        <Text>+4</Text>
      </AvatarGroupCount>
    </AvatarGroup>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage
            alt="Alan Turing"
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          />
          <AvatarFallback>
            <Text>AT</Text>
          </AvatarFallback>
          <AvatarBadge>
            <Icon as={CheckIcon} weight="bold" />
          </AvatarBadge>
        </Avatar>
      ))}
    </View>
  ),
}
