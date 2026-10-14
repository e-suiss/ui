import EsuissUI
import SwiftUI

enum VerifyCodeStories {
  static let group = StoryGroup(.blocks, "Verify Code", stories: [
    Story("Default") {
      VerifyCode()
    },
  ])
}
