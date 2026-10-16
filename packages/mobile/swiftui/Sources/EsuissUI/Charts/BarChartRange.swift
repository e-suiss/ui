import Charts
import SwiftUI

private let chartData: [(day: String, low: Double, high: Double)] = [
  ("Today", 14, 22), ("Wed", 13, 21), ("Thu", 15, 24), ("Fri", 16, 25),
  ("Sat", 14, 20), ("Sun", 11, 17), ("Mon", 10, 16), ("Tue", 12, 19),
]

private let chartConfig: ChartConfig = [
  "range": .init("Temperature"),
]

private func high(_ day: String) -> String {
  chartData.first { $0.day == day }.map { "\(Int($0.high))°" } ?? ""
}

public struct BarChartRange: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("8-day forecast", description: "Each bar spans the low and high")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator(animationDuration: 400) { progress in
            Chart {
              ForEach(chartData.indices, id: \.self) { index in
                BarMark(xStart: .value("Low", 8), xEnd: .value("High", 27), y: .value("Day", chartData[index].day), height: .ratio(0.76))
                  .clipShape(Capsule())
                  .foregroundStyle(EsuissColor.secondary)
                BarMark(xStart: .value("Low", chartData[index].low), xEnd: .value("High", chartData[index].low + (chartData[index].high - chartData[index].low) * progress), y: .value("Day", chartData[index].day), height: .ratio(0.76))
                  .clipShape(Capsule())
                  .foregroundStyle(LinearGradient(colors: [Palette.teal500, Palette.yellow500, Palette.orange500], startPoint: .leading, endPoint: .trailing))
              }
            }
            .chartXScale(domain: 8...27)
            .chartXAxis(.hidden)
            .chartYAxis {
              ChartAxis.y(values: chartData.map(\.day), edge: .leading, grid: false, emphasized: true) { $0 }
              ChartAxis.y(values: chartData.map(\.day), edge: .trailing, grid: false, emphasized: true) { high($0) }
            }
            .chartTooltip(
              y: chartData.map(\.day),
              selection: $selection,
              accessibilityLabel: "8-day forecast",
              items: { [ChartTooltipItem("range", value: chartData[$0].high)] }
            ) { payload in
              ChartTooltipContent(payload, hideIndicator: true) { (_: ChartTooltipItem) in
                Text(verbatim: "\(Int(chartData[payload.index].low))° to \(Int(chartData[payload.index].high))°")
                  .scaledFont(TextStyle.xs, weight: .semibold)
                  .monospacedDigit()
              }
            }
          }
        }
        .frame(height: 240)
      }
    }
  }
}
