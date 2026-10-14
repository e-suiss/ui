import PhosphorSwift
import SwiftUI

public enum FabSize: CaseIterable, Sendable {
  case `default`, lg

  var dimension: CGFloat {
    switch self {
    case .default: 56
    case .lg: 64
    }
  }

  var iconSize: CGFloat {
    switch self {
    case .default: 24
    case .lg: 28
    }
  }
}

struct FabContext {
  var inset: CGFloat
  var close: () -> Void
}

extension EnvironmentValues {
  @Entry var fab: FabContext?
}

public struct Fab<Icon: View, Actions: View>: View {
  let label: Text?
  let accessibility: Text?
  let size: FabSize
  let external: Binding<Bool>?
  let action: (() -> Void)?
  let plus: Bool
  let icon: Icon
  let actions: Actions

  @State private var local = false
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    _ label: LocalizedStringKey? = nil,
    size: FabSize = .default,
    isExpanded: Binding<Bool>? = nil,
    @ViewBuilder icon: () -> Icon,
    @ViewBuilder actions: () -> Actions
  ) {
    self.label = label.map { Text($0) }
    accessibility = nil
    self.size = size
    external = isExpanded
    action = nil
    plus = false
    self.icon = icon()
    self.actions = actions()
  }

  public init(
    accessibilityLabel: LocalizedStringKey,
    size: FabSize = .default,
    isExpanded: Binding<Bool>? = nil,
    @ViewBuilder icon: () -> Icon,
    @ViewBuilder actions: () -> Actions
  ) {
    label = nil
    accessibility = Text(accessibilityLabel)
    self.size = size
    external = isExpanded
    action = nil
    plus = false
    self.icon = icon()
    self.actions = actions()
  }

  private var expanded: Binding<Bool> { external ?? $local }

  private func set(_ value: Bool) {
    if reduceMotion {
      expanded.wrappedValue = value
    } else {
      withAnimation(.timingCurve(0.32, 0.72, 0, 1, duration: 0.3)) { expanded.wrappedValue = value }
    }
  }

  public var body: some View {
    let open = action == nil && expanded.wrappedValue
    ZStack(alignment: .bottomTrailing) {
      if open {
        Color.scrim
          .ignoresSafeArea()
          .contentShape(Rectangle())
          .onTapGesture { set(false) }
          .accessibilityHidden(true)
          .transition(.opacity)
      }
      VStack(alignment: .trailing, spacing: 16) {
        if open {
          VStack(alignment: .trailing, spacing: 12) {
            actions
          }
          .environment(\.fab, FabContext(inset: max(0, (size.dimension - 44) / 2)) { set(false) })
          .transition(
            reduceMotion
              ? .opacity
              : .offset(y: 24).combined(with: .scale(scale: 0.9, anchor: .bottomTrailing)).combined(with: .opacity)
          )
        }
        main(open: open)
      }
      .padding(16)
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomTrailing)
    .accessibilityElement(children: .contain)
    .accessibilityAction(.escape) {
      if open { set(false) }
    }
  }

  private func main(open: Bool) -> some View {
    Button {
      if let action {
        action()
      } else {
        set(!expanded.wrappedValue)
      }
    } label: {
      EmptyView()
    }
    .buttonStyle(FabButtonStyle(size: size, label: label, open: open, rotates: plus) { icon })
    .accessibilityLabel(label ?? accessibility ?? Text(open ? "Close actions" : "Show actions"))
    .accessibilityValue(action == nil ? Text(open ? "Expanded" : "Collapsed") : Text(verbatim: ""))
  }
}

extension Fab where Actions == EmptyView {
  public init(
    _ label: LocalizedStringKey,
    size: FabSize = .default,
    action: @escaping () -> Void,
    @ViewBuilder icon: () -> Icon
  ) {
    self.label = Text(label)
    accessibility = nil
    self.size = size
    external = nil
    self.action = action
    plus = false
    self.icon = icon()
    actions = EmptyView()
  }

  public init(
    accessibilityLabel: LocalizedStringKey,
    size: FabSize = .default,
    action: @escaping () -> Void,
    @ViewBuilder icon: () -> Icon
  ) {
    label = nil
    accessibility = Text(accessibilityLabel)
    self.size = size
    external = nil
    self.action = action
    plus = false
    self.icon = icon()
    actions = EmptyView()
  }
}

extension Fab where Icon == Image {
  public init(
    _ label: LocalizedStringKey? = nil,
    size: FabSize = .default,
    isExpanded: Binding<Bool>? = nil,
    @ViewBuilder actions: () -> Actions
  ) {
    self.label = label.map { Text($0) }
    accessibility = nil
    self.size = size
    external = isExpanded
    action = nil
    plus = true
    icon = Ph.plus.bold
    self.actions = actions()
  }

  public init(
    accessibilityLabel: LocalizedStringKey,
    size: FabSize = .default,
    isExpanded: Binding<Bool>? = nil,
    @ViewBuilder actions: () -> Actions
  ) {
    label = nil
    accessibility = Text(accessibilityLabel)
    self.size = size
    external = isExpanded
    action = nil
    plus = true
    icon = Ph.plus.bold
    self.actions = actions()
  }
}

private struct FabButtonStyle<Icon: View>: ButtonStyle {
  let size: FabSize
  let label: Text?
  let open: Bool
  let rotates: Bool
  @ViewBuilder let icon: () -> Icon

  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    let pressed = configuration.isPressed
    HStack(spacing: 8) {
      Group {
        if open && !rotates {
          Ph.x.bold
        } else {
          icon()
        }
      }
      .frame(width: size.iconSize, height: size.iconSize)
      .rotationEffect(.degrees(open && rotates ? 45 : 0))
      if let label {
        label
          .scaledFont(.base, weight: .semibold)
          .lineLimit(1)
      }
    }
    .foregroundStyle(Color.onAccent)
    .padding(.horizontal, label == nil ? 0 : 20)
    .frame(minWidth: size.dimension, minHeight: size.dimension, maxHeight: size.dimension)
    .background {
      Capsule()
        .fill(!isEnabled ? Color.accentDisabled : pressed ? .accentPressed : .accent)
        .shadow(isEnabled ? .lg : Shadow(color: .clear, radius: 0))
    }
    .scaleEffect(pressed ? 0.96 : 1)
    .animation(.easeOut(duration: 0.15), value: pressed)
    .contentShape(Capsule())
  }
}

public struct FabAction<Icon: View>: View {
  let title: Text
  let action: () -> Void
  let icon: Icon

  @Environment(\.fab) private var fab
  @Environment(\.isEnabled) private var isEnabled

  public init(_ title: LocalizedStringKey, action: @escaping () -> Void, @ViewBuilder icon: () -> Icon) {
    self.title = Text(title)
    self.action = action
    self.icon = icon()
  }

  public init(verbatim title: String, action: @escaping () -> Void, @ViewBuilder icon: () -> Icon) {
    self.title = Text(verbatim: title)
    self.action = action
    self.icon = icon()
  }

  public var body: some View {
    Button {
      fab?.close()
      action()
    } label: {
      EmptyView()
    }
    .buttonStyle(PressReader { pressed in
      HStack(spacing: 12) {
        title
          .scaledFont(.sm, weight: .medium)
          .lineLimit(1)
          .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
          .padding(.horizontal, 12)
          .frame(height: 32)
          .background {
            Capsule()
              .fill(pressed ? Color.itemPressed : .clear)
              .background(Color.surfaceRaised, in: Capsule())
              .shadow(.md)
          }
        icon
          .frame(width: 20, height: 20)
          .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
          .frame(width: 44, height: 44)
          .background {
            Circle()
              .fill(pressed ? Color.itemPressed : .clear)
              .background(Color.surfaceRaised, in: Circle())
              .shadow(.md)
          }
      }
      .padding(.trailing, fab?.inset ?? 0)
      .contentShape(Rectangle())
    })
    .accessibilityLabel(title)
  }
}
