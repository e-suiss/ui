import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { SettingsDevice } from "@/components/blocks/settings-device"

const meta = {
  title: "Blocks/Settings Device",
  component: SettingsDevice,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SettingsDevice>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
