import EsuissUI
import PhosphorSwift
import SwiftUI

enum StackTraceAIStories {
  static let group = StoryGroup(.ai, "Stack Trace", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 16) {
        Message(align: .end) {
          MessageContent {
            Bubble(variant: .muted, align: .end) { BubbleContent("Reset the database and seed it.") }
          }
        }
        TraceCollapsible(initiallyExpanded: true) {
          TraceCollapsibleTrigger {
            TraceLine(status: .error) {
              TraceIcon { Ph.warningCircle.regular }
              TraceTitle(verbatim: "Failed to run pnpm db:seed")
            }
          }
          TraceCollapsibleContent {
            CodeBlock(.destructive, size: .sm) { CodeBlockContent("TypeError: Cannot read properties of undefined (reading 'id')\\n  at seedOrders (scripts/seed.ts:42:18)\\n  at main (scripts/seed.ts:12:3)", wrap: true) }
          }
        }
        Text("The seed reads a customer before it is created. Seeding customers first fixes the order step.").textStyle(.base).foregroundStyle(EsuissColor.foreground)
      }
    },
  ])
}
