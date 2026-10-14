import EsuissUI
import SwiftUI

enum SkeletonStories {
  static let group = StoryGroup(.components, "Skeleton", stories: [
    Story("Default") {
      Skeleton()
        .frame(width: 192, height: 16)
    },
    Story("Profile") {
      HStack(spacing: 16) {
        Skeleton(cornerRadius: Radius.full)
          .frame(width: 48, height: 48)
        VStack(alignment: .leading, spacing: 8) {
          Skeleton().frame(width: 192, height: 16)
          Skeleton().frame(width: 144, height: 16)
        }
      }
    },
    Story("Card") {
      VStack(alignment: .leading, spacing: 12) {
        Skeleton(cornerRadius: Radius.xl)
          .frame(height: 128)
          .frame(maxWidth: .infinity)
        GeometryReader { proxy in
          VStack(alignment: .leading, spacing: 8) {
            Skeleton().frame(width: proxy.size.width * 0.75, height: 16)
            Skeleton().frame(width: proxy.size.width * 0.5, height: 16)
          }
        }
        .frame(height: 40)
      }
    },
    Story("List") {
      VStack(alignment: .leading, spacing: 16) {
        ForEach(["one", "two", "three", "four"], id: \.self) { _ in
          HStack(spacing: 12) {
            Skeleton(cornerRadius: Radius.md)
              .frame(width: 40, height: 40)
            GeometryReader { proxy in
              VStack(alignment: .leading, spacing: 8) {
                Skeleton().frame(width: proxy.size.width * 2 / 3, height: 16)
                Skeleton().frame(width: proxy.size.width / 3, height: 12)
              }
              .frame(maxHeight: .infinity)
            }
            .frame(height: 40)
          }
        }
      }
    },
  ])
}
