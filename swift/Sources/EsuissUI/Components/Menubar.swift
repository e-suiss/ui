import SwiftUI

public struct Menubar<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 0) {
      content
    }
    .padding(4)
    .frame(height: 36)
    .overlay {
      RoundedRectangle(cornerRadius: Radius.md, style: .continuous)
        .strokeBorder(Color.separator)
    }
    .accessibilityElement(children: .contain)
    .accessibilityAddTraits(.isHeader)
  }
}

public struct MenubarMenu<Label: View, Content: View>: View {
  let content: () -> Content
  let label: Label

  @State private var open = false

  public init(@ViewBuilder content: @escaping () -> Content, @ViewBuilder label: () -> Label) {
    self.content = content
    self.label = label()
  }

  public var body: some View {
    Button {
      open = true
    } label: {
      label
    }
    .buttonStyle(MenubarTriggerStyle(open: open))
    .accessibilityHint(Text("Opens a menu"))
    .anchoredPopup(
      isPresented: $open,
      side: .bottom,
      align: .start,
      sideOffset: 8,
      alignOffset: -4,
      minWidth: 192
    ) {
      MenuPanel(content: content)
    }
  }
}

extension MenubarMenu where Label == Text {
  public init(_ title: LocalizedStringKey, @ViewBuilder content: @escaping () -> Content) {
    self.init(content: content) { Text(title) }
  }
}

private struct MenubarTriggerStyle: ButtonStyle {
  let open: Bool

  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(TextStyle.sm.font())
      .tracking(TextStyle.sm.letterSpacing)
      .lineLimit(1)
      .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
      .padding(.horizontal, 8)
      .padding(.vertical, 3)
      .background(
        configuration.isPressed ? Color.itemPressed : open ? .itemSelected : .clear,
        in: RoundedRectangle(cornerRadius: Radius.sm, style: .continuous)
      )
      .contentShape(Rectangle())
  }
}

public typealias MenubarItem<Label: View> = DropdownMenuItem<Label>
public typealias MenubarCheckboxItem<Label: View> = DropdownMenuCheckboxItem<Label>
public typealias MenubarRadioGroup<Content: View> = DropdownMenuRadioGroup<Content>
public typealias MenubarRadioItem<Label: View> = DropdownMenuRadioItem<Label>
public typealias MenubarLabel = DropdownMenuLabel
public typealias MenubarGroup<Content: View> = DropdownMenuGroup<Content>
public typealias MenubarSeparator = DropdownMenuSeparator
public typealias MenubarShortcut = DropdownMenuShortcut
public typealias MenubarSub<Label: View, Content: View> = DropdownMenuSub<Label, Content>
