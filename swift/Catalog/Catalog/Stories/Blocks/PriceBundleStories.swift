import EsuissUI
import SwiftUI

enum PriceBundleStories {
  static let group = StoryGroup(.blocks, "Price Bundle", stories: [
    Story("Default") {
      PriceBundle()
    },
  ])
}
