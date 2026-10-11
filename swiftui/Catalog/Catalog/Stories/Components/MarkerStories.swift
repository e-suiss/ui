import EsuissUI
import PhosphorSwift
import SwiftUI

enum MarkerStories {
  static let group = StoryGroup(.components, "Marker", stories: [
    Story("Variants") {
      VStack(spacing: 32) {
        Marker {
          MarkerIcon { Ph.info.regular }
          MarkerContent("Messages are end-to-end encrypted.")
        }
        Marker(.separator) {
          MarkerContent("Today")
        }
        Marker(.border) {
          MarkerIcon { Ph.calendarBlank.regular }
          MarkerContent("Upcoming")
        }
      }
      .frame(maxWidth: .infinity)
    },
  ])
}
