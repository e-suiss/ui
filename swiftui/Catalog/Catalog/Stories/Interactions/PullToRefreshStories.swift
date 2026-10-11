import EsuissUI
import SwiftUI

enum PullToRefreshStories {
  static let group = StoryGroup(.interactions, "Pull To Refresh", stories: [
    Story("Default") {
      PullToRefreshFeed()
        .containerRelativeFrame(.vertical) { height, _ in height - 32 }
    },
    Story("WithFlatList") {
      ScrollView {
        LazyVStack(alignment: .leading, spacing: 0) {
          ForEach(["Inbox", "Drafts", "Sent", "Archive"], id: \.self) { item in
            Text(verbatim: item)
              .textStyle(.base)
              .foregroundStyle(Color.label)
              .padding(.vertical, 12)
              .frame(maxWidth: .infinity, alignment: .leading)
          }
        }
      }
      .pullToRefresh {
        try? await Task.sleep(for: .milliseconds(1000))
      }
      .containerRelativeFrame(.vertical) { height, _ in height - 32 }
    },
  ])
}

private struct PullToRefreshFeed: View {
  @State private var count = 3

  var body: some View {
    PullToRefresh {
      try? await Task.sleep(for: .milliseconds(1200))
      count += 1
    } content: {
      VStack(alignment: .leading, spacing: 12) {
        Text("Pull down to refresh")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
        ItemGroup(.inset) {
          ForEach(Array((1...count).reversed()), id: \.self) { update in
            if update != count {
              ItemSeparator()
            }
            Item {
              ItemContent {
                ItemTitle(verbatim: "Update \(update)")
                ItemDescription("Fetched from the server")
              }
            }
          }
        }
      }
    }
  }
}
