import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { RolesEditor } from "@/components/blocks/roles-editor"

const meta = {
  title: "Blocks/Roles Editor",
  component: RolesEditor,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof RolesEditor>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
