import SwiftUI

public enum BubbleVariant: CaseIterable, Sendable {
  case `default`, secondary, muted, tinted, outline, ghost, destructive

  var hasTail: Bool {
    self != .ghost && self != .outline
  }
}

public enum BubbleAlign: CaseIterable, Sendable {
  case start, end
}

public enum BubbleReactionsSide: CaseIterable, Sendable {
  case top, bottom
}

struct BubbleRunEntry: Equatable {
  let id: UUID
  let align: BubbleAlign
  let tail: Bool
}

enum BubbleRun {
  static func tails(_ entries: [BubbleRunEntry]) -> Set<UUID> {
    var result = Set<UUID>()
    for (index, entry) in entries.enumerated() where entry.tail {
      let next = index + 1 < entries.count ? entries[index + 1] : nil
      if next?.align != entry.align {
        result.insert(entry.id)
      }
    }
    return result
  }
}

struct BubbleRunKey: PreferenceKey {
  static var defaultValue: [BubbleRunEntry] { [] }

  static func reduce(value: inout [BubbleRunEntry], nextValue: () -> [BubbleRunEntry]) {
    value.append(contentsOf: nextValue())
  }
}

struct BubbleRunScope: ViewModifier {
  @State private var tails: Set<UUID>?

  func body(content: Content) -> some View {
    content
      .environment(\.bubbleTails, tails)
      .onPreferenceChange(BubbleRunKey.self) { entries in
        tails = BubbleRun.tails(entries)
      }
      .transformPreference(BubbleRunKey.self) { $0 = [] }
  }
}

struct BubbleStyle: Sendable {
  var variant: BubbleVariant = .default
  var align: BubbleAlign = .start
  var tail = false
}

public struct BubbleGroup<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .modifier(BubbleRunScope())
  }
}

public struct Bubble<Content: View>: View {
  public typealias Variant = BubbleVariant
  public typealias Align = BubbleAlign

  let variant: Variant
  let align: Align
  let onLongPress: (() -> Void)?
  let content: Content

  @State private var id = UUID()
  @Environment(\.messageAlign) private var messageAlign
  @Environment(\.bubbleTails) private var tails

  public init(
    variant: Variant = .default,
    align: Align = .start,
    onLongPress: (() -> Void)? = nil,
    @ViewBuilder content: () -> Content
  ) {
    self.variant = variant
    self.align = align
    self.onLongPress = onLongPress
    self.content = content()
  }

  public var body: some View {
    let resolved: Align = messageAlign == .end ? .end : align
    let tail = variant.hasTail && (tails.map { $0.contains(id) } ?? true)
    BubbleLayout(align: resolved, fraction: variant == .ghost ? 1 : 0.8) {
      content
    }
    .environment(\.bubbleStyle, BubbleStyle(variant: variant, align: resolved, tail: tail))
    .modifier(BubbleLongPress(action: onLongPress))
    .frame(maxWidth: .infinity, alignment: resolved == .end ? .trailing : .leading)
    .preference(key: BubbleRunKey.self, value: [BubbleRunEntry(id: id, align: resolved, tail: variant.hasTail)])
    .preference(key: MessageGhostKey.self, value: variant == .ghost)
  }
}

private struct BubbleLongPress: ViewModifier {
  let action: (() -> Void)?

  func body(content: Content) -> some View {
    if let action {
      content
        .contentShape(Rectangle())
        .onLongPressGesture(minimumDuration: 0.5, maximumDistance: 10, perform: action)
        .accessibilityAction(named: Text("Show actions"), action)
    } else {
      content
    }
  }
}

public struct BubbleContent<Content: View>: View {
  let action: (() -> Void)?
  let content: Content

  @Environment(\.bubbleStyle) private var style

  public init(@ViewBuilder content: () -> Content) {
    action = nil
    self.content = content()
  }

  public init(action: @escaping () -> Void, @ViewBuilder content: () -> Content) {
    self.action = action
    self.content = content()
  }

  public var body: some View {
    if let action {
      Button(action: action) {
        content
      }
      .buttonStyle(BubbleContentButtonStyle(style: style))
    } else {
      BubbleContentBody(style: style, pressed: false) {
        content
      }
    }
  }
}

extension BubbleContent where Content == Text {
  public init(_ text: LocalizedStringKey) {
    self.init { Text(text) }
  }

  public init(verbatim text: String) {
    self.init { Text(verbatim: text) }
  }
}

private struct BubbleContentButtonStyle: ButtonStyle {
  let style: BubbleStyle

  func makeBody(configuration: Configuration) -> some View {
    BubbleContentBody(style: style, pressed: configuration.isPressed) {
      configuration.label
    }
  }
}

private struct BubbleContentBody<Content: View>: View {
  let style: BubbleStyle
  let pressed: Bool
  let content: Content

  @Environment(\.screenBackground) private var surface

  init(style: BubbleStyle, pressed: Bool, @ViewBuilder content: () -> Content) {
    self.style = style
    self.pressed = pressed
    self.content = content()
  }

  var body: some View {
    let ghost = style.variant == .ghost
    let shape = BubbleShape(tail: style.tail, mirrored: style.align == .end)
    content
      .scaledTextStyle(.base)
      .foregroundStyle(foreground)
      .multilineTextAlignment(.leading)
      .fixedSize(horizontal: false, vertical: true)
      .padding(.horizontal, ghost ? 0 : 15)
      .padding(.vertical, ghost ? 0 : 7)
      .background {
        if ghost {
          Rectangle().fill(pressed ? Color.itemPressed : .clear)
        } else {
          shape.fill(background)
        }
      }
      .overlay {
        if style.variant == .outline {
          RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
            .strokeBorder(Color.separator, lineWidth: 1)
        }
      }
      .contentShape(shape)
  }

  private var foreground: Color {
    switch style.variant {
    case .default: .onAccent
    case .destructive: .danger
    case .secondary, .muted, .tinted, .outline, .ghost: .label
    }
  }

  private var background: Color {
    switch style.variant {
    case .default: pressed ? .accentPressed : .accent
    case .secondary: pressed ? .controlPressed : .control
    case .muted: pressed ? .surfaceTertiary : .surfaceSecondary
    case .tinted: pressed ? .accentSurfacePressed : .accentSurface
    case .outline: pressed ? .control : surface
    case .ghost: pressed ? .itemPressed : .clear
    case .destructive: pressed ? .dangerSurfacePressed : .dangerSurface
    }
  }
}

struct BubbleShape: Shape {
  let tail: Bool
  let mirrored: Bool

  func path(in rect: CGRect) -> Path {
    let body = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous).path(in: rect)
    guard tail else { return body }
    let originX = mirrored ? rect.maxX + 6.9 - 20 : rect.minX - 6.9
    let originY = rect.maxY - 20
    let points = BubbleShape.tailPoints.map { point in
      CGPoint(x: originX + (mirrored ? 20 - point.x : point.x), y: originY + point.y)
    }
    var tailPath = Path()
    tailPath.addLines(points)
    tailPath.closeSubpath()
    return body.union(tailPath)
  }

  static let tailPoints: [CGPoint] = {
    var points = [CGPoint(x: 7, y: 0), CGPoint(x: 20, y: 0), CGPoint(x: 20, y: 4)]
    for step in 1...12 {
      let angle = Double(step) / 12 * .pi / 2
      points.append(CGPoint(x: 4 + 16 * cos(angle), y: 4 + 16 * sin(angle)))
    }
    points.append(CGPoint(x: 0, y: 20))
    points.append(CGPoint(x: 0, y: 19.54))
    let start = atan2(9.54, 3.0)
    for step in 1...12 {
      let angle = start * (1 - Double(step) / 12)
      points.append(CGPoint(x: -3 + 10 * cos(angle), y: 10 + 10 * sin(angle)))
    }
    return points
  }()
}

struct BubbleReactionsPlacement: Equatable, Sendable {
  let side: BubbleReactionsSide
  let align: BubbleAlign
}

struct BubbleReactionsKey: LayoutValueKey {
  static let defaultValue: BubbleReactionsPlacement? = nil
}

public struct BubbleReactions<Content: View>: View {
  let side: BubbleReactionsSide
  let align: BubbleAlign
  let content: Content

  @Environment(\.screenBackground) private var surface

  public init(
    side: BubbleReactionsSide = .bottom,
    align: BubbleAlign = .end,
    @ViewBuilder content: () -> Content
  ) {
    self.side = side
    self.align = align
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 4) {
      content
    }
    .scaledFont(.sm)
    .lineLimit(1)
    .fixedSize()
    .foregroundStyle(Color.label)
    .padding(.horizontal, 6)
    .padding(.vertical, 2)
    .background(Color.surfaceSecondary, in: Capsule())
    .background {
      Capsule().fill(surface).padding(-3)
    }
    .accessibilityElement(children: .combine)
    .layoutValue(key: BubbleReactionsKey.self, value: BubbleReactionsPlacement(side: side, align: align))
  }
}

extension BubbleReactions where Content == Text {
  public init(_ text: LocalizedStringKey, side: BubbleReactionsSide = .bottom, align: BubbleAlign = .end) {
    self.init(side: side, align: align) { Text(text) }
  }

  public init(verbatim text: String, side: BubbleReactionsSide = .bottom, align: BubbleAlign = .end) {
    self.init(side: side, align: align) { Text(verbatim: text) }
  }
}

struct BubbleLayout: Layout {
  let align: BubbleAlign
  let fraction: CGFloat

  private let spacing: CGFloat = 4
  private let reactionMargin: CGFloat = 20

  private func measure(_ proposal: ProposedViewSize, subviews: Subviews) -> (sizes: [CGSize], width: CGFloat, height: CGFloat) {
    let limit = proposal.width.map { $0 * fraction }
    var sizes: [CGSize] = []
    var width: CGFloat = 0
    var height: CGFloat = 0
    var count = 0
    for subview in subviews {
      if subview[BubbleReactionsKey.self] != nil {
        sizes.append(subview.sizeThatFits(.unspecified))
        continue
      }
      let size = subview.sizeThatFits(ProposedViewSize(width: limit, height: nil))
      sizes.append(size)
      width = max(width, size.width)
      height += size.height + (count > 0 ? spacing : 0)
      count += 1
    }
    return (sizes, width, height)
  }

  private func margins(_ subviews: Subviews) -> (top: CGFloat, bottom: CGFloat) {
    let sides = subviews.compactMap { $0[BubbleReactionsKey.self]?.side }
    return (sides.contains(.top) ? reactionMargin : 0, sides.contains(.bottom) ? reactionMargin : 0)
  }

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let measured = measure(proposal, subviews: subviews)
    let margins = margins(subviews)
    return CGSize(width: measured.width, height: measured.height + margins.top + margins.bottom)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    let measured = measure(proposal, subviews: subviews)
    let margins = margins(subviews)
    let box = CGRect(
      x: bounds.minX,
      y: bounds.minY + margins.top,
      width: bounds.width,
      height: measured.height
    )
    var y = box.minY
    for (index, subview) in subviews.enumerated() {
      let size = measured.sizes[index]
      if let placement = subview[BubbleReactionsKey.self] {
        let x = placement.align == .end ? box.maxX - 12 - size.width : box.minX + 12
        let top = placement.side == .bottom ? box.maxY - size.height * 0.25 : box.minY - size.height * 0.75
        subview.place(at: CGPoint(x: x, y: top), proposal: ProposedViewSize(size))
        continue
      }
      let x = align == .end ? box.maxX - size.width : box.minX
      subview.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(width: size.width, height: size.height))
      y += size.height + spacing
    }
  }
}

extension EnvironmentValues {
  @Entry var bubbleStyle = BubbleStyle()
  @Entry var bubbleTails: Set<UUID>? = nil
}
