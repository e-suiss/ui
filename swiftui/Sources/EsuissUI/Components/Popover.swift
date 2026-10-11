import SwiftUI

public struct PopoverContent<Content: View>: View {
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

public struct PopoverHeader<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

public typealias PopoverTitle = DialogTitle
public typealias PopoverDescription = DialogDescription
