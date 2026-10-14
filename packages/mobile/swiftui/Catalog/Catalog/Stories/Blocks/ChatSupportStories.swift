import EsuissUI
import SwiftUI

enum ChatSupportStories {
  static let group = StoryGroup(.blocks, "Chat Support", stories: [
    Story("Default") {
      ChatSupport()
    },
  ])
}
