import SwiftUI

public struct Skeleton: View {
  let cornerRadius: CGFloat

  @Environment(\.accessibilityReduceMotion) private var reduceMotion
  @State private var dimmed = false

  public init(cornerRadius: CGFloat = Radius.md) {
    self.cornerRadius = cornerRadius
  }

  public var body: some View {
    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
      .fill(EsuissColor.muted)
      .opacity(dimmed ? 0.5 : 1)
      .onAppear {
        guard !reduceMotion else { return }
        withAnimation(.easeInOut(duration: 1).repeatForever(autoreverses: true)) {
          dimmed = true
        }
      }
      .onChange(of: reduceMotion) { _, reduced in
        if reduced {
          withAnimation(nil) { dimmed = false }
        }
      }
      .accessibilityHidden(true)
  }
}
