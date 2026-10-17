import EsuissUI
import PhosphorSwift
import SwiftUI

enum TaskAIStories {
  static let group = StoryGroup(.ai, "Task", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 16) {
        Message(align: .end) {
          MessageContent {
            Bubble(variant: .muted, align: .end) { BubbleContent("Update the page titles for the docs.") }
          }
        }
        Trace {
          TraceCollapsible {
            TraceCollapsibleTrigger {
              TraceLine {
                TraceIcon { Ph.checkCircle.regular }
                TraceTitle(verbatim: "Found the project files")
              }
            }
            TraceCollapsibleContent {
              Trace {
                TraceLine {
                  TraceIcon { Ph.magnifyingGlass.regular }
                  TraceTitle(verbatim: "Searched for generateMetadata")
                  TraceDescription(verbatim: "6 results")
                }
                TraceLine {
                  TraceIcon { Ph.fileText.regular }
                  TraceTitle(verbatim: "Read app/docs/layout.tsx")
                }
              }
            }
          }
          TraceCollapsible(initiallyExpanded: true) {
            TraceCollapsibleTrigger {
              TraceLine {
                TraceIcon { Ph.checkCircle.regular }
                TraceTitle(verbatim: "Updated the page metadata")
              }
            }
            TraceCollapsibleContent {
              Trace {
                TraceLine {
                  TraceIcon { Ph.notePencil.regular }
                  TraceTitle(verbatim: "Edited app/docs/[slug]/page.tsx")
                  TraceDescription(verbatim: "+8 −3")
                }
                TraceLine {
                  TraceIcon { Ph.notePencil.regular }
                  TraceTitle(verbatim: "Edited app/docs/layout.tsx")
                  TraceDescription(verbatim: "+2 −1")
                }
              }
            }
          }
        }
        Text("Each docs page now builds its title from the page name.").textStyle(.base).foregroundStyle(EsuissColor.foreground)
      }
    },
  ])
}
