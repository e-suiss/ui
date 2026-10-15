import Charts
import SwiftUI

private let stocks: [(symbol: String, name: String, price: Double, change: Double, seed: Int)] = [
  ("ACME", "Acme Corp.", 254.32, 1.28, 41),
  ("GLBX", "Globex", 512.08, -0.64, 52),
  ("INIT", "Initech", 186.4, 2.91, 63),
  ("UMBR", "Umbrella", 438.15, -1.87, 74),
]

private let chartConfig: ChartConfig = [
  "up": .init("Rising", color: Palette.green500),
  "down": .init("Falling", color: EsuissColor.destructive),
]

private func series(_ seed: Int, rising: Bool) -> [Double] {
  var state = seed
  var value = 100.0
  return (0..<30).map { _ in
    state = (state * 16807) % 2147483647
    value *= 1 + (Double(state - 1) / 2147483646 - (rising ? 0.44 : 0.56)) * 0.02
    return value
  }
}

private struct Sparkline: View {
  let seed: Int
  let rising: Bool

  var body: some View {
    let values = series(seed, rising: rising)
    let color = chartConfig.color(rising ? "up" : "down")
    ChartContainer(config: chartConfig) {
      Chart {
        ForEach(values.indices, id: \.self) { index in
          AreaMark(x: .value("Day", index), yStart: .value("Base", values.min() ?? 0), yEnd: .value("Value", values[index]))
            .interpolationMethod(.linear)
            .foregroundStyle(LinearGradient(colors: [color.opacity(0.25), color.opacity(0.02)], startPoint: .top, endPoint: .bottom))
          LineMark(x: .value("Day", index), y: .value("Value", values[index]))
            .interpolationMethod(.linear)
            .lineStyle(StrokeStyle(lineWidth: 1.5, lineCap: .round, lineJoin: .round))
            .foregroundStyle(color)
        }
      }
      .chartXScale(domain: 0...(values.count - 1))
      .chartYScale(domain: (values.min() ?? 0)...(values.max() ?? 1))
      .chartXAxis(.hidden)
      .chartYAxis(.hidden)
      .padding(.vertical, 2)
    }
    .frame(width: 72, height: 32)
    .accessibilityHidden(true)
  }
}

public struct AreaChartSparkline: View {
  @Environment(\.locale) private var locale
  @Environment(\.colorScheme) private var colorScheme

  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Watchlist", description: "Small area charts next to each price")
      CardContent {
        VStack(spacing: 0) {
          ForEach(stocks.indices, id: \.self) { index in
            if index > 0 {
              EsuissColor.border.frame(height: 1)
            }
            row(stocks[index])
          }
        }
      }
    }
  }

  private func row(_ stock: (symbol: String, name: String, price: Double, change: Double, seed: Int)) -> some View {
    let rising = stock.change >= 0
    return HStack(spacing: 12) {
      VStack(alignment: .leading, spacing: 0) {
        Text(verbatim: stock.symbol)
          .textStyle(.base, weight: .semibold)
        Text(verbatim: stock.name)
          .textStyle(.xs)
          .foregroundStyle(EsuissColor.mutedForeground)
          .lineLimit(1)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      Sparkline(seed: stock.seed, rising: rising)
      VStack(alignment: .trailing, spacing: 3) {
        Text(stock.price, format: .number.precision(.fractionLength(2)).locale(locale))
          .textStyle(.sm, weight: .semibold)
          .monospacedDigit()
        Text("\(stock.change, format: .number.precision(.fractionLength(2)).sign(strategy: .always()).locale(locale))%")
          .textStyle(.xs, weight: .semibold)
          .monospacedDigit()
          .foregroundStyle(colorScheme == .dark ? EsuissColor.background : EsuissColor.primaryForeground)
          .padding(.horizontal, 6)
          .padding(.vertical, 2)
          .frame(minWidth: 52, alignment: .trailing)
          .background(rising ? Palette.green500 : EsuissColor.destructive, in: RoundedRectangle(cornerRadius: Radius.md, style: .continuous))
      }
    }
    .padding(.vertical, 9)
    .accessibilityElement(children: .combine)
  }
}
