import EsuissUI
import SwiftUI

enum BagConfigureStories {
  static let group = StoryGroup(.blocks, "Bag Configure", stories: [
    Story("Default") {
      BagConfigure()
    },
  ])
}
