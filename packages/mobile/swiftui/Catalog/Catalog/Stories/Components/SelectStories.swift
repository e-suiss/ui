import EsuissUI
import SwiftUI

enum SelectStories {
  static let group = StoryGroup(.components, "Select", stories: [
    Story("Default") {
      SelectDemo()
    },
    Story("WithValue") {
      SelectDemo(initial: "blueberry")
    },
    Story("Small") {
      SelectDemo(size: .sm)
    },
    Story("Grouped") {
      SelectGroupedDemo()
    },
    Story("WithLabel") {
      VStack(alignment: .leading, spacing: 8) {
        FieldLabel("Favorite fruit")
          .accessibilityHidden(true)
        SelectDemo()
          .accessibilityLabel(Text("Favorite fruit"))
        Text("Used to personalize your recommendations.")
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    },
    Story("Disabled") {
      SelectDemo(initial: "mango")
        .disabled(true)
    },
    Story("Invalid") {
      VStack(alignment: .leading, spacing: 8) {
        SelectDemo()
          .invalid()
        Text("Please select a fruit.")
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.destructive)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    },
  ])
}

private struct SelectOption {
  let value: String
  let label: LocalizedStringKey
}

private let selectFruits = [
  SelectOption(value: "mango", label: "Mango"),
  SelectOption(value: "banana", label: "Banana"),
  SelectOption(value: "blueberry", label: "Blueberry"),
  SelectOption(value: "grapes", label: "Grapes"),
  SelectOption(value: "pineapple", label: "Pineapple"),
]

private let selectVegetables = [
  SelectOption(value: "carrot", label: "Carrot"),
  SelectOption(value: "broccoli", label: "Broccoli"),
  SelectOption(value: "spinach", label: "Spinach"),
]

private struct SelectDemo: View {
  var size: SelectSize = .default

  @State private var value: String?

  init(initial: String? = nil, size: SelectSize = .default) {
    self.size = size
    _value = State(initialValue: initial)
  }

  var body: some View {
    SelectField(selection: $value, placeholder: "Select a fruit", size: size) {
      SelectGroup {
        SelectLabel("Fruits")
        ForEach(selectFruits, id: \.value) { fruit in
          SelectItem(fruit.label, value: fruit.value)
        }
      }
    }
    .frame(width: 192)
  }
}

private struct SelectGroupedDemo: View {
  @State private var value: String?

  var body: some View {
    SelectField(selection: $value, placeholder: "Select produce") {
      SelectGroup {
        SelectLabel("Fruits")
        ForEach(selectFruits.prefix(3), id: \.value) { fruit in
          SelectItem(fruit.label, value: fruit.value)
        }
      }
      SelectSeparator()
      SelectGroup {
        SelectLabel("Vegetables")
        ForEach(selectVegetables, id: \.value) { vegetable in
          SelectItem(vegetable.label, value: vegetable.value)
        }
      }
    }
    .frame(width: 224)
  }
}
