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

private let total = chartData.reduce(0) { $0 + $1.users }

public struct PieChartDonutText: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Total in the middle", description: "A summary inside the ring")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator { progress in
            Chart {
              ForEach(chartData, id: \.device) { item in
                SectorMark(angle: .value("Users", item.users * progress), innerRadius: .ratio(0.62), outerRadius: .ratio(0.88), angularInset: 0.75)
                  .cornerRadius(3)
                  .foregroundStyle(chartConfig.color(item.device))
              }
              ChartSectorRest(total: total, progress: progress)
            }
            .background {
              VStack(spacing: 0) {
                Text(total, format: .number)
                  .textStyle(.xl2, weight: .semibold)
                  .monospacedDigit()
                Text("users")
                  .textStyle(.xs)
                  .foregroundStyle(EsuissColor.mutedForeground)
              }
              .multilineTextAlignment(.center)
            }
            .chartTooltip(
              angle: chartData.map(\.users),
              labels: chartData.map { chartConfig.label($0.device) },
              innerRadius: 0.62,
              outerRadius: 0.88,
              selection: $selection,
              accessibilityLabel: "Total in the middle",
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
