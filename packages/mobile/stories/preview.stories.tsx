import type { Meta, StoryObj } from "@storybook/react-native"
import { CalendarBlankIcon } from "phosphor-react-native"
import { View } from "react-native"
import {
  Preview,
  PreviewContent,
  PreviewTrigger,
} from "@/components/patterns/preview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

function ProfileCard() {
  return (
    <View className="flex-row gap-4">
      <Avatar size="lg">
        <AvatarImage
          alt="Ada Lovelace"
          source={{ uri: "https://i.pravatar.cc/150?img=5" }}
        />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <View className="flex-1 gap-1">
        <Text className="text-sm font-semibold">@ada</Text>
        <Text className="text-sm">
          Mathematician and writer, known for her work on the Analytical Engine.
        </Text>
        <View className="mt-1 flex-row items-center gap-1.5">
          <Icon
            as={CalendarBlankIcon}
            className="size-4 text-label-secondary"
          />
          <Text className="text-xs text-label-secondary">
            Joined December 2021
          </Text>
        </View>
      </View>
    </View>
  )
}

function PreviewDemo({
  defaultOpen,
  floating,
  showCloseButton,
  closeLabel,
}: {
  defaultOpen?: boolean
  floating?: boolean
  showCloseButton?: boolean
  closeLabel?: string
}) {
  return (
    <View className="flex-1 items-center justify-center">
      <Preview defaultOpen={defaultOpen} floating={floating}>
        <PreviewTrigger>@ada</PreviewTrigger>
        <PreviewContent
          showCloseButton={showCloseButton}
          closeLabel={closeLabel}
          accessibilityLabel="@ada"
        >
          <ProfileCard />
        </PreviewContent>
      </Preview>
    </View>
  )
}

const meta = {
  title: "Patterns/Preview",
  component: Preview,
} satisfies Meta<typeof Preview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <PreviewDemo />,
}

export const OpenByDefault: Story = {
  render: () => <PreviewDemo defaultOpen />,
}

export const WithCloseButton: Story = {
  render: () => <PreviewDemo defaultOpen showCloseButton />,
}

export const WithCloseLabel: Story = {
  render: () => <PreviewDemo defaultOpen showCloseButton closeLabel="Done" />,
}

export const Attached: Story = {
  render: () => <PreviewDemo defaultOpen floating={false} />,
}
