import SwiftUI

public struct Empty<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 16) {
      content
    }
    .multilineTextAlignment(.center)
    .padding(48)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .accessibilityElement(children: .contain)
  }
}

public struct EmptyHeader<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 8) {
      content
    }
    .frame(maxWidth: 384)
  }
}

public enum EmptyMediaVariant: CaseIterable, Sendable {
  case `default`, icon
}

public struct EmptyMedia<Content: View>: View {
  let variant: EmptyMediaVariant
  let content: Content

  public init(_ variant: EmptyMediaVariant = .default, @ViewBuilder content: () -> Content) {
    self.variant = variant
    self.content = content()
  }

  public var body: some View {
    Group {
      switch variant {
      case .default:
        content
      case .icon:
        content
          .frame(width: 20, height: 20)
          .foregroundStyle(EsuissColor.foreground)
          .frame(width: 40, height: 40)
          .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
      }
    }
    .padding(.bottom, 8)
    .accessibilityHidden(true)
  }
}

public struct EmptyTitle: View {
  let text: Text

  public init(_ title: LocalizedStringKey) {
    text = Text(title)
  }

  public init(verbatim title: String) {
    text = Text(verbatim: title)
  }

  public var body: some View {
    text
      .scaledTextStyle(.lg, weight: .semibold)
      .foregroundStyle(EsuissColor.foreground)
      .fixedSize(horizontal: false, vertical: true)
      .accessibilityAddTraits(.isHeader)
  }
}

public struct EmptyDescription: View {
  let text: Text

  public init(_ description: LocalizedStringKey) {
    text = Text(description)
  }

  public init(verbatim description: String) {
    text = Text(verbatim: description)
  }

  public var body: some View {
    text
      .scaledTextStyle(TextStyle(size: TextStyle.sm.size, lineHeight: 24))
      .foregroundStyle(EsuissColor.mutedForeground)
      .tint(EsuissColor.primary)
      .fixedSize(horizontal: false, vertical: true)
  }
}

public struct EmptyContent<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 16) {
      content
    }
    .scaledFont(.base)
    .foregroundStyle(EsuissColor.foreground)
    .frame(maxWidth: 384)
  }
}
