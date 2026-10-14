import SwiftUI

struct StoryEntry: Identifiable {
  let group: StoryGroup
  let story: Story

  var id: String { group.storyID(story) }
}

enum StoryCatalog {
  static let groups: [StoryGroup] = (
    ComponentsA.groups
      + ComponentsB.groups
      + PatternsInteractions.groups
      + BlocksCharts.groups
  )
  .sorted { $0.title.lowercased() < $1.title.lowercased() }

  static let groupsByID: [String: StoryGroup] = Dictionary(
    groups.map { ($0.id, $0) },
    uniquingKeysWith: { first, _ in first }
  )

  static let entriesByID: [String: StoryEntry] = Dictionary(
    groups.flatMap { group in group.stories.map { StoryEntry(group: group, story: $0) } }
      .map { ($0.id, $0) },
    uniquingKeysWith: { first, _ in first }
  )

  static func groups(in section: StorySection) -> [StoryGroup] {
    groups.filter { $0.section == section }
  }
}
