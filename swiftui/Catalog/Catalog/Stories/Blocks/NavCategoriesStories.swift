import EsuissUI
import SwiftUI

enum NavCategoriesStories {
  static let group = StoryGroup(.blocks, "Nav Categories", stories: [
    Story("Default") {
      NavCategories()
    },
  ])
}
