import EsuissUI
import SwiftUI

enum RolesRequestsStories {
  static let group = StoryGroup(.blocks, "Roles Requests", stories: [
    Story("Default") {
      RolesRequests()
    },
  ])
}
