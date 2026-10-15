import PhosphorSwift
import SwiftUI

extension EnvironmentValues {
  @Entry var optionPickerNative = false
}

public struct OptionPicker<Value: Hashable & Sendable, Content: View>: View {
  public typealias Size = SelectSize

  let selection: Binding<Value?>
  let placeholder: LocalizedStringKey
  let size: Size
  let content: () -> Content

  @State private var labels: [AnyHashable: Text] = [:]
  @CompactLayout private var compact
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
    if compact {
      native
    } else {
      SelectField(selection: selection, placeholder: placeholder, size: size, content: content)
    }
  }

  private var native: some View {
    let binding = selection
    let erased = Binding<AnyHashable?>(
      get: { binding.wrappedValue.map { AnyHashable($0) } },
      set: { value in binding.wrappedValue = value?.base as? Value }
    )
    let valueText = binding.wrappedValue.flatMap { labels[AnyHashable($0)] }
    let shape = RoundedRectangle(cornerRadius: size == .sm ? Radius.md : Radius.lg, style: .continuous)
    return Menu {
      Picker(selection: erased) {
        content().environment(\.optionPickerNative, true)
      } label: {
        Text(placeholder)
      }
      .pickerStyle(.inline)
    } label: {
      HStack(spacing: 6) {
        (valueText ?? Text(placeholder))
          .scaledFont(.base)
          .lineLimit(1)
          .foregroundStyle(valueText == nil ? EsuissColor.mutedForeground : EsuissColor.foreground)
          .frame(maxWidth: .infinity, alignment: .leading)
        Ph.caretUpDown.regular
          .frame(width: 16, height: 16)
          .foregroundStyle(EsuissColor.mutedForeground)
          .accessibilityHidden(true)
      }
      .padding(.horizontal, 12)
      .frame(minHeight: size == .sm ? 36 : 44)
      .background(background, in: shape)
      .overlay {
        if invalid {
          shape.strokeBorder(EsuissColor.destructive)
        }
      }
      .contentShape(shape)
      .opacity(isEnabled ? 1 : 0.5)
    }
    .tint(EsuissColor.foreground)
    .accessibilityLabel(valueText ?? Text(placeholder))
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
  }

  private var background: Color {
    if invalid { return EsuissColor.destructive.opacity(colorScheme == .dark ? 0.1 : 0.05) }
    return EsuissColor.secondary
  }
}

public struct OptionPickerItem: View {
  let tag: AnyHashable
  let title: Text
  let item: SelectItem

  @Environment(\.optionPickerNative) private var native

  public init<Value: Hashable & Sendable>(_ title: LocalizedStringKey, value: Value) {
    tag = AnyHashable(value)
    self.title = Text(title)
    item = SelectItem(title, value: value)
  }

  public init<Value: Hashable & Sendable>(verbatim title: String, value: Value) {
    tag = AnyHashable(value)
    self.title = Text(verbatim: title)
    item = SelectItem(verbatim: title, value: value)
  }

  public var body: some View {
    if native {
      title.tag(Optional(tag))
    } else {
      item
    }
  }
}

public struct OptionPickerGroup<Content: View>: View {
  let label: LocalizedStringKey?
  let content: Content

  @Environment(\.optionPickerNative) private var native

  public init(_ label: LocalizedStringKey? = nil, @ViewBuilder content: () -> Content) {
    self.label = label
    self.content = content()
  }

  public var body: some View {
    if native {
      if let label {
        Section(label) { content }
      } else {
        Section { content }
      }
    } else {
      SelectGroup {
        if let label {
          SelectLabel(label)
        }
        content
      }
    }
  }
}

public struct OptionPickerSeparator: View {
  @Environment(\.optionPickerNative) private var native

  public init() {}

  public var body: some View {
    if !native {
      SelectSeparator()
    }
  }
}
