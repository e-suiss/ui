import SwiftUI

public typealias MessageAlign = BubbleAlign

struct MessageGhostKey: PreferenceKey {
  static let defaultValue = false

  static func reduce(value: inout Bool, nextValue: () -> Bool) {
    value = value || nextValue()
  }
}

struct MessageFooterKey: PreferenceKey {
  static let defaultValue: CGFloat = 0

  static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
    value = max(value, nextValue())
  }
}

struct MessageAvatarKey: LayoutValueKey {
  static let defaultValue = false
}

public struct MessageGroup<Content: View>: View {
  let spacing: CGFloat
  let content: Content

  public init(spacing: CGFloat = 8, @ViewBuilder content: () -> Content) {
    self.spacing = spacing
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: spacing) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

public struct Message<Content: View>: View {
  public typealias Align = MessageAlign

  let align: Align
  let content: Content

  @State private var footer: CGFloat = 0
  @State private var ghost = false

  public init(align: Align = .start, @ViewBuilder content: () -> Content) {
    self.align = align
    self.content = content()
  }

  public var body: some View {
    MessageLayout(align: align, lift: footer > 0 ? footer + 10 : 0) {
      content
    }
    .environment(\.messageAlign, align)
    .environment(\.messageGhost, ghost)
    .onPreferenceChange(MessageFooterKey.self) { footer = $0 }
    .onPreferenceChange(MessageGhostKey.self) { ghost = $0 }
    .transformPreference(MessageFooterKey.self) { $0 = 0 }
    .transformPreference(MessageGhostKey.self) { $0 = false }
    .frame(maxWidth: .infinity)
    .accessibilityElement(children: .contain)
  }
}

public struct MessageAvatar<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    content
      .frame(minWidth: 32, minHeight: 32)
      .background(Color.surfaceSecondary, in: Circle())
      .clipShape(Circle())
      .fixedSize()
      .layoutValue(key: MessageAvatarKey.self, value: true)
  }
}

public struct MessageContent<Content: View>: View {
  let content: Content

  @Environment(\.messageAlign) private var align

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    let end = align == .end
    VStack(alignment: end ? .trailing : .leading, spacing: 10) {
      content
    }
    .frame(maxWidth: .infinity, alignment: end ? .trailing : .leading)
    .modifier(BubbleRunScope())
  }
}

public struct MessageHeader<Content: View>: View {
  let content: Content

  @Environment(\.messageAlign) private var align
  @Environment(\.messageGhost) private var ghost

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 4) {
      content
    }
    .scaledFont(.xs)
    .lineLimit(1)
    .foregroundStyle(Color.labelSecondary)
    .padding(.horizontal, ghost ? 0 : 14)
    .accessibilityElement(children: .combine)
  }
}

extension MessageHeader where Content == Text {
  public init(_ text: LocalizedStringKey) {
    self.init { Text(text) }
  }

  public init(verbatim text: String) {
    self.init { Text(verbatim: text) }
  }
}

public struct MessageFooter<Content: View>: View {
  let content: Content

  @Environment(\.messageAlign) private var align
  @Environment(\.messageGhost) private var ghost

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 4) {
      content
    }
    .scaledFont(.xs)
    .lineLimit(1)
    .foregroundStyle(Color.labelSecondary)
    .padding(.horizontal, ghost ? 0 : 14)
    .background {
      GeometryReader { proxy in
        Color.clear.preference(key: MessageFooterKey.self, value: proxy.size.height)
      }
    }
    .accessibilityElement(children: .combine)
  }
}

extension MessageFooter where Content == Text {
  public init(_ text: LocalizedStringKey) {
    self.init { Text(text) }
  }

  public init(verbatim text: String) {
    self.init { Text(verbatim: text) }
  }
}

struct MessageLayout: Layout {
  let align: MessageAlign
  let lift: CGFloat

  private let spacing: CGFloat = 8

  private func avatarWidth(_ subviews: Subviews) -> CGFloat {
    subviews.filter { $0[MessageAvatarKey.self] }.map { $0.sizeThatFits(.unspecified).width }.max() ?? 0
  }

  private func remaining(_ proposal: ProposedViewSize, subviews: Subviews) -> CGFloat? {
    let avatar = avatarWidth(subviews)
    return proposal.width.map { max(0, $0 - (avatar > 0 ? avatar + spacing : 0)) }
  }

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let width = remaining(proposal, subviews: subviews)
    var height: CGFloat = 0
    var contentWidth: CGFloat = 0
    for subview in subviews {
      if subview[MessageAvatarKey.self] {
        height = max(height, subview.sizeThatFits(.unspecified).height)
      } else {
        let size = subview.sizeThatFits(ProposedViewSize(width: width, height: nil))
        height = max(height, size.height)
        contentWidth = max(contentWidth, size.width)
      }
    }
    let avatar = avatarWidth(subviews)
    return CGSize(width: proposal.width ?? contentWidth + (avatar > 0 ? avatar + spacing : 0), height: height)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    let avatar = avatarWidth(subviews)
    let offset = avatar > 0 ? avatar + spacing : 0
    let width = max(0, bounds.width - offset)
    for subview in subviews {
      if subview[MessageAvatarKey.self] {
        let size = subview.sizeThatFits(.unspecified)
        let x = align == .end ? bounds.maxX - size.width : bounds.minX
        let y = max(bounds.minY, bounds.maxY - size.height - lift)
        subview.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(size))
      } else {
        let x = align == .end ? bounds.minX : bounds.minX + offset
        subview.place(at: CGPoint(x: x, y: bounds.minY), proposal: ProposedViewSize(width: width, height: nil))
      }
    }
  }
}

extension EnvironmentValues {
  @Entry var messageAlign: MessageAlign? = nil
  @Entry var messageGhost = false
}
