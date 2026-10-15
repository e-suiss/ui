import { DatePicker } from "@/components/patterns/date-picker"

export default function DatePickerLocale() {
  return (
    <DatePicker
      aria-label="Date"
      className="w-60"
      locale="tr-TR"
      placeholder="Tarih seç"
      defaultValue={new Date(2026, 9, 4)}
    />
  )
}
