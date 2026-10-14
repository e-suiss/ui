import EsuissUI
import SwiftUI

enum KeyboardScrollViewStories {
  static let group = StoryGroup(.components, "Keyboard Scroll View", stories: [
    Story("Default", fullScreen: true) {
      KeyboardScrollView {
        VStack(alignment: .leading, spacing: 16) {
          Text("Shipping address").textVariant(.h3)
          KeyboardScrollViewFields(labels: KeyboardScrollViewFields.all)
        }
        .padding(16)
      }
    },
    Story("Focused", fullScreen: true) {
      KeyboardScrollViewFocused()
    },
    Story("WithBottomBar", fullScreen: true) {
      VStack(spacing: 0) {
        KeyboardScrollView {
          VStack(alignment: .leading, spacing: 16) {
            Text("Shipping address").textVariant(.h3)
            KeyboardScrollViewFields(labels: KeyboardScrollViewFields.all)
          }
          .padding(16)
        }
        BottomBar(separator: true) {
          BottomBarContent {
            Button("Save address") {}
              .buttonStyle(.variant(size: .lg, block: true))
          }
        }
      }
    },
  ])
}

private struct KeyboardScrollViewFields: View {
  static let all = [
    "First name",
    "Last name",
    "Email",
    "Phone",
    "Street",
    "City",
    "Postal code",
    "Country",
    "Company",
    "Notes",
  ]

  let labels: [String]

  var body: some View {
    ForEach(labels, id: \.self) { label in
      KeyboardScrollViewField(label: label)
    }
  }
}

private struct KeyboardScrollViewField: View {
  let label: String

  @State private var text = ""

  var body: some View {
    VStack(alignment: .leading, spacing: 6) {
      Text(label).textVariant(.small)
      TextField(label, text: $text)
        .textFieldStyle(.input)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

private struct KeyboardScrollViewFocused: View {
  @State private var notes = ""
  @FocusState private var focused: Bool

  var body: some View {
    KeyboardScrollView {
      VStack(alignment: .leading, spacing: 16) {
        Text("Last field focused").textVariant(.h3)
        KeyboardScrollViewFields(labels: Array(KeyboardScrollViewFields.all.dropLast()))
        VStack(alignment: .leading, spacing: 6) {
          Text("Notes").textVariant(.small)
          TextField("Notes", text: $notes)
            .textFieldStyle(.input)
            .focused($focused)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
      }
      .padding(16)
    }
    .onAppear { focused = true }
  }
}
