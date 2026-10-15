import SwiftUI

public struct ValueSlider<Value: BinaryFloatingPoint>: View where Value.Stride: BinaryFloatingPoint {
  @Binding var value: Value
  let bounds: ClosedRange<Value>
  let step: Value.Stride?
  let onEditingChanged: (Bool) -> Void

  public init(
    value: Binding<Value>,
    in bounds: ClosedRange<Value> = 0...1,
    step: Value.Stride? = nil,
    onEditingChanged: @escaping (Bool) -> Void = { _ in }
  ) {
    _value = value
    self.bounds = bounds
    self.step = step
    self.onEditingChanged = onEditingChanged
  }

  private var stepValue: Double? {
    guard let step else { return nil }
    return Double(step)
  }

  public var body: some View {
    SliderTrack(
      values: [Double(value)],
      bounds: Double(bounds.lowerBound)...Double(bounds.upperBound),
      step: stepValue,
      onEditingChanged: onEditingChanged
    ) { _, newValue in
      value = Value(newValue)
    }
  }
}

public struct RangeSlider<Value: BinaryFloatingPoint>: View where Value.Stride: BinaryFloatingPoint {
  @Binding var value: ClosedRange<Value>
  let bounds: ClosedRange<Value>
  let step: Value.Stride?
  let onEditingChanged: (Bool) -> Void

  public init(
    value: Binding<ClosedRange<Value>>,
    in bounds: ClosedRange<Value> = 0...1,
    step: Value.Stride? = nil,
    onEditingChanged: @escaping (Bool) -> Void = { _ in }
  ) {
    _value = value
    self.bounds = bounds
    self.step = step
    self.onEditingChanged = onEditingChanged
  }

  private var stepValue: Double? {
    guard let step else { return nil }
    return Double(step)
  }

  public var body: some View {
    SliderTrack(
      values: [Double(value.lowerBound), Double(value.upperBound)],
      bounds: Double(bounds.lowerBound)...Double(bounds.upperBound),
      step: stepValue,
      onEditingChanged: onEditingChanged
    ) { index, newValue in
      let updated = Value(newValue)
      if index == 0 {
        value = min(updated, value.upperBound)...value.upperBound
      } else {
        value = value.lowerBound...max(updated, value.lowerBound)
      }
    }
  }
}

private struct SliderTrack: View {
  let values: [Double]
  let bounds: ClosedRange<Double>
  let step: Double?
  let onEditingChanged: (Bool) -> Void
  let update: (Int, Double) -> Void

  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.accessibilityReduceMotion) private var reduceMotion
  @State private var active: Int?
  @State private var ticks = 0

  private let thumbWidth: CGFloat = 32
  private let thumbHeight: CGFloat = 20

  init(
    values: [Double],
    bounds: ClosedRange<Double>,
    step: Double?,
    onEditingChanged: @escaping (Bool) -> Void,
    update: @escaping (Int, Double) -> Void
  ) {
    self.values = values
    self.bounds = bounds
    self.step = step
    self.onEditingChanged = onEditingChanged
    self.update = update
  }

  var body: some View {
    GeometryReader { proxy in
      let travel = max(0, proxy.size.width - thumbWidth)
      let centers = values.map { thumbWidth / 2 + travel * fraction($0) }
      let start = values.count > 1 ? centers[0] : 0
      let end = centers.last ?? 0
      ZStack(alignment: .leading) {
        Capsule()
          .fill(EsuissColor.border)
          .frame(height: 4)
          .overlay(alignment: .leading) {
            Rectangle()
              .fill(EsuissColor.primary)
              .frame(width: max(0, end - start))
              .offset(x: start)
          }
          .clipShape(Capsule())
        ForEach(values.indices, id: \.self) { index in
          thumb(dragging: active == index)
            .position(x: centers[index], y: proxy.size.height / 2)
            .accessibilityElement()
            .accessibilityLabel(index == 0 ? Text("Minimum") : Text("Maximum"))
            .accessibilityValue(Text(format(values[index])))
            .accessibilityAdjustableAction { adjust(index, $0) }
        }
      }
      .frame(maxHeight: .infinity)
      .opacity(isEnabled ? 1 : 0.5)
      .contentShape(Rectangle())
      .gesture(
        DragGesture(minimumDistance: 0)
          .onChanged { gesture in
            let index = active ?? nearest(to: gesture.startLocation.x, centers: centers)
            if active == nil {
              withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.2)) {
                active = index
              }
              onEditingChanged(true)
            }
            let ratio = travel > 0 ? (gesture.location.x - thumbWidth / 2) / travel : 0
            change(index, clamp(bounds.lowerBound + Double(ratio) * (bounds.upperBound - bounds.lowerBound)))
          }
          .onEnded { _ in
            withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.2)) {
              active = nil
            }
            onEditingChanged(false)
          }
      )
    }
    .frame(height: 32)
    .hapticFeedback(.selection, trigger: ticks)
    .accessibilityElement(children: values.count > 1 ? .contain : .ignore)
    .accessibilityValue(values.count > 1 ? Text(verbatim: "") : Text(format(values.first ?? 0)))
    .accessibilityAdjustableAction { direction in
      if values.count == 1 { adjust(0, direction) }
    }
  }

  private func adjust(_ index: Int, _ direction: AccessibilityAdjustmentDirection) {
    let delta = step ?? (bounds.upperBound - bounds.lowerBound) / 10
    let next = direction == .increment ? values[index] + delta : values[index] - delta
    change(index, clamp(next))
  }

  private func change(_ index: Int, _ value: Double) {
    var next = value
    if values.count > 1 {
      next = index == 0 ? min(next, values[1]) : max(next, values[0])
    }
    let before = HapticMoments.step(values[index], bounds: bounds, step: step)
    let after = HapticMoments.step(next, bounds: bounds, step: step)
    update(index, next)
    if before != after { ticks += 1 }
  }

  private func thumb(dragging: Bool) -> some View {
    Capsule()
      .fill(colorScheme == .dark ? EsuissColor.foreground : EsuissColor.background)
      .overlay {
        Capsule().strokeBorder(EsuissColor.foreground.opacity(0.1), lineWidth: 1)
      }
      .frame(width: dragging ? thumbWidth + 4 : thumbWidth, height: thumbHeight)
      .shadow(isEnabled ? .md : Shadow(color: .clear, radius: 0))
  }

  private func fraction(_ value: Double) -> CGFloat {
    let span = bounds.upperBound - bounds.lowerBound
    guard span > 0 else { return 0 }
    return CGFloat(min(max((value - bounds.lowerBound) / span, 0), 1))
  }

  private func clamp(_ value: Double) -> Double {
    var result = min(max(value, bounds.lowerBound), bounds.upperBound)
    if let step, step > 0 {
      result = bounds.lowerBound + ((result - bounds.lowerBound) / step).rounded() * step
      result = min(result, bounds.upperBound)
    }
    return result
  }

  private func nearest(to x: CGFloat, centers: [CGFloat]) -> Int {
    guard centers.count > 1 else { return 0 }
    if centers[0] == centers[1] {
      return x < centers[0] ? 0 : 1
    }
    return abs(x - centers[0]) <= abs(x - centers[1]) ? 0 : 1
  }

  private func format(_ value: Double) -> String {
    value.formatted(.number.precision(.fractionLength(0...2)))
  }
}
