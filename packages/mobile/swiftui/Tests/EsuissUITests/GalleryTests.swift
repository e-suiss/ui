import PhosphorSwift
import SwiftUI
import XCTest

@testable import EsuissUI

private struct Gallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      HStack(spacing: 8) {
        ForEach(Badge<Text>.Variant.allCases, id: \.self) { variant in
          Badge(LocalizedStringKey(String(describing: variant)), variant: variant)
        }
      }
      VStack(alignment: .leading, spacing: 8) {
        ForEach(VariantButtonStyle.Variant.allCases, id: \.self) { variant in
          HStack(spacing: 8) {
            Button(String(describing: variant)) {}
              .buttonStyle(.variant(variant))
            Button("Disabled") {}
              .buttonStyle(.variant(variant))
              .disabled(true)
          }
        }
      }
      HStack(spacing: 8) {
        Button("XS") {}.buttonStyle(.variant(size: .xs))
        Button("SM") {}.buttonStyle(.variant(size: .sm))
        Button("Default") {}.buttonStyle(.variant())
        Button("LG") {}.buttonStyle(.variant(size: .lg))
        Button {} label: {
          Ph.plus.regular.frame(width: 16, height: 16)
        }
        .buttonStyle(.variant(.outline, size: .icon))
      }
      Button {} label: {
        Label {
          Text("Continue")
        } icon: {
          Ph.arrowRight.regular
        }
      }
      .buttonStyle(.variant(size: .xl, block: true))
      VStack(alignment: .leading, spacing: 4) {
        ForEach(TextStyle.allCases, id: \.self) { style in
          Text("Type \(Int(style.size))").textStyle(style)
        }
      }
      .foregroundStyle(EsuissColor.foreground)
      Card {
        CardHeader("Login to your account", description: "Enter your email below.") {
          Button("Sign Up") {}.buttonStyle(.variant(.link, size: .sm))
        }
        CardContent {
          Text("Card content").foregroundStyle(EsuissColor.mutedForeground)
        }
        CardFooter {
          Button("Login") {}.buttonStyle(.variant(block: true))
        }
      }
      Card(.filled, size: .sm) {
        CardHeader("Filled", description: "Small filled card.")
      }
    }
    .padding(16)
    .frame(width: 402, alignment: .leading)
    .background(EsuissColor.background)
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
