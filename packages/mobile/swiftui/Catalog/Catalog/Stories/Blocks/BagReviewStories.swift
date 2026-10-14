import EsuissUI
import SwiftUI

enum BagReviewStories {
  static let group = StoryGroup(.blocks, "Bag Review", stories: [
    Story("Default") {
      BagReview()
    },
  ])
}
