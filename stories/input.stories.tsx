import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    type: "text",
    placeholder: "Enter your name",
    disabled: false,
    size: "default",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "default"],
    },
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

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const input = canvas.getByPlaceholderText("Enter your name")

    await step("accepts typed text", async () => {
      await userEvent.type(input, "Ada")
      await expect(input).toHaveValue("Ada")
      await expect(input).toHaveFocus()
    })
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Input {...args} size="sm" placeholder="Small" />
        <Button size="sm">Save</Button>
      </div>
      <div className="flex items-center gap-2">
        <Input {...args} size="md" placeholder="Medium" />
        <Button>Save</Button>
      </div>
      <div className="flex items-center gap-2">
        <Input {...args} size="default" placeholder="Default" />
        <Button size="lg">Save</Button>
      </div>
    </div>
  ),
}

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
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox")

    await step("replaces the default value", async () => {
      await expect(input).toHaveValue("Jane Doe")
      await userEvent.clear(input)
      await userEvent.type(input, "Ada")
      await expect(input).toHaveValue("Ada")
    })
  },
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
  play: async ({ canvas, step }) => {
    await step("flags the input as invalid", async () => {
      await expect(canvas.getByRole("textbox")).toBeInvalid()
    })
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox")

    await step("ignores typing while disabled", async () => {
      await expect(input).toBeDisabled()
      await userEvent.type(input, "Ada")
      await expect(input).toHaveValue("")
    })
  },
}
