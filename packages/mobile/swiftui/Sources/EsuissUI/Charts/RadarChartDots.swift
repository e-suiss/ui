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
  "thisMonth": .init("This month", color: Palette.green500),
  "lastMonth": .init("Last month", color: EsuissColor.chart5),
]

public struct RadarChartDots: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("With dots", description: "A reading on every axis")
      CardContent {
        ChartContainer(config: chartConfig) {
          RadarChart(
            [Radar("thisMonth", values: chartData.map(\.thisMonth), fillOpacity: 0.2, strokeWidth: 2, dot: 4)],
            labels: chartData.map(\.skill),
            outerRadius: 0.7,
            selection: $selection,
            accessibilityLabel: "With dots"
          ) { payload in
            ChartTooltipContent(payload, indicator: .line)
          }
        }
        .frame(height: 224)
      }
    }
  }
}
