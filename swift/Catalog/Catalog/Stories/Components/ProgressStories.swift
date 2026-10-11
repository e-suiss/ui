import EsuissUI
import SwiftUI

enum ProgressStories {
  static let group = StoryGroup(.components, "Progress", stories: [
    Story("Default") {
      ProgressDelayed()
    },
    Story("WithLabel") {
      ProgressWithLabel()
    },
    Story("Complete") {
      ProgressView(value: 100, total: 100)
        .progressViewStyle(.bar)
    },
    Story("Values") {
      VStack(spacing: 16) {
        ForEach([0.0, 25, 50, 75, 100], id: \.self) { value in
          ProgressView(value: value, total: 100)
            .progressViewStyle(.bar)
        }
      }
      .frame(maxWidth: .infinity)
    },
  ])
}

private struct ProgressDelayed: View {
  @State private var value = 13.0

  var body: some View {
    ProgressView(value: value, total: 100)
      .progressViewStyle(.bar)
      .task {
        try? await Task.sleep(for: .milliseconds(500))
        value = 66
      }
  }
}

private struct ProgressWithLabel: View {
  @State private var value = 0

  var body: some View {
    ProgressView(value: Double(value), total: 100) {
      Text("Uploading")
    } currentValueLabel: {
      Text(verbatim: "\(value)%")
    }
    .progressViewStyle(.bar)
    .task {
      while !Task.isCancelled {
        try? await Task.sleep(for: .milliseconds(600))
        value = value >= 100 ? 0 : value + 10
      }
    }
  }
}
