import EsuissUI
import SwiftUI

enum SignupTrialStories {
  static let group = StoryGroup(.blocks, "Signup Trial", stories: [
    Story("Default") {
      SignupTrial()
    },
  ])
}
