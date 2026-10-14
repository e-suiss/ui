// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent } from "storybook/test"

import {
  WheelPicker,
  WheelPickerColumn,
  WheelPickerItem,
} from "@/components/ui/wheel-picker"

const meta = {
  title: "Components/Wheel Picker",
  component: WheelPicker,
  decorators: [
    (Story) => (
      <div className="w-80 rounded-2xl bg-surface-raised p-4 shadow-md ring-1 ring-label/5 dark:ring-label/10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WheelPicker>

export default meta

type Story = StoryObj<typeof meta>

const fruits = [
  "Apple",
  "Banana",
  "Cherry",
  "Grape",
  "Lemon",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
  "Plum",
]

export const Default: Story = {
  render: (args) => (
    <WheelPicker {...args}>
      <WheelPickerColumn aria-label="Fruit" defaultValue="Lemon">
        {fruits.map((fruit) => (
          <WheelPickerItem key={fruit} value={fruit}>
            {fruit}
          </WheelPickerItem>
        ))}
      </WheelPickerColumn>
    </WheelPicker>
  ),
  play: async ({ canvas, step }) => {
    const column = canvas.getByRole("listbox", { name: "Fruit" })

    await step("selects the default value", async () => {
      await expect(
        canvas.getByRole("option", { name: "Lemon" })
      ).toHaveAttribute("aria-selected", "true")
    })

    await step("steps through the options with arrow keys", async () => {
      await userEvent.tab()
      await expect(column).toHaveFocus()
      await userEvent.keyboard("{ArrowDown}")
      const mango = canvas.getByRole("option", { name: "Mango" })
      await expect(mango).toHaveAttribute("aria-selected", "true")
      await expect(column).toHaveAttribute("aria-activedescendant", mango.id)
    })

    await step("jumps to the ends with Home and End", async () => {
      await userEvent.keyboard("{End}")
      await expect(
        canvas.getByRole("option", { name: "Plum" })
      ).toHaveAttribute("aria-selected", "true")
      await userEvent.keyboard("{Home}")
      await expect(
        canvas.getByRole("option", { name: "Apple" })
      ).toHaveAttribute("aria-selected", "true")
    })
  },
}

const slots = Array.from({ length: 11 }, (_, index) => {
  const minutes = 18 * 60 + index * 30
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`
})

const booked = new Set(["19:30", "20:00", "20:30"])

export const DisabledItems: Story = {
  render: (args) => (
    <WheelPicker {...args}>
      <WheelPickerColumn aria-label="Reservation time" defaultValue="19:00">
        {slots.map((slot) => (
          <WheelPickerItem key={slot} value={slot} disabled={booked.has(slot)}>
            {slot}
          </WheelPickerItem>
        ))}
      </WheelPickerColumn>
    </WheelPicker>
  ),
  play: async ({ canvas, step }) => {
    await step("skips the booked slots", async () => {
      await expect(
        canvas.getByRole("option", { name: "19:30" })
      ).toHaveAttribute("aria-disabled", "true")
      canvas.getByRole("listbox", { name: "Reservation time" }).focus()
      await userEvent.keyboard("{ArrowDown}")
      await expect(
        canvas.getByRole("option", { name: "21:00" })
      ).toHaveAttribute("aria-selected", "true")
    })

    await step("ignores clicks on a booked slot", async () => {
      await userEvent.click(canvas.getByRole("option", { name: "20:00" }))
      await expect(
        canvas.getByRole("option", { name: "20:00" })
      ).toHaveAttribute("aria-selected", "false")
    })
  },
}

function toDayValue(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

const today = new Date(2026, 9, 4)

const days = Array.from({ length: 15 }, (_, index) => {
  const date = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + index - 7
  )
  const label =
    index === 7
      ? "Today"
      : date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
  return { value: toDayValue(date), label }
})

const hours = Array.from({ length: 24 }, (_, hour) =>
  String(hour).padStart(2, "0")
)

const minutes = Array.from({ length: 12 }, (_, step) =>
  String(step * 5).padStart(2, "0")
)

function DateTimeExample(args: React.ComponentProps<typeof WheelPicker>) {
  const [day, setDay] = React.useState(toDayValue(today))
  const [hour, setHour] = React.useState("19")
  const [minute, setMinute] = React.useState("30")

  return (
    <div className="flex flex-col gap-3">
      <WheelPicker {...args}>
        <WheelPickerColumn
          aria-label="Day"
          value={day}
          onValueChange={setDay}
          className="flex-1 *:justify-end"
        >
          {days.map(({ value, label }) => (
            <WheelPickerItem key={value} value={value}>
              {label}
            </WheelPickerItem>
          ))}
        </WheelPickerColumn>
        <WheelPickerColumn
          aria-label="Hour"
          value={hour}
          onValueChange={setHour}
        >
          {hours.map((value) => (
            <WheelPickerItem key={value} value={value}>
              {value}
            </WheelPickerItem>
          ))}
        </WheelPickerColumn>
        <WheelPickerColumn
          aria-label="Minute"
          value={minute}
          onValueChange={setMinute}
          className="flex-1 *:justify-start"
        >
          {minutes.map((value) => (
            <WheelPickerItem key={value} value={value}>
              {value}
            </WheelPickerItem>
          ))}
        </WheelPickerColumn>
      </WheelPicker>
      <p className="text-center text-sm text-label-secondary tabular-nums">
        {day} {hour}:{minute}
      </p>
    </div>
  )
}

export const DateTime: Story = {
  render: (args) => <DateTimeExample {...args} />,
  play: async ({ canvas, step }) => {
    await step("names each column", async () => {
      await expect(canvas.getByRole("listbox", { name: "Day" })).toBeVisible()
      await expect(canvas.getByRole("listbox", { name: "Hour" })).toBeVisible()
      await expect(
        canvas.getByRole("listbox", { name: "Minute" })
      ).toBeVisible()
    })

    await step("updates the summary as columns change", async () => {
      await expect(canvas.getByText("2026-10-04 19:30")).toBeVisible()
      canvas.getByRole("listbox", { name: "Hour" }).focus()
      await userEvent.keyboard("{ArrowDown}")
      canvas.getByRole("listbox", { name: "Minute" }).focus()
      await userEvent.keyboard("{ArrowUp}")
      canvas.getByRole("listbox", { name: "Day" }).focus()
      await userEvent.keyboard("{ArrowUp}")
      await expect(canvas.getByText("2026-10-03 20:25")).toBeVisible()
    })
  },
}
