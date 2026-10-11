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

  @State private var leadingWidth: CGFloat = 0
  @State private var trailingWidth: CGFloat = 0
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
    ZStack {
      HStack(spacing: 8) {
        leading
          .fixedSize()
          .onGeometryChange(for: CGFloat.self) { $0.size.width } action: { leadingWidth = $0 }
        Spacer(minLength: 0)
        trailing
          .fixedSize()
          .onGeometryChange(for: CGFloat.self) { $0.size.width } action: { trailingWidth = $0 }
      }
      title
        .padding(.horizontal, max(leadingWidth, trailingWidth) + 8)
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
