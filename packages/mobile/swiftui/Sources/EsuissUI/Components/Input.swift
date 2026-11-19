import SwiftUI

public struct InputStyle: TextFieldStyle {
  public enum Size: CaseIterable, Sendable {
    case `default`, md, sm, lg

    var height: CGFloat {
      switch self {
      case .default: Metrics.Height.input
      case .md: 36
      case .sm: 32
      case .lg: InputMetrics.largeHeight
      }
    }

    var horizontalPadding: CGFloat {
      switch self {
      case .sm: 10
      case .lg: InputMetrics.largePadding
      default: Metrics.PaddingX.input
      }
    }

    var radius: CGFloat {
      self == .sm ? Radius.md : Metrics.Radius.input
    }

    var textStyle: TextStyle {
      switch self {
      case .default: .base
      case .lg: .fieldLarge
      case .md, .sm: .sm
      }
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
    ButtonGroupItem(radius: radius) { shape in
      content
        .focused($focused)
        .scaledFont(textStyle)
        .foregroundStyle(EsuissColor.foreground)
        .tint(EsuissColor.primary)
        .padding(.horizontal, horizontalPadding)
        .padding(.vertical, verticalPadding)
        .frame(maxWidth: .infinity, minHeight: minHeight, alignment: alignment)
        .fieldSurface(shape, focused: focused)
        .contentShape(shape)
        .opacity(isEnabled ? 1 : 0.5)
        .onTapGesture { focused = true }
    }
  }
}

enum InputMetrics {
  static let largeHeight: CGFloat = 54
  static let largePadding: CGFloat = 16
  static let largeVerticalPadding: CGFloat = 14
}

extension TextStyle {
  static let fieldLarge = TextStyle(size: 17, lineHeight: 24)
}

struct FieldSurface<S: InsettableShape>: ViewModifier {
  let shape: S
  let focused: Bool

  @Environment(\.isInvalid) private var invalid
  @Environment(\.fieldInset) private var inset
  @Environment(\.colorScheme) private var colorScheme

  func body(content: Content) -> some View {
    content
      .background(background, in: shape)
      .overlay {
        if invalid {
          shape.strokeBorder(EsuissColor.destructive, lineWidth: 1.5)
        } else if !inset {
          shape.strokeBorder(EsuissColor.border, lineWidth: 1)
        }
      }
      .overlay {
        if focused {
          shape.inset(by: -1).strokeBorder(invalid ? EsuissColor.destructive : EsuissColor.ring, lineWidth: invalid ? 1 : 2)
        }
      }
  }

  private var background: Color {
    let dark = colorScheme == .dark
    if invalid { return EsuissColor.destructive.opacity(dark ? 0.1 : 0.05) }
    return dark ? EsuissColor.foreground.opacity(0.06) : EsuissColor.background
  }
}

extension View {
  func fieldSurface<S: InsettableShape>(_ shape: S, focused: Bool = false) -> some View {
    modifier(FieldSurface(shape: shape, focused: focused))
  }
}
