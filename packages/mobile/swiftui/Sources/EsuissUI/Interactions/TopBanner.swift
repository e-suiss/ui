import Observation
import PhosphorSwift
import SwiftUI

public struct TopBannerAction: Sendable {
  public let title: LocalizedStringResource
  public let action: @MainActor @Sendable () -> Void

  public init(_ title: LocalizedStringResource, action: @escaping @MainActor @Sendable () -> Void) {
    self.title = title
    self.action = action
  }
}

public struct TopBannerItem: Identifiable, @unchecked Sendable {
  public let id: UUID
  public let title: LocalizedStringResource
  public let description: LocalizedStringResource?
  public let icon: Image?
  public let action: TopBannerAction?
  public let duration: Duration?
}

@Observable
public final class TopBannerManager: @unchecked Sendable {
  public static let shared = TopBannerManager()

  public private(set) var queue: [TopBannerItem] = []
  public var timeout: Duration = .seconds(4)

  @ObservationIgnored private var timer: Task<Void, Never>?
  @ObservationIgnored private var scheduled: UUID?

  public init() {}

  public var current: TopBannerItem? { queue.first }

  @MainActor @discardableResult
  public func show(
    _ title: LocalizedStringResource,
    description: LocalizedStringResource? = nil,
    icon: Image? = nil,
    action: TopBannerAction? = nil,
    duration: Duration? = nil
  ) -> UUID {
    let item = TopBannerItem(
      id: UUID(),
      title: title,
      description: description,
      icon: icon,
      action: action,
      duration: duration
    )
    queue.append(item)
    advance()
    return item.id
  }

  @MainActor
  public func dismiss(_ id: UUID? = nil) {
    guard let target = id ?? queue.first?.id else { return }
    queue.removeAll { $0.id == target }
    advance()
  }

  @MainActor
  public func dismissAll() {
    queue.removeAll()
    advance()
  }

  @MainActor
  private func advance() {
    guard let item = queue.first else {
      timer?.cancel()
      timer = nil
      scheduled = nil
      return
    }
    guard scheduled != item.id else { return }
    timer?.cancel()
    scheduled = item.id
    let title = String(localized: item.title)
    let detail = item.description.map { String(localized: $0) }
    AccessibilityNotification.Announcement([title, detail].compactMap { $0 }.joined(separator: ". ")).post()
    let wait = item.duration ?? timeout
    timer = Task { @MainActor [weak self] in
      try? await Task.sleep(for: wait)
      guard !Task.isCancelled, let self, self.queue.first?.id == item.id else { return }
      self.dismiss(item.id)
    }
  }
}

extension EnvironmentValues {
  @Entry public var topBannerManager: TopBannerManager = .shared
}

extension View {
  public func topBanner(_ manager: TopBannerManager = .shared, timeout: Duration = .seconds(4)) -> some View {
    overlay(alignment: .top) {
      TopBannerRegion(manager: manager)
    }
    .environment(\.topBannerManager, manager)
    .onAppear { manager.timeout = timeout }
    .onChange(of: timeout) { _, value in manager.timeout = value }
  }
}

struct TopBannerRegion: View {
  let manager: TopBannerManager

  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    ZStack(alignment: .top) {
      if let item = manager.current {
        TopBannerCard(item: item) { manager.dismiss(item.id) }
          .id(item.id)
          .transition(reduceMotion ? .opacity : .move(edge: .top).combined(with: .opacity))
      }
    }
    .animation(reduceMotion ? .linear(duration: 0.2) : .timingCurve(0.32, 0.72, 0, 1, duration: 0.4), value: manager.current?.id)
  }
}

struct TopBannerCard: View {
  let item: TopBannerItem
  let onDismiss: () -> Void

  @State private var drag: CGFloat = 0
  @Environment(\.colorScheme) private var colorScheme

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    let dark = colorScheme == .dark
    HStack(spacing: 12) {
      if let icon = item.icon {
        icon
          .frame(width: 20, height: 20)
          .foregroundStyle(Color.link)
          .frame(width: 36, height: 36)
          .background(Color.accentSurface, in: Circle())
          .accessibilityHidden(true)
      }
      VStack(alignment: .leading, spacing: 2) {
        Text(item.title)
          .scaledFont(.sm, weight: .semibold)
          .foregroundStyle(Color.label)
        if let description = item.description {
          Text(description)
            .scaledFont(.sm)
            .foregroundStyle(Color.labelSecondary)
            .lineLimit(3)
        }
      }
      .lineLimit(2)
      .fixedSize(horizontal: false, vertical: true)
      .frame(maxWidth: .infinity, alignment: .leading)
      if let action = item.action {
        Button {
          action.action()
          onDismiss()
        } label: {
          Text(action.title)
        }
        .buttonStyle(.variant(.tinted, size: .sm))
      }
    }
    .padding(.horizontal, 14)
    .padding(.vertical, 12)
    .frame(maxWidth: 512)
    .background {
      shape
        .fill(Color.surfaceRaised)
        .shadow(dark ? .lg : Shadow(color: .black.opacity(0.14), radius: 16, y: 8))
    }
    .overlay {
      if !dark { shape.strokeBorder(Color.label.opacity(0.05)) }
    }
    .padding(.horizontal, 12)
    .padding(.top, 4)
    .offset(y: min(drag, 0) + max(drag, 0) / 6)
    .gesture(
      DragGesture(minimumDistance: 8)
        .onChanged { value in
          drag = value.translation.height
        }
        .onEnded { value in
          if drag < -24 || value.predictedEndTranslation.height < -80 {
            onDismiss()
          } else {
            withAnimation(.spring(duration: 0.3)) { drag = 0 }
          }
        }
    )
    .accessibilityElement(children: .contain)
    .accessibilityAction(.escape, onDismiss)
    .accessibilityAction(named: Text("Dismiss"), onDismiss)
  }
}
