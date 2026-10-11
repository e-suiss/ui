import EsuissUI
import SwiftUI

enum SettingsNotificationsStories {
  static let group = StoryGroup(.blocks, "Settings Notifications", stories: [
    Story("Default") {
      SettingsNotifications()
    },
  ])
}
