import Charts
import SwiftUI

private enum Period: String, CaseIterable {
  case day = "1D"
  case week = "1W"
  case month = "1M"
  case quarter = "3M"
  case year = "1Y"
  case fiveYears = "5Y"

  var settings: (points: Int, seed: Int, volatility: Double, drift: Double) {
    switch self {
    case .day: (78, 11, 0.0025, 0.46)
    case .week: (35, 23, 0.004, 0.46)
    case .month: (22, 37, 0.012, 0.53)
    case .quarter: (64, 41, 0.014, 0.46)
    case .year: (52, 59, 0.03, 0.46)
    case .fiveYears: (60, 73, 0.045, 0.46)
    }
  }

  var caption: String {
    switch self {
    case .day: "Today"
    case .week: "Past week"
    case .month: "Past month"
    case .quarter: "Past 3 months"
    case .year: "Past year"
    case .fiveYears: "Past 5 years"
    }
  }
}

private struct Point {
  let index: Int
  let price: Double
  let label: String
  let tick: String
}

private let lastPrice = 254.32
private let samples = 80

private var calendar: Calendar {
  Calendar(identifier: .gregorian)
}

private var end: Date {
  calendar.date(from: DateComponents(year: 2026, month: 10, day: 6)) ?? .now
}

private func businessDays(_ count: Int) -> [Date] {
  var days: [Date] = []
  var day = end
  while days.count < count {
    let weekday = calendar.component(.weekday, from: day)
    if weekday != 1 && weekday != 7 { days.insert(day, at: 0) }
    day = calendar.date(byAdding: .day, value: -1, to: day) ?? day
  }
  return days
}

private func generate(_ range: Period, locale: Locale) -> [Point] {
  let settings = range.settings
  var state = settings.seed
  var value = 100.0
  let values = (0..<settings.points).map { _ in
    state = (state * 16807) % 2147483647
    value *= 1 + (Double(state - 1) / 2147483646 - settings.drift) * settings.volatility
    return value
  }
  guard let last = values.last else { return [] }
  let scale = lastPrice / last
  let days = businessDays(settings.points)
  let week = businessDays(5)
  let dayFormat = Date.FormatStyle.dateTime.month(.abbreviated).day().locale(locale)
  return values.enumerated().map { index, raw in
    let price = (raw * scale * 100).rounded() / 100
    switch range {
    case .day:
      let minutes = 570 + index * 5
      let hour = minutes / 60
      let minute = minutes % 60
      return Point(index: index, price: price, label: String(format: "%d:%02d", hour, minute), tick: minute == 0 ? "\(hour):00" : "")
    case .week:
      let weekday = week[index / 7].formatted(.dateTime.weekday(.abbreviated).locale(locale))
      return Point(index: index, price: price, label: "\(weekday) \(10 + index % 7):00", tick: index % 7 == 0 ? weekday : "")
    case .month, .quarter:
      let label = days[index].formatted(dayFormat)
      return Point(index: index, price: price, label: label, tick: label)
    case .year:
      let day = calendar.date(byAdding: .day, value: -(settings.points - 1 - index) * 7, to: end) ?? end
      return Point(
        index: index,
        price: price,
        label: "\(day.formatted(dayFormat)), \(calendar.component(.year, from: day))",
        tick: day.formatted(.dateTime.month(.abbreviated).locale(locale))
      )
    case .fiveYears:
      let month = calendar.date(byAdding: .month, value: -(settings.points - 1 - index), to: end) ?? end
      return Point(
        index: index,
        price: price,
        label: month.formatted(.dateTime.month(.wide).year().locale(locale)),
        tick: "\(calendar.component(.year, from: month))"
      )
    }
  }
}

private func resample(_ source: [Point]) -> [Point] {
  guard source.count > 1 else { return source }
  var result: [Point] = []
  var previous = -1
  for index in 0..<samples {
    let position = Double(index * (source.count - 1)) / Double(samples - 1)
    let from = Int(position)
    let to = min(source.count - 1, from + 1)
    let nearest = Int(position.rounded())
    let start = source[from]
    let finish = source[to]
    let closest = source[nearest]
    let price = start.price + (finish.price - start.price) * (position - Double(from))
    result.append(Point(index: index, price: (price * 100).rounded() / 100, label: closest.label, tick: nearest != previous ? closest.tick : ""))
    previous = nearest
  }
  return result
}

private func tickIndexes(_ points: [Point], max: Int) -> [Int] {
  let ticks = points.enumerated()
    .filter { index, point in !point.tick.isEmpty && (index == 0 || point.tick != points[index - 1].tick) }
    .map(\.element.index)
  guard ticks.count > max else { return ticks }
  let step = Int((Double(ticks.count) / Double(max)).rounded(.up))
  return ticks.enumerated().filter { $0.offset % step == 0 }.map(\.element)
}

public struct AreaChartInteractive: View {
  @State private var range: Period = .month
  @State private var selection: Int?
  @Environment(\.locale) private var locale
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init() {}

  private var rangeBinding: Binding<Period?> {
    Binding(get: { range }, set: { if let value = $0 { range = value } })
  }

  public var body: some View {
    let points = resample(generate(range, locale: locale))
    let prices = points.map(\.price)
    let first = points.first?.price ?? 0
    let current = points[selection ?? points.count - 1]
    let change = current.price - first
    let rising = change >= 0
    let low = prices.min() ?? 0
    let high = prices.max() ?? 1
    let padding = (high - low) * 0.12
    let chartConfig: ChartConfig = ["price": .init("Price", color: rising ? Palette.green500 : EsuissColor.destructive)]
    let color = chartConfig.color("price")
    let price = FloatingPointFormatStyle<Double>.number.precision(.fractionLength(2)).locale(locale)
    let stats: [(String, String)] = [
      ("Open", first.formatted(price)),
      ("High", high.formatted(price)),
      ("Low", low.formatted(price)),
      ("Volume", range == .day ? "41.2M" : "1.24B"),
    ]
    Card(.filled, size: .sm) {
      VStack(alignment: .leading, spacing: 16) {
        VStack(alignment: .leading, spacing: 2) {
          HStack(alignment: .firstTextBaseline, spacing: 8) {
            Text(verbatim: "ACME")
              .textStyle(.xl2, weight: .semibold)
            Text(verbatim: "Acme Corp.")
              .textStyle(.base)
              .foregroundStyle(EsuissColor.mutedForeground)
          }
          HStack(alignment: .firstTextBaseline, spacing: 10) {
            Text(verbatim: "$\(current.price.formatted(price))")
              .textStyle(.xl3, weight: .semibold)
              .monospacedDigit()
            Text(verbatim: "\(change.formatted(price.sign(strategy: .always()))) (\(abs(change / first * 100).formatted(price))%)")
              .textStyle(.base, weight: .semibold)
              .monospacedDigit()
              .foregroundStyle(rising ? Color.adaptive(light: Palette.green600, dark: Palette.green400) : EsuissColor.destructive)
          }
          Text(LocalizedStringKey(selection == nil ? range.caption : current.label))
            .textStyle(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
            .frame(minHeight: 20)
        }
        ToggleGroup(selection: rangeBinding, size: .sm, spacing: 0) {
          ForEach(Period.allCases, id: \.self) { item in
            ToggleGroupItem(LocalizedStringKey(item.rawValue), value: item)
          }
        }
        .accessibilityLabel("Time range")
      }
      .padding(.horizontal, 16)
      CardContent {
        VStack(alignment: .leading, spacing: 16) {
          ChartContainer(config: chartConfig) {
            Chart {
              RuleMark(y: .value("Open", first))
                .lineStyle(StrokeStyle(lineWidth: 1, dash: [2, 3]))
                .foregroundStyle(EsuissColor.mutedForeground)
              ForEach(points, id: \.index) { point in
                AreaMark(x: .value("Time", point.index), yStart: .value("Base", low - padding), yEnd: .value("Price", point.price))
                  .interpolationMethod(.linear)
                  .foregroundStyle(LinearGradient(colors: [color.opacity(0.3), color.opacity(0.02)], startPoint: .top, endPoint: .bottom))
                LineMark(x: .value("Time", point.index), y: .value("Price", point.price))
                  .interpolationMethod(.linear)
                  .lineStyle(StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))
                  .foregroundStyle(color)
              }
              if let selection {
                PointMark(x: .value("Time", selection), y: .value("Price", points[selection].price))
                  .symbol {
                    Circle()
                      .fill(color)
                      .stroke(EsuissColor.muted, lineWidth: 2)
                      .frame(width: 12, height: 12)
                  }
              }
            }
            .chartXScale(domain: 0...(points.count - 1))
            .chartYScale(domain: (low - padding)...(high + padding))
            .chartXAxis { ChartAxis.x(values: tickIndexes(points, max: 6)) { points[$0].tick } }
            .chartYAxis { ChartAxis.y(count: 5) { "\(Int($0.rounded()))" } }
            .animation(reduceMotion ? nil : .easeOut(duration: 0.52), value: range)
            .chartTooltip(
              x: points.map(\.index),
              labels: points.map(\.label),
              selection: $selection,
              accessibilityLabel: "ACME",
              items: { [ChartTooltipItem("price", value: points[$0].price)] }
            ) { _ in
              EmptyView()
            }
          }
          .frame(height: 288)
          LazyVGrid(columns: [GridItem(.adaptive(minimum: 144), spacing: 24)], spacing: 0) {
            ForEach(stats, id: \.0) { term, value in
              HStack(spacing: 8) {
                Text(LocalizedStringKey(term))
                  .foregroundStyle(EsuissColor.mutedForeground)
                  .frame(maxWidth: .infinity, alignment: .leading)
                Text(verbatim: value)
                  .fontWeight(.semibold)
                  .monospacedDigit()
              }
              .textStyle(.sm)
              .padding(.vertical, 7)
              .overlay(alignment: .bottom) {
                EsuissColor.border.frame(height: 1)
              }
              .accessibilityElement(children: .combine)
            }
          }
        }
      }
    }
  }
}
