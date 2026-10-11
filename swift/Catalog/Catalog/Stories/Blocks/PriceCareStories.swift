import EsuissUI
import SwiftUI

enum PriceCareStories {
  static let group = StoryGroup(.blocks, "Price Care", stories: [
    Story("Default") {
      PriceCare()
    },
  ])
}
