import EsuissUI
import PhosphorSwift
import SwiftUI

enum FileTreeAIStories {
  static let group = StoryGroup(.ai, "File Tree", stories: [
    Story("Default") {
      Trace {
        TraceCollapsible(initiallyExpanded: true) {
          TraceCollapsibleTrigger {
            TraceLine {
              TraceIcon { Ph.folder.regular }
              TraceTitle(verbatim: "app")
            }
          }
          TraceCollapsibleContent {
            Trace {
              TraceCollapsible(initiallyExpanded: true) {
                TraceCollapsibleTrigger {
                  TraceLine {
                    TraceIcon { Ph.folder.regular }
                    TraceTitle(verbatim: "settings")
                  }
                }
                TraceCollapsibleContent {
                  Trace {
                    TraceLine {
                      TraceIcon { Ph.file.regular }
                      TraceTitle(verbatim: "page.tsx")
                      TraceDescription(verbatim: "+24 −6")
                    }
                    TraceLine {
                      TraceIcon { Ph.file.regular }
                      TraceTitle(verbatim: "theme-toggle.tsx")
                      TraceDescription(verbatim: "+41")
                    }
                  }
                }
              }
              TraceLine {
                TraceIcon { Ph.file.regular }
                TraceTitle(verbatim: "layout.tsx")
                TraceDescription(verbatim: "+3 −1")
              }
            }
          }
        }
      }
    },
  ])
}
