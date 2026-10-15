import Observation
import SwiftUI

public struct UndoBarEntry: Identifiable, Sendable {
  public let id: UUID
  public let title: LocalizedStringResource
  public let actionLabel: LocalizedStringResource?
  let onUndo: @MainActor @Sendable () -> Void
  let onCommit: (@MainActor @Sendable () -> Void)?
}

@Observable
public final class UndoBarManager: @unchecked Sendable {
  public static let shared = UndoBarManager()

  public private(set) var entry: UndoBarEntry?
  public var timeout: Duration = .seconds(5)
  private(set) var paused = false

  @ObservationIgnored private var started = Date()
  @ObservationIgnored private var elapsed: TimeInterval = 0
  @ObservationIgnored private var timer: Task<Void, Never>?

  public init() {}

  @MainActor
  public func show(
    _ title: LocalizedStringResource,
    actionLabel: LocalizedStringResource? = nil,
    onUndo: @escaping @MainActor @Sendable () -> Void,
    onCommit: (@MainActor @Sendable () -> Void)? = nil
  ) {
    let previous = entry
    entry = UndoBarEntry(id: UUID(), title: title, actionLabel: actionLabel, onUndo: onUndo, onCommit: onCommit)
    previous?.onCommit?()
    elapsed = 0
    started = Date()
    if !paused { schedule() }
    AccessibilityNotification.Announcement(String(localized: title)).post()
  }

  @MainActor
  public func undo() {
    settle(undo: true)
  }

  @MainActor
  public func dismiss() {
    settle(undo: false)
  }

  @MainActor
  func pause() {
    guard !paused else { return }
    paused = true
    elapsed += Date().timeIntervalSince(started)
    timer?.cancel()
    timer = nil
  }

  @MainActor
  func resume() {
    guard paused else { return }
    paused = false
    started = Date()
    if entry != nil { schedule() }
  }

  func progress(at date: Date) -> Double {
    let total = Double(timeout.components.seconds) + Double(timeout.components.attoseconds) / 1e18
    guard total > 0 else { return 1 }
    let spent = elapsed + (paused ? 0 : date.timeIntervalSince(started))
    return min(max(spent / total, 0), 1)
  }

  @MainActor
  private func settle(undo: Bool) {
    guard let current = entry else { return }
    timer?.cancel()
    timer = nil
    entry = nil
    if undo {
      current.onUndo()
    } else {
      current.onCommit?()
    }
  }

  @MainActor
  private func schedule() {
    timer?.cancel()
    guard let id = entry?.id else { return }
    let remaining = timeout - .milliseconds(Int(elapsed * 1000))
    timer = Task { @MainActor [weak self] in
      try? await Task.sleep(for: max(remaining, .zero))
      guard !Task.isCancelled, let self, self.entry?.id == id else { return }
      self.dismiss()
    }
  }
}

extension EnvironmentValues {
  @Entry public var undoBarManager: UndoBarManager = .shared
}

extension View {
  public func undoBar(_ manager: UndoBarManager = .shared, timeout: Duration = .seconds(5)) -> some View {
    overlay(alignment: .bottom) {
      UndoBarRegion(manager: manager)
    }
    .environment(\.undoBarManager, manager)
    .onAppear { manager.timeout = timeout }
    .onChange(of: timeout) { _, value in manager.timeout = value }
  }
}

struct UndoBarRegion: View {
  let manager: UndoBarManager

  @Environment(\.scenePhase) private var scenePhase
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    ZStack(alignment: .bottom) {
      if let entry = manager.entry {
        UndoBarView(manager: manager, entry: entry)
          .id(entry.id)
          .transition(
            reduceMotion
              ? .opacity
              : .asymmetric(
                insertion: .offset(y: 68).combined(with: .scale(scale: 0.95, anchor: .bottom)).combined(with: .opacity),
                removal: .offset(y: 68).combined(with: .scale(scale: 0.95, anchor: .bottom)).combined(with: .opacity)
              )
          )
      }
    }
    .animation(.timingCurve(0.32, 0.72, 0, 1, duration: 0.4), value: manager.entry?.id)
    .onChange(of: scenePhase, initial: true) { _, phase in
      if phase == .active {
        manager.resume()
      } else {
        manager.pause()
      }
    }
  }
}

struct UndoBarView: View {
  let manager: UndoBarManager
  let entry: UndoBarEntry

  var body: some View {
    FloatingBar(visible: true, maxWidth: 384) {
      HStack(spacing: 12) {
        TimelineView(.animation(minimumInterval: nil, paused: manager.paused)) { context in
          UndoBarRing(progress: manager.progress(at: context.date))
        }
        Text(entry.title)
          .scaledFont(.sm, weight: .medium)
          .lineLimit(1)
          .truncationMode(.tail)
          .frame(maxWidth: .infinity, alignment: .leading)
        Button {
          manager.undo()
        } label: {
          Text(entry.actionLabel ?? "Undo").fontWeight(.semibold)
        }
        .buttonStyle(VariantButtonStyle(.plain, size: .lg, metrics: ButtonMetrics(horizontalPadding: 16, spacing: 6, iconSize: 16, textStyle: .base)))
      }
      .padding(.leading, 16)
      .padding(.trailing, 4)
    }
    .accessibilityElement(children: .contain)
    .accessibilityAction(.escape) { manager.dismiss() }
  }
}

struct UndoBarRing: View {
  let progress: Double

  var body: some View {
    ZStack {
      Circle()
        .stroke(EsuissColor.border, lineWidth: 2)
      Circle()
        .trim(from: 0, to: 1 - progress)
        .stroke(EsuissColor.mutedForeground, style: StrokeStyle(lineWidth: 2, lineCap: .round))
        .rotationEffect(.degrees(-90))
    }
    .frame(width: 16, height: 16)
    .frame(width: 20, height: 20)
    .accessibilityHidden(true)
  }
}
