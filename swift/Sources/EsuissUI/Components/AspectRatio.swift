import SwiftUI

public struct AspectRatio<Content: View>: View {
  let ratio: CGFloat
  let content: Content

  public init(ratio: CGFloat = 1, @ViewBuilder content: () -> Content) {
    self.ratio = ratio
    self.content = content()
  }

  public var body: some View {
    Color.clear
      .aspectRatio(ratio, contentMode: .fit)
      .overlay {
        content
      }
      .clipped()
  }
}
