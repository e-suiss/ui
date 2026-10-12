import Observation
import SwiftUI
import UIKit

public enum IslandView: CaseIterable, Sendable {
  case hidden, compact, minimal, expanded, notice
}

public struct IslandNotice: Identifiable, @unchecked Sendable {
  public let id: UUID
  public let title: LocalizedStringResource
  public let description: LocalizedStringResource?
  public let icon: AnyView?
  public let duration: Duration?
}

enum IslandMode: Sendable {
  case compact, minimal, expanded
}

enum IslandMath {
  static let noticeDuration: Duration = .seconds(4)
  static let hiddenSize = CGSize(width: 126, height: 36)
  static let maxWidth: CGFloat = 384
  static let compactGap: CGFloat = 24
  static let compactMinWidth: CGFloat = 124
  static let hardwareTop: CGFloat = 11
  static let hardwareSize = CGSize(width: 126, height: 37)
  static let hardwareSafeTop: CGFloat = 59
  static let minimalSpacing: CGFloat = 8
  static let cameraRow: CGFloat = hardwareSize.height + 4

  static func view(notice: Bool, mode: IslandMode, compactCount: Int) -> IslandView {
    if notice { return .notice }
    if compactCount <= 0 { return .hidden }
    switch mode {
    case .compact: return .compact
    case .minimal: return .minimal
    case .expanded: return .expanded
    }
  }

  static func hardware(phone: Bool, safeTop: CGFloat, globalTop: CGFloat, size: CGSize) -> Bool {
    phone && safeTop >= hardwareSafeTop && globalTop <= 0.5 && size.height > size.width
  }

  static func compactGap(hardware: Bool) -> CGFloat {
    hardware ? hardwareSize.width + 16 : compactGap
  }

  static func minimalOffset(hardware: Bool) -> CGFloat {
    hardware ? hardwareSize.width / 2 + minimalSpacing + hardwareSize.height / 2 : 0
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
  private(set) var mode = IslandMode.compact
  private(set) var compactCount = 0
  var hasMinimal = false

  @ObservationIgnored private var timer: Task<Void, Never>?

  public init() {}

  public var view: IslandView {
    let shown = mode == .minimal && !hasMinimal ? IslandMode.compact : mode
    return IslandMath.view(notice: notice != nil, mode: shown, compactCount: compactCount)
  }

  @MainActor
  public func expand() {
    mode = .expanded
  }

  @MainActor
  public func collapse() {
    mode = .compact
  }

  @MainActor
  public func minimize() {
    mode = .minimal
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
    if compactCount == 0 { mode = .compact }
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

public enum IslandExpandedRegionPosition: CaseIterable, Sendable {
  case leading, trailing, center, bottom
}

public struct IslandExpandedRegion<Content: View> {
  let position: IslandExpandedRegionPosition
  let content: Content

  public init(_ position: IslandExpandedRegionPosition, @ViewBuilder content: () -> Content) {
    self.position = position
    self.content = content()
  }
}

public struct IslandExpandedContent {
  struct Part {
    let position: IslandExpandedRegionPosition
    let view: AnyView
  }

  let parts: [Part]

  func views(_ position: IslandExpandedRegionPosition) -> [AnyView] {
    parts.filter { $0.position == position }.map(\.view)
  }
}

@resultBuilder
public enum IslandExpandedContentBuilder {
  public static func buildBlock() -> IslandExpandedContent {
    IslandExpandedContent(parts: [])
  }

  public static func buildBlock(_ components: IslandExpandedContent...) -> IslandExpandedContent {
    IslandExpandedContent(parts: components.flatMap(\.parts))
  }

  public static func buildExpression<Content: View>(_ region: IslandExpandedRegion<Content>) -> IslandExpandedContent {
    IslandExpandedContent(parts: [.init(position: region.position, view: AnyView(region.content))])
  }

  public static func buildOptional(_ component: IslandExpandedContent?) -> IslandExpandedContent {
    component ?? IslandExpandedContent(parts: [])
  }

  public static func buildEither(first component: IslandExpandedContent) -> IslandExpandedContent {
    component
  }

  public static func buildEither(second component: IslandExpandedContent) -> IslandExpandedContent {
    component
  }

  public static func buildArray(_ components: [IslandExpandedContent]) -> IslandExpandedContent {
    IslandExpandedContent(parts: components.flatMap(\.parts))
  }

  public static func buildLimitedAvailability(_ component: IslandExpandedContent) -> IslandExpandedContent {
    component
  }
}

struct IslandPlacement: Equatable {
  var safeTop: CGFloat = 0
  var globalTop: CGFloat = 0
  var size: CGSize = .zero
}

extension EnvironmentValues {
  @Entry var islandInline = false
}

public struct Island<Leading: View, Trailing: View, Minimal: View>: View {
  let expanded: IslandExpandedContent
  let leading: Leading
  let trailing: Trailing
  let minimal: Minimal

  @Environment(\.island) private var island
  @Environment(\.islandInline) private var inline
  @State private var registered = false

  public init(
    @IslandExpandedContentBuilder expanded: () -> IslandExpandedContent,
    @ViewBuilder compactLeading: () -> Leading,
    @ViewBuilder compactTrailing: () -> Trailing,
    @ViewBuilder minimal: () -> Minimal
  ) {
    self.expanded = expanded()
    self.leading = compactLeading()
    self.trailing = compactTrailing()
    self.minimal = minimal()
  }

  public var body: some View {
    let controller = island
    let surface = IslandSurface(
      expanded: expanded,
      leading: AnyView(leading),
      trailing: AnyView(trailing),
      minimal: AnyView(minimal)
    )
    ZStack {
      if inline {
        surface
      } else {
        IslandOverlayAnchor(surface: surface)
          .frame(width: 0, height: 0)
          .accessibilityHidden(true)
      }
    }
    .background {
      HStack {
        leading
        trailing
      }
      .fixedSize()
      .hidden()
      .accessibilityHidden(true)
      .onGeometryChange(for: Bool.self) { $0.size.width > 0 && $0.size.height > 0 } action: { active in
        update(active: active)
      }
    }
    .onAppear { controller.hasMinimal = Minimal.self != EmptyView.self }
    .onDisappear { update(active: false) }
  }

  private func update(active: Bool) {
    guard active != registered else { return }
    registered = active
    if active {
      island.registerCompact()
    } else {
      island.unregisterCompact()
    }
  }
}

struct IslandSurface: View {
  let expanded: IslandExpandedContent
  let leading: AnyView
  let trailing: AnyView
  let minimal: AnyView
  var overlay: IslandOverlay?

  @Environment(\.island) private var island
  @Environment(\.accessibilityReduceMotion) private var reduceMotion
  @State private var placement = IslandPlacement()

  var body: some View {
    let controller = island
    let view = controller.view
    let hardware = IslandMath.hardware(
      phone: UIDevice.current.userInterfaceIdiom == .phone,
      safeTop: placement.safeTop,
      globalTop: placement.globalTop,
      size: placement.size
    )
    let hidesStatusBar = hardware && (view == .expanded || view == .notice)
    let height = hardware ? IslandMath.hardwareSize.height : IslandMath.hiddenSize.height
    let small = view == .hidden || view == .compact || view == .minimal
    let radius: CGFloat = small ? height / 2 : (hardware ? 40 : 28)
    let shape = RoundedRectangle(cornerRadius: radius, style: .continuous)
    let motion: Animation = reduceMotion ? .linear(duration: 0.15) : .spring(duration: 0.65, bounce: 0.25)
    ZStack(alignment: .top) {
      if view == .expanded {
        Color.clear
          .contentShape(Rectangle())
          .onTapGesture { controller.collapse() }
          .accessibilityHidden(true)
      }
      ZStack(alignment: .top) {
        if view == .compact {
          compactPart(controller: controller, hardware: hardware, height: height)
        }
        if view == .minimal {
          minimalPart(controller: controller, height: height)
        }
        if view == .expanded {
          IslandExpandedPart(content: expanded, hardware: hardware)
            .modifier(IslandPartModifier())
        }
        IslandNoticePart(notice: controller.notice, active: view == .notice, hardware: hardware) {
          controller.dismiss()
        }
      }
      .environment(\.colorScheme, .dark)
      .foregroundStyle(Color.onMedia)
      .frame(
        minWidth: view == .hidden ? (hardware ? IslandMath.hardwareSize.width : IslandMath.hiddenSize.width) : nil,
        minHeight: view == .hidden ? height : nil
      )
      .background(Color.media, in: shape)
      .clipShape(shape)
      .onGeometryChange(for: CGRect.self) { $0.frame(in: .global) } action: { frame in
        overlay?.islandFrame = frame
      }
      .shadow(hardware && small ? Shadow(color: .clear, radius: 0) : .lg)
      .scaleEffect(view == .hidden ? 0.75 : 1)
      .opacity(view == .hidden ? 0 : 1)
      .allowsHitTesting(view != .hidden)
      .accessibilityHidden(view == .hidden)
      .simultaneousGesture(
        DragGesture(minimumDistance: 12)
          .onEnded { value in
            guard IslandMath.swipeCloses(translation: value.translation.height, predicted: value.predictedEndTranslation.height) else { return }
            switch controller.view {
            case .notice: controller.dismiss()
            case .expanded: controller.collapse()
            default: break
            }
          }
      )
      .offset(x: view == .minimal ? IslandMath.minimalOffset(hardware: hardware) : 0)
      .padding(.horizontal, hardware ? IslandMath.hardwareTop : 12)
      .padding(.top, hardware ? IslandMath.hardwareTop : placement.safeTop + 4)
      .animation(motion, value: view)
      .animation(reduceMotion ? nil : .spring(duration: 0.65, bounce: 0.25), value: controller.notice?.id)
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    .ignoresSafeArea(.container, edges: .top)
    .onGeometryChange(for: IslandPlacement.self) { proxy in
      IslandPlacement(
        safeTop: proxy.safeAreaInsets.top,
        globalTop: proxy.frame(in: .global).minY - proxy.safeAreaInsets.top,
        size: CGSize(width: proxy.size.width, height: proxy.size.height + proxy.safeAreaInsets.top + proxy.safeAreaInsets.bottom)
      )
    } action: { next in
      placement = next
    }
    .statusBarHidden(overlay == nil && hidesStatusBar)
    .onChange(of: view, initial: true) { _, next in
      overlay?.capturesAll = next == .expanded
      overlay?.passive = next == .hidden
    }
    .onChange(of: hidesStatusBar, initial: true) { _, next in
      overlay?.hidesStatusBar = next
    }
  }

  private func compactPart(controller: IslandController, hardware: Bool, height: CGFloat) -> some View {
    Button {
      controller.expand()
    } label: {
      IslandSides(
        gap: IslandMath.compactGap(hardware: hardware),
        minWidth: (hardware ? IslandMath.hardwareSize.width : IslandMath.compactMinWidth) - 20
      ) {
        HStack(spacing: 6) { leading }
        HStack(spacing: 6) { trailing }
      }
      .padding(.horizontal, 10)
      .frame(height: height)
      .contentShape(Rectangle())
    }
    .buttonStyle(IslandPressStyle())
    .modifier(IslandPartModifier())
    .accessibilityElement(children: .combine)
    .accessibilityAddTraits(.isButton)
    .accessibilityHint(Text("Shows details"))
  }

  private func minimalPart(controller: IslandController, height: CGFloat) -> some View {
    Button {
      controller.expand()
    } label: {
      ZStack { minimal }
        .frame(width: height, height: height)
        .contentShape(Circle())
    }
    .buttonStyle(IslandPressStyle())
    .modifier(IslandPartModifier())
    .accessibilityElement(children: .combine)
    .accessibilityAddTraits(.isButton)
    .accessibilityHint(Text("Shows details"))
  }
}

@MainActor
final class IslandOverlay {
  let window: IslandOverlayWindow
  let host: IslandOverlayHost

  var islandFrame: CGRect = .null
  var capturesAll = false
  var passive = true
  var hidesStatusBar = false {
    didSet {
      guard hidesStatusBar != oldValue else { return }
      host.hidesStatusBar = hidesStatusBar
    }
  }

  init(scene: UIWindowScene, app: UIWindow?) {
    host = IslandOverlayHost(rootView: AnyView(EmptyView()))
    host.view.backgroundColor = .clear
    host.app = app
    window = IslandOverlayWindow(windowScene: scene)
    window.windowLevel = .statusBar - 1
    window.backgroundColor = .clear
    window.rootViewController = host
    window.overlay = self
    window.isHidden = false
  }

  func update(_ root: AnyView, style: UIUserInterfaceStyle) {
    host.rootView = root
    window.overrideUserInterfaceStyle = style
    host.setNeedsStatusBarAppearanceUpdate()
  }

  func tearDown() {
    window.isHidden = true
    window.rootViewController = nil
    window.overlay = nil
  }

  func captures(_ point: CGPoint) -> Bool {
    if passive { return false }
    return capturesAll || islandFrame.contains(point)
  }
}

final class IslandOverlayWindow: UIWindow {
  weak var overlay: IslandOverlay?

  override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
    guard let overlay, overlay.captures(point) else { return nil }
    return super.hitTest(point, with: event)
  }
}

final class IslandOverlayHost: UIHostingController<AnyView> {
  weak var app: UIWindow?

  var hidesStatusBar = false {
    didSet {
      guard hidesStatusBar != oldValue else { return }
      UIView.animate(withDuration: 0.25) { self.setNeedsStatusBarAppearanceUpdate() }
    }
  }

  private var appController: UIViewController? {
    var controller = app?.rootViewController
    while let next = controller?.presentedViewController, !next.isBeingDismissed {
      controller = next
    }
    return controller
  }

  override var prefersStatusBarHidden: Bool {
    var controller = appController
    while let child = controller?.childForStatusBarHidden {
      controller = child
    }
    return hidesStatusBar || (controller?.prefersStatusBarHidden ?? false)
  }

  override var preferredStatusBarStyle: UIStatusBarStyle {
    var controller = appController
    while let child = controller?.childForStatusBarStyle {
      controller = child
    }
    return controller?.preferredStatusBarStyle ?? .default
  }

  override var preferredStatusBarUpdateAnimation: UIStatusBarAnimation {
    .fade
  }
}

final class IslandAnchorView: UIView {
  var onWindow: ((UIWindow?) -> Void)?

  override func didMoveToWindow() {
    super.didMoveToWindow()
    onWindow?(window)
  }
}

struct IslandOverlayAnchor: UIViewRepresentable {
  let surface: IslandSurface

  @MainActor
  final class Coordinator {
    var overlay: IslandOverlay?
    var surface: IslandSurface?
    var environment: EnvironmentValues?

    func attach(_ window: UIWindow?) {
      guard let window, let scene = window.windowScene else {
        detach()
        return
      }
      if overlay == nil {
        overlay = IslandOverlay(scene: scene, app: window)
      }
      render()
    }

    func render() {
      guard let overlay, var surface, let environment else { return }
      surface.overlay = overlay
      overlay.update(
        AnyView(surface.environment(\.self, environment)),
        style: environment.colorScheme == .dark ? .dark : .light
      )
    }

    func detach() {
      overlay?.tearDown()
      overlay = nil
    }
  }

  func makeCoordinator() -> Coordinator {
    Coordinator()
  }

  func makeUIView(context: Context) -> IslandAnchorView {
    let view = IslandAnchorView()
    view.isUserInteractionEnabled = false
    let coordinator = context.coordinator
    view.onWindow = { window in
      coordinator.attach(window)
    }
    return view
  }

  func updateUIView(_ uiView: IslandAnchorView, context: Context) {
    let coordinator = context.coordinator
    coordinator.surface = surface
    coordinator.environment = context.environment
    coordinator.render()
  }

  static func dismantleUIView(_ uiView: IslandAnchorView, coordinator: Coordinator) {
    uiView.onWindow = nil
    coordinator.detach()
  }
}

extension Island where Minimal == EmptyView {
  public init(
    @IslandExpandedContentBuilder expanded: () -> IslandExpandedContent,
    @ViewBuilder compactLeading: () -> Leading,
    @ViewBuilder compactTrailing: () -> Trailing
  ) {
    self.init(expanded: expanded, compactLeading: compactLeading, compactTrailing: compactTrailing) { EmptyView() }
  }
}

extension Island where Leading == EmptyView, Trailing == EmptyView, Minimal == EmptyView {
  public init() {
    self.init {} compactLeading: { EmptyView() } compactTrailing: { EmptyView() } minimal: { EmptyView() }
  }
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

struct IslandExpandedPart: View {
  let content: IslandExpandedContent
  let hardware: Bool

  var body: some View {
    let leading = content.views(.leading)
    let trailing = content.views(.trailing)
    let center = content.views(.center)
    let bottom = content.views(.bottom)
    let padding: CGFloat = 16
    VStack(alignment: .leading, spacing: 12) {
      if !leading.isEmpty || !trailing.isEmpty || !center.isEmpty {
        HStack(alignment: .top, spacing: 12) {
          if !leading.isEmpty {
            IslandRegionStack(views: leading, alignment: .leading)
          }
          if center.isEmpty {
            Spacer(minLength: 0)
          } else {
            IslandRegionStack(views: center, alignment: .center)
              .frame(maxWidth: .infinity)
              .padding(.top, hardware ? max(IslandMath.cameraRow - padding, 0) : 0)
          }
          if !trailing.isEmpty {
            IslandRegionStack(views: trailing, alignment: .trailing)
          }
        }
      }
      if !bottom.isEmpty {
        IslandRegionStack(views: bottom, alignment: .leading)
          .frame(maxWidth: .infinity, alignment: .leading)
      }
    }
    .padding(padding)
    .frame(maxWidth: IslandMath.maxWidth, alignment: .leading)
    .accessibilityElement(children: .contain)
  }
}

private struct IslandRegionStack: View {
  let views: [AnyView]
  let alignment: HorizontalAlignment

  var body: some View {
    VStack(alignment: alignment, spacing: 12) {
      ForEach(views.indices, id: \.self) { index in
        views[index]
      }
    }
  }
}

struct IslandNoticePart: View {
  let notice: IslandNotice?
  let active: Bool
  let hardware: Bool
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
                .background(Color.onMedia.opacity(0.15), in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
                .accessibilityHidden(true)
            }
            VStack(alignment: .leading, spacing: 0) {
              Text(notice.title)
                .scaledFont(.sm, weight: .semibold)
                .foregroundStyle(Color.onMedia)
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
          .padding(.top, hardware ? max(IslandMath.cameraRow - 14, 0) : 0)
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

struct IslandSides: Layout {
  let gap: CGFloat
  let minWidth: CGFloat

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let sizes = subviews.map { $0.sizeThatFits(.unspecified) }
    let side = sizes.map(\.width).max() ?? 0
    return CGSize(width: max(side * 2 + gap, minWidth), height: sizes.map(\.height).max() ?? 0)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    for (index, subview) in subviews.enumerated() {
      let size = subview.sizeThatFits(.unspecified)
      let leading = index == 0
      subview.place(
        at: CGPoint(x: leading ? bounds.minX : bounds.maxX, y: bounds.midY),
        anchor: leading ? .leading : .trailing,
        proposal: ProposedViewSize(size)
      )
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
