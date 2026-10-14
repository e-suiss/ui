// @ts-nocheck
import { InfoIcon, WarningCircleIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

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
      <InfoIcon weight="fill" />
      <AlertTitle>Update available</AlertTitle>
      <AlertDescription>
        A new version is ready to install. Restart the app to apply it.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    const alert = canvas.getByRole("alert")
    await expect(alert).toHaveTextContent("Update available")
    await expect(alert).toHaveTextContent(
      "A new version is ready to install. Restart the app to apply it."
    )
  },
}

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert {...args}>
      <WarningCircleIcon weight="fill" />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Your card was declined. Update your billing details to continue.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Payment failed")
  },
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
      <InfoIcon weight="fill" />
      <AlertTitle>Your changes have been saved.</AlertTitle>
    </Alert>
  ),
}

export const WithAction: Story = {
  render: (args) => (
    <Alert {...args}>
      <InfoIcon weight="fill" />
      <AlertTitle>Storage almost full</AlertTitle>
      <AlertDescription>
        You have used 90% of your storage. Upgrade for more space.
      </AlertDescription>
      <AlertAction>
        <Button size="xs">Upgrade</Button>
      </AlertAction>
    </Alert>
  ),
  play: async ({ canvas }) => {
    const upgrade = canvas.getByRole("button", { name: "Upgrade" })
    await expect(canvas.getByRole("alert")).toContainElement(upgrade)
    await userEvent.tab()
    await expect(upgrade).toHaveFocus()
  },
}
