import SwiftUI

extension View {
  public func drawer<Content: View>(
    isPresented: Binding<Bool>,
    detents: Set<PresentationDetent>? = nil,
    selection: Binding<PresentationDetent>? = nil,
    onDismiss: (() -> Void)? = nil,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    let binding = isPresented
    return sheet(isPresented: isPresented, onDismiss: onDismiss) {
      DrawerHost(detents: detents, selection: selection, content: content)
        .environment(\.overlayDismiss, OverlayDismiss { binding.wrappedValue = false })
    }
  }
}

extension EnvironmentValues {
  @Entry var drawerFitsContent = false
}

struct DrawerHost<Content: View>: View {
  let detents: Set<PresentationDetent>?
  let selection: Binding<PresentationDetent>?
  @ViewBuilder let content: () -> Content

  @State private var height: CGFloat = 0
  @State private var bottomInset: CGFloat = 0

  var body: some View {
    let styled = content()
      .environment(\.drawerFitsContent, detents == nil)
      .frame(maxWidth: .infinity, maxHeight: detents == nil ? nil : .infinity, alignment: .top)
      .onGeometryChange(for: CGFloat.self) { proxy in
        proxy.size.height
      } action: { value in
        height = value
      }
      .background {
        GeometryReader { proxy in
          Color.clear.onAppear { bottomInset = proxy.safeAreaInsets.bottom }
        }
      }
      .presentationDragIndicator(.visible)
      .presentationBackground(Color.surfaceRaised)
      .presentationCornerRadius(Radius.xl3)
    if let detents, let selection {
      styled.presentationDetents(detents, selection: selection)
    } else if let detents {
      styled.presentationDetents(detents)
    } else {
      styled.presentationDetents([.height(max(height + bottomInset, 1))])
    }
  }
}

public struct DrawerContent<Content: View>: View {
  let showCloseButton: Bool
  let closeLabel: LocalizedStringKey?
  let content: Content

  @Environment(\.drawerFitsContent) private var fitsContent

  public init(
    showCloseButton: Bool = false,
    closeLabel: LocalizedStringKey? = nil,
    @ViewBuilder content: () -> Content
  ) {
    self.showCloseButton = showCloseButton
    self.closeLabel = closeLabel
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      content
    }
    .padding(.top, 12)
    .frame(maxWidth: .infinity, maxHeight: fitsContent ? nil : .infinity, alignment: .top)
    .fixedSize(horizontal: false, vertical: fitsContent)
    .environment(\.overlayCloseInset, showCloseButton ? (closeLabel == nil ? 56 : 96) : 0)
    .overlay(alignment: .topTrailing) {
      if showCloseButton {
        OverlayCloseButton(label: closeLabel)
          .padding(.top, closeLabel == nil ? 23 : 21)
          .padding(.trailing, 16)
      }
    }
    .background(Color.surfaceRaised)
  }
}

public struct DrawerHeader<Content: View>: View {
  let content: Content

  @Environment(\.overlayCloseInset) private var closeInset

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 2) {
      content
    }
    .multilineTextAlignment(.center)
    .frame(maxWidth: .infinity)
    .padding(.top, 16)
    .padding(.horizontal, max(closeInset, 16))
  }
}

public struct DrawerFooter<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 0) {
      Spacer(minLength: 0)
      VStack(spacing: 8) {
        content
      }
      .frame(maxWidth: .infinity)
      .padding([.horizontal, .bottom], 16)
    }
  }
}

public typealias DrawerTitle = DialogTitle
public typealias DrawerDescription = DialogDescription
public typealias DrawerClose<Label: View> = DialogClose<Label>
