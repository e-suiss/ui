import SwiftUI

public struct TextareaStyle: TextFieldStyle {
  public init() {}

  public func _body(configuration: TextField<Self._Label>) -> some View {
    configuration
      .lineLimit(1...8)
      .modifier(InputField(
        radius: Radius.xl,
        horizontalPadding: 12,
        verticalPadding: 12,
        minHeight: 64,
        textStyle: .base,
        alignment: .topLeading
      ))
  }
}

extension TextFieldStyle where Self == TextareaStyle {
  public static var textarea: TextareaStyle { TextareaStyle() }
}
