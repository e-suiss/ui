import SwiftUI
import XCTest

@testable import EsuissUI

private struct Gallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      HStack(spacing: 8) {
        EsuissBadge("Badge")
        EsuissBadge("Secondary", variant: .secondary)
        EsuissBadge("Error", variant: .destructive)
        EsuissBadge("Outline", variant: .outline)
      }
      VStack(alignment: .leading, spacing: 8) {
        ForEach(EsuissButtonStyle.Variant.allCases, id: \.self) { variant in
          Button(String(describing: variant)) {}
            .buttonStyle(.esuiss(variant))
        }
        Button("Disabled") {}
          .buttonStyle(.esuiss())
          .disabled(true)
      }
      HStack(spacing: 8) {
        Button("XS") {}.buttonStyle(.esuiss(size: .xs))
        Button("SM") {}.buttonStyle(.esuiss(size: .sm))
        Button("Default") {}.buttonStyle(.esuiss())
        Button("LG") {}.buttonStyle(.esuiss(size: .lg))
        Button {} label: { Image(systemName: "plus") }
          .buttonStyle(.esuiss(.outline, size: .icon))
      }
      EsuissCard {
        EsuissCardHeader("Login to your account", description: "Enter your email below.")
        Button("Login") {}.buttonStyle(.esuiss())
      }
    }
    .padding(16)
    .frame(width: 402, alignment: .leading)
    .background(Color.esuissBackground)
  }
}

@MainActor
final class GalleryTests: XCTestCase {
  func testRendersGalleryInBothSchemes() throws {
    let output = ProcessInfo.processInfo.environment["GALLERY_OUTPUT"]
      ?? NSTemporaryDirectory()
    for scheme in [ColorScheme.light, .dark] {
      let renderer = ImageRenderer(content: Gallery().environment(\.colorScheme, scheme))
      renderer.scale = 3
      let image = try XCTUnwrap(renderer.uiImage)
      let data = try XCTUnwrap(image.pngData())
      let name = scheme == .dark ? "gallery-dark.png" : "gallery-light.png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(name))
    }
  }
}
