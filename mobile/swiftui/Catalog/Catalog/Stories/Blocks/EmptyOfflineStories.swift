import EsuissUI
import SwiftUI

enum EmptyOfflineStories {
  static let group = StoryGroup(.blocks, "Empty Offline", stories: [
    Story("Default") {
      EmptyOffline()
    },
  ])
}
