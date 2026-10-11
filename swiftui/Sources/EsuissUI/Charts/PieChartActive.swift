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

private let total = chartData.reduce(0) { $0 + $1.users }

public struct PieChartActive: View {
  @State private var selected = 0
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init() {}

  private var selection: Binding<Int?> {
    Binding(get: { selected }, set: { if let value = $0 { selected = value } })
  }

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Highlighted slice", description: "The selected slice pops out")
      CardContent {
        ChartContainer(config: chartConfig) {
          ZStack {
            GeometryReader { geometry in
              let radius = min(geometry.size.width, geometry.size.height) / 2
              let before = chartData.prefix(selected).reduce(0) { $0 + $1.users }
              ChartArc(
                center: CGPoint(x: geometry.size.width / 2, y: geometry.size.height / 2),
                radius: radius * 0.92,
                thickness: radius * 0.029,
                start: .degrees(before / total * 360),
                end: .degrees((before + chartData[selected].users) / total * 360),
                rounded: false
              )
              .fill(chartConfig.color(chartData[selected].device))
            }
            .accessibilityHidden(true)
            Chart {
              ForEach(chartData.indices, id: \.self) { index in
                SectorMark(
                  angle: .value("Users", chartData[index].users),
                  innerRadius: .ratio(0.5),
                  outerRadius: .ratio(index == selected ? 0.876 : 0.78)
                )
                .foregroundStyle(chartConfig.color(chartData[index].device))
              }
            }
            .chartTooltip(
              angle: chartData.map(\.users),
              labels: chartData.map { chartConfig.label($0.device) },
              innerRadius: 0.5,
              outerRadius: 0.876,
              selection: selection,
              accessibilityLabel: "Highlighted slice",
              items: { [ChartTooltipItem(chartData[$0].device, value: chartData[$0].users)] }
            ) { payload in
              ChartTooltipContent(payload, hideLabel: true)
            }
          }
          .animation(reduceMotion ? nil : .easeOut(duration: 0.2), value: selected)
          .padding(5)
        }
        .frame(height: 208)
      }
    }
  }
}
