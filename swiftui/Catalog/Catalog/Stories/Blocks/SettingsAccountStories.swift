import EsuissUI
import SwiftUI

enum SettingsAccountStories {
  static let group = StoryGroup(.blocks, "Settings Account", stories: [
    Story("Default") {
      SettingsAccount()
    },
  ])
}
