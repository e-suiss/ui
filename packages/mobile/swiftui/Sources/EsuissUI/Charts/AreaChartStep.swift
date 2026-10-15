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
]

public struct AreaChartStep: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Step", description: "Each value holds until the next reading")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator { progress in
            Chart {
              ForEach(chartData.indices, id: \.self) { index in
                AreaMark(x: .value("Month", index), y: .value("Desktop", chartData[index].desktop))
                  .interpolationMethod(.stepCenter)
                  .foregroundStyle(chartConfig.color("desktop").opacity(0.18))
                LineMark(x: .value("Month", index), y: .value("Desktop", chartData[index].desktop))
                  .interpolationMethod(.stepCenter)
                  .lineStyle(StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))
                  .foregroundStyle(chartConfig.color("desktop"))
              }
              .chartReveal(progress, x: 0...(chartData.count - 1))
              if let selection {
                PointMark(x: .value("Month", selection), y: .value("Desktop", chartData[selection].desktop))
                  .symbolSize(64)
                  .foregroundStyle(chartConfig.color("desktop"))
              }
            }
            .chartXScale(domain: 0...(chartData.count - 1), range: .plotDimension(padding: 12))
            .chartXAxis { ChartAxis.x(values: Array(chartData.indices)) { String(chartData[$0].month.prefix(3)) } }
            .chartYAxis { ChartAxis.grid() }
            .chartTooltip(
              x: Array(chartData.indices),
              labels: chartData.map(\.month),
              selection: $selection,
              accessibilityLabel: "Step",
              items: { [ChartTooltipItem("desktop", value: chartData[$0].desktop)] }
            ) { payload in
              ChartTooltipContent(payload, indicator: .line)
            }
          }
        }
        .frame(height: 192)
      }
    }
  }
}
