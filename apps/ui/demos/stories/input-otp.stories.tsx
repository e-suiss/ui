// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import type * as React from "react"
import { expect, userEvent, waitFor } from "storybook/test"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type InputOTPArgs = Pick<
  React.ComponentProps<typeof InputOTP>,
  "maxLength" | "disabled" | "defaultValue" | "pattern" | "aria-label"
>

const meta = {
  title: "Components/Input OTP",
  args: {
    maxLength: 6,
    disabled: false,
    "aria-label": "Verification code",
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

export const Default: Story = {
  play: async ({ canvas, canvasElement, step }) => {
    const input = canvas.getByRole<HTMLInputElement>("textbox", {
      name: "Verification code",
    })
    const slots = canvasElement.querySelectorAll('[data-slot="input-otp-slot"]')

    await step("fills one slot per typed digit", async () => {
      await userEvent.click(input)
      await userEvent.keyboard("4829")
      await expect(input).toHaveValue("4829")
      await expect(slots[0]).toHaveTextContent("4")
      await expect(slots[3]).toHaveTextContent("9")
      await waitFor(() =>
        expect(slots[4]).toHaveAttribute("data-active", "true")
      )
    })

    await step("stops at the maximum length", async () => {
      await userEvent.keyboard("13")
      await expect(input).toHaveValue("482913")
      await userEvent.keyboard("579")
      await expect(input.value).toHaveLength(6)
    })

    await step("removes the last digit with Backspace", async () => {
      await userEvent.keyboard("{Backspace}")
      await expect(input.value).toHaveLength(5)
      await expect(slots[5]).toHaveTextContent("")
    })
  },
}

export const Filled: Story = {
  args: { defaultValue: "482913" },
  play: async ({ canvas, canvasElement, step }) => {
    await step("shows the default value across the slots", async () => {
      await expect(
        canvas.getByRole("textbox", { name: "Verification code" })
      ).toHaveValue("482913")
      await expect(
        canvasElement.querySelectorAll('[data-slot="input-otp-slot"]')[5]
      ).toHaveTextContent("3")
    })
  },
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
  play: async ({ canvas, canvasElement, step }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" })
    const slots = canvasElement.querySelectorAll('[data-slot="input-otp-slot"]')

    await step("fills the slots in order as digits are typed", async () => {
      await expect(slots).toHaveLength(6)
      await userEvent.click(input)
      await userEvent.keyboard("731")
      await expect(input).toHaveValue("731")
      await expect(slots[0]).toHaveTextContent("7")
      await expect(slots[2]).toHaveTextContent("1")
      await expect(slots[3]).toHaveAttribute("data-active", "true")
    })

    await step("completes the code in the last slot", async () => {
      await userEvent.keyboard("905")
      await expect(input).toHaveValue("731905")
      await expect(slots[5]).toHaveTextContent("5")
    })
  },
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
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole<HTMLInputElement>("textbox", {
      name: "Verification code",
    })

    await step("caps the code at four digits", async () => {
      await userEvent.click(input)
      await userEvent.keyboard("1234")
      await expect(input).toHaveValue("1234")
      await userEvent.keyboard("56")
      await expect(input.value).toHaveLength(4)
    })
  },
}

export const Alphanumeric: Story = {
  args: { pattern: REGEXP_ONLY_DIGITS_AND_CHARS },
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" })

    await step("accepts letters and digits", async () => {
      await userEvent.click(input)
      await userEvent.keyboard("AB12")
      await expect(input).toHaveValue("AB12")
    })
  },
}

export const Invalid: Story = {
  args: { defaultValue: "123456" },
  render: (args) => (
    <InputOTP {...args} aria-invalid>
      <InputOTPGroup>
        {Array.from({ length: 6 }, (_, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    await step("marks the input invalid and every slot with it", async () => {
      await expect(
        canvas.getByRole("textbox", { name: "Verification code" })
      ).toBeInvalid()
      const slots = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="input-otp-slot"]'
      )
      await expect(slots).toHaveLength(6)
      for (const slot of slots) {
        await expect(getComputedStyle(slot).borderTopColor).not.toBe(
          "rgba(0, 0, 0, 0)"
        )
      }
      await expect(
        canvas.getByRole("textbox", { name: "Verification code" })
      ).toHaveValue("123456")
    })
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "123456" },
  play: async ({ canvas, canvasElement, step }) => {
    await step("disables the input and keeps its value", async () => {
      const input = canvas.getByRole("textbox", { name: "Verification code" })
      await expect(input).toBeDisabled()
      await expect(input).toHaveValue("123456")
    })

    await step("greys out the slots without filling the row", async () => {
      await expect(canvasElement.querySelector(".cn-input-otp")).toHaveStyle({
        backgroundColor: "rgba(0, 0, 0, 0)",
      })
      const separator = canvasElement.querySelector<HTMLElement>(
        '[data-slot="input-otp-separator"]'
      )
      await expect(separator).not.toBeNull()
      const slots = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="input-otp-slot"]'
      )
      await expect(slots).toHaveLength(6)
      for (const slot of slots) {
        await expect(getComputedStyle(slot).backgroundColor).not.toBe(
          "rgba(0, 0, 0, 0)"
        )
        await expect(separator).toHaveStyle({
          color: getComputedStyle(slot).color,
        })
      }
    })
  },
}
