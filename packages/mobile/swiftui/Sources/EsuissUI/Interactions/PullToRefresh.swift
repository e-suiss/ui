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
        .tint(EsuissColor.primary)
    }
    .pullToRefresh(onRefresh)
    .tint(EsuissColor.mutedForeground)
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

private struct PullToRefreshModifier: ViewModifier {
  let action: @MainActor @Sendable () async -> Void

  @State private var triggers = 0

  func body(content: Content) -> some View {
    let action = action
    let triggers = $triggers
    content
      .refreshable { @MainActor in
        triggers.wrappedValue += 1
        await PullToRefreshTiming.run(action)
      }
      .hapticFeedback(.impact(weight: .light), trigger: triggers.wrappedValue)
  }
}

extension View {
  public func pullToRefresh(_ action: @escaping @MainActor @Sendable () async -> Void) -> some View {
    modifier(PullToRefreshModifier(action: action))
  }
}
