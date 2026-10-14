import Charts
import PhosphorSwift
import SwiftUI

public struct DashAnalytics: View {
  struct App {
    let value: String
    let label: String
    let icon: Image
    let tint: Color
  }

  struct Metric {
    let value: String
    let label: String
    let unit: String
    let data: [Double]
  }

  static var apps: [App] {
    [
      App(value: "route", label: "Route", icon: Ph.chartBar.bold, tint: .green),
      App(value: "notebook", label: "Notebook", icon: Ph.notePencil.bold, tint: .orange),
      App(value: "fitness", label: "Fitness+", icon: Ph.flame.bold, tint: .red),
    ]
  }

  static let metrics = [
    Metric(value: "impressions", label: "Impressions", unit: "K", data: [12, 14, 13, 18, 17, 22, 25, 24, 28, 31, 29, 34]),
    Metric(value: "downloads", label: "Downloads", unit: "K", data: [2.1, 2.4, 2.2, 3.1, 2.9, 3.8, 4.2, 4, 4.6, 5.1, 4.8, 5.6]),
    Metric(value: "revenue", label: "Revenue", unit: "K $", data: [8, 9, 9, 11, 12, 14, 15, 15, 17, 19, 18, 21]),
    Metric(value: "sessions", label: "Sessions", unit: "K", data: [40, 42, 41, 47, 48, 55, 58, 57, 62, 66, 64, 71]),
  ]

  static let regions: [(name: String, share: Double)] = [
    ("United States", 0.46), ("Germany", 0.21), ("United Kingdom", 0.14), ("Netherlands", 0.09),
  ]

  static func data(metric: String, app: String) -> [Double] {
    let appIndex = Double(max(0, apps.firstIndex { $0.value == app } ?? 0))
    let source = (metrics.first { $0.value == metric } ?? metrics[1]).data
    return source.map { ($0 * (1 - appIndex * 0.28) * 100).rounded() / 100 }
  }

  private let chartConfig: ChartConfig = [
    "value": .init("Value", color: .accent),
  ]

  private var onAppChange: ((String) -> Void)?
  private var onMetricChange: ((String) -> Void)?
  private var onNavigate: ((String) -> Void)?
  @State private var app: String
  @State private var metric: String?
  @State private var active: Int?
  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.locale) private var locale
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onAppChange: ((_ app: String) -> Void)? = nil,
    onMetricChange: ((_ metric: String) -> Void)? = nil,
    onNavigate: ((_ section: String) -> Void)? = nil
  ) {
    self.init(app: "route", metric: "downloads")
    self.onAppChange = onAppChange
    self.onMetricChange = onMetricChange
    self.onNavigate = onNavigate
  }

  init(app: String, metric: String, active: Int? = nil) {
    _app = State(initialValue: app)
    _metric = State(initialValue: metric)
    _active = State(initialValue: active)
  }

  private var current: Metric {
    Self.metrics.first { $0.value == metric } ?? Self.metrics[1]
  }

  private var metricBinding: Binding<String?> {
    Binding(
      get: { metric },
      set: { value in
        guard let value, value != metric else { return }
        onMetricChange?(value)
        withAnimation(reduceMotion ? nil : ChartAnimationEasing.ease.animation(duration: 500)) {
          metric = value
        }
      }
    )
  }

  private var appBinding: Binding<String> {
    Binding(
      get: { app },
      set: { value in
        guard value != app else { return }
        onAppChange?(value)
        withAnimation(reduceMotion ? nil : ChartAnimationEasing.ease.animation(duration: 500)) {
          app = value
          active = nil
        }
      }
    )
  }

  private func format(_ value: Double) -> String {
    "\(value.formatted(.number.precision(.fractionLength(1)).locale(locale))) \(current.unit)"
  }

  public var body: some View {
    DashAnalyticsShell(onNavigate: onNavigate) {
      page
    }
  }

  private var page: some View {
    let title = Self.apps.first { $0.value == app }?.label ?? ""
    let data = Self.data(metric: current.value, app: app)
    let last = data.count - 1
    let index = active ?? last
    let latest = data[last]
    return Screen {
      HeaderScrollView {
        HeaderLargeTitle(verbatim: title, subtitle: "Last 12 weeks · All regions")
        VStack(alignment: .leading, spacing: 20) {
          ScrollView(.horizontal, showsIndicators: false) {
            ToggleGroup(selection: metricBinding, size: .sm, spacing: 0) {
              ForEach(Self.metrics, id: \.value) { item in
                ToggleGroupItem(LocalizedStringKey(item.label), value: item.value)
              }
            }
            .accessibilityLabel("Metric")
          }
          VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .bottom, spacing: 10) {
              VStack(alignment: .leading, spacing: 0) {
                Text("\(index == last ? String(localized: "This week") : "Week \(index + 1)") · \(Text(LocalizedStringKey(current.label)))")
                  .textStyle(.sm)
                  .foregroundStyle(Color.labelSecondary)
                Text(verbatim: format(data[index]))
                  .textStyle(.xl3, weight: .bold)
                  .monospacedDigit()
                  .contentTransition(.numericText(value: data[index]))
              }
              .frame(maxWidth: .infinity, alignment: .leading)
              .accessibilityElement(children: .combine)
              Text(verbatim: "+\(12 + (Self.metrics.firstIndex { $0.value == current.value } ?? 0) * 3)%")
                .textStyle(.sm, weight: .semibold)
                .foregroundStyle(Color.success)
            }
            chart(data)
          }
          .padding(.horizontal, 16)
          .padding(.top, 14)
          .padding(.bottom, 10)
          .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
          Text("By region")
            .textStyle(.sm, weight: .semibold)
            .padding(.horizontal, 4)
            .padding(.bottom, -10)
            .accessibilityAddTraits(.isHeader)
          ItemGroup(.inset) {
            ForEach(Array(Self.regions.enumerated()), id: \.offset) { offset, region in
              if offset > 0 {
                ItemSeparator()
              }
              Item(size: .sm) {
                ItemContent {
                  ItemTitle { Text(LocalizedStringKey(region.name)).fontWeight(.regular) }
                }
                ItemActions {
                  Text(verbatim: format(latest * region.share))
                    .monospacedDigit()
                    .contentTransition(.numericText(value: latest * region.share))
                }
              }
            }
          }
        }
        .padding(.horizontal, 16)
        .padding(.top, 4)
        .padding(.bottom, 24)
      } header: {
        Header {
          HeaderTitle(verbatim: title)
        } trailing: {
          DropdownMenu(align: .end) {
            DropdownMenuLabel("Apps")
            DropdownMenuRadioGroup(selection: appBinding) {
              ForEach(Self.apps, id: \.value) { item in
                DropdownMenuRadioItem(value: item.value) {
                  SwiftUI.Label {
                    Text(LocalizedStringKey(item.label))
                  } icon: {
                    DashAnalyticsTile(app: item)
                  }
                }
              }
            }
          } label: {
            HStack(spacing: 6) {
              if let item = Self.apps.first(where: { $0.value == app }) {
                DashAnalyticsTile(app: item)
              }
              Ph.caretDown.bold
                .frame(width: 12, height: 12)
                .foregroundStyle(Color.labelSecondary)
            }
            .padding(.horizontal, 8)
            .frame(height: 44)
            .contentShape(Rectangle())
          }
          .buttonStyle(.plain)
          .accessibilityLabel(Text("Apps"))
          .accessibilityValue(Text(verbatim: title))
        }
      }
    }
  }

  private func chart(_ data: [Double]) -> some View {
    let color = chartConfig.color("value")
    let selection = Binding<Int?>(get: { active ?? data.count - 1 }, set: { active = $0 })
    let index = active ?? data.count - 1
    return ChartContainer(config: chartConfig) {
      ChartAnimator(animationDuration: 500) { progress in
        Chart {
          ForEach(data.indices, id: \.self) { index in
            AreaMark(x: .value("Week", index), y: .value("Value", data[index]))
              .interpolationMethod(.linear)
              .foregroundStyle(LinearGradient(colors: [color.opacity(0.22), color.opacity(0)], startPoint: .top, endPoint: .bottom))
            LineMark(x: .value("Week", index), y: .value("Value", data[index]))
              .interpolationMethod(.linear)
              .lineStyle(StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round))
              .foregroundStyle(color)
          }
          .chartReveal(progress, x: 0...(data.count - 1))
          PointMark(x: .value("Week", index), y: .value("Value", data[index]))
            .symbol {
              Circle()
                .fill(color)
                .stroke(Color.surfaceSecondary, lineWidth: 2)
                .frame(width: 12, height: 12)
            }
            .chartReveal(progress, x: 0...(data.count - 1))
        }
        .chartXScale(domain: 0...(data.count - 1), range: .plotDimension(padding: 6))
        .chartXAxis(.hidden)
        .chartYAxis { ChartAxis.grid() }
        .chartTooltip(
          x: Array(data.indices),
          labels: data.indices.map { "Week \($0 + 1)" },
          selection: selection,
          accessibilityLabel: current.label,
          items: { [ChartTooltipItem("value", value: data[$0])] }
        ) { _ in
          EmptyView()
        }
      }
    }
    .frame(height: 176)
  }
}

private struct DashAnalyticsTile: View {
  let app: DashAnalytics.App

  var body: some View {
    app.icon
      .frame(width: 14, height: 14)
      .foregroundStyle(Color.onAccent)
      .frame(width: 24, height: 24)
      .background(app.tint, in: RoundedRectangle(cornerRadius: Radius.md, style: .continuous))
      .accessibilityHidden(true)
  }
}

private struct DashAnalyticsShell<Content: View>: View {
  let onNavigate: ((String) -> Void)?
  let content: Content

  @State private var tab = "analytics"

  init(onNavigate: ((String) -> Void)?, @ViewBuilder content: () -> Content) {
    self.onNavigate = onNavigate
    self.content = content()
  }

  private static var sections: [(value: String, label: LocalizedStringKey, icon: Image, active: Image)] {
    [
      ("analytics", "Analytics", Ph.chartBar.regular, Ph.chartBar.fill),
      ("sales", "Sales and Trends", Ph.tag.regular, Ph.tag.fill),
      ("ratings", "Ratings", Ph.star.regular, Ph.star.fill),
    ]
  }

  var body: some View {
    let selection = Binding<String>(
      get: { tab },
      set: { value in
        guard value != tab else { return }
        onNavigate?(value)
        tab = value
      }
    )
    Screen {
      ZStack {
        content
          .opacity(tab == "analytics" ? 1 : 0)
          .allowsHitTesting(tab == "analytics")
          .accessibilityHidden(tab != "analytics")
        if tab != "analytics" {
          Empty {
            EmptyHeader {
              EmptyDescription("This section isn't part of the sample. Choose \(Text("Analytics")).")
            }
          }
          .background(Color.surface)
        }
      }
      .frame(maxHeight: .infinity)
      TabBar(selection: selection) {
        ForEach(Self.sections, id: \.value) { section in
          TabBarItem(section.label, value: section.value, icon: section.icon, activeIcon: section.active)
        }
      }
    }
  }
}
