import EsuissUI
import PhosphorSwift
import SwiftUI

enum UndoBarStories {
  static let group = StoryGroup(.interactions, "Undo Bar", stories: [
    Story("Default") {
      UndoBarStage(timeout: .seconds(5)) { UndoBarNotes() }
    },
    Story("Showing") {
      UndoBarStage(timeout: .seconds(60)) { UndoBarNotes(deleteFirst: true) }
    },
    Story("LongerTimeout") {
      UndoBarStage(timeout: .seconds(10)) { UndoBarNotes() }
    },
    Story("WithSwipeActions") {
      UndoBarStage(timeout: .seconds(5)) { UndoBarNotes(swipe: true) }
    },
  ])
}

private struct UndoBarNote: Identifiable, Equatable {
  let id: Int
  let title: String
  let preview: String
}

private let undoBarInitialNotes = [
  UndoBarNote(id: 1, title: "Groceries", preview: "Milk, eggs, bread, coffee"),
  UndoBarNote(id: 2, title: "Trip ideas", preview: "Lisbon, Porto, the coast road"),
  UndoBarNote(id: 3, title: "Book list", preview: "Three novels for the summer"),
  UndoBarNote(id: 4, title: "Meeting notes", preview: "Ship the beta on Friday"),
]

private struct UndoBarStage<Content: View>: View {
  let timeout: Duration
  @ViewBuilder let content: () -> Content

  @State private var manager = UndoBarManager()

  var body: some View {
    content()
      .frame(maxHeight: .infinity, alignment: .top)
      .containerRelativeFrame(.vertical) { height, _ in height - 32 }
      .undoBar(manager, timeout: timeout)
  }
}

private struct UndoBarNoteText: View {
  let note: UndoBarNote

  var body: some View {
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
    .padding(.vertical, 8)
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

private struct UndoBarNotes: View {
  var deleteFirst = false
  var swipe = false

  @State private var notes = undoBarInitialNotes
  @State private var log = "Delete a note."
  @State private var deleted = false
  @Environment(\.undoBarManager) private var manager

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    VStack(alignment: .leading, spacing: 12) {
      VStack(spacing: 0) {
        ForEach(Array(notes.enumerated()), id: \.element.id) { index, note in
          row(note)
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
        .accessibilityAddTraits(.updatesFrequently)
    }
    .onAppear {
      guard deleteFirst, !deleted else { return }
      deleted = true
      remove(undoBarInitialNotes[0])
    }
  }

  @ViewBuilder
  private func row(_ note: UndoBarNote) -> some View {
    if swipe {
      SwipeActions {
        UndoBarNoteText(note: note)
          .padding(.horizontal, 16)
          .padding(.vertical, 4)
      } trailing: {
        SwipeAction("Delete", icon: Ph.trash.fill, variant: .destructive, fullSwipe: true) {
          remove(note)
        }
      }
    } else {
      HStack(spacing: 12) {
        UndoBarNoteText(note: note)
        Button {
          remove(note)
        } label: {
          Ph.trash.regular.frame(width: 20, height: 20)
        }
        .buttonStyle(.variant(.ghost, size: .iconLg))
        .accessibilityLabel(Text(verbatim: "Delete \(note.title)"))
      }
      .padding(.leading, 16)
      .padding(.trailing, 4)
      .padding(.vertical, 4)
    }
  }

  private func remove(_ note: UndoBarNote) {
    let index = notes.firstIndex(of: note) ?? 0
    notes.removeAll { $0.id == note.id }
    log = "Removed “\(note.title)”"
    manager.show(
      "“\(note.title)” deleted",
      onUndo: {
        notes.insert(note, at: min(index, notes.count))
        log = "Restored “\(note.title)”"
      },
      onCommit: {
        log = "Deleted “\(note.title)” permanently"
      }
    )
  }
}
