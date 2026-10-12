import PhosphorSwift
import SwiftUI

public enum CarouselOrientation: CaseIterable, Sendable {
  case horizontal, vertical
}

public enum CarouselDotsVariant: CaseIterable, Sendable {
  case `default`, plain
}

let carouselAnimation = Animation.timingCurve(0.32, 0.72, 0, 1, duration: 0.5)

enum CarouselMath {
  static func clamp(_ index: Int, count: Int) -> Int {
    count == 0 ? 0 : min(max(index, 0), count - 1)
  }

  static func step(from index: Int, by delta: Int, count: Int, loop: Bool) -> Int? {
    guard count > 0 else { return nil }
    let next = index + delta
    if next >= 0 && next < count { return next }
    guard loop, count > 1 else { return nil }
    return ((next % count) + count) % count
  }

  static func autoplayTarget(from index: Int, count: Int, loop: Bool) -> Int? {
    guard count > 1 else { return nil }
    return step(from: index, by: 1, count: count, loop: loop) ?? 0
  }
}

@MainActor
@Observable
public final class CarouselController {
  public private(set) var selectedIndex = 0
  public private(set) var count = 0
  public internal(set) var isPlaying = false

  var keys: [UUID] = []
  var loop = false
  var reduceMotion = false
  var autoplayEnabled = false
  var autoplayDelay: Duration = .seconds(5)
  var autoplayStart: Date?

  public init() {}

  public var canScrollPrev: Bool {
    CarouselMath.step(from: selectedIndex, by: -1, count: count, loop: loop) != nil
  }

  public var canScrollNext: Bool {
    CarouselMath.step(from: selectedIndex, by: 1, count: count, loop: loop) != nil
  }

  public func scrollTo(_ index: Int, animated: Bool = true) {
    let target = CarouselMath.clamp(index, count: count)
    guard target != selectedIndex else { return }
    if animated && !reduceMotion {
      withAnimation(carouselAnimation) { selectedIndex = target }
    } else {
      selectedIndex = target
    }
  }

  public func scrollPrev() {
    if let target = CarouselMath.step(from: selectedIndex, by: -1, count: count, loop: loop) {
      scrollTo(target)
    }
  }

  public func scrollNext() {
    if let target = CarouselMath.step(from: selectedIndex, by: 1, count: count, loop: loop) {
      scrollTo(target)
    }
  }

  public func setPlaying(_ playing: Bool) {
    isPlaying = autoplayEnabled && playing
  }

  func register(_ keys: [UUID]) {
    self.keys = keys
    count = keys.count
    selectedIndex = CarouselMath.clamp(selectedIndex, count: count)
  }

  var position: UUID? {
    get { keys.indices.contains(selectedIndex) ? keys[selectedIndex] : nil }
    set {
      if let newValue, let index = keys.firstIndex(of: newValue) {
        selectedIndex = index
      }
    }
  }
}

extension EnvironmentValues {
  @Entry var carousel: CarouselController? = nil
  @Entry var carouselOrientation: CarouselOrientation = .horizontal
  @Entry var carouselSpacing: CGFloat = 16
}

struct CarouselKeysKey: PreferenceKey {
  static var defaultValue: [UUID] { [] }

  static func reduce(value: inout [UUID], nextValue: () -> [UUID]) {
    value.append(contentsOf: nextValue())
  }
}

private struct CarouselAutoplayKey: Hashable {
  let index: Int
  let count: Int
  let running: Bool
}

public struct Carousel<Content: View>: View {
  let orientation: CarouselOrientation
  let loop: Bool
  let autoplay: Duration?
  let external: CarouselController?
  let onSelect: ((Int) -> Void)?
  let content: Content

  @State private var local = CarouselController()
  @Environment(\.accessibilityReduceMotion) private var reduceMotion
  @Environment(\.scenePhase) private var scenePhase

  public init(
    orientation: CarouselOrientation = .horizontal,
    loop: Bool = false,
    autoplay: Duration? = nil,
    controller: CarouselController? = nil,
    onSelect: ((Int) -> Void)? = nil,
    @ViewBuilder content: () -> Content
  ) {
    self.orientation = orientation
    self.loop = loop
    self.autoplay = autoplay
    self.external = controller
    self.onSelect = onSelect
    self.content = content()
  }

  public var body: some View {
    let controller = external ?? local
    let running = controller.isPlaying && scenePhase != .background
    VStack(spacing: 0) {
      content
    }
    .environment(\.carousel, controller)
    .environment(\.carouselOrientation, orientation)
    .onAppear {
      controller.loop = loop
      controller.reduceMotion = reduceMotion
      controller.autoplayEnabled = autoplay != nil
      controller.autoplayDelay = autoplay ?? .seconds(5)
      controller.isPlaying = autoplay != nil && !reduceMotion
    }
    .onChange(of: loop) { _, value in controller.loop = value }
    .onChange(of: reduceMotion) { _, value in controller.reduceMotion = value }
    .onChange(of: controller.selectedIndex) { _, value in onSelect?(value) }
    .task(id: CarouselAutoplayKey(index: controller.selectedIndex, count: controller.count, running: running)) {
      guard running, let delay = autoplay else {
        controller.autoplayStart = nil
        return
      }
      controller.autoplayStart = .now
      do {
        try await Task.sleep(for: delay)
      } catch {
        return
      }
      if let target = CarouselMath.autoplayTarget(from: controller.selectedIndex, count: controller.count, loop: controller.loop) {
        controller.scrollTo(target)
      }
    }
    .accessibilityElement(children: .contain)
  }
}

public struct CarouselContent<Content: View>: View {
  let spacing: CGFloat
  let content: Content

  @State private var keys: [UUID] = []
  @Environment(\.carousel) private var carousel
  @Environment(\.carouselOrientation) private var orientation

  public init(spacing: CGFloat = 16, @ViewBuilder content: () -> Content) {
    self.spacing = spacing
    self.content = content()
  }

  public var body: some View {
    let horizontal = orientation == .horizontal
    ScrollView(horizontal ? .horizontal : .vertical) {
      Group {
        if horizontal {
          HStack(spacing: spacing) { content }
        } else {
          VStack(spacing: spacing) { content }
        }
      }
      .scrollTargetLayout()
    }
    .scrollIndicators(.hidden)
    .scrollTargetBehavior(.viewAligned(limitBehavior: .always))
    .scrollPosition(id: position)
    .environment(\.carouselSpacing, spacing)
    .onPreferenceChange(CarouselKeysKey.self) { value in keys = value }
    .onChange(of: keys, initial: true) { _, value in carousel?.register(value) }
  }

  private var position: Binding<UUID?> {
    let carousel = carousel
    return Binding(
      get: { carousel?.position },
      set: { carousel?.position = $0 }
    )
  }
}

public struct CarouselItem<Content: View>: View {
  let basis: CGFloat
  let content: Content

  @State private var key = UUID()
  @Environment(\.carousel) private var carousel
  @Environment(\.carouselOrientation) private var orientation
  @Environment(\.carouselSpacing) private var spacing

  public init(basis: CGFloat = 1, @ViewBuilder content: () -> Content) {
    self.basis = basis
    self.content = content()
  }

  public var body: some View {
    let index = carousel?.keys.firstIndex(of: key)
    content
      .containerRelativeFrame(orientation == .horizontal ? .horizontal : .vertical) { length, _ in
        max(0, (length + spacing) * min(max(basis, 0), 1) - spacing)
      }
      .id(key)
      .preference(key: CarouselKeysKey.self, value: [key])
      .accessibilityElement(children: .contain)
      .accessibilityLabel(index.map { Text("Slide \($0 + 1) of \(carousel?.count ?? 0)") } ?? Text(verbatim: ""))
  }
}

public struct CarouselPrevious: View {
  let variant: VariantButtonStyle.Variant
  let size: VariantButtonStyle.Size

  @Environment(\.carousel) private var carousel
  @Environment(\.carouselOrientation) private var orientation

  public init(variant: VariantButtonStyle.Variant = .secondary, size: VariantButtonStyle.Size = .icon) {
    self.variant = variant
    self.size = size
  }

  public var body: some View {
    Button {
      carousel?.scrollPrev()
    } label: {
      (orientation == .horizontal ? Ph.caretLeft.bold : Ph.caretUp.bold)
        .frame(width: 16, height: 16)
        .flipsForRightToLeftLayoutDirection(orientation == .horizontal)
    }
    .buttonStyle(.variant(variant, size: size))
    .disabled(!(carousel?.canScrollPrev ?? false))
    .accessibilityLabel(Text("Previous slide"))
  }
}

public struct CarouselNext: View {
  let variant: VariantButtonStyle.Variant
  let size: VariantButtonStyle.Size

  @Environment(\.carousel) private var carousel
  @Environment(\.carouselOrientation) private var orientation

  public init(variant: VariantButtonStyle.Variant = .secondary, size: VariantButtonStyle.Size = .icon) {
    self.variant = variant
    self.size = size
  }

  public var body: some View {
    Button {
      carousel?.scrollNext()
    } label: {
      (orientation == .horizontal ? Ph.caretRight.bold : Ph.caretDown.bold)
        .frame(width: 16, height: 16)
        .flipsForRightToLeftLayoutDirection(orientation == .horizontal)
    }
    .buttonStyle(.variant(variant, size: size))
    .disabled(!(carousel?.canScrollNext ?? false))
    .accessibilityLabel(Text("Next slide"))
  }
}

public struct CarouselControls<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 12) {
      content
    }
    .padding(.top, 24)
  }
}

public struct CarouselDots: View {
  let variant: CarouselDotsVariant

  @Environment(\.carousel) private var carousel
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(variant: CarouselDotsVariant = .default) {
    self.variant = variant
  }

  public var body: some View {
    let count = carousel?.count ?? 0
    let selected = carousel?.selectedIndex ?? 0
    let autoplay = carousel?.autoplayEnabled ?? false
    HStack(spacing: 16) {
      ForEach(0..<count, id: \.self) { index in
        let active = index == selected
        Button {
          carousel?.scrollTo(index)
        } label: {
          Capsule()
            .fill(active ? (autoplay ? Color.labelTertiary : .label) : .labelTertiary)
            .frame(width: active ? 24 : 8, height: 8)
            .overlay(alignment: .leading) {
              if active && autoplay, let carousel {
                CarouselDotsFill(carousel: carousel)
              }
            }
            .clipShape(Capsule())
            .padding(8)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .padding(-8)
        .accessibilityLabel(Text("Go to slide \(index + 1)"))
        .accessibilityAddTraits(active ? .isSelected : [])
      }
    }
    .animation(reduceMotion ? nil : carouselAnimation, value: selected)
    .frame(height: 36)
    .padding(.horizontal, variant == .default ? 16 : 0)
    .background {
      if variant == .default {
        Capsule().fill(Color.control)
      }
    }
  }
}

private struct CarouselDotsFill: View {
  let carousel: CarouselController

  var body: some View {
    TimelineView(.animation(paused: carousel.autoplayStart == nil)) { timeline in
      GeometryReader { proxy in
        Capsule()
          .fill(Color.label)
          .frame(width: proxy.size.width * fraction(at: timeline.date))
      }
    }
  }

  private func fraction(at date: Date) -> CGFloat {
    guard carousel.isPlaying else { return 1 }
    guard let start = carousel.autoplayStart else { return 0 }
    let delay = carousel.autoplayDelay / .seconds(1)
    guard delay > 0 else { return 1 }
    return min(max(date.timeIntervalSince(start) / delay, 0), 1)
  }
}

public struct CarouselPlayButton: View {
  let variant: VariantButtonStyle.Variant
  let size: VariantButtonStyle.Size

  @Environment(\.carousel) private var carousel

  public init(variant: VariantButtonStyle.Variant = .secondary, size: VariantButtonStyle.Size = .iconSm) {
    self.variant = variant
    self.size = size
  }

  public var body: some View {
    if let carousel, carousel.autoplayEnabled {
      let playing = carousel.isPlaying
      Button {
        carousel.setPlaying(!playing)
      } label: {
        (playing ? Ph.pause.fill : Ph.play.fill)
          .frame(width: 14, height: 14)
      }
      .buttonStyle(.variant(variant, size: size))
      .accessibilityLabel(playing ? Text("Pause slideshow") : Text("Play slideshow"))
    }
  }
}
