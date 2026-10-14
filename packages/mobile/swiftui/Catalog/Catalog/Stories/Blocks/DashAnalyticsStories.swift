import EsuissUI
import SwiftUI

enum DashAnalyticsStories {
  static let group = StoryGroup(.blocks, "Dash Analytics", stories: [
    Story("Default") {
      DashAnalytics()
    },
  ])
}
