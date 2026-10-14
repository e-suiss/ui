import SwiftUI

private let chartData: [(device: String, users: Double)] = [
  ("phone", 275), ("laptop", 200), ("tablet", 187), ("watch", 173),
]

private let chartConfig: ChartConfig = [
  "users": .init("Users"),
  "phone": .init("Phone", color: .blue),
  "laptop": .init("Laptop", color: .teal),
  "tablet": .init("Tablet", color: .indigo),
  "watch": .init("Watch", color: .orange),
]

public struct RadialChartDefault: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Radial chart", description: "Users by device")
      CardContent {
        ChartContainer(config: chartConfig) {
          RadialBarChart(
            chartData.map { RadialBar($0.device, value: $0.users) },
            innerRadius: 0.25,
            outerRadius: 1,
            barSize: 12,
            rounded: true,
            track: .control,
            selection: $selection,
            accessibilityLabel: "Radial chart"
          ) { payload in
            ChartTooltipContent(payload, hideLabel: true)
          }
        }
        .frame(height: 208)
      }
    }
  }
}
