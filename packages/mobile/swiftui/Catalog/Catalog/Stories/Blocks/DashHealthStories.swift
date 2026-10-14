import EsuissUI
import SwiftUI

enum DashHealthStories {
  static let group = StoryGroup(.blocks, "Dash Health", stories: [
    Story("Default") {
      DashHealth()
    },
  ])
}
