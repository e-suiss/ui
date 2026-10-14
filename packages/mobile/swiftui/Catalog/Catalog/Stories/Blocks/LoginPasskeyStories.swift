import EsuissUI
import SwiftUI

enum LoginPasskeyStories {
  static let group = StoryGroup(.blocks, "Login Passkey", stories: [
    Story("Default") {
      LoginPasskey()
    },
  ])
}
