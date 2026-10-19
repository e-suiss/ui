import { Picker, PickerItem } from "@/components/patterns/picker"

export default function PickerDisabled() {
  return (
    <Picker
      placeholder="Select a fruit"
      aria-label="Fruit"
      className="w-48"
      disabled
    >
      <PickerItem value="apple">Apple</PickerItem>
      <PickerItem value="banana">Banana</PickerItem>
      <PickerItem value="blueberry">Blueberry</PickerItem>
      <PickerItem value="grapes">Grapes</PickerItem>
      <PickerItem value="pineapple">Pineapple</PickerItem>
    </Picker>
  )
}
