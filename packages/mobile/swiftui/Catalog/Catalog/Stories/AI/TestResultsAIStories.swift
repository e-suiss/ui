import EsuissUI
import PhosphorSwift
import SwiftUI

enum TestResultsAIStories {
  static let group = StoryGroup(.ai, "Test Results", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 16) {
        Message(align: .end) {
          MessageContent {
            Bubble(variant: .muted, align: .end) { BubbleContent("Run the checkout tests.") }
          }
        }
        TraceCollapsible(initiallyExpanded: true) {
          TraceCollapsibleTrigger {
            TraceLine(status: .error) {
              TraceIcon { Ph.flask.regular }
              TraceTitle(verbatim: "Ran 5 tests, 1 failed")
            }
          }
          TraceCollapsibleContent {
            Trace {
              TraceLine {
                TraceIcon { Ph.checkCircle.regular }
                TraceTitle(verbatim: "cart.test.ts")
                TraceDescription(verbatim: "3 passed")
              }
              TraceLine(status: .error) {
                TraceIcon { Ph.xCircle.regular }
                TraceTitle(verbatim: "payment.test.ts › retries a declined card")
              }
              TraceLine {
                TraceIcon { Ph.checkCircle.regular }
                TraceTitle(verbatim: "payment.test.ts › charges the saved card")
              }
            }
          }
        }
        Text("The retry test expects two attempts and the client makes one.").textStyle(.base).foregroundStyle(EsuissColor.foreground)
      }
    },
  ])
}
