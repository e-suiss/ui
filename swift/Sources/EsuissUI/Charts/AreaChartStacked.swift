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
  "mobile": .init("Mobile", color: .teal),
]

private let order = ["mobile", "desktop"]

private func value(_ key: String, _ index: Int) -> Double {
  key == "desktop" ? chartData[index].desktop : chartData[index].mobile
}

private func band(_ key: String, _ index: Int) -> (start: Double, end: Double) {
  let position = order.firstIndex(of: key) ?? 0
  let start = order.prefix(position).reduce(0) { $0 + value($1, index) }
  return (start, start + value(key, index))
}

public struct AreaChartStacked: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Stacked", description: "Desktop and mobile combined")
      CardContent {
        ChartContainer(config: chartConfig) {
          Chart {
            ForEach(order, id: \.self) { key in
              ForEach(chartData.indices, id: \.self) { index in
                AreaMark(
                  x: .value("Month", index),
                  yStart: .value("Start", band(key, index).start),
                  yEnd: .value("End", band(key, index).end),
                  series: .value("Series", key)
                )
                .interpolationMethod(.catmullRom)
                .foregroundStyle(chartConfig.color(key).opacity(0.2))
                LineMark(x: .value("Month", index), y: .value("End", band(key, index).end), series: .value("Series", key))
                  .interpolationMethod(.catmullRom)
                  .lineStyle(StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))
                  .foregroundStyle(chartConfig.color(key))
              }
            }
          }
          .chartXScale(domain: 0...(chartData.count - 1), range: .plotDimension(padding: 12))
          .chartXAxis { ChartAxis.x(values: Array(chartData.indices)) { String(chartData[$0].month.prefix(3)) } }
          .chartYAxis { ChartAxis.grid() }
          .chartTooltip(
            x: Array(chartData.indices),
            labels: chartData.map(\.month),
            selection: $selection,
            accessibilityLabel: "Stacked",
            items: { index in order.map { ChartTooltipItem($0, value: value($0, index)) } }
          ) { payload in
            ChartTooltipContent(payload, indicator: .dot)
          }
          ChartLegendContent()
        }
        .frame(height: 224)
      }
    }
  }
}
