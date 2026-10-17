import EsuissUI
import PhosphorSwift
import SwiftUI

enum ChainOfThoughtAIStories {
  static let group = StoryGroup(.ai, "Chain Of Thought", stories: [
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
              TraceTitle(verbatim: "Researched in 3 steps")
            }
          }
          TraceCollapsibleContent {
            Trace {
              TraceLine {
                TraceIcon { Ph.fileText.regular }
                TraceTitle(verbatim: "Read the build log for dpl_8Kx2")
              }
              TraceLine {
                TraceIcon { Ph.globe.regular }
                TraceTitle(verbatim: "Searched the web for next.js image cache key")
                TraceDescription(verbatim: "2 sources")
              }
              TraceLine {
                TraceIcon { Ph.magnifyingGlass.regular }
                TraceTitle(verbatim: "Searched the code for cacheKey")
                TraceDescription(verbatim: "3 results")
              }
            }
          }
        }
        Text("Image optimization reruns on every deploy because its cache key includes the commit hash. Key it on the lockfile instead.").textStyle(.base).foregroundStyle(EsuissColor.foreground)
      }
    },
  ])
}
