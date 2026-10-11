import EsuissUI
import SwiftUI

enum ChatConversationsStories {
  static let group = StoryGroup(.blocks, "Chat Conversations", stories: [
    Story("Default") {
      ChatConversations()
    },
  ])
}
