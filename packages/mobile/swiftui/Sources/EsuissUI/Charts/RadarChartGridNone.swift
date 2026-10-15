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

public struct RadarChartGridNone: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("No grid", description: "Just the shape")
      CardContent {
        ChartContainer(config: chartConfig) {
          RadarChart(
            [Radar("thisMonth", values: chartData.map(\.thisMonth), fillOpacity: 0.55, strokeWidth: 0)],
            labels: chartData.map(\.skill),
            outerRadius: 0.7,
            grid: nil,
            selection: $selection,
            accessibilityLabel: "No grid"
          ) { payload in
            ChartTooltipContent(payload, indicator: .line)
          }
        }
        .frame(height: 224)
      }
    }
  }
}
