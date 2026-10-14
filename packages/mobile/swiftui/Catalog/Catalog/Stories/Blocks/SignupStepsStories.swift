import EsuissUI
import SwiftUI

enum SignupStepsStories {
  static let group = StoryGroup(.blocks, "Signup Steps", stories: [
    Story("Default") {
      SignupSteps()
    },
  ])
}
