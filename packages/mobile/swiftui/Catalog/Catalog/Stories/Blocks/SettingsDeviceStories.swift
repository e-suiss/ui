import EsuissUI
import SwiftUI

enum SettingsDeviceStories {
  static let group = StoryGroup(.blocks, "Settings Device", stories: [
    Story("Default") {
      SettingsDevice()
    },
  ])
}
