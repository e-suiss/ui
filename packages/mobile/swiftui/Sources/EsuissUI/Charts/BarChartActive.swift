import Charts
import SwiftUI

private let chartData: [(day: String, steps: Double)] = [
  ("Monday", 8412), ("Tuesday", 10230), ("Wednesday", 6120), ("Thursday", 12480),
  ("Friday", 9050), ("Saturday", 14320), ("Sunday", 4870),
]

private let chartConfig: ChartConfig = [
  "steps": .init("Steps", color: EsuissColor.chart4),
]

public struct BarChartActive: View {
  @State private var selected = 5
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init() {}

  private var selection: Binding<Int?> {
    Binding(get: { selected }, set: { if let value = $0 { selected = value } })
  }

  public var body: some View {
    let day = chartData[selected]
    Card(.filled, size: .sm) {
      VStack(alignment: .leading, spacing: 2) {
        Text("Steps")
          .textStyle(.sm, weight: .semibold)
          .foregroundStyle(chartConfig.color("steps"))
        HStack(alignment: .firstTextBaseline, spacing: 4) {
          Text(day.steps, format: .number)
            .textStyle(.xl3, weight: .semibold)
            .monospacedDigit()
          Text("steps")
            .textStyle(.base, weight: .semibold)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        Text("\(day.day) · select a bar")
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      .padding(.horizontal, 16)
      CardContent {
        ChartContainer(config: chartConfig) {
          Chart {
            ForEach(chartData.indices, id: \.self) { index in
              BarMark(x: .value("Day", chartData[index].day), y: .value("Steps", chartData[index].steps), width: .fixed(28))
                .clipShape(RoundedRectangle(cornerRadius: 5, style: .continuous))
                .foregroundStyle(chartConfig.color("steps").opacity(index == selected ? 1 : 0.3))
            }
          }
          .chartXAxis { ChartAxis.x(values: chartData.map(\.day)) { String($0.prefix(3)) } }
          .chartYAxis { ChartAxis.grid() }
          .animation(reduceMotion ? nil : .easeOut(duration: 0.2), value: selected)
          .chartTooltip(
            x: chartData.map(\.day),
            selection: selection,
            cursor: false,
            accessibilityLabel: "Steps",
            items: { [ChartTooltipItem("steps", value: chartData[$0].steps)] }
          ) { _ in
            EmptyView()
          }
        }
        .frame(height: 160)
      }
    }
  }
}
