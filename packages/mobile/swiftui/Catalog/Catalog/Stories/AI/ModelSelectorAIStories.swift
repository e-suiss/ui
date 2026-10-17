import EsuissUI
import PhosphorSwift
import SwiftUI

private struct ModelSelectorExample: View {
  @State private var model = "Claude Opus 5.5"

  var body: some View {
    DropdownMenu {
      DropdownMenuLabel("Anthropic")
      DropdownMenuRadioGroup(selection: $model) {
        DropdownMenuRadioItem("Claude Opus 5.5", value: "Claude Opus 5.5")
        DropdownMenuRadioItem("Claude Sonnet 5.5", value: "Claude Sonnet 5.5")
      }
      DropdownMenuSeparator()
      DropdownMenuLabel("OpenAI")
      DropdownMenuRadioGroup(selection: $model) {
        DropdownMenuRadioItem("GPT-5", value: "GPT-5")
        DropdownMenuRadioItem("GPT-5 mini", value: "GPT-5 mini")
      }
    } label: {
      HStack(spacing: 6) {
        Text(verbatim: model)
        Ph.caretDown.regular.frame(width: 14, height: 14)
      }
    }
    .buttonStyle(.variant(.outline, size: .sm))
  }
}

enum ModelSelectorAIStories {
  static let group = StoryGroup(.ai, "Model Selector", stories: [
    Story("Default") {
      ModelSelectorExample()
    },
  ])
}
