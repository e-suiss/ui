import EsuissUI
import SwiftUI

enum StepperStories {
  static let group = StoryGroup(.interactions, "Stepper", stories: [
    Story("Default") {
      StepperQuantity()
    },
    Story("Print") {
      StepperPrint()
    },
  ])
}

private struct StepperParts: View {
  var body: some View {
    StepperInput()
    StepperGroup {
      StepperDecrement()
      StepperSeparator()
      StepperIncrement()
    }
  }
}

private struct StepperQuantity: View {
  @State private var value = 1

  var body: some View {
    ValueStepper(value: $value, in: 0...10) {
      StepperParts()
    }
    .accessibilityLabel(Text("Quantity"))
  }
}

private struct StepperRow<Content: View>: View {
  let label: LocalizedStringKey
  @ViewBuilder let content: () -> Content

  var body: some View {
    HStack(spacing: 16) {
      Text(label)
        .textStyle(.base)
        .foregroundStyle(Color.label)
        .frame(maxWidth: .infinity, alignment: .leading)
      content()
        .accessibilityLabel(Text(label))
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 6)
    .frame(minHeight: 44)
  }
}

private struct StepperPrint: View {
  @State private var copies = 1
  @State private var scale = 100.0
  @State private var pages = 1

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    VStack(alignment: .leading, spacing: 12) {
      VStack(spacing: 0) {
        StepperRow(label: "Copies") {
          ValueStepper(value: $copies, in: 1...999) { StepperParts() }
        }
        Color.separator.frame(height: 1)
        StepperRow(label: "Scale") {
          ValueStepper(
            value: $scale,
            in: 25...400,
            step: 5,
            format: FloatingPointFormatStyle<Double>.Percent().scale(1)
          ) { StepperParts() }
        }
        Color.separator.frame(height: 1)
        StepperRow(label: "Pages per sheet") {
          ValueStepper(value: $pages) { StepperParts() }
            .disabled(true)
        }
      }
      .clipShape(shape)
      .overlay { shape.strokeBorder(Color.separator) }
      Text(verbatim: "\(copies) \(copies == 1 ? "copy" : "copies") at \(Int(scale))%")
        .textStyle(.sm)
        .foregroundStyle(Color.labelSecondary)
        .accessibilityAddTraits(.updatesFrequently)
    }
  }
}
