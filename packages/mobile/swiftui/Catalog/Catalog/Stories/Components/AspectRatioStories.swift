import EsuissUI
import PhosphorSwift
import SwiftUI

enum AspectRatioStories {
  static let group = StoryGroup(.components, "Aspect Ratio", stories: [
    Story("Default") {
      AspectRatio(ratio: 16 / 9) {
        AspectRatioPhoto()
      }
      .clipShape(RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
      .frame(maxWidth: .infinity)
    },
    Story("Square") {
      AspectRatio(ratio: 1) {
        AspectRatioPhoto()
      }
      .clipShape(RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
      .frame(width: 192)
    },
    Story("Portrait") {
      AspectRatio(ratio: 9 / 16) {
        AspectRatioPhoto()
      }
      .clipShape(RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
      .frame(width: 160)
    },
    Story("Placeholder") {
      AspectRatio(ratio: 16 / 9) {
        VStack(spacing: 8) {
          Ph.image.regular
            .frame(width: 32, height: 32)
            .foregroundStyle(EsuissColor.mutedForeground)
          Text("16 / 9")
            .textVariant(.muted)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
      }
      .frame(maxWidth: .infinity)
    },
  ])
}

private struct AspectRatioPhoto: View {
  var body: some View {
    AsyncImage(
      url: URL(string: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80")
    ) { phase in
      if let image = phase.image {
        image.resizable().scaledToFill()
      } else {
        EsuissColor.muted
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }
}
