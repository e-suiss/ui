import EsuissUI
import SwiftUI

enum SignupFormStories {
  static let group = StoryGroup(.blocks, "Signup Form", stories: [
    Story("Default") {
      SignupForm()
    },
  ])
}
