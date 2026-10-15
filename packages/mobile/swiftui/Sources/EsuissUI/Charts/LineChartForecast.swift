import Charts
import SwiftUI

private let actual: [Double] = [12, 14, 13, 17, 19, 22, 24, 23, 26]
private let forecast: [Double] = [26, 28, 30, 33]
private let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

private let chartConfig: ChartConfig = [
  "actual": .init("Actual", color: EsuissColor.chart1),
  "forecast": .init("Forecast", color: EsuissColor.chart1),
]

private func value(_ key: String, _ index: Int) -> Double? {
  if key == "actual" { return actual.indices.contains(index) ? actual[index] : nil }
  return index >= 8 ? forecast[index - 8] : nil
}

public struct LineChartForecast: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Actual and forecast", description: "The dashed line is the forecast")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator { progress in
            Chart {
              RectangleMark(xStart: .value("Month", 8), xEnd: .value("Month", 11))
                .foregroundStyle(EsuissColor.secondary.opacity(0.6))
              ForEach(chartConfig.keys, id: \.self) { key in
                ForEach(months.indices, id: \.self) { index in
                  if let point = value(key, index) {
                    LineMark(x: .value("Month", index), y: .value("Value", point), series: .value("Series", key))
                      .interpolationMethod(.monotone)
                      .lineStyle(StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round, dash: key == "forecast" ? [5, 5] : []))
                      .foregroundStyle(chartConfig.color(key))
                  }
                }
                if let selection, let point = value(key, selection) {
                  PointMark(x: .value("Month", selection), y: .value("Value", point))
                    .symbolSize(64)
                    .foregroundStyle(chartConfig.color(key))
                }
              }
              .chartReveal(progress, x: 0...11)
            }
            .chartXScale(domain: 0...11, range: .plotDimension(padding: 12))
            .chartXAxis { ChartAxis.x(values: [0, 3, 6, 9]) { months[$0] } }
            .chartYAxis { ChartAxis.grid() }
            .chartTooltip(
              x: Array(months.indices),
              labels: months,
              selection: $selection,
              accessibilityLabel: "Actual and forecast",
              items: { index in
                chartConfig.keys.compactMap { key in value(key, index).map { ChartTooltipItem(key, value: $0) } }
              }
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
