import Charts
import SwiftUI

private let chartData: [(month: String, flow: Double)] = [
  ("January", 42), ("February", -18), ("March", 26), ("April", 55), ("May", -31), ("June", 12),
  ("July", 38), ("August", -9), ("September", 47), ("October", 21), ("November", -14), ("December", 60),
]

private let chartConfig: ChartConfig = [
  "flow": .init("Cash flow"),
]

public struct BarChartNegative: View {
  @State private var selection: Int?

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Positive and negative", description: "Monthly cash flow · thousands")
      CardContent {
        ChartContainer(config: chartConfig) {
          ChartAnimator(animationDuration: 400) { progress in
            Chart {
              RuleMark(y: .value("Zero", 0))
                .lineStyle(StrokeStyle(lineWidth: 1))
                .foregroundStyle(EsuissColor.input)
              ForEach(chartData.indices, id: \.self) { index in
                BarMark(x: .value("Month", chartData[index].month), y: .value("Flow", chartData[index].flow * progress), width: .fixed(18))
                  .clipShape(RoundedRectangle(cornerRadius: 4, style: .continuous))
                  .foregroundStyle(chartData[index].flow >= 0 ? Palette.green500 : Palette.red500)
                ChartAnchorMark(x: .value("Month", chartData[index].month), y: .value("Flow", chartData[index].flow))
              }
            }
            .chartXAxis { ChartAxis.x(values: chartData.indices.filter { $0.isMultiple(of: 2) }.map { chartData[$0].month }) { String($0.prefix(3)) } }
            .chartYAxis { ChartAxis.grid() }
            .chartTooltip(
              x: chartData.map(\.month),
              selection: $selection,
              cursor: false,
              accessibilityLabel: "Positive and negative",
              items: { [ChartTooltipItem("flow", value: chartData[$0].flow)] }
            ) { payload in
              ChartTooltipContent(payload, hideIndicator: true)
            }
          }
        }
        .frame(height: 192)
      }
    }
  }
}
