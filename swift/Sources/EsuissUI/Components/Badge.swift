import SwiftUI

public struct EsuissBadge<Label: View>: View {
  public enum Variant: CaseIterable, Sendable {
    case primary, secondary, destructive, outline
  }

  let variant: Variant
  let label: Label

  @Environment(\.colorScheme) private var colorScheme

  public init(_ variant: Variant = .primary, @ViewBuilder label: () -> Label) {
    self.variant = variant
    self.label = label()
  }

  public var body: some View {
    label
      .font(.system(size: 12, weight: .medium))
      .lineLimit(1)
      .foregroundStyle(foreground)
      .padding(.horizontal, 8)
      .frame(height: 20)
      .background(background, in: Capsule())
      .overlay {
        if variant == .outline {
          Capsule().strokeBorder(Color.esuissBorder)
        }
      }
  }

  private var foreground: Color {
    switch variant {
    case .primary: .esuissPrimaryForeground
    case .secondary, .outline: .esuissForeground
    case .destructive: .esuissDestructive
    }
  }

  private var background: Color {
    switch variant {
    case .primary: .esuissPrimary
    case .secondary: .esuissSecondary
    case .destructive: .esuissDestructive.opacity(colorScheme == .dark ? 0.2 : 0.1)
    case .outline: .clear
    }
  }
}

extension EsuissBadge where Label == Text {
  public init(_ title: LocalizedStringKey, variant: Variant = .primary) {
    self.init(variant) { Text(title) }
  }
}
