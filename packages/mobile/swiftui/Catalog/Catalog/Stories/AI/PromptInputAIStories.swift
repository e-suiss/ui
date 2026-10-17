import EsuissUI
import PhosphorSwift
import SwiftUI

private struct PromptInputExample: View {
  @State private var message = ""

  var body: some View {
    InputGroup {
      InputGroupAddon(align: .blockStart) {
        Attachment(size: .xs) {
          AttachmentMedia { Ph.fileText.regular }
          AttachmentContent { AttachmentTitle("settings-page.tsx") }
          AttachmentActions { AttachmentAction("Remove", icon: Ph.x.bold) {} }
        }
      }
      InputGroupTextarea("Ask the agent to change your code...", text: $message, lineLimit: 3...8)
      InputGroupAddon(align: .blockEnd) {
        InputGroupButton(size: .iconXs) {} label: {
          Ph.plus.regular.frame(width: 16, height: 16)
        }
        .accessibilityLabel(Text("Attach a file"))
        Spacer(minLength: 0)
        InputGroupButton(size: .xs) {} label: {
          Text("Claude Opus 5.5")
        }
        InputGroupButton(variant: .default, size: .iconXs) {} label: {
          Ph.arrowUp.regular.frame(width: 16, height: 16)
        }
        .accessibilityLabel(Text("Send"))
      }
    }
  }
}

enum PromptInputAIStories {
  static let group = StoryGroup(.ai, "Prompt Input", stories: [
    Story("Default") {
      PromptInputExample()
    },
  ])
}
