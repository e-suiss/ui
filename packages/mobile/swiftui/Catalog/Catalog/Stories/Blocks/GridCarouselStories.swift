import EsuissUI
import SwiftUI

enum GridCarouselStories {
  static let group = StoryGroup(.blocks, "Grid Carousel", stories: [
    Story("Default") {
      GridCarousel()
    },
  ])
}
