import SwiftUI

private let chartConfig: ChartConfig = [
  "value": .init("Used", color: .blue),
]

public struct RadialChartText: View {
  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Value in the middle", description: "A single percentage")
      CardContent {
        ChartContainer(config: chartConfig) {
          RadialBarChart(
            [RadialBar("value", value: 72)],
            domain: 0...100,
            innerRadius: 0.72,
            outerRadius: 1,
            barSize: 16,
            startAngle: .degrees(0),
            endAngle: .degrees(360),
            rounded: true,
            track: .tint
          )
          .overlay(alignment: .center) {
            VStack(spacing: 0) {
              Text(verbatim: "72%")
                .textStyle(.xl3, weight: .semibold)
                .monospacedDigit()
              Text("cloud storage used")
                .textStyle(.xs)
                .foregroundStyle(Color.labelSecondary)
            }
            .multilineTextAlignment(.center)
          }
        }
        .frame(height: 208)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text("Value in the middle"))
        .accessibilityValue(Text("72% cloud storage used"))
      }
    }
  }
}
