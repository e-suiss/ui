import EsuissUI
import PhosphorSwift
import SwiftUI

enum QueueAIStories {
  static let group = StoryGroup(.ai, "Queue", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 16) {
        Message(align: .end) {
          MessageContent {
            Bubble(variant: .muted, align: .end) { BubbleContent("Add dark mode to the settings page.") }
          }
        }
        Trace {
          TraceCollapsible(initiallyExpanded: true) {
            TraceCollapsibleTrigger {
              TraceLine {
                TraceIcon { Ph.listDashes.regular }
                TraceTitle(verbatim: "2 to do")
              }
            }
            TraceCollapsibleContent {
              Trace {
                TraceLine(status: .running) {
                  TraceIcon { Ph.record.regular }
                  TraceTitle(verbatim: "Add a toggle to the settings page")
                }
                TraceLine(status: .pending) {
                  TraceIcon { Ph.circle.regular }
                  TraceTitle(verbatim: "Check contrast on the charts")
                }
              }
            }
          }
          TraceCollapsible(initiallyExpanded: true) {
            TraceCollapsibleTrigger {
              TraceLine {
                TraceIcon { Ph.listChecks.regular }
                TraceTitle(verbatim: "2 completed")
              }
            }
            TraceCollapsibleContent {
              Trace {
                TraceLine {
                  TraceIcon { Ph.checkCircle.regular }
                  TraceTitle(verbatim: "Add a dark variant to the theme tokens")
                }
                TraceLine {
                  TraceIcon { Ph.checkCircle.regular }
                  TraceTitle(verbatim: "Read the theme from a cookie")
                }
              }
            }
          }
        }
      }
    },
  ])
}
