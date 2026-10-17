import EsuissUI
import PhosphorSwift
import SwiftUI

private struct AIIconButton: View {
  let label: String
  let image: Image

  var body: some View {
    Button {} label: {
      image.frame(width: 16, height: 16)
    }
    .buttonStyle(.variant(.ghost, size: .iconSm))
    .accessibilityLabel(Text(label))
  }
}

enum MessageAIStories {
  static let group = StoryGroup(.ai, "Message", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 16) {
        Message(align: .end) {
          MessageContent {
            Bubble(variant: .muted, align: .end) { BubbleContent("How do I add a dialog?") }
          }
        }
        VStack(alignment: .leading, spacing: 12) {
          Text("Add it with the CLI, then import it where you need it.").textStyle(.base).foregroundStyle(EsuissColor.foreground)
          CodeBlock(size: .sm) {
            CodeBlockHeader {
              CodeBlockTitle("Terminal")
              CodeBlockActions { CodeBlockCopyButton(value: "npx @esuiss/ui@latest add dialog") }
            }
            CodeBlockContent("npx @esuiss/ui@latest add dialog", language: "bash")
          }
          HStack(spacing: 4) {
            AIIconButton(label: "Good reply", image: Ph.thumbsUp.regular)
            AIIconButton(label: "Bad reply", image: Ph.thumbsDown.regular)
            AIIconButton(label: "Retry", image: Ph.arrowClockwise.regular)
          }
        }
      }
    },
  ])
}
