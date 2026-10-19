import { ScrollView } from "react-native"
import {
  Widget,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from "@/components/ui/widget"

export default function WidgetSizes() {
  return (
    <ScrollView
      horizontal
      contentContainerClassName="items-start gap-4"
      showsHorizontalScrollIndicator={false}
    >
      <Widget size="small">
        <WidgetHeader>
          <WidgetTitle>Small</WidgetTitle>
        </WidgetHeader>
        <WidgetFooter>1 × 1</WidgetFooter>
      </Widget>
      <Widget size="medium">
        <WidgetHeader>
          <WidgetTitle>Medium</WidgetTitle>
        </WidgetHeader>
        <WidgetFooter>2 × 1</WidgetFooter>
      </Widget>
      <Widget size="large">
        <WidgetHeader>
          <WidgetTitle>Large</WidgetTitle>
        </WidgetHeader>
        <WidgetFooter>2 × 2</WidgetFooter>
      </Widget>
      <Widget size="extra-large">
        <WidgetHeader>
          <WidgetTitle>Extra Large</WidgetTitle>
        </WidgetHeader>
        <WidgetFooter>4 × 2</WidgetFooter>
      </Widget>
    </ScrollView>
  )
}
