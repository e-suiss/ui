import EsuissUI
import PhosphorSwift
import SwiftUI

private struct ContextExample: View {
  @State private var open = false

  var body: some View {
    Button("8% context") { open = true }
      .buttonStyle(.variant(.outline, size: .sm))
      .popover(isPresented: $open) {
        PopoverContent(width: 288) {
          PopoverHeader {
            PopoverTitle("16,400 of 200,000 tokens")
            PopoverDescription("Claude Opus 5.5")
          }
          ProgressView(value: 8, total: 100)
          VStack(spacing: 6) {
            ContextRow(label: "Input", value: "11,200")
            ContextRow(label: "Output", value: "3,900")
            ContextRow(label: "Reasoning", value: "1,300")
          }
        }
      }
  }
}

private struct ContextRow: View {
  let label: String
  let value: String

  var body: some View {
    HStack {
      Text(verbatim: label).foregroundStyle(EsuissColor.mutedForeground)
      Spacer()
      Text(verbatim: value).monospacedDigit().foregroundStyle(EsuissColor.foreground)
    }
    .textStyle(.sm)
  }
}

enum ContextAIStories {
  static let group = StoryGroup(.ai, "Context", stories: [
    Story("Default") {
      ContextExample()
    },
  ])
}
