import EsuissUI
import PhosphorSwift
import SwiftUI

enum SelectionListStories {
  static let group = StoryGroup(.interactions, "Selection List", stories: [
    Story("Default", scrolls: false) {
      SelectionListNotes()
    },
    Story("Editing", scrolls: false) {
      SelectionListNotes(editing: true, selection: ["trip", "meeting"])
    },
    Story("IconActions", scrolls: false) {
      SelectionListMail()
    },
  ])
}

private struct SelectionListNote: Identifiable {
  let id: String
  let title: String
  let preview: String
}

private let selectionListInitialNotes = [
  SelectionListNote(id: "groceries", title: "Groceries", preview: "Milk, eggs, bread, coffee"),
  SelectionListNote(id: "trip", title: "Trip ideas", preview: "Lisbon, Porto, the coast road"),
  SelectionListNote(id: "books", title: "Book list", preview: "Three novels for the summer"),
  SelectionListNote(id: "meeting", title: "Meeting notes", preview: "Ship the beta on Friday"),
  SelectionListNote(id: "gifts", title: "Gift ideas", preview: "Headphones, a plant, a scarf"),
  SelectionListNote(id: "recipes", title: "Recipes", preview: "Lemon pasta and a quick curry"),
]

private let selectionListIdleLog = "Tap Select to choose notes."

private struct SelectionListRows: View {
  let notes: [SelectionListNote]
  let editing: Bool
  let onOpen: (SelectionListNote) -> Void

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    VStack(spacing: 0) {
      ForEach(Array(notes.enumerated()), id: \.element.id) { index, note in
        SelectionListItem(value: note.id) {
          Button {
            onOpen(note)
          } label: {
            HStack(spacing: 12) {
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
              .frame(maxWidth: .infinity, alignment: .leading)
              Ph.caretRight.regular
                .frame(width: 16, height: 16)
                .foregroundStyle(Color.labelTertiary)
                .opacity(editing ? 0 : 1)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .contentShape(Rectangle())
          }
          .buttonStyle(SelectionListRowStyle())
        }
        .overlay(alignment: .top) {
          if index > 0 {
            Color.separator.frame(height: 1)
          }
        }
      }
    }
    .clipShape(shape)
    .overlay { shape.strokeBorder(Color.separator) }
  }
}

private struct SelectionListRowStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .background(configuration.isPressed ? Color.itemPressed : .clear)
  }
}

private struct SelectionListFooter: View {
  let log: String
  let onReset: () -> Void

  var body: some View {
    HStack(spacing: 12) {
      Text(verbatim: log)
        .textStyle(.sm)
        .foregroundStyle(Color.labelSecondary)
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityAddTraits(.updatesFrequently)
      Button("Reset", action: onReset)
        .buttonStyle(.variant(.secondary, size: .sm))
    }
  }
}

private struct SelectionListStage<Content: View, Bar: View>: View {
  @ViewBuilder let content: () -> Content
  @ViewBuilder let bar: () -> Bar

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      content()
    }
    .frame(maxHeight: .infinity, alignment: .top)
    .overlay(alignment: .bottom) {
      bar()
        .padding(.horizontal, -16)
    }
    .containerRelativeFrame(.vertical) { height, _ in height - 32 }
  }
}

private struct SelectionListNotes: View {
  @State private var editing: Bool
  @State private var selection: Set<String>
  @State private var notes = selectionListInitialNotes
  @State private var log = selectionListIdleLog

  init(editing: Bool = false, selection: Set<String> = []) {
    _editing = State(initialValue: editing)
    _selection = State(initialValue: selection)
  }

  var body: some View {
    SelectionList(isEditing: $editing, selection: $selection) {
      SelectionListStage {
        HStack {
          Text("Notes")
            .textVariant(.h1)
          Spacer()
          SelectionListTrigger()
        }
        SelectionListRows(notes: notes, editing: editing) { log = "Opened \($0.title)" }
        SelectionListFooter(log: log) {
          notes = selectionListInitialNotes
          log = selectionListIdleLog
        }
      } bar: {
        SelectionListBar { list in
          Button(list.count > 0 ? "Deselect All" : "Select All") {
            if list.count > 0 { list.clear() } else { list.selectAll() }
          }
          .buttonStyle(.variant(.plain, size: .lg))
          SelectionListCount()
          Button {
            let ids = selection
            notes.removeAll { ids.contains($0.id) }
            log = "Deleted \(ids.count) \(ids.count == 1 ? "note" : "notes")"
            selection = []
            list.setEditing(false)
          } label: {
            Text("Delete")
              .foregroundStyle(list.count == 0 ? Color.labelQuaternary : .danger)
          }
          .buttonStyle(.variant(.plain, size: .lg))
          .disabled(list.count == 0)
        }
        .accessibilityLabel(Text("Selection actions"))
      }
    }
  }
}

private struct SelectionListMail: View {
  @State private var editing = false
  @State private var selection: Set<String> = []
  @State private var notes = selectionListInitialNotes
  @State private var log = selectionListIdleLog

  private var selectedIDs: String {
    notes.map(\.id).filter { selection.contains($0) }.joined(separator: ", ")
  }

  var body: some View {
    let disabled = selection.isEmpty
    SelectionList(isEditing: $editing, selection: $selection) {
      SelectionListStage {
        HStack {
          Text("Inbox")
            .textVariant(.h1)
          Spacer()
          SelectionListTrigger()
        }
        SelectionListRows(notes: notes, editing: editing) { log = "Opened \($0.title)" }
        SelectionListFooter(log: log) {
          notes = selectionListInitialNotes
          log = selectionListIdleLog
        }
      } bar: {
        SelectionListBar {
          Button {
            log = "Archived \(selectedIDs)"
          } label: {
            Ph.archive.regular.frame(width: 22, height: 22)
          }
          .buttonStyle(.variant(.plain, size: .iconLg))
          .accessibilityLabel(Text("Archive"))
          .disabled(disabled)
          Button {
            log = "Moved \(selectedIDs)"
          } label: {
            Ph.folderSimple.regular.frame(width: 22, height: 22)
          }
          .buttonStyle(.variant(.plain, size: .iconLg))
          .accessibilityLabel(Text("Move"))
          .disabled(disabled)
          SelectionListCount()
          Button {
            let ids = selection
            notes.removeAll { ids.contains($0.id) }
            log = "Deleted \(ids.count) \(ids.count == 1 ? "note" : "notes")"
            selection = []
          } label: {
            Ph.trash.regular
              .frame(width: 22, height: 22)
              .foregroundStyle(disabled ? Color.labelQuaternary : .danger)
          }
          .buttonStyle(.variant(.plain, size: .iconLg))
          .accessibilityLabel(Text("Delete"))
          .disabled(disabled)
        }
        .accessibilityLabel(Text("Selection actions"))
      }
    }
  }
}
