import Observation
import SwiftUI

public enum IslandView: CaseIterable, Sendable {
  case hidden, compact, expanded, notice
}

public struct IslandNotice: Identifiable, @unchecked Sendable {
  public let id: UUID
  public let title: LocalizedStringResource
  public let description: LocalizedStringResource?
  public let icon: AnyView?
  public let duration: Duration?
}

enum IslandMath {
  static let noticeDuration: Duration = .seconds(4)
  static let hiddenSize = CGSize(width: 126, height: 36)
  static let maxWidth: CGFloat = 384

  static func view(notice: Bool, expanded: Bool, compactCount: Int) -> IslandView {
    if notice { return .notice }
    if compactCount <= 0 { return .hidden }
    return expanded ? .expanded : .compact
  }

  static func swipeCloses(translation: CGFloat, predicted: CGFloat) -> Bool {
    translation < -16 || predicted < -60
  }

  static func ringProgress(_ value: Double) -> Double {
    min(max(value, 0), 1)
  }
}

@Observable
public final class IslandController: @unchecked Sendable {
  public static let shared = IslandController()

  public private(set) var notice: IslandNotice?
  public private(set) var isExpanded = false
  public private(set) var compactCount = 0

  @ObservationIgnored private var timer: Task<Void, Never>?

  public init() {}

  public var view: IslandView {
    IslandMath.view(notice: notice != nil, expanded: isExpanded, compactCount: compactCount)
  }

  @MainActor
  public func setExpanded(_ expanded: Bool) {
    isExpanded = expanded && compactCount > 0
  }

  @MainActor
  public func notify(
    _ title: LocalizedStringResource,
    description: LocalizedStringResource? = nil,
    duration: Duration? = nil
  ) {
    present(IslandNotice(id: UUID(), title: title, description: description, icon: nil, duration: duration))
  }

  @MainActor
  public func notify<Icon: View>(
    _ title: LocalizedStringResource,
    description: LocalizedStringResource? = nil,
    duration: Duration? = nil,
    @ViewBuilder icon: () -> Icon
  ) {
    present(IslandNotice(id: UUID(), title: title, description: description, icon: AnyView(icon()), duration: duration))
  }

  @MainActor
  public func dismiss() {
    timer?.cancel()
    timer = nil
    notice = nil
  }

  @MainActor
  func registerCompact() {
    compactCount += 1
  }

  @MainActor
  func unregisterCompact() {
    compactCount = max(compactCount - 1, 0)
    isExpanded = false
  }

  @MainActor
  private func present(_ next: IslandNotice) {
    timer?.cancel()
    notice = next
    let detail = next.description.map { String(localized: $0) }
    AccessibilityNotification.Announcement([String(localized: next.title), detail].compactMap { $0 }.joined(separator: ". ")).post()
    let wait = next.duration ?? IslandMath.noticeDuration
    timer = Task { @MainActor [weak self] in
      try? await Task.sleep(for: wait)
      guard !Task.isCancelled, let self, self.notice?.id == next.id else { return }
      self.dismiss()
    }
  }
}

extension EnvironmentValues {
  @Entry public var island: IslandController = .shared
}

public struct IslandProvider<Content: View>: View {
  let controller: IslandController
  let content: Content

  public init(controller: IslandController = .shared, @ViewBuilder content: () -> Content) {
    self.controller = controller
    self.content = content()
  }

  public var body: some View {
    content.environment(\.island, controller)
  }
}

public struct Island<Content: View>: View {
  let content: Content

  @Environment(\.island) private var island
  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    let view = island.view
    let dark = colorScheme == .dark
    let radius: CGFloat = view == .compact || view == .hidden ? 18 : 28
    let shape = RoundedRectangle(cornerRadius: radius, style: .continuous)
    let controller = island
    ZStack(alignment: .top) {
      if view == .expanded {
        Color.clear
          .contentShape(Rectangle())
          .onTapGesture { controller.setExpanded(false) }
          .accessibilityHidden(true)
      }
      ZStack(alignment: .top) {
        content
        IslandNoticePart(notice: island.notice, active: view == .notice) {
          controller.dismiss()
        }
      }
      .environment(\.colorScheme, .dark)
      .frame(
        minWidth: view == .hidden ? IslandMath.hiddenSize.width : nil,
        minHeight: view == .hidden ? IslandMath.hiddenSize.height : nil
      )
      .background(dark ? Color.surface : .label, in: shape)
      .overlay {
        if dark { shape.strokeBorder(Color.separator, lineWidth: 1) }
      }
      .clipShape(shape)
      .shadow(.lg)
      .scaleEffect(view == .hidden ? 0.75 : 1)
      .opacity(view == .hidden ? 0 : 1)
      .allowsHitTesting(view != .hidden)
      .accessibilityHidden(view == .hidden)
      .simultaneousGesture(
        DragGesture(minimumDistance: 12)
          .onEnded { value in
            guard IslandMath.swipeCloses(translation: value.translation.height, predicted: value.predictedEndTranslation.height) else { return }
            if controller.view == .notice {
              controller.dismiss()
            } else {
              controller.setExpanded(false)
            }
          }
      )
      .padding(.horizontal, 12)
      .padding(.top, 4)
      .animation(reduceMotion ? .linear(duration: 0.15) : .spring(duration: 0.65, bounce: 0.25), value: view)
      .animation(reduceMotion ? nil : .spring(duration: 0.65, bounce: 0.25), value: island.notice?.id)
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    .environment(\.islandView, view)
  }
}

extension EnvironmentValues {
  @Entry var islandView = IslandView.hidden
}

private struct IslandPartModifier: ViewModifier {
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  func body(content: Content) -> some View {
    content
      .transition(
        reduceMotion
          ? .opacity
          : .asymmetric(
            insertion: .opacity.combined(with: .scale(scale: 0.9)).animation(.timingCurve(0.32, 0.72, 0, 1, duration: 0.45).delay(0.1)),
            removal: .opacity.combined(with: .scale(scale: 0.9)).animation(.timingCurve(0.32, 0.72, 0, 1, duration: 0.15))
          )
      )
  }
}

public struct IslandCompact<Content: View>: View {
  let content: Content

  @Environment(\.island) private var island
  @Environment(\.islandView) private var view

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    let controller = island
    ZStack {
      if view == .compact {
        Button {
          controller.setExpanded(true)
        } label: {
          IslandSpread(spacing: 24, minWidth: 124) {
            content
          }
          .padding(.horizontal, 10)
          .frame(height: 36)
          .contentShape(Rectangle())
        }
        .buttonStyle(IslandPressStyle())
        .foregroundStyle(Color.label)
        .modifier(IslandPartModifier())
        .accessibilityAddTraits(.isButton)
        .accessibilityHint(Text("Shows details"))
      }
    }
    .onAppear { controller.registerCompact() }
    .onDisappear { controller.unregisterCompact() }
  }
}

public struct IslandExpanded<Content: View>: View {
  let content: Content

  @Environment(\.islandView) private var view

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    ZStack {
      if view == .expanded {
        VStack(alignment: .leading, spacing: 12) {
          content
        }
        .padding(16)
        .frame(maxWidth: IslandMath.maxWidth, alignment: .leading)
        .foregroundStyle(Color.label)
        .modifier(IslandPartModifier())
        .accessibilityElement(children: .contain)
      }
    }
  }
}

struct IslandNoticePart: View {
  let notice: IslandNotice?
  let active: Bool
  let onDismiss: () -> Void

  var body: some View {
    ZStack {
      if active, let notice {
        Button(action: onDismiss) {
          HStack(spacing: 12) {
            if let icon = notice.icon {
              icon
                .frame(width: 24, height: 24)
                .frame(width: 40, height: 40)
                .background(Color.label.opacity(0.15), in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
                .accessibilityHidden(true)
            }
            VStack(alignment: .leading, spacing: 0) {
              Text(notice.title)
                .scaledFont(.sm, weight: .semibold)
                .foregroundStyle(Color.label)
              if let description = notice.description {
                Text(description)
                  .scaledFont(.sm)
                  .foregroundStyle(Color.labelSecondary)
              }
            }
            .lineLimit(1)
            .frame(maxWidth: .infinity, alignment: .leading)
          }
          .padding(14)
          .frame(maxWidth: IslandMath.maxWidth, alignment: .leading)
          .contentShape(Rectangle())
        }
        .buttonStyle(IslandPressStyle())
        .id(notice.id)
        .modifier(IslandPartModifier())
        .accessibilityHint(Text("Dismisses the notification"))
      }
    }
  }
}

private struct IslandPressStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .opacity(configuration.isPressed ? 0.75 : 1)
  }
}

struct IslandSpread: Layout {
  let spacing: CGFloat
  let minWidth: CGFloat

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let sizes = subviews.map { $0.sizeThatFits(.unspecified) }
    let width = sizes.reduce(0) { $0 + $1.width } + spacing * CGFloat(max(sizes.count - 1, 0))
    return CGSize(width: max(width, minWidth), height: sizes.map(\.height).max() ?? 0)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    let sizes = subviews.map { $0.sizeThatFits(.unspecified) }
    let used = sizes.reduce(0) { $0 + $1.width }
    let gap = subviews.count > 1 ? max(spacing, (bounds.width - used) / CGFloat(subviews.count - 1)) : 0
    var x = subviews.count == 1 ? bounds.midX - sizes[0].width / 2 : bounds.minX
    for (index, subview) in subviews.enumerated() {
      subview.place(at: CGPoint(x: x, y: bounds.midY), anchor: .leading, proposal: ProposedViewSize(sizes[index]))
      x += sizes[index].width + gap
    }
  }
}

public struct IslandRing: View {
  let value: Double
  let color: Color

  public init(value: Double, color: Color = .accent) {
    self.value = value
    self.color = color
  }

  public var body: some View {
    let progress = IslandMath.ringProgress(value)
    ZStack {
      Circle()
        .stroke(color.opacity(0.25), lineWidth: 2.5)
      Circle()
        .trim(from: 0, to: progress)
        .stroke(color, style: StrokeStyle(lineWidth: 2.5, lineCap: .round))
        .rotationEffect(.degrees(-90))
        .animation(.easeOut(duration: 0.3), value: progress)
    }
    .padding(2)
    .frame(width: 20, height: 20)
    .accessibilityHidden(true)
  }
}
