import Charts
import SwiftUI

private enum City: String, CaseIterable {
  case istanbul, ankara, izmir, antalya, erzurum

  var average: [Double] {
    switch self {
    case .istanbul: [6, 6, 8, 12, 17, 22, 24, 24, 21, 16, 12, 8]
    case .ankara: [0, 2, 6, 11, 16, 20, 24, 24, 19, 13, 7, 2]
    case .izmir: [9, 10, 12, 16, 21, 26, 28, 28, 24, 19, 14, 10]
    case .antalya: [10, 11, 13, 16, 21, 26, 29, 29, 25, 20, 15, 11]
    case .erzurum: [-9, -8, -2, 6, 11, 15, 20, 20, 15, 8, 1, -6]
    }
  }

  var spread: (Double, Double) {
    switch self {
    case .istanbul: (6, 0.6)
    case .ankara: (11, 1.6)
    case .izmir: (9, 1)
    case .antalya: (9, 0.9)
    case .erzurum: (12, 1.8)
    }
  }
}

private enum Mode: String, CaseIterable {
  case average, high, low

  var title: String {
    switch self {
    case .average: "Average"
    case .high: "High"
    case .low: "Low"
    }
  }
}

private let chartConfig: ChartConfig = [
  "istanbul": .init("Istanbul", color: EsuissColor.chart1),
  "ankara": .init("Ankara", color: Palette.purple500),
  "izmir": .init("Izmir", color: EsuissColor.chart2),
  "antalya": .init("Antalya", color: EsuissColor.chart4),
  "erzurum": .init("Erzurum", color: EsuissColor.chart3),
]

private func temperature(_ city: City, month: Int, mode: Mode) -> Double {
  let mean = city.average[month]
  if mode == .average { return mean }
  let season = sin((Double(month) - 0.5) / 12 * .pi)
  let range = city.spread.0 + city.spread.1 * 6 * season * season
  let value = mean + (mode == .high ? range / 2 : -range / 2)
  return (value * 10).rounded() / 10
}

public struct LineChartInteractive: View {
  @State private var visible: Set<City> = [.istanbul, .ankara, .antalya]
  @State private var mode: Mode = .average
  @State private var selection: Int?
  @Environment(\.locale) private var locale
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init() {}

  private var months: [Date] {
    (0..<12).compactMap { Calendar(identifier: .gregorian).date(from: DateComponents(year: 2026, month: $0 + 1, day: 1)) }
  }

  private func shortMonth(_ index: Int) -> String {
    months[index].formatted(.dateTime.month(.abbreviated).locale(locale))
  }

  private func longMonth(_ index: Int) -> String {
    months[index].formatted(.dateTime.month(.wide).locale(locale))
  }

  private var shown: [City] {
    City.allCases.filter { visible.contains($0) }
  }

  private var modeBinding: Binding<Mode?> {
    Binding(get: { mode }, set: { if let value = $0 { mode = value } })
  }

  private func toggle(_ city: City) {
    if visible.contains(city) {
      if visible.count > 1 { visible.remove(city) }
    } else {
      visible.insert(city)
    }
  }

  public var body: some View {
    Card(.filled, size: .sm) {
      VStack(alignment: .leading, spacing: 16) {
        VStack(alignment: .leading, spacing: 2) {
          Text("Monthly temperature")
            .textStyle(.lg, weight: .semibold)
          Text("\(mode.title) · °C · long-term")
            .textStyle(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        ToggleGroup(selection: modeBinding, size: .sm, spacing: 0) {
          ForEach(Mode.allCases, id: \.self) { item in
            ToggleGroupItem(LocalizedStringKey(item.title), value: item)
          }
        }
        .accessibilityLabel("Temperature")
      }
      .padding(.horizontal, 16)
      CardContent {
        VStack(alignment: .leading, spacing: 16) {
          ChartLegendLayout(horizontalSpacing: 8, verticalSpacing: 8, centered: false) {
            ForEach(City.allCases, id: \.self) { city in
              CityChip(
                label: chartConfig.label(city.rawValue),
                color: chartConfig.color(city.rawValue),
                isOn: visible.contains(city)
              ) {
                toggle(city)
              }
            }
          }
          .accessibilityElement(children: .contain)
          .accessibilityLabel("Cities")
          chart
          LazyVGrid(columns: [GridItem(.adaptive(minimum: 136), spacing: 12, alignment: .leading)], alignment: .leading, spacing: 12) {
            ForEach(shown, id: \.self) { city in
              stat(city)
            }
          }
        }
      }
    }
    .hapticFeedback(.selection, trigger: visible)
  }

  private var chart: some View {
    ChartContainer(config: chartConfig) {
      ChartAnimator(animationDuration: 650, animationEasing: .easeInOut) { progress in
        Chart {
          RuleMark(y: .value("Zero", 0))
            .lineStyle(StrokeStyle(lineWidth: 1))
            .foregroundStyle(EsuissColor.input)
          ForEach(shown, id: \.self) { city in
            ForEach(0..<12, id: \.self) { month in
              LineMark(
                x: .value("Month", month),
                y: .value("Temperature", temperature(city, month: month, mode: mode)),
                series: .value("City", city.rawValue)
              )
              .interpolationMethod(.monotone)
              .lineStyle(StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round))
              .foregroundStyle(chartConfig.color(city.rawValue))
            }
            if let selection {
              PointMark(x: .value("Month", selection), y: .value("Temperature", temperature(city, month: selection, mode: mode)))
                .symbol {
                  Circle()
                    .fill(chartConfig.color(city.rawValue))
                    .stroke(EsuissColor.muted, lineWidth: 2)
                    .frame(width: 12, height: 12)
                }
            }
          }
          .chartReveal(progress, x: 0...11)
        }
        .chartXScale(domain: 0...11, range: .plotDimension(padding: 8))
        .chartYScale(domain: -20...40)
        .chartXAxis { ChartAxis.x(values: [0, 2, 4, 6, 8, 10]) { shortMonth($0) } }
        .chartYAxis { ChartAxis.y(values: [-20.0, -10, 0, 10, 20, 30, 40]) { "\(Int($0))°" } }
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.65), value: mode)
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.3), value: visible)
        .chartTooltip(
          x: Array(0..<12),
          labels: (0..<12).map(longMonth),
          selection: $selection,
          accessibilityLabel: "Monthly temperature",
          items: { month in
            shown.map { ChartTooltipItem($0.rawValue, value: temperature($0, month: month, mode: mode)) }
          }
        ) { payload in
          ChartTooltipContent(payload, indicator: .line) { payload in
            Text(verbatim: longMonth(payload.index))
          } formatter: { item in
            Capsule()
              .fill(chartConfig.color(item.key))
              .frame(width: 3, height: 12)
            Text(LocalizedStringKey(chartConfig.label(item.key)))
              .foregroundStyle(EsuissColor.mutedForeground)
              .frame(maxWidth: .infinity, alignment: .leading)
            Text("\(item.value, format: .number)°")
              .scaledFont(TextStyle.xs, weight: .semibold)
              .monospacedDigit()
          }
        }
      }
    }
    .frame(height: 288)
  }

  private func stat(_ city: City) -> some View {
    let temperatures = (0..<12).map { temperature(city, month: $0, mode: mode) }
    let value: String
    if let selection {
      value = "\(Int(temperatures[selection].rounded()))° · \(longMonth(selection))"
    } else {
      value = "\(Int((temperatures.min() ?? 0).rounded()))° / \(Int((temperatures.max() ?? 0).rounded()))°"
    }
    return VStack(alignment: .leading, spacing: 2) {
      HStack(spacing: 6) {
        Circle()
          .fill(chartConfig.color(city.rawValue))
          .frame(width: 8, height: 8)
        Text(LocalizedStringKey(chartConfig.label(city.rawValue)))
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      Text(verbatim: value)
        .textStyle(.base, weight: .semibold)
        .monospacedDigit()
    }
    .accessibilityElement(children: .combine)
  }
}

private struct CityChip: View {
  let label: String
  let color: Color
  let isOn: Bool
  let action: () -> Void

  var body: some View {
    Button(action: action) {
      HStack(spacing: 6) {
        Circle()
          .fill(isOn ? color : EsuissColor.border)
          .frame(width: 8, height: 8)
        Text(LocalizedStringKey(label))
          .textStyle(.sm, weight: .semibold)
          .foregroundStyle(EsuissColor.foreground)
      }
      .padding(.horizontal, 12)
      .frame(height: 32)
    }
    .buttonStyle(CityChipStyle(color: color, isOn: isOn))
    .accessibilityAddTraits(isOn ? .isSelected : [])
  }
}

private struct CityChipStyle: ButtonStyle {
  let color: Color
  let isOn: Bool

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .background(isOn ? color.opacity(0.16) : EsuissColor.secondary, in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
      .opacity(configuration.isPressed ? 0.8 : 1)
      .contentShape(RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
  }
}
