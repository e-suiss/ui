import {
  Widget,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from "@/components/ui/widget"

const gridSpans = {
  small: "1 × 1",
  medium: "2 × 1",
  large: "2 × 2",
  "extra-large": "4 × 2",
}

export default function WidgetSizes() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      {(["small", "medium", "large", "extra-large"] as const).map((size) => (
        <Widget key={size} size={size}>
          <WidgetHeader>
            <WidgetTitle className="capitalize">
              {size.replace("-", " ")}
            </WidgetTitle>
          </WidgetHeader>
          <WidgetFooter>{gridSpans[size]}</WidgetFooter>
        </Widget>
      ))}
    </div>
  )
}
