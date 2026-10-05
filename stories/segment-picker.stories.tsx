import { ListIcon, SquaresFourIcon, TableIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

const periods = (
  <>
    <SegmentPickerItem value="day">Day</SegmentPickerItem>
    <SegmentPickerItem value="week">Week</SegmentPickerItem>
    <SegmentPickerItem value="month">Month</SegmentPickerItem>
    <SegmentPickerItem value="year">Year</SegmentPickerItem>
  </>
)

const meta = {
  title: "Patterns/Segment Picker",
  component: SegmentPicker,
  args: {
    defaultValue: "week",
    "aria-label": "Period",
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["sm", "default", "lg"] },
    spacing: { control: { type: "number", min: 0, max: 4 } },
  },
  render: (args) => <SegmentPicker {...args}>{periods}</SegmentPicker>,
} satisfies Meta<typeof SegmentPicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutValue: Story = {
  args: { defaultValue: undefined },
}

export const Outline: Story = {
  args: { variant: "outline" },
}

export const Spaced: Story = {
  args: { spacing: 2 },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <SegmentPicker key={size} {...args} size={size}>
          {periods}
        </SegmentPicker>
      ))}
    </div>
  ),
}

export const WithIcons: Story = {
  args: { defaultValue: "grid", "aria-label": "View" },
  render: (args) => (
    <SegmentPicker {...args}>
      <SegmentPickerItem value="list" aria-label="List">
        <ListIcon />
      </SegmentPickerItem>
      <SegmentPickerItem value="grid" aria-label="Grid">
        <SquaresFourIcon />
      </SegmentPickerItem>
      <SegmentPickerItem value="table" aria-label="Table">
        <TableIcon />
      </SegmentPickerItem>
    </SegmentPicker>
  ),
}

export const WithIconsAndText: Story = {
  args: { defaultValue: "grid", "aria-label": "View" },
  render: (args) => (
    <SegmentPicker {...args}>
      <SegmentPickerItem value="list" label="List">
        <ListIcon data-icon="inline-start" />
        List
      </SegmentPickerItem>
      <SegmentPickerItem value="grid" label="Grid">
        <SquaresFourIcon data-icon="inline-start" />
        Grid
      </SegmentPickerItem>
      <SegmentPickerItem value="table" label="Table">
        <TableIcon data-icon="inline-start" />
        Table
      </SegmentPickerItem>
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
    <div className="flex flex-col items-start gap-2">
      <SegmentPicker {...args} value={value} onValueChange={setValue}>
        {periods}
      </SegmentPicker>
      <p className="text-sm text-label-secondary">Selected: {value}</p>
    </div>
  )
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
}
