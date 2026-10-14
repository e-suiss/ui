import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { SettingsAccount } from "@/components/blocks/settings-account"

const meta = {
  title: "Blocks/Settings Account",
  component: SettingsAccount,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SettingsAccount>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
