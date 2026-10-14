// @ts-nocheck
import { ListIcon, SquaresFourIcon, TableIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent } from "storybook/test"

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

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const week = canvas.getByRole("button", { name: "Week" })
    const month = canvas.getByRole("button", { name: "Month" })

    await step("starts with the default segment pressed", async () => {
      await expect(canvas.getByRole("group", { name: "Period" })).toBeVisible()
      await expect(week).toHaveAttribute("aria-pressed", "true")
    })

    await step("moves the selection to a clicked segment", async () => {
      await userEvent.click(month)
      await expect(month).toHaveAttribute("aria-pressed", "true")
      await expect(week).toHaveAttribute("aria-pressed", "false")
    })

    await step(
      "keeps the selection when the pressed segment is clicked",
      async () => {
        await userEvent.click(month)
        await expect(month).toHaveAttribute("aria-pressed", "true")
      }
    )
  },
}

export const WithoutValue: Story = {
  args: { defaultValue: undefined },
  play: async ({ canvas, step }) => {
    await step("starts with nothing pressed and selects on click", async () => {
      for (const button of canvas.getAllByRole("button")) {
        await expect(button).toHaveAttribute("aria-pressed", "false")
      }
      const day = canvas.getByRole("button", { name: "Day" })
      await userEvent.click(day)
      await expect(day).toHaveAttribute("aria-pressed", "true")
    })
  },
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
  play: async ({ canvas, step }) => {
    await step("selects icon-only segments by their labels", async () => {
      await expect(
        canvas.getByRole("button", { name: "Grid" })
      ).toHaveAttribute("aria-pressed", "true")
      const table = canvas.getByRole("button", { name: "Table" })
      await userEvent.click(table)
      await expect(table).toHaveAttribute("aria-pressed", "true")
    })
  },
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
  play: async ({ canvas, step }) => {
    await step("ignores the disabled segment", async () => {
      const year = canvas.getByRole("button", { name: "Year" })
      await expect(year).toBeDisabled()
      await userEvent.click(year, { pointerEventsCheck: 0 })
      await expect(year).toHaveAttribute("aria-pressed", "false")
      await expect(
        canvas.getByRole("button", { name: "Week" })
      ).toHaveAttribute("aria-pressed", "true")
    })
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, step }) => {
    await step("disables every segment", async () => {
      for (const button of canvas.getAllByRole("button")) {
        await expect(button).toBeDisabled()
      }
    })
  },
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
  play: async ({ canvas, step }) => {
    await step("starts with the controlled value", async () => {
      await expect(
        canvas.getByRole("button", { name: "Month" })
      ).toHaveAttribute("aria-pressed", "true")
      await expect(canvas.getByText("Selected: month")).toBeVisible()
    })

    await step("reports a new choice to the owner", async () => {
      const year = canvas.getByRole("button", { name: "Year" })
      await userEvent.click(year)
      await expect(canvas.getByText("Selected: year")).toBeVisible()
      await expect(year).toHaveAttribute("aria-pressed", "true")
    })
  },
}
