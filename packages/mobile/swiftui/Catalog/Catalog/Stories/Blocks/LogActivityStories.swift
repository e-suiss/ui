import EsuissUI
import SwiftUI

enum LogActivityStories {
  static let group = StoryGroup(.blocks, "Log Activity", stories: [
    Story("Default") {
      LogActivity()
    },
  ])
}
