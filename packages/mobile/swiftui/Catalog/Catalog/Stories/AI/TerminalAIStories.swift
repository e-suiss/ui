import EsuissUI
import PhosphorSwift
import SwiftUI

enum TerminalAIStories {
  static let group = StoryGroup(.ai, "Terminal", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 16) {
        Message(align: .end) {
          MessageContent {
            Bubble(variant: .muted, align: .end) { BubbleContent("Run the checks, then build the app.") }
          }
        }
        Trace {
          TraceLine {
            TraceIcon { Ph.terminal.regular }
            TraceTitle(verbatim: "Ran pnpm lint")
            TraceDescription(verbatim: "2s")
          }
          TraceLine {
            TraceIcon { Ph.terminal.regular }
            TraceTitle(verbatim: "Ran pnpm test")
            TraceDescription(verbatim: "14s")
          }
          TraceCollapsible(initiallyExpanded: true) {
            TraceCollapsibleTrigger {
              TraceLine {
                TraceIcon { Ph.terminal.regular }
                TraceTitle(verbatim: "Ran pnpm build")
                TraceDescription(verbatim: "38s")
              }
            }
            TraceCollapsibleContent {
              CodeBlock(size: .sm) { CodeBlockContent("$ pnpm build\\nCompiled successfully in 31s\\nRoute (app)  Size\\n/            4.2 kB\\n/checkout    8.9 kB", language: "bash") }
            }
          }
        }
        Text("Lint and tests pass, and the build compiled both routes.").textStyle(.base).foregroundStyle(EsuissColor.foreground)
      }
    },
  ])
}
