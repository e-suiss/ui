import SwiftUI

public struct PullToRefresh<Content: View>: View {
  let onRefresh: @MainActor @Sendable () async -> Void
  let content: Content

  @State private var refreshing = false

  public init(
    onRefresh: @escaping @MainActor @Sendable () async -> Void,
    @ViewBuilder content: () -> Content
  ) {
    self.onRefresh = onRefresh
    self.content = content()
  }

  public var body: some View {
    let onRefresh = onRefresh
    ScrollView {
      content
        .frame(maxWidth: .infinity, alignment: .top)
        .tint(Color.accent)
    }
    .pullToRefresh(onRefresh)
    .tint(Color.labelSecondary)
    .accessibilityAction(named: Text("Refresh")) {
      guard !refreshing else { return }
      refreshing = true
      Task { @MainActor in
        await PullToRefreshTiming.run(onRefresh)
        refreshing = false
      }
    }
  }
}

enum PullToRefreshTiming {
  static let minimum: Duration = .milliseconds(600)

  @MainActor
  static func run(_ action: @MainActor @Sendable () async -> Void) async {
    let clock = ContinuousClock()
    let started = clock.now
    await action()
    let elapsed = clock.now - started
    if elapsed < minimum {
      try? await Task.sleep(for: minimum - elapsed)
    }
  }
}

extension View {
  public func pullToRefresh(_ action: @escaping @MainActor @Sendable () async -> Void) -> some View {
    refreshable {
      await PullToRefreshTiming.run(action)
    }
  }
}
