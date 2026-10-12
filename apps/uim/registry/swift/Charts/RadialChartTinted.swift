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

public struct RadialChartTinted: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Tinted track", description: "The unfilled part keeps a soft tint of its color")
      CardContent {
        ChartContainer(config: chartConfig) {
          RadialBarChart(
            chartData.map { RadialBar($0.device, value: $0.users) },
            domain: 0...320,
            innerRadius: 0.25,
            outerRadius: 1,
            barSize: 12,
            rounded: true,
            track: .tint,
            selection: $selection,
            accessibilityLabel: "Tinted track"
          ) { payload in
            ChartTooltipContent(payload, hideLabel: true)
          }
        }
        .frame(height: 208)
      }
    }
  }
}
