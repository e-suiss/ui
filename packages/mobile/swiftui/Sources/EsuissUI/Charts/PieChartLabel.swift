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

public struct PieChartLabel: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Labeled", description: "Each name sits outside its slice")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator { progress in
            Chart {
              ForEach(chartData, id: \.device) { item in
                SectorMark(angle: .value("Users", item.users * progress), outerRadius: .ratio(0.68), angularInset: 1)
                  .foregroundStyle(chartConfig.color(item.device))
              }
              ChartSectorRest(total: total, progress: progress)
            }
            .overlay {
              GeometryReader { geometry in
                let center = CGPoint(x: geometry.size.width / 2, y: geometry.size.height / 2)
                let radius = min(geometry.size.width, geometry.size.height) / 2 * 0.68
                ForEach(chartData.indices, id: \.self) { index in
                  let before = chartData.prefix(index).reduce(0) { $0 + $1.users }
                  let angle = (before + chartData[index].users / 2) / total * 2 * .pi
                  let start = point(center, radius, angle)
                  let end = point(center, radius + 20, angle)
                  Path { path in
                    path.move(to: start)
                    path.addLine(to: end)
                  }
                  .stroke(EsuissColor.input, lineWidth: 1)
                  Text(LocalizedStringKey(chartConfig.label(chartData[index].device)))
                    .scaledFont(TextStyle.xs, weight: .semibold)
                    .foregroundStyle(EsuissColor.foreground)
                    .fixedSize()
                    .frame(width: 0, height: 0, alignment: sin(angle) >= 0 ? .leading : .trailing)
                    .position(x: end.x + (sin(angle) >= 0 ? 2 : -2), y: end.y)
                }
              }
              .opacity(progress < 1 ? 0 : 1)
              .allowsHitTesting(false)
              .accessibilityHidden(true)
            }
            .chartTooltip(
              angle: chartData.map(\.users),
              labels: chartData.map { chartConfig.label($0.device) },
              outerRadius: 0.68,
              selection: $selection,
              accessibilityLabel: "Labeled",
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

  private func point(_ center: CGPoint, _ radius: CGFloat, _ angle: Double) -> CGPoint {
    CGPoint(x: center.x + radius * sin(angle), y: center.y - radius * cos(angle))
  }
}
