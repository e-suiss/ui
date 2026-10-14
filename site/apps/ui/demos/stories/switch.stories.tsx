// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

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

export const Default: Story = {
  args: { "aria-label": "Wi-Fi" },
  play: async ({ canvas, step }) => {
    const control = canvas.getByRole("switch", { name: "Wi-Fi" })

    await step("toggles on click", async () => {
      await expect(control).toHaveAttribute("aria-checked", "false")
      await userEvent.click(control)
      await expect(control).toHaveAttribute("aria-checked", "true")
    })

    await step("toggles back with Space", async () => {
      await expect(control).toHaveFocus()
      await userEvent.keyboard(" ")
      await expect(control).toHaveAttribute("aria-checked", "false")
    })
  },
}

export const Checked: Story = {
  args: { defaultChecked: true, "aria-label": "Wi-Fi" },
  play: async ({ canvas, step }) => {
    const control = canvas.getByRole("switch", { name: "Wi-Fi" })

    await step("starts on and turns off on click", async () => {
      await expect(control).toHaveAttribute("aria-checked", "true")
      await userEvent.click(control)
      await expect(control).toHaveAttribute("aria-checked", "false")
    })
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Switch {...args} size="sm" defaultChecked aria-label="Wi-Fi" />
      <Switch {...args} size="default" defaultChecked aria-label="Bluetooth" />
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
  play: async ({ canvas, step }) => {
    const control = canvas.getByRole("switch", { name: "Airplane mode" })

    await step("toggles from the label text", async () => {
      await userEvent.click(canvas.getByText("Airplane mode"))
      await expect(control).toHaveAttribute("aria-checked", "true")
    })
  },
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Switch {...args} disabled aria-label="Wi-Fi" />
      <Switch {...args} disabled defaultChecked aria-label="Bluetooth" />
    </div>
  ),
  play: async ({ canvas, step }) => {
    const [off, on] = canvas.getAllByRole("switch") as [
      HTMLElement,
      HTMLElement,
    ]

    await step("ignores clicks while disabled", async () => {
      await expect(off).toHaveAttribute("aria-disabled", "true")
      await userEvent.click(off, { pointerEventsCheck: 0 })
      await expect(off).toHaveAttribute("aria-checked", "false")
      await expect(on).toHaveAttribute("aria-checked", "true")
    })
  },
}

export const Invalid: Story = {
  args: { "aria-invalid": true, "aria-label": "Accept terms" },
  play: async ({ canvas, step }) => {
    const control = canvas.getByRole("switch", { name: "Accept terms" })

    await step("flags the switch as invalid", async () => {
      await expect(control).toBeInvalid()
      await expect(control).toHaveAttribute("aria-checked", "false")
    })

    await step("still toggles on click", async () => {
      await userEvent.click(control)
      await expect(control).toHaveAttribute("aria-checked", "true")
      await expect(control).toBeInvalid()
    })
  },
}
