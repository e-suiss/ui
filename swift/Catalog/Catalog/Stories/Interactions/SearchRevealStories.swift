import EsuissUI
import SwiftUI

enum SearchRevealStories {
  static let group = StoryGroup(.interactions, "Search Reveal", stories: [
    Story("Default") {
      SearchRevealNotes(count: 12)
    },
    Story("ShortList") {
      SearchRevealNotes(count: 3)
    },
    Story("WithQuery") {
      SearchRevealNotes(count: 12, query: "porto")
    },
  ])
}

private struct SearchRevealNote: Identifiable {
  let id: Int
  let title: String
  let preview: String
}

private let searchRevealNotes = [
  SearchRevealNote(id: 1, title: "Groceries", preview: "Milk, eggs, bread, coffee"),
  SearchRevealNote(id: 2, title: "Trip ideas", preview: "Lisbon, Porto, the coast road"),
  SearchRevealNote(id: 3, title: "Book list", preview: "Three novels for the summer"),
  SearchRevealNote(id: 4, title: "Meeting notes", preview: "Ship the beta on Friday"),
  SearchRevealNote(id: 5, title: "Gift ideas", preview: "Headphones, a plant, a scarf"),
  SearchRevealNote(id: 6, title: "Recipes", preview: "Lemon pasta and a quick curry"),
  SearchRevealNote(id: 7, title: "Workout plan", preview: "Run on Monday, swim on Thursday"),
  SearchRevealNote(id: 8, title: "Movies to watch", preview: "Two documentaries and a classic"),
  SearchRevealNote(id: 9, title: "Garden", preview: "Plant tomatoes after the frost"),
  SearchRevealNote(id: 10, title: "Packing list", preview: "Charger, passport, rain jacket"),
  SearchRevealNote(id: 11, title: "Podcast notes", preview: "Episode about city design"),
  SearchRevealNote(id: 12, title: "Budget", preview: "Rent, groceries, savings"),
]

private struct SearchRevealNotes: View {
  let count: Int

  @State private var query: String

  init(count: Int, query: String = "") {
    self.count = count
    _query = State(initialValue: query)
  }

  private var notes: [SearchRevealNote] {
    let needle = query.trimmingCharacters(in: .whitespaces).lowercased()
    return searchRevealNotes.prefix(count).filter { note in
      needle.isEmpty || "\(note.title) \(note.preview)".lowercased().contains(needle)
    }
  }

  var body: some View {
    let notes = notes
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    VStack(alignment: .leading, spacing: 0) {
      Text("Notes")
        .textVariant(.h1)
        .padding(.horizontal, 16)
        .padding(.top, 16)
        .padding(.bottom, 8)
      SearchReveal {
        SearchRevealField(text: $query)
        SearchRevealContent {
          if notes.isEmpty {
            Text(verbatim: "No results for “\(query)”")
              .textStyle(.sm)
              .foregroundStyle(Color.labelSecondary)
              .multilineTextAlignment(.center)
              .padding(.horizontal, 16)
              .padding(.vertical, 64)
              .frame(maxWidth: .infinity)
          } else {
            VStack(spacing: 0) {
              ForEach(Array(notes.enumerated()), id: \.element.id) { index, note in
                Button {} label: {
                  VStack(alignment: .leading, spacing: 0) {
                    Text(verbatim: note.title)
                      .textStyle(.base, weight: .semibold)
                      .foregroundStyle(Color.label)
                      .lineLimit(1)
                    Text(verbatim: note.preview)
                      .textStyle(.sm)
                      .foregroundStyle(Color.labelSecondary)
                      .lineLimit(1)
                  }
                  .padding(.horizontal, 16)
                  .padding(.vertical, 12)
                  .frame(maxWidth: .infinity, alignment: .leading)
                  .contentShape(Rectangle())
                }
                .buttonStyle(SearchRevealRowStyle())
                .overlay(alignment: .top) {
                  if index > 0 {
                    Color.separator.frame(height: 1)
                  }
                }
              }
            }
            .background(Color.surfaceSecondary)
            .clipShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
            .padding(.horizontal, 16)
          }
          Text(verbatim: "\(notes.count) \(notes.count == 1 ? "note" : "notes")")
            .textStyle(.xs)
            .foregroundStyle(Color.labelSecondary)
            .multilineTextAlignment(.center)
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .frame(maxWidth: .infinity)
        }
      }
    }
    .clipShape(shape)
    .overlay { shape.strokeBorder(Color.separator) }
    .containerRelativeFrame(.vertical) { height, _ in height - 32 }
  }
}

private struct SearchRevealRowStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .background(configuration.isPressed ? Color.itemPressed : .clear)
  }
}
