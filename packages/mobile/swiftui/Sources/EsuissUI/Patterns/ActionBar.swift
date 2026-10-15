import PhosphorSwift
import SwiftUI

enum ActionBarPart: Sendable {
  case row, sheet, menu
}

struct ActionBarContext {
  var part: ActionBarPart
  var dismissible: Bool
  var cancelLabel: LocalizedStringKey
  var open: (@escaping () -> Void) -> Void
  var present: (AnyView) -> Void
}

extension EnvironmentValues {
  @Entry var actionBar: ActionBarContext?
}

public struct ActionBar<Content: View>: View {
  let external: Binding<Bool>?
  let dismissible: Bool
  let moreLabel: LocalizedStringKey
  let cancelLabel: LocalizedStringKey
  let content: Content

  @State private var local = false
  @State private var pending: (() -> Void)?
  @State private var presented: AnyView?
  @CompactLayout private var compact

  public init(
    isPresented: Binding<Bool>? = nil,
    dismissible: Bool = true,
    moreLabel: LocalizedStringKey = "More actions",
    cancelLabel: LocalizedStringKey = "Cancel",
    @ViewBuilder content: () -> Content
  ) {
    external = isPresented
    self.dismissible = dismissible
    self.moreLabel = moreLabel
    self.cancelLabel = cancelLabel
    self.content = content()
  }

  private func context(_ part: ActionBarPart, drawer: Binding<Bool>) -> ActionBarContext {
    ActionBarContext(
      part: part,
      dismissible: dismissible,
      cancelLabel: cancelLabel,
      open: { action in
        pending = action
        drawer.wrappedValue = false
      },
      present: { view in presented = view }
    )
  }

  public var body: some View {
    let drawer = external ?? $local
    if compact {
      Button {
        drawer.wrappedValue = true
      } label: {
        Ph.dotsThree.bold.frame(width: 16, height: 16)
      }
      .buttonStyle(.variant(.ghost, size: .icon))
      .accessibilityLabel(Text(moreLabel))
      .frame(maxWidth: .infinity, alignment: .trailing)
      .drawer(isPresented: drawer, onDismiss: {
        let action = pending
        pending = nil
        action?()
      }) {
        DrawerContent {
          ActionBarRows {
            content.environment(\.actionBar, context(.row, drawer: drawer))
          }
          .accessibilityElement(children: .contain)
          .accessibilityLabel(Text(moreLabel))
        }
        .environment(\.patternCompact, true)
      }
      .background {
        content
          .environment(\.actionBar, context(.sheet, drawer: drawer))
          .frame(width: 0, height: 0)
          .hidden()
      }
      .alertSheet(
        isPresented: Binding(
          get: { presented != nil },
          set: { if !$0 { presented = nil } }
        ),
        dismissible: dismissible
      ) {
        presented
      }
    } else {
      HStack(spacing: 4) {
        content.environment(\.actionBar, context(.menu, drawer: drawer))
      }
    }
  }
}

struct ActionBarRows<Content: View>: View {
  @ViewBuilder let content: () -> Content

  var body: some View {
    SeparatedStack {
      content()
    }
    .background(EsuissColor.border)
    .overlay(alignment: .leading) {
      EsuissColor.muted.frame(width: 16)
    }
    .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
    .padding(16)
  }
}

public struct ActionBarMenu<Label: View, Content: View>: View {
  let external: Binding<Bool>?
  let content: () -> Content
  let label: Label

  @Environment(\.actionBar) private var bar
  @Environment(\.isEnabled) private var isEnabled

  public init(
    isPresented: Binding<Bool>? = nil,
    @ViewBuilder content: @escaping () -> Content,
    @ViewBuilder label: () -> Label
  ) {
    external = isPresented
    self.content = content
    self.label = label()
  }

  public var body: some View {
    switch bar?.part {
    case .row:
      row
    case .sheet:
      if let external, let bar {
        let content = content
        Color.clear
          .frame(width: 0, height: 0)
          .alertSheet(isPresented: external, dismissible: bar.dismissible) {
            ActionSheetBody(cancelLabel: bar.cancelLabel, content: content)
          }
      }
    case .menu, nil:
      DropdownMenu(isPresented: external, content: { content().environment(\.actionListMode, .menu) }) {
        label
      }
      .buttonStyle(.variant(.ghost, size: .sm))
    }
  }

  private var row: some View {
    Button {
      guard let bar else { return }
      let external = external
      let body = ActionSheetBody(cancelLabel: bar.cancelLabel, content: content)
      bar.open {
        if let external {
          external.wrappedValue = true
        } else {
          bar.present(AnyView(body))
        }
      }
    } label: {
      HStack(spacing: 24) {
        label
          .frame(maxWidth: .infinity, alignment: .leading)
        Ph.caretRight.regular
          .frame(width: 16, height: 16)
          .foregroundStyle(EsuissColor.mutedForeground)
          .flipsForRightToLeftLayoutDirection(true)
      }
      .scaledFont(.base)
      .foregroundStyle(EsuissColor.foreground)
      .opacity(isEnabled ? 1 : 0.5)
      .padding(.vertical, 11)
      .padding(.trailing, 16)
      .frame(minHeight: 44)
      .padding(.leading, 16)
      .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .background(EsuissColor.muted)
    .accessibilityHint(Text("Shows actions"))
  }
}

extension ActionBarMenu where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    isPresented: Binding<Bool>? = nil,
    @ViewBuilder content: @escaping () -> Content
  ) {
    self.init(isPresented: isPresented, content: content) { Text(title) }
  }
}
