import EsuissUI
import PhosphorSwift
import SwiftUI

enum PreviewStories {
  static let group = StoryGroup(.patterns, "Preview", stories: [
    Story("Default") {
      PreviewDemo()
    },
    Story("OpenByDefault") {
      PreviewDemo(open: true)
    },
    Story("WithCloseButton") {
      PreviewDemo(open: true, showCloseButton: true)
    },
    Story("WithCloseLabel") {
      PreviewDemo(open: true, showCloseButton: true, closeLabel: "Done")
    },
  ])
}

private struct PreviewDemo: View {
  var showCloseButton = false
  var closeLabel: LocalizedStringKey?

  @State private var open: Bool

  init(open: Bool = false, showCloseButton: Bool = false, closeLabel: LocalizedStringKey? = nil) {
    _open = State(initialValue: open)
    self.showCloseButton = showCloseButton
    self.closeLabel = closeLabel
  }

  var body: some View {
    Button {
      open = true
    } label: {
      Text(verbatim: "@ada")
        .textStyle(.base)
        .foregroundStyle(EsuissColor.primary)
    }
    .buttonStyle(PreviewTriggerStyle())
    .preview(isPresented: $open) {
      PreviewContent(showCloseButton: showCloseButton, closeLabel: closeLabel) {
        PreviewProfileCard()
      }
      .accessibilityLabel(Text(verbatim: "@ada"))
    }
    .frame(maxWidth: .infinity)
  }
}

private struct PreviewTriggerStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .opacity(configuration.isPressed ? 0.8 : 1)
  }
}

private struct PreviewProfileCard: View {
  var body: some View {
    HStack(alignment: .top, spacing: 16) {
      Avatar(url: URL(string: "https://i.pravatar.cc/150?img=5"), initials: "AL", size: .lg)
        .accessibilityLabel(Text(verbatim: "Ada Lovelace"))
      VStack(alignment: .leading, spacing: 4) {
        Text(verbatim: "@ada")
          .textStyle(.sm, weight: .semibold)
          .foregroundStyle(EsuissColor.foreground)
        Text("Mathematician and writer, known for her work on the Analytical Engine.")
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.foreground)
          .fixedSize(horizontal: false, vertical: true)
        HStack(spacing: 6) {
          Ph.calendarBlank.regular
            .frame(width: 16, height: 16)
          Text("Joined December 2021")
            .textStyle(.xs)
        }
        .foregroundStyle(EsuissColor.mutedForeground)
        .padding(.top, 4)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    }
  }
}
