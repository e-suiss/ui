import EsuissUI
import SwiftUI

enum LabelStories {
  static let group = StoryGroup(.components, "Label", stories: [
    Story("Default") {
      FieldLabel("Your email address")
    },
    Story("WithInput") {
      LabelWithInput()
    },
    Story("WithCheckbox") {
      LabelWithCheckbox()
    },
    Story("Disabled") {
      FieldLabel("Disabled label")
        .disabled(true)
    },
  ])
}

private struct LabelWithInput: View {
  @State private var email = ""

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      FieldLabel("Email")
        .accessibilityHidden(true)
      TextField(String("m@example.com"), text: $email)
        .textFieldStyle(.input)
        .keyboardType(.emailAddress)
        .textInputAutocapitalization(.never)
        .accessibilityLabel(Text("Email"))
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

private struct LabelWithCheckbox: View {
  @State private var checked = false

  var body: some View {
    Toggle(isOn: $checked) {
      FieldLabel("Accept terms and conditions")
    }
    .toggleStyle(.checkbox)
  }
}
