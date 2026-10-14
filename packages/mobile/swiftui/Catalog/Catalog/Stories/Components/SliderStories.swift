import EsuissUI
import SwiftUI

enum SliderStories {
  static let group = StoryGroup(.components, "Slider", stories: [
    Story("Default") {
      SliderDemo(initial: 50)
    },
    Story("Controlled") {
      SliderControlledDemo()
    },
    Story("Range") {
      SliderRangeDemo()
    },
    Story("Step") {
      SliderDemo(initial: 0.5, bounds: 0...1, step: 0.1)
    },
    Story("Disabled") {
      SliderDemo(initial: 40)
        .disabled(true)
    },
  ])
}

private struct SliderDemo: View {
  var bounds: ClosedRange<Double> = 0...100
  var step: Double = 1

  @State private var value: Double

  init(initial: Double, bounds: ClosedRange<Double> = 0...100, step: Double = 1) {
    self.bounds = bounds
    self.step = step
    _value = State(initialValue: initial)
  }

  var body: some View {
    ValueSlider(value: $value, in: bounds, step: step)
      .accessibilityLabel(Text("Volume"))
      .frame(maxWidth: .infinity)
  }
}

private struct SliderControlledDemo: View {
  @State private var value: Double = 30
  @State private var committed: Double = 30

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      HStack {
        Text("Brightness")
          .textStyle(.sm, weight: .medium)
          .foregroundStyle(Color.label)
        Spacer()
        Text(verbatim: "\(Int(value)) / committed \(Int(committed))")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
      ValueSlider(value: $value, in: 0...100, step: 1) { editing in
        if !editing { committed = value }
      }
      .accessibilityLabel(Text("Brightness"))
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

private struct SliderRangeDemo: View {
  @State private var value: ClosedRange<Double> = 25...75

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      HStack {
        Text("Price")
          .textStyle(.sm, weight: .medium)
          .foregroundStyle(Color.label)
        Spacer()
        Text(verbatim: "$\(Int(value.lowerBound)) – $\(Int(value.upperBound))")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
      RangeSlider(value: $value, in: 0...100, step: 5)
        .accessibilityLabel(Text("Price"))
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}
