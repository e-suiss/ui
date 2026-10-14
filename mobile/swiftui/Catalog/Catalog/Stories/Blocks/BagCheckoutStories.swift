import EsuissUI
import SwiftUI

enum BagCheckoutStories {
  static let group = StoryGroup(.blocks, "Bag Checkout", stories: [
    Story("Default") {
      BagCheckout()
    },
  ])
}
