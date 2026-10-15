import EsuissUI
import SwiftUI

enum SpinnerStories {
  static let group = StoryGroup(.components, "Spinner", stories: [
    Story("Default") {
      Spinner()
        .foregroundStyle(EsuissColor.mutedForeground)
    },
    Story("Sizes") {
      HStack(spacing: 24) {
        Spinner(.sm)
        Spinner()
        Spinner(.lg)
        Spinner(.xl)
      }
      .foregroundStyle(EsuissColor.mutedForeground)
    },
    Story("Colors") {
      HStack(spacing: 24) {
        Spinner(.lg).foregroundStyle(EsuissColor.foreground)
        Spinner(.lg).foregroundStyle(EsuissColor.primary)
        Spinner(.lg).foregroundStyle(EsuissColor.destructive)
      }
    },
    Story("InButton") {
      VStack(alignment: .leading, spacing: 12) {
        Button {} label: {
          HStack(spacing: 6) {
            Spinner().foregroundStyle(EsuissColor.primaryForeground)
            Text("Saving")
          }
        }
        .buttonStyle(.variant())
        Button {} label: {
          HStack(spacing: 6) {
            Spinner().foregroundStyle(EsuissColor.mutedForeground)
            Text("Loading")
          }
        }
        .buttonStyle(.variant(.secondary))
      }
      .disabled(true)
    },
  ])
}
