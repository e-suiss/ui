import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import { DatePicker } from "@/components/patterns/date-picker"

const meta = {
  title: "Patterns/Date Picker",
  component: DatePicker,
  args: {
    "aria-label": "Date",
    className: "w-60",
  },
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: new Date(2026, 9, 4) },
}

export const Locale: Story = {
  args: {
    locale: "tr-TR",
    placeholder: "Tarih seç",
    defaultValue: new Date(2026, 9, 4),
  },
}

export const YearRange: Story = {
  args: {
    placeholder: "Date of birth",
    fromYear: 1940,
    toYear: 2010,
    defaultValue: new Date(1990, 5, 15),
  },
}

export const WithTitle: Story = {
  args: { title: "Delivery date" },
}

export const WithCloseButton: Story = {
  args: { showCloseButton: true },
}

export const WithCloseLabel: Story = {
  args: { showCloseButton: true, closeLabel: "Done" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { "aria-invalid": true },
}

function ControlledExample(args: React.ComponentProps<typeof DatePicker>) {
  const [value, setValue] = React.useState<Date | null>(new Date(2026, 9, 4))

  return (
    <div className="flex flex-col items-start gap-2">
      <DatePicker {...args} value={value} onValueChange={setValue} />
      <p className="text-sm text-label-secondary">
        Selected: {value ? value.toDateString() : "none"}
      </p>
    </div>
  )
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
}

export const Floating: Story = {
  args: { floating: true },
}
