import Charts
import SwiftUI

private let chartData: [(device: String, users: Double)] = [
  ("phone", 275), ("laptop", 200), ("tablet", 187), ("watch", 173), ("other", 90),
]

private let chartConfig: ChartConfig = [
  "users": .init("Users"),
  "phone": .init("Phone", color: .blue),
  "laptop": .init("Laptop", color: .teal),
  "tablet": .init("Tablet", color: .indigo),
  "watch": .init("Watch", color: .orange),
  "other": .init("Other", color: .gray),
]

public struct PieChartSeparated: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Separated slices", description: "Gaps and rounded corners")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator { progress in
            Chart {
              ForEach(chartData, id: \.device) { item in
                SectorMark(angle: .value("Users", item.users * progress), innerRadius: .ratio(0.55), outerRadius: .ratio(0.85), angularInset: 3)
                  .cornerRadius(8)
                  .foregroundStyle(chartConfig.color(item.device))
              }
              ChartSectorRest(total: chartData.reduce(0) { $0 + $1.users }, progress: progress)
            }
            .chartTooltip(
              angle: chartData.map(\.users),
              labels: chartData.map { chartConfig.label($0.device) },
              innerRadius: 0.55,
              outerRadius: 0.85,
              selection: $selection,
              accessibilityLabel: "Separated slices",
              items: { [ChartTooltipItem(chartData[$0].device, value: chartData[$0].users)] }
            ) { payload in
              ChartTooltipContent(payload, hideLabel: true)
            }
            .padding(5)
          }
        }
        .frame(height: 208)
      }
    }
  }
}
