import * as React from "react"
import { Picker, PickerItem } from "@/components/patterns/picker"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const fruitItems = fruits.map((fruit) => (
  <PickerItem key={fruit.value} value={fruit.value}>
    {fruit.label}
  </PickerItem>
))

function ControlledExample(props: React.ComponentProps<typeof Picker>) {
  const [value, setValue] = React.useState("grapes")

  return (
    <div className="flex flex-col items-start gap-2">
      <Picker {...props} value={value} onValueChange={setValue}>
        {fruitItems}
      </Picker>
      <p className="text-sm text-muted-foreground">Selected: {value}</p>
    </div>
  )
}

export default function PickerControlled() {
  return (
    <ControlledExample
      placeholder="Select a fruit"
      aria-label="Fruit"
      className="w-48"
    />
  )
}
