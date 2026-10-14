import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { SettingsNotifications } from "@/components/blocks/settings-notifications"

const meta = {
  title: "Blocks/Settings Notifications",
  component: SettingsNotifications,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SettingsNotifications>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
