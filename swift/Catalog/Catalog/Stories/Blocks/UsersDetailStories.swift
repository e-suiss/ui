import EsuissUI
import SwiftUI

enum UsersDetailStories {
  static let group = StoryGroup(.blocks, "Users Detail", stories: [
    Story("Default") {
      UsersDetail()
    },
  ])
}
