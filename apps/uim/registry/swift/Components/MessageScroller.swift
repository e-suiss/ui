import PhosphorSwift
import SwiftUI

public enum MessageScrollerDefaultScrollPosition: CaseIterable, Sendable {
  case start, end
}

public enum MessageScrollerScrollDirection: CaseIterable, Sendable, Hashable {
  case start, end
}

struct MessageScrollerChange: Equatable {
  var appended = 0
  var prepended = 0
  var reset = false
}

struct MessageScrollerTracker {
  var ids: [AnyHashable] = []
  var atEnd = true
  var atStart = true
  var unread = 0

  mutating func update(_ next: [AnyHashable]) -> MessageScrollerChange {
    defer { ids = next }
    guard ids != next else { return MessageScrollerChange() }
    guard let first = ids.first, let last = ids.last else {
      unread = 0
      return MessageScrollerChange(reset: true)
    }
    guard let lastIndex = next.lastIndex(of: last) else {
      unread = 0
      return MessageScrollerChange(reset: true)
    }
    let appended = next.count - 1 - lastIndex
    let prepended = next.firstIndex(of: first) ?? 0
    if appended > 0 && !atEnd {
      unread += appended
    }
    return MessageScrollerChange(appended: appended, prepended: prepended)
  }

  mutating func setEdges(atStart: Bool, atEnd: Bool) {
    self.atStart = atStart
    self.atEnd = atEnd
    if atEnd { unread = 0 }
  }
}

struct MessageScrollerRequest: Equatable {
  enum Target: Equatable {
    case start, end
    case message(AnyHashable, UnitPoint)
  }

  let serial: Int
  let target: Target
  let animated: Bool
}

@MainActor
@Observable
public final class MessageScrollerController {
  var tracker = MessageScrollerTracker()
  var request: MessageScrollerRequest?
  private var serial = 0

  public init() {}

  public var unreadCount: Int { tracker.unread }
  public var isAtEnd: Bool { tracker.atEnd }
  public var isAtStart: Bool { tracker.atStart }

  public func canScroll(_ direction: MessageScrollerScrollDirection) -> Bool {
    direction == .end ? !tracker.atEnd : !tracker.atStart
  }

  public func scrollToEnd(animated: Bool = true) {
    send(.end, animated: animated)
  }

  public func scrollToStart(animated: Bool = true) {
    send(.start, animated: animated)
  }

  public func scrollToMessage<ID: Hashable>(_ id: ID, anchor: UnitPoint = .top, animated: Bool = true) {
    send(.message(AnyHashable(id), anchor), animated: animated)
  }

  func update(ids: [AnyHashable]) -> MessageScrollerChange {
    tracker.update(ids)
  }

  func setEdges(atStart: Bool, atEnd: Bool) {
    guard atStart != tracker.atStart || atEnd != tracker.atEnd || (atEnd && tracker.unread > 0) else { return }
    tracker.setEdges(atStart: atStart, atEnd: atEnd)
  }

  private func send(_ target: MessageScrollerRequest.Target, animated: Bool) {
    serial += 1
    request = MessageScrollerRequest(serial: serial, target: target, animated: animated)
  }
}

struct MessageScrollerMetrics: Equatable {
  var minY: CGFloat = 0
  var maxY: CGFloat = 0
}

public struct MessageScroller<Data: RandomAccessCollection, ID: Hashable, Row: View>: View {
  let data: Data
  let id: KeyPath<Data.Element, ID>
  let spacing: CGFloat
  let defaultScrollPosition: MessageScrollerDefaultScrollPosition
  let autoScroll: Bool
  let scrollEdgeThreshold: CGFloat
  let buttons: Set<MessageScrollerScrollDirection>
  let controller: MessageScrollerController?
  let onLoadOlder: (() -> Void)?
  let row: (Data.Element) -> Row

  @State private var own = MessageScrollerController()
  @State private var position: ID?
  @State private var requestedOlder: ID?
  @State private var metrics = MessageScrollerMetrics()
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    _ data: Data,
    id: KeyPath<Data.Element, ID>,
    spacing: CGFloat = 12,
    defaultScrollPosition: MessageScrollerDefaultScrollPosition = .end,
    autoScroll: Bool = true,
    scrollEdgeThreshold: CGFloat = 8,
    buttons: Set<MessageScrollerScrollDirection> = [.end],
    controller: MessageScrollerController? = nil,
    onLoadOlder: (() -> Void)? = nil,
    @ViewBuilder row: @escaping (Data.Element) -> Row
  ) {
    self.data = data
    self.id = id
    self.spacing = spacing
    self.defaultScrollPosition = defaultScrollPosition
    self.autoScroll = autoScroll
    self.scrollEdgeThreshold = scrollEdgeThreshold
    self.buttons = buttons
    self.controller = controller
    self.onLoadOlder = onLoadOlder
    self.row = row
  }

  public var body: some View {
    let controller = controller ?? own
    let ids = data.map { $0[keyPath: id] }
    let space = "messageScroller"
    GeometryReader { viewport in
      ScrollViewReader { proxy in
        ScrollView(.vertical) {
          LazyVStack(spacing: spacing) {
            ForEach(data, id: id) { element in
              let key = element[keyPath: id]
              row(element)
                .padding(.horizontal, 10)
                .frame(maxWidth: .infinity)
                .onAppear {
                  if key == ids.first { loadOlder(key) }
                }
            }
          }
          .padding(.vertical, 16)
          .scrollTargetLayout()
          .onGeometryChange(for: MessageScrollerMetrics.self) { content in
            let frame = content.frame(in: .named(space))
            return MessageScrollerMetrics(minY: frame.minY, maxY: frame.maxY)
          } action: { value in
            metrics = value
            updateEdges(controller, metrics: value, viewport: viewport.size.height)
          }
        }
        .coordinateSpace(.named(space))
        .defaultScrollAnchor(defaultScrollPosition == .end ? .bottom : .top)
        .scrollPosition(id: $position)
        .scrollDismissesKeyboard(.interactively)
        .accessibilityLabel(Text("Messages"))
        .onChange(of: ids, initial: true) { _, next in
          let wasAtEnd = controller.isAtEnd
          let change = controller.update(ids: next.map { AnyHashable($0) })
          if change.reset {
            if defaultScrollPosition == .end, let last = next.last {
              proxy.scrollTo(last, anchor: .bottom)
            }
          } else if change.appended > 0 && wasAtEnd && autoScroll, let last = next.last {
            scroll(animated: true) { proxy.scrollTo(last, anchor: .bottom) }
          }
        }
        .onChange(of: viewport.size.height) {
          updateEdges(controller, metrics: metrics, viewport: viewport.size.height)
          if controller.isAtEnd && autoScroll, let last = ids.last {
            proxy.scrollTo(last, anchor: .bottom)
          }
        }
        .onChange(of: controller.request) { _, request in
          guard let request else { return }
          scroll(animated: request.animated) {
            switch request.target {
            case .end:
              if let last = ids.last { proxy.scrollTo(last, anchor: .bottom) }
            case .start:
              if let first = ids.first { proxy.scrollTo(first, anchor: .top) }
            case .message(let target, let anchor):
              proxy.scrollTo(target, anchor: anchor)
            }
          }
        }
      }
    }
    .overlay(alignment: .top) {
      if buttons.contains(.start) {
        MessageScrollerButton(direction: .start, controller: controller)
          .padding(.top, 16)
      }
    }
    .overlay(alignment: .bottom) {
      if buttons.contains(.end) {
        MessageScrollerButton(direction: .end, controller: controller)
          .padding(.bottom, 16)
      }
    }
    .environment(\.messageScroller, controller)
  }

  private func updateEdges(_ controller: MessageScrollerController, metrics: MessageScrollerMetrics, viewport: CGFloat) {
    controller.setEdges(
      atStart: metrics.minY >= -scrollEdgeThreshold,
      atEnd: metrics.maxY - viewport <= scrollEdgeThreshold
    )
  }

  private func loadOlder(_ key: ID) {
    guard let onLoadOlder, requestedOlder != key else { return }
    requestedOlder = key
    onLoadOlder()
  }

  private func scroll(animated: Bool, _ action: @escaping () -> Void) {
    if animated && !reduceMotion {
      withAnimation(.smooth(duration: 0.3)) { action() }
    } else {
      action()
    }
  }
}

extension MessageScroller where Data.Element: Identifiable, ID == Data.Element.ID {
  public init(
    _ data: Data,
    spacing: CGFloat = 12,
    defaultScrollPosition: MessageScrollerDefaultScrollPosition = .end,
    autoScroll: Bool = true,
    scrollEdgeThreshold: CGFloat = 8,
    buttons: Set<MessageScrollerScrollDirection> = [.end],
    controller: MessageScrollerController? = nil,
    onLoadOlder: (() -> Void)? = nil,
    @ViewBuilder row: @escaping (Data.Element) -> Row
  ) {
    self.init(
      data,
      id: \.id,
      spacing: spacing,
      defaultScrollPosition: defaultScrollPosition,
      autoScroll: autoScroll,
      scrollEdgeThreshold: scrollEdgeThreshold,
      buttons: buttons,
      controller: controller,
      onLoadOlder: onLoadOlder,
      row: row
    )
  }
}

public struct MessageScrollerButton: View {
  let direction: MessageScrollerScrollDirection
  let controller: MessageScrollerController?

  @Environment(\.messageScroller) private var environment
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(direction: MessageScrollerScrollDirection = .end, controller: MessageScrollerController? = nil) {
    self.direction = direction
    self.controller = controller
  }

  public var body: some View {
    let controller = controller ?? environment
    let active = controller?.canScroll(direction) ?? false
    let unread = direction == .end ? controller?.unreadCount ?? 0 : 0
    Button {
      guard let controller, active else { return }
      if direction == .end {
        controller.scrollToEnd()
      } else {
        controller.scrollToStart()
      }
    } label: {
      Ph.arrowDown.bold
        .resizable()
        .scaledToFit()
        .frame(width: 16, height: 16)
        .rotationEffect(.degrees(direction == .start ? 180 : 0))
    }
    .buttonStyle(MessageScrollerButtonStyle())
    .overlay(alignment: .topTrailing) {
      if unread > 0 {
        Text(unread > 99 ? "99+" : "\(unread)")
          .font(TextStyle.xs2.font(weight: .semibold))
          .monospacedDigit()
          .lineLimit(1)
          .fixedSize()
          .foregroundStyle(Color.onAccent)
          .padding(.horizontal, 5)
          .frame(minWidth: 18, minHeight: 18)
          .background(Color.accent, in: Capsule())
          .background {
            Capsule().fill(Color.surfaceRaised).padding(-2)
          }
          .offset(x: 6, y: -6)
          .accessibilityHidden(true)
      }
    }
    .scaleEffect(active ? 1 : 0.95)
    .opacity(active ? 1 : 0)
    .offset(y: active ? 0 : (direction == .end ? 32 : -32))
    .animation(reduceMotion ? nil : .timingCurve(0.23, 1, 0.32, 1, duration: active ? 0.2 : 0.4), value: active)
    .allowsHitTesting(active)
    .accessibilityHidden(!active)
    .accessibilityLabel(Text(direction == .end ? "Scroll to end" : "Scroll to start"))
    .accessibilityValue(unread > 0 ? Text("\(unread) new") : Text(verbatim: ""))
  }
}

private struct MessageScrollerButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .foregroundStyle(Color.label)
      .frame(width: 32, height: 32)
      .background {
        Circle()
          .fill(Color.surfaceRaised)
          .overlay {
            if configuration.isPressed {
              Circle().fill(Color.controlPressed)
            }
          }
      }
      .overlay {
        Circle().strokeBorder(Color.separator, lineWidth: 1)
      }
      .shadow(.md)
      .contentShape(Circle())
  }
}

extension EnvironmentValues {
  @Entry var messageScroller: MessageScrollerController? = nil
}
