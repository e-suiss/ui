import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupSegmented() {
  return (
    <ToggleGroup
      spacing={0}
      orientation="horizontal"
      selectionMode="single"
      defaultSelectedKeys={["week"]}
      aria-label="Calendar view"
    >
      <ToggleGroupItem id="day">Day</ToggleGroupItem>
      <ToggleGroupItem id="week">Week</ToggleGroupItem>
      <ToggleGroupItem id="month">Month</ToggleGroupItem>
      <ToggleGroupItem id="year">Year</ToggleGroupItem>
    </ToggleGroup>
  )
}
