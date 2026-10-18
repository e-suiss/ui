import * as React from "react"
import { View } from "react-native"
import { Chip, ChipGroup } from "@/components/ui/chip"
import { Text } from "@/components/ui/text"

const categories = [
  { value: "all", label: "All" },
  { value: "coffee", label: "Coffee" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "bakery", label: "Bakery" },
  { value: "bars", label: "Bars" },
  { value: "desserts", label: "Desserts" },
]

function SingleGroupDemo() {
  const [value, setValue] = React.useState(["all"])
  return (
    <View className="gap-3">
      <ChipGroup value={value} onValueChange={setValue}>
        {categories.slice(0, 4).map((category) => (
          <Chip key={category.value} value={category.value}>
            {category.label}
          </Chip>
        ))}
      </ChipGroup>
      <Text variant="muted">Selected: {value.join(", ") || "none"}</Text>
    </View>
  )
}

export default function ChipGroupSingle() {
  return <SingleGroupDemo />
}
