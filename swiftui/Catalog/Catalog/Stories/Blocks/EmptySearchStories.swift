import EsuissUI
import SwiftUI

enum EmptySearchStories {
  static let group = StoryGroup(.blocks, "Empty Search", stories: [
    Story("Default") {
      EmptySearch()
    },
  ])
}
