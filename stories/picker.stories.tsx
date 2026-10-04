import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

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

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: "banana" },
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
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { "aria-invalid": true },
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
}
