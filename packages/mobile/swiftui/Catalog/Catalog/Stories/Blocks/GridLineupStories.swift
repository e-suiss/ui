import EsuissUI
import SwiftUI

enum GridLineupStories {
  static let group = StoryGroup(.blocks, "Grid Lineup", stories: [
    Story("Default") {
      GridLineup()
    },
  ])
}
