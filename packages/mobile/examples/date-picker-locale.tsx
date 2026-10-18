import { DatePicker } from "@/components/patterns/date-picker"

export default function DatePickerLocale() {
  return (
    <DatePicker
      accessibilityLabel="Date"
      locale="tr-TR"
      placeholder="Tarih seç"
      defaultValue={new Date(2026, 9, 4)}
    />
  )
}
