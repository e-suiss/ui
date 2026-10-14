import EsuissUI
import SwiftUI

enum DashStoreStories {
  static let group = StoryGroup(.blocks, "Dash Store", stories: [
    Story("Default") {
      DashStore()
    },
  ])
}
