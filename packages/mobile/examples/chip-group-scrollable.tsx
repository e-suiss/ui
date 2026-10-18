import { View } from "react-native"
import { Chip, ChipGroup } from "@/components/ui/chip"

const categories = [
  { value: "all", label: "All" },
  { value: "coffee", label: "Coffee" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "bakery", label: "Bakery" },
  { value: "bars", label: "Bars" },
  { value: "desserts", label: "Desserts" },
]

export default function ChipGroupScrollable() {
  return (
    <View className="-mx-4">
      <ChipGroup scrollable defaultValue={["all"]} className="px-4">
        {categories.map((category) => (
          <Chip key={category.value} value={category.value}>
            {category.label}
          </Chip>
        ))}
      </ChipGroup>
    </View>
  )
}
