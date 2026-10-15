import SwiftUI

struct RadioGroupContext {
  var selection: AnyHashable?
  var select: (AnyHashable) -> Void
}

extension EnvironmentValues {
  @Entry var radioGroup: RadioGroupContext?
}

public struct RadioGroup<Value: Hashable, Content: View>: View {
  @Binding var selection: Value?
  let content: Content

  public init(selection: Binding<Value?>, @ViewBuilder content: () -> Content) {
    _selection = selection
    self.content = content()
  }

  public init(selection: Binding<Value>, @ViewBuilder content: () -> Content) {
    _selection = Binding(
      get: { selection.wrappedValue },
      set: { if let value = $0 { selection.wrappedValue = value } }
    )
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .environment(\.radioGroup, RadioGroupContext(
      selection: selection.map(AnyHashable.init),
      select: { value in
        if let value = value.base as? Value {
          selection = value
        }
      }
    ))
    .accessibilityElement(children: .contain)
  }
}

public struct RadioGroupItem<Value: Hashable, Label: View>: View {
  let value: Value
  let label: Label

  @Environment(\.radioGroup) private var group
  @Environment(\.colorScheme) private var colorScheme

  public init(value: Value, @ViewBuilder label: () -> Label) {
    self.value = value
    self.label = label()
  }

  public var body: some View {
    let checked = group?.selection == AnyHashable(value)
    HapticButton(style: PressReader { pressed in
      HStack(spacing: 12) {
        SelectionIndicator(checked: checked, pressed: pressed, cornerRadius: 8) {
          Circle()
            .fill(EsuissColor.primaryForeground)
            .frame(width: colorScheme == .dark ? 10 : 8, height: colorScheme == .dark ? 10 : 8)
        }
        label
      }
      .contentShape(Rectangle().inset(by: -8))
    }) {
      guard let group, !checked else { return false }
      group.select(AnyHashable(value))
      return true
    }
    .accessibilityElement(children: .combine)
    .accessibilityAddTraits(checked ? .isSelected : [])
  }
}

extension RadioGroupItem where Label == EmptyView {
  public init(value: Value) {
    self.init(value: value) { EmptyView() }
  }
}

extension RadioGroupItem where Label == FieldLabel<Text> {
  public init(_ title: LocalizedStringKey, value: Value) {
    self.init(value: value) { FieldLabel(title) }
  }
}
