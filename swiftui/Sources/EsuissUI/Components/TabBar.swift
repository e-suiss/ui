import SwiftUI

public enum TabBarBadge: Equatable, Sendable, ExpressibleByIntegerLiteral, ExpressibleByStringLiteral {
  case dot
  case count(Int)
  case text(String)

  public init(integerLiteral value: Int) {
    self = .count(value)
  }

  public init(stringLiteral value: String) {
    self = .text(value)
  }

  var label: String? {
    switch self {
    case .dot: nil
    case .count(let value): value > 99 ? "99+" : "\(value)"
    case .text(let value): value
    }
  }

  var isVisible: Bool {
    switch self {
    case .dot: true
    case .count(let value): value > 0
    case .text(let value): !value.isEmpty
    }
  }
}

struct TabBarContext: @unchecked Sendable {
  var selected: AnyHashable?
  var select: @MainActor @Sendable (AnyHashable) -> Void = { _ in }
}

extension EnvironmentValues {
  @Entry var tabBar = TabBarContext()
}

public struct TabBar<Content: View>: View {
  let selection: Binding<AnyHashable>
  let separator: Bool
  let content: Content

  @Environment(\.screenBackground) private var background

  public init<Value: Hashable & Sendable>(
    selection: Binding<Value>,
    separator: Bool = true,
    @ViewBuilder content: () -> Content
  ) {
    self.selection = Binding(
      get: { AnyHashable(selection.wrappedValue) },
      set: { value in
        if let value = value.base as? Value {
          selection.wrappedValue = value
        }
      }
    )
    self.separator = separator
    self.content = content()
  }

  public var body: some View {
    let binding = selection
    let context = TabBarContext(selected: binding.wrappedValue) { value in
      if binding.wrappedValue != value { binding.wrappedValue = value }
    }
    HStack(alignment: .top, spacing: 0) {
      content
    }
    .padding(.horizontal, 8)
    .frame(maxWidth: .infinity)
    .background(background.ignoresSafeArea(.container, edges: .bottom))
    .overlay(alignment: .top) {
      if separator {
        Color.separator.frame(height: 1)
      }
    }
    .environment(\.tabBar, context)
    .hapticFeedback(.selection, trigger: binding.wrappedValue)
    .accessibilityElement(children: .contain)
    .accessibilityAddTraits(.isTabBar)
  }
}

public struct TabBarItem: View {
  let value: AnyHashable
  let title: Text
  let icon: Image
  let activeIcon: Image?
  let badge: TabBarBadge?

  @Environment(\.tabBar) private var tabBar
  @Environment(\.isEnabled) private var isEnabled

  public init<Value: Hashable & Sendable>(
    _ title: LocalizedStringKey,
    value: Value,
    icon: Image,
    activeIcon: Image? = nil,
    badge: TabBarBadge? = nil
  ) {
    self.value = AnyHashable(value)
    self.title = Text(title)
    self.icon = icon
    self.activeIcon = activeIcon
    self.badge = badge
  }

  public init<Value: Hashable & Sendable>(
    verbatim title: String,
    value: Value,
    icon: Image,
    activeIcon: Image? = nil,
    badge: TabBarBadge? = nil
  ) {
    self.value = AnyHashable(value)
    self.title = Text(verbatim: title)
    self.icon = icon
    self.activeIcon = activeIcon
    self.badge = badge
  }

  public var body: some View {
    let active = tabBar.selected == value
    Button {
      tabBar.select(value)
    } label: {
      VStack(spacing: 2) {
        (active ? activeIcon ?? icon : icon)
          .resizable()
          .scaledToFit()
          .frame(width: 24, height: 24)
          .overlay(alignment: .topLeading) {
            if let badge, badge.isVisible {
              TabBarBadgeView(badge: badge)
                .offset(x: badge.label == nil ? 16 : 14, y: badge.label == nil ? -1 : -6)
            }
          }
        title
          .scaledFont(.xs3, weight: .medium)
          .lineLimit(1)
      }
      .foregroundStyle(!isEnabled ? Color.labelQuaternary : active ? .accent : .labelSecondary)
      .padding(.top, 6)
      .padding(.bottom, 4)
      .frame(maxWidth: .infinity, minHeight: 49, alignment: .top)
      .contentShape(Rectangle())
    }
    .buttonStyle(TabBarItemStyle())
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(title)
    .accessibilityValue(badgeValue)
    .accessibilityAddTraits(active ? [.isSelected, .isButton] : .isButton)
  }

  private var badgeValue: Text {
    guard let badge, badge.isVisible else { return Text(verbatim: "") }
    switch badge {
    case .dot: return Text("New")
    case .count(let value): return Text("\(value) new")
    case .text(let value): return Text(verbatim: value)
    }
  }
}

private struct TabBarItemStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .opacity(configuration.isPressed ? 0.6 : 1)
  }
}

private struct TabBarBadgeView: View {
  let badge: TabBarBadge

  @Environment(\.screenBackground) private var background

  var body: some View {
    Group {
      if let label = badge.label {
        Text(verbatim: label)
          .font(TextStyle.xs3.font(weight: .semibold))
          .monospacedDigit()
          .foregroundStyle(Color.onAccent)
          .padding(.horizontal, 5)
          .frame(minWidth: 18, minHeight: 18)
          .background(Color.danger, in: Capsule())
      } else {
        Circle()
          .fill(Color.danger)
          .frame(width: 10, height: 10)
      }
    }
    .background(Capsule().fill(background).padding(-2))
    .fixedSize()
    .accessibilityHidden(true)
  }
}
