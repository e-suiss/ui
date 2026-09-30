import type { Meta, StoryObj } from "@storybook/react-vite"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const meta = {
  title: "Components/Switch",
  component: Switch,
  args: {
    size: "default",
    disabled: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Switch {...args} size="sm" defaultChecked />
      <Switch {...args} size="default" defaultChecked />
    </div>
  ),
}

export const WithLabel: Story = {
  render: (args) => (
    <Label>
      <Switch {...args} />
      Airplane mode
    </Label>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Switch {...args} disabled />
      <Switch {...args} disabled defaultChecked />
    </div>
  ),
}

export const Invalid: Story = {
  args: { "aria-invalid": true },
}
