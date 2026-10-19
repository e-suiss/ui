import * as React from "react"
import { View } from "react-native"
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
import { Text } from "@/components/ui/text"

const fruits: Option[] = [
  { value: "mango", label: "Mango" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

export default function SelectInvalid() {
  const [value, setValue] = React.useState<string | null>(null)
  return (
    <View className="gap-2">
      <Select items={fruits} value={value} onValueChange={setValue}>
        <SelectTrigger invalid className="w-48">
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
      <Text className="text-sm text-destructive">Please select a fruit.</Text>
    </View>
  )
}
