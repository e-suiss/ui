import EsuissUI
import SwiftUI

enum SeparatorStories {
  static let group = StoryGroup(.components, "Separator", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 0) {
        VStack(alignment: .leading, spacing: 4) {
          Text("esuiss")
            .textStyle(.sm, weight: .medium)
            .foregroundStyle(Color.label)
          Text("An open-source UI component library.")
            .textVariant(.muted)
        }
        Separator()
          .padding(.vertical, 16)
        HStack(spacing: 16) {
          SeparatorText("Blog")
          Separator(.vertical)
          SeparatorText("Docs")
          Separator(.vertical)
          SeparatorText("Source")
        }
        .frame(height: 20)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    },
    Story("Horizontal") {
      VStack(alignment: .leading, spacing: 16) {
        SeparatorText("Above")
        Separator()
        SeparatorText("Below")
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    },
    Story("Vertical") {
      HStack(spacing: 16) {
        SeparatorText("Left")
        Separator(.vertical)
        SeparatorText("Right")
      }
      .frame(height: 24)
    },
  ])
}

private struct SeparatorText: View {
  let title: LocalizedStringKey

  init(_ title: LocalizedStringKey) {
    self.title = title
  }

  var body: some View {
    Text(title)
      .textStyle(.sm)
      .foregroundStyle(Color.label)
  }
}
