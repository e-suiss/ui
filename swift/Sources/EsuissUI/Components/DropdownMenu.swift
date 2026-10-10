import PhosphorSwift
import SwiftUI

enum MenuPresentation: Sendable {
  case system, popup
}

extension EnvironmentValues {
  @Entry var menuPresentation: MenuPresentation = .system
  @Entry var menuRadio = MenuRadioContext()
}

struct MenuRadioContext: @unchecked Sendable {
  var selected: AnyHashable?
  var select: @MainActor @Sendable (AnyHashable) -> Void = { _ in }
}

public struct DropdownMenu<Label: View, Content: View>: View {
  let side: Edge
  let align: PopupAlignment
  let sideOffset: CGFloat
  let alignOffset: CGFloat
  let external: Binding<Bool>?
  let content: () -> Content
  let label: Label

  @State private var local = false

  public init(
    isPresented: Binding<Bool>? = nil,
    side: Edge = .bottom,
    align: PopupAlignment = .start,
    sideOffset: CGFloat = 4,
    alignOffset: CGFloat = 0,
    @ViewBuilder content: @escaping () -> Content,
    @ViewBuilder label: () -> Label
  ) {
    self.external = isPresented
    self.side = side
    self.align = align
    self.sideOffset = sideOffset
    self.alignOffset = alignOffset
    self.content = content
    self.label = label()
  }

  public var body: some View {
    let binding = external ?? $local
    Button {
      binding.wrappedValue = true
    } label: {
      label
    }
    .accessibilityHint(Text("Opens a menu"))
    .anchoredPopup(
      isPresented: binding,
      side: side,
      align: align,
      sideOffset: sideOffset,
      alignOffset: alignOffset,
      minWidth: 192
    ) {
      MenuPanel(content: content)
    }
  }
}

extension DropdownMenu where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    isPresented: Binding<Bool>? = nil,
    side: Edge = .bottom,
    align: PopupAlignment = .start,
    @ViewBuilder content: @escaping () -> Content
  ) {
    self.init(isPresented: isPresented, side: side, align: align, content: content) { Text(title) }
  }
}

struct MenuPanel<Content: View>: View {
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
    .environment(\.menuPresentation, .popup)
    .popupSurface(radius: Radius.xl)
    .accessibilityElement(children: .contain)
  }
}

struct MenuRowStyle: ButtonStyle {
  var destructive = false
  var inset = false
  var trailing: CGFloat = 12
  var selected = false

  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .labelStyle(ButtonLabelStyle(spacing: 10, iconSize: 16))
      .lineLimit(1)
      .foregroundStyle(!isEnabled ? Color.labelQuaternary : destructive ? .danger : .label)
      .padding(.leading, inset ? 38 : 12)
      .padding(.trailing, trailing)
      .padding(.vertical, 8)
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(background(pressed: configuration.isPressed), in: RoundedRectangle(cornerRadius: Radius.md, style: .continuous))
      .contentShape(Rectangle())
  }

  private func background(pressed: Bool) -> Color {
    if pressed && isEnabled {
      return destructive ? .dangerSurfacePressed : .itemPressed
    }
    return selected ? .itemSelected : .clear
  }
}

private struct MenuCheckmark: View {
  let visible: Bool

  var body: some View {
    Ph.check.regular
      .frame(width: 16, height: 16)
      .opacity(visible ? 1 : 0)
      .padding(.trailing, 8)
      .accessibilityHidden(true)
  }
}

public struct DropdownMenuItem<Label: View>: View {
  public enum Variant: CaseIterable, Sendable {
    case `default`, destructive
  }

  let variant: Variant
  let inset: Bool
  let action: () -> Void
  let label: Label

  @Environment(\.menuPresentation) private var presentation
  @Environment(\.overlayDismiss) private var dismiss

  public init(
    variant: Variant = .default,
    inset: Bool = false,
    action: @escaping () -> Void,
    @ViewBuilder label: () -> Label
  ) {
    self.variant = variant
    self.inset = inset
    self.action = action
    self.label = label()
  }

  public var body: some View {
    if presentation == .system {
      Button(role: variant == .destructive ? .destructive : nil, action: action) {
        label
      }
    } else {
      Button {
        action()
        dismiss?()
      } label: {
        HStack(spacing: 10) {
          label
        }
      }
      .buttonStyle(MenuRowStyle(destructive: variant == .destructive, inset: inset))
    }
  }
}

extension DropdownMenuItem where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    variant: Variant = .default,
    inset: Bool = false,
    action: @escaping () -> Void
  ) {
    self.init(variant: variant, inset: inset, action: action) { Text(title) }
  }
}

extension DropdownMenuItem where Label == SwiftUI.Label<Text, Image> {
  public init(
    _ title: LocalizedStringKey,
    icon: Image,
    variant: Variant = .default,
    action: @escaping () -> Void
  ) {
    self.init(variant: variant, action: action) {
      SwiftUI.Label { Text(title) } icon: { icon }
    }
  }
}

public struct DropdownMenuCheckboxItem<Label: View>: View {
  let isOn: Binding<Bool>
  let inset: Bool
  let label: Label

  @Environment(\.menuPresentation) private var presentation

  public init(isOn: Binding<Bool>, inset: Bool = false, @ViewBuilder label: () -> Label) {
    self.isOn = isOn
    self.inset = inset
    self.label = label()
  }

  public var body: some View {
    if presentation == .system {
      Toggle(isOn: isOn) { label }
    } else {
      Button {
        isOn.wrappedValue.toggle()
      } label: {
        label
      }
      .buttonStyle(MenuRowStyle(inset: inset, trailing: 32))
      .overlay(alignment: .trailing) { MenuCheckmark(visible: isOn.wrappedValue) }
      .accessibilityAddTraits(isOn.wrappedValue ? [.isToggle, .isSelected] : .isToggle)
    }
  }
}

extension DropdownMenuCheckboxItem where Label == Text {
  public init(_ title: LocalizedStringKey, isOn: Binding<Bool>, inset: Bool = false) {
    self.init(isOn: isOn, inset: inset) { Text(title) }
  }
}

public struct DropdownMenuRadioGroup<Content: View>: View {
  let selection: Binding<AnyHashable>
  let content: Content

  public init<Value: Hashable & Sendable>(selection: Binding<Value>, @ViewBuilder content: () -> Content) {
    self.selection = Binding(
      get: { AnyHashable(selection.wrappedValue) },
      set: { value in
        if let value = value.base as? Value { selection.wrappedValue = value }
      }
    )
    self.content = content()
  }

  public var body: some View {
    let binding = selection
    content
      .environment(
        \.menuRadio,
        MenuRadioContext(selected: binding.wrappedValue, select: { binding.wrappedValue = $0 })
      )
  }
}

public struct DropdownMenuRadioItem<Label: View>: View {
  let value: AnyHashable
  let inset: Bool
  let label: Label

  @Environment(\.menuPresentation) private var presentation
  @Environment(\.menuRadio) private var radio

  public init<Value: Hashable & Sendable>(value: Value, inset: Bool = false, @ViewBuilder label: () -> Label) {
    self.value = AnyHashable(value)
    self.inset = inset
    self.label = label()
  }

  public var body: some View {
    let selected = radio.selected == value
    if presentation == .system {
      let radio = radio
      let value = value
      Toggle(isOn: Binding(get: { selected }, set: { if $0 { radio.select(value) } })) { label }
    } else {
      Button {
        radio.select(value)
      } label: {
        label
      }
      .buttonStyle(MenuRowStyle(inset: inset, trailing: 32))
      .overlay(alignment: .trailing) { MenuCheckmark(visible: selected) }
      .accessibilityAddTraits(selected ? .isSelected : [])
    }
  }
}

extension DropdownMenuRadioItem where Label == Text {
  public init<Value: Hashable & Sendable>(_ title: LocalizedStringKey, value: Value, inset: Bool = false) {
    self.init(value: value, inset: inset) { Text(title) }
  }
}

public struct DropdownMenuLabel: View {
  let title: LocalizedStringKey
  let inset: Bool

  @Environment(\.menuPresentation) private var presentation

  public init(_ title: LocalizedStringKey, inset: Bool = false) {
    self.title = title
    self.inset = inset
  }

  public var body: some View {
    if presentation == .system {
      Text(title)
    } else {
      Text(title)
        .font(TextStyle.xs.font(weight: .semibold))
        .tracking(TextStyle.xs.letterSpacing)
        .foregroundStyle(Color.labelSecondary)
        .padding(.leading, inset ? 38 : 12)
        .padding(.trailing, 12)
        .padding(.vertical, 10)
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityAddTraits(.isHeader)
    }
  }
}

public struct DropdownMenuGroup<Content: View>: View {
  let content: Content

  @Environment(\.menuPresentation) private var presentation

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if presentation == .system {
      Section { content }
    } else {
      VStack(alignment: .leading, spacing: 0) { content }
    }
  }
}

public struct DropdownMenuSeparator: View {
  @Environment(\.menuPresentation) private var presentation

  public init() {}

  public var body: some View {
    if presentation == .system {
      Divider()
    } else {
      Rectangle()
        .fill(Color.separator.opacity(0.5))
        .frame(height: 1)
        .padding(.vertical, 6)
        .padding(.horizontal, -6)
        .accessibilityHidden(true)
    }
  }
}

public struct DropdownMenuSub<Label: View, Content: View>: View {
  let inset: Bool
  let content: Content
  let label: Label

  @State private var open = false
  @Environment(\.menuPresentation) private var presentation
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(inset: Bool = false, @ViewBuilder content: () -> Content, @ViewBuilder label: () -> Label) {
    self.inset = inset
    self.content = content()
    self.label = label()
  }

  public var body: some View {
    if presentation == .system {
      Menu { content } label: { label }
    } else {
      VStack(alignment: .leading, spacing: 0) {
        Button {
          withAnimation(reduceMotion ? nil : .easeInOut(duration: 0.2)) { open.toggle() }
        } label: {
          HStack(spacing: 8) {
            label
            Spacer(minLength: 16)
            Ph.caretRight.regular
              .frame(width: 16, height: 16)
              .rotationEffect(.degrees(open ? 90 : 0))
          }
        }
        .buttonStyle(MenuRowStyle(inset: inset, selected: open))
        .accessibilityValue(Text(open ? "Expanded" : "Collapsed"))
        if open {
          VStack(alignment: .leading, spacing: 0) { content }
            .padding(.leading, 12)
            .transition(.opacity)
        }
      }
    }
  }
}

extension DropdownMenuSub where Label == Text {
  public init(_ title: LocalizedStringKey, inset: Bool = false, @ViewBuilder content: () -> Content) {
    self.init(inset: inset, content: content) { Text(title) }
  }
}

extension DropdownMenuSub where Label == SwiftUI.Label<Text, Image> {
  public init(_ title: LocalizedStringKey, icon: Image, @ViewBuilder content: () -> Content) {
    self.init(content: content) {
      SwiftUI.Label { Text(title) } icon: { icon }
    }
  }
}
