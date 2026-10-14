import EsuissUI
import SwiftUI

enum CheckboxStories {
  static let group = StoryGroup(.components, "Checkbox", stories: [
    Story("Default") {
      CheckboxDemo(initial: false)
    },
    Story("Checked") {
      CheckboxDemo(initial: true)
    },
    Story("WithLabel") {
      CheckboxWithLabelDemo()
    },
    Story("WithDescription") {
      CheckboxWithDescriptionDemo()
    },
    Story("Disabled") {
      VStack(alignment: .leading, spacing: 16) {
        Toggle(isOn: .constant(false)) { FieldLabel("Unchecked") }
        Toggle(isOn: .constant(true)) { FieldLabel("Checked") }
      }
      .toggleStyle(.checkbox)
      .disabled(true)
    },
    Story("Indeterminate") {
      Toggle(sources: [Binding.constant(true), .constant(false)], isOn: \.self) {
        FieldLabel("Select all")
      }
      .toggleStyle(.checkbox)
    },
    Story("Invalid") {
      CheckboxInvalidDemo()
    },
  ])
}

private struct CheckboxDemo: View {
  @State private var checked: Bool

  init(initial: Bool) {
    _checked = State(initialValue: initial)
  }

  var body: some View {
    Toggle(isOn: $checked) { EmptyView() }
      .toggleStyle(.checkbox)
  }
}

private struct CheckboxWithLabelDemo: View {
  @State private var checked = false

  var body: some View {
    Toggle(isOn: $checked) {
      FieldLabel("Accept terms and conditions")
    }
    .toggleStyle(.checkbox)
  }
}

private struct CheckboxWithDescriptionDemo: View {
  @State private var checked = true

  var body: some View {
    HStack(alignment: .top, spacing: 12) {
      Toggle(isOn: $checked) { EmptyView() }
        .toggleStyle(.checkbox)
        .accessibilityLabel(Text("Enable notifications"))
        .padding(.top, 2)
      VStack(alignment: .leading, spacing: 6) {
        FieldLabel("Enable notifications")
          .onTapGesture { checked.toggle() }
        Text("You can enable or disable notifications at any time.")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    }
  }
}

private struct CheckboxInvalidDemo: View {
  @State private var checked = false

  var body: some View {
    Toggle(isOn: $checked) {
      FieldLabel("Accept terms and conditions")
    }
    .toggleStyle(.checkbox)
    .invalid(!checked)
  }
}
