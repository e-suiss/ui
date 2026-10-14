import Observation
import SwiftUI

enum CatalogTheme: String, CaseIterable, Identifiable {
  case system, light, dark

  var id: String { rawValue }

  var title: String {
    switch self {
    case .system: "System"
    case .light: "Light"
    case .dark: "Dark"
    }
  }

  var colorScheme: ColorScheme? {
    switch self {
    case .system: nil
    case .light: .light
    case .dark: .dark
    }
  }
}

enum Route: Hashable {
  case group(String)
  case story(String)
}

@Observable
final class CatalogModel {
  private static let themeKey = "catalog.theme"

  var path: [Route] = []
  var demo = false
  var reveal = false
  var theme: CatalogTheme {
    didSet { UserDefaults.standard.set(theme.rawValue, forKey: Self.themeKey) }
  }

  init() {
    theme = UserDefaults.standard.string(forKey: Self.themeKey).flatMap(CatalogTheme.init(rawValue:)) ?? .system
    if let link = UserDefaults.standard.string(forKey: "link"), let url = URL(string: link) {
      open(url)
    }
  }

  func open(_ url: URL) {
    guard url.scheme == "esuiss-catalog", url.host() == "story" else { return }
    let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
    if let value = components?.queryItems?.first(where: { $0.name == "theme" })?.value,
      let next = CatalogTheme(rawValue: value.lowercased())
    {
      theme = next
    }
    guard let id = url.pathComponents.first(where: { $0 != "/" }),
      let entry = StoryCatalog.entriesByID[id]
    else { return }
    demo = components?.queryItems?.contains(where: { $0.name == "demo" && $0.value == "1" }) == true
    reveal = components?.queryItems?.contains(where: { $0.name == "open" && $0.value == "1" }) == true
    if components?.queryItems?.contains(where: { $0.name == "snapshot" && $0.value == "1" }) == true {
      let theme = theme
      Task { @MainActor in await StorySnapshot.capture(entry, theme: theme) }
      return
    }
    path = [.group(entry.group.id), .story(entry.id)]
  }
}
