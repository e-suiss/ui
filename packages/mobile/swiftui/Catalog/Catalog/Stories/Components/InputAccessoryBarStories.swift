import EsuissUI
import SwiftUI

enum InputAccessoryBarStories {
  static let group = StoryGroup(.components, "Input Accessory Bar", stories: [
    Story("Default", fullScreen: true) {
      InputAccessoryBarForm()
    },
    Story("Focused", fullScreen: true) {
      InputAccessoryBarForm(autoFocus: true)
    },
    Story("CustomLabels", fullScreen: true) {
      InputAccessoryBarForm(autoFocus: true, previousLabel: "Back", nextLabel: "Forward", doneLabel: "Close")
    },
    Story("WithTextarea", fullScreen: true) {
      InputAccessoryBarTextareaDemo()
    },
  ])
}

private enum InputAccessoryBarField: Hashable {
  case name, email, phone, city, subject, message
}

private struct InputAccessoryBarRow: View {
  let label: LocalizedStringKey
  let field: InputAccessoryBarField
  let focus: FocusState<InputAccessoryBarField?>.Binding

  @State private var text = ""

  var body: some View {
    VStack(alignment: .leading, spacing: 6) {
      Text(label)
        .textVariant(.small)
        .accessibilityHidden(true)
      TextField(label, text: $text)
        .textFieldStyle(.input)
        .focused(focus, equals: field)
        .submitLabel(.next)
    }
  }
}

private struct InputAccessoryBarForm: View {
  var autoFocus = false
  var previousLabel: LocalizedStringKey = "Previous"
  var nextLabel: LocalizedStringKey = "Next"
  var doneLabel: LocalizedStringKey = "Done"

  @FocusState private var focus: InputAccessoryBarField?

  var body: some View {
    KeyboardScrollView {
      VStack(alignment: .leading, spacing: 16) {
        InputAccessoryBarRow(label: "Name", field: .name, focus: $focus)
        InputAccessoryBarRow(label: "Email", field: .email, focus: $focus)
        InputAccessoryBarRow(label: "Phone", field: .phone, focus: $focus)
        InputAccessoryBarRow(label: "City", field: .city, focus: $focus)
      }
      .padding(16)
    }
    .inputAccessoryBar(
      focus: $focus,
      order: [.name, .email, .phone, .city],
      previousLabel: previousLabel,
      nextLabel: nextLabel,
      doneLabel: doneLabel
    )
    .onAppear {
      if autoFocus { focus = .name }
    }
  }
}

private struct InputAccessoryBarTextareaDemo: View {
  @FocusState private var focus: InputAccessoryBarField?
  @State private var message = ""
  @State private var log = "Tap Done."

  var body: some View {
    KeyboardScrollView {
      VStack(alignment: .leading, spacing: 16) {
        InputAccessoryBarRow(label: "Subject", field: .subject, focus: $focus)
        VStack(alignment: .leading, spacing: 6) {
          Text("Message")
            .textVariant(.small)
            .accessibilityHidden(true)
          TextField("Message", text: $message, axis: .vertical)
            .textFieldStyle(.textarea)
            .focused($focus, equals: .message)
        }
        Text(log)
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
      .padding(16)
    }
    .safeAreaInset(edge: .bottom, spacing: 0) {
      if let current = focus {
        InputAccessoryBar(
          onPrevious: current == .message ? { focus = .subject } : nil,
          onNext: current == .subject ? { focus = .message } : nil,
          onDone: {
            log = "Done pressed"
            focus = nil
          }
        )
      }
    }
    .onSubmit {
      if focus == .subject { focus = .message }
    }
    .onAppear { focus = .subject }
  }
}
