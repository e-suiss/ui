// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const STANDARD = /^Standard/
const EXPRESS = /^Express/

const options = [
  { value: "email", label: "Email" },
  { value: "sms", label: "Text message" },
  { value: "push", label: "Push notification" },
]

const meta = {
  title: "Components/Radio Group",
  component: RadioGroup,
  args: {
    defaultValue: "email",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <RadioGroup aria-label="Notification method" {...args}>
      {options.map((option) => (
        <Label key={option.value}>
          <RadioGroupItem value={option.value} />
          {option.label}
        </Label>
      ))}
    </RadioGroup>
  ),
  play: async ({ canvas, step }) => {
    const email = canvas.getByRole("radio", { name: "Email" })
    const sms = canvas.getByRole("radio", { name: "Text message" })

    await step("names the group and checks the default", async () => {
      await expect(
        canvas.getByRole("radiogroup", { name: "Notification method" })
      ).toBeVisible()
      await expect(email).toHaveAttribute("aria-checked", "true")
    })

    await step("selects with a click on the label", async () => {
      await userEvent.click(canvas.getByText("Text message"))
      await expect(sms).toHaveAttribute("aria-checked", "true")
      await expect(email).toHaveAttribute("aria-checked", "false")
    })

    await step("moves the selection with arrow keys", async () => {
      await userEvent.click(sms)
      await userEvent.keyboard("{ArrowDown}")
      const push = canvas.getByRole("radio", { name: "Push notification" })
      await expect(push).toHaveFocus()
      await expect(push).toHaveAttribute("aria-checked", "true")
    })
  },
}

export const WithDescriptions: Story = {
  args: { defaultValue: "standard" },
  render: (args) => (
    <RadioGroup aria-label="Shipping speed" {...args}>
      {[
        {
          value: "standard",
          label: "Standard",
          description: "Arrives in 4 to 6 business days.",
        },
        {
          value: "express",
          label: "Express",
          description: "Arrives in 1 to 2 business days.",
        },
      ].map((option) => (
        <Label key={option.value} className="items-start">
          <RadioGroupItem
            value={option.value}
            aria-labelledby={`${option.value}-label`}
            aria-describedby={`${option.value}-description`}
          />
          <span className="flex flex-col gap-1">
            <span id={`${option.value}-label`}>{option.label}</span>
            <span
              id={`${option.value}-description`}
              className="text-label-secondary font-normal"
            >
              {option.description}
            </span>
          </span>
        </Label>
      ))}
    </RadioGroup>
  ),
  play: async ({ canvas, step }) => {
    const standard = canvas.getByRole("radio", { name: STANDARD })
    const express = canvas.getByRole("radio", { name: EXPRESS })

    await step("names each option by its title and describes it", async () => {
      await expect(standard).toHaveAccessibleName("Standard")
      await expect(standard).toHaveAccessibleDescription(
        "Arrives in 4 to 6 business days."
      )
      await expect(express).toHaveAccessibleDescription(
        "Arrives in 1 to 2 business days."
      )
    })

    await step("shows each description inside its option", async () => {
      await expect(
        canvas.getByText("Arrives in 4 to 6 business days.").closest("label")
      ).toContainElement(standard)
      await expect(
        canvas.getByText("Arrives in 1 to 2 business days.").closest("label")
      ).toContainElement(express)
    })

    await step("selects an option from its description", async () => {
      await expect(standard).toHaveAttribute("aria-checked", "true")
      await userEvent.click(
        canvas.getByText("Arrives in 1 to 2 business days.")
      )
      await expect(express).toHaveAttribute("aria-checked", "true")
      await expect(standard).toHaveAttribute("aria-checked", "false")
    })
  },
}

export const DisabledItem: Story = {
  render: (args) => (
    <RadioGroup aria-label="Notification method" {...args}>
      {options.map((option) => (
        <Label key={option.value}>
          <RadioGroupItem
            value={option.value}
            disabled={option.value === "push"}
          />
          {option.label}
        </Label>
      ))}
    </RadioGroup>
  ),
  play: async ({ canvas, step }) => {
    const push = canvas.getByRole("radio", { name: "Push notification" })

    await step("skips the disabled item", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: "Text message" }))
      await userEvent.keyboard("{ArrowDown}")
      await expect(push).not.toHaveFocus()
      await expect(push).toHaveAttribute("aria-checked", "false")
    })
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
  play: async ({ canvas, step }) => {
    await step("ignores clicks while disabled", async () => {
      await userEvent.click(canvas.getByText("Text message"), {
        pointerEventsCheck: 0,
      })
      await expect(
        canvas.getByRole("radio", { name: "Text message" })
      ).toHaveAttribute("aria-checked", "false")
      await expect(
        canvas.getByRole("radio", { name: "Email" })
      ).toHaveAttribute("aria-checked", "true")
    })
  },
}

export const Invalid: Story = {
  args: { defaultValue: undefined },
  render: (args) => (
    <RadioGroup aria-label="Notification method" {...args}>
      {options.map((option) => (
        <Label key={option.value}>
          <RadioGroupItem value={option.value} aria-invalid />
          {option.label}
        </Label>
      ))}
    </RadioGroup>
  ),
  play: async ({ canvas, step }) => {
    const radios = canvas.getAllByRole("radio")

    await step("marks every option as invalid with none chosen", async () => {
      await expect(radios).toHaveLength(3)
      for (const radio of radios) {
        await expect(radio).toBeInvalid()
        await expect(radio).toHaveAttribute("aria-checked", "false")
      }
    })

    await step("still accepts a choice", async () => {
      await userEvent.click(canvas.getByText("Text message"))
      await expect(
        canvas.getByRole("radio", { name: "Text message" })
      ).toHaveAttribute("aria-checked", "true")
    })
  },
}
