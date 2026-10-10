import SwiftUI

extension View {
  public func hoverCard<Content: View>(
    side: Edge = .bottom,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    modifier(HoverCardModifier(side: side, card: content))
  }
}

private struct HoverCardModifier<Card: View>: ViewModifier {
  let side: Edge
  @ViewBuilder let card: () -> Card

  @State private var isPresented = false
  @State private var hoverTask: Task<Void, Never>?

  func body(content: Content) -> some View {
    content
      .simultaneousGesture(
        LongPressGesture(minimumDuration: 0.5).onEnded { _ in
          isPresented = true
        }
      )
      .onHover { hovering in
        hoverTask?.cancel()
        guard hovering else { return }
        hoverTask = Task {
          try? await Task.sleep(for: .milliseconds(600))
          if !Task.isCancelled { isPresented = true }
        }
      }
      .accessibilityAction(named: Text("Show preview")) {
        isPresented = true
      }
      .popover(isPresented: $isPresented, attachmentAnchor: .rect(.bounds), arrowEdge: side) {
        card()
      }
  }
}

public struct HoverCardContent<Content: View>: View {
  let width: CGFloat?
  let content: Content

  public init(width: CGFloat? = 288, @ViewBuilder content: () -> Content) {
    self.width = width
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      content
    }
    .font(TextStyle.base.font())
    .tracking(TextStyle.base.letterSpacing)
    .foregroundStyle(Color.label)
    .padding(16)
    .frame(width: width, alignment: .leading)
    .fixedSize(horizontal: width == nil, vertical: true)
    .presentationCompactAdaptation(.popover)
    .presentationBackground(Color.surfaceRaised)
  }
}
