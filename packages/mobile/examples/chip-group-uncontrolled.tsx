import { Chip, ChipGroup } from "@/components/ui/chip"

export default function ChipGroupUncontrolled() {
  return (
    <ChipGroup multiple defaultValue={["lunch"]} size="sm">
      <Chip value="coffee">Coffee</Chip>
      <Chip value="lunch">Lunch</Chip>
      <Chip value="dinner">Dinner</Chip>
      <Chip value="bakery">Bakery</Chip>
      <Chip value="bars">Bars</Chip>
      <Chip value="desserts">Desserts</Chip>
    </ChipGroup>
  )
}
