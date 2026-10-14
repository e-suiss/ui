import SwiftUI

extension View {
  public func sheet<Content: View>(
    isPresented: Binding<Bool>,
    side: Edge,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    modifier(
      CoverPresenter(
        isPresented: isPresented,
        enter: .easeOut(duration: 0.4),
        exit: .easeIn(duration: 0.3)
      ) { visible in
        SideSheetStage(side: side, visible: visible, content: content)
      }
    )
  }
}

extension EnvironmentValues {
  @Entry var sheetSide: Edge = .trailing
}

struct SideSheetStage<Content: View>: View {
  let side: Edge
  let visible: Bool
  @ViewBuilder let content: () -> Content

  @State private var drag: CGFloat = 0
  @Environment(\.overlayDismiss) private var dismiss
  @Environment(\.accessibilityReduceMotion) private var reduceMotion
  @Environment(\.layoutDirection) private var layoutDirection

  var body: some View {
    GeometryReader { proxy in
      let horizontal = side == .leading || side == .trailing
      let width = min(proxy.size.width * 0.75, proxy.size.width >= 640 ? 384 : .infinity)
      ZStack(alignment: alignment) {
        ScrimLayer(visible: visible)
        content()
          .environment(\.sheetSide, side)
          .frame(width: horizontal ? width : nil)
          .frame(maxHeight: horizontal ? .infinity : nil)
          .padding(8)
          .offset(offset(visible: visible))
          .opacity(visible ? 1 : 0)
          .gesture(swipe)
      }
      .frame(width: proxy.size.width, height: proxy.size.height)
    }
    .accessibilityAction(.escape) { dismiss?() }
  }

  private var alignment: Alignment {
    switch side {
    case .top: .top
    case .bottom: .bottom
    case .leading: .leading
    case .trailing: .trailing
    }
  }

  private var direction: CGSize {
    let flip: CGFloat = layoutDirection == .rightToLeft ? -1 : 1
    switch side {
    case .top: return CGSize(width: 0, height: -1)
    case .bottom: return CGSize(width: 0, height: 1)
    case .leading: return CGSize(width: -flip, height: 0)
    case .trailing: return CGSize(width: flip, height: 0)
    }
  }

  private func offset(visible: Bool) -> CGSize {
    let distance = (visible || reduceMotion ? 0 : 25) + drag
    return CGSize(width: direction.width * distance, height: direction.height * distance)
  }

  private var swipe: some Gesture {
    DragGesture(minimumDistance: 10)
      .onChanged { value in
        let moved = value.translation.width * direction.width + value.translation.height * direction.height
        drag = max(0, moved)
      }
      .onEnded { value in
        let predicted = value.predictedEndTranslation.width * direction.width
          + value.predictedEndTranslation.height * direction.height
        if drag > 80 || predicted > 240 {
          dismiss?()
          withAnimation(.easeIn(duration: 0.3)) { drag += 60 }
        } else {
          withAnimation(.spring(duration: 0.3)) { drag = 0 }
        }
      }
  }
}

public struct SheetContent<Content: View>: View {
  let showCloseButton: Bool
  let closeLabel: LocalizedStringKey?
  let content: Content

  @Environment(\.sheetSide) private var side

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
    let horizontal = side == .leading || side == .trailing
    let shape = RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous)
    VStack(alignment: .leading, spacing: 0) {
      content
    }
    .frame(maxWidth: .infinity, maxHeight: horizontal ? .infinity : nil, alignment: .topLeading)
    .fixedSize(horizontal: false, vertical: !horizontal)
    .environment(\.overlayCloseInset, showCloseButton ? (closeLabel == nil ? 56 : 96) : 0)
    .clipShape(shape)
    .background {
      shape
        .fill(Color.surfaceRaised)
        .shadow(.lg)
    }
    .overlay(alignment: .topTrailing) {
      if showCloseButton {
        OverlayCloseButton(label: closeLabel)
          .padding(.top, closeLabel == nil ? 19 : 17)
          .padding(.trailing, 16)
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityAddTraits(.isModal)
  }
}

public struct SheetHeader<Content: View>: View {
  let content: Content

  @Environment(\.overlayCloseInset) private var closeInset

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 6) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(24)
    .padding(.trailing, max(closeInset - 24, 0))
  }
}

public struct SheetFooter<Content: View>: View {
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
      .padding(24)
    }
  }
}

public typealias SheetTitle = DialogTitle
public typealias SheetDescription = DialogDescription
public typealias SheetClose<Label: View> = DialogClose<Label>
