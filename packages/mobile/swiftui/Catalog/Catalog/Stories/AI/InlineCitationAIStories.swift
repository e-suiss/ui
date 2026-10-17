import EsuissUI
import PhosphorSwift
import SwiftUI

private struct InlineCitationExample: View {
  @State private var open = false

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text("Suspense shows a fallback until its children finish loading, so the page can stream the rest of the content first.")
        .textStyle(.base)
        .foregroundStyle(EsuissColor.foreground)
      Button("react.dev") { open = true }
        .buttonStyle(.variant(.secondary, size: .xs))
        .popover(isPresented: $open) {
          PopoverContent(width: 288) {
            PopoverHeader {
              PopoverTitle(verbatim: "<Suspense> – React")
              PopoverDescription("Lets you display a fallback until its children have finished loading.")
            }
          }
        }
    }
  }
}

enum InlineCitationAIStories {
  static let group = StoryGroup(.ai, "Inline Citation", stories: [
    Story("Default") {
      InlineCitationExample()
    },
  ])
}
