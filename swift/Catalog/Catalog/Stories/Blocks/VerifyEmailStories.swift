import EsuissUI
import SwiftUI

enum VerifyEmailStories {
  static let group = StoryGroup(.blocks, "Verify Email", stories: [
    Story("Default") {
      VerifyEmail()
    },
  ])
}
