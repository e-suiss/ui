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

public struct PieChartDefault: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Pie chart", description: "Users by device · thousands")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator { progress in
            Chart {
              ForEach(chartData, id: \.device) { item in
                SectorMark(angle: .value("Users", item.users * progress), outerRadius: .ratio(0.85), angularInset: 1)
                  .foregroundStyle(chartConfig.color(item.device))
              }
              ChartSectorRest(total: chartData.reduce(0) { $0 + $1.users }, progress: progress)
            }
            .chartTooltip(
              angle: chartData.map(\.users),
              labels: chartData.map { chartConfig.label($0.device) },
              outerRadius: 0.85,
              selection: $selection,
              accessibilityLabel: "Pie chart",
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
