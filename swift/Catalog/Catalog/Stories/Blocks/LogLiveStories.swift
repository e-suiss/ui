import EsuissUI
import SwiftUI

enum LogLiveStories {
  static let group = StoryGroup(.blocks, "Log Live", stories: [
    Story("Default") {
      LogLive()
    },
  ])
}
