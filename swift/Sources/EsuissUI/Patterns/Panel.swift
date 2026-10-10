import SwiftUI

extension View {
  public func panel<Content: View>(
    isPresented: Binding<Bool>,
    side: Edge = .trailing,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    modifier(PanelPresenter(isPresented: isPresented, side: side, content: content))
  }
}

struct PanelPresenter<Body: View>: ViewModifier {
  let isPresented: Binding<Bool>
  let side: Edge
  @ViewBuilder let content: () -> Body

  @CompactLayout private var compact

  func body(content host: Content) -> some View {
    host
      .drawer(isPresented: isPresented.gated(compact)) {
        content().environment(\.patternCompact, true)
      }
      .sheet(isPresented: isPresented.gated(!compact), side: side) {
        content().environment(\.patternCompact, false)
      }
  }
}

public struct PanelContent<Content: View>: View {
  let showCloseButton: Bool
  let closeLabel: LocalizedStringKey?
  let content: Content

  @CompactLayout private var compact

  public init(
    showCloseButton: Bool = true,
    closeLabel: LocalizedStringKey? = nil,
    @ViewBuilder content: () -> Content
  ) {
    self.showCloseButton = showCloseButton
    self.closeLabel = closeLabel
    self.content = content()
  }

  public var body: some View {
    if compact {
      DrawerContent(showCloseButton: showCloseButton, closeLabel: closeLabel) { content }
    } else {
      SheetContent(showCloseButton: showCloseButton, closeLabel: closeLabel) { content }
    }
  }
}

public struct PanelHeader<Content: View>: View {
  let content: Content

  @CompactLayout private var compact

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if compact {
      DrawerHeader { content }
    } else {
      SheetHeader { content }
    }
  }
}

public struct PanelBody<Content: View>: View {
  let content: Content

  @CompactLayout private var compact

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(.horizontal, compact ? 16 : 24)
    .padding(.vertical, compact ? 16 : 0)
  }
}

public struct PanelFooter<Content: View>: View {
  let content: Content

  @CompactLayout private var compact

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if compact {
      DrawerFooter { content }
    } else {
      SheetFooter { content }
    }
  }
}

public typealias PanelTitle = DialogTitle
public typealias PanelDescription = DialogDescription
public typealias PanelClose<Label: View> = DialogClose<Label>
