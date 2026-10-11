import Charts
import SwiftUI

private let chartData: [(device: String, share: Double)] = [
  ("phone", 40), ("laptop", 25), ("tablet", 20), ("watch", 15),
]

private let chartConfig: ChartConfig = [
  "share": .init("Share"),
  "phone": .init("Phone", color: .blue),
  "laptop": .init("Laptop", color: .teal),
  "tablet": .init("Tablet", color: .indigo),
  "watch": .init("Watch", color: .orange),
]

private let total = chartData.reduce(0) { $0 + $1.share }

public struct PieChartHalf: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    let outer: CGFloat = 124.5
    Card(.filled, size: .sm) {
      CardHeader("Half circle", description: "Battery use by device · last 24 hours")
      CardContent {
        ChartContainer(config: chartConfig) {
          Chart {
            ForEach(chartData, id: \.device) { item in
              SectorMark(angle: .value("Share", item.share), innerRadius: .ratio(0.7), angularInset: 1)
                .cornerRadius(4)
                .foregroundStyle(chartConfig.color(item.device))
            }
            SectorMark(angle: .value("Share", total))
              .foregroundStyle(.clear)
          }
          .contentShape(Rectangle().size(width: outer + 26, height: outer * 2).offset(x: outer - 26))
          .chartTooltip(
            angle: chartData.map(\.share),
            labels: chartData.map { chartConfig.label($0.device) },
            startAngle: .degrees(-90),
            endAngle: .degrees(90),
            innerRadius: 0.7,
            selection: $selection,
            accessibilityLabel: "Half circle",
            items: { [ChartTooltipItem(chartData[$0].device, value: chartData[$0].share)] }
          ) { payload in
            ChartTooltipContent(payload, hideLabel: true) { item in
              HStack(spacing: 0) {
                Text("\(Text(LocalizedStringKey(chartConfig.label(item.key)))) · ")
                Text(verbatim: "\(item.value.formatted(.number))%")
                  .fontWeight(.semibold)
                  .monospacedDigit()
              }
            }
          }
          .frame(width: outer * 2, height: outer * 2)
          .padding(.top, 26.5)
          .frame(maxWidth: .infinity)
          .frame(height: 176, alignment: .top)
          .overlay(alignment: .bottom) {
            VStack(spacing: 0) {
              Text(verbatim: "100%")
                .textStyle(.xl2, weight: .semibold)
                .monospacedDigit()
              Text("last 24 hours")
                .textStyle(.xs)
                .foregroundStyle(Color.labelSecondary)
            }
            .padding(.bottom, 21)
            .allowsHitTesting(false)
            .accessibilityHidden(true)
          }
        }
        .frame(height: 176)
      }
    }
  }
}
