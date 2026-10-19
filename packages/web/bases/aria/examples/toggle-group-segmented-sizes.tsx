import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupSegmentedSizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      <ToggleGroup
        spacing={0}
        orientation="horizontal"
        selectionMode="single"
        size="sm"
        defaultSelectedKeys={["week"]}
        aria-label="Calendar view, sm"
      >
        <ToggleGroupItem id="day">Day</ToggleGroupItem>
        <ToggleGroupItem id="week">Week</ToggleGroupItem>
        <ToggleGroupItem id="month">Month</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        spacing={0}
        orientation="horizontal"
        selectionMode="single"
        size="default"
        defaultSelectedKeys={["week"]}
        aria-label="Calendar view, default"
      >
        <ToggleGroupItem id="day">Day</ToggleGroupItem>
        <ToggleGroupItem id="week">Week</ToggleGroupItem>
        <ToggleGroupItem id="month">Month</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        spacing={0}
        orientation="horizontal"
        selectionMode="single"
        size="lg"
        defaultSelectedKeys={["week"]}
        aria-label="Calendar view, lg"
      >
        <ToggleGroupItem id="day">Day</ToggleGroupItem>
        <ToggleGroupItem id="week">Week</ToggleGroupItem>
        <ToggleGroupItem id="month">Month</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
