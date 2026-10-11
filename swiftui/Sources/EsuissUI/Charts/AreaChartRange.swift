import Charts
import SwiftUI

private let readings: [(low: Double, high: Double, average: Double)] = [
  (48, 62, 54), (46, 60, 52), (47, 64, 54), (45, 61, 52), (48, 63, 55), (46, 66, 54),
  (56, 78, 64), (58, 82, 66), (64, 88, 74), (66, 90, 76), (64, 92, 74), (66, 89, 75),
  (65, 94, 76), (66, 90, 75), (64, 88, 74), (65, 91, 76), (66, 92, 75), (68, 96, 78),
  (104, 158, 126), (102, 150, 122), (70, 94, 78), (66, 90, 74), (60, 82, 68), (52, 70, 58),
]

private let hours = readings.indices.map { "\($0):00" }

private let chartConfig: ChartConfig = [
  "range": .init("Range", color: .red),
  "average": .init("Average", color: .red),
]

private let low = Int(readings.map(\.low).min() ?? 0)
private let high = Int(readings.map(\.high).max() ?? 0)

public struct AreaChartRange: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      VStack(alignment: .leading, spacing: 2) {
        Text("Heart rate")
          .textStyle(.sm, weight: .semibold)
          .foregroundStyle(Color.danger)
        HStack(alignment: .firstTextBaseline, spacing: 4) {
          Text(verbatim: "\(low)–\(high)")
            .textStyle(.xl3, weight: .semibold)
            .monospacedDigit()
          Text("BPM")
            .textStyle(.base, weight: .semibold)
            .foregroundStyle(Color.labelSecondary)
        }
        Text("Today")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
      .padding(.horizontal, 16)
      CardContent {
        ChartContainer(config: chartConfig) {
          Chart {
            ForEach(readings.indices, id: \.self) { index in
              AreaMark(x: .value("Hour", index), yStart: .value("Low", readings[index].low), yEnd: .value("High", readings[index].high))
                .interpolationMethod(.monotone)
                .foregroundStyle(chartConfig.color("range").opacity(0.22))
              LineMark(x: .value("Hour", index), y: .value("Average", readings[index].average))
                .interpolationMethod(.monotone)
                .lineStyle(StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))
                .foregroundStyle(chartConfig.color("average"))
            }
            if let selection {
              PointMark(x: .value("Hour", selection), y: .value("Average", readings[selection].average))
                .symbolSize(64)
                .foregroundStyle(chartConfig.color("average"))
            }
          }
          .chartXScale(domain: 0...(readings.count - 1), range: .plotDimension(padding: 16))
          .chartYScale(domain: 40...170)
          .chartXAxis { ChartAxis.x(values: [0, 6, 12, 18]) { hours[$0] } }
          .chartYAxis { ChartAxis.y(values: [50.0, 100, 150]) { "\(Int($0))" } }
          .chartTooltip(
            x: Array(readings.indices),
            labels: hours,
            selection: $selection,
            accessibilityLabel: "Heart rate",
            items: { index in
              [
                ChartTooltipItem("range", value: readings[index].high),
                ChartTooltipItem("average", value: readings[index].average),
              ]
            }
          ) { payload in
            ChartTooltipContent(payload, indicator: .line) { item in
              Text(LocalizedStringKey(chartConfig.label(item.key)))
                .foregroundStyle(Color.labelSecondary)
              Spacer(minLength: 12)
              Text(verbatim: item.key == "range"
                ? "\(Int(readings[payload.index].low))–\(Int(readings[payload.index].high)) BPM"
                : "\(Int(item.value)) BPM")
                .font(TextStyle.xs.font(weight: .semibold))
                .monospacedDigit()
            }
          }
        }
        .frame(height: 160)
      }
    }
  }
}
