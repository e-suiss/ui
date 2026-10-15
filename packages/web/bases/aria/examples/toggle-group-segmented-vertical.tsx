import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupSegmentedVertical() {
  return (
    <ToggleGroup
      spacing={0}
      orientation="vertical"
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
