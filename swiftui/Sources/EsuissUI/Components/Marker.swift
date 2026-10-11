import SwiftUI

public enum MarkerVariant: CaseIterable, Sendable {
  case `default`, separator, border
}

extension EnvironmentValues {
  @Entry var markerVariant: MarkerVariant = .default
}

public struct Marker<Content: View>: View {
  let variant: MarkerVariant
  let content: Content

  public init(_ variant: MarkerVariant = .default, @ViewBuilder content: () -> Content) {
    self.variant = variant
    self.content = content()
  }

  public var body: some View {
    Group {
      switch variant {
      case .default:
        row
      case .separator:
        HStack(spacing: 12) {
          line
          row.fixedSize(horizontal: true, vertical: false)
          line
        }
      case .border:
        row
          .padding(.bottom, 8)
          .overlay(alignment: .bottom) {
            Rectangle().fill(Color.separator).frame(height: 1)
          }
      }
    }
    .frame(maxWidth: .infinity, minHeight: 16, alignment: .leading)
    .environment(\.markerVariant, variant)
  }

  private var row: some View {
    HStack(spacing: 8) {
      content
    }
    .scaledTextStyle(.sm)
    .foregroundStyle(Color.labelSecondary)
    .tint(Color.labelSecondary)
    .multilineTextAlignment(variant == .separator ? .center : .leading)
    .accessibilityElement(children: .combine)
  }

  private var line: some View {
    Rectangle()
      .fill(Color.separator)
      .frame(height: 1)
      .frame(maxWidth: .infinity)
      .accessibilityHidden(true)
  }
}

extension Marker where Content == MarkerLabel {
  public init(_ title: LocalizedStringKey, icon: Image? = nil, variant: MarkerVariant = .default) {
    self.init(variant) { MarkerLabel(title: Text(title), icon: icon) }
  }

  public init(verbatim title: String, icon: Image? = nil, variant: MarkerVariant = .default) {
    self.init(variant) { MarkerLabel(title: Text(verbatim: title), icon: icon) }
  }
}

public struct MarkerLabel: View {
  let title: Text
  let icon: Image?

  public var body: some View {
    if let icon {
      MarkerIcon { icon }
    }
    MarkerContent { title }
  }
}

public struct MarkerIcon<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    content
      .frame(width: 16, height: 16)
      .accessibilityHidden(true)
  }
}

public struct MarkerContent<Content: View>: View {
  let content: Content

  @Environment(\.markerVariant) private var variant

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    content
      .fixedSize(horizontal: variant == .separator, vertical: true)
      .frame(maxWidth: variant == .separator ? nil : .infinity, alignment: .leading)
  }
}

extension MarkerContent where Content == Text {
  public init(_ text: LocalizedStringKey) {
    self.init { Text(text) }
  }

  public init(verbatim text: String) {
    self.init { Text(verbatim: text) }
  }
}
