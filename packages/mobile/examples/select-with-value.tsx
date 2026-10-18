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

function SelectDemo({
  initial,
  size,
  disabled = false,
  invalid = false,
  labelledBy,
  defaultOpen,
}: {
  initial?: Option
  size?: "default" | "sm"
  disabled?: boolean
  invalid?: boolean
  labelledBy?: string
  defaultOpen?: boolean
}) {
  const [value, setValue] = React.useState<string | null>(
    initial?.value ?? null
  )
  return (
    <Select
      items={fruits}
      value={value}
      onValueChange={setValue}
      disabled={disabled}
      defaultOpen={defaultOpen}
    >
      <SelectTrigger
        size={size}
        accessibilityLabelledBy={labelledBy}
        invalid={invalid}
        className="w-48"
      >
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent className="w-48">
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {fruits.map((fruit) => (
            <SelectItem
              key={fruit.value}
              value={fruit.value}
              label={fruit.label}
            />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default function SelectWithValue() {
  return <SelectDemo initial={fruits[2]} />
}
