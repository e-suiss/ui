import Charts
import PhosphorSwift
import SwiftUI
import XCTest

@testable import EsuissUI

private let monthly: [(month: String, desktop: Double, mobile: Double)] = [
  ("January", 186, 80),
  ("February", 305, 200),
  ("March", 237, 120),
  ("April", 173, 190),
  ("May", 209, 130),
  ("June", 264, 140),
]

private let devices: ChartConfig = [
  "desktop": .init("Desktop", color: .blue),
  "mobile": .init("Mobile", color: .teal),
]

private let deviceIcons: ChartConfig = [
  "desktop": .init("Desktop", color: .blue, icon: Ph.desktop.regular),
  "mobile": .init("Mobile", color: .teal, icon: Ph.deviceMobile.regular),
]

private struct StackedTooltipCase<Tooltip: View>: View {
  let title: LocalizedStringKey
  let description: LocalizedStringKey
  var config = devices
  let defaultIndex: Int
  @ViewBuilder let tooltip: (ChartTooltipPayload) -> Tooltip

  var body: some View {
    Card(.filled, size: .sm) {
      CardHeader(title, description: description)
      CardContent {
        ChartContainer(config: config) {
          Chart {
            ForEach(monthly.indices, id: \.self) { index in
              let item = monthly[index]
              BarMark(x: .value("Month", item.month), yStart: .value("Start", 0), yEnd: .value("Desktop", item.desktop), width: .fixed(30))
                .clipShape(UnevenRoundedRectangle(bottomLeadingRadius: 4, bottomTrailingRadius: 4))
                .foregroundStyle(config.color("desktop"))
              BarMark(x: .value("Month", item.month), yStart: .value("Start", item.desktop), yEnd: .value("Mobile", item.desktop + item.mobile), width: .fixed(30))
                .clipShape(UnevenRoundedRectangle(topLeadingRadius: 4, topTrailingRadius: 4))
                .foregroundStyle(config.color("mobile"))
            }
          }
          .chartYScale(range: .plotDimension(endPadding: 70))
          .chartXAxis { ChartAxis.x(values: monthly.map(\.month)) { String($0.prefix(3)) } }
          .chartYAxis(.hidden)
          .chartTooltip(
            x: monthly.map(\.month),
            defaultIndex: defaultIndex,
            cursor: false,
            items: { index in
              [
                ChartTooltipItem("desktop", value: monthly[index].desktop),
                ChartTooltipItem("mobile", value: monthly[index].mobile),
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

private let energy: [Double] = [512, 604, 455, 389, 662, 598, 431, 520, 690, 447, 575, 402, 633, 558]

private let energyConfig: ChartConfig = [
  "energy": .init("Active energy", color: .red),
]

private func energyDate(_ index: Int, from start: DateComponents) -> Date {
  let calendar = Calendar(identifier: .gregorian)
  let first = calendar.date(from: start) ?? .now
  return calendar.date(byAdding: .day, value: index, to: first) ?? first
}

private struct TooltipFormatterCase: View {
  private let week = Array(energy.suffix(7))

  var body: some View {
    let labels = week.indices.map { energyDate($0, from: DateComponents(year: 2026, month: 10, day: 0)).formatted(.dateTime.weekday(.abbreviated).locale(Locale(identifier: "en_US"))) }
    Card(.filled, size: .sm) {
      CardHeader("With units", description: "A unit next to the value")
      CardContent {
        ChartContainer(config: energyConfig) {
          Chart {
            ForEach(week.indices, id: \.self) { index in
              BarMark(x: .value("Day", labels[index]), y: .value("Energy", week[index]), width: .fixed(26))
                .clipShape(RoundedRectangle(cornerRadius: 4))
                .foregroundStyle(energyConfig.color("energy"))
            }
          }
          .chartYScale(range: .plotDimension(endPadding: 70))
          .chartXAxis { ChartAxis.x(values: labels) { $0 } }
          .chartYAxis(.hidden)
          .chartTooltip(
            x: labels,
            defaultIndex: 3,
            cursor: false,
            items: { [ChartTooltipItem("energy", value: week[$0])] }
          ) { payload in
            ChartTooltipContent(payload, hideLabel: true) { item in
              HStack(alignment: .firstTextBaseline, spacing: 6) {
                Text("Active energy")
                  .foregroundStyle(Color.labelSecondary)
                Text(item.value, format: .number)
                  .font(TextStyle.xs.font(weight: .semibold))
                  .monospacedDigit()
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

private struct TooltipLabelFormatterCase: View {
  var body: some View {
    let dates = energy.indices.map { energyDate($0, from: DateComponents(year: 2026, month: 9, day: 23)) }
    let color = energyConfig.color("energy")
    Card(.filled, size: .sm) {
      CardHeader("Custom label", description: "The date written out in full")
      CardContent {
        ChartContainer(config: energyConfig) {
          Chart {
            ForEach(energy.indices, id: \.self) { index in
              AreaMark(x: .value("Day", index), y: .value("Energy", energy[index]))
                .interpolationMethod(.monotone)
                .foregroundStyle(LinearGradient(colors: [color.opacity(0.38), color.opacity(0.02)], startPoint: .top, endPoint: .bottom))
              LineMark(x: .value("Day", index), y: .value("Energy", energy[index]))
                .interpolationMethod(.monotone)
                .lineStyle(StrokeStyle(lineWidth: 2))
                .foregroundStyle(color)
            }
            PointMark(x: .value("Day", 8), y: .value("Energy", energy[8]))
              .symbolSize(64)
              .foregroundStyle(color)
          }
          .chartXScale(domain: 0...(energy.count - 1), range: .plotDimension(padding: 12))
          .chartYScale(range: .plotDimension(endPadding: 70))
          .chartXAxis {
            ChartAxis.x(values: Array(stride(from: 0, to: energy.count, by: 3))) {
              "\(Calendar(identifier: .gregorian).component(.day, from: dates[$0]))"
            }
          }
          .chartYAxis(.hidden)
          .chartTooltip(
            x: Array(energy.indices),
            defaultIndex: 8,
            items: { [ChartTooltipItem("energy", value: energy[$0])] }
          ) { payload in
            ChartTooltipContent(payload, indicator: .line) { payload in
              Text(verbatim: dates[payload.index].formatted(.dateTime.weekday(.wide).month(.wide).day().locale(Locale(identifier: "en_US"))))
            }
          }
        }
        .frame(height: 208)
      }
    }
  }
}

private struct TooltipCustomCase: View {
  private let steps: [(day: String, steps: Double)] = [
    ("Monday", 8412), ("Tuesday", 10230), ("Wednesday", 6120), ("Thursday", 12480),
    ("Friday", 9050), ("Saturday", 14320), ("Sunday", 4870),
  ]
  private let config: ChartConfig = ["steps": .init("Steps", color: .orange)]

  var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Custom content", description: "A tooltip built from scratch")
      CardContent {
        ChartContainer(config: config) {
          Chart {
            ForEach(steps.indices, id: \.self) { index in
              BarMark(x: .value("Day", steps[index].day), y: .value("Steps", steps[index].steps), width: .fixed(26))
                .clipShape(RoundedRectangle(cornerRadius: 4))
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
            items: { [ChartTooltipItem("steps", value: steps[$0].steps)] }
          ) { payload in
            VStack(alignment: .leading, spacing: 0) {
              Text("TOTAL")
                .font(TextStyle.xs2.font(weight: .semibold))
                .foregroundStyle(Color.labelSecondary)
              HStack(alignment: .firstTextBaseline, spacing: 4) {
                Text(payload.total, format: .number)
                  .font(TextStyle.xl2.font(weight: .semibold))
                  .monospacedDigit()
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
            .background(Color.surfaceRaised, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
            .overlay {
              RoundedRectangle(cornerRadius: Radius.xl, style: .continuous).strokeBorder(Color.label.opacity(0.08))
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

private struct TooltipInteractiveCase: View {
  private let quarters: [(quarter: String, phones: Double, laptops: Double, services: Double)] = [
    ("Q1 25", 69.1, 9, 26.3), ("Q2 25", 46.8, 8, 26.6), ("Q3 25", 44.6, 8, 27.4), ("Q4 25", 46.2, 8.7, 28.8),
    ("Q1 26", 71, 9.5, 29.1), ("Q2 26", 49.4, 8.6, 29.4), ("Q3 26", 47.3, 8.9, 30.1), ("Q4 26", 49, 9.3, 31.2),
  ]
  private let config: ChartConfig = [
    "phones": .init("Phones", color: .blue),
    "laptops": .init("Laptops", color: .teal),
    "services": .init("Services", color: .purple),
  ]
  @State private var indicator: ChartTooltipIndicator? = .dot
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

  var body: some View {
    let order = ["services", "laptops", "phones"]
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
          VStack(alignment: .leading, spacing: 6) {
            Text("Indicator")
              .textStyle(.xs, weight: .semibold)
              .foregroundStyle(Color.labelSecondary)
            ToggleGroup(selection: $indicator, size: .sm, spacing: 0) {
              ToggleGroupItem("Dot", value: ChartTooltipIndicator.dot)
              ToggleGroupItem("Line", value: ChartTooltipIndicator.line)
              ToggleGroupItem("Dashed", value: ChartTooltipIndicator.dashed)
            }
          }
          VStack(alignment: .leading, spacing: 10) {
            Toggle("Total in title", isOn: $showTotal)
            Toggle("Hide title", isOn: $hideLabel)
            Toggle("Hide indicator", isOn: $hideIndicator)
          }
          .toggleStyle(.switch(size: .sm))
          .textStyle(.sm)
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
                  .clipShape(UnevenRoundedRectangle(
                    topLeadingRadius: key == "phones" ? 4 : 0,
                    bottomLeadingRadius: key == "services" ? 4 : 0,
                    bottomTrailingRadius: key == "services" ? 4 : 0,
                    topTrailingRadius: key == "phones" ? 4 : 0
                  ))
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
              items: { index in order.map { ChartTooltipItem($0, value: value($0, index)) } }
            ) { payload in
              if showTotal {
                ChartTooltipContent(payload, indicator: indicator ?? .dot, hideLabel: hideLabel, hideIndicator: hideIndicator) { payload in
                  HStack(spacing: 16) {
                    Text(verbatim: payload.label)
                    Spacer(minLength: 0)
                    Text("\(payload.total, format: .number.precision(.fractionLength(1)))B")
                      .monospacedDigit()
                  }
                }
              } else {
                ChartTooltipContent(payload, indicator: indicator ?? .dot, hideLabel: hideLabel, hideIndicator: hideIndicator)
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

private struct TooltipCases: View {
  var body: some View {
    StackedTooltipCase(title: "Dot indicator", description: "The default", defaultIndex: 2) { payload in
      ChartTooltipContent(payload, indicator: .dot)
    }
    StackedTooltipCase(title: "Line indicator", description: "indicator=\"line\"", defaultIndex: 2) { payload in
      ChartTooltipContent(payload, indicator: .line)
    }
    StackedTooltipCase(title: "Dashed indicator", description: "indicator=\"dashed\"", defaultIndex: 2) { payload in
      ChartTooltipContent(payload, indicator: .dashed)
    }
    StackedTooltipCase(title: "No indicator", description: "Just the name and value", defaultIndex: 2) { payload in
      ChartTooltipContent(payload, hideIndicator: true)
    }
    StackedTooltipCase(title: "No label", description: "The month is hidden", defaultIndex: 2) { payload in
      ChartTooltipContent(payload, hideLabel: true)
    }
    StackedTooltipCase(title: "With icons", description: "An icon instead of a color", config: deviceIcons, defaultIndex: 3) { payload in
      ChartTooltipContent(payload)
    }
    TooltipFormatterCase()
    TooltipLabelFormatterCase()
    TooltipCustomCase()
    TooltipInteractiveCase()
  }
}

private let pieDevices: [(device: String, users: Double)] = [
  ("phone", 275), ("laptop", 200), ("tablet", 187), ("watch", 173), ("other", 90),
]

private let pieConfig: ChartConfig = [
  "phone": .init("Phone", color: .blue),
  "laptop": .init("Laptop", color: .teal),
  "tablet": .init("Tablet", color: .indigo),
  "watch": .init("Watch", color: .orange),
  "other": .init("Other", color: .gray),
]

private struct PieTooltipCase: View {
  let title: LocalizedStringKey
  let defaultIndex: Int
  var half = false

  var body: some View {
    let total = pieDevices.reduce(0) { $0 + $1.users }
    Card(.filled, size: .sm) {
      CardHeader(title, description: "defaultIndex \(defaultIndex)")
      CardContent {
        ChartContainer(config: pieConfig) {
          Chart {
            ForEach(pieDevices, id: \.device) { item in
              SectorMark(angle: .value("Users", item.users), innerRadius: .ratio(0.58), outerRadius: .ratio(0.85), angularInset: 0.75)
                .foregroundStyle(pieConfig.color(item.device))
            }
            if half {
              SectorMark(angle: .value("Users", total))
                .foregroundStyle(.clear)
            }
          }
          .chartTooltip(
            angle: pieDevices.map(\.users),
            labels: pieDevices.map { pieConfig.label($0.device) },
            startAngle: .degrees(half ? -90 : 0),
            endAngle: .degrees(half ? 90 : 360),
            innerRadius: 0.58,
            outerRadius: 0.85,
            defaultIndex: defaultIndex,
            items: { [ChartTooltipItem(pieDevices[$0].device, value: pieDevices[$0].users)] }
          ) { payload in
            ChartTooltipContent(payload, hideLabel: true)
          }
          .padding(5)
        }
        .frame(height: 208)
      }
    }
  }
}

private struct RadialTooltipCase: View {
  var body: some View {
    let config: ChartConfig = [
      "phone": .init("Phone", color: .blue),
      "laptop": .init("Laptop", color: .teal),
      "tablet": .init("Tablet", color: .indigo),
      "watch": .init("Watch", color: .orange),
    ]
    Card(.filled, size: .sm) {
      CardHeader("Radial tooltip", description: "defaultIndex 2")
      CardContent {
        ChartContainer(config: config) {
          RadialBarChart(
            pieDevices.prefix(4).map { RadialBar($0.device, value: $0.users) },
            innerRadius: 0.25,
            outerRadius: 1,
            barSize: 12,
            rounded: true,
            track: .control,
            defaultIndex: 2
          ) { payload in
            ChartTooltipContent(payload, hideLabel: true)
          }
        }
        .frame(height: 208)
      }
    }
  }
}

private let radarSkills: [(skill: String, thisMonth: Double, lastMonth: Double)] = [
  ("Cardio", 86, 72),
  ("Strength", 62, 58),
  ("Flexibility", 48, 55),
  ("Balance", 70, 60),
  ("Endurance", 80, 66),
  ("Speed", 74, 70),
]

private struct RadarTooltipCase: View {
  let title: LocalizedStringKey
  let defaultIndex: Int
  var dots = false

  var body: some View {
    let config: ChartConfig = [
      "thisMonth": .init("This month", color: .green),
      "lastMonth": .init("Last month", color: .gray),
    ]
    Card(.filled, size: .sm) {
      CardHeader(title, description: "defaultIndex \(defaultIndex)")
      CardContent {
        ChartContainer(config: config) {
          RadarChart(
            [
              Radar("lastMonth", values: radarSkills.map(\.lastMonth), fillOpacity: 0.18, strokeWidth: 2, dot: dots ? 4 : nil),
              Radar("thisMonth", values: radarSkills.map(\.thisMonth), fillOpacity: 0.18, strokeWidth: 2, dot: dots ? 4 : nil),
            ],
            labels: radarSkills.map(\.skill),
            outerRadius: 0.7,
            defaultIndex: defaultIndex
          ) { payload in
            ChartTooltipContent(payload, indicator: .line)
          }
        }
        .frame(height: 224)
      }
    }
  }
}

@MainActor
final class ChartsGalleryTests: XCTestCase {
  private var output: String {
    ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
  }

  private func render<V: View>(_ view: V, name: String) throws {
    for scheme in [ColorScheme.light, .dark] {
      let renderer = ImageRenderer(content: view
        .padding(16)
        .background(Color.surface)
        .environment(\.colorScheme, scheme)
        .environment(\.locale, Locale(identifier: "en_US"))
        .environment(\.chartAnimationActive, false))
      renderer.scale = 2
      let data = try XCTUnwrap(renderer.uiImage?.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  private func board<V: View>(@ViewBuilder _ content: () -> V) -> some View {
    LazyVGrid(
      columns: [GridItem(.fixed(370), spacing: 16, alignment: .top), GridItem(.fixed(370), alignment: .top)],
      alignment: .leading,
      spacing: 16
    ) {
      content()
    }
    .frame(width: 756)
  }

  func testRendersTooltipGallery() throws {
    try render(board { TooltipCases() }, name: "charts-tooltip")
  }

  func testRendersLineGallery() throws {
    try render(board {
      LineChartDefault()
      LineChartLinear()
      LineChartStep()
      LineChartDots()
      LineChartLabeled()
      LineChartMultiple()
      LineChartGoal()
      LineChartGoalDots()
      LineChartForecast()
      LineChartInteractive()
    }, name: "charts-line")
  }

  func testRendersAreaGallery() throws {
    try render(board {
      AreaChartDefault()
      AreaChartLinear()
      AreaChartStep()
      AreaChartAxes()
      AreaChartGradient()
      AreaChartStacked()
      AreaChartStackedExpand()
      AreaChartRange()
      AreaChartSparkline()
      AreaChartInteractive()
    }, name: "charts-area")
  }

  func testRendersBarGallery() throws {
    try render(board {
      BarChartDefault()
      BarChartLabeled()
      BarChartMultiple()
      BarChartStacked()
      BarChartNegative()
      BarChartHorizontal()
      BarChartHourly()
      BarChartRange()
      BarChartActive()
      BarChartInteractive()
    }, name: "charts-bar")
  }

  func testRendersPieGallery() throws {
    try render(board {
      PieChartDefault()
      PieChartDonut()
      PieChartDonutText()
      PieChartSeparated()
      PieChartLabel()
      PieChartLegend()
      PieChartNested()
      PieChartHalf()
      PieChartActive()
      PieChartInteractive()
      PieTooltipCase(title: "Pie tooltip", defaultIndex: 1)
      PieTooltipCase(title: "Pie tooltip, left slice", defaultIndex: 3)
      PieTooltipCase(title: "Half pie tooltip", defaultIndex: 0, half: true)
    }, name: "charts-pie")
  }

  func testRendersRadialGallery() throws {
    try render(board {
      RadialChartDefault()
      RadialChartLabel()
      RadialChartTinted()
      RadialChartStacked()
      RadialChartGauge()
      RadialChartProgress()
      RadialChartText()
      RadialChartBatteries()
      RadialChartRings()
      RadialChartInteractive(selected: 6, filled: true)
      RadialTooltipCase()
    }, name: "charts-radial")
  }

  func testRendersRadarGallery() throws {
    try render(board {
      RadarChartDefault()
      RadarChartDots()
      RadarChartGridCircle()
      RadarChartGridFilled()
      RadarChartGridNone()
      RadarChartLegend()
      RadarChartLinesOnly()
      RadarChartMultiple()
      RadarChartRadiusAxis()
      RadarTooltipCase(title: "Radar tooltip, right spoke", defaultIndex: 1)
      RadarTooltipCase(title: "Radar tooltip, left spoke", defaultIndex: 4, dots: true)
      RadarTooltipCase(title: "Radar tooltip, top spoke", defaultIndex: 0)
    }, name: "charts-radar")
    try render(board {
      RadarChartInteractive()
      RadarChartInteractive(selected: ["pro", "air", "lite"], axis: 2)
    }, name: "charts-radar-interactive")
  }

  func testRadarHitPicksNearestSpoke() {
    let chart = RadarChart(
      [Radar("thisMonth", values: radarSkills.map(\.thisMonth))],
      labels: radarSkills.map(\.skill)
    ) { _ in EmptyView() }
    let layout = RadarLayout(chart: chart, size: CGSize(width: 200, height: 200))
    XCTAssertEqual(layout.high, 100)
    XCTAssertEqual(layout.index(at: CGPoint(x: 100, y: 10)), 0)
    XCTAssertEqual(layout.index(at: CGPoint(x: 190, y: 60)), 1)
    XCTAssertEqual(layout.index(at: CGPoint(x: 104, y: 190)), 3)
    XCTAssertEqual(layout.index(at: CGPoint(x: 10, y: 60)), 5)
    XCTAssertEqual(layout.index(at: CGPoint(x: 96, y: 5)), 0)
  }
}
