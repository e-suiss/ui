import SwiftUI

private let chartData: [(device: String, users: Double)] = [
  ("phone", 275), ("laptop", 200), ("tablet", 187), ("watch", 173),
]

private let chartConfig: ChartConfig = [
  "users": .init("Users"),
  "phone": .init("Phone", color: EsuissColor.chart1),
  "laptop": .init("Laptop", color: EsuissColor.chart2),
  "tablet": .init("Tablet", color: EsuissColor.chart3),
  "watch": .init("Watch", color: EsuissColor.chart4),
]

public struct RadialChartLabel: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Labeled", description: "Each name sits at the start of its bar")
      CardContent {
        ChartContainer(config: chartConfig) {
          RadialBarChart(
            chartData.map { RadialBar($0.device, value: $0.users) },
            innerRadius: 0.28,
            outerRadius: 1,
            barSize: 16,
            startAngle: .zero,
            endAngle: .degrees(290),
            rounded: true,
            track: .control,
            showsLabels: true,
            selection: $selection,
            accessibilityLabel: "Labeled"
          ) { payload in
            ChartTooltipContent(payload, hideLabel: true)
          }
        }
        .frame(height: 208)
      }
    }
  }
}
