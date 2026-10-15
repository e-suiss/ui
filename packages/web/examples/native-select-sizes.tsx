import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export default function NativeSelectSizes() {
  return (
    <div className="flex items-center gap-3">
      <NativeSelect defaultValue="weekly" size="sm" aria-label="Frequency">
        <NativeSelectOption value="daily">Daily</NativeSelectOption>
        <NativeSelectOption value="weekly">Weekly</NativeSelectOption>
        <NativeSelectOption value="monthly">Monthly</NativeSelectOption>
      </NativeSelect>
      <NativeSelect defaultValue="weekly" size="default" aria-label="Frequency">
        <NativeSelectOption value="daily">Daily</NativeSelectOption>
        <NativeSelectOption value="weekly">Weekly</NativeSelectOption>
        <NativeSelectOption value="monthly">Monthly</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
