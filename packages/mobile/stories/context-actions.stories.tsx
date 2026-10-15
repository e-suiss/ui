import type { Meta, StoryObj } from "@storybook/react-native"
import { ImageIcon } from "phosphor-react-native"
import { View } from "react-native"
import {
  ContextActions,
  ContextActionsContent,
  ContextActionsItem,
  ContextActionsLabel,
  ContextActionsTrigger,
} from "@/components/patterns/context-actions"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Patterns/Context Actions",
  component: ContextActions,
} satisfies Meta<typeof ContextActions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ContextActions>
      <ContextActionsTrigger
        accessibilityLabel="Photo"
        className="h-40 items-center justify-center gap-2 rounded-2xl bg-muted active:opacity-80"
      >
        <Icon as={ImageIcon} className="size-8 text-muted-foreground" />
        <Text className="text-sm text-muted-foreground">Long press</Text>
      </ContextActionsTrigger>
      <ContextActionsContent>
        <ContextActionsLabel>Photo</ContextActionsLabel>
        <ContextActionsItem>Copy</ContextActionsItem>
        <ContextActionsItem>Share</ContextActionsItem>
        <ContextActionsItem variant="destructive">Delete</ContextActionsItem>
      </ContextActionsContent>
    </ContextActions>
  ),
}

export const Inline: Story = {
  render: () => (
    <View className="items-start">
      <ContextActions>
        <ContextActionsTrigger className="rounded-lg bg-secondary px-3 py-2">
          <Text>Hold this message</Text>
        </ContextActionsTrigger>
        <ContextActionsContent cancelLabel="Close">
          <ContextActionsItem>Reply</ContextActionsItem>
          <ContextActionsItem>Forward</ContextActionsItem>
        </ContextActionsContent>
      </ContextActions>
    </View>
  ),
}
