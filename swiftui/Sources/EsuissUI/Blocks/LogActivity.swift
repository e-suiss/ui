import PhosphorSwift
import SwiftUI

public struct LogActivity: View {
  struct Kind {
    let value: String
    let icon: Image
    let tint: Color
  }

  struct Event: Identifiable {
    let day: String
    let time: String
    let actor: String
    let action: String
    let target: String
    let kind: String
    var diff: (String, String)?

    var id: String { "\(day)-\(time)-\(actor)" }
  }

  static var kinds: [Kind] {
    [
      Kind(value: "Price", icon: Ph.tag.bold, tint: .orange),
      Kind(value: "Content", icon: Ph.notePencil.bold, tint: .blue),
      Kind(value: "Security", icon: Ph.shield.bold, tint: .red),
      Kind(value: "Order", icon: Ph.handbag.bold, tint: .green),
      Kind(value: "User", icon: Ph.user.bold, tint: .purple),
    ]
  }

  static var events: [Event] {
    [
      Event(day: "Today", time: "9:41 AM", actor: "Jamie Rivera", action: "updated", target: "Price: Phone Pro", kind: "Price", diff: ("$1,049", "$1,099")),
      Event(day: "Today", time: "9:12 AM", actor: "Morgan Lee", action: "published", target: "Blog: October campaign", kind: "Content"),
      Event(day: "Today", time: "8:55 AM", actor: "System", action: "blocked", target: "5 failed sign-ins · 85.104.x.x", kind: "Security"),
      Event(day: "Yesterday", time: "6:20 PM", actor: "Riley Chen", action: "refunded", target: "Order W1044 · $999", kind: "Order"),
      Event(day: "Yesterday", time: "2:03 PM", actor: "Jamie Rivera", action: "changed a role", target: "Taylor Kim: Editor → Viewer", kind: "User", diff: ("Editor", "Viewer")),
      Event(day: "Yesterday", time: "10:31 AM", actor: "Jordan Park", action: "created", target: "Product: MagCharge Wallet", kind: "Content"),
    ]
  }

  static var filters: [String] { ["All"] + kinds.map(\.value) }

  static func filtered(_ filter: String) -> [Event] {
    events.filter { filter == "All" || $0.kind == filter }
  }

  private var onNavigate: ((String) -> Void)?
  private var onFilterChange: ((String) -> Void)?
  private var onExport: ((String) -> Void)?
  private let expanded: Set<String>
  @State private var filter: String?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onFilterChange: ((_ filter: String) -> Void)? = nil,
    onExport: ((_ filter: String) -> Void)? = nil,
    onNavigate: ((_ section: String) -> Void)? = nil
  ) {
    self.init(filter: "All")
    self.onFilterChange = onFilterChange
    self.onExport = onExport
    self.onNavigate = onNavigate
  }

  init(filter: String = "All", expanded: Set<String> = []) {
    _filter = State(initialValue: filter)
    self.expanded = expanded
  }

  private var filterSelection: Binding<String?> {
    Binding(
      get: { filter },
      set: { value in
        let next = value ?? "All"
        guard next != filter else { return }
        withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.5)) {
          filter = next
        }
        onFilterChange?(next)
      }
    )
  }

  public var body: some View {
    LogActivityShell(home: "log", onNavigate: onNavigate) {
      page
    }
  }

  @ViewBuilder private var page: some View {
    let list = Self.filtered(filter ?? "All")
    let days = list.reduce(into: [String]()) { result, event in
      if !result.contains(event.day) { result.append(event.day) }
    }
    Screen {
      HeaderScrollView {
        HeaderLargeTitle("Activity log")
        VStack(alignment: .leading, spacing: 20) {
          ChipGroup(selection: filterSelection, scrollable: true) {
            ForEach(Self.filters, id: \.self) { item in
              Chip(LocalizedStringKey(item), value: item)
            }
          }
          .contentMargins(.horizontal, 16, for: .scrollContent)
          .accessibilityLabel(Text("Type"))
          VStack(alignment: .leading, spacing: 20) {
            ForEach(days, id: \.self) { day in
              VStack(alignment: .leading, spacing: 8) {
                Text(LocalizedStringKey(day))
                  .scaledFont(.sm, weight: .semibold)
                  .padding(.horizontal, 4)
                  .accessibilityAddTraits(.isHeader)
                let rows = list.filter { $0.day == day }
                VStack(spacing: 0) {
                  ForEach(Array(rows.enumerated()), id: \.element.id) { index, event in
                    LogActivityRow(event: event, expanded: expanded.contains(event.id))
                      .overlay(alignment: .top) {
                        if index > 0 {
                          Color.separator.frame(height: 1).padding(.leading, 56)
                        }
                      }
                  }
                }
                .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
                .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
              }
            }
          }
          .id(filter)
          .transition(.opacity.combined(with: .offset(y: 6)))
          .padding(.horizontal, 16)
        }
        .padding(.top, 4)
        .padding(.bottom, 24)
      } header: {
        Header {
          HeaderTitle("Activity log")
        } trailing: {
          Button("Export") {
            onExport?(filter ?? "All")
          }
          .buttonStyle(.variant(.secondary, size: .sm))
        }
      }
    }
  }
}

private struct LogActivityRow: View {
  let event: LogActivity.Event

  @State private var open: Bool
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  init(event: LogActivity.Event, expanded: Bool) {
    self.event = event
    _open = State(initialValue: expanded)
  }

  var body: some View {
    if let diff = event.diff {
      Collapsible(isExpanded: $open) {
        CollapsibleTrigger {
          row(caret: true)
        }
        .buttonStyle(LogActivityRowStyle())
        CollapsibleContent {
          HStack(spacing: 16) {
            HStack(spacing: 8) {
              Text("Before")
                .scaledFont(.xs)
                .foregroundStyle(Color.labelSecondary)
              Text(verbatim: diff.0)
                .scaledFont(.sm)
                .strikethrough()
                .foregroundStyle(Color.labelSecondary)
            }
            HStack(spacing: 8) {
              Text("After")
                .scaledFont(.xs)
                .foregroundStyle(Color.labelSecondary)
              Text(verbatim: diff.1)
                .scaledFont(.sm, weight: .semibold)
            }
          }
          .accessibilityElement(children: .combine)
          .padding(.leading, 56)
          .padding(.trailing, 16)
          .padding(.bottom, 12)
          .frame(maxWidth: .infinity, alignment: .leading)
        }
      }
    } else {
      row(caret: false)
    }
  }

  private func row(caret: Bool) -> some View {
    let kind = LogActivity.kinds.first { $0.value == event.kind } ?? LogActivity.kinds[0]
    return HStack(spacing: 12) {
      kind.icon
        .frame(width: 16, height: 16)
        .foregroundStyle(Color.onAccent)
        .frame(width: 28, height: 28)
        .background(kind.tint, in: RoundedRectangle(cornerRadius: 7, style: .continuous))
        .accessibilityHidden(true)
      VStack(alignment: .leading, spacing: 1) {
        (Text(verbatim: event.actor).fontWeight(.semibold) + Text(verbatim: " ") + Text(LocalizedStringKey(event.action)))
          .scaledFont(.sm)
          .lineLimit(1)
        Text(verbatim: event.target)
          .scaledFont(.xs)
          .foregroundStyle(Color.labelSecondary)
          .lineLimit(1)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      Text(LocalizedStringKey(event.time))
        .scaledFont(.sm)
        .monospacedDigit()
        .foregroundStyle(Color.labelSecondary)
      if caret {
        Ph.caretRight.bold
          .frame(width: 12, height: 12)
          .foregroundStyle(Color.labelTertiary)
          .flipsForRightToLeftLayoutDirection(true)
          .rotationEffect(.degrees(open ? 90 : 0))
          .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.3), value: open)
      }
    }
    .foregroundStyle(Color.label)
    .padding(.leading, 16)
    .padding(.trailing, caret ? 16 : 36)
    .padding(.vertical, 8)
    .frame(minHeight: 44)
    .contentShape(Rectangle())
    .accessibilityElement(children: .combine)
  }
}

private struct LogActivityRowStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .background(configuration.isPressed ? Color.itemPressed : .clear)
  }
}

private struct LogActivityShell<Content: View>: View {
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
