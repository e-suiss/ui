import * as React from "react"
import {
  type Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fruits: Option[] = [
  { value: "mango", label: "Mango" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const vegetables: Option[] = [
  { value: "carrot", label: "Carrot" },
  { value: "broccoli", label: "Broccoli" },
  { value: "spinach", label: "Spinach" },
]

function GroupedDemo() {
  const [value, setValue] = React.useState<string | null>(null)
  return (
    <Select
      items={[...fruits.slice(0, 3), ...vegetables]}
      value={value}
      onValueChange={setValue}
    >
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select produce" />
      </SelectTrigger>
      <SelectContent className="w-56">
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {fruits.slice(0, 3).map((fruit) => (
            <SelectItem
              key={fruit.value}
              value={fruit.value}
              label={fruit.label}
            />
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          {vegetables.map((vegetable) => (
            <SelectItem
              key={vegetable.value}
              value={vegetable.value}
              label={vegetable.label}
            />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default function SelectGrouped() {
  return <GroupedDemo />
}
