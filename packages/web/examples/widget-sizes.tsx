import {
  Widget,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from "@/components/ui/widget"

export default function WidgetSizes() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <Widget size="small">
        <WidgetHeader>
          <WidgetTitle className="capitalize">small</WidgetTitle>
        </WidgetHeader>
        <WidgetFooter>1 × 1</WidgetFooter>
      </Widget>
      <Widget size="medium">
        <WidgetHeader>
          <WidgetTitle className="capitalize">medium</WidgetTitle>
        </WidgetHeader>
        <WidgetFooter>2 × 1</WidgetFooter>
      </Widget>
      <Widget size="large">
        <WidgetHeader>
          <WidgetTitle className="capitalize">large</WidgetTitle>
        </WidgetHeader>
        <WidgetFooter>2 × 2</WidgetFooter>
      </Widget>
      <Widget size="extra-large">
        <WidgetHeader>
          <WidgetTitle className="capitalize">extra large</WidgetTitle>
        </WidgetHeader>
        <WidgetFooter>4 × 2</WidgetFooter>
      </Widget>
    </div>
  )
}
