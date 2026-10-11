import EsuissUI
import SwiftUI

enum InputOTPStories {
  static let group = StoryGroup(.components, "InputOTP", stories: [
    Story("Default") {
      InputOTPDefaultDemo()
    },
    Story("Controlled") {
      InputOTPControlledDemo()
    },
    Story("Alphanumeric") {
      InputOTPAlphanumericDemo()
    },
    Story("Disabled") {
      InputOTPDemo(length: 6, initial: "123")
        .disabled(true)
    },
  ])
}

private struct InputOTPDemo: View {
  let length: Int

  @State private var text: String

  init(length: Int, initial: String = "") {
    self.length = length
    _text = State(initialValue: initial)
  }

  var body: some View {
    InputOTP(text: $text, length: length)
  }
}

private struct InputOTPDefaultDemo: View {
  @State private var text = ""

  var body: some View {
    InputOTP(text: $text, length: 6) {
      InputOTPGroup {
        InputOTPSlot(index: 0)
        InputOTPSlot(index: 1)
        InputOTPSlot(index: 2)
      }
      InputOTPSeparator()
      InputOTPGroup {
        InputOTPSlot(index: 3)
        InputOTPSlot(index: 4)
        InputOTPSlot(index: 5)
      }
    }
  }
}

private struct InputOTPControlledDemo: View {
  @State private var value = ""
  @State private var completed: String?

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      InputOTP(text: $value, length: 4)
      Text(completed.map { "Submitted \($0)" } ?? "Enter the 4 digit code")
        .textVariant(.muted)
    }
    .onChange(of: value) { _, next in
      if next.count == 4 { completed = next }
    }
  }
}

private struct InputOTPAlphanumericDemo: View {
  @State private var value = ""

  var body: some View {
    InputOTP(
      text: Binding(get: { value }, set: { value = $0.uppercased() }),
      length: 6,
      allowed: .alphanumerics
    )
  }
}
