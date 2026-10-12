import PhosphorSwift
import SwiftUI

public enum WidgetSize: CaseIterable, Sendable {
  case small, medium, large, extraLarge

  public var dimensions: CGSize {
    switch self {
    case .small: CGSize(width: 168, height: 168)
    case .medium: CGSize(width: 352, height: 168)
    case .large: CGSize(width: 352, height: 352)
    case .extraLarge: CGSize(width: 720, height: 352)
    }
  }
}

public enum WidgetAlign: CaseIterable, Sendable {
  case start, center
}

public enum WidgetHandlePlacement: CaseIterable, Sendable {
  case inside, outside
}

extension EnvironmentValues {
  @Entry public var widgetSize: WidgetSize?
  @Entry var widgetAlign = WidgetAlign.start
}

enum WidgetMath {
  static let stretch: CGFloat = 48

  static func nearest(width: CGFloat, height: CGFloat, sizes: [WidgetSize]) -> WidgetSize? {
    var best: WidgetSize?
    var distance = CGFloat.infinity
    for size in sizes {
      let target = size.dimensions
      let next = (width - target.width) * (width - target.width) + (height - target.height) * (height - target.height)
      if next < distance {
        best = size
        distance = next
      }
    }
    return best
  }

  static func fitting(_ sizes: [WidgetSize], room: CGFloat) -> [WidgetSize] {
    let fitting = sizes.filter { $0.dimensions.width <= room }
    if !fitting.isEmpty { return fitting }
    guard let narrowest = sizes.min(by: { $0.dimensions.width < $1.dimensions.width }) else { return [] }
    return [narrowest]
  }

  static func frame(start: CGSize, translation: CGSize, room: CGFloat, sizes: [WidgetSize]) -> CGSize {
    let reachable = fitting(sizes, room: room)
    let maxWidth = reachable.map(\.dimensions.width).max() ?? start.width
    let maxHeight = reachable.map(\.dimensions.height).max() ?? start.height
    let minimum = WidgetSize.small.dimensions
    return CGSize(
      width: max(minimum.width, min(maxWidth + stretch, room, start.width + translation.width)),
      height: max(minimum.height, min(maxHeight + stretch, start.height + translation.height))
    )
  }

  static func target(start: CGSize, translation: CGSize, room: CGFloat, sizes: [WidgetSize]) -> WidgetSize? {
    nearest(
      width: start.width + translation.width,
      height: start.height + translation.height,
      sizes: fitting(sizes, room: room)
    )
  }
}

public struct Widget<Content: View>: View {
  let size: WidgetSize?
  let binding: Binding<WidgetSize>?
  let sizes: [WidgetSize]
  let editing: Bool
  let handle: WidgetHandlePlacement
  let align: WidgetAlign
  let resetSize: WidgetSize?
  let content: Content
  let preview: (WidgetSize, CGSize)?

  @State private var drag: CGSize?
  @State private var target: WidgetSize?
  @State private var room = CGFloat.infinity
  @Environment(\.layoutDirection) private var layoutDirection
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(_ size: WidgetSize? = .small, align: WidgetAlign = .start, @ViewBuilder content: () -> Content) {
    self.size = size
    binding = nil
    sizes = WidgetSize.allCases
    editing = false
    handle = .outside
    self.align = align
    resetSize = nil
    self.content = content()
    preview = nil
  }

  public init(
    size: Binding<WidgetSize>,
    sizes: [WidgetSize] = WidgetSize.allCases,
    editing: Bool,
    handle: WidgetHandlePlacement = .outside,
    align: WidgetAlign = .start,
    resetSize: WidgetSize? = nil,
    @ViewBuilder content: () -> Content
  ) {
    self.size = size.wrappedValue
    binding = size
    self.sizes = sizes
    self.editing = editing
    self.handle = handle
    self.align = align
    self.resetSize = resetSize
    self.content = content()
    preview = nil
  }

  init(
    size: WidgetSize,
    editing: Bool,
    handle: WidgetHandlePlacement,
    preview: (WidgetSize, CGSize),
    @ViewBuilder content: () -> Content
  ) {
    self.size = size
    binding = nil
    sizes = WidgetSize.allCases
    self.editing = editing
    self.handle = handle
    align = .start
    resetSize = nil
    self.content = content()
    self.preview = preview
  }

  public var body: some View {
    if binding == nil && preview == nil {
      card(frame: size?.dimensions)
    } else {
      editable
    }
  }

  private var current: WidgetSize {
    binding?.wrappedValue ?? size ?? .small
  }

  private var editable: some View {
    let dragging = drag != nil || preview != nil
    let frame = preview?.1 ?? drag ?? current.dimensions
    let snap = preview?.0 ?? target
    return card(frame: frame, animated: !dragging)
      .overlay(alignment: .topLeading) {
        if let snap, dragging {
          RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous)
            .strokeBorder(Color.label.opacity(0.25), style: StrokeStyle(lineWidth: 1, lineCap: .round, dash: [3, 3]))
            .frame(width: snap.dimensions.width, height: snap.dimensions.height)
            .transition(.opacity)
            .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.5), value: snap)
            .allowsHitTesting(false)
        }
      }
      .overlay(alignment: .bottomTrailing) {
        if editing {
          WidgetHandle(placement: handle, dragging: dragging)
            .gesture(resizeGesture)
            .onTapGesture(count: 2) { reset() }
            .transition(.opacity)
        }
      }
      .hapticFeedback(.selection, trigger: target) { old, new in
        HapticMoments.lifted(old, new)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      .onGeometryChange(for: CGFloat.self) { proxy in
        proxy.size.width
      } action: { width in
        room = width
      }
  }

  private var resizeGesture: some Gesture {
    DragGesture(minimumDistance: 2, coordinateSpace: .global)
      .onChanged { value in
        let start = current.dimensions
        let direction: CGFloat = layoutDirection == .rightToLeft ? -1 : 1
        let translation = CGSize(width: value.translation.width * direction, height: value.translation.height)
        drag = WidgetMath.frame(start: start, translation: translation, room: room, sizes: sizes)
        target = WidgetMath.target(start: start, translation: translation, room: room, sizes: sizes)
      }
      .onEnded { _ in
        let next = target
        withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.5)) {
          drag = nil
          target = nil
          if let next, next != current { binding?.wrappedValue = next }
        }
      }
  }

  private func reset() {
    guard let resetSize else { return }
    withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.5)) {
      binding?.wrappedValue = resetSize
    }
  }

  private func card(frame: CGSize?, animated: Bool = true) -> some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous)
    let center = align == .center
    return VStack(alignment: center ? .center : .leading, spacing: 12) {
      content
    }
    .padding(16)
    .frame(
      maxWidth: frame == nil ? .infinity : nil,
      maxHeight: frame == nil ? .infinity : nil,
      alignment: center ? .center : .topLeading
    )
    .frame(width: frame?.width, height: frame?.height, alignment: center ? .center : .topLeading)
    .multilineTextAlignment(center ? .center : .leading)
    .font(TextStyle.base.font())
    .foregroundStyle(Color.label)
    .background(Color.surfaceSecondary, in: shape)
    .clipShape(shape)
    .environment(\.widgetSize, frame == nil ? nil : (binding?.wrappedValue ?? size))
    .environment(\.widgetAlign, align)
    .animation(animated && !reduceMotion ? .timingCurve(0.42, 0, 0.58, 1, duration: 0.5) : nil, value: frame?.width)
    .animation(animated && !reduceMotion ? .timingCurve(0.42, 0, 0.58, 1, duration: 0.5) : nil, value: frame?.height)
  }
}

struct WidgetHandle: View {
  let placement: WidgetHandlePlacement
  let dragging: Bool

  var body: some View {
    let inside = placement == .inside
    let side: CGFloat = inside ? 28 : 34
    Canvas { context, size in
      var path = Path()
      if inside {
        path.move(to: CGPoint(x: 19.9, y: 9.3))
        path.addQuadCurve(to: CGPoint(x: 9.3, y: 19.9), control: CGPoint(x: 17.6, y: 17.6))
      } else {
        path.move(to: CGPoint(x: 29.9, y: 13.9))
        path.addQuadCurve(to: CGPoint(x: 13.9, y: 29.9), control: CGPoint(x: 26.4, y: 26.4))
      }
      context.stroke(
        path,
        with: .color(dragging ? Color.accent : .labelQuaternary),
        style: StrokeStyle(lineWidth: 4, lineCap: .round)
      )
    }
    .frame(width: side, height: side)
    .contentShape(Rectangle().inset(by: -12))
    .offset(x: inside ? 0 : 6, y: inside ? 0 : 6)
    .accessibilityHidden(true)
  }
}

public struct WidgetHeader<Content: View>: View {
  let content: Content

  @Environment(\.widgetAlign) private var align

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if align == .center {
      VStack(spacing: 12) { content }
    } else {
      HStack(spacing: 8) { content }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
  }
}

public enum WidgetIconSize: CaseIterable, Sendable {
  case `default`, sm, lg
}

public struct WidgetIcon<Content: View>: View {
  let size: WidgetIconSize
  let content: Content

  public init(size: WidgetIconSize = .default, @ViewBuilder content: () -> Content) {
    self.size = size
    self.content = content()
  }

  public var body: some View {
    switch size {
    case .sm:
      content
        .frame(width: 14, height: 14)
        .accessibilityHidden(true)
    case .default:
      content
        .frame(width: 18, height: 18)
        .frame(width: 32, height: 32)
        .background(Color.control, in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
        .accessibilityHidden(true)
    case .lg:
      content
        .frame(width: 24, height: 24)
        .frame(width: 52, height: 52)
        .background(Color.control, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
        .accessibilityHidden(true)
    }
  }
}

public struct WidgetTitle: View {
  let text: Text

  public init(_ title: LocalizedStringKey) {
    text = Text(title)
  }

  public init(verbatim title: String) {
    text = Text(verbatim: title)
  }

  public var body: some View {
    text
      .scaledFont(.sm, weight: .semibold)
      .lineLimit(1)
      .truncationMode(.tail)
  }
}

public struct WidgetAction<Content: View>: View {
  let content: Content

  @Environment(\.widgetAlign) private var align

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if align != .center {
      Spacer(minLength: 0)
      content
    }
  }
}

public struct WidgetDescription: View {
  let text: Text

  public init(_ description: LocalizedStringKey) {
    text = Text(description)
  }

  public init(verbatim description: String) {
    text = Text(verbatim: description)
  }

  public var body: some View {
    text
      .scaledTextStyle(.sm)
      .foregroundStyle(Color.labelSecondary)
  }
}

public struct WidgetValue: View {
  let text: Text

  public init(_ value: LocalizedStringKey) {
    text = Text(value)
  }

  public init(verbatim value: String) {
    text = Text(verbatim: value)
  }

  public var body: some View {
    text
      .scaledFont(.xl2, weight: .semibold)
      .tracking(-0.6)
      .monospacedDigit()
      .lineLimit(1)
      .fixedSize(horizontal: false, vertical: true)
  }
}

public struct WidgetContent<Content: View>: View {
  let content: Content

  @Environment(\.widgetAlign) private var align

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: align == .center ? .center : .leading, spacing: 4) {
      content
    }
    .fixedSize(horizontal: false, vertical: true)
    .frame(maxWidth: .infinity, alignment: align == .center ? .center : .leading)
  }
}

public struct WidgetFooter<Content: View>: View {
  let content: Content

  @Environment(\.widgetAlign) private var align

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 0) {
      if align != .center {
        Spacer(minLength: 0)
      }
      HStack(spacing: 6) {
        content
      }
      .scaledFont(.xs)
      .foregroundStyle(Color.labelSecondary)
      .lineLimit(1)
    }
  }
}

extension WidgetFooter where Content == Text {
  public init(_ text: LocalizedStringKey) {
    self.init { Text(text) }
  }

  public init(verbatim text: String) {
    self.init { Text(verbatim: text) }
  }
}
