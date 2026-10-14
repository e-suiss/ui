import EsuissUI
import SwiftUI

enum LoginSheetStories {
  static let group = StoryGroup(.blocks, "Login Sheet", stories: [
    Story("Default") {
      LoginSheet()
    },
  ])
}
