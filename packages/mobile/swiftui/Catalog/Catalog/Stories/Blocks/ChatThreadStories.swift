import EsuissUI
import SwiftUI

enum ChatThreadStories {
  static let group = StoryGroup(.blocks, "Chat Thread", stories: [
    Story("Default") {
      ChatThread()
    },
  ])
}
