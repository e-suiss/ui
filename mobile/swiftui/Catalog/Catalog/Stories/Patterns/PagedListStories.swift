import EsuissUI
import PhosphorSwift
import SwiftUI

enum PagedListStories {
  static let group = StoryGroup(.patterns, "Paged List", stories: [
    Story("Default") {
      PagedListDemo(topics: pagedListTopics)
    },
    Story("SmallPages") {
      PagedListDemo(topics: pagedListTopics, pageSize: 3)
    },
    Story("SinglePage") {
      PagedListDemo(topics: Array(pagedListTopics.prefix(6)))
    },
    Story("CustomLabels") {
      PagedListDemo(topics: pagedListTopics, pageSize: 3, loadMoreLabel: "Show more topics")
    },
  ])
}

private struct PagedListTopic: Identifiable {
  let id: Int
  let title: String
  let replies: Int
}

private let pagedListSubjects = [
  "Getting started",
  "Dark mode tokens",
  "Form validation",
  "Release notes",
  "Accessibility",
  "Theming",
  "Server components",
  "Animations",
]

private let pagedListTopics: [PagedListTopic] = (0..<57).map { index in
  PagedListTopic(
    id: index + 1,
    title: "\(pagedListSubjects[index % pagedListSubjects.count]) · thread \(index + 1)",
    replies: (index * 7) % 23
  )
}

private struct PagedListDemo: View {
  let topics: [PagedListTopic]
  var pageSize = 10
  var loadMoreLabel: LocalizedStringKey = "Load more"

  var body: some View {
    PagedList(topics, pageSize: pageSize, loadMoreLabel: loadMoreLabel) { topic, _ in
      Item(action: {}) {
        ItemMedia(.icon) {
          Ph.chatCircle.regular
        }
        ItemContent {
          ItemTitle(verbatim: topic.title)
          ItemDescription(verbatim: "\(topic.replies) replies")
        }
      }
    }
  }
}
