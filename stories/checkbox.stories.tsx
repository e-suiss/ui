import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const WithLabel: Story = {
  render: (args) => (
    <Label>
      <Checkbox {...args} />
      Accept terms and conditions
    </Label>
  ),
}

export const WithDescription: Story = {
  render: (args) => (
    <div className="flex w-80 items-start gap-3">
      <Checkbox {...args} id="marketing" defaultChecked className="mt-0.75" />
      <div className="grid gap-1.5">
        <Label htmlFor="marketing">Product updates</Label>
        <p className="text-muted-foreground text-sm">
          Get an email when we release new features.
        </p>
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Label>
        <Checkbox {...args} disabled />
        Unavailable option
      </Label>
      <Label>
        <Checkbox {...args} disabled defaultChecked />
        Always included
      </Label>
    </div>
  ),
}

export const Invalid: Story = {
  render: (args) => (
    <Label>
      <Checkbox {...args} aria-invalid />
      You must accept the terms
    </Label>
  ),
}
