import SwiftUI

public struct InlineAlert<Content: View, Action: View>: View {
  public enum Variant: CaseIterable, Sendable {
    case `default`, destructive
  }

  let variant: Variant
  let icon: Image?
  let content: Content
  let action: Action

  @ScaledMetric(relativeTo: .body) private var iconSize: CGFloat = 20

  public init(
    _ variant: Variant = .default,
    icon: Image? = nil,
    @ViewBuilder content: () -> Content,
    @ViewBuilder action: () -> Action
  ) {
    self.variant = variant
    self.icon = icon
    self.content = content()
    self.action = action()
  }

  public var body: some View {
    HStack(alignment: .top, spacing: 12) {
      if let icon {
        icon
          .resizable()
          .scaledToFit()
          .frame(width: iconSize, height: iconSize)
          .foregroundStyle(variant == .destructive ? Color.danger : .accent)
          .padding(.top, 1)
          .accessibilityHidden(true)
      }
      VStack(alignment: .leading, spacing: 2) {
        content
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      .fixedSize(horizontal: false, vertical: true)
      if Action.self != EmptyView.self {
        action
          .alignmentGuide(.top) { $0[.top] + 4 }
          .padding(.trailing, -4)
      }
    }
    .scaledTextStyle(.base)
    .foregroundStyle(Color.label)
    .padding(20)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
    .accessibilityElement(children: .contain)
  }
}

extension InlineAlert where Action == EmptyView {
  public init(_ variant: Variant = .default, icon: Image? = nil, @ViewBuilder content: () -> Content) {
    self.init(variant, icon: icon, content: content) { EmptyView() }
  }
}

public struct AlertTitle: View {
  let text: Text

  public init(_ title: LocalizedStringKey) {
    text = Text(title)
  }

  public init<S: StringProtocol>(_ title: S) {
    text = Text(title)
  }

  public var body: some View {
    text
      .scaledTextStyle(.base, weight: .semibold)
      .foregroundStyle(Color.label)
  }
}

public struct AlertDescription: View {
  let text: Text

  public init(_ description: LocalizedStringKey) {
    text = Text(description)
  }

  public init<S: StringProtocol>(_ description: S) {
    text = Text(description)
  }

  public var body: some View {
    text
      .scaledTextStyle(.base)
      .foregroundStyle(Color.labelSecondary)
  }
}
