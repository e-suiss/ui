import Charts
import SwiftUI

private enum Category: String, CaseIterable {
  case social, productivity, entertainment
}

private enum Period: String, CaseIterable {
  case week, day
}

private let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

private let usage: [[Double]] = [
  [48, 95, 62], [55, 120, 40], [70, 88, 95], [42, 130, 35], [65, 100, 80], [110, 30, 140], [95, 25, 120],
]

private let profile: [Double] = [1, 0, 0, 0, 0, 0, 1, 4, 6, 5, 4, 5, 7, 6, 5, 4, 5, 6, 7, 9, 10, 11, 8, 4]

private let apps: [(name: String, category: Category, share: Double)] = [
  ("Chat", .social, 0.55),
  ("Messages", .social, 0.45),
  ("Browser", .productivity, 0.45),
  ("Mail", .productivity, 0.3),
  ("Docs", .productivity, 0.25),
  ("Video", .entertainment, 0.6),
  ("Music", .entertainment, 0.4),
]

private let chartConfig: ChartConfig = [
  "social": .init("Social", color: EsuissColor.chart1),
  "productivity": .init("Productivity", color: Palette.cyan500),
  "entertainment": .init("Entertainment", color: EsuissColor.chart4),
]

private func week(_ day: Int, _ category: Category) -> Double {
  usage[day][Category.allCases.firstIndex(of: category) ?? 0]
}

private func total(_ day: Int) -> Double {
  Category.allCases.reduce(0) { $0 + week(day, $1) }
}

private let averageTotal = days.indices.reduce(0) { $0 + total($1) } / Double(days.count)

private func dailyAverage(_ category: Category) -> Double {
  days.indices.reduce(0) { $0 + week($1, category) } / Double(days.count)
}

private func formatMinutes(_ minutes: Double) -> String {
  let rounded = Int(minutes.rounded())
  let hours = rounded / 60
  return hours > 0 ? "\(hours)h \(rounded % 60)m" : "\(rounded)m"
}

private func noise(_ seed: Int) -> Double {
  Double((seed * 16807) % 2147483647 - 1) / 2147483646
}

private func hourly(_ day: Int, _ hour: Int, _ category: Category) -> Double {
  let profileTotal = profile.reduce(0, +)
  let share = profile[hour] / profileTotal * (0.75 + noise(hour + 7 * (day + 1)) * 0.5)
  switch category {
  case .social: return (week(day, .social) * share).rounded()
  case .productivity: return (week(day, .productivity) * share * (hour > 8 && hour < 18 ? 1.6 : 0.4)).rounded()
  case .entertainment: return (week(day, .entertainment) * share * (hour > 18 ? 1.8 : 0.5)).rounded()
  }
}

public struct BarChartInteractive: View {
  @State private var view: Period = .week
  @State private var selected: Int?
  @State private var hour: Int?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init() {}

  private var isWeek: Bool { view == .week }

  private var labels: [String] {
    isWeek ? days.map { String($0.prefix(3)) } : profile.indices.map { "\($0)" }
  }

  private func value(_ index: Int, _ category: Category) -> Double {
    isWeek ? week(index, category) : hourly(selected ?? 6, index, category)
  }

  private var viewBinding: Binding<Period?> {
    Binding(get: { view }, set: { next in
      guard let next else { return }
      view = next
      hour = nil
      if next == .day && selected == nil { selected = 6 }
    })
  }

  private var selection: Binding<Int?> {
    isWeek ? $selected : $hour
  }

  public var body: some View {
    let categories: (Category) -> Double = { category in
      selected.map { week($0, category) } ?? dailyAverage(category)
    }
    let headline = selected.map(total) ?? averageTotal
    let ranked = apps.map { (app: $0, minutes: categories($0.category) * $0.share) }
      .sorted { $0.minutes > $1.minutes }
      .prefix(5)
    let longest = ranked.map(\.minutes).max() ?? 1
    let comparison = selected == nil
      ? "8% less than last week"
      : "\(Int((abs(headline / averageTotal - 1) * 100).rounded()))% \(headline > averageTotal ? "above" : "below") average"
    Card(.filled, size: .sm) {
      VStack(alignment: .leading, spacing: 16) {
        VStack(alignment: .leading, spacing: 2) {
          Text(LocalizedStringKey(selected.map { days[$0] } ?? "Daily average"))
            .textStyle(.sm, weight: .semibold)
            .foregroundStyle(EsuissColor.mutedForeground)
          Text(verbatim: formatMinutes(headline))
            .textStyle(.xl3, weight: .semibold)
            .monospacedDigit()
          Text(LocalizedStringKey(comparison))
            .textStyle(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        .accessibilityElement(children: .combine)
        ToggleGroup(selection: viewBinding, size: .sm, spacing: 0) {
          ToggleGroupItem(value: Period.week) { Text("Week").padding(.horizontal, 8) }
          ToggleGroupItem(value: Period.day) { Text("Day").padding(.horizontal, 8) }
        }
        .accessibilityLabel("Period")
      }
      .padding(.horizontal, 16)
      CardContent {
        VStack(alignment: .leading, spacing: 20) {
          chart
          LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 12, alignment: .leading), count: 3), spacing: 12) {
            ForEach(Category.allCases, id: \.self) { category in
              VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                  Circle()
                    .fill(chartConfig.color(category.rawValue))
                    .frame(width: 8, height: 8)
                  Text(LocalizedStringKey(chartConfig.label(category.rawValue)))
                    .textStyle(.sm)
                    .foregroundStyle(EsuissColor.mutedForeground)
                    .lineLimit(1)
                }
                Text(verbatim: formatMinutes(categories(category)))
                  .textStyle(.base, weight: .semibold)
                  .monospacedDigit()
              }
              .accessibilityElement(children: .combine)
            }
          }
          VStack(alignment: .leading, spacing: 0) {
            Text("MOST USED")
              .textStyle(.xs, weight: .semibold)
              .foregroundStyle(EsuissColor.mutedForeground)
              .padding(.bottom, 4)
            ForEach(Array(ranked), id: \.app.name) { entry in
              HStack(spacing: 12) {
                Text(LocalizedStringKey(entry.app.name))
                  .textStyle(.base)
                  .lineLimit(1)
                  .frame(width: 96, alignment: .leading)
                GeometryReader { geometry in
                  Capsule()
                    .fill(EsuissColor.secondary)
                    .overlay(alignment: .leading) {
                      Capsule()
                        .fill(chartConfig.color(entry.app.category.rawValue))
                        .frame(width: geometry.size.width * entry.minutes / longest)
                    }
                }
                .frame(height: 6)
                Text(verbatim: formatMinutes(entry.minutes))
                  .textStyle(.sm)
                  .foregroundStyle(EsuissColor.mutedForeground)
                  .monospacedDigit()
                  .frame(width: 72, alignment: .trailing)
              }
              .padding(.vertical, 8)
              .overlay(alignment: .top) {
                EsuissColor.border.frame(height: 1)
              }
              .accessibilityElement(children: .combine)
            }
          }
          .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.4), value: selected)
        }
      }
    }
  }

  private var chart: some View {
    let labels = labels
    return ChartContainer(config: chartConfig) {
      Chart {
        ForEach(labels.indices, id: \.self) { index in
          let dimmed = isWeek && selected != nil && selected != index
          ForEach(Category.allCases, id: \.self) { category in
            let start = Category.allCases.prefix { $0 != category }.reduce(0) { $0 + value(index, $1) }
            BarMark(
              x: .value("Time", labels[index]),
              yStart: .value("Start", start),
              yEnd: .value("End", start + value(index, category)),
              width: .fixed(isWeek ? 34 : 10)
            )
            .clipShape(UnevenRoundedRectangle(
              topLeadingRadius: category == .entertainment ? 5 : 0,
              topTrailingRadius: category == .entertainment ? 5 : 0,
              style: .continuous
            ))
            .foregroundStyle(chartConfig.color(category.rawValue).opacity(dimmed ? 0.3 : 1))
          }
        }
        if isWeek {
          RuleMark(y: .value("Average", averageTotal))
            .lineStyle(StrokeStyle(lineWidth: 1, dash: [3, 3]))
            .foregroundStyle(Palette.green500)
        }
      }
      .chartXAxis {
        ChartAxis.x(values: isWeek ? labels : ["0", "6", "12", "18"]) { isWeek ? $0 : "\($0):00" }
      }
      .chartYAxis {
        if isWeek {
          ChartAxis.y(values: [0.0, 120, 240, 360]) { "\(Int($0 / 60))h" }
        } else {
          ChartAxis.y(count: 4) { "\(Int($0))m" }
        }
      }
      .animation(reduceMotion ? nil : .easeOut(duration: 0.2), value: selected)
      .chartTooltip(
        x: labels,
        labels: isWeek ? days : labels.map { "\($0):00 – \((Int($0) ?? 0) + 1):00" },
        selection: selection,
        cursor: false,
        accessibilityLabel: "Screen time",
        items: { index in Category.allCases.map { ChartTooltipItem($0.rawValue, value: value(index, $0)) } }
      ) { payload in
        ChartTooltipContent(payload) { item in
          RoundedRectangle(cornerRadius: 2, style: .continuous)
            .fill(chartConfig.color(item.key))
            .frame(width: 8, height: 8)
          Text(LocalizedStringKey(chartConfig.label(item.key)))
            .foregroundStyle(EsuissColor.mutedForeground)
            .frame(maxWidth: .infinity, alignment: .leading)
          Text(verbatim: formatMinutes(item.value))
            .scaledFont(TextStyle.xs, weight: .semibold)
            .monospacedDigit()
        }
      }
      .id(view)
    }
    .frame(height: 256)
  }
}
