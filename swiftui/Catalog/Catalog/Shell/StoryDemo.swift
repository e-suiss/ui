import UIKit

@MainActor
enum StoryDemo {
  private static let next = "Next slide"

  static func run() async {
    try? await Task.sleep(for: .seconds(1.2))
    while !Task.isCancelled {
      advance()
      try? await Task.sleep(for: .seconds(2.2))
    }
  }

  static func reveal() async {
    try? await Task.sleep(for: .seconds(0.8))
    let all = elements()
    if let trigger = all.first(where: { element in ["Shows ", "Opens "].contains { element.accessibilityHint?.hasPrefix($0) == true } }) {
      _ = trigger.accessibilityActivate()
      return
    }
    let action = all.lazy.compactMap { $0.accessibilityCustomActions?.first { $0.name.hasPrefix("Show ") } }.first
    if let action {
      if let handler = action.actionHandler {
        _ = handler(action)
      } else if let target = action.target as? NSObject {
        target.perform(action.selector, with: action)
      }
      return
    }
    if let button = all.first(where: { element in
      !(element is UIView) && element.accessibilityTraits.contains(.button)
        && !element.accessibilityTraits.contains(.notEnabled)
    }) {
      if all.contains(where: { ($0 as? UIView)?.interactions.contains { $0 is UIContextMenuInteraction } == true }) == false {
        _ = button.accessibilityActivate()
        return
      }
    }
    let present = NSSelectorFromString("_presentMenuAtLocation:")
    for case let view as UIView in all {
      guard let interaction = view.interactions.first(where: { $0 is UIContextMenuInteraction }) as? NSObject,
        interaction.responds(to: present)
      else { continue }
      let target = all.first { element in
        !(element is UIView) && element.accessibilityLabel?.isEmpty == false
          && element.accessibilityFrame.height < view.bounds.height / 2
      }
      guard let target else { continue }
      let frame = view.convert(target.accessibilityFrame, from: nil)
      typealias Present = @convention(c) (AnyObject, Selector, CGPoint) -> Void
      let call = unsafeBitCast(interaction.method(for: present), to: Present.self)
      call(interaction, present, CGPoint(x: frame.midX, y: frame.midY))
      return
    }
  }

  private static func elements() -> [NSObject] {
    UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap(\.windows)
      .filter(\.isKeyWindow)
      .flatMap { collect($0) }
  }

  private static func advance() {
    let elements = elements()
    let labeled = elements.filter { $0.accessibilityLabel != nil }
    if labeled.contains(where: { $0.accessibilityLabel == "Pause slideshow" }) { return }
    if let button = labeled.first(where: { $0.accessibilityLabel == next }) {
      if !button.accessibilityTraits.contains(.notEnabled) {
        _ = button.accessibilityActivate()
      }
      return
    }
    let dots = labeled.filter { $0.accessibilityLabel?.hasPrefix("Go to slide ") == true }
    if !dots.isEmpty {
      let current = dots.firstIndex { $0.accessibilityTraits.contains(.selected) } ?? 0
      _ = dots[(current + 1) % dots.count].accessibilityActivate()
      return
    }
    if let pager = labeled.first(where: { $0.accessibilityLabel == "Page" && $0.accessibilityTraits.contains(.adjustable) }) {
      pager.accessibilityIncrement()
      return
    }
    let slides = labeled.filter { $0.accessibilityLabel?.hasPrefix("Slide ") == true }
    for case let scroll as UIScrollView in elements where scroll.contentSize.width > scroll.bounds.width + 1 {
      let origin = scroll.convert(scroll.bounds.origin, to: nil).x
      let limit = scroll.contentSize.width - scroll.bounds.width
      let edges = slides.map { $0.accessibilityFrame.minX - origin + scroll.contentOffset.x }.sorted()
      let current = scroll.contentOffset.x
      let target = current >= limit - 1 ? 0 : min(edges.first { $0 > current + 1 } ?? limit, limit)
      scroll.setContentOffset(CGPoint(x: target, y: scroll.contentOffset.y), animated: true)
    }
  }

  private static func collect(_ object: NSObject) -> [NSObject] {
    var output = [object]
    if let elements = object.accessibilityElements as? [NSObject] {
      for element in elements { output += collect(element) }
    } else {
      let count = object.accessibilityElementCount()
      if count != NSNotFound, count > 0 {
        for index in 0..<count {
          if let element = object.accessibilityElement(at: index) as? NSObject { output += collect(element) }
        }
      }
    }
    if let view = object as? UIView {
      for subview in view.subviews { output += collect(subview) }
    }
    return output
  }
}
