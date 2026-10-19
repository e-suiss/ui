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
]

const vegetables: Option[] = [
  { value: "carrot", label: "Carrot" },
  { value: "broccoli", label: "Broccoli" },
  { value: "spinach", label: "Spinach" },
]

export default function SelectGrouped() {
  const [value, setValue] = React.useState<string | null>(null)
  return (
    <Select
      items={[...fruits, ...vegetables]}
      value={value}
      onValueChange={setValue}
    >
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select produce" />
      </SelectTrigger>
      <SelectContent className="w-56">
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="mango" label="Mango" />
          <SelectItem value="banana" label="Banana" />
          <SelectItem value="blueberry" label="Blueberry" />
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot" label="Carrot" />
          <SelectItem value="broccoli" label="Broccoli" />
          <SelectItem value="spinach" label="Spinach" />
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
