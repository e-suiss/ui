import Charts
import SwiftUI

private let chartData: [(device: String, users: Double)] = [
  ("phone", 275), ("laptop", 200), ("tablet", 187), ("watch", 173), ("other", 90),
]

private let chartConfig: ChartConfig = [
  "users": .init("Users"),
  "phone": .init("Phone", color: EsuissColor.chart1),
  "laptop": .init("Laptop", color: EsuissColor.chart2),
  "tablet": .init("Tablet", color: EsuissColor.chart3),
  "watch": .init("Watch", color: EsuissColor.chart4),
  "other": .init("Other", color: EsuissColor.chart5),
]

public struct BarChartHorizontal: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Horizontal", description: "Room for long category names")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator(animationDuration: 400) { progress in
            Chart {
              ForEach(chartData.indices, id: \.self) { index in
                BarMark(x: .value("Users", chartData[index].users * progress), y: .value("Device", chartData[index].device), height: .fixed(18))
                  .clipShape(RoundedRectangle(cornerRadius: 5, style: .continuous))
                  .foregroundStyle(chartConfig.color(chartData[index].device))
                ChartAnchorMark(x: .value("Users", chartData[index].users), y: .value("Device", chartData[index].device))
              }
            }
            .chartXScale(range: .plotDimension(endPadding: 8))
            .chartXAxis(.hidden)
            .chartYAxis { ChartAxis.y(values: chartData.map(\.device), edge: .leading, grid: false) { chartConfig.label($0) } }
            .chartTooltip(
              y: chartData.map(\.device),
              labels: chartData.map { chartConfig.label($0.device) },
              selection: $selection,
              accessibilityLabel: "Horizontal",
              items: { [ChartTooltipItem(chartData[$0].device, value: chartData[$0].users)] }
            ) { payload in
              ChartTooltipContent(payload, hideLabel: true)
            }
          }
        }
        .frame(height: 192)
      }
    }
  }
}
