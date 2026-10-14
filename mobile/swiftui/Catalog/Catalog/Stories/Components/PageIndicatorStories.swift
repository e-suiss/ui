import EsuissUI
import SwiftUI

enum PageIndicatorStories {
  static let group = StoryGroup(.components, "Page Indicator", stories: [
    Story("Default") {
      PageIndicator(count: 5, index: 1)
    },
    Story("Sizes") {
      VStack(spacing: 24) {
        PageIndicator(count: 5, index: 1, size: .sm)
        PageIndicator(count: 5, index: 1)
      }
      .frame(maxWidth: .infinity)
    },
    Story("Accent") {
      PageIndicator(count: 5, index: 1, variant: .accent)
    },
    Story("ManyPages") {
      VStack(spacing: 24) {
        PageIndicator(count: 12, index: 0)
        PageIndicator(count: 12, index: 5)
        PageIndicator(count: 12, index: 11)
      }
      .frame(maxWidth: .infinity)
    },
    Story("Interactive") {
      PageIndicatorInteractive(count: 12)
    },
  ])
}

private struct PageIndicatorInteractive: View {
  let count: Int

  @State private var index = 0

  var body: some View {
    VStack(spacing: 12) {
      PageIndicator(count: count, index: index) { index = $0 }
      Text(verbatim: "Page \(index + 1) of \(count)")
        .textVariant(.muted)
    }
    .frame(maxWidth: .infinity)
  }
}
