import EsuissUI
import PhosphorSwift
import SwiftUI

private struct AISourceRow: View {
  let title: String
  let url: String

  @Environment(\.openURL) private var openURL

  var body: some View {
    Button {
      if let link = URL(string: url) { openURL(link) }
    } label: {
      TraceLine {
        TraceIcon { Ph.globe.regular }
        TraceTitle(verbatim: title)
        TraceIcon { Ph.arrowUpRight.regular }
      }
    }
    .buttonStyle(.plain)
    .accessibilityAddTraits(.isLink)
  }
}

enum SourcesAIStories {
  static let group = StoryGroup(.ai, "Sources", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 16) {
        Message(align: .end) {
          MessageContent {
            Bubble(variant: .muted, align: .end) { BubbleContent("How do I start a new Astro project?") }
          }
        }
        TraceCollapsible {
          TraceCollapsibleTrigger {
            TraceLine {
              TraceIcon { Ph.globe.regular }
              TraceTitle(verbatim: "Used 3 sources")
            }
          }
          TraceCollapsibleContent {
            Trace {
              AISourceRow(title: "Install Astro | docs.astro.build", url: "https://docs.astro.build/en/install-and-setup/")
              AISourceRow(title: "create-astro | npmjs.com", url: "https://www.npmjs.com/package/create-astro")
              AISourceRow(title: "pnpm create | pnpm.io", url: "https://pnpm.io/cli/create")
            }
          }
        }
        Text("Run pnpm create astro and follow the prompts.").textStyle(.base).foregroundStyle(EsuissColor.foreground)
      }
    },
  ])
}
