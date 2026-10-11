import EsuissUI
import SwiftUI

enum ContextMenuStories {
  static let group = StoryGroup(.components, "Context Menu", stories: [
    Story("Default") {
      ContextMenuDemo()
    },
    Story("Simple") {
      ContextMenuTriggerArea()
        .contextMenu(previewRadius: Radius.md) {
          ContextMenuItem("Profile") {}
          ContextMenuItem("Billing") {}
          ContextMenuItem("Team") {}
          ContextMenuItem("Subscription") {}
        }
    },
  ])
}

private struct ContextMenuTriggerArea: View {
  var body: some View {
    Text("Long press here")
      .textStyle(.sm)
      .foregroundStyle(Color.labelSecondary)
      .frame(maxWidth: .infinity)
      .frame(height: 144)
      .background(Color.surface, in: RoundedRectangle(cornerRadius: Radius.md, style: .continuous))
      .overlay {
        RoundedRectangle(cornerRadius: Radius.md, style: .continuous)
          .strokeBorder(Color.separator, style: StrokeStyle(lineWidth: 1, dash: [4, 3]))
      }
  }
}

private struct ContextMenuDemo: View {
  @State private var showBookmarks = true
  @State private var showUrls = false
  @State private var person = "pedro"

  var body: some View {
    ContextMenuTriggerArea()
      .contextMenu(previewRadius: Radius.md) {
        ContextMenuItem("Back", inset: true) {}
        ContextMenuItem("Forward", inset: true) {}
          .disabled(true)
        ContextMenuItem("Reload", inset: true) {}
        ContextMenuSub("More tools", inset: true) {
          ContextMenuItem("Save page") {}
          ContextMenuItem("Create shortcut") {}
          ContextMenuSeparator()
          ContextMenuItem("Delete", variant: .destructive) {}
        }
        ContextMenuSeparator()
        ContextMenuCheckboxItem("Show bookmarks", isOn: $showBookmarks)
        ContextMenuCheckboxItem("Show full URLs", isOn: $showUrls)
        ContextMenuSeparator()
        ContextMenuRadioGroup(selection: $person) {
          ContextMenuLabel("People", inset: true)
          ContextMenuRadioItem("Pedro Duarte", value: "pedro")
          ContextMenuRadioItem("Colm Tuite", value: "colm")
        }
      }
  }
}
