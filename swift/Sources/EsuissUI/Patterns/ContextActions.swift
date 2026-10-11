import SwiftUI

public struct ContextActions<Label: View, Content: View>: View {
  let dismissible: Bool
  let cancelLabel: LocalizedStringKey
  let onOpenChange: ((Bool) -> Void)?
  let content: () -> Content
  let label: Label

  @State private var open = false
  @State private var lifts = 0
  @CompactLayout private var compact

  public init(
    dismissible: Bool = true,
    cancelLabel: LocalizedStringKey = "Cancel",
    onOpenChange: ((Bool) -> Void)? = nil,
    @ViewBuilder content: @escaping () -> Content,
    @ViewBuilder label: () -> Label
  ) {
    self.dismissible = dismissible
    self.cancelLabel = cancelLabel
    self.onOpenChange = onOpenChange
    self.content = content
    self.label = label()
  }

  public var body: some View {
    if !compact {
      label
        .contextMenu {
          content().environment(\.actionListMode, .menu)
        }
    } else {
      let cancelLabel = cancelLabel
      let content = content
      label
        .contentShape(Rectangle())
        .onLongPressGesture(minimumDuration: 0.5, maximumDistance: 10) {
          lifts += 1
          open = true
        }
        .hapticFeedback(.impact(weight: .medium), trigger: lifts)
        .accessibilityAction(named: Text("Show actions")) { open = true }
        .accessibilityHint(Text("Long press to show actions"))
        .alertSheet(isPresented: $open, dismissible: dismissible) {
          ActionSheetBody(cancelLabel: cancelLabel, content: content)
        }
        .onChange(of: open) { _, value in onOpenChange?(value) }
    }
  }
}

extension View {
  public func contextActions<Content: View>(
    dismissible: Bool = true,
    cancelLabel: LocalizedStringKey = "Cancel",
    onOpenChange: ((Bool) -> Void)? = nil,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    ContextActions(dismissible: dismissible, cancelLabel: cancelLabel, onOpenChange: onOpenChange, content: content) {
      self
    }
  }
}

public typealias ContextActionsItem<Label: View> = ActionMenuItem<Label>
public typealias ContextActionsLabel = ActionMenuLabel
public typealias ContextActionsSeparator = ActionMenuSeparator
