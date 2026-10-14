import type { Meta, StoryObj } from "@storybook/react-native"
import { CheckCircleIcon, InfoIcon, WarningIcon } from "phosphor-react-native"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Alert",
  component: Alert,
  args: {
    icon: InfoIcon,
  },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Alert icon={CheckCircleIcon}>
      <AlertTitle>Payment successful</AlertTitle>
      <AlertDescription>
        Your payment of $29.99 has been processed. A receipt has been sent to
        your email.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert icon={WarningIcon} variant="destructive">
      <AlertTitle>Unable to process payment</AlertTitle>
      <AlertDescription>
        Please verify your billing information and try again.
      </AlertDescription>
    </Alert>
  ),
}

export const TitleOnly: Story = {
  render: () => (
    <Alert icon={InfoIcon}>
      <AlertTitle>Your session will expire in 5 minutes.</AlertTitle>
    </Alert>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Alert icon={InfoIcon}>
      <AlertTitle>New version available</AlertTitle>
      <AlertDescription>
        Update now to get the latest features and fixes.
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="tinted">
          <Text>Update</Text>
        </Button>
      </AlertAction>
    </Alert>
  ),
}

export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        You can add components to your app using the registry.
      </AlertDescription>
    </Alert>
  ),
}
