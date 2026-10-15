import SwiftUI

private let chartConfig: ChartConfig = [
  "value": .init("Reading", color: EsuissColor.chart4),
]

public struct RadialChartProgress: View {
  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Goal progress", description: "A three-quarter arc")
      CardContent {
        ChartContainer(config: chartConfig) {
          RadialBarChart(
            [RadialBar("value", value: 64)],
            domain: 0...100,
            innerRadius: 0.72,
            outerRadius: 1,
            barSize: 16,
            startAngle: .degrees(-135),
            endAngle: .degrees(135),
            rounded: true,
            track: .tint
          )
          .overlay(alignment: .center) {
            VStack(spacing: 0) {
              Text(verbatim: "16 / 25")
                .textStyle(.xl3, weight: .semibold)
                .monospacedDigit()
              Text("books · 2026")
                .textStyle(.xs)
                .foregroundStyle(EsuissColor.mutedForeground)
            }
            .multilineTextAlignment(.center)
          }
        }
        .frame(height: 208)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text("Goal progress"))
        .accessibilityValue(Text("16 / 25 books · 2026"))
      }
    }
  }
}
