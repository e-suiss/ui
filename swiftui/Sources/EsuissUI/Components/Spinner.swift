import SwiftUI

public struct Spinner: View {
  public enum Size: CaseIterable, Sendable {
    case sm, `default`, lg, xl

    public var value: CGFloat {
      switch self {
      case .sm: 12
      case .default: 16
      case .lg: 24
      case .xl: 32
      }
    }
  }

  let dimension: CGFloat
  let label: Text

  public init(_ size: Size = .default, label: LocalizedStringKey = "Loading") {
    dimension = size.value
    self.label = Text(label)
  }

  public init(dimension: CGFloat, label: LocalizedStringKey = "Loading") {
    self.dimension = dimension
    self.label = Text(label)
  }

  public var body: some View {
    TimelineView(.periodic(from: .now, by: 0.1)) { context in
      let step = Int((context.date.timeIntervalSinceReferenceDate * 10).rounded(.down)) % 8
      SpinnerSpokes(dimension: dimension, progress: nil)
        .rotationEffect(.degrees(Double(step) * 45))
    }
    .frame(width: dimension, height: dimension)
    .accessibilityElement()
    .accessibilityLabel(label)
    .accessibilityAddTraits(.updatesFrequently)
  }
}

struct SpinnerSpokes: View {
  let dimension: CGFloat
  let progress: Double?

  var body: some View {
    let unit = dimension / 24
    ZStack {
      ForEach(0..<8, id: \.self) { index in
        Capsule()
          .fill(.foreground)
          .frame(width: 3.12 * unit, height: 7.2 * unit)
          .offset(y: -7.9 * unit)
          .rotationEffect(.degrees(Double(index) * 45))
          .opacity(opacity(index))
      }
    }
    .frame(width: dimension, height: dimension)
  }

  private func opacity(_ index: Int) -> Double {
    guard let progress else { return 0.2 + 0.8 * Double(index) / 7 }
    return min(max(progress * 8 - Double(index), 0), 1)
  }
}
