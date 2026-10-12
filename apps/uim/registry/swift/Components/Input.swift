import SwiftUI

public struct InputStyle: TextFieldStyle {
  public enum Size: CaseIterable, Sendable {
    case `default`, md, sm

    var height: CGFloat {
      switch self {
      case .default: 44
      case .md: 36
      case .sm: 32
      }
    }

    var horizontalPadding: CGFloat {
      self == .sm ? 10 : 12
    }

    var radius: CGFloat {
      self == .sm ? Radius.md : Radius.lg
    }

    var textStyle: TextStyle {
      self == .default ? .base : .sm
    }
  }

  let size: Size

  public init(size: Size = .default) {
    self.size = size
  }

  public func _body(configuration: TextField<Self._Label>) -> some View {
    configuration.modifier(InputField(
      radius: size.radius,
      horizontalPadding: size.horizontalPadding,
      verticalPadding: 4,
      minHeight: size.height,
      textStyle: size.textStyle,
      alignment: .leading
    ))
  }
}

extension TextFieldStyle where Self == InputStyle {
  public static func input(size: InputStyle.Size = .default) -> InputStyle {
    InputStyle(size: size)
  }

  public static var input: InputStyle { InputStyle() }
}

struct InputField: ViewModifier {
  let radius: CGFloat
  let horizontalPadding: CGFloat
  let verticalPadding: CGFloat
  let minHeight: CGFloat
  let textStyle: TextStyle
  let alignment: Alignment

  @FocusState private var focused: Bool
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.isInvalid) private var invalid
  @Environment(\.colorScheme) private var colorScheme

  nonisolated init(
    radius: CGFloat,
    horizontalPadding: CGFloat,
    verticalPadding: CGFloat,
    minHeight: CGFloat,
    textStyle: TextStyle,
    alignment: Alignment
  ) {
    self.radius = radius
    self.horizontalPadding = horizontalPadding
    self.verticalPadding = verticalPadding
    self.minHeight = minHeight
    self.textStyle = textStyle
    self.alignment = alignment
  }

  func body(content: Content) -> some View {
    let shape = RoundedRectangle(cornerRadius: radius, style: .continuous)
    content
      .focused($focused)
      .scaledFont(textStyle)
      .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
      .tint(Color.accent)
      .padding(.horizontal, horizontalPadding)
      .padding(.vertical, verticalPadding)
      .frame(maxWidth: .infinity, minHeight: minHeight, alignment: alignment)
      .background(background, in: shape)
      .overlay {
        shape.strokeBorder(border, lineWidth: 1)
      }
      .contentShape(shape)
      .onTapGesture { focused = true }
  }

  private var background: Color {
    if !isEnabled { return .controlDisabled }
    if invalid { return .danger.opacity(colorScheme == .dark ? 0.1 : 0.05) }
    return .control
  }

  private var border: Color {
    if invalid { return .danger }
    return focused ? .focus : .clear
  }
}
