import Charts
import SwiftUI

private let goal = 10000.0

private let chartData: [(day: String, steps: Double)] = [
  ("Mon", 8412), ("Tue", 10230), ("Wed", 6120), ("Thu", 12480), ("Fri", 9050), ("Sat", 14320), ("Sun", 4870),
]

private let chartConfig: ChartConfig = [
  "steps": .init("Steps", color: EsuissColor.chart4),
]

public struct LineChartGoal: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Goal line", description: "A daily goal of 10,000 steps")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator { progress in
            Chart {
              RuleMark(y: .value("Goal", goal))
                .lineStyle(StrokeStyle(lineWidth: 1, dash: [4, 4]))
                .foregroundStyle(Palette.green500)
                .annotation(position: .top, alignment: .leading, spacing: 4) {
                  Text("Goal")
                    .scaledFont(TextStyle.xs, weight: .semibold)
                    .foregroundStyle(EsuissColor.mutedForeground)
                }
              ForEach(chartData.indices, id: \.self) { index in
                LineMark(x: .value("Day", index), y: .value("Steps", chartData[index].steps))
                  .interpolationMethod(.monotone)
                  .lineStyle(StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round))
                  .foregroundStyle(chartConfig.color("steps"))
                PointMark(x: .value("Day", index), y: .value("Steps", chartData[index].steps))
                  .symbolSize(selection == index ? 64 : 49)
                  .foregroundStyle(chartConfig.color("steps"))
              }
              .chartReveal(progress, x: 0...(chartData.count - 1))
            }
            .chartXScale(domain: 0...(chartData.count - 1), range: .plotDimension(padding: 12))
            .chartXAxis { ChartAxis.x(values: Array(chartData.indices)) { chartData[$0].day } }
            .chartYAxis { ChartAxis.y(count: 5) { "\(($0 / 1000).formatted())k" } }
            .chartTooltip(
              x: Array(chartData.indices),
              labels: chartData.map(\.day),
              selection: $selection,
              accessibilityLabel: "Goal line",
              items: { [ChartTooltipItem("steps", value: chartData[$0].steps)] }
            ) { payload in
              ChartTooltipContent(payload, hideIndicator: true) { item in
                Text("\(item.value, format: .number) steps")
                  .scaledFont(TextStyle.xs, weight: .semibold)
                  .monospacedDigit()
              }
            }
          }
        }
        .frame(height: 192)
      }
    }
  }
}
