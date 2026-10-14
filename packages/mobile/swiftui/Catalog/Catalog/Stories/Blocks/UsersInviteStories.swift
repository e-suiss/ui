import EsuissUI
import SwiftUI

enum UsersInviteStories {
  static let group = StoryGroup(.blocks, "Users Invite", stories: [
    Story("Default") {
      UsersInvite()
    },
  ])
}
