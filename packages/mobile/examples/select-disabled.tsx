import * as React from "react"
import {
  type Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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

export default function SelectDisabled() {
  const [value, setValue] = React.useState<string | null>("mango")
  return (
    <Select items={fruits} value={value} onValueChange={setValue} disabled>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent className="w-48">
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="mango" label="Mango" />
          <SelectItem value="banana" label="Banana" />
          <SelectItem value="blueberry" label="Blueberry" />
          <SelectItem value="grapes" label="Grapes" />
          <SelectItem value="pineapple" label="Pineapple" />
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
