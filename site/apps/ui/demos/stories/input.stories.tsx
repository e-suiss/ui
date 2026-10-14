// @ts-nocheck
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
  play: async ({ canvas, step }) => {
    const email = canvas.getByPlaceholderText("jane@example.com")
    const password = canvas.getByPlaceholderText("Password")
    const quantity = canvas.getByPlaceholderText("Quantity")
    const search = canvas.getByPlaceholderText("Search...")

    await step("renders each input with its type", async () => {
      await expect(email).toHaveAttribute("type", "email")
      await expect(password).toHaveAttribute("type", "password")
      await expect(quantity).toHaveRole("spinbutton")
      await expect(search).toHaveRole("searchbox")
    })

    await step("accepts typing suited to each type", async () => {
      await userEvent.type(email, "jane@example.com")
      await expect(email).toHaveValue("jane@example.com")
      await expect(email).toBeValid()
      await userEvent.type(password, "secret")
      await expect(password).toHaveValue("secret")
      await userEvent.type(quantity, "12")
      await expect(quantity).toHaveValue(12)
      await userEvent.type(search, "grill")
      await expect(search).toHaveValue("grill")
    })
  },
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
  args: { type: "file", placeholder: undefined, "aria-label": "Menu" },
  play: async ({ canvasElement, step }) => {
    const input =
      canvasElement.querySelector<HTMLInputElement>('input[type="file"]')
    if (!input) throw new Error("file input not rendered")
    const upload = new window.File(["menu"], "menu.pdf", {
      type: "application/pdf",
    })

    await step("is reachable with Tab", async () => {
      await expect(input).toHaveAccessibleName("Menu")
      await userEvent.tab()
      await expect(input).toHaveFocus()
    })

    await step("accepts a chosen file", async () => {
      await userEvent.upload(input, upload)
      await expect(input.files?.[0]).toBe(upload)
      await expect(input.files).toHaveLength(1)
    })
  },
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
