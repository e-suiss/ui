import SwiftUI

enum ActionListMode: Sendable {
  case sheet, menu
}

extension EnvironmentValues {
  @Entry var actionListMode: ActionListMode = .menu
}

public struct ActionMenu<Label: View, Content: View>: View {
  let external: Binding<Bool>?
  let dismissible: Bool
  let cancelLabel: LocalizedStringKey
  let side: Edge
  let align: PopupAlignment
  let sideOffset: CGFloat
  let alignOffset: CGFloat
  let content: () -> Content
  let label: Label

  @State private var local = false
  @CompactLayout private var compact

  public init(
    isPresented: Binding<Bool>? = nil,
    dismissible: Bool = true,
    cancelLabel: LocalizedStringKey = "Cancel",
    side: Edge = .bottom,
    align: PopupAlignment = .start,
    sideOffset: CGFloat = 4,
    alignOffset: CGFloat = 0,
    @ViewBuilder content: @escaping () -> Content,
    @ViewBuilder label: () -> Label
  ) {
    self.external = isPresented
    self.dismissible = dismissible
    self.cancelLabel = cancelLabel
    self.side = side
    self.align = align
    self.sideOffset = sideOffset
    self.alignOffset = alignOffset
    self.content = content
    self.label = label()
  }

  public var body: some View {
    let binding = external ?? $local
    if !compact {
      DropdownMenu(
        isPresented: binding,
        side: side,
        align: align,
        sideOffset: sideOffset,
        alignOffset: alignOffset,
        content: { content().environment(\.actionListMode, .menu) },
        label: { label }
      )
    } else {
      let cancelLabel = cancelLabel
      let content = content
      Button {
        binding.wrappedValue = true
      } label: {
        label
      }
      .accessibilityHint(Text("Shows actions"))
      .alertSheet(isPresented: binding, dismissible: dismissible) {
        ActionSheetBody(cancelLabel: cancelLabel, content: content)
      }
    }
  }
}

extension ActionMenu where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    isPresented: Binding<Bool>? = nil,
    dismissible: Bool = true,
    cancelLabel: LocalizedStringKey = "Cancel",
    @ViewBuilder content: @escaping () -> Content
  ) {
    self.init(isPresented: isPresented, dismissible: dismissible, cancelLabel: cancelLabel, content: content) {
      Text(title)
    }
  }
}

struct ActionSheetBody<Content: View>: View {
  let cancelLabel: LocalizedStringKey
  @ViewBuilder let content: () -> Content

  var body: some View {
    AlertSheetContent {
      AlertSheetGroup {
        content().environment(\.actionListMode, .sheet)
      }
      AlertSheetCancel(cancelLabel)
    }
  }
}

public struct ActionMenuLabel: View {
  let title: LocalizedStringKey

  @Environment(\.actionListMode) private var mode

  public init(_ title: LocalizedStringKey) {
    self.title = title
  }

  public var body: some View {
    switch mode {
    case .sheet:
      AlertSheetHeader { AlertSheetTitle(title) }
    case .menu:
      DropdownMenuGroup { DropdownMenuLabel(title) }
    }
  }
}

public struct ActionMenuItem<Label: View>: View {
  let variant: AlertSheetActionVariant
  let action: () -> Void
  let label: Label

  @Environment(\.actionListMode) private var mode

  public init(
    variant: AlertSheetActionVariant = .default,
    action: @escaping () -> Void,
    @ViewBuilder label: () -> Label
  ) {
    self.variant = variant
    self.action = action
    self.label = label()
  }

  public var body: some View {
    switch mode {
    case .sheet:
      AlertSheetAction(variant: variant, action: action) { label }
    case .menu:
      DropdownMenuItem(variant: variant == .destructive ? .destructive : .default, action: action) { label }
    }
  }
}

extension ActionMenuItem where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    variant: AlertSheetActionVariant = .default,
    action: @escaping () -> Void
  ) {
    self.init(variant: variant, action: action) { Text(title) }
  }
}

extension ActionMenuItem where Label == SwiftUI.Label<Text, Image> {
  public init(
    _ title: LocalizedStringKey,
    icon: Image,
    variant: AlertSheetActionVariant = .default,
    action: @escaping () -> Void
  ) {
    self.init(variant: variant, action: action) {
      SwiftUI.Label { Text(title) } icon: { icon }
    }
  }
}

public struct ActionMenuSeparator: View {
  @Environment(\.actionListMode) private var mode

  public init() {}

  public var body: some View {
    if mode == .menu {
      DropdownMenuSeparator()
    }
  }
}
