import { DatePicker } from "@/components/patterns/date-picker"

export default function DatePickerYearRange() {
  return (
    <DatePicker
      aria-label="Date"
      className="w-60"
      placeholder="Date of birth"
      fromYear={1940}
      toYear={2010}
      defaultValue={new Date(1990, 5, 15)}
    />
  )
}
