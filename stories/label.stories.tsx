import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Components/Label",
  component: Label,
  args: {
    children: "Email address",
  },
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithInput: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label {...args} htmlFor="label-email" />
      <Input id="label-email" type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const WithCheckbox: Story = {
  args: { children: "Accept terms and conditions" },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="label-terms" />
      <Label {...args} htmlFor="label-terms" />
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="group flex w-72 flex-col gap-2" data-disabled="true">
      <Label {...args} htmlFor="label-disabled" />
      <Input
        id="label-disabled"
        type="email"
        placeholder="you@example.com"
        disabled
      />
    </div>
  ),
}
