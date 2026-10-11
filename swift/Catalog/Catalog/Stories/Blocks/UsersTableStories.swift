import EsuissUI
import SwiftUI

enum UsersTableStories {
  static let group = StoryGroup(.blocks, "Users Table", stories: [
    Story("Default") {
      UsersTable()
    },
  ])
}
