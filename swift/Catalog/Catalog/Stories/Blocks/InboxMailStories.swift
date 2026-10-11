import EsuissUI
import SwiftUI

enum InboxMailStories {
  static let group = StoryGroup(.blocks, "Inbox Mail", stories: [
    Story("Default") {
      InboxMail()
    },
  ])
}
