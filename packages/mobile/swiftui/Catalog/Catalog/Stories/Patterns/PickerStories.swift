import EsuissUI
import SwiftUI

enum PickerStories {
  static let group = StoryGroup(.patterns, "Picker", stories: [
    Story("Default") {
      PickerDemo()
    },
    Story("States") {
      PickerStates()
    },
  ])
}

private struct PickerDemo: View {
  @State private var value: String?

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      OptionPicker(selection: $value, placeholder: "Select a fruit") {
        OptionPickerGroup("Fruits") {
          OptionPickerItem("Cherry", value: "cherry")
          OptionPickerItem("Banana", value: "banana")
          OptionPickerItem("Mango", value: "mango")
        }
        OptionPickerSeparator()
        OptionPickerGroup("Vegetables") {
          OptionPickerItem("Carrot", value: "carrot")
          OptionPickerItem("Spinach", value: "spinach")
            .disabled(true)
        }
      }
      .frame(width: 224)
      .accessibilityLabel(Text("Fruit"))
      Text(verbatim: "Selected: \(value ?? "none")")
        .textStyle(.sm)
        .foregroundStyle(EsuissColor.mutedForeground)
    }
  }
}

private struct PickerStates: View {
  @State private var small: String? = "banana"
  @State private var invalid: String?
  @State private var disabled: String?

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      OptionPicker(selection: $small, size: .sm) {
        OptionPickerItem("Cherry", value: "cherry")
        OptionPickerItem("Banana", value: "banana")
      }
      .frame(width: 224)
      OptionPicker(selection: $invalid, placeholder: "Invalid") {
        OptionPickerItem("Cherry", value: "cherry")
      }
      .frame(width: 224)
      .invalid()
      OptionPicker(selection: $disabled, placeholder: "Disabled") {
        OptionPickerItem("Cherry", value: "cherry")
      }
      .frame(width: 224)
      .disabled(true)
    }
  }
}
