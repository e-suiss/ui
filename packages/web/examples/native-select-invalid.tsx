import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export default function NativeSelectInvalid() {
  return (
    <NativeSelect defaultValue="" aria-invalid aria-label="Fruit">
      <NativeSelectOption value="" disabled>
        Select a fruit
      </NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
      <NativeSelectOption value="grape">Grape</NativeSelectOption>
    </NativeSelect>
  )
}
