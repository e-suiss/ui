import { InfoIcon, WarningCircleIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Components/Alert",
  component: Alert,
  args: {
    variant: "default",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <InfoIcon />
      <AlertTitle>Update available</AlertTitle>
      <AlertDescription>
        A new version is ready to install. Restart the app to apply it.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert {...args}>
      <WarningCircleIcon />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Your card was declined. Update your billing details to continue.
      </AlertDescription>
    </Alert>
  ),
}

export const WithoutIcon: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>
        The service will be unavailable on Sunday from 2:00 to 4:00 AM.
      </AlertDescription>
    </Alert>
  ),
}

export const TitleOnly: Story = {
  render: (args) => (
    <Alert {...args}>
      <InfoIcon />
      <AlertTitle>Your changes have been saved.</AlertTitle>
    </Alert>
  ),
}

export const WithAction: Story = {
  render: (args) => (
    <Alert {...args}>
      <InfoIcon />
      <AlertTitle>Storage almost full</AlertTitle>
      <AlertDescription>
        You have used 90% of your storage. Upgrade for more space.
      </AlertDescription>
      <AlertAction>
        <Button size="xs">Upgrade</Button>
      </AlertAction>
    </Alert>
  ),
}
