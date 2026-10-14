import EsuissUI
import SwiftUI

enum EmptyBagStories {
  static let group = StoryGroup(.blocks, "Empty Bag", stories: [
    Story("Default") {
      EmptyBag()
    },
  ])
}
