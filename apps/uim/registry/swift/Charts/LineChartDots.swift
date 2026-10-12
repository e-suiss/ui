import Charts
import SwiftUI

private let chartData: [(month: String, weight: Double)] = [
  ("Jan", 82.4), ("Feb", 81.6), ("Mar", 81.9), ("Apr", 80.8), ("May", 80.1),
  ("Jun", 79.6), ("Jul", 79.8), ("Aug", 78.9), ("Sep", 78.4), ("Oct", 77.9),
]

private let chartConfig: ChartConfig = [
  "weight": .init("Weight", color: .purple),
]

public struct LineChartDots: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      VStack(alignment: .leading, spacing: 2) {
        Text("Weight")
          .textStyle(.sm, weight: .semibold)
          .foregroundStyle(chartConfig.color("weight"))
        HStack(alignment: .firstTextBaseline, spacing: 4) {
          Text(verbatim: "77.9")
            .textStyle(.xl3, weight: .semibold)
            .monospacedDigit()
          Text("kg")
            .textStyle(.base, weight: .semibold)
            .foregroundStyle(Color.labelSecondary)
        }
        Text("Down 4.5 kg since January")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
      .padding(.horizontal, 16)
      CardContent {
        ChartContainer(config: chartConfig) {
          Chart {
            ForEach(chartData.indices, id: \.self) { index in
              LineMark(x: .value("Month", index), y: .value("Weight", chartData[index].weight))
                .interpolationMethod(.linear)
                .lineStyle(StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))
                .foregroundStyle(chartConfig.color("weight"))
              PointMark(x: .value("Month", index), y: .value("Weight", chartData[index].weight))
                .symbolSize(selection == index ? 100 : 49)
                .foregroundStyle(chartConfig.color("weight"))
            }
          }
          .chartXScale(domain: 0...(chartData.count - 1), range: .plotDimension(padding: 12))
          .chartYScale(domain: 76...84)
          .chartXAxis { ChartAxis.x(values: [0, 3, 6, 9]) { chartData[$0].month } }
          .chartYAxis { ChartAxis.y(values: [76, 80, 84]) { (value: Double) in value.formatted() } }
          .chartTooltip(
            x: Array(chartData.indices),
            labels: chartData.map(\.month),
            selection: $selection,
            accessibilityLabel: "Weight",
            items: { [ChartTooltipItem("weight", value: chartData[$0].weight)] }
          ) { payload in
            ChartTooltipContent(payload, hideIndicator: true) { item in
              Text("\(item.value, format: .number) kg")
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
