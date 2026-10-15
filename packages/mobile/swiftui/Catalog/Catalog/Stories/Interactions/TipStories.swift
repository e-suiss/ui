import EsuissUI
import PhosphorSwift
import SwiftUI

enum TipStories {
  static let group = StoryGroup(.interactions, "Tip", stories: [
    Story("Default") {
      TipExample()
    },
    Story("Card") {
      TipCardExample()
    },
  ])
}

private let tipIDs = ["notes-pin", "notes-compose"]

private struct TipNote: Identifiable {
  let id: Int
  let title: String
  let preview: String
}

private let tipNotes = [
  TipNote(id: 1, title: "Groceries", preview: "Milk, eggs, bread, coffee"),
  TipNote(id: 2, title: "Trip ideas", preview: "Lisbon, Porto, the coast road"),
  TipNote(id: 3, title: "Book list", preview: "Three novels for the summer"),
  TipNote(id: 4, title: "Meeting notes", preview: "Ship the beta on Friday"),
]

private struct TipPinCard: View {
  let id: String

  var body: some View {
    Tip(id: id) {
      TipCard {
        TipIcon { Ph.pushPin.duotone }
        TipContent {
          TipTitle("Pin your favorites")
          TipDescription("Swipe right on a note to keep it at the top of the list.")
        }
        TipClose()
      }
    }
  }
}

private struct TipNotesPage: View {
  @State private var log = ""

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    TipGroup {
      VStack(alignment: .leading, spacing: 16) {
        HStack {
          Text("Notes")
            .textVariant(.h1)
          Spacer()
          Button {
            log = "Shared the folder"
          } label: {
            Ph.shareNetwork.regular.frame(width: 22, height: 22)
          }
          .buttonStyle(.variant(.plain, size: .iconLg))
          .accessibilityLabel(Text("Share folder"))
          Tip(id: "notes-compose", delay: .milliseconds(600)) {
            Button {
              log = "Started a new note"
            } label: {
              Ph.notePencil.regular.frame(width: 22, height: 22)
            }
            .buttonStyle(.variant(.plain, size: .iconLg))
            .accessibilityLabel(Text("New note"))
            .tipPopover(side: .bottom) {
              TipIcon { Ph.notePencil.duotone }
              TipContent {
                TipTitle("Start a note fast")
                TipDescription("Tap here any time to begin a new note.")
              }
              TipClose()
            }
          }
        }
        TipPinCard(id: "notes-pin")
        VStack(spacing: 0) {
          ForEach(Array(tipNotes.enumerated()), id: \.element.id) { index, note in
            Button {
              log = "Opened \(note.title)"
            } label: {
              VStack(alignment: .leading, spacing: 0) {
                Text(verbatim: note.title)
                  .textStyle(.base, weight: .semibold)
                  .foregroundStyle(EsuissColor.foreground)
                  .lineLimit(1)
                Text(verbatim: note.preview)
                  .textStyle(.sm)
                  .foregroundStyle(EsuissColor.mutedForeground)
                  .lineLimit(1)
              }
              .padding(.horizontal, 16)
              .padding(.vertical, 12)
              .frame(maxWidth: .infinity, alignment: .leading)
              .contentShape(Rectangle())
            }
            .buttonStyle(TipRowStyle())
            .overlay(alignment: .top) {
              if index > 0 {
                EsuissColor.border.frame(height: 1)
              }
            }
          }
        }
        .clipShape(shape)
        .overlay { shape.strokeBorder(EsuissColor.border) }
        Text(verbatim: log)
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
          .frame(minHeight: 20)
          .accessibilityAddTraits(.updatesFrequently)
      }
    }
  }
}

private struct TipRowStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .opacity(configuration.isPressed ? 0.8 : 1)
  }
}

private struct TipExample: View {
  @State private var key = 0
  @State private var ready = false

  var body: some View {
    VStack(spacing: 24) {
      if ready {
        TipNotesPage()
          .id(key)
      }
      Button("Show tips again") {
        Task {
          await resetTips(tipIDs)
          key += 1
        }
      }
      .buttonStyle(.variant(.secondary, size: .sm))
    }
    .task {
      await resetTips(tipIDs)
      ready = true
    }
  }
}

private struct TipCardExample: View {
  @State private var ready = false

  var body: some View {
    Group {
      if ready {
        TipPinCard(id: "story-card")
      }
    }
    .task {
      await resetTips(["story-card"])
      ready = true
    }
  }
}
