import EsuissUI
import SwiftUI

enum FlyoutStories {
  static let group = StoryGroup(.patterns, "Flyout", stories: [
    Story("Default") {
      FlyoutDemo(open: false)
    },
    Story("OpenByDefault") {
      FlyoutDemo(open: true)
    },
  ])
}

private struct FlyoutDemo: View {
  @State private var open: Bool

  init(open: Bool) {
    _open = State(initialValue: open)
  }

  var body: some View {
    Button("Dimensions") { open = true }
      .buttonStyle(.variant(.outline))
      .flyout(isPresented: $open) {
        FlyoutDemoContent()
      }
  }
}

private struct FlyoutDemoContent: View {
  @State private var width = "100%"
  @State private var height = "25px"

  var body: some View {
    FlyoutContent {
      FlyoutHeader {
        FlyoutTitle("Dimensions")
        FlyoutDescription("Set the dimensions for the layer.")
      }
      FlyoutBody {
        VStack(spacing: 12) {
          TextField("Width", text: $width)
            .textFieldStyle(.input)
          TextField("Height", text: $height)
            .textFieldStyle(.input)
          FlyoutClose {
            Text("Done").frame(maxWidth: .infinity)
          }
          .buttonStyle(.variant(.secondary))
        }
      }
    }
  }
}
