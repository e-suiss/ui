import type * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type InputOTPArgs = Pick<
  React.ComponentProps<typeof InputOTP>,
  "maxLength" | "disabled" | "defaultValue" | "pattern"
>

const meta = {
  title: "Components/Input OTP",
  args: {
    maxLength: 6,
    disabled: false,
  },
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
} satisfies Meta<InputOTPArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Filled: Story = {
  args: { defaultValue: "482913" },
}

export const SingleGroup: Story = {
  render: (args) => (
    <InputOTP {...args}>
      <InputOTPGroup>
        {Array.from({ length: 6 }, (_, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
}

export const FourDigits: Story = {
  args: { maxLength: 4 },
  render: (args) => (
    <InputOTP {...args}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  ),
}

export const Alphanumeric: Story = {
  args: { pattern: REGEXP_ONLY_DIGITS_AND_CHARS },
}

export const Invalid: Story = {
  args: { defaultValue: "123456" },
  render: (args) => (
    <InputOTP {...args}>
      <InputOTPGroup>
        {Array.from({ length: 6 }, (_, index) => (
          <InputOTPSlot key={index} index={index} aria-invalid />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "123456" },
}
