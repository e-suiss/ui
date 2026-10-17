import EsuissUI
import PhosphorSwift
import SwiftUI

enum SuggestionAIStories {
  static let group = StoryGroup(.ai, "Suggestion", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 12) {
        Text("Try asking").textStyle(.sm).foregroundStyle(EsuissColor.mutedForeground)
        ScrollView(.horizontal, showsIndicators: false) {
          HStack(spacing: 8) {
            ForEach(["Why does the build fail?", "Add dark mode", "Write tests for the cart", "Explain this error"], id: \.self) { suggestion in
              Button(suggestion) {}
                .buttonStyle(.variant(.outline, size: .sm))
            }
          }
        }
      }
    },
  ])
}
