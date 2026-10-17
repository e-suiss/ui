import EsuissUI
import PhosphorSwift
import SwiftUI

enum PlanAIStories {
  static let group = StoryGroup(.ai, "Plan", stories: [
    Story("Default") {
      TraceCollapsible(initiallyExpanded: true) {
        TraceCollapsibleTrigger {
          TraceLine(status: .running) {
            TraceIcon { Ph.path.regular }
            TraceTitle(verbatim: "Plan: migrate to Base UI")
            TraceDescription(verbatim: "2 of 4 done")
          }
        }
        TraceCollapsibleContent {
          Trace {
            TraceLine {
              TraceIcon { Ph.checkCircle.regular }
              TraceTitle(verbatim: "Install @base-ui/react")
            }
            TraceLine {
              TraceIcon { Ph.checkCircle.regular }
              TraceTitle(verbatim: "Replace the Radix imports")
            }
            TraceLine(status: .running) {
              TraceIcon { Ph.record.regular }
              TraceTitle(verbatim: "Rename asChild to render")
            }
            TraceLine(status: .pending) {
              TraceIcon { Ph.circle.regular }
              TraceTitle(verbatim: "Run the type checker")
            }
          }
        }
      }
    },
  ])
}
