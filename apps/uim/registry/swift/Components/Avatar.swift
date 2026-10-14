import SwiftUI

public enum AvatarSize: CaseIterable, Sendable {
  case sm, `default`, lg, xl

  var dimension: CGFloat {
    switch self {
    case .sm: 24
    case .default: 32
    case .lg: 40
    case .xl: 64
    }
  }

  var overlap: CGFloat {
    self == .xl ? 16 : 8
  }

  var textStyle: TextStyle {
    switch self {
    case .sm: .xs3
    case .default: .xs
    case .lg: .md
    case .xl: .xl2
    }
  }

  var fallbackIcon: CGFloat {
    switch self {
    case .sm: 14
    case .default: 20
    case .lg: 24
    case .xl: 40
    }
  }

  var badge: CGFloat {
    switch self {
    case .sm: 12
    case .default: 16
    case .lg: 18
    case .xl: 22
    }
  }

  var badgeIcon: CGFloat {
    switch self {
    case .sm: 0
    case .default: 8
    case .lg: 10
    case .xl: 12
    }
  }

  var countIcon: CGFloat {
    switch self {
    case .sm: 12
    case .default: 16
    case .lg: 20
    case .xl: 28
    }
  }
}

public struct Avatar<Content: View>: View {
  public typealias Size = AvatarSize

  let size: Size
  let content: Content

  @Environment(\.avatarGrouped) private var grouped

  public init(size: Size = .default, @ViewBuilder content: () -> Content) {
    self.size = size
    self.content = content()
  }

  public var body: some View {
    ZStack {
      content
    }
    .padding(grouped ? 2 : 0)
    .background {
      if grouped {
        Circle().fill(Color.surface)
      }
    }
    .frame(width: size.dimension, height: size.dimension)
    .environment(\.avatarSize, size)
    .environment(\.avatarGrouped, false)
    .accessibilityElement(children: .combine)
    .accessibilityAddTraits(.isImage)
    .layoutValue(key: AvatarOverlapKey.self, value: size.overlap)
  }
}

extension Avatar {
  public init<Fallback: View>(
    url: URL?,
    size: Size = .default,
    @ViewBuilder fallback: () -> Fallback
  ) where Content == TupleView<(AvatarFallback<Fallback>, AvatarImage)> {
    let fallback = fallback()
    self.init(size: size) {
      AvatarFallback { fallback }
      AvatarImage(url: url)
    }
  }

  public init(
    url: URL?,
    initials: String,
    size: Size = .default
  ) where Content == TupleView<(AvatarFallback<Text>, AvatarImage)> {
    self.init(size: size) {
      AvatarFallback(initials)
      AvatarImage(url: url)
    }
  }
}

public struct AvatarImage: View {
  enum Source {
    case url(URL?)
    case image(Image)
  }

  let source: Source

  public init(url: URL?) {
    source = .url(url)
  }

  public init(_ image: Image) {
    source = .image(image)
  }

  public var body: some View {
    Group {
      switch source {
      case .image(let image):
        image.resizable().scaledToFill()
      case .url(let url):
        AsyncImage(url: url) { phase in
          if let image = phase.image {
            image.resizable().scaledToFill()
          } else {
            Color.clear
          }
        }
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .clipShape(Circle())
  }
}

public struct AvatarFallback<Content: View>: View {
  let content: Content

  @Environment(\.avatarSize) private var size
  @Environment(\.colorScheme) private var colorScheme

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    content
      .textCase(.uppercase)
      .scaledFont(size.textStyle, weight: .semibold)
      .lineLimit(1)
      .minimumScaleFactor(0.5)
      .foregroundStyle(Color.onAccent)
      .environment(\.avatarIconSize, size.fallbackIcon)
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      .background(Color.labelSecondary.opacity(colorScheme == .dark ? 0.6 : 1), in: Circle())
  }
}

extension AvatarFallback where Content == Text {
  public init(_ initials: String) {
    self.init { Text(verbatim: initials) }
  }
}

extension AvatarFallback where Content == AvatarIcon {
  public init(icon: Image) {
    self.init { AvatarIcon(icon) }
  }
}

public struct AvatarIcon: View {
  let image: Image

  @Environment(\.avatarIconSize) private var size

  public init(_ image: Image) {
    self.image = image
  }

  public var body: some View {
    image
      .resizable()
      .scaledToFit()
      .frame(width: size, height: size)
  }
}

public struct AvatarBadge<Content: View>: View {
  let content: Content

  @Environment(\.avatarSize) private var size

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    ZStack {
      Circle().fill(Color.surface)
      Circle().fill(Color.accent).padding(2)
      if size != .sm {
        content
          .foregroundStyle(Color.onAccent)
          .environment(\.avatarIconSize, size.badgeIcon)
      }
    }
    .frame(width: size.badge, height: size.badge)
    .offset(x: 2, y: 2)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomTrailing)
  }
}

extension AvatarBadge where Content == EmptyView {
  public init() {
    self.init { EmptyView() }
  }
}

extension AvatarBadge where Content == AvatarIcon {
  public init(icon: Image) {
    self.init { AvatarIcon(icon) }
  }
}

public struct AvatarGroup<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    AvatarGroupLayout {
      content
    }
    .environment(\.avatarGrouped, true)
    .accessibilityElement(children: .contain)
  }
}

public struct AvatarGroupCount<Content: View>: View {
  let size: AvatarSize
  let content: Content

  public init(size: AvatarSize = .default, @ViewBuilder content: () -> Content) {
    self.size = size
    self.content = content()
  }

  public var body: some View {
    content
      .scaledFont(size.textStyle, weight: .semibold)
      .lineLimit(1)
      .minimumScaleFactor(0.5)
      .foregroundStyle(Color.label)
      .environment(\.avatarIconSize, size.countIcon)
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      .background(Color.surfaceSecondary, in: Circle())
      .padding(2)
      .background(Color.surface, in: Circle())
      .frame(width: size.dimension, height: size.dimension)
      .environment(\.avatarGrouped, false)
      .layoutValue(key: AvatarOverlapKey.self, value: size.overlap)
  }
}

extension AvatarGroupCount where Content == Text {
  public init(_ count: String, size: AvatarSize = .default) {
    self.init(size: size) { Text(verbatim: count) }
  }
}

struct AvatarOverlapKey: LayoutValueKey {
  static let defaultValue: CGFloat = 8
}

struct AvatarGroupLayout: Layout {
  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    var width: CGFloat = 0
    var height: CGFloat = 0
    for (index, subview) in subviews.enumerated() {
      let size = subview.sizeThatFits(.unspecified)
      width += size.width - (index > 0 ? subview[AvatarOverlapKey.self] : 0)
      height = max(height, size.height)
    }
    return CGSize(width: max(0, width), height: height)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    var x = bounds.minX
    for (index, subview) in subviews.enumerated() {
      let size = subview.sizeThatFits(.unspecified)
      if index > 0 {
        x -= subview[AvatarOverlapKey.self]
      }
      subview.place(at: CGPoint(x: x, y: bounds.midY), anchor: .leading, proposal: ProposedViewSize(size))
      x += size.width
    }
  }
}

extension EnvironmentValues {
  @Entry var avatarSize: AvatarSize = .default
  @Entry var avatarGrouped = false
  @Entry var avatarIconSize: CGFloat = 20
}
