import Charts
import SwiftUI

private let chartData: [(month: String, desktop: Double, mobile: Double)] = [
  ("January", 186, 80),
  ("February", 305, 200),
  ("March", 237, 120),
  ("April", 173, 190),
  ("May", 209, 130),
  ("June", 264, 140),
]

private let chartConfig: ChartConfig = [
  "desktop": .init("Desktop", color: EsuissColor.chart1),
  "mobile": .init("Mobile", color: EsuissColor.chart2),
]

public struct BarChartStacked: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Stacked", description: "With a legend")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator(animationDuration: 400) { progress in
            Chart {
              ForEach(chartData.indices, id: \.self) { index in
                let item = chartData[index]
                BarMark(x: .value("Month", item.month), yStart: .value("Start", 0), yEnd: .value("Desktop", item.desktop * progress), width: .fixed(36))
                  .clipShape(UnevenRoundedRectangle(bottomLeadingRadius: 4, bottomTrailingRadius: 4, style: .continuous))
                  .foregroundStyle(chartConfig.color("desktop"))
                BarMark(x: .value("Month", item.month), yStart: .value("Start", item.desktop * progress), yEnd: .value("Mobile", (item.desktop + item.mobile) * progress), width: .fixed(36))
                  .clipShape(UnevenRoundedRectangle(topLeadingRadius: 4, topTrailingRadius: 4, style: .continuous))
                  .foregroundStyle(chartConfig.color("mobile"))
                ChartAnchorMark(x: .value("Month", item.month), y: .value("Mobile", item.desktop + item.mobile))
              }
            }
            .chartXAxis { ChartAxis.x(values: chartData.map(\.month)) { String($0.prefix(3)) } }
            .chartYAxis { ChartAxis.grid() }
            .chartTooltip(
              x: chartData.map(\.month),
              selection: $selection,
              cursor: false,
              accessibilityLabel: "Stacked",
              items: { index in
                [
                  ChartTooltipItem("desktop", value: chartData[index].desktop),
                  ChartTooltipItem("mobile", value: chartData[index].mobile),
                ]
              }
            ) { payload in
              ChartTooltipContent(payload, hideLabel: true)
            }
          }
          ChartLegendContent()
        }
        .frame(height: 224)
      }
    }
  }
}
