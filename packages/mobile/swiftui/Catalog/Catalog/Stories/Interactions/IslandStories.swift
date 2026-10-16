import ActivityKit
import EsuissUI
import SwiftUI

enum IslandStories {
  static let group = StoryGroup(.interactions, "Island", stories: [
    Story("LiveActivity") {
      IslandLiveActivity()
    },
  ])
}

private struct IslandLiveActivity: View {
  @State private var activity: Activity<DownloadActivityAttributes>?
  @State private var state = DownloadActivityAttributes.ContentState(progress: 0, fileName: "Design-Kit.zip", finished: false)
  @State private var failure: String?

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Text("Start a download, then leave the app. The activity shows in the Dynamic Island and on the Lock Screen.")
        .textStyle(.sm)
        .foregroundStyle(EsuissColor.mutedForeground)
      FlowRow(spacing: 12) {
        Button("Start") { start() }
          .buttonStyle(.variant())
          .disabled(activity != nil)
        Button("Update (+10%)") { advance() }
          .buttonStyle(.variant(.secondary))
          .disabled(activity == nil || state.finished)
        Button("Finish") { finish() }
          .buttonStyle(.variant(.secondary))
          .disabled(activity == nil || state.finished)
        Button("End") { end() }
          .buttonStyle(.variant(.destructive))
          .disabled(activity == nil)
      }
      Text(verbatim: activity == nil ? "No activity" : "\(state.fileName) · \(state.percent)%")
        .textStyle(.sm, weight: .semibold)
        .monospacedDigit()
      if let failure {
        Text(verbatim: failure)
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.destructive)
      }
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .task {
      activity = Activity<DownloadActivityAttributes>.activities.first
      if let current = activity?.content.state { state = current }
    }
  }

  private func start() {
    guard ActivityAuthorizationInfo().areActivitiesEnabled else {
      failure = "Live Activities are turned off for this app."
      return
    }
    let next = DownloadActivityAttributes.ContentState(progress: 0, fileName: "Design-Kit.zip", finished: false)
    do {
      activity = try Activity.request(
        attributes: DownloadActivityAttributes(),
        content: ActivityContent(state: next, staleDate: nil)
      )
      state = next
      failure = nil
    } catch {
      failure = error.localizedDescription
    }
  }

  private func advance() {
    state.progress = min(state.progress + 0.1, 1)
    state.finished = state.progress >= 1
    push()
  }

  private func finish() {
    state.progress = 1
    state.finished = true
    push()
  }

  private func push() {
    guard let id = activity?.id else { return }
    let next = state
    Task { await Self.send(next, to: id, ending: false) }
  }

  private func end() {
    guard let id = activity?.id else { return }
    let next = state
    activity = nil
    Task { await Self.send(next, to: id, ending: true) }
  }

  private nonisolated static func send(_ state: DownloadActivityAttributes.ContentState, to id: String, ending: Bool) async {
    guard let activity = Activity<DownloadActivityAttributes>.activities.first(where: { $0.id == id }) else { return }
    let content = ActivityContent(state: state, staleDate: nil)
    if ending {
      await activity.end(content, dismissalPolicy: .immediate)
    } else {
      await activity.update(content)
    }
  }
}
