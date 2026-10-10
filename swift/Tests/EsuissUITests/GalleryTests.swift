import PhosphorSwift
import SwiftUI
import XCTest

@testable import EsuissUI

private struct Gallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      HStack(spacing: 8) {
        ForEach(EsuissBadge<Text>.Variant.allCases, id: \.self) { variant in
          EsuissBadge(LocalizedStringKey(String(describing: variant)), variant: variant)
        }
      }
      VStack(alignment: .leading, spacing: 8) {
        ForEach(EsuissButtonStyle.Variant.allCases, id: \.self) { variant in
          HStack(spacing: 8) {
            Button(String(describing: variant)) {}
              .buttonStyle(.esuiss(variant))
            Button("Disabled") {}
              .buttonStyle(.esuiss(variant))
              .disabled(true)
          }
        }
      }
      HStack(spacing: 8) {
        Button("XS") {}.buttonStyle(.esuiss(size: .xs))
        Button("SM") {}.buttonStyle(.esuiss(size: .sm))
        Button("Default") {}.buttonStyle(.esuiss())
        Button("LG") {}.buttonStyle(.esuiss(size: .lg))
        Button {} label: {
          Ph.plus.regular.frame(width: 16, height: 16)
        }
        .buttonStyle(.esuiss(.outline, size: .icon))
      }
      Button {} label: {
        Label {
          Text("Continue")
        } icon: {
          Ph.arrowRight.regular
        }
      }
      .buttonStyle(.esuiss(size: .xl, block: true))
      VStack(alignment: .leading, spacing: 4) {
        ForEach(EsuissTextStyle.allCases, id: \.self) { style in
          Text("Type \(Int(style.size))").esuissTextStyle(style)
        }
      }
      .foregroundStyle(Color.esuissLabel)
      EsuissCard {
        EsuissCardHeader("Login to your account", description: "Enter your email below.") {
          Button("Sign Up") {}.buttonStyle(.esuiss(.link, size: .sm))
        }
        EsuissCardContent {
          Text("Card content").foregroundStyle(Color.esuissLabelSecondary)
        }
        EsuissCardFooter {
          Button("Login") {}.buttonStyle(.esuiss(block: true))
        }
      }
      EsuissCard(.filled, size: .sm) {
        EsuissCardHeader("Filled", description: "Small filled card.")
      }
    }
    .padding(16)
    .frame(width: 402, alignment: .leading)
    .background(Color.esuissSurface)
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
