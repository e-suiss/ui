import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupSegmentedSizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      <ToggleGroup
        spacing={0}
        orientation="horizontal"
        multiple={false}
        size="sm"
        defaultValue={["week"]}
        aria-label="Calendar view, sm"
      >
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        spacing={0}
        orientation="horizontal"
        multiple={false}
        size="default"
        defaultValue={["week"]}
        aria-label="Calendar view, default"
      >
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        spacing={0}
        orientation="horizontal"
        multiple={false}
        size="lg"
        defaultValue={["week"]}
        aria-label="Calendar view, lg"
      >
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
