import SwiftUI

private let devices: [(name: String, level: Double)] = [
  ("Phone", 82), ("Earbuds", 46), ("Watch", 18), ("Case", 100),
]

private let low: Double = 20

private struct Battery: View {
  let name: String
  let level: Double

  var body: some View {
    let chartConfig: ChartConfig = ["level": .init(name, color: level <= low ? .red : .green)]
    VStack(spacing: 8) {
      ChartContainer(config: chartConfig) {
        RadialBarChart(
          [RadialBar("level", value: level)],
          domain: 0...100,
          innerRadius: 0.78,
          outerRadius: 1,
          barSize: 6,
          startAngle: .zero,
          endAngle: .degrees(360),
          rounded: true,
          track: .tint
        )
        .overlay {
          Text(verbatim: String(name.prefix(1)))
            .textStyle(.xs, weight: .semibold)
            .foregroundStyle(Color.labelSecondary)
        }
      }
      .frame(width: 64, height: 64)
      Text(verbatim: "\(Int(level))%")
        .textStyle(.base, weight: .semibold)
        .monospacedDigit()
      Text(LocalizedStringKey(name))
        .textStyle(.xs)
        .foregroundStyle(Color.labelSecondary)
    }
    .frame(maxWidth: .infinity)
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(Text(LocalizedStringKey(name)))
    .accessibilityValue(Text(verbatim: "\(Int(level))%"))
  }
}

public struct RadialChartBatteries: View {
  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Batteries", description: "Charge left on each device")
      CardContent {
        HStack(alignment: .top, spacing: 8) {
          ForEach(devices, id: \.name) { device in
            Battery(name: device.name, level: device.level)
          }
        }
        .padding(.vertical, 16)
      }
    }
  }
}
