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

export default function PickerSizes() {
  return (
    <div className="flex items-center gap-3">
      <Picker
        placeholder="Select a fruit"
        aria-label="Fruit"
        className="w-48"
        size="sm"
      >
        {fruitItems}
      </Picker>
      <Picker placeholder="Select a fruit" aria-label="Fruit" className="w-48">
        {fruitItems}
      </Picker>
    </div>
  )
}
