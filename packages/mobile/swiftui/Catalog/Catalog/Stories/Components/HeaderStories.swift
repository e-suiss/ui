import EsuissUI
import PhosphorSwift
import SwiftUI

enum HeaderStories {
  static let group = StoryGroup(.components, "Header", stories: [
    Story("Default") {
      Header {
        HeaderTitle("Profile")
      } leading: {
        HeaderBack("Settings")
      } trailing: {
        HeaderActions {
          Button {} label: {
            Text("Edit").fontWeight(.semibold)
          }
          .buttonStyle(.variant(.plain, size: .sm))
        }
      }
      .headerStoryBleed()
    },
    Story("LargeTitle", fullScreen: true) {
      HeaderLargeTitleDemo()
    },
    Story("LargeTitleWithSubtitle", fullScreen: true) {
      HeaderLargeTitleDemo(subtitle: "3 unread")
    },
    Story("CompactWithScroll", fullScreen: true) {
      HeaderScrollView {
        HeaderMessageRows()
      } header: {
        Header {
          HeaderTitle("Inbox", subtitle: "15 messages")
        } leading: {
          HeaderBack()
        } trailing: {
          HeaderActions {
            HeaderIconButton(icon: Ph.dotsThree.bold, label: "More")
          }
        }
      }
    },
    Story("Subtitle") {
      Header {
        HeaderTitle("Alex Morgan", subtitle: "Last seen today")
      } leading: {
        HeaderBack()
      } trailing: {
        HeaderTrailingActions()
      }
      .headerStoryBleed()
    },
    Story("LeadingActions") {
      Header {
        HeaderTitle("Library")
      } leading: {
        HeaderActions {
          HeaderIconButton(icon: Ph.list.regular, label: "Menu")
        }
      } trailing: {
        HeaderActions {
          Button {} label: {
            Text("Done").fontWeight(.semibold)
          }
          .buttonStyle(.variant(.plain, size: .sm))
        }
      }
      .headerStoryBleed()
    },
    Story("BackOnly") {
      Header {
        HeaderTitle("Details")
      } leading: {
        HeaderBack("A very long previous screen title")
      }
      .headerStoryBleed()
    },
  ])
}

private let headerMessages = [
  "Lunch on Friday?",
  "The draft is ready for review",
  "Photos from the trip",
  "Invoice for September",
  "Your order has shipped",
  "Team sync moved to 3 PM",
  "Weekend plans",
  "Book club picks",
  "Flight confirmation",
  "New comment on your post",
  "Reminder: dentist at 10",
  "Quarterly report",
  "Welcome to the beta",
  "Parking update",
  "Recipe you asked for",
]

private extension View {
  func headerStoryBleed() -> some View {
    padding(.horizontal, -16).padding(.top, -16)
  }
}

private struct HeaderMessageRows: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      ForEach(Array(headerMessages.enumerated()), id: \.offset) { index, message in
        Text(LocalizedStringKey(message))
          .textStyle(.base)
          .foregroundStyle(EsuissColor.foreground)
          .lineLimit(1)
          .padding(.vertical, 12)
          .frame(maxWidth: .infinity, alignment: .leading)
          .overlay(alignment: .top) {
            if index > 0 {
              EsuissColor.border.frame(height: 1)
            }
          }
      }
    }
    .padding(.horizontal, 16)
  }
}

private struct HeaderIconButton: View {
  let icon: Image
  let label: LocalizedStringKey

  var body: some View {
    Button {} label: {
      icon.frame(width: 20, height: 20)
    }
    .accessibilityLabel(Text(label))
  }
}

private struct HeaderTrailingActions: View {
  var body: some View {
    HeaderActions {
      HeaderIconButton(icon: Ph.magnifyingGlass.regular, label: "Search")
      HeaderIconButton(icon: Ph.plus.regular, label: "New message")
    }
  }
}

private struct HeaderLargeTitleDemo: View {
  var subtitle: LocalizedStringKey?

  var body: some View {
    HeaderScrollView {
      HeaderLargeTitle("Inbox", subtitle: subtitle)
      HeaderMessageRows()
    } header: {
      Header {
        HeaderTitle("Inbox")
      } leading: {
        HeaderBack("Mailboxes")
      } trailing: {
        HeaderTrailingActions()
      }
    }
  }
}
