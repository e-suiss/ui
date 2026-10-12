import PhosphorSwift
import SwiftUI

enum ReorderMath {
  static func move<Element>(_ items: [Element], from source: Int, to destination: Int) -> [Element] {
    guard items.indices.contains(source), items.indices.contains(destination), source != destination else {
      return items
    }
    var result = items
    let element = result.remove(at: source)
    result.insert(element, at: destination)
    return result
  }

  static func target(from index: Int, translation: CGFloat, heights: [CGFloat]) -> Int {
    guard heights.indices.contains(index) else { return index }
    var target = index
    if translation > 0 {
      var travelled: CGFloat = 0
      while target + 1 < heights.count {
        let next = heights[target + 1]
        guard translation > travelled + next / 2 else { break }
        travelled += next
        target += 1
      }
    } else if translation < 0 {
      var travelled: CGFloat = 0
      while target - 1 >= 0 {
        let previous = heights[target - 1]
        guard -translation > travelled + previous / 2 else { break }
        travelled += previous
        target -= 1
      }
    }
    return target
  }

  static func shift(for index: Int, dragging: Int, target: Int, height: CGFloat) -> CGFloat {
    if dragging < target, index > dragging, index <= target { return -height }
    if dragging > target, index < dragging, index >= target { return height }
    return 0
  }
}

public struct ReorderList<Value: Hashable, Row: View>: View {
  let value: Binding<[Value]>
  let row: (Value) -> Row

  @State private var heights: [Value: CGFloat] = [:]
  @State private var dragging: Value?
  @State private var translation: CGFloat = 0
  @State private var drops = 0
  @Environment(\.screenBackground) private var background
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(_ value: Binding<[Value]>, @ViewBuilder row: @escaping (Value) -> Row) {
    self.value = value
    self.row = row
  }

  private var items: [Value] { value.wrappedValue }

  private var sizes: [CGFloat] { items.map { heights[$0] ?? 0 } }

  private var draggingIndex: Int? { dragging.flatMap { items.firstIndex(of: $0) } }

  private var target: Int? {
    draggingIndex.map { ReorderMath.target(from: $0, translation: translation, heights: sizes) }
  }

  private func commit(from source: Int, to destination: Int) {
    let next = ReorderMath.move(items, from: source, to: destination)
    if reduceMotion {
      value.wrappedValue = next
    } else {
      withAnimation(.smooth(duration: 0.25)) { value.wrappedValue = next }
    }
    AccessibilityNotification.Announcement(String(localized: "Moved to position \(destination + 1) of \(items.count)")).post()
  }

  public var body: some View {
    let draggingIndex = draggingIndex
    let target = target
    VStack(spacing: 0) {
      ForEach(Array(items.enumerated()), id: \.element) { index, item in
        let active = draggingIndex == index
        let shift = draggingIndex.flatMap { from in
          target.map { ReorderMath.shift(for: index, dragging: from, target: $0, height: sizes[from]) }
        } ?? 0
        rowView(item, index: index, active: active)
          .offset(y: active ? translation : shift)
          .animation(active || reduceMotion ? nil : .smooth(duration: 0.2), value: shift)
          .zIndex(active ? 1 : 0)
      }
    }
    .coordinateSpace(.named(ReorderSpace.name))
    .hapticFeedback(.impact(weight: .medium), trigger: dragging) { HapticMoments.lifted($0, $1) }
    .hapticFeedback(.selection, trigger: target) { HapticMoments.moved($0, $1) }
    .hapticFeedback(.impact(weight: .light), trigger: drops)
  }

  private func rowView(_ item: Value, index: Int, active: Bool) -> some View {
    HStack(spacing: 12) {
      row(item)
        .frame(maxWidth: .infinity, alignment: .leading)
      Ph.dotsSixVertical.bold
        .frame(width: 20, height: 20)
        .foregroundStyle(active ? Color.labelSecondary : .labelTertiary)
        .frame(width: 44, height: 44)
        .contentShape(Rectangle())
        .gesture(
          DragGesture(minimumDistance: 0, coordinateSpace: .named(ReorderSpace.name))
            .onChanged { gesture in
              if dragging != item { dragging = item }
              translation = gesture.translation.height
            }
            .onEnded { gesture in
              drops += 1
              let destination = ReorderMath.target(from: index, translation: gesture.translation.height, heights: sizes)
              if destination != index {
                var transaction = Transaction()
                transaction.disablesAnimations = true
                withTransaction(transaction) {
                  value.wrappedValue = ReorderMath.move(items, from: index, to: destination)
                  translation = gesture.translation.height - travelled(from: index, to: destination)
                }
              }
              withAnimation(reduceMotion ? nil : .smooth(duration: 0.25)) {
                translation = 0
              } completion: {
                dragging = nil
              }
            }
        )
        .accessibilityHidden(true)
    }
    .padding(.leading, 16)
    .padding(.trailing, 4)
    .frame(minHeight: 44)
    .background(active ? Color.surfaceRaised : background)
    .overlay(alignment: .bottom) {
      if index < items.count - 1 && !active {
        Color.separator.frame(height: 1).padding(.leading, 16)
      }
    }
    .shadow(active ? .lg : Shadow(color: .clear, radius: 0))
    .scaleEffect(active && !reduceMotion ? 1.02 : 1)
    .animation(.easeOut(duration: 0.15), value: active)
    .onGeometryChange(for: CGFloat.self) { $0.size.height } action: { heights[item] = $0 }
    .accessibilityElement(children: .combine)
    .accessibilityActions {
      if index > 0 {
        Button("Move up") { commit(from: index, to: index - 1) }
      }
      if index < items.count - 1 {
        Button("Move down") { commit(from: index, to: index + 1) }
      }
    }
  }

  private func travelled(from source: Int, to destination: Int) -> CGFloat {
    if destination > source {
      return sizes[(source + 1)...destination].reduce(0, +)
    }
    return -sizes[destination..<source].reduce(0, +)
  }
}

enum ReorderSpace {
  static let name = "reorder-list"
}
