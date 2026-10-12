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

public struct BarChartDefault: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Bar chart", description: "Desktop visitors · January to June")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator(animationDuration: 400) { progress in
            Chart {
              ForEach(chartData.indices, id: \.self) { index in
                BarMark(x: .value("Month", chartData[index].month), y: .value("Desktop", chartData[index].desktop * progress), width: .fixed(36))
                  .clipShape(RoundedRectangle(cornerRadius: 6, style: .continuous))
                  .foregroundStyle(chartConfig.color("desktop"))
                ChartAnchorMark(x: .value("Month", chartData[index].month), y: .value("Desktop", chartData[index].desktop))
              }
            }
            .chartXAxis { ChartAxis.x(values: chartData.map(\.month)) { String($0.prefix(3)) } }
            .chartYAxis { ChartAxis.grid() }
            .chartTooltip(
              x: chartData.map(\.month),
              selection: $selection,
              cursor: false,
              accessibilityLabel: "Bar chart",
              items: { [ChartTooltipItem("desktop", value: chartData[$0].desktop)] }
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
