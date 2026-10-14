import PhosphorSwift
import Observation
import SwiftUI

public enum PopupAlignment: Sendable, CaseIterable {
  case start, center, end
}

struct OverlayDismiss: Sendable {
  let action: @MainActor @Sendable () -> Void

  @MainActor func callAsFunction() {
    action()
  }
}

extension EnvironmentValues {
  @Entry var overlayDismiss: OverlayDismiss? = nil
}

private var instantTransaction: Transaction {
  var transaction = Transaction()
  transaction.disablesAnimations = true
  return transaction
}

struct CoverPresenter<Cover: View>: ViewModifier {
  @Binding var isPresented: Bool
  var enter: Animation = .easeOut(duration: 0.15)
  var exit: Animation = .easeIn(duration: 0.1)
  @ViewBuilder let cover: (Bool) -> Cover

  @State private var presented = false
  @State private var visible = false

  func body(content: Content) -> some View {
    let binding = $isPresented
    content
      .fullScreenCover(isPresented: coverBinding) {
        cover(visible)
          .environment(\.overlayDismiss, OverlayDismiss { binding.wrappedValue = false })
          .presentationBackground(.clear)
          .onAppear {
            withAnimation(enter) { visible = true }
          }
      }
      .onChange(of: isPresented, initial: true) { _, value in
        if value {
          withTransaction(instantTransaction) { presented = true }
        } else if presented {
          withAnimation(exit) {
            visible = false
          } completion: {
            withTransaction(instantTransaction) { presented = false }
          }
        }
      }
  }

  private var coverBinding: Binding<Bool> {
    Binding(
      get: { presented },
      set: { value in
        presented = value
        if !value {
          visible = false
          isPresented = false
        }
      }
    )
  }
}

struct PopupLayout: Layout {
  var anchor: CGRect
  var side: Edge
  var align: PopupAlignment
  var sideOffset: CGFloat
  var alignOffset: CGFloat
  var matchWidth: Bool
  var minWidth: CGFloat
  var maxHeight: CGFloat
  var margin: CGFloat = 8

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    proposal.replacingUnspecifiedDimensions()
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    guard let view = subviews.first else { return }
    let anchor = anchor.offsetBy(dx: bounds.minX, dy: bounds.minY)
    let maxWidth = max(0, bounds.width - margin * 2)
    var width: CGFloat
    if matchWidth {
      width = max(anchor.width, minWidth)
    } else {
      width = max(view.sizeThatFits(ProposedViewSize(width: nil, height: nil)).width, minWidth)
    }
    width = min(width, maxWidth)
    let natural = view.sizeThatFits(ProposedViewSize(width: width, height: nil))
    let vertical = side == .top || side == .bottom
    let before = vertical
      ? anchor.minY - sideOffset - bounds.minY - margin
      : anchor.minX - sideOffset - bounds.minX - margin
    let after = vertical
      ? bounds.maxY - margin - anchor.maxY - sideOffset
      : bounds.maxX - margin - anchor.maxX - sideOffset
    let extent = vertical ? natural.height : natural.width
    var resolved = side
    switch side {
    case .bottom where extent > after && before > after: resolved = .top
    case .top where extent > before && after > before: resolved = .bottom
    case .trailing where extent > after && before > after: resolved = .leading
    case .leading where extent > before && after > before: resolved = .trailing
    default: break
    }
    var height = natural.height
    let space: CGFloat
    switch resolved {
    case .top, .leading: space = before
    case .bottom, .trailing: space = after
    }
    if vertical {
      height = min(height, maxHeight, max(space, 0))
    } else {
      height = min(height, maxHeight, bounds.height - margin * 2)
      width = min(width, max(space, 0))
    }
    var x: CGFloat
    var y: CGFloat
    if vertical {
      switch align {
      case .start: x = anchor.minX + alignOffset
      case .center: x = anchor.midX - width / 2 + alignOffset
      case .end: x = anchor.maxX - width - alignOffset
      }
      y = resolved == .bottom ? anchor.maxY + sideOffset : anchor.minY - sideOffset - height
    } else {
      switch align {
      case .start: y = anchor.minY + alignOffset
      case .center: y = anchor.midY - height / 2 + alignOffset
      case .end: y = anchor.maxY - height - alignOffset
      }
      x = resolved == .trailing ? anchor.maxX + sideOffset : anchor.minX - sideOffset - width
    }
    x = min(max(x, bounds.minX + margin), bounds.maxX - margin - width)
    y = min(max(y, bounds.minY + margin), bounds.maxY - margin - height)
    view.place(
      at: CGPoint(x: x, y: y),
      anchor: .topLeading,
      proposal: ProposedViewSize(width: width, height: height)
    )
  }
}

struct PopupPresenter<Popup: View>: ViewModifier {
  @Binding var isPresented: Bool
  var side: Edge = .bottom
  var align: PopupAlignment = .start
  var sideOffset: CGFloat = 4
  var alignOffset: CGFloat = 0
  var matchWidth = false
  var minWidth: CGFloat = 0
  var maxHeight: CGFloat = .infinity
  @ViewBuilder let popup: () -> Popup

  @State private var anchor = PopupAnchor()

  func body(content: Content) -> some View {
    content
      .onGeometryChange(for: CGRect.self) { proxy in
        proxy.frame(in: .global)
      } action: { frame in
        anchor.frame = frame
      }
      .modifier(
        CoverPresenter(isPresented: $isPresented) { visible in
          PopupCanvas(
            anchor: anchor,
            side: side,
            align: align,
            sideOffset: sideOffset,
            alignOffset: alignOffset,
            matchWidth: matchWidth,
            minWidth: minWidth,
            maxHeight: maxHeight,
            visible: visible,
            popup: popup
          )
        }
      )
  }
}

@Observable
final class PopupAnchor {
  var frame: CGRect = .zero
}

struct PopupCanvas<Popup: View>: View {
  let anchor: PopupAnchor
  let side: Edge
  let align: PopupAlignment
  let sideOffset: CGFloat
  let alignOffset: CGFloat
  let matchWidth: Bool
  let minWidth: CGFloat
  let maxHeight: CGFloat
  let visible: Bool
  @ViewBuilder let popup: () -> Popup

  @Environment(\.overlayDismiss) private var dismiss
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    GeometryReader { proxy in
      let origin = proxy.frame(in: .global).origin
      PopupLayout(
        anchor: anchor.frame.offsetBy(dx: -origin.x, dy: -origin.y),
        side: side,
        align: align,
        sideOffset: sideOffset,
        alignOffset: alignOffset,
        matchWidth: matchWidth,
        minWidth: minWidth,
        maxHeight: maxHeight
      ) {
        popup()
          .accessibilityAddTraits(.isModal)
          .scaleEffect(visible || reduceMotion ? 1 : 0.96, anchor: scaleAnchor)
          .opacity(visible ? 1 : 0)
      }
    }
    .background {
      Color.clear
        .contentShape(Rectangle())
        .ignoresSafeArea()
        .onTapGesture { dismiss?() }
        .accessibilityHidden(true)
    }
    .accessibilityAction(.escape) { dismiss?() }
  }

  private var scaleAnchor: UnitPoint {
    switch side {
    case .top: .bottom
    case .bottom: .top
    case .leading: .trailing
    case .trailing: .leading
    }
  }
}

extension View {
  func anchoredPopup<Popup: View>(
    isPresented: Binding<Bool>,
    side: Edge = .bottom,
    align: PopupAlignment = .start,
    sideOffset: CGFloat = 4,
    alignOffset: CGFloat = 0,
    matchWidth: Bool = false,
    minWidth: CGFloat = 0,
    maxHeight: CGFloat = .infinity,
    @ViewBuilder popup: @escaping () -> Popup
  ) -> some View {
    modifier(
      PopupPresenter(
        isPresented: isPresented,
        side: side,
        align: align,
        sideOffset: sideOffset,
        alignOffset: alignOffset,
        matchWidth: matchWidth,
        minWidth: minWidth,
        maxHeight: maxHeight,
        popup: popup
      )
    )
  }

  func popupSurface(radius: CGFloat = Radius.xl, shadow: Shadow = .lg) -> some View {
    modifier(PopupSurface(radius: radius, shadow: shadow))
  }
}

struct PopupSurface: ViewModifier {
  let radius: CGFloat
  let shadow: Shadow

  @Environment(\.colorScheme) private var colorScheme

  func body(content: Content) -> some View {
    let shape = RoundedRectangle(cornerRadius: radius, style: .continuous)
    content
      .clipShape(shape)
      .background {
        shape
          .fill(Color.surfaceRaised)
          .shadow(shadow)
      }
      .overlay {
        shape.strokeBorder(Color.label.opacity(colorScheme == .dark ? 0.1 : 0.05))
      }
  }
}

struct OverlayCloseButton: View {
  let label: LocalizedStringKey?

  @Environment(\.overlayDismiss) private var dismiss

  var body: some View {
    if let label {
      Button {
        dismiss?()
      } label: {
        Text(label).font(TextStyle.base.font())
      }
      .buttonStyle(.variant(.plain, size: .sm))
    } else {
      Button {
        dismiss?()
      } label: {
        Ph.x.regular
          .frame(width: 16, height: 16)
          .foregroundStyle(Color.label)
      }
      .buttonStyle(CloseIconButtonStyle())
      .accessibilityLabel(Text("Close"))
    }
  }
}

private struct CloseIconButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .frame(width: 32, height: 32)
      .background(configuration.isPressed ? Color.separator : .surfaceTertiary, in: Circle())
      .contentShape(Circle().inset(by: -8))
  }
}

struct ReversedVStack: Layout {
  var spacing: CGFloat

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let width = proposal.width
    var height: CGFloat = 0
    var widest: CGFloat = 0
    for view in subviews {
      let size = view.sizeThatFits(ProposedViewSize(width: width, height: nil))
      height += size.height
      widest = max(widest, size.width)
    }
    height += spacing * CGFloat(max(subviews.count - 1, 0))
    return CGSize(width: width ?? widest, height: height)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    var y = bounds.minY
    for view in subviews.reversed() {
      let size = view.sizeThatFits(ProposedViewSize(width: bounds.width, height: nil))
      view.place(
        at: CGPoint(x: bounds.minX, y: y),
        anchor: .topLeading,
        proposal: ProposedViewSize(width: bounds.width, height: size.height)
      )
      y += size.height + spacing
    }
  }
}

struct ScrimLayer: View {
  let visible: Bool
  var dismissible = true

  @Environment(\.overlayDismiss) private var dismiss

  var body: some View {
    Color.scrim
      .ignoresSafeArea()
      .opacity(visible ? 1 : 0)
      .contentShape(Rectangle())
      .onTapGesture {
        if dismissible { dismiss?() }
      }
      .accessibilityHidden(true)
  }
}
