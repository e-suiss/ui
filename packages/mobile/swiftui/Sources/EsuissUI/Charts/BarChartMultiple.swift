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

private func value(_ key: String, _ index: Int) -> Double {
  key == "desktop" ? chartData[index].desktop : chartData[index].mobile
}

public struct BarChartMultiple: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Multiple series", description: "Desktop and mobile side by side")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator(animationDuration: 400) { progress in
            Chart {
              ForEach(chartConfig.keys, id: \.self) { key in
                ForEach(chartData.indices, id: \.self) { index in
                  BarMark(x: .value("Month", chartData[index].month), y: .value("Visitors", value(key, index) * progress))
                    .position(by: .value("Series", key), span: .ratio(0.95))
                    .clipShape(RoundedRectangle(cornerRadius: 4, style: .continuous))
                    .foregroundStyle(chartConfig.color(key))
                  ChartAnchorMark(x: .value("Month", chartData[index].month), y: .value("Visitors", value(key, index)))
                }
              }
            }
            .chartXAxis { ChartAxis.x(values: chartData.map(\.month)) { String($0.prefix(3)) } }
            .chartYAxis { ChartAxis.grid() }
            .chartTooltip(
              x: chartData.map(\.month),
              selection: $selection,
              cursor: false,
              accessibilityLabel: "Multiple series",
              items: { index in chartConfig.keys.map { ChartTooltipItem($0, value: value($0, index)) } }
            ) { payload in
              ChartTooltipContent(payload, indicator: .dashed)
            }
          }
        }
        .frame(height: 192)
      }
    }
  }
}
