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
      .font(TextStyle.xs.font(weight: .semibold))
      .tracking(TextStyle.xs.letterSpacing)
      .lineLimit(1)
      .foregroundStyle(foreground)
      .padding(.horizontal, padded ? 8 : 0)
      .frame(height: 20)
      .overlay {
        if variant == .outline {
          Capsule().strokeBorder(Color.separator)
        }
      }
      .clipShape(Capsule())
  }

  private var padded: Bool {
    variant == .outline || variant == .ghost
  }

  private var foreground: Color {
    switch variant {
    case .default, .link: .link
    case .secondary: .labelSecondary
    case .destructive: .danger
    case .outline, .ghost: .label
    }
  }
}

extension Badge where Label == Text {
  public init(_ title: LocalizedStringKey, variant: Variant = .default) {
    self.init(variant) { Text(title) }
  }
}
