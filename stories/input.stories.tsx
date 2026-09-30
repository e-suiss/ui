import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "@/components/ui/input"

const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    type: "text",
    placeholder: "Enter your name",
    disabled: false,
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Types: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Input {...args} type="email" placeholder="jane@example.com" />
      <Input {...args} type="password" placeholder="Password" />
      <Input {...args} type="number" placeholder="Quantity" />
      <Input {...args} type="search" placeholder="Search..." />
    </div>
  ),
}

export const WithValue: Story = {
  args: { defaultValue: "Jane Doe" },
}

export const File: Story = {
  args: { type: "file", placeholder: undefined },
}

export const Invalid: Story = {
  args: {
    type: "email",
    defaultValue: "jane@",
    "aria-invalid": true,
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}
