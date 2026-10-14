import EsuissUI
import SwiftUI

enum VerifyDeviceStories {
  static let group = StoryGroup(.blocks, "Verify Device", stories: [
    Story("Default") {
      VerifyDevice()
    },
  ])
}
