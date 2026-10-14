import SwiftUI

extension EnvironmentValues {
  @Entry var screenBackground: Color = .surface
}

public struct Screen<Content: View>: View {
  public enum Background: CaseIterable, Sendable {
    case surface, surfaceSecondary

    var color: Color {
      switch self {
      case .surface: .surface
      case .surfaceSecondary: .surfaceSecondary
      }
    }
  }

  let edges: Edge.Set
  let background: Background
  let content: Content

  public init(
    edges: Edge.Set = .all,
    background: Background = .surface,
    @ViewBuilder content: () -> Content
  ) {
    self.edges = edges
    self.background = background
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 0) {
      content
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    .ignoresSafeArea(.container, edges: Edge.Set.all.subtracting(edges))
    .foregroundStyle(Color.label)
    .background(background.color.ignoresSafeArea())
    .environment(\.screenBackground, background.color)
  }
}

public struct ScreenContent<Content: View>: View {
  let scroll: Bool
  let padded: Bool
  let content: Content

  public init(scroll: Bool = true, padded: Bool = true, @ViewBuilder content: () -> Content) {
    self.scroll = scroll
    self.padded = padded
    self.content = content()
  }

  public var body: some View {
    if scroll {
      KeyboardScrollView {
        stack
      }
    } else {
      stack
        .frame(maxHeight: .infinity, alignment: .top)
    }
  }

  private var stack: some View {
    VStack(alignment: .leading, spacing: 16) {
      content
    }
    .padding(padded ? 16 : 0)
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}
