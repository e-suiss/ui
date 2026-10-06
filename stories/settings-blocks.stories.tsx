import type { Meta, StoryObj } from "@storybook/react-vite"

import { SettingsAccount } from "@/components/blocks/settings-account"
import { SettingsDevice } from "@/components/blocks/settings-device"
import { SettingsNotifications } from "@/components/blocks/settings-notifications"

const meta = {
  title: "Blocks/Settings",
  component: SettingsDevice,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SettingsDevice>

export default meta

type Story = StoryObj<typeof meta>

export const Device: Story = {}

export const Account: Story = { render: () => <SettingsAccount /> }

export const Notifications: Story = {
  render: () => <SettingsNotifications />,
}
