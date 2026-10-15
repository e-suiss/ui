import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import { Text } from "@/components/ui/text"
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
      <View className="w-80 rounded-2xl border border-foreground/5 bg-card p-4 shadow-md dark:border-foreground/10">
        <Story />
      </View>
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
  render: () => (
    <WheelPicker>
      <WheelPickerColumn accessibilityLabel="Fruit" defaultValue="Lemon">
        {fruits.map((fruit) => (
          <WheelPickerItem key={fruit} value={fruit}>
            {fruit}
          </WheelPickerItem>
        ))}
      </WheelPickerColumn>
    </WheelPicker>
  ),
}

const slots = Array.from({ length: 11 }, (_, index) => {
  const minutes = 18 * 60 + index * 30
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`
})

const booked = new Set(["19:30", "20:00", "20:30"])

export const DisabledItems: Story = {
  render: () => (
    <WheelPicker>
      <WheelPickerColumn
        accessibilityLabel="Reservation time"
        defaultValue="19:00"
      >
        {slots.map((slot) => (
          <WheelPickerItem key={slot} value={slot} disabled={booked.has(slot)}>
            {slot}
          </WheelPickerItem>
        ))}
      </WheelPickerColumn>
    </WheelPicker>
  ),
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

function DateTimeExample() {
  const [day, setDay] = React.useState(toDayValue(today))
  const [hour, setHour] = React.useState("19")
  const [minute, setMinute] = React.useState("30")

  return (
    <View className="gap-3">
      <WheelPicker>
        <WheelPickerColumn
          accessibilityLabel="Day"
          value={day}
          onValueChange={setDay}
          className="grow-[1.6]"
        >
          {days.map(({ value, label }) => (
            <WheelPickerItem key={value} value={value} className="justify-end">
              {label}
            </WheelPickerItem>
          ))}
        </WheelPickerColumn>
        <WheelPickerColumn
          accessibilityLabel="Hour"
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
          accessibilityLabel="Minute"
          value={minute}
          onValueChange={setMinute}
          className="grow"
        >
          {minutes.map((value) => (
            <WheelPickerItem
              key={value}
              value={value}
              className="justify-start"
            >
              {value}
            </WheelPickerItem>
          ))}
        </WheelPickerColumn>
      </WheelPicker>
      <Text className="text-center text-sm text-muted-foreground tabular-nums">
        {day} {hour}:{minute}
      </Text>
    </View>
  )
}

export const DateTime: Story = {
  render: () => <DateTimeExample />,
}
