import EsuissUI
import SwiftUI
import UIKit

enum ImageViewerStories {
  static let group = StoryGroup(.interactions, "Image Viewer", stories: [
    Story("Default") {
      ImageViewerGallery()
    },
    Story("OpenByDefault") {
      ImageViewerGallery(open: true, index: 1)
    },
  ])
}

private struct ImageViewerPhoto {
  let url: URL
  let label: String
}

private let imageViewerPhotos = [
  ImageViewerPhoto(url: URL(string: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=1200&q=80")!, label: "Mountain lake at sunrise"),
  ImageViewerPhoto(url: URL(string: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80")!, label: "Valley with a river"),
  ImageViewerPhoto(url: URL(string: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80")!, label: "Lake between mountains"),
  ImageViewerPhoto(url: URL(string: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80")!, label: "Foggy hills"),
  ImageViewerPhoto(url: URL(string: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80")!, label: "Forest path"),
]

private struct ImageViewerGallery: View {
  @State private var open: Bool
  @State private var index: Int
  @State private var loaded: [Int: UIImage] = [:]

  init(open: Bool = false, index: Int = 0) {
    _open = State(initialValue: open)
    _index = State(initialValue: index)
  }

  private var images: [Image] {
    imageViewerPhotos.indices.map { page in
      let photo = imageViewerPhotos[page]
      if let cgImage = loaded[page]?.cgImage {
        return Image(cgImage, scale: 1, orientation: .up, label: Text(verbatim: photo.label))
      }
      return Image(uiImage: UIImage())
    }
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      GeometryReader { proxy in
        let side = ((proxy.size.width - 16) / 3).rounded(.down)
        FlowRow(spacing: 8) {
          ForEach(imageViewerPhotos.indices, id: \.self) { page in
            Button {
              index = page
              open = true
            } label: {
              thumbnail(page)
                .frame(width: side, height: side)
                .background(EsuissColor.muted)
                .clipShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
            }
            .buttonStyle(.plain)
            .accessibilityLabel(Text(verbatim: imageViewerPhotos[page].label))
          }
        }
      }
      .aspectRatio(3 / 2, contentMode: .fit)
      Text("Tap a photo. Pinch or double-tap to zoom, swipe down to close.")
        .textVariant(.muted)
    }
    .imageViewer(isPresented: $open, images: images, index: $index)
    .task {
      await load()
    }
  }

  @ViewBuilder
  private func thumbnail(_ page: Int) -> some View {
    if let image = loaded[page] {
      Image(uiImage: image)
        .resizable()
        .scaledToFill()
    } else {
      EsuissColor.muted
    }
  }

  private func load() async {
    await withTaskGroup(of: (Int, UIImage?).self) { group in
      for (page, photo) in imageViewerPhotos.enumerated() {
        group.addTask {
          guard let (data, _) = try? await URLSession.shared.data(from: photo.url) else { return (page, nil) }
          return (page, UIImage(data: data))
        }
      }
      for await (page, image) in group {
        if let image { loaded[page] = image }
      }
    }
  }
}
