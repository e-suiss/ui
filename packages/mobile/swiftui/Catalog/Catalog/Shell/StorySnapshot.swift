import EsuissUI
import SwiftUI
import UIKit

@MainActor
enum StorySnapshot {
  static var folder: URL { URL.documentsDirectory.appending(path: "snapshots") }

  static func captureAll(shard: String, only: [String]) async {
    let parts = shard.split(separator: "/").compactMap { Int($0) }
    let index = parts.count == 2 ? parts[0] : 1
    let count = parts.count == 2 ? max(parts[1], 1) : 1
    let entries = StoryCatalog.entriesByID.values
      .filter { only.isEmpty || only.contains($0.id) }
      .sorted { $0.id < $1.id }
      .enumerated()
      .filter { $0.offset % count == index - 1 }
      .map(\.element)
    try? FileManager.default.removeItem(at: folder)
    try? FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
    while UIApplication.shared.connectedScenes.isEmpty {
      try? await Task.sleep(for: .milliseconds(100))
    }
    for theme in [CatalogTheme.light, .dark] {
      for entry in entries {
        await capture(entry, theme: theme, name: "\(entry.id)-\(theme.rawValue)")
      }
    }
    let list = entries.map(\.id).joined(separator: "\n")
    try? Data(list.utf8).write(to: folder.appending(path: "done.txt"))
  }

  static func capture(_ entry: StoryEntry, theme: CatalogTheme, name: String? = nil) async {
    guard
      let scene = UIApplication.shared.connectedScenes
        .compactMap({ $0 as? UIWindowScene })
        .first
    else { return }
    let screen = scene.screen.bounds.size
    let style: UIUserInterfaceStyle = theme == .dark ? .dark : .light
    let scheme: ColorScheme = theme == .dark ? .dark : .light
    let content = entry.story.content()
      .padding(16)
      .frame(width: screen.width, alignment: .topLeading)
    let measure = UIHostingController(rootView: content.environment(\.colorScheme, scheme))
    measure.safeAreaRegions = []
    measure.overrideUserInterfaceStyle = style
    let fitted = measure.sizeThatFits(
      in: CGSize(width: screen.width, height: .greatestFiniteMagnitude)
    )
    let height = entry.story.scrolls && fitted.height.isFinite ? ceil(fitted.height) + 240 : screen.height
    let size = CGSize(width: screen.width, height: height)
    let host = UIHostingController(
      rootView: content
        .frame(maxHeight: .infinity, alignment: .top)
        .background(EsuissColor.background)
        .environment(\.colorScheme, scheme)
    )
    host.safeAreaRegions = []
    host.overrideUserInterfaceStyle = style

    let window = UIWindow(windowScene: scene)
    window.overrideUserInterfaceStyle = style
    window.windowLevel = .normal - 1
    window.frame = CGRect(origin: .zero, size: size)
    window.rootViewController = host
    window.isHidden = false
    host.view.frame = window.bounds
    host.view.layoutIfNeeded()

    try? await Task.sleep(for: .seconds(2))

    let format = UIGraphicsImageRendererFormat()
    format.scale = scene.screen.scale
    let image = UIGraphicsImageRenderer(size: size, format: format).image { context in
      host.view.layer.render(in: context.cgContext)
    }
    try? FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
    try? image.pngData()?.write(to: folder.appending(path: "\(name ?? "\(entry.id).\(theme.rawValue)").png"))
    window.isHidden = true
  }
}
