import SwiftUI

public struct FieldLabel<Content: View>: View {
  let content: Content

  @Environment(\.fieldInset) private var inset
  @Environment(\.isEnabled) private var isEnabled

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    content
      .scaledTextStyle(.base, weight: inset ? .regular : .semibold)
      .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
  }
}

extension FieldLabel where Content == Text {
  public init(_ title: LocalizedStringKey) {
    self.init { Text(title) }
  }

  public init<S: StringProtocol>(_ title: S) {
    self.init { Text(title) }
  }
}
