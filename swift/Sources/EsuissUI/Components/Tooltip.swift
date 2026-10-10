import SwiftUI

extension View {
  public func tooltip(_ text: LocalizedStringKey, side: Edge = .top) -> some View {
    modifier(TooltipModifier(side: side) { Text(text) })
      .accessibilityHint(Text(text))
  }

  public func tooltip<Content: View>(
    side: Edge = .top,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    modifier(TooltipModifier(side: side, tip: content))
  }
}

private struct TooltipModifier<Tip: View>: ViewModifier {
  let side: Edge
  @ViewBuilder let tip: () -> Tip

  @State private var isPresented = false

  func body(content: Content) -> some View {
    content
      .simultaneousGesture(
        LongPressGesture(minimumDuration: 0.5).onEnded { _ in
          isPresented = true
        }
      )
      .popover(isPresented: $isPresented, attachmentAnchor: .rect(.bounds), arrowEdge: side) {
        TooltipContent { tip() }
          .task {
            try? await Task.sleep(for: .seconds(1.5))
            isPresented = false
          }
      }
  }
}

public struct TooltipContent<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    CappedWidthLayout(maxWidth: 320) {
      HStack(spacing: 6) {
        content
      }
      .font(TextStyle.xs.font())
      .tracking(TextStyle.xs.letterSpacing)
      .foregroundStyle(Color.surface)
      .padding(.horizontal, 12)
      .padding(.vertical, 6)
    }
    .presentationCompactAdaptation(.popover)
    .presentationBackground(Color.label)
    .accessibilityAddTraits(.isStaticText)
  }
}

private struct CappedWidthLayout: Layout {
  let maxWidth: CGFloat

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    guard let view = subviews.first else { return .zero }
    let ideal = view.sizeThatFits(.unspecified)
    let width = min(ideal.width, maxWidth, proposal.width ?? .infinity)
    return view.sizeThatFits(ProposedViewSize(width: width, height: nil))
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    subviews.first?.place(
      at: bounds.origin,
      anchor: .topLeading,
      proposal: ProposedViewSize(width: bounds.width, height: bounds.height)
    )
  }
}
