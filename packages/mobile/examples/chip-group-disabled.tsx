import { Chip, ChipGroup } from "@/components/ui/chip"

export default function ChipGroupDisabled() {
  return (
    <ChipGroup disabled defaultValue={["coffee"]}>
      <Chip value="coffee">Coffee</Chip>
      <Chip value="lunch">Lunch</Chip>
      <Chip value="dinner">Dinner</Chip>
    </ChipGroup>
  )
}
