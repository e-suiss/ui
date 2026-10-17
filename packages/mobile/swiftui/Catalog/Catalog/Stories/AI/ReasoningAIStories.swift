import EsuissUI
import PhosphorSwift
import SwiftUI

enum ReasoningAIStories {
  static let group = StoryGroup(.ai, "Reasoning", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 16) {
        Message(align: .end) {
          MessageContent {
            Bubble(variant: .muted, align: .end) { BubbleContent("Why is the checkout deploy so slow?") }
          }
        }
        TraceCollapsible(initiallyExpanded: true) {
          TraceCollapsibleTrigger {
            TraceLine {
              TraceIcon { Ph.brain.regular }
              TraceTitle(verbatim: "Thought for 5s")
            }
          }
          TraceCollapsibleContent {
            Text("The build log shows install and compile finish in under a minute. Image optimization takes almost four, and it reruns on every deploy because the cache key includes the commit hash.")
          }
        }
        Text("Image optimization is the bottleneck. Key its cache on the lockfile and the image directory instead of the commit hash.").textStyle(.base).foregroundStyle(EsuissColor.foreground)
      }
    },
  ])
}
