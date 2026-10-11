import EsuissUI
import SwiftUI

enum ReorderListStories {
  static let group = StoryGroup(.interactions, "Reorder List", stories: [
    Story("Default") {
      ReorderListDemo()
    },
    Story("Inset") {
      ReorderListDemo(inset: true)
    },
  ])
}

private struct ReorderListTask {
  let title: String
  var detail: String?
}

private let reorderListTasks: [String: ReorderListTask] = [
  "inbox": ReorderListTask(title: "Inbox", detail: "12 messages"),
  "today": ReorderListTask(title: "Today"),
  "upcoming": ReorderListTask(title: "Upcoming", detail: "Next 7 days"),
  "someday": ReorderListTask(title: "Someday"),
  "archive": ReorderListTask(title: "Archive", detail: "Everything you finished, kept for later reference"),
]

private let reorderListOrder = ["inbox", "today", "upcoming", "someday", "archive"]

private struct ReorderListDemo: View {
  var inset = false

  @State private var value = reorderListOrder

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      list
      Text(verbatim: value.compactMap { reorderListTasks[$0]?.title }.joined(separator: ", "))
        .textStyle(.sm)
        .foregroundStyle(Color.labelSecondary)
        .accessibilityAddTraits(.updatesFrequently)
    }
  }

  @ViewBuilder
  private var list: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    if inset {
      rows
        .clipShape(shape)
        .overlay { shape.strokeBorder(Color.separator) }
    } else {
      rows
    }
  }

  private var rows: some View {
    ReorderList($value) { key in
      if let task = reorderListTasks[key] {
        VStack(alignment: .leading, spacing: 0) {
          Text(verbatim: task.title)
            .textStyle(.base)
            .foregroundStyle(Color.label)
            .lineLimit(1)
          if let detail = task.detail {
            Text(verbatim: detail)
              .textStyle(.sm)
              .foregroundStyle(Color.labelSecondary)
          }
        }
        .padding(.vertical, 12)
      }
    }
  }
}
