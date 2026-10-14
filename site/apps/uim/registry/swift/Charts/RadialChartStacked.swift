import Charts
import SwiftUI

private let visitors: [(key: String, value: Double)] = [("desktop", 1260), ("mobile", 570)]

private let chartConfig: ChartConfig = [
  "desktop": .init("Desktop", color: .blue),
  "mobile": .init("Mobile", color: .teal),
]

private let total = visitors.reduce(0) { $0 + $1.value }

public struct RadialChartStacked: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    let outer: CGFloat = 141.1
    Card(.filled, size: .sm) {
      CardHeader("Half, stacked", description: "Two series on one arc")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator { progress in
            Chart {
              ForEach(visitors, id: \.key) { item in
                SectorMark(angle: .value("Visitors", item.value * progress), innerRadius: .ratio(0.706), angularInset: 1.5)
                  .cornerRadius(6)
                  .foregroundStyle(chartConfig.color(item.key))
              }
              ChartSectorRest(total: total, progress: progress)
              SectorMark(angle: .value("Visitors", total))
                .foregroundStyle(.clear)
            }
            .contentShape(Rectangle().size(width: outer + 28, height: outer * 2).offset(x: outer - 28))
            .chartTooltip(
              angle: visitors.map(\.value),
              labels: visitors.map { chartConfig.label($0.key) },
              startAngle: .degrees(-90),
              endAngle: .degrees(90),
              innerRadius: 0.706,
              selection: $selection,
              accessibilityLabel: "Half, stacked",
              items: { _ in visitors.map { ChartTooltipItem($0.key, value: $0.value) } }
            ) { payload in
              ChartTooltipContent(payload, hideLabel: true)
            }
            .frame(width: outer * 2, height: outer * 2)
            .padding(.top, 6.7)
            .frame(maxWidth: .infinity)
            .frame(height: 176, alignment: .top)
            .overlay(alignment: .bottom) {
              VStack(spacing: 0) {
                Text(total, format: .number)
                  .textStyle(.xl2, weight: .semibold)
                  .monospacedDigit()
                Text("visitors")
                  .textStyle(.xs)
                  .foregroundStyle(Color.labelSecondary)
              }
              .padding(.bottom, 176 * 0.14)
              .allowsHitTesting(false)
              .accessibilityHidden(true)
            }
          }
        }
        .frame(height: 176)
      }
    }
  }
}
