import CoreImage
import PhosphorSwift
import SwiftUI
import UIKit

public enum Theme: String, CaseIterable, Sendable {
  case light, dark, system

  var colorScheme: ColorScheme? {
    switch self {
    case .light: .light
    case .dark: .dark
    case .system: nil
    }
  }

  func resolved(system: ColorScheme) -> ColorScheme {
    colorScheme ?? system
  }
}

public protocol ThemeStorage: Sendable {
  func getItem(_ key: String) async -> String?
  func setItem(_ key: String, _ value: String?) async
}

public actor InMemoryThemeStorage: ThemeStorage {
  public static let shared = InMemoryThemeStorage()

  private var values: [String: String] = [:]

  public init() {}

  public func getItem(_ key: String) async -> String? {
    values[key]
  }

  public func setItem(_ key: String, _ value: String?) async {
    values[key] = value
  }
}

public enum ThemeTransitionEffect: String, CaseIterable, Sendable {
  case circle
  case rectangle
  case polygon
  case circleBlur = "circle-blur"
}

public enum ThemeTransitionOrigin: String, CaseIterable, Sendable {
  case center
  case topLeft = "top-left"
  case topRight = "top-right"
  case bottomLeft = "bottom-left"
  case bottomRight = "bottom-right"
  case topCenter = "top-center"
  case bottomCenter = "bottom-center"
  case bottomUp = "bottom-up"
  case topDown = "top-down"
  case leftRight = "left-right"
  case rightLeft = "right-left"
}

public struct ThemeTransition: Equatable, Sendable {
  public var effect: ThemeTransitionEffect
  public var origin: ThemeTransitionOrigin?
  public var blur: Bool

  public init(effect: ThemeTransitionEffect = .circle, origin: ThemeTransitionOrigin? = nil, blur: Bool = false) {
    self.effect = effect
    self.origin = origin
    self.blur = blur
  }
}

public struct ThemeContext: Sendable {
  public let theme: Theme
  public let resolvedTheme: ColorScheme
  let update: @MainActor @Sendable (Theme, ThemeTransition?) -> Void

  public init(
    theme: Theme,
    resolvedTheme: ColorScheme,
    setTheme: @escaping @MainActor @Sendable (Theme, ThemeTransition?) -> Void
  ) {
    self.theme = theme
    self.resolvedTheme = resolvedTheme
    update = setTheme
  }

  public init(theme: Theme, resolvedTheme: ColorScheme, setTheme: @escaping @MainActor @Sendable (Theme) -> Void) {
    self.theme = theme
    self.resolvedTheme = resolvedTheme
    update = { next, _ in setTheme(next) }
  }

  @MainActor
  public func setTheme(_ theme: Theme, transition: ThemeTransition? = nil) {
    update(theme, transition)
  }
}

extension EnvironmentValues {
  @Entry public var theme = ThemeContext(theme: .system, resolvedTheme: .light) { _ in }
}

enum ThemeMath {
  static func parse(_ stored: String?, fallback: Theme) -> Theme {
    stored.flatMap(Theme.init(rawValue:)) ?? fallback
  }

  static func resolve(_ theme: Theme, system: ColorScheme) -> ColorScheme {
    theme.resolved(system: system)
  }
}

public struct ThemeProvider<Content: View>: View {
  let defaultTheme: Theme
  let storage: any ThemeStorage
  let storageKey: String
  let content: Content

  @State private var theme: Theme
  @State private var loaded = false
  @Environment(\.colorScheme) private var system
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    defaultTheme: Theme = .system,
    storage: any ThemeStorage = InMemoryThemeStorage.shared,
    storageKey: String = "theme",
    @ViewBuilder content: () -> Content
  ) {
    self.defaultTheme = defaultTheme
    self.storage = storage
    self.storageKey = storageKey
    self.content = content()
    _theme = State(initialValue: defaultTheme)
  }

  public var body: some View {
    let resolved = ThemeMath.resolve(theme, system: system)
    let storage = storage
    let key = storageKey
    let reduceMotion = reduceMotion
    let binding = $theme
    let fallback = system
    let context = ThemeContext(theme: theme, resolvedTheme: resolved) { next, transition in
      let commit = { binding.wrappedValue = next }
      if let transition {
        let target = ThemeMath.resolve(next, system: ThemeReveal.systemScheme() ?? fallback)
        if reduceMotion || target == resolved {
          commit()
        } else {
          ThemeReveal.run(transition, target: target, commit: commit)
        }
      } else {
        ThemeCrossfade.run(enabled: !reduceMotion)
        commit()
      }
      Task { await storage.setItem(key, next.rawValue) }
    }
    content
      .environment(\.colorScheme, resolved)
      .environment(\.theme, context)
      .preferredColorScheme(theme.colorScheme)
      .task(id: key) {
        let stored = await storage.getItem(key)
        if !loaded {
          loaded = true
          theme = ThemeMath.parse(stored, fallback: defaultTheme)
        }
      }
  }
}

enum ThemeRevealMath {
  static let duration = 0.9
  static let timing = (CGFloat(0.65), CGFloat(0), CGFloat(0.35), CGFloat(1))

  static let points: [ThemeTransitionOrigin: CGPoint] = [
    .center: CGPoint(x: 0.5, y: 0.5),
    .topLeft: CGPoint(x: 0, y: 0),
    .topRight: CGPoint(x: 1, y: 0),
    .bottomLeft: CGPoint(x: 0, y: 1),
    .bottomRight: CGPoint(x: 1, y: 1),
    .topCenter: CGPoint(x: 0.5, y: 0),
    .bottomCenter: CGPoint(x: 0.5, y: 1),
  ]

  static let full = [CGPoint(x: 0, y: 0), CGPoint(x: 1, y: 0), CGPoint(x: 1, y: 1), CGPoint(x: 0, y: 1)]

  static let edges: [ThemeTransitionOrigin: [CGPoint]] = [
    .bottomUp: [CGPoint(x: 0, y: 1), CGPoint(x: 1, y: 1), CGPoint(x: 1, y: 1), CGPoint(x: 0, y: 1)],
    .topDown: [CGPoint(x: 0, y: 0), CGPoint(x: 1, y: 0), CGPoint(x: 1, y: 0), CGPoint(x: 0, y: 0)],
    .leftRight: [CGPoint(x: 0, y: 0), CGPoint(x: 0, y: 0), CGPoint(x: 0, y: 1), CGPoint(x: 0, y: 1)],
    .rightLeft: [CGPoint(x: 1, y: 0), CGPoint(x: 1, y: 0), CGPoint(x: 1, y: 1), CGPoint(x: 1, y: 1)],
  ]

  static let diagonals: [ThemeTransitionOrigin: [ColorScheme: ([CGPoint], [CGPoint])]] = [
    .topLeft: [
      .dark: (
        [CGPoint(x: 0.5, y: -0.71), CGPoint(x: -0.5, y: 0.71), CGPoint(x: -0.5, y: 0.71), CGPoint(x: 0.5, y: -0.71)],
        [CGPoint(x: 0.5, y: -0.71), CGPoint(x: -0.5, y: 0.71), CGPoint(x: 0.5, y: 1.71), CGPoint(x: 1.71, y: 0.5)]
      ),
      .light: (
        [CGPoint(x: 1.71, y: 0.5), CGPoint(x: 0.5, y: 1.71), CGPoint(x: 0.5, y: 1.71), CGPoint(x: 1.71, y: 0.5)],
        [CGPoint(x: 1.71, y: 0.5), CGPoint(x: 0.5, y: 1.71), CGPoint(x: -0.5, y: 0.71), CGPoint(x: 0.5, y: -0.71)]
      ),
    ],
    .topRight: [
      .dark: (
        [CGPoint(x: 1.5, y: -0.71), CGPoint(x: 2.5, y: 0.71), CGPoint(x: 2.5, y: 0.71), CGPoint(x: 1.5, y: -0.71)],
        [CGPoint(x: 1.5, y: -0.71), CGPoint(x: 2.5, y: 0.71), CGPoint(x: 0.5, y: 1.71), CGPoint(x: -0.71, y: 0.5)]
      ),
      .light: (
        [CGPoint(x: -0.71, y: 0.5), CGPoint(x: 0.5, y: 1.71), CGPoint(x: 0.5, y: 1.71), CGPoint(x: -0.71, y: 0.5)],
        [CGPoint(x: -0.71, y: 0.5), CGPoint(x: 0.5, y: 1.71), CGPoint(x: 2.5, y: 0.71), CGPoint(x: 1.5, y: -0.71)]
      ),
    ],
  ]

  static func point(_ transition: ThemeTransition) -> CGPoint {
    points[transition.origin ?? .center] ?? CGPoint(x: 0.5, y: 0.5)
  }

  static func duration(_ transition: ThemeTransition) -> Double {
    duration
  }

  static func polygons(_ transition: ThemeTransition, target: ColorScheme) -> ([CGPoint], [CGPoint])? {
    switch transition.effect {
    case .rectangle:
      (edges[transition.origin ?? .bottomUp] ?? edges[.bottomUp] ?? full, full)
    case .polygon:
      (diagonals[transition.origin ?? .topLeft] ?? diagonals[.topLeft])?[target] ?? (full, full)
    case .circle, .circleBlur:
      nil
    }
  }

  static func circleRadius(percent: CGFloat, in size: CGSize) -> CGFloat {
    percent / 100 * hypot(size.width, size.height) / 2.squareRoot()
  }

  static func circleRadii(_ transition: ThemeTransition, in size: CGSize) -> (CGFloat, CGFloat) {
    let centered = point(transition) == CGPoint(x: 0.5, y: 0.5)
    return (0, circleRadius(percent: centered ? 100 : 150, in: size))
  }

  static func maskSize(in size: CGSize) -> CGFloat {
    3.5 * max(size.width, size.height)
  }

  static func maskCenter(_ point: CGPoint, side: CGFloat, in size: CGSize) -> CGPoint {
    CGPoint(
      x: point.x * (size.width - side) + side / 2,
      y: point.y * (size.height - side) + side / 2
    )
  }

  static func maskLocations(side: CGFloat, radius: CGFloat) -> [NSNumber] {
    [0, 0.35 * side / radius, 0.45 * side / radius, 0.55 * side / radius, 1].map { NSNumber(value: Double($0)) }
  }

  static func absolute(_ points: [CGPoint], in size: CGSize) -> [CGPoint] {
    points.map { CGPoint(x: $0.x * size.width, y: $0.y * size.height) }
  }
}

@MainActor
enum ThemeReveal {
  private static var overlays: [(window: UIWindow, snapshot: UIView, blur: UIView?)] = []
  private static var request = 0
  private static let images = CIContext()

  static var windows: [UIWindow] {
    UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap(\.windows)
      .filter { !$0.isHidden && $0.bounds.width > 0 && $0.bounds.height > 0 }
  }

  static func systemScheme() -> ColorScheme? {
    let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
    switch scene?.traitCollection.userInterfaceStyle {
    case .dark: return .dark
    case .light: return .light
    default: return nil
    }
  }

  static func run(_ transition: ThemeTransition, target: ColorScheme, commit: () -> Void) {
    var captured: [(window: UIWindow, snapshot: UIView, blur: UIView?)] = []
    for window in windows {
      guard let snapshot = window.snapshotView(afterScreenUpdates: false) else { continue }
      snapshot.frame = window.bounds
      snapshot.isUserInteractionEnabled = false
      captured.append((window, snapshot, nil))
    }
    clear()
    guard !captured.isEmpty else {
      commit()
      return
    }
    for overlay in captured {
      overlay.window.addSubview(overlay.snapshot)
    }
    overlays = captured
    request += 1
    let current = request
    commit()
    Task { @MainActor in
      try? await Task.sleep(for: .milliseconds(20))
      guard current == request else { return }
      start(transition, target: target, request: current)
    }
  }

  private static func clear() {
    for overlay in overlays {
      overlay.snapshot.removeFromSuperview()
      overlay.blur?.removeFromSuperview()
    }
    overlays = []
  }

  private static func start(_ transition: ThemeTransition, target: ColorScheme, request current: Int) {
    let duration = ThemeRevealMath.duration(transition)
    let timing = CAMediaTimingFunction(
      controlPoints: Float(ThemeRevealMath.timing.0),
      Float(ThemeRevealMath.timing.1),
      Float(ThemeRevealMath.timing.2),
      Float(ThemeRevealMath.timing.3)
    )
    for index in overlays.indices {
      let overlay = overlays[index]
      let size = overlay.window.bounds.size
      if transition.blur, let blur = blurredView(of: overlay.window) {
        overlay.window.insertSubview(blur, belowSubview: overlay.snapshot)
        let fade = CAKeyframeAnimation(keyPath: "opacity")
        fade.values = [1, 0.5, 0]
        fade.keyTimes = [0, 0.5, 1]
        fade.timingFunctions = [timing, timing]
        fade.duration = duration
        blur.layer.opacity = 0
        blur.layer.add(fade, forKey: "theme")
        overlays[index].blur = blur
      }
      overlay.snapshot.layer.mask = mask(transition, target: target, size: size, duration: duration, timing: timing)
    }
    Task { @MainActor in
      try? await Task.sleep(for: .seconds(duration))
      guard current == request else { return }
      clear()
    }
  }

  private static func mask(
    _ transition: ThemeTransition,
    target: ColorScheme,
    size: CGSize,
    duration: Double,
    timing: CAMediaTimingFunction
  ) -> CALayer {
    if transition.effect == .circleBlur {
      return gradientMask(ThemeRevealMath.point(transition), size: size, duration: duration, timing: timing)
    }
    let bounds = CGRect(origin: .zero, size: size)
    let from: CGPath
    let to: CGPath
    if let polygons = ThemeRevealMath.polygons(transition, target: target) {
      from = inverse(polygon(ThemeRevealMath.absolute(polygons.0, in: size)), in: bounds)
      to = inverse(polygon(ThemeRevealMath.absolute(polygons.1, in: size)), in: bounds)
    } else {
      let point = ThemeRevealMath.point(transition)
      let center = CGPoint(x: point.x * size.width, y: point.y * size.height)
      let radii = ThemeRevealMath.circleRadii(transition, in: size)
      from = inverse(circle(center, max(radii.0, 0.01)), in: bounds)
      to = inverse(circle(center, radii.1), in: bounds)
    }
    let shape = CAShapeLayer()
    shape.frame = bounds
    shape.fillRule = .evenOdd
    shape.fillColor = UIColor.black.cgColor
    shape.path = to
    let animation = CABasicAnimation(keyPath: "path")
    animation.fromValue = from
    animation.toValue = to
    animation.duration = duration
    animation.timingFunction = timing
    shape.add(animation, forKey: "theme")
    return shape
  }

  private static func gradientMask(
    _ point: CGPoint,
    size: CGSize,
    duration: Double,
    timing: CAMediaTimingFunction
  ) -> CALayer {
    let side = ThemeRevealMath.maskSize(in: size)
    let radius = hypot(size.width + side / 2, size.height + side / 2)
    let gradient = CAGradientLayer()
    gradient.type = .radial
    gradient.contentsScale = 1
    gradient.bounds = CGRect(x: 0, y: 0, width: radius * 2, height: radius * 2)
    gradient.startPoint = CGPoint(x: 0.5, y: 0.5)
    gradient.endPoint = CGPoint(x: 1, y: 1)
    gradient.colors = [0, 0, 0.5, 1, 1].map { UIColor.black.withAlphaComponent($0).cgColor }
    let startCenter = ThemeRevealMath.maskCenter(point, side: 0, in: size)
    let endCenter = ThemeRevealMath.maskCenter(point, side: side, in: size)
    let startLocations = ThemeRevealMath.maskLocations(side: 0, radius: radius)
    let endLocations = ThemeRevealMath.maskLocations(side: side, radius: radius)
    gradient.position = endCenter
    gradient.locations = endLocations
    let move = CABasicAnimation(keyPath: "position")
    move.fromValue = NSValue(cgPoint: startCenter)
    move.toValue = NSValue(cgPoint: endCenter)
    let grow = CABasicAnimation(keyPath: "locations")
    grow.fromValue = startLocations
    grow.toValue = endLocations
    let group = CAAnimationGroup()
    group.animations = [move, grow]
    group.duration = duration
    group.timingFunction = timing
    gradient.add(group, forKey: "theme")
    return gradient
  }

  private static func circle(_ center: CGPoint, _ radius: CGFloat) -> CGPath {
    CGPath(
      ellipseIn: CGRect(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2),
      transform: nil
    )
  }

  private static func polygon(_ points: [CGPoint]) -> CGPath {
    let path = CGMutablePath()
    path.addLines(between: points)
    path.closeSubpath()
    return path
  }

  private static func inverse(_ shape: CGPath, in bounds: CGRect) -> CGPath {
    let path = CGMutablePath()
    path.addRect(bounds.insetBy(dx: -1, dy: -1))
    path.addPath(shape)
    return path
  }

  private static func blurredView(of window: UIWindow) -> UIView? {
    let hidden = Set(overlays.map { ObjectIdentifier($0.snapshot) })
    let format = UIGraphicsImageRendererFormat()
    format.scale = 1
    let rendered = UIGraphicsImageRenderer(bounds: window.bounds, format: format).image { _ in
      for view in window.subviews where !hidden.contains(ObjectIdentifier(view)) && !view.isHidden {
        view.drawHierarchy(in: view.frame, afterScreenUpdates: true)
      }
    }
    guard let source = rendered.cgImage else { return nil }
    let input = CIImage(cgImage: source)
    let output = input.clampedToExtent().applyingGaussianBlur(sigma: 8).cropped(to: input.extent)
    guard let blurred = images.createCGImage(output, from: input.extent) else { return nil }
    let view = UIImageView(image: UIImage(cgImage: blurred))
    view.frame = window.bounds
    view.isUserInteractionEnabled = false
    return view
  }
}

@MainActor
enum ThemeCrossfade {
  static func run(enabled: Bool) {
    guard enabled else { return }
    for window in ThemeReveal.windows {
      let fade = CATransition()
      fade.type = .fade
      fade.duration = 0.3
      fade.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
      window.layer.add(fade, forKey: "theme")
    }
  }
}

public struct ThemeToggle: View {
  let showsLabels: Bool
  let transition: ThemeTransition?

  @Environment(\.theme) private var context
  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.isEnabled) private var isEnabled
  @Namespace private var namespace

  public init(
    showsLabels: Bool = true,
    effect: ThemeTransitionEffect? = nil,
    origin: ThemeTransitionOrigin? = nil,
    blur: Bool = false
  ) {
    self.showsLabels = showsLabels
    transition = effect != nil || origin != nil || blur
      ? ThemeTransition(effect: effect ?? .circle, origin: origin, blur: blur)
      : nil
  }

  public var body: some View {
    HStack(spacing: 4) {
      ForEach(Theme.allCases, id: \.self) { option in
        segment(option)
      }
    }
    .padding(4)
    .frame(height: 44)
    .background(EsuissColor.secondary, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
    .hapticFeedback(.selection, trigger: context.theme)
    .accessibilityElement(children: .contain)
    .accessibilityLabel(Text("Theme"))
  }

  private func segment(_ option: Theme) -> some View {
    let active = context.theme == option
    return Button {
      guard !active else { return }
      withAnimation(.spring(duration: 0.3, bounce: 0.15)) {
        context.setTheme(option, transition: transition)
      }
    } label: {
      HStack(spacing: 6) {
        icon(option, active: active)
          .frame(width: 16, height: 16)
        if showsLabels {
          Text(title(option))
            .scaledFont(.sm, weight: active ? .semibold : .regular)
            .lineLimit(1)
        }
      }
      .foregroundStyle(active ? EsuissColor.foreground : EsuissColor.mutedForeground)
      .opacity(isEnabled ? 1 : 0.5)
      .padding(.horizontal, showsLabels ? 12 : 10)
      .frame(maxWidth: showsLabels ? .infinity : nil, maxHeight: .infinity)
      .contentShape(Rectangle())
    }
    .buttonStyle(ThemeSegmentStyle())
    .background {
      if active {
        RoundedRectangle(cornerRadius: Radius.md, style: .continuous)
          .fill(colorScheme == .dark ? EsuissColor.border : EsuissColor.card)
          .shadow(color: .black.opacity(colorScheme == .dark ? 0 : 0.08), radius: 1.5, y: 1)
          .matchedGeometryEffect(id: "indicator", in: namespace)
      }
    }
    .accessibilityLabel(Text(title(option)))
    .accessibilityAddTraits(active ? .isSelected : [])
  }

  @ViewBuilder
  private func icon(_ option: Theme, active: Bool) -> some View {
    switch option {
    case .light: active ? Ph.sun.fill : Ph.sun.regular
    case .dark: active ? Ph.moon.fill : Ph.moon.regular
    case .system: active ? Ph.circleHalf.fill : Ph.circleHalf.regular
    }
  }

  private func title(_ option: Theme) -> LocalizedStringKey {
    switch option {
    case .light: "Light"
    case .dark: "Dark"
    case .system: "System"
    }
  }
}

private struct ThemeSegmentStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .opacity(configuration.isPressed ? 0.8 : 1)
  }
}
