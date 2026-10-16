import Observation
import PhosphorSwift
import SwiftUI

public enum ToastType: CaseIterable, Sendable {
  case `default`, success, info, warning, error, loading
}

public struct ToastAction: Sendable {
  public let title: LocalizedStringResource
  public let action: @MainActor @Sendable () -> Void

  public init(_ title: LocalizedStringResource, action: @escaping @MainActor @Sendable () -> Void) {
    self.title = title
    self.action = action
  }
}

public struct ToastItem: Identifiable, Sendable {
  public let id: UUID
  public var type: ToastType
  public var title: LocalizedStringResource
  public var description: LocalizedStringResource?
  public var action: ToastAction?
  public var duration: Duration?
}

@MainActor @Observable
public final class ToastManager {
  public nonisolated static let shared = ToastManager()

  public private(set) var toasts: [ToastItem] = []
  public var limit = 3

  @ObservationIgnored private var timers: [UUID: Task<Void, Never>] = [:]

  public nonisolated init() {}

  @discardableResult
  public func show(
    _ title: LocalizedStringResource,
    description: LocalizedStringResource? = nil,
    type: ToastType = .default,
    action: ToastAction? = nil,
    duration: Duration? = .seconds(5)
  ) -> UUID {
    let item = ToastItem(
      id: UUID(),
      type: type,
      title: title,
      description: description,
      action: action,
      duration: type == .loading ? nil : duration
    )
    toasts.append(item)
    schedule(item)
    announce(item)
    return item.id
  }

  @discardableResult
  public func success(_ title: LocalizedStringResource, description: LocalizedStringResource? = nil, action: ToastAction? = nil) -> UUID {
    show(title, description: description, type: .success, action: action)
  }

  @discardableResult
  public func info(_ title: LocalizedStringResource, description: LocalizedStringResource? = nil, action: ToastAction? = nil) -> UUID {
    show(title, description: description, type: .info, action: action)
  }

  @discardableResult
  public func warning(_ title: LocalizedStringResource, description: LocalizedStringResource? = nil, action: ToastAction? = nil) -> UUID {
    show(title, description: description, type: .warning, action: action)
  }

  @discardableResult
  public func error(_ title: LocalizedStringResource, description: LocalizedStringResource? = nil, action: ToastAction? = nil) -> UUID {
    show(title, description: description, type: .error, action: action)
  }

  @discardableResult
  public func loading(_ title: LocalizedStringResource, description: LocalizedStringResource? = nil) -> UUID {
    show(title, description: description, type: .loading)
  }

  public func update(
    _ id: UUID,
    title: LocalizedStringResource? = nil,
    description: LocalizedStringResource? = nil,
    type: ToastType? = nil,
    duration: Duration? = .seconds(5)
  ) {
    guard let index = toasts.firstIndex(where: { $0.id == id }) else { return }
    if let title { toasts[index].title = title }
    if let description { toasts[index].description = description }
    if let type { toasts[index].type = type }
    toasts[index].duration = toasts[index].type == .loading ? nil : duration
    schedule(toasts[index])
    announce(toasts[index])
  }

  public func dismiss(_ id: UUID) {
    timers[id]?.cancel()
    timers[id] = nil
    toasts.removeAll { $0.id == id }
  }

  public func dismissAll() {
    timers.values.forEach { $0.cancel() }
    timers.removeAll()
    toasts.removeAll()
  }

  private func schedule(_ item: ToastItem) {
    timers[item.id]?.cancel()
    guard let duration = item.duration else {
      timers[item.id] = nil
      return
    }
    let id = item.id
    timers[id] = Task { @MainActor [weak self] in
      try? await Task.sleep(for: duration)
      guard !Task.isCancelled else { return }
      withAnimation(.easeOut(duration: 0.25)) { self?.dismiss(id) }
    }
  }

  private func announce(_ item: ToastItem) {
    var text = String(localized: item.title)
    if let description = item.description {
      text += ". " + String(localized: description)
    }
    AccessibilityNotification.Announcement(text).post()
  }
}

extension EnvironmentValues {
  @Entry public var toastManager: ToastManager = .shared
}

extension View {
  public func toaster(_ manager: ToastManager = .shared) -> some View {
    overlay(alignment: .bottom) {
      ToastStack(manager: manager)
    }
    .environment(\.toastManager, manager)
  }
}

struct ToastStack: View {
  let manager: ToastManager

  @State private var expanded = false
  @State private var heights: [UUID: CGFloat] = [:]
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    let ordered = Array(manager.toasts.reversed())
    let front = ordered.first.flatMap { heights[$0.id] } ?? 0
    GeometryReader { proxy in
      let inset = max(16, (proxy.size.width - 384) / 2)
      ZStack(alignment: .bottom) {
        ForEach(Array(ordered.enumerated()), id: \.element.id) { index, item in
          let scale = expanded ? 1 : max(0, 1 - CGFloat(index) * 0.1)
          let offset = expanded
            ? -(ordered.prefix(index).reduce(0) { $0 + (heights[$1.id] ?? 0) } + CGFloat(index) * 12)
            : -(CGFloat(index) * 12) - (1 - scale) * front
          let behind = !expanded && index > 0
          ToastCard(item: item, behind: behind) {
            withAnimation(.easeOut(duration: 0.25)) { manager.dismiss(item.id) }
          }
          .onGeometryChange(for: CGFloat.self) { $0.size.height } action: { value in
            if !behind { heights[item.id] = value }
          }
          .frame(height: behind && front > 0 ? front : nil, alignment: .top)
          .clipped()
          .scaleEffect(scale, anchor: .bottom)
          .offset(y: offset)
          .opacity(index >= manager.limit ? 0 : 1)
          .allowsHitTesting(index < manager.limit)
          .accessibilityHidden(index >= manager.limit)
          .zIndex(Double(-index))
          .transition(reduceMotion ? .opacity : .move(edge: .bottom).combined(with: .opacity))
        }
      }
      .padding(.horizontal, inset)
      .padding(.bottom, 16)
      .frame(width: proxy.size.width, height: proxy.size.height, alignment: .bottom)
    }
    .frame(height: stackHeight(ordered: ordered, front: front))
    .animation(reduceMotion ? .linear(duration: 0.2) : .smooth(duration: 0.45), value: manager.toasts.map(\.id))
    .animation(reduceMotion ? .linear(duration: 0.2) : .smooth(duration: 0.45), value: expanded)
    .contentShape(Rectangle())
    .onTapGesture {
      if ordered.count > 1 { expanded.toggle() }
    }
    .onChange(of: manager.toasts.count) { _, count in
      if count < 2 { expanded = false }
    }
  }

  private func stackHeight(ordered: [ToastItem], front: CGFloat) -> CGFloat {
    guard !ordered.isEmpty else { return 0 }
    let shown = ordered.prefix(manager.limit)
    if expanded {
      return shown.reduce(0) { $0 + (heights[$1.id] ?? 0) } + CGFloat(shown.count - 1) * 12 + 16
    }
    return front + CGFloat(shown.count - 1) * 12 + 16
  }
}

struct ToastCard: View {
  let item: ToastItem
  var behind = false
  let onDismiss: () -> Void

  @State private var drag: CGFloat = 0
  @Environment(\.colorScheme) private var colorScheme

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
    let dark = colorScheme == .dark
    HStack(spacing: 12) {
      ToastIcon(type: item.type)
      VStack(alignment: .leading, spacing: 4) {
        Text(item.title)
          .scaledFont(TextStyle.sm, weight: .semibold)
          .foregroundStyle(EsuissColor.foreground)
        if let description = item.description {
          Text(description)
            .scaledFont(TextStyle.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
      }
      .fixedSize(horizontal: false, vertical: true)
      .frame(maxWidth: .infinity, alignment: .leading)
      if let action = item.action {
        Button {
          action.action()
          onDismiss()
        } label: {
          Text(action.title)
        }
        .buttonStyle(.variant(.outline, size: .sm))
      }
      Button(action: onDismiss) {
        Ph.x.regular
          .frame(width: 16, height: 16)
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      .buttonStyle(.variant(.ghost, size: .iconSm))
      .accessibilityLabel(Text("Close toast"))
    }
    .padding(16)
    .opacity(behind ? 0 : 1)
    .frame(maxWidth: .infinity)
    .background {
      shape
        .fill(EsuissColor.popover)
        .shadow(dark ? .lg : Shadow(color: .black.opacity(0.14), radius: 16, y: 8))
    }
    .overlay {
      if !dark { shape.strokeBorder(EsuissColor.foreground.opacity(0.05)) }
    }
    .offset(y: drag)
    .gesture(
      DragGesture(minimumDistance: 8)
        .onChanged { value in
          drag = max(0, value.translation.height)
        }
        .onEnded { value in
          if drag > 48 || value.predictedEndTranslation.height > 160 {
            onDismiss()
          } else {
            withAnimation(.spring(duration: 0.3)) { drag = 0 }
          }
        }
    )
    .accessibilityElement(children: .contain)
    .accessibilityHidden(behind)
    .accessibilityAction(.escape, onDismiss)
  }
}

private struct ToastIcon: View {
  let type: ToastType

  var body: some View {
    switch type {
    case .default:
      EmptyView()
    case .loading:
      ProgressView()
        .tint(EsuissColor.primary)
        .frame(width: 32, height: 32)
        .accessibilityHidden(true)
    case .success, .info, .warning, .error:
      icon
        .frame(width: 16, height: 16)
        .rotationEffect(.degrees(type == .info ? 180 : 0))
        .foregroundStyle(EsuissColor.background)
        .frame(width: 32, height: 32)
        .background(tint, in: Circle())
        .accessibilityHidden(true)
    }
  }

  private var icon: Image {
    switch type {
    case .success: Ph.check.bold
    case .error: Ph.x.bold
    default: Ph.exclamationMark.bold
    }
  }

  private var tint: Color {
    switch type {
    case .success: Color.adaptive(light: Palette.green600, dark: Palette.green400)
    case .info: EsuissColor.primary
    case .warning: Color.adaptive(light: Palette.amber600, dark: Palette.amber400)
    default: EsuissColor.destructive
    }
  }
}
