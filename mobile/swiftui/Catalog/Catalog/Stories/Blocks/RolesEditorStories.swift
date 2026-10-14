import EsuissUI
import SwiftUI

enum RolesEditorStories {
  static let group = StoryGroup(.blocks, "Roles Editor", stories: [
    Story("Default") {
      RolesEditor()
    },
  ])
}
