import EsuissUI
import SwiftUI

enum PriceStorageStories {
  static let group = StoryGroup(.blocks, "Price Storage", stories: [
    Story("Default") {
      PriceStorage()
    },
  ])
}
