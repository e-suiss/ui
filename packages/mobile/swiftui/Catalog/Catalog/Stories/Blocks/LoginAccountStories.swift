import EsuissUI
import SwiftUI

enum LoginAccountStories {
  static let group = StoryGroup(.blocks, "Login Account", stories: [
    Story("Default") {
      LoginAccount()
    },
  ])
}
