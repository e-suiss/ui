import EsuissUI
import SwiftUI

enum TextareaStories {
  static let group = StoryGroup(.components, "Textarea", stories: [
    Story("Default") {
      TextareaDemo()
    },
    Story("WithValue") {
      TextareaDemo(initial: "The quick brown fox jumps over the lazy dog. This text spans a few lines to show how the textarea handles longer content.")
    },
    Story("WithLabel") {
      Field {
        FieldLabel("Your message")
        TextareaDemo()
        FieldDescription("Your message will be copied to the team.")
      }
    },
    Story("Disabled") {
      TextareaDemo(placeholder: "Disabled")
        .disabled(true)
    },
    Story("Invalid") {
      Field(invalid: true) {
        FieldLabel("Message")
        TextareaDemo(initial: "Too short")
        FieldError("Message must be at least 20 characters.")
      }
    },
  ])
}

private struct TextareaDemo: View {
  let placeholder: LocalizedStringKey

  @State private var text: String

  init(initial: String = "", placeholder: LocalizedStringKey = "Type your message here.") {
    self.placeholder = placeholder
    _text = State(initialValue: initial)
  }

  var body: some View {
    TextField(placeholder, text: $text, axis: .vertical)
      .textFieldStyle(.textarea)
      .frame(maxWidth: .infinity)
  }
}
