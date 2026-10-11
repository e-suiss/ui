import EsuissUI
import PhosphorSwift
import SwiftUI

enum SwipeActionsStories {
  static let group = StoryGroup(.interactions, "Swipe Actions", stories: [
    Story("Default") {
      SwipeActionsInbox()
    },
  ])
}

private struct SwipeActionsMessage: Identifiable {
  let id: String
  let from: String
  let subject: String
}

private let swipeActionsMessages = [
  SwipeActionsMessage(id: "1", from: "Olivia Martin", subject: "Quarterly report is ready"),
  SwipeActionsMessage(id: "2", from: "Jackson Lee", subject: "Lunch on Friday?"),
  SwipeActionsMessage(id: "3", from: "Isabella Nguyen", subject: "Design review notes"),
]

private struct SwipeActionsInbox: View {
  @State private var messages = swipeActionsMessages

  var body: some View {
    ItemGroup(.inset) {
      ForEach(Array(messages.enumerated()), id: \.element.id) { index, message in
        if index > 0 {
          ItemSeparator()
        }
        SwipeActions(background: .surfaceSecondary) {
          Item(action: {}) {
            ItemContent {
              ItemTitle(verbatim: message.from)
              ItemDescription(verbatim: message.subject)
            }
          }
        } leading: {
          SwipeAction("Read", icon: Ph.envelopeOpen.regular) {}
        } trailing: {
          SwipeAction("Mute", icon: Ph.bellSlash.regular, variant: .neutral) {}
          SwipeAction("Archive", icon: Ph.archive.regular, variant: .archive) {}
          SwipeAction("Delete", icon: Ph.trash.regular, variant: .destructive, fullSwipe: true) {
            messages.removeAll { $0.id == message.id }
          }
        }
      }
    }
  }
}
