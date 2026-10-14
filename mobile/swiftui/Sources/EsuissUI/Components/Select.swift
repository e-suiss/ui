import PhosphorSwift
import SwiftUI

struct SelectContext: @unchecked Sendable {
  var selected: AnyHashable?
  var registering = false
  var select: @MainActor @Sendable (AnyHashable) -> Void = { _ in }
}

extension EnvironmentValues {
  @Entry var select = SelectContext()
}

struct SelectLabelsKey: PreferenceKey {
  static var defaultValue: [AnyHashable: Text] { [:] }

  static func reduce(value: inout [AnyHashable: Text], nextValue: () -> [AnyHashable: Text]) {
    value.merge(nextValue()) { current, _ in current }
  }
}

public enum SelectSize: CaseIterable, Sendable {
  case `default`, sm
}

public struct SelectField<Value: Hashable & Sendable, Content: View>: View {
  public typealias Size = SelectSize

  let selection: Binding<Value?>
  let placeholder: LocalizedStringKey
  let size: Size
  let content: () -> Content

  @State private var open = false
  @State private var labels: [AnyHashable: Text] = [:]
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.isInvalid) private var invalid
  @Environment(\.colorScheme) private var colorScheme

  public init(
    selection: Binding<Value?>,
    placeholder: LocalizedStringKey = "Select",
    size: Size = .default,
    @ViewBuilder content: @escaping () -> Content
  ) {
    self.selection = selection
    self.placeholder = placeholder
    self.size = size
    self.content = content
  }

  public var body: some View {
    let binding = selection
    let current = binding.wrappedValue.map { AnyHashable($0) }
    let valueText = current.flatMap { labels[$0] }
    let context = SelectContext(
      selected: current,
      select: { value in
        if let value = value.base as? Value { binding.wrappedValue = value }
      }
    )
    ButtonGroupItem(radius: size == .sm ? Radius.md : Radius.lg) { shape in
      Button {
        open = true
      } label: {
        HStack(spacing: 6) {
          (valueText ?? Text(placeholder))
            .font(TextStyle.base.font())
            .tracking(TextStyle.base.letterSpacing)
            .lineLimit(1)
            .foregroundStyle(!isEnabled ? Color.labelQuaternary : valueText == nil ? .labelSecondary : .label)
            .frame(maxWidth: .infinity, alignment: .leading)
          Ph.caretUpDown.regular
            .frame(width: 16, height: 16)
            .foregroundStyle(Color.labelSecondary)
            .accessibilityHidden(true)
        }
        .padding(.horizontal, 12)
        .frame(height: size == .sm ? 36 : 44)
        .background(background, in: shape)
        .overlay {
          if invalid {
            shape.strokeBorder(Color.danger)
          }
        }
        .contentShape(shape)
      }
      .buttonStyle(SelectTriggerStyle())
    }
    .accessibilityHint(Text("Shows options"))
    .background {
      VStack(spacing: 0) { content() }
        .environment(\.select, SelectContext(registering: true))
        .hidden()
        .frame(width: 0, height: 0)
        .clipped()
        .accessibilityHidden(true)
        .allowsHitTesting(false)
    }
    .onPreferenceChange(SelectLabelsKey.self) { value in
      labels = value
    }
    .anchoredPopup(
      isPresented: $open,
      side: .bottom,
      align: .center,
      matchWidth: true,
      minWidth: 144
    ) {
      SelectPanel(content: content)
        .environment(\.select, context)
    }
  }

  private var background: Color {
    if !isEnabled { return .controlDisabled }
    if invalid { return .danger.opacity(colorScheme == .dark ? 0.1 : 0.05) }
    return .control
  }
}

private struct SelectTriggerStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label.opacity(configuration.isPressed ? 0.8 : 1)
  }
}

struct SelectPanel<Content: View>: View {
  @ViewBuilder let content: () -> Content

  var body: some View {
    let stack = VStack(alignment: .leading, spacing: 0) {
      content()
    }
    .padding(6)
    ViewThatFits(in: .vertical) {
      stack
      ScrollView { stack }
    }
    .font(TextStyle.base.font())
    .tracking(TextStyle.base.letterSpacing)
    .foregroundStyle(Color.label)
    .popupSurface(radius: Radius.xl)
    .accessibilityElement(children: .contain)
  }
}

public struct SelectItem: View {
  let value: AnyHashable
  let title: Text

  @Environment(\.select) private var select
  @Environment(\.overlayDismiss) private var dismiss

  public init<Value: Hashable & Sendable>(_ title: LocalizedStringKey, value: Value) {
    self.value = AnyHashable(value)
    self.title = Text(title)
  }

  public init<Value: Hashable & Sendable>(verbatim title: String, value: Value) {
    self.value = AnyHashable(value)
    self.title = Text(verbatim: title)
  }

  public var body: some View {
    if select.registering {
      Color.clear
        .frame(width: 0, height: 0)
        .preference(key: SelectLabelsKey.self, value: [value: title])
    } else {
      let selected = select.selected == value
      Button {
        select.select(value)
        dismiss?()
      } label: {
        title
      }
      .buttonStyle(MenuRowStyle(trailing: 32))
      .overlay(alignment: .trailing) {
        if selected {
          Ph.check.regular
            .frame(width: 16, height: 16)
            .foregroundStyle(Color.link)
            .padding(.trailing, 8)
            .accessibilityHidden(true)
        }
      }
      .accessibilityAddTraits(selected ? .isSelected : [])
    }
  }
}

public struct SelectGroup<Content: View>: View {
  let content: Content

  @Environment(\.select) private var select

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 0) { content }
  }
}

public struct SelectLabel: View {
  let title: LocalizedStringKey

  @Environment(\.select) private var select

  public init(_ title: LocalizedStringKey) {
    self.title = title
  }

  public var body: some View {
    if !select.registering {
      Text(title)
        .font(TextStyle.xs.font(weight: .semibold))
        .tracking(TextStyle.xs.letterSpacing)
        .foregroundStyle(Color.labelSecondary)
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityAddTraits(.isHeader)
    }
  }
}

public struct SelectSeparator: View {
  @Environment(\.select) private var select

  public init() {}

  public var body: some View {
    if !select.registering {
      Rectangle()
        .fill(Color.separator)
        .frame(height: 1)
        .padding(.vertical, 6)
        .padding(.horizontal, -6)
        .accessibilityHidden(true)
    }
  }
}
