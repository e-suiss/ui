import SwiftUI

private let chartConfig: ChartConfig = [
  "value": .init("Air quality", color: Palette.green500),
]

public struct RadialChartGauge: View {
  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Gauge", description: "Air quality index")
      CardContent {
        ChartContainer(config: chartConfig) {
          RadialBarChart(
            [RadialBar("value", value: 38)],
            domain: 0...100,
            innerRadius: 0.72,
            outerRadius: 1,
            barSize: 14,
            startAngle: .degrees(-120),
            endAngle: .degrees(120),
            rounded: true,
            track: .tint
          )
          .overlay(alignment: .top) {
            VStack(spacing: 0) {
              Text(verbatim: "38")
                .textStyle(.xl3, weight: .semibold)
                .monospacedDigit()
              Text("Good")
                .textStyle(.xs)
                .foregroundStyle(EsuissColor.mutedForeground)
            }
            .multilineTextAlignment(.center)
            .padding(.top, 208 * 0.44)
          }
        }
        .frame(height: 208)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text("Gauge"))
        .accessibilityValue(Text("Air quality 38, Good"))
      }
    }
  }
}
