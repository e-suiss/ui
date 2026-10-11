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

public struct AreaChartAxes: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    let color = chartConfig.color("desktop")
    Card(.filled, size: .sm) {
      CardHeader("With axes", description: "A value axis on the right")
      CardContent {
        ChartContainer(config: chartConfig) {
          Chart {
            ForEach(chartData.indices, id: \.self) { index in
              AreaMark(x: .value("Month", index), y: .value("Desktop", chartData[index].desktop))
                .interpolationMethod(.monotone)
                .foregroundStyle(LinearGradient(colors: [color.opacity(0.38), color.opacity(0.02)], startPoint: .top, endPoint: .bottom))
              LineMark(x: .value("Month", index), y: .value("Desktop", chartData[index].desktop))
                .interpolationMethod(.monotone)
                .lineStyle(StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))
                .foregroundStyle(color)
              PointMark(x: .value("Month", index), y: .value("Desktop", chartData[index].desktop))
                .symbolSize(selection == index ? 64 : 36)
                .foregroundStyle(color)
            }
          }
          .chartXScale(domain: 0...(chartData.count - 1), range: .plotDimension(padding: 12))
          .chartXAxis { ChartAxis.x(values: Array(chartData.indices)) { String(chartData[$0].month.prefix(3)) } }
          .chartYAxis { ChartAxis.y(count: 4) { $0.formatted() } }
          .chartTooltip(
            x: Array(chartData.indices),
            labels: chartData.map(\.month),
            selection: $selection,
            accessibilityLabel: "With axes",
            items: { [ChartTooltipItem("desktop", value: chartData[$0].desktop)] }
          ) { payload in
            ChartTooltipContent(payload)
          }
        }
        .frame(height: 192)
      }
    }
  }
}
