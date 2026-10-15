import SwiftUI

public enum PageIndicatorSize: CaseIterable, Sendable {
  case sm, `default`

  var dot: CGFloat {
    switch self {
    case .sm: 6
    case .default: 8
    }
  }

  var activeWidth: CGFloat {
    switch self {
    case .sm: 16
    case .default: 24
    }
  }

  var spacing: CGFloat {
    switch self {
    case .sm: 6
    case .default: 8
    }
  }
}

public enum PageIndicatorVariant: CaseIterable, Sendable {
  case `default`, accent
}

struct PageIndicatorDot: Equatable, Sendable {
  let page: Int
  let scale: CGFloat
}

enum PageIndicatorMath {
  static let minimumVisible = 5

  static func window(count: Int, index: Int, maxVisible: Int) -> Range<Int> {
    let visible = max(maxVisible, minimumVisible)
    guard count > visible else { return 0..<max(count, 0) }
    let current = CarouselMath.clamp(index, count: count)
    let start = min(max(current - visible / 2, 0), count - visible)
    return start..<(start + visible)
  }

  static func dots(count: Int, index: Int, maxVisible: Int) -> [PageIndicatorDot] {
    let range = window(count: count, index: index, maxVisible: maxVisible)
    let hiddenBefore = range.lowerBound > 0
    let hiddenAfter = range.upperBound < count
    return range.map { page in
      let fromStart = page - range.lowerBound
      let fromEnd = range.upperBound - 1 - page
      var scale: CGFloat = 1
      if hiddenBefore && fromStart < 2 { scale = min(scale, fromStart == 0 ? 0.5 : 0.75) }
      if hiddenAfter && fromEnd < 2 { scale = min(scale, fromEnd == 0 ? 0.5 : 0.75) }
      return PageIndicatorDot(page: page, scale: scale)
    }
  }
}

public struct PageIndicator: View {
  public typealias Size = PageIndicatorSize
  public typealias Variant = PageIndicatorVariant

  let count: Int
  let index: Int
  let size: Size
  let variant: Variant
  let maxVisible: Int
  let onIndexChange: ((Int) -> Void)?

  @State private var taps = 0
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    count: Int,
    index: Int,
    size: Size = .default,
    variant: Variant = .default,
    maxVisible: Int = 7,
    onIndexChange: ((Int) -> Void)? = nil
  ) {
    self.count = count
    self.index = index
    self.size = size
    self.variant = variant
    self.maxVisible = maxVisible
    self.onIndexChange = onIndexChange
  }

  public var body: some View {
    let current = CarouselMath.clamp(index, count: count)
    let dots = PageIndicatorMath.dots(count: count, index: current, maxVisible: maxVisible)
    HStack(spacing: size.spacing) {
      ForEach(dots, id: \.page) { dot in
        let active = dot.page == current
        Capsule()
          .fill(active ? activeColor : EsuissColor.border)
          .frame(width: active ? size.activeWidth : size.dot, height: size.dot)
          .scaleEffect(dot.scale)
          .padding(.vertical, size.dot)
          .contentShape(Rectangle())
          .onTapGesture {
            if let onIndexChange, dot.page != current {
              taps += 1
              onIndexChange(dot.page)
            }
          }
          .transition(.scale.combined(with: .opacity))
      }
    }
    .animation(reduceMotion ? nil : carouselAnimation, value: current)
    .hapticFeedback(.selection, trigger: taps)
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(Text("Page"))
    .accessibilityValue(Text("\(current + 1) of \(count)"))
    .accessibilityAdjustableAction { direction in
      guard let onIndexChange else { return }
      switch direction {
      case .increment: if current < count - 1 { onIndexChange(current + 1) }
      case .decrement: if current > 0 { onIndexChange(current - 1) }
      @unknown default: break
      }
    }
  }

  private var activeColor: Color {
    switch variant {
    case .default: EsuissColor.foreground
    case .accent: EsuissColor.primary
    }
  }
}
