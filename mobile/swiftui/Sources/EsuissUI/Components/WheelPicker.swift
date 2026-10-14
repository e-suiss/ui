import SwiftUI

struct WheelPickerEntry: Equatable {
  let value: AnyHashable
  let disabled: Bool
  let text: Text?
}

struct WheelPickerEntriesKey: PreferenceKey {
  static var defaultValue: [WheelPickerEntry] { [] }

  static func reduce(value: inout [WheelPickerEntry], nextValue: () -> [WheelPickerEntry]) {
    value.append(contentsOf: nextValue())
  }
}

struct WheelPickerColumnContext {
  var alignment: Alignment
  var select: @MainActor (AnyHashable) -> Void
}

extension EnvironmentValues {
  @Entry var wheelPickerColumn: WheelPickerColumnContext?
  @Entry var wheelPickerItemInset: CGFloat = 12
}

enum WheelPickerMetrics {
  static let rowHeight: CGFloat = 32
  static let height: CGFloat = rowHeight * 6.75
  static let inset: CGFloat = (height - rowHeight) / 2
}

struct WheelPickerCurve: Equatable {
  static let rowAngle = Double.pi / 10.5
  static let maxAngle = Double.pi / 2
  static let perspective = 1200.0
  static let fadeAngle = 0.35

  let offset: Double
  let scaleX: Double
  let scaleY: Double
  let opacity: Double

  init(distance: Double, height: Double) {
    let radius = height / Self.rowAngle
    let angle = min(max(distance * Self.rowAngle, -Self.maxAngle), Self.maxAngle)
    let away = abs(distance)
    let tone = away < 1 ? 1 - away * 0.45 : 0.55 - (away - 1) * 0.06
    let fade = min(1, (Self.maxAngle - abs(angle)) / Self.fadeAngle)
    let depth = Self.perspective / (Self.perspective + radius - radius * cos(angle))
    offset = radius * sin(angle) - distance * height
    scaleX = depth
    scaleY = depth * cos(angle)
    opacity = max(0, tone * fade)
  }
}

enum WheelPickerNavigation {
  static func enabled(_ disabled: [Bool], from index: Int, step: Int) -> Int? {
    var current = index
    while current >= 0 && current < disabled.count {
      if !disabled[current] { return current }
      current += step
    }
    return nil
  }

  static func nearestEnabled(_ disabled: [Bool], from index: Int) -> Int? {
    for distance in 0..<max(disabled.count, 1) {
      let before = index - distance
      if before >= 0 && before < disabled.count && !disabled[before] { return before }
      let after = index + distance
      if after >= 0 && after < disabled.count && !disabled[after] { return after }
    }
    return nil
  }

  static func centered(offset: CGFloat, count: Int) -> Int {
    guard count > 0 else { return 0 }
    let index = Int((offset / WheelPickerMetrics.rowHeight).rounded())
    return min(max(index, 0), count - 1)
  }
}

struct WheelPickerSnap: ScrollTargetBehavior {
  let disabled: [Bool]

  func updateTarget(_ target: inout ScrollTarget, context: TargetContext) {
    let row = WheelPickerMetrics.rowHeight
    guard !disabled.isEmpty else {
      target.rect.origin.y = (target.rect.minY / row).rounded() * row
      return
    }
    let index = WheelPickerNavigation.centered(offset: target.rect.minY, count: disabled.count)
    let resolved = WheelPickerNavigation.nearestEnabled(disabled, from: index) ?? index
    target.rect.origin.y = CGFloat(resolved) * row
  }
}

public struct WheelPicker<Content: View>: View {
  let spacing: CGFloat
  let content: Content

  public init(spacing: CGFloat = 0, @ViewBuilder content: () -> Content) {
    self.spacing = spacing
    self.content = content()
  }

  public var body: some View {
    HStack(alignment: .center, spacing: spacing) {
      content
    }
    .frame(maxWidth: .infinity)
    .background {
      RoundedRectangle(cornerRadius: Radius.lg, style: .continuous)
        .fill(Color.control)
        .frame(height: WheelPickerMetrics.rowHeight)
    }
  }
}

public struct WheelPickerColumn<Value: Hashable & Sendable, Content: View>: View {
  let selection: Binding<Value>
  let alignment: HorizontalAlignment
  let content: Content

  @State private var entries: [WheelPickerEntry] = []
  @State private var offset: CGFloat = 0
  @State private var settling: Task<Void, Never>?
  @State private var ticks = 0
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    selection: Binding<Value>,
    alignment: HorizontalAlignment = .center,
    @ViewBuilder content: () -> Content
  ) {
    self.selection = selection
    self.alignment = alignment
    self.content = content()
  }

  public var body: some View {
    ScrollViewReader { proxy in
      ScrollView(.vertical, showsIndicators: false) {
        VStack(spacing: 0) {
          content
        }
        .padding(.vertical, WheelPickerMetrics.inset)
        .onGeometryChange(for: CGFloat.self) { geometry in
          geometry.frame(in: .scrollView).minY
        } action: { value in
          offset = -value
          scheduleSettle(proxy)
        }
      }
      .scrollTargetBehavior(WheelPickerSnap(disabled: entries.map(\.disabled)))
      .frame(height: WheelPickerMetrics.height)
      .fixedSize(horizontal: true, vertical: false)
      .clipShape(RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
      .hapticFeedback(.selection, trigger: ticks)
      .environment(\.wheelPickerColumn, WheelPickerColumnContext(
        alignment: Alignment(horizontal: alignment, vertical: .center),
        select: { value in
          if let next = value.base as? Value { commit(next) }
        }
      ))
      .onPreferenceChange(WheelPickerEntriesKey.self) { value in
        entries = value
      }
      .onAppear {
        proxy.scrollTo(selection.wrappedValue, anchor: .center)
      }
      .onChange(of: selection.wrappedValue) { _, value in
        guard centeredValue != AnyHashable(value) else { return }
        scroll(proxy, to: value)
      }
      .accessibilityElement(children: .ignore)
      .accessibilityValue(entries.first { $0.value == AnyHashable(selection.wrappedValue) }?.text ?? Text(verbatim: String(describing: selection.wrappedValue)))
      .accessibilityAdjustableAction { direction in
        let disabled = entries.map(\.disabled)
        guard let current = entries.firstIndex(where: { $0.value == AnyHashable(selection.wrappedValue) }) else { return }
        let target: Int?
        switch direction {
        case .increment: target = WheelPickerNavigation.enabled(disabled, from: current + 1, step: 1)
        case .decrement: target = WheelPickerNavigation.enabled(disabled, from: current - 1, step: -1)
        @unknown default: target = nil
        }
        if let target, let next = entries[target].value.base as? Value { commit(next) }
      }
    }
  }

  private var centeredValue: AnyHashable? {
    guard !entries.isEmpty else { return nil }
    return entries[WheelPickerNavigation.centered(offset: offset, count: entries.count)].value
  }

  private func commit(_ value: Value) {
    if selection.wrappedValue != value {
      selection.wrappedValue = value
      ticks += 1
    }
  }

  private func scroll(_ proxy: ScrollViewProxy, to value: Value) {
    if reduceMotion {
      proxy.scrollTo(value, anchor: .center)
    } else {
      withAnimation(.timingCurve(0.32, 0.72, 0, 1, duration: 0.3)) {
        proxy.scrollTo(value, anchor: .center)
      }
    }
  }

  private func scheduleSettle(_ proxy: ScrollViewProxy) {
    settling?.cancel()
    settling = Task { @MainActor in
      try? await Task.sleep(for: .milliseconds(150))
      guard !Task.isCancelled else { return }
      settle(proxy)
    }
  }

  private func settle(_ proxy: ScrollViewProxy) {
    guard !entries.isEmpty else { return }
    let centered = WheelPickerNavigation.centered(offset: offset, count: entries.count)
    guard let index = WheelPickerNavigation.nearestEnabled(entries.map(\.disabled), from: centered),
      let next = entries[index].value.base as? Value
    else { return }
    if index != centered { scroll(proxy, to: next) }
    commit(next)
  }
}

public struct WheelPickerItem<Value: Hashable & Sendable, Label: View>: View {
  let value: Value
  let text: Text?
  let label: Label

  @Environment(\.wheelPickerColumn) private var column
  @Environment(\.wheelPickerItemInset) private var inset
  @Environment(\.isEnabled) private var isEnabled

  public init(value: Value, @ViewBuilder label: () -> Label) {
    self.value = value
    text = nil
    self.label = label()
  }

  init(value: Value, text: Text, label: Label) {
    self.value = value
    self.text = text
    self.label = label
  }

  public var body: some View {
    label
      .font(TextStyle.xl.font())
      .tracking(TextStyle.xl.letterSpacing)
      .monospacedDigit()
      .lineLimit(1)
      .fixedSize()
      .foregroundStyle(isEnabled ? Color.label : .labelTertiary)
      .visualEffect { content, geometry in
        let row = Double(WheelPickerMetrics.rowHeight)
        let center = Double(WheelPickerMetrics.height) / 2
        let distance = (Double(geometry.frame(in: .scrollView).midY) - center) / row
        let curve = WheelPickerCurve(distance: distance, height: row)
        return content
          .scaleEffect(x: curve.scaleX, y: curve.scaleY)
          .offset(y: curve.offset)
          .opacity(curve.opacity)
      }
      .padding(.horizontal, inset)
      .frame(maxWidth: .infinity, alignment: column?.alignment ?? .center)
      .frame(height: WheelPickerMetrics.rowHeight)
      .contentShape(Rectangle())
      .onTapGesture {
        if isEnabled { column?.select(AnyHashable(value)) }
      }
      .id(value)
      .preference(key: WheelPickerEntriesKey.self, value: [WheelPickerEntry(value: AnyHashable(value), disabled: !isEnabled, text: text)])
  }
}

extension WheelPickerItem where Label == Text {
  public init(_ title: LocalizedStringKey, value: Value) {
    self.init(value: value, text: Text(title), label: Text(title))
  }

  public init(verbatim title: String, value: Value) {
    self.init(value: value, text: Text(verbatim: title), label: Text(verbatim: title))
  }
}
