import SwiftUI

public struct BottomBar<Content: View>: View {
  let separator: Bool
  let content: Content

  @Environment(\.screenBackground) private var background

  public init(separator: Bool = true, @ViewBuilder content: () -> Content) {
    self.separator = separator
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 0) {
      content
    }
    .frame(maxWidth: .infinity)
    .background(background.ignoresSafeArea(.container, edges: .bottom))
    .overlay(alignment: .top) {
      if separator {
        Color.separator.frame(height: 1)
      }
    }
    .accessibilityElement(children: .contain)
  }
}

public struct BottomBarContent<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 8) {
      content
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 12)
    .frame(maxWidth: .infinity)
  }
}
