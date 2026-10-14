import SwiftUI

struct HomeView: View {
  @State private var query = ""

  var body: some View {
    List {
      ForEach(StorySection.allCases) { section in
        let groups = StoryCatalog.groups(in: section)
        if trimmedQuery.isEmpty {
          if !groups.isEmpty {
            Section(section.rawValue) {
              ForEach(groups) { group in
                GroupRow(group: group)
              }
            }
          }
        } else {
          let matchingGroups = groups.filter { matches($0.title) }
          let matchingStories = groups.flatMap { group in
            group.stories
              .filter { matches($0.name) }
              .map { StoryEntry(group: group, story: $0) }
          }
          if !matchingGroups.isEmpty || !matchingStories.isEmpty {
            Section(section.rawValue) {
              ForEach(matchingGroups) { group in
                GroupRow(group: group)
              }
              ForEach(matchingStories) { entry in
                NavigationLink(value: Route.story(entry.id)) {
                  VStack(alignment: .leading, spacing: 2) {
                    Text(verbatim: entry.story.name)
                    Text(verbatim: entry.group.title)
                      .font(.footnote)
                      .foregroundStyle(.secondary)
                  }
                }
              }
            }
          }
        }
      }
    }
    .navigationTitle("Catalog")
    .searchable(text: $query, placement: .navigationBarDrawer(displayMode: .always))
    .autocorrectionDisabled()
    .textInputAutocapitalization(.never)
    .toolbar {
      ToolbarItem(placement: .topBarTrailing) {
        ThemeMenu()
      }
    }
  }

  private var trimmedQuery: String {
    query.trimmingCharacters(in: .whitespaces).lowercased()
  }

  private func matches(_ text: String) -> Bool {
    text.lowercased().contains(trimmedQuery)
  }
}

private struct GroupRow: View {
  let group: StoryGroup

  var body: some View {
    NavigationLink(value: Route.group(group.id)) {
      LabeledContent {
        Text(verbatim: "\(group.stories.count)")
      } label: {
        Text(verbatim: group.title)
      }
    }
  }
}

struct GroupScreen: View {
  let group: StoryGroup

  var body: some View {
    List(group.stories) { story in
      NavigationLink(value: Route.story(group.storyID(story))) {
        Text(verbatim: story.name)
      }
    }
    .navigationTitle(Text(verbatim: group.title))
    .toolbar {
      ToolbarItem(placement: .topBarTrailing) {
        ThemeMenu()
      }
    }
  }
}
