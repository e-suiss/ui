import SwiftUI

enum ActionListMode: Sendable {
  case sheet, menu
}

extension EnvironmentValues {
  @Entry var actionListMode: ActionListMode = .menu
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

public struct ActionBarLabel: View {
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

public struct ActionBarItem<Label: View>: View {
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

extension ActionBarItem where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    variant: AlertSheetActionVariant = .default,
    action: @escaping () -> Void
  ) {
    self.init(variant: variant, action: action) { Text(title) }
  }
}

extension ActionBarItem where Label == SwiftUI.Label<Text, Image> {
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

public struct ActionBarSeparator: View {
  @Environment(\.actionListMode) private var mode

  public init() {}

  public var body: some View {
    if mode == .menu {
      DropdownMenuSeparator()
    }
  }
}
