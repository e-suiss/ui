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

public struct RadarChartRadiusAxis: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Value axis", description: "The 0 to 100 scale is visible")
      CardContent {
        ChartContainer(config: chartConfig) {
          RadarChart(
            [Radar("thisMonth", values: chartData.map(\.thisMonth), fillOpacity: 0.3, strokeWidth: 2)],
            labels: chartData.map(\.skill),
            domain: 0...100,
            outerRadius: 0.7,
            radiusAxis: PolarRadiusAxis(angle: .zero, tickCount: 5),
            selection: $selection,
            accessibilityLabel: "Value axis"
          ) { payload in
            ChartTooltipContent(payload, indicator: .line)
          }
        }
        .frame(height: 224)
      }
    }
  }
}
