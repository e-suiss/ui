import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"
import { Text } from "@/components/ui/text"

const periods = [
  <SegmentPickerItem key="day" value="day">
    Day
  </SegmentPickerItem>,
  <SegmentPickerItem key="week" value="week">
    Week
  </SegmentPickerItem>,
  <SegmentPickerItem key="month" value="month">
    Month
  </SegmentPickerItem>,
  <SegmentPickerItem key="year" value="year">
    Year
  </SegmentPickerItem>,
]

const meta = {
  title: "Patterns/Segment Picker",
  component: SegmentPicker,
  args: {
    defaultValue: "week",
    accessibilityLabel: "Period",
    className: "w-40",
  },
  render: (args) => <SegmentPicker {...args}>{periods}</SegmentPicker>,
} satisfies Meta<typeof SegmentPicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutValue: Story = {
  args: { defaultValue: undefined },
}

export const Sizes: Story = {
  render: (args) => (
    <View className="items-start gap-3">
      {(["sm", "default"] as const).map((size) => (
        <SegmentPicker key={size} {...args} size={size}>
          {periods}
        </SegmentPicker>
      ))}
    </View>
  ),
}

export const WithIcons: Story = {
  args: { defaultValue: "grid", accessibilityLabel: "View" },
  render: (args) => (
    <SegmentPicker {...args}>
      <SegmentPickerItem value="list" accessibilityLabel="List" />
      <SegmentPickerItem value="grid" accessibilityLabel="Grid" />
      <SegmentPickerItem value="table" accessibilityLabel="Table" />
    </SegmentPicker>
  ),
}

export const WithIconsAndText: Story = {
  args: { defaultValue: "grid", accessibilityLabel: "View" },
  render: (args) => (
    <SegmentPicker {...args}>
      <SegmentPickerItem value="list" label="List" />
      <SegmentPickerItem value="grid" label="Grid" />
      <SegmentPickerItem value="table" label="Table" />
    </SegmentPicker>
  ),
}

export const DisabledItem: Story = {
  render: (args) => (
    <SegmentPicker {...args}>
      <SegmentPickerItem value="day">Day</SegmentPickerItem>
      <SegmentPickerItem value="week">Week</SegmentPickerItem>
      <SegmentPickerItem value="month">Month</SegmentPickerItem>
      <SegmentPickerItem value="year" disabled>
        Year
      </SegmentPickerItem>
    </SegmentPicker>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

function ControlledExample(args: React.ComponentProps<typeof SegmentPicker>) {
  const [value, setValue] = React.useState("month")

  return (
    <View className="items-start gap-2">
      <SegmentPicker {...args} value={value} onValueChange={setValue}>
        {periods}
      </SegmentPicker>
      <Text className="text-sm text-label-secondary">Selected: {value}</Text>
    </View>
  )
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
}
