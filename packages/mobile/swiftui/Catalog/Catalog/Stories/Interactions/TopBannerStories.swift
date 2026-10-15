import EsuissUI
import PhosphorSwift
import SwiftUI

enum TopBannerStories {
  static let group = StoryGroup(.interactions, "Top Banner", stories: [
    Story("Default") {
      TopBannerStage(timeout: .seconds(4))
    },
    Story("Showing") {
      TopBannerStage { manager in
        manager.show("Message sent", description: "Alex will see it the next time they open the app.")
      }
    },
    Story("WithIcon") {
      TopBannerStage { manager in
        manager.show(
          "Reminders are on",
          description: "We will remind you 10 minutes before each event.",
          icon: Ph.bell.regular
        )
      }
    },
    Story("WithAction") {
      TopBannerStage { manager in
        manager.show(
          "Upload paused",
          description: "3 photos are waiting for Wi-Fi.",
          icon: Ph.cloudArrowUp.regular,
          action: TopBannerAction("Resume") {}
        )
      }
    },
    Story("TitleOnly") {
      TopBannerStage { manager in
        manager.show("Copied to clipboard")
      }
    },
  ])
}

private struct TopBannerStage: View {
  var timeout: Duration = .seconds(600)
  var onMount: (@MainActor (TopBannerManager) -> Void)?

  @State private var manager = TopBannerManager()
  @State private var shown = false

  init(timeout: Duration = .seconds(600), onMount: (@MainActor (TopBannerManager) -> Void)? = nil) {
    self.timeout = timeout
    self.onMount = onMount
  }

  var body: some View {
    TopBannerTriggers(manager: manager)
      .frame(maxHeight: .infinity, alignment: .top)
      .containerRelativeFrame(.vertical) { height, _ in height - 32 }
      .topBanner(manager, timeout: timeout)
      .onAppear {
        guard !shown else { return }
        shown = true
        manager.timeout = timeout
        onMount?(manager)
      }
  }
}

private struct TopBannerTriggers: View {
  let manager: TopBannerManager

  @State private var log = ""

  var body: some View {
    VStack(spacing: 12) {
      Button {
        manager.show("Message sent", description: "Alex will see it the next time they open the app.")
      } label: {
        Text("Show banner").frame(maxWidth: .infinity)
      }
      .buttonStyle(.variant(.outline))
      Button {
        manager.show(
          "You are offline",
          description: "Changes will sync when you reconnect.",
          icon: Ph.wifiSlash.regular,
          action: TopBannerAction("Retry") { log = "Retry pressed" }
        )
      } label: {
        Text("Show with icon and action").frame(maxWidth: .infinity)
      }
      .buttonStyle(.variant(.outline))
      Button {
        manager.show("First of three")
        manager.show("Second of three")
        manager.show("Third of three")
      } label: {
        Text("Queue three").frame(maxWidth: .infinity)
      }
      .buttonStyle(.variant(.outline))
      Button {
        manager.dismiss()
      } label: {
        Text("Dismiss current").frame(maxWidth: .infinity)
      }
      .buttonStyle(.variant(.ghost))
      Text(verbatim: log)
        .textStyle(.sm)
        .foregroundStyle(EsuissColor.mutedForeground)
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityAddTraits(.updatesFrequently)
    }
  }
}
