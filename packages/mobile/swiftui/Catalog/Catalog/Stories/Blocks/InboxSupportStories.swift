import EsuissUI
import SwiftUI

enum InboxSupportStories {
  static let group = StoryGroup(.blocks, "Inbox Support", stories: [
    Story("Default") {
      InboxSupport()
    },
  ])
}
