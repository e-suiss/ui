import EsuissUI
import PhosphorSwift
import SwiftUI

private struct ChatExample: View {
  @State private var message = ""

  var body: some View {
    VStack(alignment: .leading, spacing: 20) {
      Message(align: .end) {
        MessageContent {
          Bubble(variant: .muted, align: .end) { BubbleContent("Default the theme to the system setting.") }
        }
      }
      VStack(alignment: .leading, spacing: 12) {
        Trace {
          TraceLine {
            TraceIcon { Ph.terminal.regular }
            TraceTitle(verbatim: "Ran rg -n defaultTheme app/layout.tsx")
          }
        }
        Text("It was set to light. I updated the ThemeProvider:").textStyle(.base).foregroundStyle(EsuissColor.foreground)
        CodeBlock(size: .sm) {
          CodeBlockContent("<ThemeProvider defaultTheme=\"system\" enableSystem>", language: "tsx")
        }
      }
      Message(align: .end) {
        MessageContent {
          Bubble(variant: .muted, align: .end) { BubbleContent("Run the build before I ship it.") }
        }
      }
      VStack(alignment: .leading, spacing: 12) {
        Trace {
          TraceLine {
            TraceIcon { Ph.checkCircle.regular }
            TraceTitle(verbatim: "Ran pnpm build")
          }
        }
        Text("The build passes, so it is ready to ship.").textStyle(.base).foregroundStyle(EsuissColor.foreground)
      }
      InputGroup {
        InputGroupTextarea("Ask the agent...", text: $message, lineLimit: 2...6)
        InputGroupAddon(align: .blockEnd) {
          InputGroupButton(size: .iconXs) {} label: {
            Ph.plus.regular.frame(width: 16, height: 16)
          }
          .accessibilityLabel(Text("Attach a file"))
          Spacer(minLength: 0)
          InputGroupButton(variant: .default, size: .iconXs) {} label: {
            Ph.arrowUp.regular.frame(width: 16, height: 16)
          }
          .accessibilityLabel(Text("Send"))
        }
      }
    }
  }
}

enum ChatAIStories {
  static let group = StoryGroup(.ai, "Chat", stories: [
    Story("Default") {
      ChatExample()
    },
  ])
}
