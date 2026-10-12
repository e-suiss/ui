import SwiftUI

extension View {
  public func flyout<Content: View>(
    isPresented: Binding<Bool>,
    arrowEdge: Edge = .top,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    modifier(FlyoutPresenter(isPresented: isPresented, arrowEdge: arrowEdge, content: content))
  }
}

struct FlyoutPresenter<Body: View>: ViewModifier {
  let isPresented: Binding<Bool>
  let arrowEdge: Edge
  @ViewBuilder let content: () -> Body

  @CompactLayout private var compact

  func body(content host: Content) -> some View {
    let binding = isPresented
    host
      .drawer(isPresented: binding.gated(compact)) {
        content().environment(\.patternCompact, true)
      }
      .popover(isPresented: binding.gated(!compact), arrowEdge: arrowEdge) {
        content()
          .environment(\.patternCompact, false)
          .environment(\.overlayDismiss, OverlayDismiss { binding.wrappedValue = false })
      }
  }
}

public struct FlyoutContent<Content: View>: View {
  let showCloseButton: Bool
  let closeLabel: LocalizedStringKey?
  let width: CGFloat?
  let content: Content

  @CompactLayout private var compact

  public init(
    showCloseButton: Bool = false,
    closeLabel: LocalizedStringKey? = nil,
    width: CGFloat? = 288,
    @ViewBuilder content: () -> Content
  ) {
    self.showCloseButton = showCloseButton
    self.closeLabel = closeLabel
    self.width = width
    self.content = content()
  }

  public var body: some View {
    if compact {
      DrawerContent(showCloseButton: showCloseButton, closeLabel: closeLabel) { content }
    } else {
      PopoverContent(width: width) { content }
    }
  }
}

public struct FlyoutHeader<Content: View>: View {
  let content: Content

  @CompactLayout private var compact

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if compact {
      DrawerHeader { content }
    } else {
      PopoverHeader { content }
    }
  }
}

public struct FlyoutBody<Content: View>: View {
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
    .padding(compact ? 16 : 0)
  }
}

public typealias FlyoutTitle = DialogTitle
public typealias FlyoutDescription = DialogDescription
public typealias FlyoutClose<Label: View> = DialogClose<Label>
