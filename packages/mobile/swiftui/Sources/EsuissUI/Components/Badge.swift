import SwiftUI

public struct Badge<Label: View>: View {
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
      .labelStyle(ButtonLabelStyle(spacing: 4, iconSize: 12))
      .scaledFont(TextStyle.xs, weight: .semibold)
      .lineLimit(1)
      .foregroundStyle(foreground)
      .padding(.horizontal, padded ? 8 : 0)
      .frame(height: 20)
      .overlay {
        if variant == .outline {
          Capsule().strokeBorder(EsuissColor.border)
        }
      }
      .clipShape(Capsule())
  }

  private var padded: Bool {
    variant == .outline || variant == .ghost
  }

  private var foreground: Color {
    switch variant {
    case .default, .link: EsuissColor.primary
    case .secondary: EsuissColor.mutedForeground
    case .destructive: EsuissColor.destructive
    case .outline, .ghost: EsuissColor.foreground
    }
  }
}

extension Badge where Label == Text {
  public init(_ title: LocalizedStringKey, variant: Variant = .default) {
    self.init(variant) { Text(title) }
  }
}
