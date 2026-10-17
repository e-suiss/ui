import EsuissUI
import PhosphorSwift
import SwiftUI

enum ToolAIStories {
  static let group = StoryGroup(.ai, "Tool", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 16) {
        Message(align: .end) {
          MessageContent {
            Bubble(variant: .muted, align: .end) { BubbleContent("Which package managers are installed?") }
          }
        }
        Trace {
          TraceCollapsible {
            TraceCollapsibleTrigger {
              TraceLine {
                TraceIcon { Ph.checkCircle.regular }
                TraceTitle(verbatim: "Ran node --version")
              }
            }
            TraceCollapsibleContent {
              CodeBlock(size: .sm) { CodeBlockContent("v24.18.0") }
            }
          }
          TraceCollapsible {
            TraceCollapsibleTrigger {
              TraceLine {
                TraceIcon { Ph.checkCircle.regular }
                TraceTitle(verbatim: "Ran npm --version")
              }
            }
            TraceCollapsibleContent {
              CodeBlock(size: .sm) { CodeBlockContent("11.6.2") }
            }
          }
          TraceCollapsible(initiallyExpanded: true) {
            TraceCollapsibleTrigger {
              TraceLine(status: .error) {
                TraceIcon { Ph.warningCircle.regular }
                TraceTitle(verbatim: "Failed to run pnpm --version")
              }
            }
            TraceCollapsibleContent {
              CodeBlock(.destructive, size: .sm) { CodeBlockContent("zsh: command not found: pnpm", wrap: true) }
            }
          }
        }
        Text("Node 24 and npm 11 are installed. pnpm is not.").textStyle(.base).foregroundStyle(EsuissColor.foreground)
      }
    },
  ])
}
