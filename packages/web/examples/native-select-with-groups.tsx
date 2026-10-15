import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"

export default function NativeSelectWithGroups() {
  return (
    <NativeSelect defaultValue="berlin" aria-label="City">
      <NativeSelectOptGroup label="Europe">
        <NativeSelectOption value="berlin">Berlin</NativeSelectOption>
        <NativeSelectOption value="lisbon">Lisbon</NativeSelectOption>
        <NativeSelectOption value="zurich">Zurich</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Asia">
        <NativeSelectOption value="seoul">Seoul</NativeSelectOption>
        <NativeSelectOption value="singapore">Singapore</NativeSelectOption>
        <NativeSelectOption value="tokyo">Tokyo</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  )
}
