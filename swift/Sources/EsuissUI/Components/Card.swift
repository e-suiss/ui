import SwiftUI

public struct EsuissCard<Content: View>: View {
  let content: Content

  @Environment(\.colorScheme) private var colorScheme

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 24) {
      content
    }
    .padding(24)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(
      Color.esuissCard,
      in: RoundedRectangle(cornerRadius: EsuissRadius.xl4, style: .continuous)
    )
    .overlay {
      RoundedRectangle(cornerRadius: EsuissRadius.xl4, style: .continuous)
        .strokeBorder(Color.esuissForeground.opacity(colorScheme == .dark ? 0.1 : 0.05))
    }
    .shadow(color: .black.opacity(0.1), radius: 6, y: 4)
  }
}

public struct EsuissCardHeader: View {
  let title: LocalizedStringKey
  let description: LocalizedStringKey?

  public init(_ title: LocalizedStringKey, description: LocalizedStringKey? = nil) {
    self.title = title
    self.description = description
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 6) {
      Text(title)
        .font(.system(size: 16, weight: .medium))
        .foregroundStyle(Color.esuissForeground)
      if let description {
        Text(description)
          .font(.system(size: 14))
          .foregroundStyle(Color.esuissMutedForeground)
      }
    }
  }
}
