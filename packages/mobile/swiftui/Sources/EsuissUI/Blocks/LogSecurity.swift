import PhosphorSwift
import SwiftUI

public struct LogSecurity: View {
  enum Severity: String, CaseIterable {
    case high = "High"
    case medium = "Medium"
    case low = "Low"

    var tint: Color {
      switch self {
      case .high: EsuissColor.destructive
      case .medium: Color.adaptive(light: Palette.amber600, dark: Palette.amber400)
      case .low: EsuissColor.foreground
      }
    }

    var tile: Color {
      switch self {
      case .high: EsuissColor.destructive
      case .medium: Palette.amber500
      case .low: Palette.zinc500
      }
    }

    var weight: Int {
      switch self {
      case .high: 18
      case .medium: 8
      case .low: 3
      }
    }
  }

  struct Alert: Identifiable {
    let severity: Severity
    let title: String
    let detail: String
    let icon: Image
    var resolved = false

    var id: String { title }
  }

  static var initialAlerts: [Alert] {
    [
      Alert(severity: .high, title: "Sign-in from an unusual location", detail: "morgan@example.com · Lagos, NG · 3:12 AM", icon: Ph.globe.bold),
      Alert(severity: .medium, title: "5 failed sign-in attempts", detail: "85.104.x.x · last 10 minutes", icon: Ph.lockSimple.bold),
      Alert(severity: .medium, title: "API key expires in 7 days", detail: "Payments integration", icon: Ph.key.bold),
      Alert(severity: .low, title: "Two-factor authentication is off", detail: "2 users", icon: Ph.shield.bold),
    ]
  }

  static let filters = ["Open", "Resolved", "All"]

  static func score(_ alerts: [Alert]) -> Int {
    100 - alerts.filter { !$0.resolved }.reduce(0) { $0 + $1.severity.weight }
  }

  static func tone(_ score: Int) -> Color {
    if score > 85 { return Palette.green500 }
    if score > 65 { return Palette.orange500 }
    return Palette.red500
  }

  private var onNavigate: ((String) -> Void)?
  private var onResolve: ((String, Bool) -> Void)?
  private var onFilterChange: ((String) -> Void)?
  @State private var alerts: [Alert]
  @State private var filter: String?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onFilterChange: ((_ filter: String) -> Void)? = nil,
    onResolve: ((_ title: String, _ resolved: Bool) -> Void)? = nil,
    onNavigate: ((_ section: String) -> Void)? = nil
  ) {
    self.init(filter: "Open")
    self.onFilterChange = onFilterChange
    self.onResolve = onResolve
    self.onNavigate = onNavigate
  }

  init(filter: String = "Open", resolved: Set<String> = []) {
    _alerts = State(initialValue: Self.initialAlerts.map { alert in
      var alert = alert
      alert.resolved = resolved.contains(alert.title)
      return alert
    })
    _filter = State(initialValue: filter)
  }

  private var animation: Animation? {
    reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.5)
  }

  private var filterSelection: Binding<String?> {
    Binding(
      get: { filter },
      set: { value in
        let next = value ?? "Open"
        guard next != filter else { return }
        withAnimation(animation) { filter = next }
        onFilterChange?(next)
      }
    )
  }

  public var body: some View {
    LogSecurityShell(home: "log", onNavigate: onNavigate) {
      page
    }
  }

  @ViewBuilder private var page: some View {
    let open = alerts.filter { !$0.resolved }
    let current = filter ?? "Open"
    let list = current == "All" ? alerts : alerts.filter { $0.resolved == (current == "Resolved") }
    Screen {
      HeaderScrollView {
        HeaderLargeTitle("Security", subtitle: open.isEmpty ? "No open alerts" : "\(open.count) open alerts")
        VStack(alignment: .leading, spacing: 20) {
          scoreCard(open)
          ChipGroup(selection: filterSelection) {
            ForEach(Self.filters, id: \.self) { item in
              Chip(LocalizedStringKey(item), value: item)
            }
          }
          .accessibilityLabel(Text("Filter"))
          Group {
            if list.isEmpty {
              Text(current == "Open" ? "No open alerts. All good." : "Nothing here yet.")
                .scaledFont(.sm)
                .foregroundStyle(EsuissColor.mutedForeground)
                .frame(maxWidth: .infinity)
                .padding(30)
            } else {
              VStack(spacing: 0) {
                ForEach(Array(list.enumerated()), id: \.element.id) { index, alert in
                  row(alert)
                    .overlay(alignment: .top) {
                      if index > 0 {
                        EsuissColor.border.frame(height: 1).padding(.leading, 58)
                      }
                    }
                    .transition(.opacity)
                }
              }
              .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
              .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
            }
          }
          .id(current)
          .transition(.opacity.combined(with: .offset(y: 6)))
        }
        .padding(.horizontal, 16)
        .padding(.top, 8)
        .padding(.bottom, 24)
      } header: {
        Header {
          HeaderTitle("Security")
        }
      }
    }
  }

  private func scoreCard(_ open: [Alert]) -> some View {
    let score = Self.score(alerts)
    let tone = Self.tone(score)
    return HStack(spacing: 16) {
      ZStack {
        Circle()
          .stroke(EsuissColor.secondary, lineWidth: 6)
        Circle()
          .trim(from: 0, to: CGFloat(max(score, 0)) / 100)
          .stroke(tone, style: StrokeStyle(lineWidth: 6, lineCap: .round))
          .rotationEffect(.degrees(-90))
      }
      .padding(3)
      .frame(width: 54, height: 54)
      .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.6), value: score)
      .accessibilityHidden(true)
      VStack(alignment: .leading, spacing: 0) {
        Text("Security score")
          .scaledFont(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
        Text(verbatim: "\(score)")
          .scaledFont(.xl3, weight: .bold)
          .monospacedDigit()
          .contentTransition(.numericText())
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      .accessibilityElement(children: .combine)
      HStack(spacing: 14) {
        ForEach(Severity.allCases, id: \.self) { level in
          let count = open.filter { $0.severity == level }.count
          VStack(spacing: 0) {
            Text(LocalizedStringKey(level.rawValue))
              .scaledFont(.xs)
              .fixedSize()
              .foregroundStyle(EsuissColor.mutedForeground)
            Text(verbatim: "\(count)")
              .scaledFont(.xl, weight: .semibold)
              .monospacedDigit()
              .foregroundStyle(count > 0 ? level.tint : EsuissColor.mutedForeground)
              .contentTransition(.numericText())
          }
          .accessibilityElement(children: .combine)
        }
      }
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 14)
    .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
  }

  private func row(_ alert: Alert) -> some View {
    HStack(spacing: 12) {
      (alert.resolved ? Ph.check.bold : alert.icon)
        .frame(width: 16, height: 16)
        .foregroundStyle(EsuissColor.primaryForeground)
        .frame(width: 30, height: 30)
        .background(alert.resolved ? Palette.green500 : alert.severity.tile, in: RoundedRectangle(cornerRadius: 7, style: .continuous))
        .accessibilityHidden(true)
      VStack(alignment: .leading, spacing: 1) {
        Text(verbatim: alert.title)
          .scaledFont(.sm, weight: .semibold)
          .lineLimit(1)
        Text("\(Text(alert.resolved ? "Resolved" : "\(alert.severity.rawValue) severity"))\(Text(verbatim: " · \(alert.detail)"))")
          .scaledFont(.xs)
          .foregroundStyle(EsuissColor.mutedForeground)
          .lineLimit(1)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      .accessibilityElement(children: .combine)
      if alert.resolved {
        Button("Reopen") { set(alert.title, resolved: false) }
          .buttonStyle(.variant(.secondary, size: .sm))
      } else {
        Button("Resolve") { set(alert.title, resolved: true) }
          .buttonStyle(.variant(.default, size: .sm))
      }
    }
    .foregroundStyle(EsuissColor.foreground)
    .padding(.horizontal, 16)
    .padding(.vertical, 10)
    .frame(minHeight: 52)
  }

  private func set(_ title: String, resolved: Bool) {
    guard let index = alerts.firstIndex(where: { $0.title == title }) else { return }
    onResolve?(title, resolved)
    withAnimation(animation) { alerts[index].resolved = resolved }
  }
}

private struct LogSecurityShell<Content: View>: View {
  let home: String
  let onNavigate: ((String) -> Void)?
  let content: Content

  @State private var tab: String

  init(home: String, onNavigate: ((String) -> Void)?, @ViewBuilder content: () -> Content) {
    self.home = home
    self.onNavigate = onNavigate
    self.content = content()
    _tab = State(initialValue: home)
  }

  private static var sections: [(value: String, label: LocalizedStringKey, icon: Image, active: Image)] {
    [
      ("users", "Users", Ph.users.regular, Ph.users.fill),
      ("roles", "Roles", Ph.shield.regular, Ph.shield.fill),
      ("log", "Activity", Ph.chartBar.regular, Ph.chartBar.fill),
      ("settings", "Settings", Ph.gear.regular, Ph.gear.fill),
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
          .opacity(tab == home ? 1 : 0)
          .allowsHitTesting(tab == home)
          .accessibilityHidden(tab != home)
        if tab != home {
          Empty {
            EmptyHeader {
              EmptyDescription("This section isn't part of the sample. Choose \(Text(Self.sections.first { $0.value == home }?.label ?? "")).")
            }
          }
          .background(EsuissColor.background)
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
