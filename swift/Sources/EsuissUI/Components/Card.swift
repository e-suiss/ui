import SwiftUI

public struct Card<Content: View>: View {
  public enum Variant: CaseIterable, Sendable {
    case `default`, filled
  }

  public enum Size: CaseIterable, Sendable {
    case `default`, sm

    var spacing: CGFloat {
      switch self {
      case .default: 24
      case .sm: 16
      }
    }
  }

  let variant: Variant
  let size: Size
  let content: Content

  @Environment(\.colorScheme) private var colorScheme

  public init(
    _ variant: Variant = .default,
    size: Size = .default,
    @ViewBuilder content: () -> Content
  ) {
    self.variant = variant
    self.size = size
    self.content = content()
  }

  public var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    VStack(alignment: .leading, spacing: size.spacing) {
      content
    }
    .padding(.vertical, size.spacing)
    .frame(maxWidth: .infinity, alignment: .leading)
    .environment(\.cardSpacing, size.spacing)
    .font(TextStyle.base.font())
    .tracking(TextStyle.base.letterSpacing)
    .foregroundStyle(Color.label)
    .background(variant == .filled ? Color.surfaceSecondary : .surfaceRaised, in: shape)
    .clipShape(shape)
    .overlay {
      if variant == .default {
        shape.strokeBorder(Color.label.opacity(colorScheme == .dark ? 0.1 : 0.05))
      }
    }
    .shadow(variant == .default ? .md : Shadow(color: .clear, radius: 0))
  }
}

extension EnvironmentValues {
  @Entry var cardSpacing: CGFloat = 24
}

public struct CardHeader<Action: View>: View {
  let title: LocalizedStringKey
  let description: LocalizedStringKey?
  let action: Action

  @Environment(\.cardSpacing) private var spacing

  public init(
    _ title: LocalizedStringKey,
    description: LocalizedStringKey? = nil,
    @ViewBuilder action: () -> Action
  ) {
    self.title = title
    self.description = description
    self.action = action()
  }

  public var body: some View {
    HStack(alignment: .top, spacing: 6) {
      VStack(alignment: .leading, spacing: 6) {
        CardTitle(title)
        if let description {
          CardDescription(description)
        }
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      action
    }
    .padding(.horizontal, spacing)
  }
}

extension CardHeader where Action == EmptyView {
  public init(_ title: LocalizedStringKey, description: LocalizedStringKey? = nil) {
    self.init(title, description: description) { EmptyView() }
  }
}

public struct CardTitle: View {
  let title: LocalizedStringKey

  public init(_ title: LocalizedStringKey) {
    self.title = title
  }

  public var body: some View {
    Text(title)
      .textStyle(.base, weight: .semibold)
      .foregroundStyle(Color.label)
  }
}

public struct CardDescription: View {
  let text: LocalizedStringKey

  public init(_ text: LocalizedStringKey) {
    self.text = text
  }

  public var body: some View {
    Text(text)
      .textStyle(.sm)
      .foregroundStyle(Color.labelSecondary)
  }
}

public struct CardContent<Content: View>: View {
  let content: Content

  @Environment(\.cardSpacing) private var spacing

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(.horizontal, spacing)
  }
}

public struct CardFooter<Content: View>: View {
  let content: Content

  @Environment(\.cardSpacing) private var spacing

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 0) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(.horizontal, spacing)
  }
}
