import EsuissUI
import PhosphorSwift
import SwiftUI

enum IslandStories {
  static let group = StoryGroup(.interactions, "Island", stories: [
    Story("Compact", fullScreen: true) {
      IslandStage { IslandDownloads(initial: 0.42) }
    },
    Story("Expanded", fullScreen: true) {
      IslandStage { IslandDownloads(initial: 0.42, start: .expanded) }
    },
    Story("Minimal", fullScreen: true) {
      IslandStage { IslandDownloads(initial: 0.42, start: .minimal) }
    },
    Story("Notice", fullScreen: true) {
      IslandStage { IslandNoticeOnMount() }
    },
    Story("LiveActivity", fullScreen: true) {
      IslandStage { IslandDownloads(withNotifications: true) }
    },
  ])
}

private struct IslandStage<Content: View>: View {
  @ViewBuilder let content: () -> Content

  @State private var controller = IslandController()

  var body: some View {
    IslandProvider(controller: controller) {
      content()
    }
  }
}

private struct IslandNotifyButtons: View {
  var minimize = false

  @Environment(\.island) private var island

  var body: some View {
    FlowRow(spacing: 12) {
      Button("New message") {
        island.notify("Jordan Lee", description: "Are we still on for Saturday?") {
          Ph.chatCircle.fill.foregroundStyle(Color.success)
        }
      }
      .buttonStyle(.variant(.secondary))
      Button("Reminder") {
        island.notify("Design review", description: "Starts in 10 minutes") {
          Ph.bell.fill.foregroundStyle(Color.warning)
        }
      }
      .buttonStyle(.variant(.secondary))
      if minimize {
        Button("Minimize") {
          island.minimize()
        }
        .buttonStyle(.variant(.secondary))
      }
    }
  }
}

private enum IslandStart {
  case expanded, minimal
}

private struct IslandDownloads: View {
  var initial: Double?
  var start: IslandStart?
  var withNotifications = false

  @State private var progress: Double?
  @Environment(\.island) private var island

  init(initial: Double? = nil, start: IslandStart? = nil, withNotifications: Bool = false) {
    self.initial = initial
    self.start = start
    self.withNotifications = withNotifications
    _progress = State(initialValue: initial)
  }

  private var done: Bool { (progress ?? 0) >= 1 }
  private var percent: Int { Int(((progress ?? 0) * 100).rounded()) }

  var body: some View {
    ZStack(alignment: .top) {
      VStack(spacing: 16) {
        Text("Start a download, then tap the pill at the top to see the details. Swipe up on it to close.")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
          .multilineTextAlignment(.center)
          .frame(maxWidth: 320)
        if initial == nil {
          Button {
            progress = 0
          } label: {
            Text(progress == nil ? "Download Design-Kit.zip" : "Downloading…")
          }
          .buttonStyle(.variant())
          .disabled(progress != nil)
        }
        if withNotifications {
          IslandNotifyButtons(minimize: true)
        }
      }
      .padding(16)
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      Island {
        IslandExpandedRegion(.leading) {
          Ph.fileZip.fill
            .frame(width: 24, height: 24)
            .foregroundStyle(Color.accent)
            .frame(width: 40, height: 40)
            .background(Color.onMedia.opacity(0.15), in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
            .accessibilityHidden(true)
        }
        IslandExpandedRegion(.trailing) {
          Text(verbatim: "\(percent)%")
            .textStyle(.xl2, weight: .semibold)
            .monospacedDigit()
            .frame(height: 40)
        }
        IslandExpandedRegion(.center) {
          VStack(spacing: 0) {
            Text(done ? "Downloaded" : "Downloading")
              .textStyle(.sm, weight: .semibold)
            Text(verbatim: "Design-Kit.zip")
              .textStyle(.sm)
              .foregroundStyle(Color.labelSecondary)
          }
          .lineLimit(1)
        }
        IslandExpandedRegion(.bottom) {
          IslandProgressBar(progress: progress ?? 0, percent: percent)
          Button {
            progress = nil
          } label: {
            Text("Cancel download")
              .textStyle(.sm, weight: .semibold)
              .frame(maxWidth: .infinity)
              .frame(height: 44)
              .background(Color.onMedia.opacity(0.15), in: Capsule())
          }
          .buttonStyle(.plain)
          .disabled(done)
          .opacity(done ? 0.5 : 1)
        }
      } compactLeading: {
        if progress != nil {
          Ph.downloadSimple.bold
            .frame(width: 16, height: 16)
            .foregroundStyle(Color.accent)
            .accessibilityLabel(Text(verbatim: "Downloading Design-Kit.zip, \(percent)%"))
        }
      } compactTrailing: {
        if progress != nil {
          if done {
            Ph.checkCircle.fill
              .frame(width: 16, height: 16)
              .foregroundStyle(Color.success)
          } else {
            IslandRing(value: progress ?? 0)
          }
        }
      } minimal: {
        IslandRing(value: progress ?? 0)
          .accessibilityLabel(Text(verbatim: "Downloading Design-Kit.zip, \(percent)%"))
      }
    }
    .task {
      guard let start else { return }
      try? await Task.sleep(for: .milliseconds(300))
      switch start {
      case .expanded: island.expand()
      case .minimal: island.minimize()
      }
    }
    .task(id: progress) {
      guard initial == nil, let value = progress else { return }
      if value < 1 {
        try? await Task.sleep(for: .milliseconds(150))
        guard !Task.isCancelled else { return }
        progress = min(value + 0.01, 1)
      } else {
        try? await Task.sleep(for: .milliseconds(1200))
        guard !Task.isCancelled else { return }
        progress = nil
        island.notify("Download complete", description: "Design-Kit.zip") {
          Ph.checkCircle.fill.foregroundStyle(Color.success)
        }
      }
    }
  }
}

private struct IslandProgressBar: View {
  let progress: Double
  let percent: Int

  var body: some View {
    Capsule()
      .fill(Color.onMedia.opacity(0.2))
      .frame(height: 6)
      .overlay(alignment: .leading) {
        GeometryReader { proxy in
          Capsule()
            .fill(Color.accent)
            .frame(width: proxy.size.width * min(max(progress, 0), 1))
        }
      }
      .clipShape(Capsule())
      .accessibilityElement()
      .accessibilityLabel(Text("Download progress"))
      .accessibilityValue(Text(verbatim: "\(percent)%"))
  }
}

private struct IslandNoticeOnMount: View {
  @Environment(\.island) private var island
  @State private var shown = false

  var body: some View {
    ZStack(alignment: .top) {
      VStack(spacing: 16) {
        Text("The pill grows to show the notification and shrinks back on its own.")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
          .multilineTextAlignment(.center)
          .frame(maxWidth: 320)
        IslandNotifyButtons()
      }
      .padding(16)
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      Island()
    }
    .onAppear {
      guard !shown else { return }
      shown = true
      island.notify("Jordan Lee", description: "Are we still on for Saturday?", duration: .seconds(600)) {
        Ph.chatCircle.fill.foregroundStyle(Color.success)
      }
    }
  }
}
