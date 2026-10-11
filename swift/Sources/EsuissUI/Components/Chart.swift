import Charts
import SwiftUI

public struct ChartConfig: ExpressibleByDictionaryLiteral, Sendable {
  public struct Item: Sendable {
    public var label: String?
    public var color: Color?
    public var icon: Image?

    public init(_ label: String? = nil, color: Color? = nil, icon: Image? = nil) {
      self.label = label
      self.color = color
      self.icon = icon
    }
  }

  public let keys: [String]
  private let items: [String: Item]

  public init(_ elements: [(String, Item)]) {
    keys = elements.map(\.0)
    items = Dictionary(elements, uniquingKeysWith: { _, last in last })
  }

  public init(dictionaryLiteral elements: (String, Item)...) {
    self.init(elements)
  }

  public subscript(key: String) -> Item? {
    items[key]
  }

  public func label(_ key: String) -> String {
    items[key]?.label ?? key
  }

  public func color(_ key: String) -> Color {
    items[key]?.color ?? .labelTertiary
  }
}

extension EnvironmentValues {
  @Entry var chartConfig = ChartConfig([])
}

public struct ChartContainer<Content: View>: View {
  let config: ChartConfig
  let content: Content

  public init(config: ChartConfig, @ViewBuilder content: () -> Content) {
    self.config = config
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 0) {
      content
    }
    .frame(maxWidth: .infinity)
    .environment(\.chartConfig, config)
    .font(TextStyle.xs.font())
    .foregroundStyle(Color.label)
  }
}

public enum ChartAxis {
  public static func x<Value: Plottable>(
    values: [Value],
    format: @escaping (Value) -> String = { "\($0)" }
  ) -> some AxisContent {
    AxisMarks(values: values) { value in
      label(value, format: format, anchor: .top)
    }
  }

  public static func y<Value: Plottable>(
    values: [Value],
    edge: HorizontalEdge = .trailing,
    grid: Bool = true,
    emphasized: Bool = false,
    format: @escaping (Value) -> String = { "\($0)" }
  ) -> some AxisContent {
    let position: AxisMarkPosition = edge == .leading ? .leading : .trailing
    let categorical = Value.self == String.self
    return AxisMarks(preset: categorical ? .extended : .automatic, position: position, values: values) { value in
      if grid {
        gridLine()
      }
      label(value, format: format, emphasized: emphasized, centered: categorical ? true : nil)
    }
  }

  public static func y(
    count: Int,
    edge: HorizontalEdge = .trailing,
    grid: Bool = true,
    format: @escaping (Double) -> String = { $0.formatted() }
  ) -> some AxisContent {
    AxisMarks(position: edge == .leading ? .leading : .trailing, values: .automatic(desiredCount: count)) { value in
      if grid {
        gridLine()
      }
      label(value, format: format)
    }
  }

  public static func grid(values: [Double]) -> some AxisContent {
    AxisMarks(values: values) { _ in
      gridLine()
    }
  }

  public static func grid(count: Int = 5) -> some AxisContent {
    AxisMarks(values: .automatic(desiredCount: count)) { _ in
      gridLine()
    }
  }

  static func gridLine() -> some AxisMark {
    AxisGridLine(stroke: StrokeStyle(lineWidth: 1, dash: [2, 4]))
      .foregroundStyle(Color.separator.opacity(0.5))
  }

  static func label<Value: Plottable>(
    _ value: AxisValue,
    format: @escaping (Value) -> String,
    emphasized: Bool = false,
    anchor: UnitPoint? = nil,
    centered: Bool? = nil
  ) -> some AxisMark {
    AxisValueLabel(centered: centered, anchor: anchor, collisionResolution: .disabled) {
      if let plotted = value.as(Value.self) {
        Text(verbatim: format(plotted))
          .font(TextStyle.xs.font(weight: emphasized ? .semibold : .regular))
          .foregroundStyle(emphasized ? Color.label : .labelSecondary)
      }
    }
  }
}

public struct ChartTooltipItem: Identifiable, Sendable {
  public let key: String
  public let value: Double
  public var color: Color?

  public var id: String { key }

  public init(_ key: String, value: Double, color: Color? = nil) {
    self.key = key
    self.value = value
    self.color = color
  }
}

public struct ChartTooltipPayload: Sendable {
  public let index: Int
  public let label: String
  public let items: [ChartTooltipItem]

  public init(index: Int, label: String, items: [ChartTooltipItem]) {
    self.index = index
    self.label = label
    self.items = items
  }

  public var total: Double {
    items.reduce(0) { $0 + $1.value }
  }
}

public enum ChartTooltipIndicator: CaseIterable, Sendable {
  case dot, line, dashed
}

public struct ChartTooltipContent<LabelContent: View, ValueContent: View>: View {
  let payload: ChartTooltipPayload
  let indicator: ChartTooltipIndicator
  let hideLabel: Bool
  let hideIndicator: Bool
  let labelFormatter: ((ChartTooltipPayload) -> LabelContent)?
  let formatter: ((ChartTooltipItem) -> ValueContent)?

  @Environment(\.chartConfig) private var config
  @Environment(\.colorScheme) private var colorScheme

  public init(
    _ payload: ChartTooltipPayload,
    indicator: ChartTooltipIndicator = .dot,
    hideLabel: Bool = false,
    hideIndicator: Bool = false,
    @ViewBuilder labelFormatter: @escaping (ChartTooltipPayload) -> LabelContent,
    @ViewBuilder formatter: @escaping (ChartTooltipItem) -> ValueContent
  ) {
    self.payload = payload
    self.indicator = indicator
    self.hideLabel = hideLabel
    self.hideIndicator = hideIndicator
    self.labelFormatter = labelFormatter
    self.formatter = formatter
  }

  public var body: some View {
    let nest = payload.items.count == 1 && indicator != .dot
    let shape = RoundedRectangle(cornerRadius: Radius.md, style: .continuous)
    VStack(alignment: .leading, spacing: 6) {
      if !nest {
        title
      }
      VStack(alignment: .leading, spacing: 6) {
        ForEach(payload.items) { item in
          row(item, nest: nest)
        }
      }
    }
    .font(TextStyle.xs.font())
    .foregroundStyle(Color.label)
    .padding(.horizontal, 10)
    .padding(.vertical, 6)
    .frame(minWidth: 128, alignment: .leading)
    .background(Color.surfaceRaised, in: shape)
    .overlay {
      shape.strokeBorder(Color.label.opacity(colorScheme == .dark ? 0.1 : 0.05))
    }
    .shadow(.lg)
    .fixedSize()
  }

  @ViewBuilder private var title: some View {
    if !hideLabel {
      if let labelFormatter {
        labelFormatter(payload)
          .font(TextStyle.xs.font(weight: .semibold))
      } else {
        let value = config[payload.label]?.label ?? payload.label
        if !value.isEmpty {
          Text(LocalizedStringKey(value))
            .font(TextStyle.xs.font(weight: .semibold))
        }
      }
    }
  }

  @ViewBuilder private func row(_ item: ChartTooltipItem, nest: Bool) -> some View {
    if let formatter {
      HStack(spacing: 8) {
        formatter(item)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    } else {
      HStack(alignment: indicator == .dot ? .center : .top, spacing: 8) {
        if let icon = config[item.key]?.icon {
          icon
            .resizable()
            .frame(width: 10, height: 10)
            .foregroundStyle(Color.labelSecondary)
        } else if !hideIndicator {
          ChartTooltipIndicatorMark(indicator: indicator, color: item.color ?? config.color(item.key), nest: nest)
        }
        HStack(alignment: nest ? .bottom : .center, spacing: 8) {
          VStack(alignment: .leading, spacing: 6) {
            if nest {
              title
            }
            Text(LocalizedStringKey(config.label(item.key)))
              .foregroundStyle(Color.labelSecondary)
          }
          Spacer(minLength: 8)
          Text(item.value, format: .number)
            .font(TextStyle.xs.font(weight: .semibold))
            .monospacedDigit()
            .foregroundStyle(Color.label)
        }
      }
      .fixedSize(horizontal: false, vertical: true)
    }
  }
}

extension ChartTooltipContent where LabelContent == EmptyView {
  public init(
    _ payload: ChartTooltipPayload,
    indicator: ChartTooltipIndicator = .dot,
    hideLabel: Bool = false,
    hideIndicator: Bool = false,
    @ViewBuilder formatter: @escaping (ChartTooltipItem) -> ValueContent
  ) {
    self.payload = payload
    self.indicator = indicator
    self.hideLabel = hideLabel
    self.hideIndicator = hideIndicator
    labelFormatter = nil
    self.formatter = formatter
  }
}

extension ChartTooltipContent where ValueContent == EmptyView {
  public init(
    _ payload: ChartTooltipPayload,
    indicator: ChartTooltipIndicator = .dot,
    hideLabel: Bool = false,
    hideIndicator: Bool = false,
    @ViewBuilder labelFormatter: @escaping (ChartTooltipPayload) -> LabelContent
  ) {
    self.payload = payload
    self.indicator = indicator
    self.hideLabel = hideLabel
    self.hideIndicator = hideIndicator
    self.labelFormatter = labelFormatter
    formatter = nil
  }
}

extension ChartTooltipContent where LabelContent == EmptyView, ValueContent == EmptyView {
  public init(
    _ payload: ChartTooltipPayload,
    indicator: ChartTooltipIndicator = .dot,
    hideLabel: Bool = false,
    hideIndicator: Bool = false
  ) {
    self.payload = payload
    self.indicator = indicator
    self.hideLabel = hideLabel
    self.hideIndicator = hideIndicator
    labelFormatter = nil
    formatter = nil
  }
}

struct ChartTooltipIndicatorMark: View {
  let indicator: ChartTooltipIndicator
  let color: Color
  let nest: Bool

  var body: some View {
    switch indicator {
    case .dot:
      RoundedRectangle(cornerRadius: Radius.xs / 1.5, style: .continuous)
        .fill(color)
        .frame(width: 10, height: 10)
    case .line:
      RoundedRectangle(cornerRadius: Radius.xs / 1.5, style: .continuous)
        .fill(color)
        .frame(width: 4)
        .frame(maxHeight: .infinity)
    case .dashed:
      ChartDashedLine()
        .stroke(color, style: StrokeStyle(lineWidth: 1.5, dash: [3, 2]))
        .frame(width: 1.5)
        .frame(maxHeight: .infinity)
        .padding(.vertical, nest ? 2 : 0)
    }
  }
}

struct ChartDashedLine: Shape {
  func path(in rect: CGRect) -> Path {
    var path = Path()
    path.move(to: CGPoint(x: rect.midX, y: rect.minY))
    path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
    return path
  }
}

public struct ChartLegendContent: View {
  let keys: [String]?
  let hideIcon: Bool

  @Environment(\.chartConfig) private var config

  public init(keys: [String]? = nil, hideIcon: Bool = false) {
    self.keys = keys
    self.hideIcon = hideIcon
  }

  public var body: some View {
    let shown = config.keys.filter { key in
      keys.map { $0.contains(key) } ?? (config[key]?.color != nil)
    }
    ChartLegendLayout(horizontalSpacing: 16, verticalSpacing: 6) {
      ForEach(shown, id: \.self) { key in
        HStack(spacing: 6) {
          if let icon = config[key]?.icon, !hideIcon {
            icon
              .resizable()
              .frame(width: 12, height: 12)
              .foregroundStyle(Color.labelSecondary)
          } else {
            RoundedRectangle(cornerRadius: Radius.xs / 1.5, style: .continuous)
              .fill(config.color(key))
              .frame(width: 8, height: 8)
          }
          Text(LocalizedStringKey(config.label(key)))
            .font(TextStyle.xs.font())
            .foregroundStyle(Color.label)
        }
        .accessibilityElement(children: .combine)
      }
    }
    .frame(maxWidth: .infinity)
    .padding(.top, 12)
  }
}

struct ChartLegendLayout: Layout {
  var horizontalSpacing: CGFloat
  var verticalSpacing: CGFloat
  var centered = true

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let rows = arrange(width: proposal.width ?? .infinity, subviews: subviews)
    let width = rows.map(\.width).max() ?? 0
    let height = rows.map(\.height).reduce(0, +) + verticalSpacing * CGFloat(max(rows.count - 1, 0))
    return CGSize(width: proposal.width ?? width, height: height)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    var y = bounds.minY
    for row in arrange(width: bounds.width, subviews: subviews) {
      var x = bounds.minX + (centered ? max(0, (bounds.width - row.width) / 2) : 0)
      for index in row.indices {
        let size = subviews[index].sizeThatFits(.unspecified)
        subviews[index].place(
          at: CGPoint(x: x, y: y + (row.height - size.height) / 2),
          anchor: .topLeading,
          proposal: ProposedViewSize(size)
        )
        x += size.width + horizontalSpacing
      }
      y += row.height + verticalSpacing
    }
  }

  private struct Row {
    var indices: [Int] = []
    var width: CGFloat = 0
    var height: CGFloat = 0
  }

  private func arrange(width: CGFloat, subviews: Subviews) -> [Row] {
    var rows: [Row] = []
    var row = Row()
    for index in subviews.indices {
      let size = subviews[index].sizeThatFits(.unspecified)
      let next = row.indices.isEmpty ? size.width : row.width + horizontalSpacing + size.width
      if !row.indices.isEmpty && next > width {
        rows.append(row)
        row = Row()
      }
      row.width = row.indices.isEmpty ? size.width : row.width + horizontalSpacing + size.width
      row.height = max(row.height, size.height)
      row.indices.append(index)
    }
    if !row.indices.isEmpty { rows.append(row) }
    return rows
  }
}

enum ChartSelectionAxis {
  case x, y, angle, radius, spoke
}

struct ChartTooltipModifier<Value: Plottable & Hashable, Tooltip: View>: ViewModifier {
  let axis: ChartSelectionAxis
  let values: [Value]
  let labels: [String]
  let external: Binding<Int?>?
  let cursor: Bool
  let sticky: Bool
  let summary: String?
  let items: (Int) -> [ChartTooltipItem]
  let tooltip: (ChartTooltipPayload) -> Tooltip
  let rotation: Angle
  let sweep: Angle
  let hit: ((CGPoint, CGSize) -> Int?)?
  let radius: ClosedRange<CGFloat>

  @State private var owned: Int?
  @State private var raw: Value?
  @State private var press: ChartPress?
  @State private var size = CGSize.zero
  @State private var outside = false
  @Environment(\.chartConfig) private var config
  @Environment(\.locale) private var locale

  init(
    axis: ChartSelectionAxis,
    values: [Value],
    labels: [String]?,
    selection: Binding<Int?>?,
    defaultIndex: Int?,
    cursor: Bool,
    sticky: Bool,
    summary: String?,
    items: @escaping (Int) -> [ChartTooltipItem],
    tooltip: @escaping (ChartTooltipPayload) -> Tooltip,
    rotation: Angle = .zero,
    sweep: Angle = .degrees(360),
    hit: ((CGPoint, CGSize) -> Int?)? = nil,
    radius: ClosedRange<CGFloat> = 0...1
  ) {
    self.axis = axis
    self.radius = radius
    self.rotation = rotation
    self.sweep = sweep
    self.hit = hit
    self.values = values
    self.labels = labels ?? values.map { "\($0)" }
    external = selection
    self.cursor = cursor
    self.sticky = sticky
    self.summary = summary
    self.items = items
    self.tooltip = tooltip
    _owned = State(initialValue: defaultIndex)
  }

  private var selection: Int? {
    let value = external?.wrappedValue ?? owned
    guard let value, values.indices.contains(value) else { return nil }
    return value
  }

  private func select(_ index: Int?) {
    if let external {
      external.wrappedValue = index
    } else {
      owned = index
    }
  }

  func body(content: Content) -> some View {
    decorated(content)
      .hapticFeedback(.selection, trigger: selection, condition: HapticMoments.lifted)
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(Text(verbatim: accessibilityLabel))
      .accessibilityValue(Text(verbatim: accessibilityValue))
      .accessibilityAdjustableAction { direction in
        switch direction {
        case .increment:
          select(min(values.count - 1, (selection ?? -1) + 1))
        case .decrement:
          select(max(0, (selection ?? values.count) - 1))
        @unknown default:
          break
        }
      }
  }

  @ViewBuilder private func decorated(_ content: Content) -> some View {
    switch axis {
    case .x, .y:
      cartesian(content)
    case .angle:
      content
        .rotationEffect(rotation)
        .onGeometryChange(for: CGSize.self) { $0.size } action: { size = $0 }
        .gesture(
          DragGesture(minimumDistance: 0)
            .onChanged { gesture in
              if let index = sector(at: gesture.location) {
                hold(index)
              } else if press == nil {
                outside = true
              }
            }
            .onEnded { _ in
              if outside && press == nil {
                select(nil)
              } else {
                release()
              }
              outside = false
            }
        )
        .overlay(alignment: .topLeading) {
          polarTooltip
        }
    case .radius, .spoke:
      content
        .onGeometryChange(for: CGSize.self) { $0.size } action: { size = $0 }
        .contentShape(Rectangle())
        .gesture(
          DragGesture(minimumDistance: 0)
            .onChanged { gesture in
              if let index = hit?(gesture.location, size) {
                hold(index)
              } else if press == nil {
                outside = true
              }
            }
            .onEnded { _ in
              if outside && press == nil {
                select(nil)
              } else {
                release()
              }
              outside = false
            }
        )
        .overlay(alignment: .topLeading) {
          polarTooltip
        }
    }
  }

  @ViewBuilder private var polarTooltip: some View {
    if let index = selection {
      ChartTooltipLayout(anchor: CGPoint(x: trailing(index) ? 1 : 0, y: 0), axis: .angle) {
        tooltip(payload(index))
      }
      .allowsHitTesting(false)
    }
  }

  private func sector(at location: CGPoint) -> Int? {
    let dx = location.x - size.width / 2
    let dy = location.y - size.height / 2
    let distance = hypot(dx, dy) / max(min(size.width, size.height) / 2, 1)
    guard radius.contains(distance) else { return nil }
    let numbers = values.map { Self.number($0) ?? 0 }
    let total = numbers.reduce(0, +)
    let span = abs(sweep.radians)
    guard total > 0, span > 0 else { return nil }
    var angle = (atan2(Double(dx), Double(-dy)) - rotation.radians).truncatingRemainder(dividingBy: 2 * .pi)
    if angle < 0 { angle += 2 * .pi }
    guard angle <= span + 0.0001 else { return nil }
    let target = angle / span * total
    var sum = 0.0
    for (index, number) in numbers.enumerated() {
      sum += number
      if target <= sum { return index }
    }
    return numbers.indices.last
  }

  private func trailing(_ index: Int) -> Bool {
    if axis == .spoke {
      return sin(2 * .pi * Double(index) / Double(max(values.count, 1))) < -0.0001
    }
    guard axis == .angle else { return false }
    let numbers = values.map { Self.number($0) ?? 0 }
    let total = numbers.reduce(0, +)
    guard total > 0 else { return false }
    let before = numbers.prefix(index).reduce(0, +)
    let middle = rotation.radians + sweep.radians * (before + numbers[index] / 2) / total
    return sin(middle) < -0.0001
  }

  private func cartesian(_ content: Content) -> some View {
    selectable(content)
      .onChange(of: raw) { _, value in
        update(value)
      }
      .chartBackground { proxy in
        GeometryReader { geometry in
          if cursor, axis == .x, let index = selection, let frame = proxy.plotFrame,
            let x = proxy.position(forX: values[index])
          {
            let plot = geometry[frame]
            Rectangle()
              .fill(Color.separator)
              .frame(width: 1, height: plot.height)
              .position(x: plot.minX + x, y: plot.midY)
          }
        }
      }
      .chartOverlay(alignment: .topLeading) { proxy in
        GeometryReader { geometry in
          if let index = selection, let frame = proxy.plotFrame {
            let plot = geometry[frame]
            ChartTooltipLayout(anchor: anchor(index, proxy: proxy, plot: plot), axis: axis) {
              tooltip(payload(index))
            }
            .allowsHitTesting(false)
          }
        }
      }
  }

  @ViewBuilder private func selectable(_ content: Content) -> some View {
    if axis == .y {
      content.chartYSelection(value: $raw)
    } else {
      content.chartXSelection(value: $raw)
    }
  }

  private func payload(_ index: Int) -> ChartTooltipPayload {
    ChartTooltipPayload(index: index, label: labels[index], items: items(index))
  }

  private func anchor(_ index: Int, proxy: ChartProxy, plot: CGRect) -> CGPoint {
    switch axis {
    case .x:
      CGPoint(x: plot.minX + (proxy.position(forX: values[index]) ?? 0), y: 0)
    case .y:
      CGPoint(x: plot.maxX, y: plot.minY + (proxy.position(forY: values[index]) ?? 0))
    case .angle, .radius, .spoke:
      .zero
    }
  }

  private func update(_ value: Value?) {
    guard let value else {
      release()
      return
    }
    guard let index = index(of: value) else { return }
    hold(index)
  }

  private func release() {
    if let press, !press.moved, press.wasSelected {
      select(nil)
    } else if !sticky {
      select(nil)
    }
    press = nil
  }

  private func hold(_ index: Int) {
    if var current = press {
      if index != current.start {
        current.moved = true
        press = current
      }
    } else {
      press = ChartPress(start: index, wasSelected: selection == index)
    }
    select(index)
  }

  private func index(of value: Value) -> Int? {
    if let index = values.firstIndex(of: value) { return index }
    guard let target = Self.number(value) else { return nil }
    return values.indices.min { lhs, rhs in
      abs((Self.number(values[lhs]) ?? .infinity) - target) < abs((Self.number(values[rhs]) ?? .infinity) - target)
    }
  }

  private static func number(_ value: Value) -> Double? {
    switch value.primitivePlottable as Any {
    case let number as Double: number
    case let number as Int: Double(number)
    case let number as Float: Double(number)
    case let number as CGFloat: Double(number)
    case let date as Date: date.timeIntervalSinceReferenceDate
    default: nil
    }
  }

  private var accessibilityLabel: String {
    var parts: [String] = []
    if let summary { parts.append(summary) }
    if let first = labels.first, let last = labels.last, labels.count > 1 {
      parts.append("\(first) – \(last)")
    }
    return parts.joined(separator: ", ")
  }

  private var accessibilityValue: String {
    guard let index = selection else { return "" }
    let entries = items(index).map { item in
      "\(config.label(item.key)) \(item.value.formatted(.number.locale(locale)))"
    }
    return "\(labels[index]): \(entries.joined(separator: ", "))"
  }
}

struct ChartPress: Equatable {
  var start: Int
  var wasSelected: Bool
  var moved = false
}

struct ChartTooltipLayout: Layout {
  var anchor: CGPoint
  var axis: ChartSelectionAxis

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    proposal.replacingUnspecifiedDimensions()
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    guard let view = subviews.first else { return }
    let size = view.sizeThatFits(.unspecified)
    let origin: CGPoint
    switch axis {
    case .x:
      origin = CGPoint(
        x: min(max(bounds.minX, bounds.minX + anchor.x - size.width / 2), bounds.maxX - size.width),
        y: bounds.minY
      )
    case .y:
      origin = CGPoint(
        x: bounds.minX + anchor.x - size.width,
        y: min(max(bounds.minY, bounds.minY + anchor.y - size.height / 2), bounds.maxY - size.height)
      )
    case .angle, .radius, .spoke:
      origin = CGPoint(x: anchor.x > 0 ? bounds.maxX - size.width : bounds.minX, y: bounds.minY)
    }
    view.place(at: origin, anchor: .topLeading, proposal: ProposedViewSize(size))
  }
}

extension View {
  public func chartTooltip<Value: Plottable & Hashable, Tooltip: View>(
    x values: [Value],
    labels: [String]? = nil,
    selection: Binding<Int?>? = nil,
    defaultIndex: Int? = nil,
    cursor: Bool = true,
    sticky: Bool = true,
    accessibilityLabel: String? = nil,
    items: @escaping (Int) -> [ChartTooltipItem],
    @ViewBuilder content: @escaping (ChartTooltipPayload) -> Tooltip
  ) -> some View {
    modifier(
      ChartTooltipModifier(
        axis: .x, values: values, labels: labels, selection: selection, defaultIndex: defaultIndex,
        cursor: cursor, sticky: sticky, summary: accessibilityLabel, items: items, tooltip: content
      )
    )
  }

  public func chartTooltip<Value: Plottable & Hashable, Tooltip: View>(
    y values: [Value],
    labels: [String]? = nil,
    selection: Binding<Int?>? = nil,
    defaultIndex: Int? = nil,
    sticky: Bool = true,
    accessibilityLabel: String? = nil,
    items: @escaping (Int) -> [ChartTooltipItem],
    @ViewBuilder content: @escaping (ChartTooltipPayload) -> Tooltip
  ) -> some View {
    modifier(
      ChartTooltipModifier(
        axis: .y, values: values, labels: labels, selection: selection, defaultIndex: defaultIndex,
        cursor: false, sticky: sticky, summary: accessibilityLabel, items: items, tooltip: content
      )
    )
  }

  public func chartTooltip<Tooltip: View>(
    angle values: [Double],
    labels: [String],
    startAngle: Angle = .zero,
    endAngle: Angle = .degrees(360),
    innerRadius: CGFloat = 0,
    outerRadius: CGFloat = 1,
    selection: Binding<Int?>? = nil,
    defaultIndex: Int? = nil,
    sticky: Bool = true,
    accessibilityLabel: String? = nil,
    items: @escaping (Int) -> [ChartTooltipItem],
    @ViewBuilder content: @escaping (ChartTooltipPayload) -> Tooltip
  ) -> some View {
    modifier(
      ChartTooltipModifier(
        axis: .angle, values: values, labels: labels, selection: selection, defaultIndex: defaultIndex,
        cursor: false, sticky: sticky, summary: accessibilityLabel, items: items, tooltip: content,
        rotation: startAngle, sweep: endAngle - startAngle, radius: innerRadius...outerRadius
      )
    )
  }
}

public struct RadialBar: Identifiable, Sendable {
  public let key: String
  public let value: Double
  public var color: Color?

  public var id: String { key }

  public init(_ key: String, value: Double, color: Color? = nil) {
    self.key = key
    self.value = value
    self.color = color
  }
}

public enum RadialBarTrack: CaseIterable, Sendable {
  case none, control, tint
}

public struct RadialBarChart<Tooltip: View>: View {
  let bars: [RadialBar]
  let domain: ClosedRange<Double>?
  let innerRadius: CGFloat
  let outerRadius: CGFloat
  let barSize: CGFloat?
  let startAngle: Angle
  let endAngle: Angle
  let rounded: Bool
  let track: RadialBarTrack
  let showsLabels: Bool
  let interactive: Bool
  let selection: Binding<Int?>?
  let defaultIndex: Int?
  let sticky: Bool
  let summary: String?
  let tooltip: (ChartTooltipPayload) -> Tooltip

  @Environment(\.chartConfig) private var config

  public init(
    _ bars: [RadialBar],
    domain: ClosedRange<Double>? = nil,
    innerRadius: CGFloat = 0,
    outerRadius: CGFloat = 0.8,
    barSize: CGFloat? = nil,
    startAngle: Angle = .degrees(90),
    endAngle: Angle = .degrees(-270),
    rounded: Bool = false,
    track: RadialBarTrack = .none,
    showsLabels: Bool = false,
    selection: Binding<Int?>? = nil,
    defaultIndex: Int? = nil,
    sticky: Bool = true,
    accessibilityLabel: String? = nil,
    @ViewBuilder tooltip: @escaping (ChartTooltipPayload) -> Tooltip
  ) {
    self.bars = bars
    self.domain = domain
    self.innerRadius = innerRadius
    self.outerRadius = outerRadius
    self.barSize = barSize
    self.startAngle = startAngle
    self.endAngle = endAngle
    self.rounded = rounded
    self.track = track
    self.showsLabels = showsLabels
    interactive = true
    self.selection = selection
    self.defaultIndex = defaultIndex
    self.sticky = sticky
    summary = accessibilityLabel
    self.tooltip = tooltip
  }

  public var body: some View {
    let canvas = GeometryReader { geometry in
      let layout = RadialBarLayout(chart: self, size: geometry.size)
      ZStack {
        ForEach(bars.indices, id: \.self) { index in
          let color = bars[index].color ?? config.color(bars[index].key)
          let ring = layout.ring(index)
          if track != .none {
            ChartArc(
              center: layout.center, radius: ring.middle, thickness: ring.thickness,
              start: startAngle, end: endAngle, rounded: rounded
            )
            .fill(track == .tint ? color.opacity(0.22) : Color.control)
          }
          ChartArc(
            center: layout.center, radius: ring.middle, thickness: ring.thickness,
            start: startAngle, end: layout.angle(bars[index].value), rounded: rounded
          )
          .fill(color)
        }
        if showsLabels {
          ForEach(bars.indices, id: \.self) { index in
            ForEach(layout.glyphs(String(localized: String.LocalizationValue(config.label(bars[index].key))), ring: index), id: \.offset) { glyph in
              Text(verbatim: glyph.text)
                .font(TextStyle.xs2.font(weight: .semibold))
                .foregroundStyle(Color.onAccent)
                .fixedSize()
                .rotationEffect(glyph.rotation)
                .position(glyph.point)
            }
          }
          .allowsHitTesting(false)
        }
      }
    }
    if interactive {
      canvas
        .modifier(
          ChartTooltipModifier(
            axis: .radius, values: bars.map(\.value), labels: bars.map { config.label($0.key) },
            selection: selection, defaultIndex: defaultIndex, cursor: false, sticky: sticky, summary: summary,
            items: { [ChartTooltipItem(bars[$0].key, value: bars[$0].value, color: bars[$0].color)] },
            tooltip: tooltip,
            hit: { location, size in RadialBarLayout(chart: self, size: size).index(at: location) }
          )
        )
    } else {
      canvas
        .accessibilityHidden(true)
    }
  }
}

extension RadialBarChart where Tooltip == EmptyView {
  public init(
    _ bars: [RadialBar],
    domain: ClosedRange<Double>? = nil,
    innerRadius: CGFloat = 0,
    outerRadius: CGFloat = 0.8,
    barSize: CGFloat? = nil,
    startAngle: Angle = .degrees(90),
    endAngle: Angle = .degrees(-270),
    rounded: Bool = false,
    track: RadialBarTrack = .none
  ) {
    self.bars = bars
    self.domain = domain
    self.innerRadius = innerRadius
    self.outerRadius = outerRadius
    self.barSize = barSize
    self.startAngle = startAngle
    self.endAngle = endAngle
    self.rounded = rounded
    self.track = track
    showsLabels = false
    interactive = false
    selection = nil
    defaultIndex = nil
    sticky = true
    summary = nil
    tooltip = { _ in EmptyView() }
  }
}

struct RadialBarLayout {
  struct Ring {
    var middle: CGFloat
    var thickness: CGFloat
  }

  let center: CGPoint
  let inner: CGFloat
  let band: CGFloat
  let thickness: CGFloat
  let count: Int
  let low: Double
  let high: Double
  let start: Angle
  let end: Angle

  init<Tooltip: View>(chart: RadialBarChart<Tooltip>, size: CGSize) {
    let margin: CGFloat = 5
    let maxRadius = max(0, min(size.width, size.height) / 2 - margin)
    center = CGPoint(x: size.width / 2, y: size.height / 2)
    inner = maxRadius * chart.innerRadius
    count = max(chart.bars.count, 1)
    band = (maxRadius * chart.outerRadius - inner) / CGFloat(count)
    thickness = chart.barSize ?? max(1, band * 0.8)
    low = chart.domain?.lowerBound ?? 0
    high = chart.domain?.upperBound ?? Self.niceMax(chart.bars.map(\.value).max() ?? 1)
    start = chart.startAngle
    end = chart.endAngle
  }

  func ring(_ index: Int) -> Ring {
    Ring(middle: inner + band * (CGFloat(index) + 0.5), thickness: thickness)
  }

  func angle(_ value: Double) -> Angle {
    let ratio = high > low ? (value - low) / (high - low) : 0
    return start + (end - start) * min(max(ratio, 0), 1)
  }

  struct Glyph {
    var offset: Int
    var text: String
    var point: CGPoint
    var rotation: Angle
  }

  func glyphs(_ label: String, ring index: Int) -> [Glyph] {
    let middle = max(ring(index).middle, 1)
    let font = UIFont.systemFont(ofSize: TextStyle.xs2.size, weight: .semibold)
    let direction: Double = end.degrees >= start.degrees ? 1 : -1
    var distance = 5 + thickness / 2
    return Array(label).enumerated().map { offset, character in
      let text = String(character)
      let width = (text as NSString).size(withAttributes: [.font: font]).width
      let angle = start.radians + direction * Double(distance + width / 2) / Double(middle)
      distance += width
      return Glyph(
        offset: offset,
        text: text,
        point: ChartArc.point(center: center, radius: middle, angle: angle),
        rotation: .radians(direction > 0 ? angle : angle + .pi)
      )
    }
  }

  func index(at location: CGPoint) -> Int? {
    let distance = hypot(location.x - center.x, location.y - center.y)
    let position = (distance - inner) / max(band, 1)
    guard position >= 0 else { return nil }
    let index = Int(position)
    return index < count ? index : nil
  }

  static func niceMax(_ value: Double) -> Double {
    guard value > 0 else { return 1 }
    var correction = 0.0
    while correction < 20 {
      let rough = value / 4
      let digits = floor(log10(rough)) + 1
      let unit = pow(10, digits)
      let ratio = rough / unit
      let scale = digits != 1 ? 0.05 : 0.1
      let step = ((ratio / scale).rounded(.up) * scale + correction * scale) * unit
      let ups = (value / step).rounded(.up)
      if ups + 1 <= 5 { return ups * step }
      correction += 1
    }
    return value
  }
}

struct ChartArc: Shape {
  var center: CGPoint
  var radius: CGFloat
  var thickness: CGFloat
  var start: Angle
  var end: Angle
  var rounded: Bool

  static func point(center: CGPoint, radius: CGFloat, angle: Double) -> CGPoint {
    CGPoint(x: center.x + radius * CGFloat(sin(angle)), y: center.y - radius * CGFloat(cos(angle)))
  }

  func path(in rect: CGRect) -> Path {
    let sweep = end.radians - start.radians
    guard radius > 0, abs(sweep) > 0.0001 else { return Path() }
    let full = abs(sweep) >= 2 * .pi - 0.0001
    let cap = rounded && !full ? Double(thickness / 2 / radius) : 0
    let direction: Double = sweep >= 0 ? 1 : -1
    var from = start.radians + direction * cap
    var to = end.radians - direction * cap
    if (to - from) * direction < 0 {
      from = (start.radians + end.radians) / 2
      to = from
    }
    var line = Path()
    let steps = max(2, Int(abs(to - from) / (.pi / 180)) + 1)
    for step in 0...steps {
      let angle = from + (to - from) * Double(step) / Double(steps)
      let point = Self.point(center: center, radius: radius, angle: angle)
      if step == 0 {
        line.move(to: point)
      } else {
        line.addLine(to: point)
      }
    }
    if full {
      line.closeSubpath()
    }
    return line.strokedPath(StrokeStyle(lineWidth: thickness, lineCap: rounded ? .round : .butt, lineJoin: .round))
  }
}

public enum PolarGridType: CaseIterable, Sendable {
  case polygon, circle
}

public struct PolarGrid: Sendable {
  public var gridType: PolarGridType
  public var stroke: Color
  public var strokeWidth: CGFloat
  public var fill: Color?
  public var fillOpacity: Double

  public init(
    gridType: PolarGridType = .polygon,
    stroke: Color = .separator,
    strokeWidth: CGFloat = 1,
    fill: Color? = nil,
    fillOpacity: Double = 1
  ) {
    self.gridType = gridType
    self.stroke = stroke
    self.strokeWidth = strokeWidth
    self.fill = fill
    self.fillOpacity = fillOpacity
  }
}

public struct PolarAngleAxis: Sendable {
  public var textStyle: TextStyle
  public var highlightsSelection: Bool

  public init(textStyle: TextStyle = .xs, highlightsSelection: Bool = false) {
    self.textStyle = textStyle
    self.highlightsSelection = highlightsSelection
  }
}

public struct PolarRadiusAxis: Sendable {
  public var angle: Angle
  public var tickCount: Int

  public init(angle: Angle, tickCount: Int = 5) {
    self.angle = angle
    self.tickCount = tickCount
  }
}

public struct Radar: Identifiable, Sendable {
  public let key: String
  public let values: [Double]
  public var color: Color?
  public var fillOpacity: Double
  public var strokeWidth: CGFloat
  public var strokeOpacity: Double
  public var dot: CGFloat?

  public var id: String { key }

  public init(
    _ key: String,
    values: [Double],
    color: Color? = nil,
    fillOpacity: Double = 0.3,
    strokeWidth: CGFloat = 2,
    strokeOpacity: Double = 1,
    dot: CGFloat? = nil
  ) {
    self.key = key
    self.values = values
    self.color = color
    self.fillOpacity = fillOpacity
    self.strokeWidth = strokeWidth
    self.strokeOpacity = strokeOpacity
    self.dot = dot
  }
}

public struct RadarChart<Tooltip: View>: View {
  let series: [Radar]
  let labels: [String]
  let domain: ClosedRange<Double>?
  let outerRadius: CGFloat
  let center: UnitPoint
  let margin: EdgeInsets
  let grid: PolarGrid?
  let angleAxis: PolarAngleAxis
  let radiusAxis: PolarRadiusAxis?
  let selection: Binding<Int?>?
  let sticky: Bool
  let summary: String?
  let items: ((Int) -> [ChartTooltipItem])?
  let tooltip: (ChartTooltipPayload) -> Tooltip

  @State private var owned: Int?
  @Environment(\.chartConfig) private var config

  public init(
    _ series: [Radar],
    labels: [String],
    domain: ClosedRange<Double>? = nil,
    outerRadius: CGFloat = 0.8,
    center: UnitPoint = .center,
    margin: EdgeInsets = EdgeInsets(top: 5, leading: 5, bottom: 5, trailing: 5),
    grid: PolarGrid? = PolarGrid(),
    angleAxis: PolarAngleAxis = PolarAngleAxis(),
    radiusAxis: PolarRadiusAxis? = nil,
    selection: Binding<Int?>? = nil,
    defaultIndex: Int? = nil,
    sticky: Bool = true,
    accessibilityLabel: String? = nil,
    items: ((Int) -> [ChartTooltipItem])? = nil,
    @ViewBuilder tooltip: @escaping (ChartTooltipPayload) -> Tooltip
  ) {
    self.series = series
    self.labels = labels
    self.domain = domain
    self.outerRadius = outerRadius
    self.center = center
    self.margin = margin
    self.grid = grid
    self.angleAxis = angleAxis
    self.radiusAxis = radiusAxis
    self.selection = selection
    self.sticky = sticky
    summary = accessibilityLabel
    self.items = items
    self.tooltip = tooltip
    _owned = State(initialValue: defaultIndex)
  }

  private var current: Int? {
    guard let value = selection?.wrappedValue ?? owned, labels.indices.contains(value) else { return nil }
    return value
  }

  public var body: some View {
    GeometryReader { geometry in
      let layout = RadarLayout(chart: self, size: geometry.size)
      ZStack(alignment: .topLeading) {
        if let grid {
          gridView(grid, layout: layout)
        }
        if let index = current {
          ChartSpokes(center: layout.center, radius: layout.outer, angles: [layout.angle(index)])
            .stroke(Color.separatorStrong, lineWidth: 1)
        }
        ForEach(series) { radar in
          let color = radar.color ?? config.color(radar.key)
          let ratios = ChartVector(values: radar.values.map(layout.ratio))
          ZStack {
            RadarPolygon(center: layout.center, radius: layout.outer, ratios: ratios)
              .fill(color)
              .opacity(radar.fillOpacity)
            if radar.strokeWidth > 0 {
              RadarPolygon(center: layout.center, radius: layout.outer, ratios: ratios)
                .stroke(color, style: StrokeStyle(lineWidth: radar.strokeWidth, lineJoin: .round))
                .opacity(radar.strokeOpacity)
            }
          }
        }
        ForEach(series) { radar in
          if let dot = radar.dot {
            let color = radar.color ?? config.color(radar.key)
            ForEach(radar.values.indices, id: \.self) { index in
              Circle()
                .fill(color)
                .frame(width: (dot + radar.strokeWidth / 2) * 2, height: (dot + radar.strokeWidth / 2) * 2)
                .position(layout.point(index, ratio: layout.ratio(radar.values[index])))
                .opacity(radar.strokeOpacity)
            }
          }
        }
        if let index = current {
          ForEach(series) { radar in
            if radar.values.indices.contains(index) {
              Circle()
                .fill(radar.color ?? config.color(radar.key))
                .frame(width: 8, height: 8)
                .position(layout.point(index, ratio: layout.ratio(radar.values[index])))
                .opacity(radar.strokeOpacity)
            }
          }
        }
        if let radiusAxis {
          ChartPointLayout(placements: layout.radiusTicks(radiusAxis)) {
            ForEach(layout.radiusValues(radiusAxis), id: \.self) { value in
              Text(verbatim: value.formatted())
                .font(TextStyle.xs2.font())
                .foregroundStyle(Color.labelTertiary)
                .fixedSize()
            }
          }
        }
        ChartPointLayout(placements: labels.indices.map(layout.labelPlacement)) {
          ForEach(labels.indices, id: \.self) { index in
            let active = angleAxis.highlightsSelection && current == index
            Text(LocalizedStringKey(labels[index]))
              .font(angleAxis.textStyle.font(weight: active ? .semibold : .regular))
              .foregroundStyle(active ? Color.label : .labelSecondary)
              .fixedSize()
          }
        }
      }
      .frame(width: geometry.size.width, height: geometry.size.height)
    }
    .modifier(
      ChartTooltipModifier(
        axis: .spoke, values: labels.indices.map(Double.init), labels: labels,
        selection: selection ?? $owned, defaultIndex: nil, cursor: false, sticky: sticky, summary: summary,
        items: items ?? { index in
          series.compactMap { radar in
            radar.values.indices.contains(index)
              ? ChartTooltipItem(radar.key, value: radar.values[index], color: radar.color) : nil
          }
        },
        tooltip: tooltip,
        hit: { location, size in RadarLayout(chart: self, size: size).index(at: location) }
      )
    )
  }

  @ViewBuilder private func gridView(_ grid: PolarGrid, layout: RadarLayout) -> some View {
    let circle = grid.gridType == .circle
    let radii = layout.gridRadii(radiusAxis?.tickCount ?? 5)
    if let fill = grid.fill {
      ChartRings(center: layout.center, radii: [radii.max() ?? 0], count: layout.count, circle: circle)
        .fill(fill)
        .opacity(grid.fillOpacity)
    }
    ChartRings(center: layout.center, radii: radii, count: layout.count, circle: circle)
      .stroke(grid.stroke, lineWidth: grid.strokeWidth)
    ChartSpokes(center: layout.center, radius: layout.outer, angles: (0..<layout.count).map(layout.angle))
      .stroke(grid.stroke, lineWidth: grid.strokeWidth)
  }
}

struct RadarLayout {
  let center: CGPoint
  let outer: CGFloat
  let count: Int
  let low: Double
  let high: Double

  init<Tooltip: View>(chart: RadarChart<Tooltip>, size: CGSize) {
    let plot = CGRect(
      x: chart.margin.leading,
      y: chart.margin.top,
      width: max(0, size.width - chart.margin.leading - chart.margin.trailing),
      height: max(0, size.height - chart.margin.top - chart.margin.bottom)
    )
    center = CGPoint(x: plot.minX + plot.width * chart.center.x, y: plot.minY + plot.height * chart.center.y)
    outer = min(plot.width, plot.height) / 2 * chart.outerRadius
    count = max(chart.labels.count, 1)
    low = chart.domain?.lowerBound ?? 0
    high = chart.domain?.upperBound ?? RadialBarLayout.niceMax(chart.series.flatMap(\.values).max() ?? 1)
  }

  func angle(_ index: Int) -> Double {
    2 * .pi * Double(index) / Double(count)
  }

  func ratio(_ value: Double) -> Double {
    high > low ? max(0, (value - low) / (high - low)) : 0
  }

  func point(_ index: Int, ratio: Double) -> CGPoint {
    ChartArc.point(center: center, radius: outer * CGFloat(ratio), angle: angle(index))
  }

  func gridRadii(_ ticks: Int) -> [CGFloat] {
    let steps = max(ticks - 1, 1)
    return (0...steps).map { outer * CGFloat($0) / CGFloat(steps) }
  }

  func radiusValues(_ axis: PolarRadiusAxis) -> [Double] {
    let steps = max(axis.tickCount - 1, 1)
    return (0...steps).map { low + (high - low) * Double($0) / Double(steps) }
  }

  func radiusTicks(_ axis: PolarRadiusAxis) -> [ChartPointLayout.Placement] {
    gridRadii(axis.tickCount).map { radius in
      ChartPointLayout.Placement(
        point: ChartArc.point(center: center, radius: radius, angle: axis.angle.radians),
        anchor: .bottomLeading
      )
    }
  }

  func labelPlacement(_ index: Int) -> ChartPointLayout.Placement {
    let angle = angle(index)
    let horizontal = sin(angle)
    let vertical = cos(angle)
    let x: CGFloat = horizontal > 0.00001 ? 0 : horizontal < -0.00001 ? 1 : 0.5
    let y: CGFloat = abs(horizontal) <= 0.5.squareRoot() ? (vertical > 0 ? 1 : 0) : 0.5
    return ChartPointLayout.Placement(
      point: ChartArc.point(center: center, radius: outer + 8, angle: angle),
      anchor: UnitPoint(x: x, y: y)
    )
  }

  func index(at location: CGPoint) -> Int? {
    var angle = atan2(Double(location.x - center.x), Double(center.y - location.y))
    if angle < 0 { angle += 2 * .pi }
    return Int((angle / (2 * .pi / Double(count))).rounded()) % count
  }
}

struct ChartPointLayout: Layout {
  struct Placement {
    var point: CGPoint
    var anchor: UnitPoint
  }

  var placements: [Placement]

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    proposal.replacingUnspecifiedDimensions()
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    for (index, subview) in subviews.enumerated() where placements.indices.contains(index) {
      let placement = placements[index]
      subview.place(
        at: CGPoint(x: bounds.minX + placement.point.x, y: bounds.minY + placement.point.y),
        anchor: placement.anchor,
        proposal: .unspecified
      )
    }
  }
}

struct ChartVector: VectorArithmetic {
  var values: [Double]

  static var zero: ChartVector { ChartVector(values: []) }

  static func + (lhs: ChartVector, rhs: ChartVector) -> ChartVector {
    combine(lhs, rhs, +)
  }

  static func - (lhs: ChartVector, rhs: ChartVector) -> ChartVector {
    combine(lhs, rhs, -)
  }

  mutating func scale(by rhs: Double) {
    values = values.map { $0 * rhs }
  }

  var magnitudeSquared: Double {
    values.reduce(0) { $0 + $1 * $1 }
  }

  private static func combine(_ lhs: ChartVector, _ rhs: ChartVector, _ operation: (Double, Double) -> Double) -> ChartVector {
    let count = max(lhs.values.count, rhs.values.count)
    return ChartVector(values: (0..<count).map { index in
      operation(
        lhs.values.indices.contains(index) ? lhs.values[index] : 0,
        rhs.values.indices.contains(index) ? rhs.values[index] : 0
      )
    })
  }
}

struct RadarPolygon: Shape {
  var center: CGPoint
  var radius: CGFloat
  var ratios: ChartVector

  var animatableData: ChartVector {
    get { ratios }
    set { ratios = newValue }
  }

  func path(in rect: CGRect) -> Path {
    let count = ratios.values.count
    guard count > 0 else { return Path() }
    var path = Path()
    for (index, ratio) in ratios.values.enumerated() {
      let point = ChartArc.point(
        center: center, radius: radius * CGFloat(max(ratio, 0)), angle: 2 * .pi * Double(index) / Double(count)
      )
      if index == 0 {
        path.move(to: point)
      } else {
        path.addLine(to: point)
      }
    }
    path.closeSubpath()
    return path
  }
}

struct ChartRings: Shape {
  var center: CGPoint
  var radii: [CGFloat]
  var count: Int
  var circle: Bool

  func path(in rect: CGRect) -> Path {
    var path = Path()
    for radius in radii where radius > 0 {
      if circle {
        path.addEllipse(in: CGRect(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2))
      } else {
        for index in 0..<max(count, 1) {
          let point = ChartArc.point(center: center, radius: radius, angle: 2 * .pi * Double(index) / Double(max(count, 1)))
          if index == 0 {
            path.move(to: point)
          } else {
            path.addLine(to: point)
          }
        }
        path.closeSubpath()
      }
    }
    return path
  }
}

struct ChartSpokes: Shape {
  var center: CGPoint
  var radius: CGFloat
  var angles: [Double]

  func path(in rect: CGRect) -> Path {
    var path = Path()
    for angle in angles {
      path.move(to: center)
      path.addLine(to: ChartArc.point(center: center, radius: radius, angle: angle))
    }
    return path
  }
}
