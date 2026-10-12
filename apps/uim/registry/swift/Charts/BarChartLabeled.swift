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
  "desktop": .init("Desktop", color: .blue),
]

public struct BarChartLabeled: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Labeled", description: "The value sits above each bar")
      CardContent {
        ChartContainer(config: chartConfig) {
          Chart {
            ForEach(chartData.indices, id: \.self) { index in
              BarMark(x: .value("Month", chartData[index].month), y: .value("Desktop", chartData[index].desktop), width: .fixed(36))
                .clipShape(RoundedRectangle(cornerRadius: 6, style: .continuous))
                .foregroundStyle(chartConfig.color("desktop"))
                .annotation(position: .top, spacing: 8) {
                  Text(chartData[index].desktop, format: .number)
                    .font(TextStyle.xs2.font(weight: .semibold))
                    .foregroundStyle(Color.label)
                }
            }
          }
          .chartYScale(range: .plotDimension(endPadding: 22))
          .chartXAxis { ChartAxis.x(values: chartData.map(\.month)) { String($0.prefix(3)) } }
          .chartYAxis(.hidden)
          .chartTooltip(
            x: chartData.map(\.month),
            selection: $selection,
            cursor: false,
            accessibilityLabel: "Labeled",
            items: { [ChartTooltipItem("desktop", value: chartData[$0].desktop)] }
          ) { payload in
            ChartTooltipContent(payload, hideLabel: true)
          }
        }
        .frame(height: 192)
      }
    }
  }
}
