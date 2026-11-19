import SwiftUI

public struct TextareaStyle: TextFieldStyle {
  public enum Size: CaseIterable, Sendable {
    case `default`, lg

    var minHeight: CGFloat {
      self == .lg ? InputMetrics.largeHeight : 64
    }

    var horizontalPadding: CGFloat {
      self == .lg ? InputMetrics.largePadding : 12
    }

    var verticalPadding: CGFloat {
      self == .lg ? InputMetrics.largeVerticalPadding : 12
    }

    var textStyle: TextStyle {
      self == .lg ? .fieldLarge : .base
    }
  }

  let size: Size

  public init(size: Size = .default) {
    self.size = size
  }

  public func _body(configuration: TextField<Self._Label>) -> some View {
    configuration
      .lineLimit(1...8)
      .modifier(InputField(
        radius: Metrics.Radius.textarea,
        horizontalPadding: size.horizontalPadding,
        verticalPadding: size.verticalPadding,
        minHeight: size.minHeight,
        textStyle: size.textStyle,
        alignment: .topLeading
      ))
  }
}

extension TextFieldStyle where Self == TextareaStyle {
  public static var textarea: TextareaStyle { TextareaStyle() }

  public static func textarea(size: TextareaStyle.Size = .default) -> TextareaStyle {
    TextareaStyle(size: size)
  }
}
