import SwiftUI

public enum AttachmentState: CaseIterable, Sendable {
  case idle, uploading, processing, error, done
}

public enum AttachmentSize: CaseIterable, Sendable {
  case `default`, sm, xs
}

public enum AttachmentOrientation: CaseIterable, Sendable {
  case horizontal, vertical
}

public enum AttachmentMediaVariant: CaseIterable, Sendable {
  case icon, document, image
}

struct AttachmentContext: Sendable {
  var state: AttachmentState = .done
  var size: AttachmentSize = .default
  var orientation: AttachmentOrientation = .horizontal
  var radius: CGFloat = Radius.xl2
}

enum AttachmentRole: Sendable {
  case other, media, content, actions, trigger
}

struct AttachmentRoleKey: LayoutValueKey {
  static let defaultValue = AttachmentRole.other
}

struct AttachmentParts: Equatable {
  var media = false
  var content = false
  var progress = false
}

struct AttachmentPartsKey: PreferenceKey {
  static var defaultValue: AttachmentParts { AttachmentParts() }

  static func reduce(value: inout AttachmentParts, nextValue: () -> AttachmentParts) {
    let next = nextValue()
    value.media = value.media || next.media
    value.content = value.content || next.content
    value.progress = value.progress || next.progress
  }
}

struct AttachmentGroupRow {
  let bounds: Anchor<CGRect>
  let inset: CGFloat
}

struct AttachmentGroupRowKey: PreferenceKey {
  static var defaultValue: [AttachmentGroupRow] { [] }

  static func reduce(value: inout [AttachmentGroupRow], nextValue: () -> [AttachmentGroupRow]) {
    value.append(contentsOf: nextValue())
  }
}

public struct Attachment<Content: View>: View {
  public typealias Size = AttachmentSize
  public typealias Orientation = AttachmentOrientation

  let state: AttachmentState
  let size: Size
  let orientation: Orientation
  let block: Bool
  let content: Content

  @State private var parts = AttachmentParts()
  @Environment(\.attachmentGrouped) private var grouped

  public init(
    state: AttachmentState = .done,
    size: Size = .default,
    orientation: Orientation = .horizontal,
    block: Bool = false,
    @ViewBuilder content: () -> Content
  ) {
    self.state = state
    self.size = size
    self.orientation = orientation
    self.block = block
    self.content = content()
  }

  public var body: some View {
    let vertical = orientation == .vertical
    let radius = grouped ? 0 : (size == .xs ? Radius.lg : Radius.xl2)
    let shape = RoundedRectangle(cornerRadius: radius, style: .continuous)
    let insets = insets
    let fill = grouped || (block && !vertical)
    AttachmentLayout(orientation: orientation, spacing: spacing, insets: insets, fill: fill) {
      content
    }
    .padding(insets)
    .frame(width: vertical ? (parts.content ? 120 : 96) : nil)
    .frame(minWidth: vertical ? nil : 160, alignment: .leading)
    .background {
      if !grouped && state != .idle {
        shape.fill(EsuissColor.muted)
      }
    }
    .overlay {
      if state == .idle && !grouped {
        shape.strokeBorder(EsuissColor.input, style: StrokeStyle(lineWidth: 1, dash: [4, 3]))
      }
    }
    .scaledFont(size == .default ? .sm : .xs)
    .foregroundStyle(EsuissColor.foreground)
    .environment(
      \.attachment,
      AttachmentContext(state: state, size: size, orientation: orientation, radius: radius)
    )
    .onPreferenceChange(AttachmentPartsKey.self) { parts = $0 }
    .transformPreference(AttachmentPartsKey.self) { $0 = AttachmentParts() }
    .anchorPreference(key: AttachmentGroupRowKey.self, value: .bounds) { anchor in
      grouped ? [AttachmentGroupRow(bounds: anchor, inset: separatorInset)] : []
    }
    .accessibilityElement(children: .contain)
  }

  private var spacing: CGFloat {
    switch size {
    case .default: orientation == .vertical ? 8 : 12
    case .sm: 10
    case .xs: 6
    }
  }

  private var insets: EdgeInsets {
    func edges(_ horizontal: CGFloat, _ vertical: CGFloat) -> EdgeInsets {
      EdgeInsets(top: vertical, leading: horizontal, bottom: vertical, trailing: horizontal)
    }
    switch size {
    case .default:
      if orientation == .vertical {
        return parts.content ? edges(10, 8) : parts.media ? edges(8, 8) : edges(16, 12)
      }
      return edges(16, 12)
    case .sm:
      return parts.content ? edges(8, 6) : parts.media ? edges(6, 6) : edges(0, 0)
    case .xs:
      return parts.content ? edges(6, 4) : parts.media ? edges(4, 4) : edges(0, 0)
    }
  }

  private var separatorInset: CGFloat {
    switch size {
    case .default: parts.media ? 64 : 16
    case .sm: parts.media ? 48 : 8
    case .xs: parts.media ? 38 : 6
    }
  }
}

struct AttachmentLayout: Layout {
  let orientation: AttachmentOrientation
  let spacing: CGFloat
  let insets: EdgeInsets
  let fill: Bool

  private struct Frames {
    var size: CGSize
    var frames: [CGRect]
  }

  private func arrange(_ proposal: ProposedViewSize, subviews: Subviews) -> Frames {
    orientation == .vertical ? vertical(proposal, subviews: subviews) : horizontal(proposal, subviews: subviews)
  }

  private func horizontal(_ proposal: ProposedViewSize, subviews: Subviews) -> Frames {
    let flow = subviews.filter { $0[AttachmentRoleKey.self] != .trigger && !floating($0) }
    var fixed: CGFloat = 0
    var flexible: [LayoutSubview] = []
    var ideal: CGFloat = 0
    for subview in flow {
      if subview[AttachmentRoleKey.self] == .content || subview[AttachmentRoleKey.self] == .other {
        flexible.append(subview)
        ideal += subview.sizeThatFits(.unspecified).width
      } else {
        fixed += subview.sizeThatFits(.unspecified).width
      }
    }
    let gaps = spacing * CGFloat(max(flow.count - 1, 0))
    let minimum = max(0, 160 - insets.leading - insets.trailing)
    var width: CGFloat
    if let available = proposal.width, available.isFinite {
      width = fill ? available : min(available, max(minimum, fixed + gaps + ideal))
    } else {
      width = max(minimum, fixed + gaps + ideal)
    }
    let share = flexible.isEmpty ? 0 : max(0, width - fixed - gaps) / CGFloat(flexible.count)
    var sizes: [CGSize] = []
    var height: CGFloat = 0
    for subview in flow {
      let role = subview[AttachmentRoleKey.self]
      let size = role == .content || role == .other
        ? subview.sizeThatFits(ProposedViewSize(width: share, height: nil))
        : subview.sizeThatFits(.unspecified)
      sizes.append(CGSize(width: role == .content || role == .other ? share : size.width, height: size.height))
      height = max(height, size.height)
    }
    if flexible.isEmpty {
      width = max(minimum, fixed + gaps)
      if fill, let available = proposal.width, available.isFinite { width = available }
    }
    var frames: [CGRect] = []
    var x: CGFloat = 0
    var index = 0
    for subview in subviews {
      if subview[AttachmentRoleKey.self] == .trigger || floating(subview) {
        frames.append(.zero)
        continue
      }
      let size = sizes[index]
      frames.append(CGRect(x: x, y: (height - size.height) / 2, width: size.width, height: size.height))
      x += size.width + spacing
      index += 1
    }
    return Frames(size: CGSize(width: width, height: height), frames: frames)
  }

  private func vertical(_ proposal: ProposedViewSize, subviews: Subviews) -> Frames {
    let width = proposal.width.flatMap { $0.isFinite ? $0 : nil } ?? 80
    var frames: [CGRect] = []
    var y: CGFloat = 0
    var count = 0
    for subview in subviews {
      if subview[AttachmentRoleKey.self] == .trigger || floating(subview) {
        frames.append(.zero)
        continue
      }
      if count > 0 { y += spacing }
      let size = subview.sizeThatFits(ProposedViewSize(width: width, height: nil))
      frames.append(CGRect(x: 0, y: y, width: width, height: size.height))
      y += size.height
      count += 1
    }
    return Frames(size: CGSize(width: width, height: y), frames: frames)
  }

  private func floating(_ subview: LayoutSubview) -> Bool {
    orientation == .vertical && subview[AttachmentRoleKey.self] == .actions
  }

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    arrange(proposal, subviews: subviews).size
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    let arranged = arrange(ProposedViewSize(width: bounds.width, height: bounds.height), subviews: subviews)
    let outer = CGRect(
      x: bounds.minX - insets.leading,
      y: bounds.minY - insets.top,
      width: bounds.width + insets.leading + insets.trailing,
      height: bounds.height + insets.top + insets.bottom
    )
    for (index, subview) in subviews.enumerated() {
      if subview[AttachmentRoleKey.self] == .trigger {
        subview.place(at: outer.origin, proposal: ProposedViewSize(outer.size))
        continue
      }
      if floating(subview) {
        let size = subview.sizeThatFits(.unspecified)
        subview.place(at: CGPoint(x: outer.maxX - 12 - size.width, y: outer.minY + 12), proposal: ProposedViewSize(size))
        continue
      }
      let frame = arranged.frames[index]
      subview.place(
        at: CGPoint(x: bounds.minX + frame.minX, y: bounds.minY + frame.minY),
        proposal: ProposedViewSize(frame.size)
      )
    }
  }
}

public struct AttachmentMedia<Content: View>: View {
  public typealias Variant = AttachmentMediaVariant

  let variant: Variant
  let content: Content

  @Environment(\.attachment) private var attachment

  public init(_ variant: Variant = .icon, @ViewBuilder content: () -> Content) {
    self.variant = variant
    self.content = content()
  }

  public var body: some View {
    let vertical = attachment.orientation == .vertical
    let radius = attachment.size == .xs || variant != .image ? Radius.sm : Radius.md
    let shape = RoundedRectangle(cornerRadius: radius, style: .continuous)
    let square = vertical && variant != .document
    Group {
      if variant == .document {
        content
          .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottom)
          .padding(.bottom, 6)
      } else {
        content
          .frame(maxWidth: .infinity, maxHeight: .infinity)
      }
    }
    .foregroundStyle(EsuissColor.mutedForeground)
    .environment(\.attachmentIconSize, iconSize)
    .frame(width: vertical ? nil : width, height: square ? nil : height)
    .frame(maxWidth: vertical ? .infinity : nil)
    .aspectRatio(square ? 1 : nil, contentMode: .fit)
    .background(variant == .image ? EsuissColor.muted : EsuissColor.background)
    .clipShape(shape)
    .overlay {
      if variant != .image {
        shape.strokeBorder(EsuissColor.border, lineWidth: 1)
      }
    }
    .layoutValue(key: AttachmentRoleKey.self, value: .media)
    .preference(key: AttachmentPartsKey.self, value: AttachmentParts(media: true))
  }

  private var width: CGFloat {
    switch attachment.size {
    case .default: 36
    case .sm: 32
    case .xs: 28
    }
  }

  private var height: CGFloat {
    switch attachment.size {
    case .default: 44
    case .sm: 40
    case .xs: 34
    }
  }

  private var iconSize: CGFloat {
    if attachment.orientation == .vertical { return 24 }
    return attachment.size == .xs ? 14 : 16
  }
}

extension AttachmentMedia where Content == AttachmentIcon {
  public init(icon: Image) {
    self.init(.icon) { AttachmentIcon(icon) }
  }
}

extension AttachmentMedia where Content == AttachmentImage {
  public init(image: Image) {
    self.init(.image) { AttachmentImage(image) }
  }

  public init(url: URL?) {
    self.init(.image) { AttachmentImage(url: url) }
  }
}

public struct AttachmentIcon: View {
  let image: Image

  @Environment(\.attachmentIconSize) private var size

  public init(_ image: Image) {
    self.image = image
  }

  public var body: some View {
    image
      .resizable()
      .scaledToFit()
      .frame(width: size, height: size)
      .accessibilityHidden(true)
  }
}

public struct AttachmentImage: View {
  let source: AvatarImage.Source

  public init(_ image: Image) {
    source = .image(image)
  }

  public init(url: URL?) {
    source = .url(url)
  }

  public var body: some View {
    Color.clear
      .overlay {
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
      .clipped()
  }
}

public struct AttachmentLabel: View {
  let text: Text
  let tint: Color

  @ScaledMetric(relativeTo: .caption2) private var fontSize: CGFloat = 9

  public init(_ text: LocalizedStringKey, tint: Color = EsuissColor.primary) {
    self.text = Text(text)
    self.tint = tint
  }

  public init(verbatim text: String, tint: Color = EsuissColor.primary) {
    self.text = Text(verbatim: text)
    self.tint = tint
  }

  public var body: some View {
    text
      .textCase(.uppercase)
      .font(.system(size: fontSize, weight: .semibold))
      .lineLimit(1)
      .fixedSize()
      .foregroundStyle(EsuissColor.primaryForeground)
      .padding(.horizontal, 4)
      .padding(.vertical, 2)
      .background(tint, in: RoundedRectangle(cornerRadius: Radius.xs, style: .continuous))
  }
}

public struct AttachmentContent<Content: View>: View {
  let content: Content

  @State private var progress = false
  @Environment(\.attachment) private var attachment

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(.horizontal, attachment.orientation == .vertical ? 4 : 0)
    .environment(\.attachmentHasProgress, progress)
    .onPreferenceChange(AttachmentPartsKey.self) { progress = $0.progress }
    .transformPreference(AttachmentPartsKey.self) { $0 = AttachmentParts(content: true) }
    .layoutValue(key: AttachmentRoleKey.self, value: .content)
  }
}

public struct AttachmentTitle: View {
  let text: Text

  @Environment(\.attachment) private var attachment
  @Environment(\.attachmentHasProgress) private var progress

  public init(_ text: LocalizedStringKey) {
    self.text = Text(text)
  }

  public init(verbatim text: String) {
    self.text = Text(verbatim: text)
  }

  public var body: some View {
    text
      .scaledFont(attachment.size == .default ? .base : .xs, weight: attachment.size == .default ? .regular : .semibold)
      .lineLimit(1)
      .truncationMode(.middle)
      .foregroundStyle(EsuissColor.foreground)
      .padding(.trailing, progress ? 48 : 0)
      .frame(maxWidth: .infinity, alignment: .leading)
  }
}

public struct AttachmentDescription: View {
  let text: Text

  @Environment(\.attachment) private var attachment

  public init(_ text: LocalizedStringKey) {
    self.text = Text(text)
  }

  public init(verbatim text: String) {
    self.text = Text(verbatim: text)
  }

  public var body: some View {
    text
      .scaledFont(attachment.size == .default ? .sm : .xs)
      .lineLimit(1)
      .foregroundStyle(attachment.state == .error ? EsuissColor.destructive : EsuissColor.mutedForeground)
      .padding(.top, 2)
      .frame(maxWidth: .infinity, alignment: .leading)
  }
}

public struct AttachmentProgress: View {
  let value: Double
  let total: Double
  let label: Text

  public init(value: Double, total: Double = 100, label: LocalizedStringKey = "Uploading") {
    self.value = value
    self.total = total
    self.label = Text(label)
  }

  public var body: some View {
    ProgressView(value: min(max(value, 0), total), total: total) {
      label
    }
    .progressViewStyle(AttachmentProgressStyle())
    .padding(.top, 8)
    .preference(key: AttachmentPartsKey.self, value: AttachmentParts(progress: true))
  }
}

private struct AttachmentProgressStyle: ProgressViewStyle {
  func makeBody(configuration: Configuration) -> some View {
    AttachmentProgressBar(fraction: configuration.fractionCompleted ?? 0)
  }
}

private struct AttachmentProgressBar: View {
  let fraction: Double

  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    let fraction = min(max(fraction, 0), 1)
    Capsule()
      .fill(EsuissColor.foreground.opacity(0.1))
      .frame(height: 4)
      .overlay(alignment: .leading) {
        GeometryReader { proxy in
          Capsule()
            .fill(EsuissColor.primary)
            .frame(width: proxy.size.width * fraction)
            .animation(reduceMotion ? nil : .spring(response: 0.4, dampingFraction: 1), value: fraction)
        }
      }
      .overlay(alignment: .topTrailing) {
        Text(fraction, format: .percent.precision(.fractionLength(0)))
          .scaledFont(.sm)
          .monospacedDigit()
          .foregroundStyle(EsuissColor.mutedForeground)
          .fixedSize()
          .alignmentGuide(.top) { $0[.bottom] + 8 }
          .accessibilityHidden(true)
      }
      .accessibilityElement()
      .accessibilityValue(Text(fraction, format: .percent.precision(.fractionLength(0))))
  }
}

public struct AttachmentActions<Content: View>: View {
  let content: Content

  @Environment(\.attachment) private var attachment

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: attachment.orientation == .vertical ? 4 : 0) {
      content
    }
    .zIndex(2)
    .layoutValue(key: AttachmentRoleKey.self, value: .actions)
  }
}

public struct AttachmentAction<Label: View>: View {
  let variant: VariantButtonStyle.Variant
  let action: () -> Void
  let label: Label

  @Environment(\.attachment) private var attachment

  public init(
    variant: VariantButtonStyle.Variant = .secondary,
    action: @escaping () -> Void,
    @ViewBuilder label: () -> Label
  ) {
    self.variant = variant
    self.action = action
    self.label = label()
  }

  public var body: some View {
    if variant == .link {
      Button(action: action) {
        label
      }
      .buttonStyle(VariantButtonStyle(.link, size: .sm, metrics: ButtonMetrics(horizontalPadding: 0, spacing: 4, iconSize: 16, textStyle: .base)))
    } else {
      let dimension = dimension
      let reach = max(0, (44 - dimension) / 2)
      Button(action: action) {
        label
      }
      .buttonStyle(AttachmentActionStyle(variant: variant, dimension: dimension, overlay: attachment.orientation == .vertical, iconSize: attachment.size == .xs ? 10 : 12))
      .padding(reach)
      .contentShape(Rectangle())
      .padding(-reach)
    }
  }

  private var dimension: CGFloat {
    switch attachment.size {
    case .default: 28
    case .sm: 24
    case .xs: 20
    }
  }
}

extension AttachmentAction where Label == AttachmentActionIcon {
  public init(
    _ title: LocalizedStringKey,
    icon: Image,
    variant: VariantButtonStyle.Variant = .secondary,
    action: @escaping () -> Void
  ) {
    self.init(variant: variant, action: action) { AttachmentActionIcon(title, image: icon) }
  }
}

extension AttachmentAction where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    variant: VariantButtonStyle.Variant = .link,
    action: @escaping () -> Void
  ) {
    self.init(variant: variant, action: action) { Text(title) }
  }
}

public struct AttachmentActionIcon: View {
  let title: Text
  let image: Image

  @Environment(\.attachmentActionIconSize) private var size

  public init(_ title: LocalizedStringKey, image: Image) {
    self.title = Text(title)
    self.image = image
  }

  public var body: some View {
    image
      .resizable()
      .scaledToFit()
      .frame(width: size, height: size)
      .accessibilityLabel(title)
  }
}

private struct AttachmentActionStyle: ButtonStyle {
  let variant: VariantButtonStyle.Variant
  let dimension: CGFloat
  let overlay: Bool
  let iconSize: CGFloat

  func makeBody(configuration: Configuration) -> some View {
    AttachmentActionBody(
      configuration: configuration,
      variant: variant,
      dimension: dimension,
      overlay: overlay,
      iconSize: iconSize
    )
  }
}

private struct AttachmentActionBody: View {
  let configuration: ButtonStyleConfiguration
  let variant: VariantButtonStyle.Variant
  let dimension: CGFloat
  let overlay: Bool
  let iconSize: CGFloat

  @Environment(\.isEnabled) private var isEnabled

  var body: some View {
    configuration.label
      .environment(\.attachmentActionIconSize, iconSize)
      .foregroundStyle(foreground)
      .frame(width: dimension, height: dimension)
      .background(background, in: Circle())
      .overlay {
        if variant == .outline && !overlay {
          Circle().strokeBorder(EsuissColor.border)
        }
      }
      .contentShape(Circle())
      .opacity(isEnabled ? (pressed ? 0.8 : 1) : 0.5)
  }

  private var pressed: Bool { configuration.isPressed }

  private var foreground: Color {
    if overlay { return EsuissColor.primaryForeground }
    switch variant {
    case .default: return EsuissColor.primaryForeground
    case .destructive: return EsuissColor.destructive
    case .tinted, .plain: return EsuissColor.primary
    case .secondary, .outline, .ghost, .link: return pressed ? EsuissColor.foreground : EsuissColor.mutedForeground
    }
  }

  private var background: Color {
    if overlay { return Palette.black.opacity(0.5) }
    switch variant {
    case .default: return EsuissColor.primary
    case .secondary: return EsuissColor.secondary
    case .tinted: return Color.adaptive(light: EsuissColor.primary.opacity(0.1), dark: EsuissColor.primary.opacity(0.2))
    case .destructive: return Color.adaptive(light: EsuissColor.destructive.opacity(0.1), dark: EsuissColor.destructive.opacity(0.2))
    case .outline: return EsuissColor.background
    case .ghost, .plain, .link: return .clear
    }
  }
}

public struct AttachmentTrigger: View {
  let label: Text
  let action: () -> Void

  @Environment(\.attachment) private var attachment

  public init(_ label: LocalizedStringKey, action: @escaping () -> Void) {
    self.label = Text(label)
    self.action = action
  }

  public var body: some View {
    Button(action: action) {
      Color.clear
    }
    .buttonStyle(AttachmentTriggerStyle(radius: attachment.radius))
    .accessibilityLabel(label)
    .zIndex(1)
    .layoutValue(key: AttachmentRoleKey.self, value: .trigger)
  }
}

private struct AttachmentTriggerStyle: ButtonStyle {
  let radius: CGFloat

  func makeBody(configuration: Configuration) -> some View {
    let shape = RoundedRectangle(cornerRadius: radius, style: .continuous)
    shape
      .fill(EsuissColor.background.opacity(configuration.isPressed ? 0.2 : 0))
      .contentShape(shape)
  }
}

public struct AttachmentGroup<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    VStack(alignment: .leading, spacing: 0) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .environment(\.attachmentGrouped, true)
    .overlayPreferenceValue(AttachmentGroupRowKey.self) { rows in
      GeometryReader { proxy in
        let rects = rows.map { (proxy[$0.bounds], $0.inset) }.sorted { $0.0.minY < $1.0.minY }
        ForEach(Array(rects.dropFirst().enumerated()), id: \.offset) { _, row in
          Rectangle()
            .fill(EsuissColor.border)
            .frame(width: max(row.0.width - row.1, 0), height: 1)
            .offset(x: row.0.minX + row.1, y: row.0.minY)
        }
      }
      .allowsHitTesting(false)
      .accessibilityHidden(true)
    }
    .transformPreference(AttachmentGroupRowKey.self) { $0 = [] }
    .background(EsuissColor.muted, in: shape)
    .clipShape(shape)
    .accessibilityElement(children: .contain)
  }
}

extension EnvironmentValues {
  @Entry var attachment = AttachmentContext()
  @Entry var attachmentGrouped = false
  @Entry var attachmentHasProgress = false
  @Entry var attachmentIconSize: CGFloat = 16
  @Entry var attachmentActionIconSize: CGFloat = 12
}
