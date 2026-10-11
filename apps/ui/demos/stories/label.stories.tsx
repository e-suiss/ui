// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

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

export const Default: Story = {
  play: async ({ canvas, step }) => {
    await step("renders the label text", async () => {
      await expect(canvas.getByText("Email address").tagName).toBe("LABEL")
    })
  },
}

export const WithInput: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label {...args} htmlFor="label-email" />
      <Input id="label-email" type="email" placeholder="you@example.com" />
    </div>
  ),
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Email address" })

    await step("names the input and focuses it on click", async () => {
      await userEvent.click(canvas.getByText("Email address"))
      await expect(input).toHaveFocus()
    })
  },
}

export const WithCheckbox: Story = {
  args: { children: "Accept terms and conditions" },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="label-terms" />
      <Label {...args} htmlFor="label-terms" />
    </div>
  ),
  play: async ({ canvas, step }) => {
    const checkbox = canvas.getByRole("checkbox", {
      name: "Accept terms and conditions",
    })

    await step("toggles the checkbox from its label", async () => {
      await expect(checkbox).not.toBeChecked()
      await userEvent.click(canvas.getByText("Accept terms and conditions"))
      await expect(checkbox).toBeChecked()
    })
  },
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
  play: async ({ canvas, step }) => {
    await step("keeps the named input disabled", async () => {
      await expect(
        canvas.getByRole("textbox", { name: "Email address" })
      ).toBeDisabled()
    })
  },
}
