import SwiftUI

public enum SwipeActionVariant: CaseIterable, Sendable {
  case `default`, destructive, archive, neutral

  var color: Color {
    switch self {
    case .default: EsuissColor.primary
    case .destructive: EsuissColor.destructive
    case .archive: Palette.purple500
    case .neutral: Palette.zinc500
    }
  }
}

enum SwipeActionsMode: Sendable {
  case native, custom, accessibility
}

struct SwipeActionsContext: Sendable {
  var mode: SwipeActionsMode = .native
  var full = false
  var trigger = 0
  var direction: LayoutDirection = .leftToRight
  var close: @MainActor @Sendable () -> Void = {}
}

extension EnvironmentValues {
  @Entry var swipeActions = SwipeActionsContext()
}

struct SwipeFullKey: PreferenceKey {
  static var defaultValue: Bool { false }

  static func reduce(value: inout Bool, nextValue: () -> Bool) {
    value = value || nextValue()
  }
}

extension Notification.Name {
  static let swipeActionsOpen = Notification.Name("swipe-actions.open")
}

public struct SwipeActions<Content: View, Leading: View, Trailing: View>: View {
  let background: Color
  let content: Content
  let leading: Leading
  let trailing: Trailing

  @State private var id = UUID()
  @State private var offset: CGFloat = 0
  @State private var start: CGFloat?
  @State private var axis: Axis?
  @State private var rowWidth: CGFloat = 0
  @State private var rowHeight: CGFloat = 0
  @State private var leadingWidth: CGFloat = 0
  @State private var trailingWidth: CGFloat = 0
  @State private var leadingFull = false
  @State private var trailingFull = false
  @State private var full: HorizontalEdge?
  @State private var collapsed: CGFloat?
  @State private var trigger = 0
  @Environment(\.layoutDirection) private var layoutDirection
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    background: Color = EsuissColor.background,
    @ViewBuilder content: () -> Content,
    @ViewBuilder leading: () -> Leading,
    @ViewBuilder trailing: () -> Trailing
  ) {
    self.init(background: background, revealed: 0, content: content, leading: leading, trailing: trailing)
  }

  init(
    background: Color = EsuissColor.background,
    revealed: CGFloat,
    full: HorizontalEdge? = nil,
    @ViewBuilder content: () -> Content,
    @ViewBuilder leading: () -> Leading,
    @ViewBuilder trailing: () -> Trailing
  ) {
    self.background = background
    self.content = content()
    self.leading = leading()
    self.trailing = trailing()
    _offset = State(initialValue: revealed)
    _full = State(initialValue: full)
  }

  public var body: some View {
    let close = closeAction
    ZStack {
      if offset > 0 {
        actions(leading, edge: .leading, revealed: offset, close: close)
      }
      if offset < 0 {
        actions(trailing, edge: .trailing, revealed: -offset, close: close)
      }
      content
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(background)
        .overlay {
          if offset != 0 {
            Color.clear
              .contentShape(Rectangle())
              .onTapGesture { settle(0) }
              .accessibilityHidden(true)
          }
        }
        .offset(x: offset)
        .simultaneousGesture(drag)
        .accessibilityActions {
          Group {
            leading
            trailing
          }
          .environment(\.swipeActions, SwipeActionsContext(mode: .accessibility, close: close))
        }
    }
    .onGeometryChange(for: CGSize.self) { $0.size } action: { size in
      rowWidth = size.width
      if collapsed == nil { rowHeight = size.height }
    }
    .background {
      ZStack {
        measure(leading) { leadingWidth = $0 }
          .onPreferenceChange(SwipeFullKey.self) { leadingFull = $0 }
        measure(trailing) { trailingWidth = $0 }
          .onPreferenceChange(SwipeFullKey.self) { trailingFull = $0 }
      }
      .hidden()
      .accessibilityHidden(true)
      .allowsHitTesting(false)
    }
    .frame(height: collapsed, alignment: .top)
    .clipped()
    .hapticFeedback(.impact(weight: .medium), trigger: full) { HapticMoments.crossed($0, $1) }
    .accessibilityElement(children: .contain)
    .accessibilityAction(.escape) { settle(0) }
    .onReceive(NotificationCenter.default.publisher(for: .swipeActionsOpen)) { note in
      if let other = note.object as? UUID, other != id, offset != 0 {
        settle(0)
      }
    }
  }

  private var closeAction: @MainActor @Sendable () -> Void {
    let offset = $offset
    let full = $full
    let animation = settleAnimation
    return {
      withAnimation(animation) {
        offset.wrappedValue = 0
        full.wrappedValue = nil
      }
    }
  }

  private var settleAnimation: Animation? {
    reduceMotion ? .easeOut(duration: 0.15) : .timingCurve(0.32, 0.72, 0, 1, duration: 0.3)
  }

  private func measure<V: View>(_ view: V, _ update: @escaping (CGFloat) -> Void) -> some View {
    HStack(spacing: 0) { view }
      .environment(\.swipeActions, SwipeActionsContext(mode: .custom))
      .fixedSize()
      .onGeometryChange(for: CGFloat.self) { $0.size.width } action: { update($0) }
  }

  private func actions<V: View>(_ view: V, edge: HorizontalEdge, revealed: CGFloat, close: @escaping @MainActor @Sendable () -> Void) -> some View {
    let flipped: LayoutDirection = layoutDirection == .leftToRight ? .rightToLeft : .leftToRight
    return HStack(spacing: 0) { view }
      .environment(
        \.swipeActions,
        SwipeActionsContext(mode: .custom, full: full == edge, trigger: trigger, direction: layoutDirection, close: close)
      )
      .environment(\.layoutDirection, edge == .leading ? flipped : layoutDirection)
      .frame(width: max(revealed, 0), alignment: edge == .leading ? .trailing : .leading)
      .frame(maxHeight: .infinity)
      .clipped()
      .frame(maxWidth: .infinity, alignment: edge == .leading ? .leading : .trailing)
      .accessibilityHidden(true)
  }

  private var drag: some Gesture {
    DragGesture(minimumDistance: 8)
      .onChanged { value in
        if collapsed != nil { return }
        if axis == nil {
          let dx = abs(value.translation.width)
          let dy = abs(value.translation.height)
          if dx > 8 && dx > dy {
            axis = .horizontal
            start = offset
          } else if dy > 8 {
            axis = .vertical
          } else {
            return
          }
        }
        guard axis == .horizontal, let start else { return }
        var next = start + value.translation.width
        if next > 0 && leadingWidth == 0 { next = 0 }
        if next < 0 && trailingWidth == 0 { next = 0 }
        let edge: HorizontalEdge = next > 0 ? .leading : .trailing
        let limit = edge == .leading ? leadingWidth : trailingWidth
        let canFull = edge == .leading ? leadingFull : trailingFull
        let revealed = abs(next)
        if !canFull && revealed > limit {
          let extra = revealed - limit
          next = (next > 0 ? 1 : -1) * (limit + extra / (1 + extra / 40))
        }
        let nextFull: HorizontalEdge? = canFull && revealed > rowWidth * 0.6 ? edge : nil
        if nextFull != full {
          withAnimation(.easeOut(duration: 0.2)) { full = nextFull }
        }
        offset = next
      }
      .onEnded { _ in
        defer {
          axis = nil
          start = nil
        }
        guard axis == .horizontal else { return }
        if let full {
          fullSwipe(full)
          return
        }
        let edge: HorizontalEdge = offset > 0 ? .leading : .trailing
        let width = edge == .leading ? leadingWidth : trailingWidth
        if width > 0 && abs(offset) > width / 2 {
          settle(edge == .leading ? width : -width)
        } else {
          settle(0)
        }
      }
  }

  private func settle(_ value: CGFloat) {
    withAnimation(settleAnimation) {
      offset = value
      if value == 0 { full = nil }
    }
    if value != 0 {
      NotificationCenter.default.post(name: .swipeActionsOpen, object: id)
    }
  }

  private func fullSwipe(_ edge: HorizontalEdge) {
    let width = rowWidth
    let height = rowHeight
    withAnimation(.timingCurve(0.32, 0.72, 0, 1, duration: 0.18)) {
      offset = edge == .leading ? width : -width
    } completion: {
      collapsed = height
      withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.2)) {
        collapsed = 0
      } completion: {
        trigger += 1
        Task { @MainActor in
          try? await Task.sleep(for: .milliseconds(50))
          var transaction = Transaction()
          transaction.disablesAnimations = true
          withTransaction(transaction) {
            offset = 0
            full = nil
            collapsed = nil
          }
        }
      }
    }
  }
}

extension SwipeActions where Leading == EmptyView {
  public init(
    background: Color = EsuissColor.background,
    @ViewBuilder content: () -> Content,
    @ViewBuilder trailing: () -> Trailing
  ) {
    self.init(background: background, content: content, leading: { EmptyView() }, trailing: trailing)
  }
}

extension SwipeActions where Trailing == EmptyView {
  public init(
    background: Color = EsuissColor.background,
    @ViewBuilder content: () -> Content,
    @ViewBuilder leading: () -> Leading
  ) {
    self.init(background: background, content: content, leading: leading, trailing: { EmptyView() })
  }
}

public struct SwipeAction<Label: View>: View {
  let title: Text
  let variant: SwipeActionVariant
  let fullSwipe: Bool
  let action: () -> Void
  let label: Label

  @Environment(\.swipeActions) private var context

  public init(
    _ title: LocalizedStringKey,
    variant: SwipeActionVariant = .default,
    fullSwipe: Bool = false,
    action: @escaping () -> Void,
    @ViewBuilder label: () -> Label
  ) {
    self.title = Text(title)
    self.variant = variant
    self.fullSwipe = fullSwipe
    self.action = action
    self.label = label()
  }

  public var body: some View {
    switch context.mode {
    case .native:
      Button(role: variant == .destructive ? .destructive : nil, action: action) {
        label
      }
      .tint(variant.color)
    case .accessibility:
      Button(action: action) {
        title
      }
    case .custom:
      let hidden = context.full && !fullSwipe
      let grow = context.full && fullSwipe
      Button {
        action()
        context.close()
      } label: {
        label
          .labelStyle(SwipeActionLabelStyle())
          .scaledFont(TextStyle.xs, weight: .medium)
          .multilineTextAlignment(.center)
          .foregroundStyle(EsuissColor.primaryForeground)
          .environment(\.layoutDirection, context.direction)
          .padding(.horizontal, hidden ? 0 : 12)
          .frame(minWidth: hidden ? 0 : 72, maxWidth: hidden ? 0 : .infinity, maxHeight: .infinity)
          .opacity(hidden ? 0 : 1)
          .background(variant.color)
          .contentShape(Rectangle())
      }
      .buttonStyle(SwipeActionButtonStyle())
      .layoutPriority(grow ? 1 : 0)
      .preference(key: SwipeFullKey.self, value: fullSwipe)
      .onChange(of: context.trigger) {
        if grow { action() }
      }
    }
  }
}

extension SwipeAction where Label == SwiftUI.Label<Text, Image> {
  public init(
    _ title: LocalizedStringKey,
    icon: Image,
    variant: SwipeActionVariant = .default,
    fullSwipe: Bool = false,
    action: @escaping () -> Void
  ) {
    self.init(title, variant: variant, fullSwipe: fullSwipe, action: action) {
      SwiftUI.Label { Text(title) } icon: { icon }
    }
  }
}

extension SwipeAction where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    variant: SwipeActionVariant = .default,
    fullSwipe: Bool = false,
    action: @escaping () -> Void
  ) {
    self.init(title, variant: variant, fullSwipe: fullSwipe, action: action) { Text(title) }
  }
}

private struct SwipeActionLabelStyle: LabelStyle {
  func makeBody(configuration: Configuration) -> some View {
    VStack(spacing: 4) {
      configuration.icon.frame(width: 20, height: 20)
      configuration.title
    }
  }
}

private struct SwipeActionButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .brightness(configuration.isPressed ? -0.08 : 0)
  }
}
