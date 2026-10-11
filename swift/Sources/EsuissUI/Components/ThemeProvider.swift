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

public struct ThemeContext: Sendable {
  public let theme: Theme
  public let resolvedTheme: ColorScheme
  let update: @MainActor @Sendable (Theme) -> Void

  public init(theme: Theme, resolvedTheme: ColorScheme, setTheme: @escaping @MainActor @Sendable (Theme) -> Void) {
    self.theme = theme
    self.resolvedTheme = resolvedTheme
    update = setTheme
  }

  @MainActor
  public func setTheme(_ theme: Theme) {
    update(theme)
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
    let context = ThemeContext(theme: theme, resolvedTheme: resolved) { next in
      ThemeTransition.crossfade(enabled: !reduceMotion)
      binding.wrappedValue = next
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

@MainActor
enum ThemeTransition {
  static func crossfade(enabled: Bool) {
    guard enabled else { return }
    let windows = UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap(\.windows)
      .filter { !$0.isHidden }
    for window in windows {
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

  @Environment(\.theme) private var context
  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.isEnabled) private var isEnabled
  @Namespace private var namespace

  public init(showsLabels: Bool = true) {
    self.showsLabels = showsLabels
  }

  public var body: some View {
    HStack(spacing: 4) {
      ForEach(Theme.allCases, id: \.self) { option in
        segment(option)
      }
    }
    .padding(4)
    .frame(height: 44)
    .background(Color.control, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
    .hapticFeedback(.selection, trigger: context.theme)
    .accessibilityElement(children: .contain)
    .accessibilityLabel(Text("Theme"))
  }

  private func segment(_ option: Theme) -> some View {
    let active = context.theme == option
    return Button {
      guard !active else { return }
      withAnimation(.spring(duration: 0.3, bounce: 0.15)) {
        context.setTheme(option)
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
      .foregroundStyle(!isEnabled ? Color.labelQuaternary : active ? .label : .labelSecondary)
      .padding(.horizontal, showsLabels ? 12 : 10)
      .frame(maxWidth: showsLabels ? .infinity : nil, maxHeight: .infinity)
      .contentShape(Rectangle())
    }
    .buttonStyle(ThemeSegmentStyle())
    .background {
      if active {
        RoundedRectangle(cornerRadius: Radius.md, style: .continuous)
          .fill(colorScheme == .dark ? Color.labelQuaternary : .surfaceRaised)
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
      .opacity(configuration.isPressed ? 0.7 : 1)
  }
}
