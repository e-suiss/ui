import EsuissUI
import SwiftUI

enum SwitchStories {
  static let group = StoryGroup(.components, "Switch", stories: [
    Story("Default") {
      SwitchDemo(initial: false)
    },
    Story("Checked") {
      SwitchDemo(initial: true)
    },
    Story("Sizes") {
      HStack(spacing: 16) {
        SwitchDemo(initial: true, size: .sm, label: "Wi-Fi")
        SwitchDemo(initial: true, label: "Bluetooth")
      }
    },
    Story("WithLabel") {
      WithLabelDemo()
    },
    Story("WithDescription") {
      WithDescriptionDemo()
    },
    Story("Disabled") {
      VStack(alignment: .leading, spacing: 16) {
        Toggle(isOn: .constant(false)) { EmptyView() }
        Toggle(isOn: .constant(true)) { EmptyView() }
      }
      .toggleStyle(.switch(size: .default))
      .disabled(true)
    },
    Story("Invalid") {
      InvalidDemo()
    },
  ])
}

private struct SwitchDemo: View {
  var size: SwitchStyle.Size = .default
  var label: LocalizedStringKey?

  @State private var checked: Bool

  init(initial: Bool, size: SwitchStyle.Size = .default, label: LocalizedStringKey? = nil) {
    self.size = size
    self.label = label
    _checked = State(initialValue: initial)
  }

  var body: some View {
    if let label {
      Toggle(isOn: $checked) { EmptyView() }
        .toggleStyle(.switch(size: size))
        .accessibilityLabel(Text(label))
    } else {
      Toggle(isOn: $checked) { EmptyView() }
        .toggleStyle(.switch(size: size))
    }
  }
}

private struct WithLabelDemo: View {
  @State private var checked = false

  var body: some View {
    Toggle(isOn: $checked) {
      FieldLabel("Airplane mode")
    }
    .toggleStyle(.switch(size: .default))
  }
}

private struct WithDescriptionDemo: View {
  @State private var checked = true

  var body: some View {
    HStack(spacing: 16) {
      VStack(alignment: .leading, spacing: 4) {
        FieldLabel("Marketing emails")
          .onTapGesture { checked.toggle() }
        Text("Receive emails about new products.")
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      Toggle(isOn: $checked) { EmptyView() }
        .toggleStyle(.switch(size: .default))
        .accessibilityLabel(Text("Marketing emails"))
    }
    .padding(16)
    .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
  }
}

private struct InvalidDemo: View {
  @State private var checked = false

  var body: some View {
    Toggle(isOn: $checked) {
      FieldLabel("Accept terms")
    }
    .toggleStyle(.switch(size: .default))
    .invalid()
  }
}
