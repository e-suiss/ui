import PhosphorSwift
import SwiftUI

public enum ChipSize: CaseIterable, Sendable {
  case sm, `default`

  var height: CGFloat {
    switch self {
    case .sm: 28
    case .default: 32
    }
  }

  var padding: CGFloat {
    switch self {
    case .sm: 10
    case .default: 12
    }
  }

  var iconSize: CGFloat {
    switch self {
    case .sm: 14
    case .default: 16
    }
  }

  var textStyle: TextStyle {
    switch self {
    case .sm: .xs
    case .default: .sm
    }
  }
}

enum ChipSelection {
  static func toggle<Value: Hashable>(_ current: Value?, _ value: Value) -> Value? {
    current == value ? nil : value
  }

  static func toggle<Value: Hashable>(_ current: Set<Value>, _ value: Value) -> Set<Value> {
    var next = current
    if next.contains(value) {
      next.remove(value)
    } else {
      next.insert(value)
    }
    return next
  }
}

struct ChipGroupContext {
  var size: ChipSize
  var isSelected: (AnyHashable) -> Bool
  var toggle: (AnyHashable) -> Void
}

extension EnvironmentValues {
  @Entry var chipGroup: ChipGroupContext?
}

public struct ChipGroup<Value: Hashable, Content: View>: View {
  let size: ChipSize
  let scrollable: Bool
  let isSelected: (Value) -> Bool
  let toggle: (Value) -> Void
  let content: Content

  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    selection: Binding<Value?>,
    size: ChipSize = .default,
    scrollable: Bool = false,
    @ViewBuilder content: () -> Content
  ) {
    self.size = size
    self.scrollable = scrollable
    isSelected = { selection.wrappedValue == $0 }
    toggle = { selection.wrappedValue = ChipSelection.toggle(selection.wrappedValue, $0) }
    self.content = content()
  }

  public init(
    selection: Binding<Set<Value>>,
    size: ChipSize = .default,
    scrollable: Bool = false,
    @ViewBuilder content: () -> Content
  ) {
    self.size = size
    self.scrollable = scrollable
    isSelected = { selection.wrappedValue.contains($0) }
    toggle = { selection.wrappedValue = ChipSelection.toggle(selection.wrappedValue, $0) }
    self.content = content()
  }

  public var body: some View {
    let context = ChipGroupContext(
      size: size,
      isSelected: { value in (value.base as? Value).map(isSelected) ?? false },
      toggle: { value in
        guard let value = value.base as? Value else { return }
        if reduceMotion {
          toggle(value)
        } else {
          withAnimation(.timingCurve(0.32, 0.72, 0, 1, duration: 0.2)) { toggle(value) }
        }
      }
    )
    Group {
      if scrollable {
        ScrollView(.horizontal, showsIndicators: false) {
          HStack(spacing: 8) { content }
        }
        .scrollClipDisabled()
      } else {
        ComboboxFlowLayout(spacing: 8) { content }
      }
    }
    .environment(\.chipGroup, context)
    .accessibilityElement(children: .contain)
  }
}

public struct Chip<Label: View>: View {
  enum Source {
    case none
    case binding(Binding<Bool>)
    case value(AnyHashable)
  }

  let source: Source
  let size: ChipSize?
  let icon: Image?
  let onRemove: (() -> Void)?
  let label: Label

  @Environment(\.chipGroup) private var group
  @Environment(\.isEnabled) private var isEnabled

  public init(
    isSelected: Binding<Bool>? = nil,
    size: ChipSize? = nil,
    icon: Image? = nil,
    onRemove: (() -> Void)? = nil,
    @ViewBuilder label: () -> Label
  ) {
    source = isSelected.map(Source.binding) ?? .none
    self.size = size
    self.icon = icon
    self.onRemove = onRemove
    self.label = label()
  }

  public init<Value: Hashable>(
    value: Value,
    size: ChipSize? = nil,
    icon: Image? = nil,
    onRemove: (() -> Void)? = nil,
    @ViewBuilder label: () -> Label
  ) {
    source = .value(AnyHashable(value))
    self.size = size
    self.icon = icon
    self.onRemove = onRemove
    self.label = label()
  }

  private var selected: Bool {
    switch source {
    case .none: false
    case .binding(let binding): binding.wrappedValue
    case .value(let value): group?.isSelected(value) ?? false
    }
  }

  private var selectable: Bool {
    switch source {
    case .none: false
    case .binding: true
    case .value: group != nil
    }
  }

  private func activate() -> Bool {
    switch source {
    case .none:
      return false
    case .binding(let binding):
      binding.wrappedValue.toggle()
      return true
    case .value(let value):
      guard let group else { return false }
      group.toggle(value)
      return true
    }
  }

  public var body: some View {
    let resolved = size ?? group?.size ?? .default
    let selected = selected
    Group {
      if selectable {
        HapticButton(style: PressReader { pressed in
          surface(size: resolved, selected: selected, pressed: pressed)
        }) {
          activate()
        }
        .accessibilityAddTraits(selected ? .isSelected : [])
      } else {
        surface(size: resolved, selected: selected, pressed: false)
          .accessibilityElement(children: .combine)
      }
    }
    .overlay(alignment: .trailing) {
      if let onRemove {
        Button(action: onRemove) {
          Color.clear
            .frame(width: resolved.height, height: resolved.height)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityHidden(true)
      }
    }
    .accessibilityActions {
      if let onRemove {
        Button("Remove", action: onRemove)
      }
    }
  }

  private func surface(size: ChipSize, selected: Bool, pressed: Bool) -> some View {
    HStack(spacing: 6) {
      if let icon {
        icon
          .frame(width: size.iconSize, height: size.iconSize)
          .accessibilityHidden(true)
      }
      label
        .scaledFont(size.textStyle, weight: .medium)
        .lineLimit(1)
      if onRemove != nil {
        Ph.x.bold
          .frame(width: size.iconSize - 4, height: size.iconSize - 4)
          .opacity(0.7)
          .accessibilityHidden(true)
      }
    }
    .foregroundStyle(foreground(selected: selected))
    .padding(.horizontal, size.padding)
    .frame(height: size.height)
    .background(background(selected: selected), in: Capsule())
    .opacity(isEnabled ? (pressed ? 0.8 : 1) : 0.5)
    .contentShape(Capsule())
  }

  private func foreground(selected: Bool) -> Color {
    selected ? EsuissColor.background : EsuissColor.secondaryForeground
  }

  private func background(selected: Bool) -> Color {
    selected ? EsuissColor.foreground : EsuissColor.secondary
  }
}

extension Chip where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    isSelected: Binding<Bool>? = nil,
    size: ChipSize? = nil,
    icon: Image? = nil,
    onRemove: (() -> Void)? = nil
  ) {
    self.init(isSelected: isSelected, size: size, icon: icon, onRemove: onRemove) { Text(title) }
  }

  public init<Value: Hashable>(
    _ title: LocalizedStringKey,
    value: Value,
    size: ChipSize? = nil,
    icon: Image? = nil,
    onRemove: (() -> Void)? = nil
  ) {
    self.init(value: value, size: size, icon: icon, onRemove: onRemove) { Text(title) }
  }
}
