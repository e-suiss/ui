import SwiftUI

extension EnvironmentValues {
  @Entry var buttonGroup: Axis? = nil
}

struct ButtonGroupFrame {
  let bounds: Anchor<CGRect>
  let outlined: Bool
}

struct ButtonGroupFramesKey: PreferenceKey {
  static var defaultValue: [ButtonGroupFrame] { [] }

  static func reduce(value: inout [ButtonGroupFrame], nextValue: () -> [ButtonGroupFrame]) {
    value.append(contentsOf: nextValue())
  }
}

struct ButtonGroupNestedKey: PreferenceKey {
  static var defaultValue: Bool { false }

  static func reduce(value: inout Bool, nextValue: () -> Bool) {
    value = value || nextValue()
  }
}

public struct ButtonGroup<Content: View>: View {
  let orientation: Axis
  let content: Content

  @State private var nested = false

  public init(orientation: Axis = .horizontal, @ViewBuilder content: () -> Content) {
    self.orientation = orientation
    self.content = content()
  }

  public var body: some View {
    let shape = orientation == .horizontal
      ? AnyShape(Capsule())
      : AnyShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
    stack
      .environment(\.buttonGroup, nested ? nil : orientation)
      .onPreferenceChange(ButtonGroupNestedKey.self) { nested = $0 }
      .modifier(ButtonGroupClip(shape: nested ? nil : shape))
      .overlayPreferenceValue(ButtonGroupFramesKey.self) { frames in
        if !nested {
          GeometryReader { proxy in
            outline(frames.map { (proxy[$0.bounds], $0.outlined) }, shape: shape)
          }
        }
      }
      .transformPreference(ButtonGroupFramesKey.self) { $0 = [] }
      .transformPreference(ButtonGroupNestedKey.self) { $0 = true }
      .fixedSize(horizontal: orientation == .vertical, vertical: orientation == .horizontal)
      .accessibilityElement(children: .contain)
  }

  @ViewBuilder private var stack: some View {
    switch orientation {
    case .horizontal:
      HStack(spacing: nested ? 8 : 0) { content }
    case .vertical:
      VStack(spacing: nested ? 8 : 0) { content }
    }
  }

  @ViewBuilder private func outline(_ frames: [(CGRect, Bool)], shape: AnyShape) -> some View {
    if frames.contains(where: \.1) {
      ZStack(alignment: .topLeading) {
        shape
          .stroke(Color.separator, lineWidth: 1)
          .padding(0.5)
          .mask {
            Path { path in
              for (rect, outlined) in frames where outlined {
                path.addRect(rect)
              }
            }
          }
        ForEach(Array(frames.dropLast().enumerated()), id: \.offset) { _, frame in
          if frame.1 {
            divider(frame.0)
          }
        }
      }
      .clipShape(shape)
      .allowsHitTesting(false)
    }
  }

  private func divider(_ rect: CGRect) -> some View {
    let horizontal = orientation == .horizontal
    return Rectangle()
      .fill(Color.separator)
      .frame(width: horizontal ? 1 : rect.width, height: horizontal ? rect.height : 1)
      .position(
        x: horizontal ? rect.maxX - 0.5 : rect.midX,
        y: horizontal ? rect.midY : rect.maxY - 0.5
      )
  }
}

private struct ButtonGroupClip: ViewModifier {
  let shape: AnyShape?

  func body(content: Content) -> some View {
    if let shape {
      content.clipShape(shape)
    } else {
      content
    }
  }
}

public struct ButtonGroupText<Content: View>: View {
  let content: Content

  @Environment(\.buttonGroup) private var group

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    let shape = group == nil ? AnyShape(Capsule()) : AnyShape(Rectangle())
    HStack(spacing: 8) {
      content
    }
    .labelStyle(ButtonLabelStyle(spacing: 8, iconSize: 16))
    .scaledFont(.sm)
    .lineLimit(1)
    .foregroundStyle(Color.label)
    .padding(.horizontal, 10)
    .frame(minHeight: 36)
    .frame(maxWidth: group == .vertical ? .infinity : nil, maxHeight: group == .horizontal ? .infinity : nil)
    .background(Color.control, in: shape)
    .anchorPreference(key: ButtonGroupFramesKey.self, value: .bounds) { anchor in
      group == nil ? [] : [ButtonGroupFrame(bounds: anchor, outlined: false)]
    }
  }
}

extension ButtonGroupText where Content == Text {
  public init(_ title: LocalizedStringKey) {
    self.init { Text(title) }
  }

  public init(verbatim title: String) {
    self.init { Text(verbatim: title) }
  }
}

public struct ButtonGroupSeparator: View {
  let orientation: Axis

  public init(_ orientation: Axis = .vertical) {
    self.orientation = orientation
  }

  public var body: some View {
    let vertical = orientation == .vertical
    Rectangle()
      .fill(Color.label.opacity(0.2))
      .frame(width: vertical ? 1 : nil, height: vertical ? nil : 1)
      .padding(vertical ? .vertical : .horizontal, 9)
      .frame(maxWidth: vertical ? nil : .infinity, maxHeight: vertical ? .infinity : nil)
      .padding(vertical ? .trailing : .bottom, -1)
      .zIndex(1)
      .accessibilityHidden(true)
  }
}
