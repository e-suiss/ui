import PhosphorSwift
import SwiftUI

enum SegmentPickerMode {
  case group, native, registering
}

extension EnvironmentValues {
  @Entry var segmentPickerMode = SegmentPickerMode.group
}

struct SegmentPickerLabelsKey: PreferenceKey {
  static var defaultValue: [AnyHashable: Text] { [:] }

  static func reduce(value: inout [AnyHashable: Text], nextValue: () -> [AnyHashable: Text]) {
    value.merge(nextValue()) { current, _ in current }
  }
}

public struct SegmentPicker<Value: Hashable & Sendable, Content: View>: View {
  let selection: Binding<Value?>
  let variant: ToggleVariant
  let size: ToggleSize
  let spacing: Int
  let content: Content

  @State private var labels: [AnyHashable: Text] = [:]
  @CompactLayout private var compact
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.isInvalid) private var invalid
  @Environment(\.colorScheme) private var colorScheme

  public init(
    selection: Binding<Value?>,
    variant: ToggleVariant = .default,
    size: ToggleSize = .default,
    spacing: Int = 0,
    @ViewBuilder content: () -> Content
  ) {
    self.selection = selection
    self.variant = variant
    self.size = size
    self.spacing = spacing
    self.content = content()
  }

  public var body: some View {
    if compact {
      native
    } else {
      let binding = selection
      ToggleGroup(
        selection: Binding<Value?>(
          get: { binding.wrappedValue },
          set: { value in
            if let value { binding.wrappedValue = value }
          }
        ),
        variant: variant,
        size: size,
        spacing: spacing
      ) {
        content
      }
    }
  }

  private var native: some View {
    let binding = selection
    let erased = Binding<AnyHashable?>(
      get: { binding.wrappedValue.map { AnyHashable($0) } },
      set: { value in
        if let value = value?.base as? Value { binding.wrappedValue = value }
      }
    )
    let valueText = binding.wrappedValue.flatMap { labels[AnyHashable($0)] }
    let small = size == .sm
    let shape = RoundedRectangle(cornerRadius: small ? Radius.md : Radius.lg, style: .continuous)
    return Menu {
      Picker(selection: erased) {
        content.environment(\.segmentPickerMode, .native)
      } label: {
        EmptyView()
      }
      .pickerStyle(.inline)
    } label: {
      HStack(spacing: 6) {
        (valueText ?? Text(verbatim: ""))
          .font(TextStyle.base.font())
          .tracking(TextStyle.base.letterSpacing)
          .lineLimit(1)
          .foregroundStyle(!isEnabled ? Color.labelQuaternary : valueText == nil ? .labelSecondary : .label)
          .frame(maxWidth: .infinity, alignment: .leading)
        Ph.caretUpDown.regular
          .frame(width: 16, height: 16)
          .foregroundStyle(isEnabled ? Color.labelSecondary : .labelQuaternary)
          .accessibilityHidden(true)
      }
      .padding(.leading, 12)
      .padding(.trailing, 10)
      .frame(height: small ? 36 : 44)
      .background(background, in: shape)
      .overlay {
        if invalid { shape.strokeBorder(Color.danger) }
      }
      .contentShape(shape)
    }
    .tint(Color.label)
    .accessibilityLabel(valueText ?? Text(verbatim: ""))
    .accessibilityHint(Text("Shows options"))
    .background {
      HStack(spacing: 0) { content }
        .environment(\.segmentPickerMode, .registering)
        .hidden()
        .frame(width: 0, height: 0)
        .clipped()
        .accessibilityHidden(true)
        .allowsHitTesting(false)
    }
    .onPreferenceChange(SegmentPickerLabelsKey.self) { value in
      labels = value
    }
  }

  private var background: Color {
    if !isEnabled { return .controlDisabled }
    if invalid { return .danger.opacity(colorScheme == .dark ? 0.1 : 0.05) }
    return .control
  }
}

public struct SegmentPickerItem<Value: Hashable & Sendable, Label: View>: View {
  let value: Value
  let title: Text
  let label: Label

  @Environment(\.segmentPickerMode) private var mode

  public init(value: Value, label title: LocalizedStringKey, @ViewBuilder content: () -> Label) {
    self.value = value
    self.title = Text(title)
    label = content()
  }

  public init(value: Value, label title: Text, @ViewBuilder content: () -> Label) {
    self.value = value
    self.title = title
    label = content()
  }

  public var body: some View {
    switch mode {
    case .native:
      title.tag(Optional(AnyHashable(value)))
    case .registering:
      Color.clear
        .frame(width: 0, height: 0)
        .preference(key: SegmentPickerLabelsKey.self, value: [AnyHashable(value): title])
    case .group:
      ToggleGroupItem(value: value) { label }
        .accessibilityLabel(title)
    }
  }
}

extension SegmentPickerItem where Label == Text {
  public init(_ title: LocalizedStringKey, value: Value) {
    self.init(value: value, label: Text(title)) { Text(title) }
  }

  public init(verbatim title: String, value: Value) {
    self.init(value: value, label: Text(verbatim: title)) { Text(verbatim: title) }
  }
}
