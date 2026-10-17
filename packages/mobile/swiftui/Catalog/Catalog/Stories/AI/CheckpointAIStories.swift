import EsuissUI
import PhosphorSwift
import SwiftUI

private struct CheckpointExample: View {
  @State private var restored = false

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      CheckpointTurn(ask: "Rename the button component to action.", reply: "Renamed Button to Action in components/ui/button.tsx.")
      Marker(.separator) { MarkerContent("Checkpoint") }
      if !restored {
        CheckpointTurn(ask: "Update the docs to match.", reply: "Updated the Button page to say Action.")
      }
      Button(restored ? "Reset" : "Restore checkpoint") { restored.toggle() }
        .buttonStyle(.variant(.outline, size: .sm))
    }
  }
}

private struct CheckpointTurn: View {
  let ask: String
  let reply: String

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Message(align: .end) {
        MessageContent {
          Bubble(variant: .muted, align: .end) { BubbleContent(verbatim: ask) }
        }
      }
      Text(verbatim: reply).textStyle(.base).foregroundStyle(EsuissColor.foreground)
    }
  }
}

enum CheckpointAIStories {
  static let group = StoryGroup(.ai, "Checkpoint", stories: [
    Story("Default") {
      CheckpointExample()
    },
  ])
}
