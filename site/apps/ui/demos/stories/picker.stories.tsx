// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import {
  Picker,
  PickerGroup,
  PickerItem,
  PickerSeparator,
} from "@/components/patterns/picker"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const fruitItems = fruits.map((fruit) => (
  <PickerItem key={fruit.value} value={fruit.value}>
    {fruit.label}
  </PickerItem>
))

const meta = {
  title: "Patterns/Picker",
  component: Picker,
  args: {
    placeholder: "Select a fruit",
    "aria-label": "Fruit",
    className: "w-48",
  },
  render: (args) => <Picker {...args}>{fruitItems}</Picker>,
} satisfies Meta<typeof Picker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" })

    await step("shows the placeholder before a choice", async () => {
      await expect(trigger).toHaveTextContent("Select a fruit")
    })

    await step("opens the list and picks an option", async () => {
      await userEvent.click(trigger)
      await userEvent.click(
        await screen.findByRole("option", { name: "Blueberry" })
      )
      await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
      await expect(trigger).toHaveTextContent("Blueberry")
    })

    await step("closes with Escape without changing the value", async () => {
      await userEvent.click(trigger)
      await screen.findByRole("listbox")
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
      await expect(trigger).toHaveTextContent("Blueberry")
    })
  },
}

export const WithValue: Story = {
  args: { defaultValue: "banana" },
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" })

    await step("shows the initial value and marks it in the list", async () => {
      await expect(trigger).toHaveTextContent("Banana")
      await userEvent.click(trigger)
      await expect(
        await screen.findByRole("option", { name: "Banana" })
      ).toHaveAttribute("aria-selected", "true")
    })

    await step("replaces it with a new choice", async () => {
      await userEvent.click(screen.getByRole("option", { name: "Grapes" }))
      await waitFor(() => expect(trigger).toHaveTextContent("Grapes"))
    })
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Picker {...args} size="sm">
        {fruitItems}
      </Picker>
      <Picker {...args}>{fruitItems}</Picker>
    </div>
  ),
}

export const Grouped: Story = {
  args: { placeholder: "Select a time zone", "aria-label": "Time zone" },
  render: (args) => (
    <Picker {...args} className="w-64">
      <PickerGroup label="North America">
        <PickerItem value="est">Eastern Time</PickerItem>
        <PickerItem value="cst">Central Time</PickerItem>
        <PickerItem value="pst">Pacific Time</PickerItem>
      </PickerGroup>
      <PickerSeparator />
      <PickerGroup label="Europe">
        <PickerItem value="gmt">Greenwich Mean Time</PickerItem>
        <PickerItem value="cet">Central European Time</PickerItem>
        <PickerItem value="trt" disabled>
          Turkey Time
        </PickerItem>
      </PickerGroup>
    </Picker>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Time zone" })

    await step("lists labelled groups with a disabled option", async () => {
      await userEvent.click(trigger)
      const europe = await screen.findByRole("group", { name: "Europe" })
      await waitFor(() => expect(europe).toBeVisible())
      await expect(
        screen.getByRole("option", { name: "Turkey Time" })
      ).toHaveAttribute("aria-disabled", "true")
    })

    await step("picks an option from a group", async () => {
      await userEvent.click(
        screen.getByRole("option", { name: "Pacific Time" })
      )
      await waitFor(() => expect(trigger).toHaveTextContent("Pacific Time"))
    })
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, step }) => {
    await step("does not open when disabled", async () => {
      const trigger = canvas.getByRole("combobox", { name: "Fruit" })
      await expect(trigger).toBeDisabled()
      await userEvent.click(trigger, { pointerEventsCheck: 0 })
      await expect(screen.queryByRole("listbox")).toBeNull()
    })
  },
}

export const Invalid: Story = {
  args: { "aria-invalid": true },
  play: async ({ canvas, step }) => {
    await step("exposes the invalid state", async () => {
      await expect(
        canvas.getByRole("combobox", { name: "Fruit" })
      ).toHaveAttribute("aria-invalid", "true")
    })
  },
}

function ControlledExample(args: React.ComponentProps<typeof Picker>) {
  const [value, setValue] = React.useState("grapes")

  return (
    <div className="flex flex-col items-start gap-2">
      <Picker {...args} value={value} onValueChange={setValue}>
        {fruitItems}
      </Picker>
      <p className="text-sm text-label-secondary">Selected: {value}</p>
    </div>
  )
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" })

    await step("starts with the controlled value", async () => {
      await expect(trigger).toHaveTextContent("Grapes")
      await expect(canvas.getByText("Selected: grapes")).toBeVisible()
    })

    await step("reports a new choice to the owner", async () => {
      await userEvent.click(trigger)
      await userEvent.click(
        await screen.findByRole("option", { name: "Pineapple" })
      )
      await waitFor(() =>
        expect(canvas.getByText("Selected: pineapple")).toBeVisible()
      )
      await expect(trigger).toHaveTextContent("Pineapple")
    })
  },
}
