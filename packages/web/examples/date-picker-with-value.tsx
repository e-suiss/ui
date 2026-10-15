import { DatePicker } from "@/components/patterns/date-picker"

export default function DatePickerWithValue() {
  return (
    <DatePicker
      aria-label="Date"
      className="w-60"
      defaultValue={new Date(2026, 9, 4)}
    />
  )
}
