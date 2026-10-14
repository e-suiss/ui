import Charts
import SwiftUI

private let goal = 7.0

private let chartData: [(day: String, hours: Double)] = [
  ("Mon", 6.8), ("Tue", 7.4), ("Wed", 5.9), ("Thu", 7.9), ("Fri", 6.4), ("Sat", 8.6), ("Sun", 7.2),
]

private let chartConfig: ChartConfig = [
  "hours": .init("Sleep", color: .indigo),
]

private func formatHours(_ hours: Double) -> String {
  let minutes = Int((hours * 60).rounded())
  return "\(minutes / 60)h \(minutes % 60)m"
}

public struct LineChartGoalDots: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      VStack(alignment: .leading, spacing: 2) {
        Text("Sleep")
          .textStyle(.sm, weight: .semibold)
          .foregroundStyle(chartConfig.color("hours"))
        Text(verbatim: "7h 9m")
          .textStyle(.xl3, weight: .semibold)
          .monospacedDigit()
        Text("Goal 7 hours · green nights met it")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
      .padding(.horizontal, 16)
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator { progress in
            Chart {
              RuleMark(y: .value("Goal", goal))
                .lineStyle(StrokeStyle(lineWidth: 1, dash: [3, 3]))
                .foregroundStyle(Color.green)
              ForEach(chartData.indices, id: \.self) { index in
                LineMark(x: .value("Day", index), y: .value("Hours", chartData[index].hours))
                  .interpolationMethod(.monotone)
                  .lineStyle(StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))
                  .foregroundStyle(chartConfig.color("hours"))
              }
              .chartReveal(progress, x: 0...(chartData.count - 1))
              ForEach(chartData.indices, id: \.self) { index in
                PointMark(x: .value("Day", index), y: .value("Hours", chartData[index].hours))
                  .symbol {
                    Circle()
                      .fill(chartData[index].hours >= goal ? Color.green : .orange)
                      .stroke(Color.surfaceSecondary, lineWidth: 2)
                      .frame(width: selection == index ? 13 : 11, height: selection == index ? 13 : 11)
                  }
              }
              .chartReveal(progress, x: 0...(chartData.count - 1))
            }
            .chartXScale(domain: 0...(chartData.count - 1), range: .plotDimension(padding: 16))
            .chartYScale(domain: 5...9)
            .chartXAxis { ChartAxis.x(values: Array(chartData.indices)) { chartData[$0].day } }
            .chartYAxis { ChartAxis.y(values: [5.0, 7, 9]) { "\($0.formatted())h" } }
            .chartTooltip(
              x: Array(chartData.indices),
              labels: chartData.map(\.day),
              selection: $selection,
              accessibilityLabel: "Sleep",
              items: { [ChartTooltipItem("hours", value: chartData[$0].hours)] }
            ) { payload in
              ChartTooltipContent(payload, hideIndicator: true) { item in
                Text(verbatim: formatHours(item.value))
                  .font(TextStyle.xs.font(weight: .semibold))
                  .monospacedDigit()
              }
            }
          }
        }
        .frame(height: 160)
      }
    }
  }
}
