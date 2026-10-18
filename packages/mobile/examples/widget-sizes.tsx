import { ScrollView } from "react-native"
import {
  Widget,
  WidgetFooter,
  WidgetHeader,
  type WidgetSize,
  WidgetTitle,
} from "@/components/ui/widget"

const gridSpans: Record<WidgetSize, string> = {
  small: "1 × 1",
  medium: "2 × 1",
  large: "2 × 2",
  "extra-large": "4 × 2",
}

export default function WidgetSizes() {
  return (
    <ScrollView
      horizontal
      contentContainerClassName="items-start gap-4"
      showsHorizontalScrollIndicator={false}
    >
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
    </ScrollView>
  )
}
