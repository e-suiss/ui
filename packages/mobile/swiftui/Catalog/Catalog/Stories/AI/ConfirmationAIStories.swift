import EsuissUI
import PhosphorSwift
import SwiftUI

private enum ConfirmationDecision {
  case pending, approved, denied
}

private struct ConfirmationExample: View {
  @State private var decision = ConfirmationDecision.pending

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Message(align: .end) {
        MessageContent {
          Bubble(variant: .muted, align: .end) { BubbleContent("Clean up the build folder.") }
        }
      }
      if decision == .pending {
        Trace {
          TraceLine {
            TraceIcon { Ph.shieldWarning.regular }
            TraceTitle("Wants to run a command")
          }
        }
        CodeBlock(size: .sm) { CodeBlockContent("rm -rf .next", language: "bash") }
        HStack(spacing: 8) {
          Button("Approve") { decision = .approved }
            .buttonStyle(.variant(.default, size: .sm))
          Button("Deny") { decision = .denied }
            .buttonStyle(.variant(.outline, size: .sm))
        }
      } else {
        Trace {
          TraceLine(status: decision == .denied ? .error : nil) {
            TraceIcon { Ph.terminal.regular }
            TraceTitle(verbatim: decision == .approved ? "Ran rm -rf .next" : "Denied rm -rf .next")
          }
        }
        Text(decision == .approved ? "Removed the build folder." : "Left the build folder as it is.")
          .textStyle(.base)
          .foregroundStyle(EsuissColor.foreground)
        Button("Reset") { decision = .pending }
          .buttonStyle(.variant(.ghost, size: .sm))
      }
    }
  }
}

enum ConfirmationAIStories {
  static let group = StoryGroup(.ai, "Confirmation", stories: [
    Story("Default") {
      ConfirmationExample()
    },
  ])
}
