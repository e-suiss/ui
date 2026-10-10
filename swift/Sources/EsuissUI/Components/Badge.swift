import SwiftUI

public struct EsuissBadge<Label: View>: View {
  public enum Variant: CaseIterable, Sendable {
    case `default`, secondary, destructive, outline, ghost, link
  }

  let variant: Variant
  let label: Label

  public init(_ variant: Variant = .default, @ViewBuilder label: () -> Label) {
    self.variant = variant
    self.label = label()
  }

  public var body: some View {
    label
      .labelStyle(EsuissButtonLabelStyle(spacing: 4, iconSize: 12))
      .font(EsuissTextStyle.xs.font(weight: .semibold))
      .tracking(EsuissTextStyle.xs.letterSpacing)
      .lineLimit(1)
      .foregroundStyle(foreground)
      .padding(.horizontal, padded ? 8 : 0)
      .frame(height: 20)
      .overlay {
        if variant == .outline {
          Capsule().strokeBorder(Color.esuissSeparator)
        }
      }
      .clipShape(Capsule())
  }

  private var padded: Bool {
    variant == .outline || variant == .ghost
  }

  private var foreground: Color {
    switch variant {
    case .default, .link: .esuissLink
    case .secondary: .esuissLabelSecondary
    case .destructive: .esuissDanger
    case .outline, .ghost: .esuissLabel
    }
  }
}

extension EsuissBadge where Label == Text {
  public init(_ title: LocalizedStringKey, variant: Variant = .default) {
    self.init(variant) { Text(title) }
  }
}
