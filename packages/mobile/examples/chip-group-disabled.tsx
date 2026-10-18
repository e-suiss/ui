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

export default function ChipGroupDisabled() {
  return (
    <ChipGroup disabled defaultValue={["coffee"]}>
      {categories.slice(1, 4).map((category) => (
        <Chip key={category.value} value={category.value}>
          {category.label}
        </Chip>
      ))}
    </ChipGroup>
  )
}
