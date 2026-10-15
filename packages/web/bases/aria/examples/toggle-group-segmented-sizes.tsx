import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupSegmentedSizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <ToggleGroup
          key={size}
          spacing={0}
          orientation="horizontal"
          selectionMode="single"
          size={size}
          defaultSelectedKeys={["week"]}
          aria-label={`Calendar view, ${size}`}
        >
          <ToggleGroupItem id="day">Day</ToggleGroupItem>
          <ToggleGroupItem id="week">Week</ToggleGroupItem>
          <ToggleGroupItem id="month">Month</ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  )
}
