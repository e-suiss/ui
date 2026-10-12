import SwiftUI

extension View {
  public func preview<Content: View>(
    isPresented: Binding<Bool>,
    arrowEdge: Edge = .top,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    modifier(PreviewPresenter(isPresented: isPresented, arrowEdge: arrowEdge, content: content))
  }
}

struct PreviewPresenter<Body: View>: ViewModifier {
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

public struct PreviewContent<Content: View>: View {
  let showCloseButton: Bool
  let closeLabel: LocalizedStringKey?
  let width: CGFloat?
  let content: Content

  @CompactLayout private var compact

  public init(
    showCloseButton: Bool = false,
    closeLabel: LocalizedStringKey? = nil,
    width: CGFloat? = 256,
    @ViewBuilder content: () -> Content
  ) {
    self.showCloseButton = showCloseButton
    self.closeLabel = closeLabel
    self.width = width
    self.content = content()
  }

  public var body: some View {
    if compact {
      DrawerContent(showCloseButton: showCloseButton, closeLabel: closeLabel) {
        VStack(alignment: .leading, spacing: 16) {
          content
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .padding(.trailing, showCloseButton ? (closeLabel == nil ? 40 : 80) : 0)
      }
    } else {
      PopoverContent(width: width) { content }
    }
  }
}
