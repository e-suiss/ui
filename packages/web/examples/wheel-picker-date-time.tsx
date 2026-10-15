import * as React from "react"
import {
  WheelPicker,
  WheelPickerColumn,
  WheelPickerItem,
} from "@/components/ui/wheel-picker"

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

function DateTimeExample(props: React.ComponentProps<typeof WheelPicker>) {
  const [day, setDay] = React.useState(toDayValue(today))
  const [hour, setHour] = React.useState("19")
  const [minute, setMinute] = React.useState("30")

  return (
    <div className="flex flex-col gap-3">
      <WheelPicker {...props}>
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
      <p className="text-center text-sm text-muted-foreground tabular-nums">
        {day} {hour}:{minute}
      </p>
    </div>
  )
}

export default function WheelPickerDateTime() {
  return (
    <div className="w-80 rounded-2xl bg-card p-4 shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10">
      <DateTimeExample />
    </div>
  )
}
