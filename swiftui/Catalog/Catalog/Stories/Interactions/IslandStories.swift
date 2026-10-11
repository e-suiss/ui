import EsuissUI
import PhosphorSwift
import SwiftUI

enum IslandStories {
  static let group = StoryGroup(.interactions, "Island", stories: [
    Story("Compact", fullScreen: true) {
      IslandStage { IslandDownloads(initial: 0.42) }
    },
    Story("Expanded", fullScreen: true) {
      IslandStage { IslandDownloads(initial: 0.42, expanded: true) }
    },
    Story("Notice", fullScreen: true) {
      IslandStage { IslandNoticeOnMount() }
    },
    Story("LiveActivity", fullScreen: true) {
      IslandStage { IslandDownloads(withNotifications: true) }
    },
  ])
}

private let islandSize = 120

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
    }
  }
}

private struct IslandDownloads: View {
  var initial: Double?
  var expanded = false
  var withNotifications = false

  @State private var progress: Double?
  @Environment(\.island) private var island

  init(initial: Double? = nil, expanded: Bool = false, withNotifications: Bool = false) {
    self.initial = initial
    self.expanded = expanded
    self.withNotifications = withNotifications
    _progress = State(initialValue: initial)
  }

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
          IslandNotifyButtons()
        }
      }
      .padding(16)
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      Island {
        if let progress {
          IslandDownloadActivity(progress: progress) {
            self.progress = nil
          }
        }
      }
    }
    .task {
      guard expanded else { return }
      try? await Task.sleep(for: .milliseconds(300))
      island.setExpanded(true)
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

private struct IslandDownloadActivity: View {
  let progress: Double
  let onCancel: () -> Void

  private var done: Bool { progress >= 1 }
  private var percent: Int { Int((progress * 100).rounded()) }

  var body: some View {
    IslandCompact {
      Ph.downloadSimple.bold
        .frame(width: 16, height: 16)
        .foregroundStyle(Color.accent)
      if done {
        Ph.checkCircle.fill
          .frame(width: 16, height: 16)
          .foregroundStyle(Color.success)
      } else {
        IslandRing(value: progress)
      }
    }
    .accessibilityLabel(Text(verbatim: "Downloading Design-Kit.zip, \(percent)%"))
    IslandExpanded {
      HStack(spacing: 12) {
        Ph.fileZip.fill
          .frame(width: 24, height: 24)
          .foregroundStyle(Color.accent)
          .frame(width: 40, height: 40)
          .background(Color.label.opacity(0.15), in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
        VStack(alignment: .leading, spacing: 0) {
          Text(verbatim: "Design-Kit.zip")
            .textStyle(.sm, weight: .semibold)
            .lineLimit(1)
          Text(verbatim: done ? "Downloaded" : "\(Int((progress * Double(islandSize)).rounded())) MB of \(islandSize) MB")
            .textStyle(.sm)
            .foregroundStyle(Color.labelSecondary)
            .monospacedDigit()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        Text(verbatim: "\(percent)%")
          .textStyle(.xl2, weight: .semibold)
          .monospacedDigit()
      }
      Capsule()
        .fill(Color.label.opacity(0.2))
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
      Button(action: onCancel) {
        Text("Cancel download")
          .textStyle(.sm, weight: .semibold)
          .frame(maxWidth: .infinity)
          .frame(height: 44)
          .background(Color.label.opacity(0.15), in: Capsule())
      }
      .buttonStyle(.plain)
      .disabled(done)
      .opacity(done ? 0.5 : 1)
    }
    .accessibilityLabel(Text("Download"))
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
      Island {}
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
