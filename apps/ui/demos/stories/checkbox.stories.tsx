// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

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

export const Default: Story = {
  args: { "aria-label": "Accept terms" },
  play: async ({ canvas, step }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Accept terms" })

    await step("toggles on click", async () => {
      await expect(checkbox).not.toBeChecked()
      await userEvent.click(checkbox)
      await expect(checkbox).toBeChecked()
    })

    await step("toggles with Space", async () => {
      await expect(checkbox).toHaveFocus()
      await userEvent.keyboard(" ")
      await expect(checkbox).not.toBeChecked()
    })
  },
}

export const Checked: Story = {
  args: { defaultChecked: true, "aria-label": "Accept terms" },
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Accept terms" })
    await expect(checkbox).toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
  },
}

export const WithLabel: Story = {
  render: (args) => (
    <Label>
      <Checkbox {...args} />
      Accept terms and conditions
    </Label>
  ),
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", {
      name: "Accept terms and conditions",
    })
    await userEvent.click(canvas.getByText("Accept terms and conditions"))
    await expect(checkbox).toBeChecked()
  },
}

export const WithDescription: Story = {
  render: (args) => (
    <div className="flex w-80 items-start gap-3">
      <Checkbox
        {...args}
        id="marketing"
        aria-describedby="marketing-description"
        defaultChecked
        className="mt-0.75"
      />
      <div className="grid gap-1.5">
        <Label htmlFor="marketing">Product updates</Label>
        <p id="marketing-description" className="text-label-secondary text-sm">
          Get an email when we release new features.
        </p>
      </div>
    </div>
  ),
  play: async ({ canvas, step }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Product updates" })

    await step("describes the checkbox with its text", async () => {
      await expect(checkbox).toHaveAccessibleDescription(
        "Get an email when we release new features."
      )
    })

    await step("shows the description under the label", async () => {
      const description = canvas.getByText(
        "Get an email when we release new features."
      )
      await expect(description).toBeVisible()
      await expect(
        description.getBoundingClientRect().top
      ).toBeGreaterThanOrEqual(
        canvas.getByText("Product updates").getBoundingClientRect().bottom
      )
    })

    await step("toggles from its label", async () => {
      await expect(checkbox).toBeChecked()
      await userEvent.click(canvas.getByText("Product updates"))
      await expect(checkbox).not.toBeChecked()
      await userEvent.click(checkbox)
      await expect(checkbox).toBeChecked()
    })
  },
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
  play: async ({ canvas }) => {
    const unavailable = canvas.getByRole("checkbox", {
      name: "Unavailable option",
    })
    const included = canvas.getByRole("checkbox", { name: "Always included" })
    await expect(unavailable).toHaveAttribute("aria-disabled", "true")
    await expect(included).toBeChecked()
    await userEvent.click(unavailable)
    await expect(unavailable).not.toBeChecked()
    await userEvent.tab()
    await expect(unavailable).not.toHaveFocus()
    await expect(included).not.toHaveFocus()
  },
}

export const Invalid: Story = {
  render: (args) => (
    <Label>
      <Checkbox {...args} aria-invalid />
      You must accept the terms
    </Label>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("checkbox", { name: "You must accept the terms" })
    ).toBeInvalid()
  },
}
