import Charts
import SwiftUI

private let chartData: [(device: String, users: Double)] = [
  ("phone", 275), ("laptop", 200), ("tablet", 187), ("watch", 173), ("other", 90),
]

private let chartConfig: ChartConfig = [
  "users": .init("Users"),
  "phone": .init("Phone", color: EsuissColor.chart1),
  "laptop": .init("Laptop", color: EsuissColor.chart2),
  "tablet": .init("Tablet", color: EsuissColor.chart3),
  "watch": .init("Watch", color: EsuissColor.chart4),
  "other": .init("Other", color: EsuissColor.chart5),
]

public struct PieChartDonut: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Donut", description: "A hole in the middle")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator { progress in
            Chart {
              ForEach(chartData, id: \.device) { item in
                SectorMark(angle: .value("Users", item.users * progress), innerRadius: .ratio(0.58), outerRadius: .ratio(0.85), angularInset: 0.75)
                  .foregroundStyle(chartConfig.color(item.device))
              }
              ChartSectorRest(total: chartData.reduce(0) { $0 + $1.users }, progress: progress)
            }
            .chartTooltip(
              angle: chartData.map(\.users),
              labels: chartData.map { chartConfig.label($0.device) },
              innerRadius: 0.58,
              outerRadius: 0.85,
              selection: $selection,
              accessibilityLabel: "Donut",
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
