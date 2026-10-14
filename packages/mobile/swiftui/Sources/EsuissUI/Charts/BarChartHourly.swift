import Charts
import SwiftUI

private let minutes: [Double] = [
  4, 0, 0, 0, 0, 0, 6, 18, 27, 22, 19, 21, 30, 26, 23, 17, 22, 26, 31, 39, 42, 47, 35, 18,
]

private let hours = minutes.indices.map { "\($0)" }

private let chartConfig: ChartConfig = [
  "minutes": .init("Screen time", color: .blue),
]

private let total = Int(minutes.reduce(0, +))
private let average = minutes.reduce(0, +) / Double(minutes.count)

public struct BarChartHourly: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      VStack(alignment: .leading, spacing: 2) {
        Text("Screen time")
          .textStyle(.sm, weight: .semibold)
          .foregroundStyle(Color.link)
        Text(verbatim: "\(total / 60)h \(total % 60)m")
          .textStyle(.xl3, weight: .semibold)
          .monospacedDigit()
        Text("Today · hour by hour")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
      .padding(.horizontal, 16)
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator(animationDuration: 400) { progress in
            Chart {
              ForEach(minutes.indices, id: \.self) { hour in
                BarMark(x: .value("Hour", hours[hour]), y: .value("Minutes", minutes[hour] * progress), width: .fixed(8))
                  .clipShape(UnevenRoundedRectangle(topLeadingRadius: 3, topTrailingRadius: 3, style: .continuous))
                  .foregroundStyle(chartConfig.color("minutes"))
                ChartAnchorMark(x: .value("Hour", hours[hour]), y: .value("Minutes", minutes[hour]))
              }
              RuleMark(y: .value("Average", average))
                .lineStyle(StrokeStyle(lineWidth: 1, dash: [3, 3]))
                .foregroundStyle(Color.green)
            }
            .chartXAxis { ChartAxis.x(values: ["0", "6", "12", "18"]) { "\($0):00" } }
            .chartYAxis { ChartAxis.y(count: 3) { "\(Int($0)) min" } }
            .chartTooltip(
              x: hours,
              labels: hours.map { "\($0):00" },
              selection: $selection,
              cursor: false,
              accessibilityLabel: "Screen time",
              items: { [ChartTooltipItem("minutes", value: minutes[$0])] }
            ) { payload in
              ChartTooltipContent(payload, hideIndicator: true) { payload in
                Text(verbatim: payload.label)
              } formatter: { item in
                Text("\(Int(item.value)) min")
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
