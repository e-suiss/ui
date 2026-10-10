import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Text } from "@/components/ui/text"

function slotIndexes(length: number) {
  return Array.from({ length }, (_, index) => index)
}

const meta = {
  title: "Components/InputOTP",
  component: InputOTP,
  args: {
    length: 6,
  },
} satisfies Meta<typeof InputOTP>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <InputOTP {...args}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
}

function ControlledDemo() {
  const [value, setValue] = React.useState("")
  const [completed, setCompleted] = React.useState<string | null>(null)
  return (
    <View className="gap-3">
      <InputOTP
        length={4}
        value={value}
        onValueChange={setValue}
        onValueComplete={setCompleted}
      >
        <InputOTPGroup>
          {slotIndexes(4).map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <Text variant="muted">
        {completed ? `Submitted ${completed}` : "Enter the 4 digit code"}
      </Text>
    </View>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

export const Alphanumeric: Story = {
  render: () => (
    <InputOTP
      length={6}
      validationType="alphanumeric"
      normalizeValue={(value) => value.toUpperCase()}
    >
      <InputOTPGroup>
        {slotIndexes(6).map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
}

export const Masked: Story = {
  render: () => (
    <InputOTP length={4} mask defaultValue="12">
      <InputOTPGroup>
        {slotIndexes(4).map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
}

export const Disabled: Story = {
  render: () => (
    <InputOTP length={6} disabled defaultValue="123">
      <InputOTPGroup>
        {slotIndexes(6).map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
}
