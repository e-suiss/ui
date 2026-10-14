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

public struct RadarChartDefault: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Radar chart", description: "Training balance · this month")
      CardContent {
        ChartContainer(config: chartConfig) {
          RadarChart(
            [Radar("thisMonth", values: chartData.map(\.thisMonth), fillOpacity: 0.3, strokeWidth: 2)],
            labels: chartData.map(\.skill),
            outerRadius: 0.7,
            selection: $selection,
            accessibilityLabel: "Radar chart"
          ) { payload in
            ChartTooltipContent(payload, indicator: .line)
          }
        }
        .frame(height: 224)
      }
    }
  }
}
