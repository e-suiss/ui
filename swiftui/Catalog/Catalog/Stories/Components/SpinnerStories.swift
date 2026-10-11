import EsuissUI
import SwiftUI

enum SpinnerStories {
  static let group = StoryGroup(.components, "Spinner", stories: [
    Story("Default") {
      Spinner()
        .foregroundStyle(Color.labelSecondary)
    },
    Story("Sizes") {
      HStack(spacing: 24) {
        Spinner(.sm)
        Spinner()
        Spinner(.lg)
        Spinner(.xl)
      }
      .foregroundStyle(Color.labelSecondary)
    },
    Story("Colors") {
      HStack(spacing: 24) {
        Spinner(.lg).foregroundStyle(Color.label)
        Spinner(.lg).foregroundStyle(Color.accent)
        Spinner(.lg).foregroundStyle(Color.danger)
      }
    },
    Story("InButton") {
      VStack(alignment: .leading, spacing: 12) {
        Button {} label: {
          HStack(spacing: 6) {
            Spinner().foregroundStyle(Color.onAccent)
            Text("Saving")
          }
        }
        .buttonStyle(.variant())
        Button {} label: {
          HStack(spacing: 6) {
            Spinner().foregroundStyle(Color.labelSecondary)
            Text("Loading")
          }
        }
        .buttonStyle(.variant(.secondary))
      }
      .disabled(true)
    },
  ])
}
