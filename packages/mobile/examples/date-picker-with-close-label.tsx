import { DatePicker } from "@/components/patterns/date-picker"

export default function DatePickerWithCloseLabel() {
  return (
    <DatePicker accessibilityLabel="Date" showCloseButton closeLabel="Done" />
  )
}
