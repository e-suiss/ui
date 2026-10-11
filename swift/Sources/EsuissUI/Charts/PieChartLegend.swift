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

public struct PieChartLegend: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("With a legend", description: "What each color means")
      CardContent {
        ChartContainer(config: chartConfig) {
          Chart {
            ForEach(chartData, id: \.device) { item in
              SectorMark(angle: .value("Users", item.users), innerRadius: .ratio(0.5), outerRadius: .ratio(0.78), angularInset: 0.75)
                .foregroundStyle(chartConfig.color(item.device))
            }
          }
          .chartTooltip(
            angle: chartData.map(\.users),
            labels: chartData.map { chartConfig.label($0.device) },
            innerRadius: 0.5,
            outerRadius: 0.78,
            selection: $selection,
            accessibilityLabel: "With a legend",
            items: { [ChartTooltipItem(chartData[$0].device, value: chartData[$0].users)] }
          ) { payload in
            ChartTooltipContent(payload, hideLabel: true)
          }
          .padding(5)
          ChartLegendContent(keys: chartData.map(\.device))
        }
        .frame(height: 240)
      }
    }
  }
}
