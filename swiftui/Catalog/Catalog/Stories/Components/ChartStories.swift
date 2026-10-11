import Charts
import EsuissUI
import PhosphorSwift
import SwiftUI

enum ChartStories {
  static let group = StoryGroup(.components, "Chart", stories: [
    Story("TooltipDot") {
      ChartStackedTooltip(title: "Dot indicator", description: "indicator=\"dot\"", defaultIndex: 2) { payload in
        ChartTooltipContent(payload, indicator: .dot)
      }
    },
    Story("TooltipLine") {
      ChartStackedTooltip(title: "Line indicator", description: "indicator=\"line\"", defaultIndex: 2) { payload in
        ChartTooltipContent(payload, indicator: .line)
      }
    },
    Story("TooltipDashed") {
      ChartStackedTooltip(title: "Dashed indicator", description: "indicator=\"dashed\"", defaultIndex: 2) { payload in
        ChartTooltipContent(payload, indicator: .dashed)
      }
    },
    Story("TooltipNoIndicator") {
      ChartStackedTooltip(title: "No indicator", description: "Just the name and value", defaultIndex: 2) { payload in
        ChartTooltipContent(payload, hideIndicator: true)
      }
    },
    Story("TooltipNoLabel") {
      ChartStackedTooltip(title: "No label", description: "The month is hidden", defaultIndex: 2) { payload in
        ChartTooltipContent(payload, hideLabel: true)
      }
    },
    Story("TooltipLabelFormatter") {
      ChartLabelFormatterDemo()
    },
    Story("TooltipFormatter") {
      ChartFormatterDemo()
    },
    Story("TooltipIcons") {
      ChartStackedTooltip(
        title: "With icons",
        description: "An icon instead of a color",
        config: chartDeviceIcons,
        defaultIndex: 3
      ) { payload in
        ChartTooltipContent(payload)
      }
    },
    Story("TooltipCustom") {
      ChartCustomDemo()
    },
    Story("TooltipInteractive") {
      ChartInteractiveDemo()
    },
  ])
}

private let chartEnglish = Locale(identifier: "en_US")

private let chartMonthData: [(month: String, desktop: Double, mobile: Double)] = [
  ("January", 186, 80),
  ("February", 305, 200),
  ("March", 237, 120),
  ("April", 173, 190),
  ("May", 209, 130),
  ("June", 264, 140),
]

private let chartDevices: ChartConfig = [
  "desktop": .init("Desktop", color: .blue),
  "mobile": .init("Mobile", color: .teal),
]

private let chartDeviceIcons: ChartConfig = [
  "desktop": .init("Desktop", color: .blue, icon: Ph.desktop.regular),
  "mobile": .init("Mobile", color: .teal, icon: Ph.deviceMobile.regular),
]

private let chartEnergyValues: [Double] = [512, 604, 455, 389, 662, 598, 431, 520, 690, 447, 575, 402, 633, 558]

private let chartEnergyConfig: ChartConfig = [
  "energy": .init("Active energy", color: .red),
]

private func chartDate(year: Int, month: Int, day: Int) -> Date {
  let calendar = Foundation.Calendar(identifier: .gregorian)
  let first = calendar.date(from: DateComponents(year: year, month: month, day: 1)) ?? .now
  return calendar.date(byAdding: .day, value: day - 1, to: first) ?? first
}

private struct ChartStackedTooltip<Tooltip: View>: View {
  let title: String
  let description: String
  var config = chartDevices
  let defaultIndex: Int
  @ViewBuilder let tooltip: (ChartTooltipPayload) -> Tooltip

  var body: some View {
    Card(.filled, size: .sm) {
      CardHeader(LocalizedStringKey(title), description: LocalizedStringKey(description))
      CardContent {
        ChartContainer(config: config) {
          Chart {
            ForEach(chartMonthData.indices, id: \.self) { index in
              let item = chartMonthData[index]
              BarMark(
                x: .value("Month", item.month),
                yStart: .value("Start", 0),
                yEnd: .value("Desktop", item.desktop),
                width: .fixed(30)
              )
              .clipShape(UnevenRoundedRectangle(bottomLeadingRadius: 4, bottomTrailingRadius: 4, style: .continuous))
              .foregroundStyle(config.color("desktop"))
              BarMark(
                x: .value("Month", item.month),
                yStart: .value("Start", item.desktop),
                yEnd: .value("Mobile", item.desktop + item.mobile),
                width: .fixed(30)
              )
              .clipShape(UnevenRoundedRectangle(topLeadingRadius: 4, topTrailingRadius: 4, style: .continuous))
              .foregroundStyle(config.color("mobile"))
            }
          }
          .chartYScale(range: .plotDimension(endPadding: 70))
          .chartXAxis { ChartAxis.x(values: chartMonthData.map(\.month)) { String($0.prefix(3)) } }
          .chartYAxis(.hidden)
          .chartTooltip(
            x: chartMonthData.map(\.month),
            defaultIndex: defaultIndex,
            cursor: false,
            accessibilityLabel: title,
            items: { index in
              [
                ChartTooltipItem("desktop", value: chartMonthData[index].desktop),
                ChartTooltipItem("mobile", value: chartMonthData[index].mobile),
              ]
            },
            content: tooltip
          )
        }
        .frame(height: 208)
      }
    }
  }
}

private struct ChartLabelFormatterDemo: View {
  @State private var selection: Int? = 8

  var body: some View {
    let dates = chartEnergyValues.indices.map { chartDate(year: 2026, month: 9, day: 23 + $0) }
    let color = chartEnergyConfig.color("energy")
    Card(.filled, size: .sm) {
      CardHeader("Custom label", description: "The date written out in full")
      CardContent {
        ChartContainer(config: chartEnergyConfig) {
          Chart {
            ForEach(chartEnergyValues.indices, id: \.self) { index in
              AreaMark(x: .value("Day", index), y: .value("Energy", chartEnergyValues[index]))
                .interpolationMethod(.monotone)
                .foregroundStyle(
                  LinearGradient(colors: [color.opacity(0.38), color.opacity(0.02)], startPoint: .top, endPoint: .bottom)
                )
              LineMark(x: .value("Day", index), y: .value("Energy", chartEnergyValues[index]))
                .interpolationMethod(.monotone)
                .lineStyle(StrokeStyle(lineWidth: 2))
                .foregroundStyle(color)
            }
            if let selection {
              PointMark(x: .value("Day", selection), y: .value("Energy", chartEnergyValues[selection]))
                .symbolSize(64)
                .foregroundStyle(color)
            }
          }
          .chartXScale(domain: 0...(chartEnergyValues.count - 1), range: .plotDimension(padding: 12))
          .chartYScale(range: .plotDimension(endPadding: 70))
          .chartXAxis {
            ChartAxis.x(values: Array(stride(from: 0, to: chartEnergyValues.count, by: 3))) {
              "\(Foundation.Calendar(identifier: .gregorian).component(.day, from: dates[$0]))"
            }
          }
          .chartYAxis(.hidden)
          .chartTooltip(
            x: Array(chartEnergyValues.indices),
            selection: $selection,
            defaultIndex: 8,
            accessibilityLabel: "Custom label",
            items: { [ChartTooltipItem("energy", value: chartEnergyValues[$0])] }
          ) { payload in
            ChartTooltipContent(payload, indicator: .line) { payload in
              Text(verbatim: dates[payload.index].formatted(
                .dateTime.weekday(.wide).month(.wide).day().locale(chartEnglish)
              ))
            }
          }
        }
        .frame(height: 208)
      }
    }
  }
}

private struct ChartFormatterDemo: View {
  private let week = Array(chartEnergyValues.suffix(7))

  var body: some View {
    let labels = week.indices.map {
      chartDate(year: 2026, month: 10, day: $0).formatted(.dateTime.weekday(.abbreviated).locale(chartEnglish))
    }
    Card(.filled, size: .sm) {
      CardHeader("With units", description: "A unit next to the value")
      CardContent {
        ChartContainer(config: chartEnergyConfig) {
          Chart {
            ForEach(week.indices, id: \.self) { index in
              BarMark(x: .value("Day", labels[index]), y: .value("Energy", week[index]), width: .fixed(26))
                .clipShape(RoundedRectangle(cornerRadius: 4, style: .continuous))
                .foregroundStyle(chartEnergyConfig.color("energy"))
            }
          }
          .chartYScale(range: .plotDimension(endPadding: 70))
          .chartXAxis { ChartAxis.x(values: labels) { $0 } }
          .chartYAxis(.hidden)
          .chartTooltip(
            x: labels,
            defaultIndex: 3,
            cursor: false,
            accessibilityLabel: "With units",
            items: { [ChartTooltipItem("energy", value: week[$0])] }
          ) { payload in
            ChartTooltipContent(payload, hideLabel: true) { item in
              HStack(alignment: .firstTextBaseline, spacing: 6) {
                Text("Active energy")
                  .foregroundStyle(Color.labelSecondary)
                Text(verbatim: item.value.formatted(.number.locale(chartEnglish)))
                  .font(TextStyle.xs.font(weight: .semibold))
                  .monospacedDigit()
                  .foregroundStyle(Color.label)
                Text("kcal")
                  .font(TextStyle.xs2.font())
                  .foregroundStyle(Color.labelSecondary)
              }
            }
          }
        }
        .frame(height: 208)
      }
    }
  }
}

private struct ChartCustomDemo: View {
  private let steps: [(day: String, steps: Double)] = [
    ("Monday", 8412),
    ("Tuesday", 10230),
    ("Wednesday", 6120),
    ("Thursday", 12480),
    ("Friday", 9050),
    ("Saturday", 14320),
    ("Sunday", 4870),
  ]
  private let config: ChartConfig = ["steps": .init("Steps", color: .orange)]

  @Environment(\.colorScheme) private var colorScheme

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
    Card(.filled, size: .sm) {
      CardHeader("Custom content", description: "A tooltip built from scratch")
      CardContent {
        ChartContainer(config: config) {
          Chart {
            ForEach(steps.indices, id: \.self) { index in
              BarMark(x: .value("Day", steps[index].day), y: .value("Steps", steps[index].steps), width: .fixed(26))
                .clipShape(RoundedRectangle(cornerRadius: 4, style: .continuous))
                .foregroundStyle(config.color("steps"))
            }
          }
          .chartYScale(range: .plotDimension(endPadding: 70))
          .chartXAxis { ChartAxis.x(values: steps.map(\.day)) { String($0.prefix(3)) } }
          .chartYAxis(.hidden)
          .chartTooltip(
            x: steps.map(\.day),
            defaultIndex: 5,
            cursor: false,
            accessibilityLabel: "Custom content",
            items: { [ChartTooltipItem("steps", value: steps[$0].steps)] }
          ) { payload in
            VStack(alignment: .leading, spacing: 0) {
              Text("TOTAL")
                .font(TextStyle.xs2.font(weight: .semibold))
                .tracking(0.5)
                .foregroundStyle(Color.labelSecondary)
              HStack(alignment: .firstTextBaseline, spacing: 4) {
                Text(verbatim: payload.total.formatted(.number.locale(chartEnglish)))
                  .font(TextStyle.xl2.font(weight: .semibold))
                  .monospacedDigit()
                  .foregroundStyle(Color.label)
                Text("steps")
                  .font(TextStyle.xs.font(weight: .semibold))
                  .foregroundStyle(Color.labelSecondary)
              }
              Text(verbatim: payload.label)
                .font(TextStyle.xs.font())
                .foregroundStyle(Color.labelSecondary)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .frame(minWidth: 112, alignment: .leading)
            .background(Color.surfaceRaised, in: shape)
            .overlay {
              shape.strokeBorder(Color.label.opacity(colorScheme == .dark ? 0.1 : 0.05))
            }
            .shadow(.lg)
            .fixedSize()
          }
        }
        .frame(height: 208)
      }
    }
  }
}

private struct ChartInteractiveDemo: View {
  private let quarters: [(quarter: String, phones: Double, laptops: Double, services: Double)] = [
    ("Q1 25", 69.1, 9, 26.3),
    ("Q2 25", 46.8, 8, 26.6),
    ("Q3 25", 44.6, 8, 27.4),
    ("Q4 25", 46.2, 8.7, 28.8),
    ("Q1 26", 71, 9.5, 29.1),
    ("Q2 26", 49.4, 8.6, 29.4),
    ("Q3 26", 47.3, 8.9, 30.1),
    ("Q4 26", 49, 9.3, 31.2),
  ]
  private let config: ChartConfig = [
    "phones": .init("Phones", color: .blue),
    "laptops": .init("Laptops", color: .teal),
    "services": .init("Services", color: .purple),
  ]
  private let order = ["services", "laptops", "phones"]

  @State private var indicator: ChartTooltipIndicator = .dot
  @State private var showTotal = true
  @State private var hideLabel = false
  @State private var hideIndicator = false

  private func value(_ key: String, _ index: Int) -> Double {
    switch key {
    case "phones": quarters[index].phones
    case "laptops": quarters[index].laptops
    default: quarters[index].services
    }
  }

  private var indicatorSelection: Binding<ChartTooltipIndicator?> {
    Binding(
      get: { indicator },
      set: { next in
        if let next { indicator = next }
      }
    )
  }

  var body: some View {
    Card(.filled, size: .sm) {
      VStack(alignment: .leading, spacing: 2) {
        Text("Tooltip settings")
          .textStyle(.lg, weight: .semibold)
        Text("Quarterly revenue · billions · sample data. Change the settings and touch the bars.")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
      .padding(.horizontal, 16)
      CardContent {
        VStack(alignment: .leading, spacing: 20) {
          FlowRow(spacing: 12) {
            VStack(alignment: .leading, spacing: 6) {
              Text("Indicator")
                .textStyle(.xs, weight: .semibold)
                .foregroundStyle(Color.labelSecondary)
              ToggleGroup(selection: indicatorSelection, size: .sm, spacing: 0) {
                ToggleGroupItem("Dot", value: ChartTooltipIndicator.dot)
                ToggleGroupItem("Line", value: ChartTooltipIndicator.line)
                ToggleGroupItem("Dashed", value: ChartTooltipIndicator.dashed)
              }
              .accessibilityLabel(Text("Indicator"))
            }
            ChartSetting(label: "Total in title", isOn: $showTotal)
            ChartSetting(label: "Hide title", isOn: $hideLabel)
            ChartSetting(label: "Hide indicator", isOn: $hideIndicator)
          }
          ChartContainer(config: config) {
            Chart {
              ForEach(quarters.indices, id: \.self) { index in
                ForEach(order, id: \.self) { key in
                  let start = order.prefix { $0 != key }.reduce(0) { $0 + value($1, index) }
                  BarMark(
                    x: .value("Quarter", quarters[index].quarter),
                    yStart: .value("Start", start),
                    yEnd: .value("End", start + value(key, index)),
                    width: .fixed(30)
                  )
                  .clipShape(
                    UnevenRoundedRectangle(
                      topLeadingRadius: key == "phones" ? 4 : 0,
                      bottomLeadingRadius: key == "services" ? 4 : 0,
                      bottomTrailingRadius: key == "services" ? 4 : 0,
                      topTrailingRadius: key == "phones" ? 4 : 0,
                      style: .continuous
                    )
                  )
                  .foregroundStyle(config.color(key))
                }
              }
            }
            .chartXAxis { ChartAxis.x(values: [0, 2, 4, 6].map { quarters[$0].quarter }) { $0 } }
            .chartYAxis { ChartAxis.y(count: 5) { "\(Int($0))B" } }
            .chartTooltip(
              x: quarters.map(\.quarter),
              defaultIndex: 4,
              cursor: false,
              accessibilityLabel: "Quarterly revenue",
              items: { index in order.map { ChartTooltipItem($0, value: value($0, index)) } }
            ) { payload in
              if showTotal {
                ChartTooltipContent(payload, indicator: indicator, hideLabel: hideLabel, hideIndicator: hideIndicator) {
                  payload in
                  HStack(spacing: 16) {
                    Text(verbatim: payload.label)
                    Spacer(minLength: 0)
                    Text("\(payload.total, format: .number.precision(.fractionLength(0...1)))B")
                      .monospacedDigit()
                  }
                }
              } else {
                ChartTooltipContent(payload, indicator: indicator, hideLabel: hideLabel, hideIndicator: hideIndicator)
              }
            }
            ChartLegendContent()
          }
          .frame(height: 288)
        }
      }
    }
  }
}

private struct ChartSetting: View {
  let label: LocalizedStringKey
  @Binding var isOn: Bool

  var body: some View {
    Toggle(isOn: $isOn) {
      Text(label).textStyle(.sm)
    }
    .toggleStyle(.switch(size: .sm))
  }
}
