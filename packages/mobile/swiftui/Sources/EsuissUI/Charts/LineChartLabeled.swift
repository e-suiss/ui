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

public struct LineChartLabeled: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Labeled", description: "Every point shows its value")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator { progress in
            Chart {
              ForEach(chartData.indices, id: \.self) { index in
                LineMark(x: .value("Month", index), y: .value("Desktop", chartData[index].desktop))
                  .interpolationMethod(.catmullRom)
                  .lineStyle(StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round))
                  .foregroundStyle(chartConfig.color("desktop"))
                PointMark(x: .value("Month", index), y: .value("Desktop", chartData[index].desktop))
                  .symbolSize(selection == index ? 100 : 64)
                  .foregroundStyle(chartConfig.color("desktop"))
                  .annotation(position: .top, spacing: 6) {
                    Text(chartData[index].desktop, format: .number)
                      .scaledFont(TextStyle.xs, weight: .semibold)
                      .foregroundStyle(EsuissColor.foreground)
                      .opacity(progress < 1 ? 0 : 1)
                  }
              }
              .chartReveal(progress, x: 0...(chartData.count - 1))
            }
            .chartXScale(domain: 0...(chartData.count - 1), range: .plotDimension(padding: 16))
            .chartYScale(range: .plotDimension(endPadding: 24))
            .chartXAxis { ChartAxis.x(values: Array(chartData.indices)) { String(chartData[$0].month.prefix(3)) } }
            .chartYAxis(.hidden)
            .chartTooltip(
              x: Array(chartData.indices),
              labels: chartData.map(\.month),
              selection: $selection,
              accessibilityLabel: "Labeled",
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
