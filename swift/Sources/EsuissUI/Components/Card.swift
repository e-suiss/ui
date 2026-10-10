import SwiftUI

public struct EsuissCard<Content: View>: View {
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
    let shape = RoundedRectangle(cornerRadius: EsuissRadius.xl2, style: .continuous)
    VStack(alignment: .leading, spacing: size.spacing) {
      content
    }
    .padding(.vertical, size.spacing)
    .frame(maxWidth: .infinity, alignment: .leading)
    .environment(\.esuissCardSpacing, size.spacing)
    .font(EsuissTextStyle.base.font())
    .tracking(EsuissTextStyle.base.letterSpacing)
    .foregroundStyle(Color.esuissLabel)
    .background(variant == .filled ? Color.esuissSurfaceSecondary : .esuissSurfaceRaised, in: shape)
    .clipShape(shape)
    .overlay {
      if variant == .default {
        shape.strokeBorder(Color.esuissLabel.opacity(colorScheme == .dark ? 0.1 : 0.05))
      }
    }
    .esuissShadow(variant == .default ? .md : EsuissShadow(color: .clear, radius: 0))
  }
}

extension EnvironmentValues {
  @Entry var esuissCardSpacing: CGFloat = 24
}

public struct EsuissCardHeader<Action: View>: View {
  let title: LocalizedStringKey
  let description: LocalizedStringKey?
  let action: Action

  @Environment(\.esuissCardSpacing) private var spacing

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
        EsuissCardTitle(title)
        if let description {
          EsuissCardDescription(description)
        }
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      action
    }
    .padding(.horizontal, spacing)
  }
}

extension EsuissCardHeader where Action == EmptyView {
  public init(_ title: LocalizedStringKey, description: LocalizedStringKey? = nil) {
    self.init(title, description: description) { EmptyView() }
  }
}

public struct EsuissCardTitle: View {
  let title: LocalizedStringKey

  public init(_ title: LocalizedStringKey) {
    self.title = title
  }

  public var body: some View {
    Text(title)
      .esuissTextStyle(.base, weight: .semibold)
      .foregroundStyle(Color.esuissLabel)
  }
}

public struct EsuissCardDescription: View {
  let text: LocalizedStringKey

  public init(_ text: LocalizedStringKey) {
    self.text = text
  }

  public var body: some View {
    Text(text)
      .esuissTextStyle(.sm)
      .foregroundStyle(Color.esuissLabelSecondary)
  }
}

public struct EsuissCardContent<Content: View>: View {
  let content: Content

  @Environment(\.esuissCardSpacing) private var spacing

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

public struct EsuissCardFooter<Content: View>: View {
  let content: Content

  @Environment(\.esuissCardSpacing) private var spacing

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
