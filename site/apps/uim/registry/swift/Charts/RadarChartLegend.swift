import SwiftUI

private let chartData: [(skill: String, thisMonth: Double, lastMonth: Double)] = [
  ("Cardio", 86, 72),
  ("Strength", 62, 58),
  ("Flexibility", 48, 55),
  ("Balance", 70, 60),
  ("Endurance", 80, 66),
  ("Speed", 74, 70),
]

private let chartConfig: ChartConfig = [
  "thisMonth": .init("This month", color: .green),
  "lastMonth": .init("Last month", color: .gray),
]

public struct RadarChartLegend: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("With a legend", description: "Series listed below")
      CardContent {
        ChartContainer(config: chartConfig) {
          RadarChart(
            [
              Radar("lastMonth", values: chartData.map(\.lastMonth), fillOpacity: 0.2, strokeWidth: 2),
              Radar("thisMonth", values: chartData.map(\.thisMonth), fillOpacity: 0.2, strokeWidth: 2),
            ],
            labels: chartData.map(\.skill),
            outerRadius: 0.62,
            center: UnitPoint(x: 0.5, y: 0.45),
            selection: $selection,
            accessibilityLabel: "With a legend"
          ) { payload in
            ChartTooltipContent(payload, indicator: .line)
          }
          ChartLegendContent()
        }
        .frame(height: 240)
      }
    }
  }
}
