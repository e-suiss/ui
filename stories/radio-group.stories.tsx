import type { Meta, StoryObj } from "@storybook/react-vite"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
          <RadioGroupItem value={option.value} />
          <span className="flex flex-col gap-1">
            {option.label}
            <span className="text-label-secondary font-normal">
              {option.description}
            </span>
          </span>
        </Label>
      ))}
    </RadioGroup>
  ),
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
}

export const Disabled: Story = {
  ...Default,
  args: { disabled: true },
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
}
