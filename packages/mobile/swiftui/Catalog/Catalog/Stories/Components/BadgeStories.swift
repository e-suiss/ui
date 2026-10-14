import EsuissUI
import PhosphorSwift
import SwiftUI

enum BadgeStories {
  static let group = StoryGroup(.components, "Badge", stories: [
    Story("Default") {
      Badge("Badge")
    },
    Story("Variants") {
      FlowRow(spacing: 8) {
        Badge("Default")
        Badge("Secondary", variant: .secondary)
        Badge("Destructive", variant: .destructive)
        Badge("Outline", variant: .outline)
        Badge("Ghost", variant: .ghost)
        Badge("Link", variant: .link)
      }
    },
    Story("WithIcon") {
      FlowRow(spacing: 8) {
        Badge(.secondary) {
          Label {
            Text("Verified")
          } icon: {
            Ph.sealCheck.regular
          }
        }
        Badge(.outline) {
          Label {
            Text("Featured")
          } icon: {
            Ph.star.regular
          }
        }
        Badge("8", variant: .outline)
      }
    },
  ])
}
