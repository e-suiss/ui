import EsuissUI
import SwiftUI

enum LogSecurityStories {
  static let group = StoryGroup(.blocks, "Log Security", stories: [
    Story("Default") {
      LogSecurity()
    },
  ])
}
