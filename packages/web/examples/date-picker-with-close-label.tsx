import { DatePicker } from "@/components/patterns/date-picker"

export default function DatePickerWithCloseLabel() {
  return (
    <DatePicker
      aria-label="Date"
      className="w-60"
      showCloseButton
      closeLabel="Done"
    />
  )
}
