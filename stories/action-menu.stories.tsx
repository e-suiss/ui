import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import {
  ActionMenu,
  ActionMenuContent,
  ActionMenuItem,
  ActionMenuLabel,
  ActionMenuSeparator,
  ActionMenuTrigger,
} from "@/components/patterns/action-menu"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

function ActionMenuDemo({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <View className="items-start">
      <ActionMenu defaultOpen={defaultOpen}>
        <ActionMenuTrigger render={<Button variant="outline" />}>
          <Text>Options</Text>
        </ActionMenuTrigger>
        <ActionMenuContent>
          <ActionMenuLabel>Project</ActionMenuLabel>
          <ActionMenuItem>Rename</ActionMenuItem>
          <ActionMenuItem>Duplicate</ActionMenuItem>
          <ActionMenuItem disabled>Move</ActionMenuItem>
          <ActionMenuSeparator />
          <ActionMenuItem variant="destructive">Delete</ActionMenuItem>
        </ActionMenuContent>
      </ActionMenu>
    </View>
  )
}

const meta = {
  title: "Patterns/Action Menu",
  component: ActionMenu,
} satisfies Meta<typeof ActionMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ActionMenuDemo />,
}

export const OpenByDefault: Story = {
  render: () => <ActionMenuDemo defaultOpen />,
}
