import SwiftUI

enum IslandMath {
  static func ringProgress(_ value: Double) -> Double {
    min(max(value, 0), 1)
  }
}

public struct IslandRing: View {
  let value: Double
  let color: Color

  public init(value: Double, color: Color = EsuissColor.primary) {
    self.value = value
    self.color = color
  }

  public var body: some View {
    let progress = IslandMath.ringProgress(value)
    ZStack {
      Circle()
        .stroke(color.opacity(0.25), lineWidth: 2.5)
      Circle()
        .trim(from: 0, to: progress)
        .stroke(color, style: StrokeStyle(lineWidth: 2.5, lineCap: .round))
        .rotationEffect(.degrees(-90))
        .animation(.easeOut(duration: 0.3), value: progress)
    }
    .padding(2)
    .frame(width: 20, height: 20)
    .accessibilityHidden(true)
  }
}
