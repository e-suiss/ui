import EsuissUI
import PhosphorSwift
import SwiftUI

enum PreviewMenuStories {
  static let group = StoryGroup(.interactions, "Preview Menu", stories: [
    Story("Default") {
      PreviewMenuPhotoGrid()
    },
    Story("OpenByDefault") {
      PreviewMenuPhotoGrid(openIndex: 1)
    },
    Story("DisabledItem") {
      PreviewMenuPhotoGrid(withDisabled: true, openIndex: 0)
    },
    Story("CustomPreview") {
      PreviewMenuAlbum()
    },
    Story("CustomPreviewOpen") {
      PreviewMenuAlbum(open: true)
    },
  ])
}

private let previewMenuTones: [Color] = [
  .accent,
  .warning,
  .success,
  .link,
  .danger,
  .accentPressed,
  .labelTertiary,
  .separatorStrong,
  .surfaceTertiary,
]

private struct PreviewMenuPhotoGrid: View {
  var withDisabled = false
  var openIndex: Int?

  @State private var log: LocalizedStringKey = "Touch and hold a photo."

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      GeometryReader { proxy in
        let side = ((proxy.size.width - 16) / 3).rounded(.down)
        FlowRow(spacing: 8) {
          ForEach(previewMenuTones.indices, id: \.self) { index in
            PreviewMenuPhoto(
              index: index,
              side: side,
              withDisabled: withDisabled,
              open: index == openIndex,
              log: $log
            )
          }
        }
      }
      .aspectRatio(1, contentMode: .fit)
      Text(log)
        .textVariant(.muted)
    }
  }
}

private struct PreviewMenuPhoto: View {
  let index: Int
  let side: CGFloat
  let withDisabled: Bool
  @Binding var log: LocalizedStringKey

  @State private var open: Bool

  init(index: Int, side: CGFloat, withDisabled: Bool, open: Bool, log: Binding<LocalizedStringKey>) {
    self.index = index
    self.side = side
    self.withDisabled = withDisabled
    _log = log
    _open = State(initialValue: open)
  }

  var body: some View {
    let label = "Photo \(index + 1)"
    previewMenuTones[index]
      .frame(width: side, height: side)
      .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
      .accessibilityElement()
      .accessibilityLabel(Text(verbatim: label))
      .previewMenu(isPresented: $open) {
        PreviewMenuItem("Copy", icon: Ph.copy.regular) { log = "Copied \(label)" }
        PreviewMenuItem("Share", icon: Ph.shareNetwork.regular) { log = "Shared \(label)" }
        PreviewMenuItem("Favorite", icon: Ph.heart.regular) { log = "Favorited \(label)" }
          .disabled(withDisabled)
        PreviewMenuSeparator()
        PreviewMenuItem("Delete", icon: Ph.trash.regular, variant: .destructive) { log = "Deleted \(label)" }
      }
  }
}

private struct PreviewMenuAlbum: View {
  @State private var open: Bool

  init(open: Bool = false) {
    _open = State(initialValue: open)
  }

  var body: some View {
    HStack(spacing: 12) {
      RoundedRectangle(cornerRadius: Radius.lg, style: .continuous)
        .fill(Color.accent)
        .frame(width: 48, height: 48)
      VStack(alignment: .leading, spacing: 0) {
        Text("Trip to the coast")
          .textStyle(.base, weight: .semibold)
          .foregroundStyle(Color.label)
        Text("48 photos")
          .textVariant(.muted)
      }
    }
    .padding(12)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
    .previewMenu(isPresented: $open, aspectRatio: 4 / 3) {
      PreviewMenuItem("Share album", icon: Ph.shareNetwork.regular) {}
      PreviewMenuItem("Delete album", icon: Ph.trash.regular, variant: .destructive) {}
    } preview: {
      VStack(alignment: .leading, spacing: 0) {
        Text("Trip to the coast")
          .textStyle(.lg, weight: .semibold)
        Text("48 photos · Updated today")
          .textStyle(.sm)
      }
      .foregroundStyle(Color.onAccent)
      .padding(16)
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
      .background(Color.accent)
    }
  }
}
