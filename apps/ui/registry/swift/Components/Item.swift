import SwiftUI

public enum ItemVariant: CaseIterable, Sendable {
  case `default`, outline, muted
}

public enum ItemSize: CaseIterable, Sendable {
  case `default`, sm, xs

  var horizontalPadding: CGFloat {
    switch self {
    case .default: 16
    case .sm: 14
    case .xs: 12
    }
  }

  var verticalPadding: CGFloat {
    switch self {
    case .default: 14
    case .sm: 12
    case .xs: 10
    }
  }

  var gap: CGFloat {
    self == .xs ? 10 : 14
  }

  var groupGap: CGFloat {
    switch self {
    case .default: 16
    case .sm: 10
    case .xs: 8
    }
  }

  var mediaImage: CGFloat {
    switch self {
    case .default: 40
    case .sm: 32
    case .xs: 24
    }
  }
}

public enum ItemGroupVariant: CaseIterable, Sendable {
  case `default`, inset
}

extension EnvironmentValues {
  @Entry var itemSize: ItemSize = .default
  @Entry var itemGroupInset = false
  @Entry var itemHasDescription = false
}

struct ItemGapKey: PreferenceKey {
  static var defaultValue: CGFloat? { nil }

  static func reduce(value: inout CGFloat?, nextValue: () -> CGFloat?) {
    guard let next = nextValue() else { return }
    value = min(value ?? next, next)
  }
}

struct ItemDescriptionKey: PreferenceKey {
  static var defaultValue: Bool { false }

  static func reduce(value: inout Bool, nextValue: () -> Bool) {
    value = value || nextValue()
  }
}

enum ItemSlot: Sendable {
  case media, content, actions, fullRow, other
}

struct ItemSlotKey: LayoutValueKey {
  static let defaultValue = ItemSlot.other
}

public struct ItemGroup<Content: View>: View {
  let variant: ItemGroupVariant
  let content: Content

  @State private var gap: CGFloat?

  public init(_ variant: ItemGroupVariant = .default, @ViewBuilder content: () -> Content) {
    self.variant = variant
    self.content = content()
  }

  public var body: some View {
    let inset = variant == .inset
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    VStack(alignment: .leading, spacing: inset ? 0 : gap ?? ItemSize.default.groupGap) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .environment(\.itemGroupInset, inset)
    .onPreferenceChange(ItemGapKey.self) { gap = $0 }
    .transformPreference(ItemGapKey.self) { $0 = nil }
    .background(inset ? Color.surfaceSecondary : .clear, in: shape)
    .clipShape(inset ? AnyShape(shape) : AnyShape(Rectangle()))
    .accessibilityElement(children: .contain)
  }
}

public struct ItemSeparator: View {
  @Environment(\.itemGroupInset) private var inset

  public init() {}

  public var body: some View {
    Separator()
      .padding(.vertical, inset ? 0 : 8)
      .padding(.leading, inset ? 16 : 0)
  }
}

public struct Item<Content: View>: View {
  let variant: ItemVariant
  let size: ItemSize
  let action: (() -> Void)?
  let content: Content

  @State private var hasDescription = false
  @Environment(\.itemGroupInset) private var inset

  public init(
    _ variant: ItemVariant = .default,
    size: ItemSize = .default,
    action: (() -> Void)? = nil,
    @ViewBuilder content: () -> Content
  ) {
    self.variant = variant
    self.size = size
    self.action = action
    self.content = content()
  }

  public var body: some View {
    Group {
      if let action {
        Button(action: action) {
          surface
        }
        .buttonStyle(ItemButtonStyle(variant: variant, inset: inset))
      } else {
        surface.background(ItemBackground(variant: variant, inset: inset, pressed: false))
      }
    }
    .preference(key: ItemGapKey.self, value: size.groupGap)
  }

  private var surface: some View {
    ItemLayout(gap: size.gap, topAlignMedia: hasDescription) {
      content
    }
    .scaledFont(.base)
    .foregroundStyle(Color.label)
    .padding(.horizontal, size.horizontalPadding)
    .padding(.vertical, size.verticalPadding)
    .frame(maxWidth: .infinity, alignment: .leading)
    .environment(\.itemSize, size)
    .environment(\.itemHasDescription, hasDescription)
    .onPreferenceChange(ItemDescriptionKey.self) { hasDescription = $0 }
    .contentShape(Rectangle())
  }
}

private struct ItemBackground: View {
  let variant: ItemVariant
  let inset: Bool
  let pressed: Bool

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: inset ? 0 : Radius.xl, style: .continuous)
    ZStack {
      shape.fill(variant == .muted ? Color.surfaceSecondary.opacity(0.5) : .clear)
      if pressed {
        shape.fill(Color.itemPressed)
      }
      if variant == .outline {
        shape.strokeBorder(Color.separator)
      }
    }
  }
}

private struct ItemButtonStyle: ButtonStyle {
  let variant: ItemVariant
  let inset: Bool

  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .background(ItemBackground(variant: variant, inset: inset, pressed: configuration.isPressed && isEnabled))
      .opacity(isEnabled ? 1 : 0.5)
  }
}

struct ItemLayout: Layout {
  var gap: CGFloat
  var topAlignMedia: Bool

  private struct Line {
    var indices: [Int]
    var full: Bool
  }

  private func lines(_ subviews: Subviews) -> [Line] {
    var result: [Line] = []
    var current: [Int] = []
    for index in subviews.indices {
      if subviews[index][ItemSlotKey.self] == .fullRow {
        if !current.isEmpty { result.append(Line(indices: current, full: false)) }
        current = []
        result.append(Line(indices: [index], full: true))
      } else {
        current.append(index)
      }
    }
    if !current.isEmpty { result.append(Line(indices: current, full: false)) }
    return result
  }

  private func widths(_ line: Line, subviews: Subviews, width: CGFloat?) -> [CGFloat] {
    if line.full {
      return [width ?? subviews[line.indices[0]].sizeThatFits(.unspecified).width]
    }
    let spacing = gap * CGFloat(max(line.indices.count - 1, 0))
    let flexible = line.indices.first { subviews[$0][ItemSlotKey.self] == .content }
    var fixed: [Int: CGFloat] = [:]
    for index in line.indices where index != flexible {
      fixed[index] = subviews[index].sizeThatFits(.unspecified).width
    }
    let used = fixed.values.reduce(0, +) + spacing
    return line.indices.map { index in
      if index == flexible {
        if let width { return max(width - used, 0) }
        return subviews[index].sizeThatFits(.unspecified).width
      }
      return fixed[index] ?? 0
    }
  }

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    var height: CGFloat = 0
    var widest: CGFloat = 0
    let all = lines(subviews)
    for (position, line) in all.enumerated() {
      let sizes = widths(line, subviews: subviews, width: proposal.width)
      var lineHeight: CGFloat = 0
      for (index, width) in zip(line.indices, sizes) {
        lineHeight = max(lineHeight, subviews[index].sizeThatFits(ProposedViewSize(width: width, height: nil)).height)
      }
      let spacing = gap * CGFloat(max(line.indices.count - 1, 0))
      widest = max(widest, sizes.reduce(0, +) + (line.full ? 0 : spacing))
      height += lineHeight + (position > 0 ? gap : 0)
    }
    return CGSize(width: proposal.width ?? widest, height: height)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    var y = bounds.minY
    for line in lines(subviews) {
      let sizes = widths(line, subviews: subviews, width: bounds.width)
      var heights: [CGFloat] = []
      for (index, width) in zip(line.indices, sizes) {
        heights.append(subviews[index].sizeThatFits(ProposedViewSize(width: width, height: nil)).height)
      }
      let lineHeight = heights.max() ?? 0
      var x = bounds.minX
      for (offset, index) in line.indices.enumerated() {
        let width = sizes[offset]
        let height = heights[offset]
        let top = topAlignMedia && subviews[index][ItemSlotKey.self] == .media
        let originY = top ? y + 2 : y + (lineHeight - height) / 2
        subviews[index].place(
          at: CGPoint(x: x, y: originY),
          anchor: .topLeading,
          proposal: ProposedViewSize(width: width, height: height)
        )
        x += width + gap
      }
      y += lineHeight + gap
    }
  }
}

public enum ItemMediaVariant: CaseIterable, Sendable {
  case `default`, icon, image
}

public struct ItemMedia<Content: View>: View {
  let variant: ItemMediaVariant
  let content: Content

  @Environment(\.itemSize) private var size

  public init(_ variant: ItemMediaVariant = .default, @ViewBuilder content: () -> Content) {
    self.variant = variant
    self.content = content()
  }

  public var body: some View {
    Group {
      switch variant {
      case .default:
        HStack(spacing: 8) { content }
      case .icon:
        content.frame(width: 16, height: 16)
      case .image:
        content
          .scaledToFill()
          .frame(width: size.mediaImage, height: size.mediaImage)
          .clipShape(RoundedRectangle(cornerRadius: size == .xs ? Radius.sm : Radius.md, style: .continuous))
      }
    }
    .accessibilityHidden(variant != .default)
    .layoutValue(key: ItemSlotKey.self, value: .media)
  }
}

public struct ItemContent<Content: View>: View {
  let content: Content

  @Environment(\.itemSize) private var size

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: size == .xs ? 2 : 4) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .layoutValue(key: ItemSlotKey.self, value: .content)
  }
}

public struct ItemTitle<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 8) {
      content
    }
    .scaledTextStyle(.base, weight: .semibold)
    .foregroundStyle(Color.label)
    .lineLimit(1)
    .accessibilityElement(children: .combine)
  }
}

extension ItemTitle where Content == Text {
  public init(_ title: LocalizedStringKey) {
    self.init { Text(title) }
  }

  public init(verbatim title: String) {
    self.init { Text(verbatim: title) }
  }
}

public struct ItemDescription: View {
  let text: Text

  public init(_ description: LocalizedStringKey) {
    text = Text(description)
  }

  public init(verbatim description: String) {
    text = Text(verbatim: description)
  }

  public var body: some View {
    text
      .scaledTextStyle(.sm)
      .foregroundStyle(Color.labelSecondary)
      .multilineTextAlignment(.leading)
      .lineLimit(2)
      .fixedSize(horizontal: false, vertical: true)
      .preference(key: ItemDescriptionKey.self, value: true)
  }
}

public struct ItemActions<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 8) {
      content
    }
    .fixedSize()
    .layoutValue(key: ItemSlotKey.self, value: .actions)
  }
}

public struct ItemHeader<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    SpaceBetween(spacing: 8) {
      content
    }
    .frame(maxWidth: .infinity)
    .layoutValue(key: ItemSlotKey.self, value: .fullRow)
  }
}

public struct ItemFooter<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    SpaceBetween(spacing: 8) {
      content
    }
    .frame(maxWidth: .infinity)
    .layoutValue(key: ItemSlotKey.self, value: .fullRow)
  }
}

struct SpaceBetween: Layout {
  var spacing: CGFloat

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let sizes = subviews.map { $0.sizeThatFits(.unspecified) }
    let natural = sizes.reduce(0) { $0 + $1.width } + spacing * CGFloat(max(subviews.count - 1, 0))
    return CGSize(width: proposal.width ?? natural, height: sizes.map(\.height).max() ?? 0)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    let sizes = subviews.map { $0.sizeThatFits(.unspecified) }
    let total = sizes.reduce(0) { $0 + $1.width }
    let gaps = CGFloat(max(subviews.count - 1, 0))
    let gap = subviews.count > 1 ? max(spacing, (bounds.width - total) / gaps) : 0
    var x = bounds.minX
    for (index, view) in subviews.enumerated() {
      let size = sizes[index]
      view.place(
        at: CGPoint(x: x, y: bounds.midY - size.height / 2),
        anchor: .topLeading,
        proposal: ProposedViewSize(size)
      )
      x += size.width + gap
    }
  }
}
