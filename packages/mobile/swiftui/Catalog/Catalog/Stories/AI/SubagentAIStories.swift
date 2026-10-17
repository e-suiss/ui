import EsuissUI
import PhosphorSwift
import SwiftUI

enum SubagentAIStories {
  static let group = StoryGroup(.ai, "Subagent", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 16) {
        Message(align: .end) {
          MessageContent {
            Bubble(variant: .muted, align: .end) { BubbleContent("Find out why the images rebuild on every deploy.") }
          }
        }
        TraceCollapsible(initiallyExpanded: true) {
          TraceCollapsibleTrigger {
            TraceLine {
              TraceIcon { Ph.robot.regular }
              TraceTitle(verbatim: "Ran the research subagent")
              TraceDescription(verbatim: "3 commands")
            }
          }
          TraceCollapsibleContent {
            Trace {
              TraceLine {
                TraceIcon { Ph.terminal.regular }
                TraceTitle(verbatim: "Ran grep -rn cacheKey scripts")
              }
              TraceLine {
                TraceIcon { Ph.terminal.regular }
                TraceTitle(verbatim: "Ran sed -n 13,15p scripts/optimize-images.ts")
              }
              TraceLine {
                TraceIcon { Ph.terminal.regular }
                TraceTitle(verbatim: "Ran ls public/images | wc -l")
              }
            }
            Text("The cache key in scripts/optimize-images.ts includes the commit hash, so all 1,284 images rebuild.").foregroundStyle(EsuissColor.foreground)
          }
        }
      }
    },
  ])
}
