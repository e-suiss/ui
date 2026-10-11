import Observation
import PhosphorSwift
import SwiftUI

public enum CardStackDirection: CaseIterable, Sendable {
  case left, right

  var sign: CGFloat { self == .left ? -1 : 1 }
}

enum CardStackMath {
  static let maxRotation: Double = 12
  static let depthScale: CGFloat = 0.05
  static let depthOffset: CGFloat = 12

  static func threshold(width: CGFloat) -> CGFloat {
    min(120, width * 0.3)
  }

  static func direction(translation: CGFloat, predicted: CGFloat, width: CGFloat) -> CardStackDirection? {
    let limit = threshold(width: width)
    if translation <= -limit || (predicted <= -width * 0.6 && translation < 0) { return .left }
    if translation >= limit || (predicted >= width * 0.6 && translation > 0) { return .right }
    return nil
  }

  static func rotation(translation: CGFloat, width: CGFloat) -> Double {
    guard width > 0 else { return 0 }
    let value = Double(translation / width) * maxRotation * 1.5
    return min(max(value, -maxRotation), maxRotation)
  }

  static func progress(translation: CGFloat, width: CGFloat) -> CGFloat {
    let limit = threshold(width: width)
    guard limit > 0 else { return 0 }
    return min(abs(translation) / limit, 1)
  }

  static func scale(depth: Int, progress: CGFloat) -> CGFloat {
    let position = max(CGFloat(depth) - progress, 0)
    return 1 - position * depthScale
  }

  static func offset(depth: Int, progress: CGFloat) -> CGFloat {
    let position = max(CGFloat(depth) - progress, 0)
    return position * depthOffset
  }

  static func exit(direction: CardStackDirection, width: CGFloat) -> CGFloat {
    direction.sign * (width * 1.5 + 80)
  }
}

@MainActor
@Observable
public final class CardStackController {
  public private(set) var index = 0
  public private(set) var history: [CardStackDirection] = []
  public internal(set) var count = 0

  var pending: CardStackDirection?
  var restoring: CardStackDirection?

  public init() {}

  public var canSwipe: Bool { index < count }

  public var canUndo: Bool { !history.isEmpty && index > 0 }

  public func swipe(_ direction: CardStackDirection) {
    guard canSwipe, pending == nil else { return }
    pending = direction
  }

  public func undo() {
    guard canUndo, let last = history.popLast() else { return }
    index -= 1
    restoring = last
  }

  public func reset() {
    index = 0
    history = []
    pending = nil
    restoring = nil
  }

  func commit(_ direction: CardStackDirection) {
    guard index < count else { return }
    history.append(direction)
    index += 1
    pending = nil
  }
}

public struct CardStack<Item: Identifiable, Card: View>: View {
  let items: [Item]
  let controller: CardStackController
  let visibleCount: Int
  let onSwipe: ((CardStackDirection, Item) -> Void)?
  let onUndo: ((Item) -> Void)?
  let card: (Item) -> Card

  @State private var drag: CGSize
  @State private var exiting: CardStackDirection?
  @State private var width: CGFloat = 0
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    _ items: [Item],
    controller: CardStackController,
    visibleCount: Int = 3,
    onSwipe: ((CardStackDirection, Item) -> Void)? = nil,
    onUndo: ((Item) -> Void)? = nil,
    @ViewBuilder card: @escaping (Item) -> Card
  ) {
    self.items = items
    self.controller = controller
    self.visibleCount = max(visibleCount, 1)
    self.onSwipe = onSwipe
    self.onUndo = onUndo
    self.card = card
    _drag = State(initialValue: .zero)
  }

  init(
    _ items: [Item],
    controller: CardStackController,
    drag: CGSize,
    @ViewBuilder card: @escaping (Item) -> Card
  ) {
    self.init(items, controller: controller, card: card)
    _drag = State(initialValue: drag)
  }

  public var body: some View {
    let start = min(controller.index, items.count)
    let end = min(start + visibleCount, items.count)
    let visible = Array(items[start..<end].enumerated())
    let progress = CardStackMath.progress(translation: drag.width, width: width)
    ZStack {
      ForEach(visible.reversed(), id: \.element.id) { depth, item in
        let top = depth == 0
        card(item)
          .frame(maxWidth: .infinity, maxHeight: .infinity)
          .scaleEffect(top ? 1 : CardStackMath.scale(depth: depth, progress: progress), anchor: .bottom)
          .offset(y: top ? 0 : CardStackMath.offset(depth: depth, progress: progress))
          .offset(x: top ? drag.width : 0, y: top ? drag.height * 0.4 : 0)
          .rotationEffect(.degrees(top ? CardStackMath.rotation(translation: drag.width, width: width) : 0), anchor: .bottom)
          .zIndex(Double(visibleCount - depth))
          .allowsHitTesting(top)
          .gesture(dragGesture(item), including: top ? .all : .subviews)
          .accessibilityHidden(!top)
          .accessibilityActions {
            if top {
              Button("Swipe left") { controller.swipe(.left) }
              Button("Swipe right") { controller.swipe(.right) }
            }
          }
          .transition(.identity)
      }
    }
    .padding(.bottom, CardStackMath.depthOffset * CGFloat(max(visibleCount - 1, 0)))
    .onGeometryChange(for: CGFloat.self) { proxy in
      proxy.size.width
    } action: { value in
      width = value
    }
    .hapticFeedback(.impact(weight: .medium), trigger: controller.index) { old, new in new > old }
    .onAppear { controller.count = items.count }
    .onChange(of: items.count) { _, value in controller.count = value }
    .onChange(of: controller.pending) { _, value in
      if let value { fling(value) }
    }
    .onChange(of: controller.restoring) { _, value in
      guard let value else { return }
      restore(value)
    }
  }

  private func dragGesture(_ item: Item) -> some Gesture {
    DragGesture(minimumDistance: 8)
      .onChanged { value in
        guard exiting == nil else { return }
        drag = value.translation
      }
      .onEnded { value in
        guard exiting == nil else { return }
        if let direction = CardStackMath.direction(
          translation: value.translation.width,
          predicted: value.predictedEndTranslation.width,
          width: width
        ) {
          fling(direction)
        } else {
          withAnimation(reduceMotion ? .linear(duration: 0.15) : .spring(duration: 0.4, bounce: 0.35)) {
            drag = .zero
          }
        }
      }
  }

  private func fling(_ direction: CardStackDirection) {
    let start = controller.index
    guard start < items.count else {
      controller.pending = nil
      return
    }
    let item = items[start]
    exiting = direction
    let target = CGSize(width: CardStackMath.exit(direction: direction, width: max(width, 320)), height: drag.height + 40)
    withAnimation(reduceMotion ? .linear(duration: 0.15) : .easeOut(duration: 0.3)) {
      drag = target
    } completion: {
      var transaction = Transaction()
      transaction.disablesAnimations = true
      withTransaction(transaction) {
        controller.commit(direction)
        drag = .zero
        exiting = nil
      }
      onSwipe?(direction, item)
    }
  }

  private func restore(_ direction: CardStackDirection) {
    let index = controller.index
    controller.restoring = nil
    guard index < items.count else { return }
    var transaction = Transaction()
    transaction.disablesAnimations = true
    withTransaction(transaction) {
      drag = CGSize(width: CardStackMath.exit(direction: direction, width: max(width, 320)), height: 40)
    }
    withAnimation(reduceMotion ? .linear(duration: 0.15) : .spring(duration: 0.45, bounce: 0.2)) {
      drag = .zero
    }
    onUndo?(items[index])
  }
}

public enum CardStackAction: CaseIterable, Sendable {
  case swipeLeft, swipeRight, undo
}

public struct CardStackButton: View {
  let action: CardStackAction
  let controller: CardStackController
  let size: VariantButtonStyle.Size

  public init(_ action: CardStackAction, controller: CardStackController, size: VariantButtonStyle.Size = .iconXl) {
    self.action = action
    self.controller = controller
    self.size = size
  }

  public var body: some View {
    let enabled = action == .undo ? controller.canUndo : controller.canSwipe
    Button {
      switch action {
      case .swipeLeft: controller.swipe(.left)
      case .swipeRight: controller.swipe(.right)
      case .undo: controller.undo()
      }
    } label: {
      icon
        .frame(width: size == .iconXl ? 22 : size.iconSize, height: size == .iconXl ? 22 : size.iconSize)
    }
    .buttonStyle(.variant(variant, size: size))
    .clipShape(Circle())
    .disabled(!enabled)
    .accessibilityLabel(Text(label))
  }

  private var variant: VariantButtonStyle.Variant {
    switch action {
    case .swipeLeft: .secondary
    case .swipeRight: .default
    case .undo: .ghost
    }
  }

  @ViewBuilder private var icon: some View {
    switch action {
    case .swipeLeft: Ph.x.bold
    case .swipeRight: Ph.check.bold
    case .undo: Ph.arrowCounterClockwise.bold
    }
  }

  private var label: LocalizedStringKey {
    switch action {
    case .swipeLeft: "Swipe left"
    case .swipeRight: "Swipe right"
    case .undo: "Undo"
    }
  }
}
