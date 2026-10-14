import SwiftUI

public struct Separator: View {
  let orientation: Axis

  public init(_ orientation: Axis = .horizontal) {
    self.orientation = orientation
  }

  public var body: some View {
    Rectangle()
      .fill(Color.separator)
      .frame(width: orientation == .vertical ? 1 : nil, height: orientation == .horizontal ? 1 : nil)
      .frame(maxWidth: orientation == .horizontal ? .infinity : nil, maxHeight: orientation == .vertical ? .infinity : nil)
      .accessibilityHidden(true)
  }
}
