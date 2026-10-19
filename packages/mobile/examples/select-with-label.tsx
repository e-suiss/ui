import * as React from "react"
import { View } from "react-native"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Text } from "@/components/ui/text"

const fruits = [
  { value: "mango", label: "Mango" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

export default function SelectWithLabel() {
  const [value, setValue] = React.useState<string | null>(null)
  return (
    <View className="gap-2">
      <Label nativeID="select-fruit">Favorite fruit</Label>
      <Select items={fruits} value={value} onValueChange={setValue}>
        <SelectTrigger accessibilityLabelledBy="select-fruit" className="w-48">
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
      <Text className="text-sm text-muted-foreground">
        Used to personalize your recommendations.
      </Text>
    </View>
  )
}
