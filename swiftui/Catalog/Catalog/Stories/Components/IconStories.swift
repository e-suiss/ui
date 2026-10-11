import EsuissUI
import PhosphorSwift
import SwiftUI

enum IconStories {
  static let group = StoryGroup(.components, "Icon", stories: [
    Story("Default") {
      IconGlyph(image: Ph.star.regular)
    },
    Story("Sizes") {
      HStack(spacing: 16) {
        IconGlyph(image: Ph.bell.regular, size: 16)
        IconGlyph(image: Ph.bell.regular)
        IconGlyph(image: Ph.bell.regular, size: 24)
        IconGlyph(image: Ph.bell.regular, size: 32)
      }
    },
    Story("Colors") {
      HStack(spacing: 16) {
        IconGlyph(image: Ph.info.regular)
        IconGlyph(image: Ph.gear.regular, color: .labelSecondary)
        IconGlyph(image: Ph.heart.fill, color: .accent)
        IconGlyph(image: Ph.warning.regular, color: .danger)
      }
    },
    Story("Weights") {
      HStack(spacing: 16) {
        IconGlyph(image: Ph.star.thin, size: 24)
        IconGlyph(image: Ph.star.light, size: 24)
        IconGlyph(image: Ph.star.regular, size: 24)
        IconGlyph(image: Ph.star.bold, size: 24)
        IconGlyph(image: Ph.star.fill, size: 24)
        IconGlyph(image: Ph.star.duotone, size: 24)
      }
    },
  ])
}

private struct IconGlyph: View {
  let image: Image
  var size: CGFloat = 20
  var color: Color = .label

  var body: some View {
    image
      .resizable()
      .scaledToFit()
      .frame(width: size, height: size)
      .foregroundStyle(color)
  }
}
