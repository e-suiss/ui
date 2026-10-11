import PhosphorSwift
import SwiftUI

extension EnvironmentValues {
  @Entry var headerProgress: CGFloat?
  @Entry var headerReport: ((CGFloat) -> Void)?
}

enum HeaderMath {
  static func progress(minY: CGFloat, height: CGFloat) -> CGFloat {
    guard height > 0 else { return 0 }
    return min(max(-minY / height, 0), 1)
  }
}

public struct Header<Title: View, Leading: View, Trailing: View>: View {
  let title: Title
  let leading: Leading
  let trailing: Trailing

  @Environment(\.headerProgress) private var progress
  @Environment(\.screenBackground) private var background

  public init(
    @ViewBuilder title: () -> Title,
    @ViewBuilder leading: () -> Leading,
    @ViewBuilder trailing: () -> Trailing
  ) {
    self.title = title()
    self.leading = leading()
    self.trailing = trailing()
  }

  public var body: some View {
    HeaderLayout {
      HStack(spacing: 0) { leading }
        .frame(maxHeight: .infinity)
      ZStack { title }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
      HStack(spacing: 0) { trailing }
        .frame(maxHeight: .infinity)
    }
    .padding(.horizontal, 8)
    .frame(height: 44)
    .frame(maxWidth: .infinity)
    .background(background.ignoresSafeArea(.container, edges: .top))
    .overlay(alignment: .bottom) {
      Color.separator
        .frame(height: 1)
        .opacity(progress ?? 0)
    }
    .accessibilityElement(children: .contain)
    .accessibilityAddTraits(.isHeader)
  }
}

extension Header where Leading == EmptyView {
  public init(@ViewBuilder title: () -> Title, @ViewBuilder trailing: () -> Trailing) {
    self.init(title: title, leading: { EmptyView() }, trailing: trailing)
  }
}

extension Header where Trailing == EmptyView {
  public init(@ViewBuilder title: () -> Title, @ViewBuilder leading: () -> Leading) {
    self.init(title: title, leading: leading, trailing: { EmptyView() })
  }
}

extension Header where Leading == EmptyView, Trailing == EmptyView {
  public init(@ViewBuilder title: () -> Title) {
    self.init(title: title, leading: { EmptyView() }, trailing: { EmptyView() })
  }
}

struct HeaderLayout: Layout {
  var spacing: CGFloat = 8
  var minSide: CGFloat = 44

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let ideal = subviews.reduce(0) { $0 + $1.sizeThatFits(.unspecified).width }
    return CGSize(width: proposal.width ?? ideal, height: proposal.height ?? 44)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    guard subviews.count == 3 else { return }
    let leading = subviews[0]
    let title = subviews[1]
    let trailing = subviews[2]
    let trailingWidth = trailing.sizeThatFits(.unspecified).width
    let leadingIdeal = leading.sizeThatFits(.unspecified).width
    let leadingMinimum = leading.sizeThatFits(ProposedViewSize(width: 0, height: nil)).width
    let reserve = max(minSide, trailingWidth, leadingMinimum) + spacing
    let titleWidth = max(0, min(title.sizeThatFits(.unspecified).width, bounds.width - reserve * 2))
    let side = max(0, (bounds.width - titleWidth) / 2 - spacing)
    let leadingProposal = ProposedViewSize(width: min(side, leadingIdeal), height: nil)
    let leadingWidth = leading.sizeThatFits(leadingProposal).width
    let titleInset = max(leadingWidth, trailingWidth) + spacing
    leading.place(
      at: CGPoint(x: bounds.minX, y: bounds.minY),
      anchor: .topLeading,
      proposal: ProposedViewSize(width: leadingProposal.width, height: bounds.height)
    )
    title.place(
      at: CGPoint(x: bounds.minX + titleInset, y: bounds.minY),
      anchor: .topLeading,
      proposal: ProposedViewSize(width: max(0, bounds.width - titleInset * 2), height: bounds.height)
    )
    trailing.place(
      at: CGPoint(x: bounds.maxX - trailingWidth, y: bounds.minY),
      anchor: .topLeading,
      proposal: ProposedViewSize(width: trailingWidth, height: bounds.height)
    )
  }
}

public struct HeaderTitle: View {
  let title: Text
  let subtitle: Text?

  @Environment(\.headerProgress) private var progress

  public init(_ title: LocalizedStringKey, subtitle: LocalizedStringKey? = nil) {
    self.title = Text(title)
    self.subtitle = subtitle.map { Text($0) }
  }

  public init(verbatim title: String, subtitle: String? = nil) {
    self.title = Text(verbatim: title)
    self.subtitle = subtitle.map { Text(verbatim: $0) }
  }

  public var body: some View {
    VStack(spacing: 0) {
      title
        .scaledFont(.base, weight: .semibold)
        .foregroundStyle(Color.label)
      if let subtitle {
        subtitle
          .scaledFont(.xs2)
          .foregroundStyle(Color.labelSecondary)
      }
    }
    .lineLimit(1)
    .multilineTextAlignment(.center)
    .opacity(progress ?? 1)
    .accessibilityElement(children: .combine)
    .accessibilityHidden((progress ?? 1) < 0.5)
  }
}

public struct HeaderLargeTitle: View {
  let title: Text
  let subtitle: Text?

  @Environment(\.headerReport) private var report

  public init(_ title: LocalizedStringKey, subtitle: LocalizedStringKey? = nil) {
    self.title = Text(title)
    self.subtitle = subtitle.map { Text($0) }
  }

  public init(verbatim title: String, subtitle: String? = nil) {
    self.title = Text(verbatim: title)
    self.subtitle = subtitle.map { Text(verbatim: $0) }
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 2) {
      title
        .scaledFont(.xl3, weight: .bold)
        .foregroundStyle(Color.label)
        .accessibilityAddTraits(.isHeader)
      if let subtitle {
        subtitle
          .scaledFont(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
    }
    .lineLimit(2)
    .padding(.horizontal, 16)
    .padding(.top, 4)
    .padding(.bottom, 8)
    .frame(maxWidth: .infinity, alignment: .leading)
    .onGeometryChange(for: CGFloat.self) { proxy in
      HeaderMath.progress(minY: proxy.frame(in: .scrollView).minY, height: proxy.size.height)
    } action: { value in
      report?(value)
    }
  }
}

public struct HeaderBack: View {
  let label: Text?
  let action: (() -> Void)?

  @Environment(\.dismiss) private var dismiss
  @Environment(\.isEnabled) private var isEnabled

  public init(_ label: LocalizedStringKey? = nil, action: (() -> Void)? = nil) {
    self.label = label.map { Text($0) }
    self.action = action
  }

  public init(verbatim label: String, action: (() -> Void)? = nil) {
    self.label = Text(verbatim: label)
    self.action = action
  }

  public var body: some View {
    Button {
      if let action {
        action()
      } else {
        dismiss()
      }
    } label: {
      EmptyView()
    }
    .buttonStyle(PressReader { pressed in
      HStack(spacing: 2) {
        Ph.caretLeft.bold
          .frame(width: 20, height: 20)
          .flipsForRightToLeftLayoutDirection(true)
        if let label {
          label
            .scaledFont(.base)
            .lineLimit(1)
        }
      }
      .foregroundStyle(!isEnabled ? Color.labelQuaternary : pressed ? .link.opacity(0.4) : .link)
      .padding(.horizontal, 4)
      .frame(minWidth: 44, minHeight: 44, alignment: .leading)
      .contentShape(Rectangle())
    })
    .accessibilityLabel(label ?? Text("Back"))
  }
}

public struct HeaderActions<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 4) {
      content
    }
    .buttonStyle(.variant(.ghost, size: .icon))
  }
}

public struct HeaderScrollView<HeaderContent: View, Content: View>: View {
  let header: HeaderContent
  let content: Content

  @State private var progress: CGFloat?

  public init(@ViewBuilder content: () -> Content, @ViewBuilder header: () -> HeaderContent) {
    self.content = content()
    self.header = header()
  }

  public var body: some View {
    VStack(spacing: 0) {
      header
        .environment(\.headerProgress, progress)
        .zIndex(1)
      KeyboardScrollView {
        VStack(alignment: .leading, spacing: 0) {
          content
        }
      }
      .environment(\.headerReport) { value in
        if progress != value { progress = value }
      }
    }
  }
}
