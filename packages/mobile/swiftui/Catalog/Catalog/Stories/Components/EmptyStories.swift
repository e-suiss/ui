import EsuissUI
import PhosphorSwift
import SwiftUI

enum EmptyStories {
  static let group = StoryGroup(.components, "Empty", stories: [
    Story("Default") {
      Empty {
        EmptyHeader {
          EmptyMedia(.icon) { Ph.folderOpen.regular }
          EmptyTitle("No projects yet")
          EmptyDescription("You haven't created any projects yet. Get started by creating your first project.")
        }
        EmptyContent {
          Button("Create project") {}
            .buttonStyle(.variant())
          Button("Import project") {}
            .buttonStyle(.variant(.link))
        }
      }
    },
    Story("Muted") {
      Empty {
        EmptyHeader {
          EmptyTitle("No results")
          EmptyDescription("Try a different search.")
        }
      }
      .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
    },
  ])
}
