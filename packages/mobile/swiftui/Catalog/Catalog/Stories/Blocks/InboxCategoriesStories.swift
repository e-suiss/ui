import EsuissUI
import SwiftUI

enum InboxCategoriesStories {
  static let group = StoryGroup(.blocks, "Inbox Categories", stories: [
    Story("Default") {
      InboxCategories()
    },
  ])
}
