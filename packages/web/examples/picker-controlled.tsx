import * as React from "react"
import { Picker, PickerItem } from "@/components/patterns/picker"

export default function PickerControlled() {
  const [value, setValue] = React.useState("grapes")

  return (
    <div className="flex flex-col items-start gap-2">
      <Picker
        placeholder="Select a fruit"
        aria-label="Fruit"
        className="w-48"
        value={value}
        onValueChange={setValue}
      >
        <PickerItem value="apple">Apple</PickerItem>
        <PickerItem value="banana">Banana</PickerItem>
        <PickerItem value="blueberry">Blueberry</PickerItem>
        <PickerItem value="grapes">Grapes</PickerItem>
        <PickerItem value="pineapple">Pineapple</PickerItem>
      </Picker>
      <p className="text-sm text-muted-foreground">Selected: {value}</p>
    </div>
  )
}
