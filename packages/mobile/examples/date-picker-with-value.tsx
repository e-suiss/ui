import { DatePicker } from "@/components/patterns/date-picker"

export default function DatePickerWithValue() {
  return (
    <DatePicker accessibilityLabel="Date" defaultValue={new Date(2026, 9, 4)} />
  )
}
