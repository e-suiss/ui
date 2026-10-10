import SwiftUI

extension View {
  public func modal<Content: View>(
    isPresented: Binding<Bool>,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    modifier(ModalPresenter(isPresented: isPresented, content: content))
  }
}

struct ModalPresenter<Body: View>: ViewModifier {
  let isPresented: Binding<Bool>
  @ViewBuilder let content: () -> Body

  @CompactLayout private var compact

  func body(content host: Content) -> some View {
    host
      .drawer(isPresented: isPresented.gated(compact)) {
        content().environment(\.patternCompact, true)
      }
      .dialog(isPresented: isPresented.gated(!compact)) {
        content().environment(\.patternCompact, false)
      }
  }
}

public struct ModalContent<Content: View>: View {
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
      DialogContent(showCloseButton: showCloseButton, closeLabel: closeLabel) { content }
    }
  }
}

public struct ModalHeader<Content: View>: View {
  let content: Content

  @CompactLayout private var compact

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if compact {
      DrawerHeader { content }
    } else {
      DialogHeader { content }
    }
  }
}

public struct ModalBody<Content: View>: View {
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

public struct ModalFooter<Content: View>: View {
  let content: Content

  @CompactLayout private var compact

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if compact {
      DrawerFooter {
        ReversedVStack(spacing: 8) {
          content
        }
      }
    } else {
      DialogFooter { content }
    }
  }
}

public typealias ModalTitle = DialogTitle
public typealias ModalDescription = DialogDescription
public typealias ModalClose<Label: View> = DialogClose<Label>
