import SwiftUI

public enum InputGroupAddonAlign: CaseIterable, Sendable, Hashable {
  case inlineStart, inlineEnd, blockStart, blockEnd

  var isBlock: Bool {
    self == .blockStart || self == .blockEnd
  }
}

struct InputGroupContext: Sendable {
  var focusRequest = 0
  var addons: Set<InputGroupAddonAlign> = []
  var requestFocus: @MainActor @Sendable () -> Void = {}
}

extension EnvironmentValues {
  @Entry var inputGroup: InputGroupContext? = nil
}

struct InputGroupAddonsKey: PreferenceKey {
  static var defaultValue: Set<InputGroupAddonAlign> { [] }

  static func reduce(value: inout Set<InputGroupAddonAlign>, nextValue: () -> Set<InputGroupAddonAlign>) {
    value.formUnion(nextValue())
  }
}

struct InputGroupFocusedKey: PreferenceKey {
  static var defaultValue: Bool { false }

  static func reduce(value: inout Bool, nextValue: () -> Bool) {
    value = value || nextValue()
  }
}

struct InputGroupMultilineKey: PreferenceKey {
  static var defaultValue: Bool { false }

  static func reduce(value: inout Bool, nextValue: () -> Bool) {
    value = value || nextValue()
  }
}

struct InputGroupButtonKey: PreferenceKey {
  static var defaultValue: Bool { false }

  static func reduce(value: inout Bool, nextValue: () -> Bool) {
    value = value || nextValue()
  }
}

enum InputGroupSlot: Sendable, Equatable {
  case control
  case addon(InputGroupAddonAlign)
}

struct InputGroupSlotKey: LayoutValueKey {
  static let defaultValue = InputGroupSlot.control
}

public struct InputGroup<Content: View>: View {
  let content: Content

  @State private var focusRequest = 0
  @State private var addons: Set<InputGroupAddonAlign> = []
  @State private var focused = false
  @State private var multiline = false
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.isInvalid) private var invalid
  @Environment(\.colorScheme) private var colorScheme

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    let request = $focusRequest
    let rounded = multiline || addons.contains(.blockStart) || addons.contains(.blockEnd)
    ButtonGroupItem(radius: rounded ? Radius.xl : Radius.lg) { shape in
      InputGroupLayout {
        content
      }
      .frame(maxWidth: .infinity, minHeight: 44)
      .environment(
        \.inputGroup,
        InputGroupContext(
          focusRequest: focusRequest,
          addons: addons,
          requestFocus: { request.wrappedValue += 1 }
        )
      )
      .onPreferenceChange(InputGroupAddonsKey.self) { addons = $0 }
      .onPreferenceChange(InputGroupFocusedKey.self) { focused = $0 }
      .onPreferenceChange(InputGroupMultilineKey.self) { multiline = $0 }
      .background(background, in: shape)
      .overlay {
        shape.strokeBorder(border, lineWidth: 1)
      }
      .contentShape(shape)
    }
    .accessibilityElement(children: .contain)
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

struct InputGroupLayout: Layout {
  private struct Rows {
    var top: [Int] = []
    var leading: [Int] = []
    var controls: [Int] = []
    var trailing: [Int] = []
    var bottom: [Int] = []
  }

  private func rows(_ subviews: Subviews) -> Rows {
    var rows = Rows()
    for index in subviews.indices {
      switch subviews[index][InputGroupSlotKey.self] {
      case .control: rows.controls.append(index)
      case .addon(.inlineStart): rows.leading.append(index)
      case .addon(.inlineEnd): rows.trailing.append(index)
      case .addon(.blockStart): rows.top.append(index)
      case .addon(.blockEnd): rows.bottom.append(index)
      }
    }
    return rows
  }

  private func middle(_ rows: Rows, subviews: Subviews, width: CGFloat?) -> [(Int, CGFloat)] {
    let fixed = (rows.leading + rows.trailing).map { ($0, subviews[$0].sizeThatFits(.unspecified).width) }
    let used = fixed.reduce(0) { $0 + $1.1 }
    let share: CGFloat
    if let width, !rows.controls.isEmpty {
      share = max(width - used, 0) / CGFloat(rows.controls.count)
    } else {
      share = 0
    }
    let widths = Dictionary(uniqueKeysWithValues: fixed)
    let ordered = rows.leading + rows.controls + rows.trailing
    return ordered.map { index in
      if let fixedWidth = widths[index] { return (index, fixedWidth) }
      return (index, width == nil ? subviews[index].sizeThatFits(.unspecified).width : share)
    }
  }

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let rows = rows(subviews)
    let width = proposal.width
    var height: CGFloat = 0
    var widest: CGFloat = 0
    for index in rows.top + rows.bottom {
      let size = subviews[index].sizeThatFits(ProposedViewSize(width: width, height: nil))
      height += size.height
      widest = max(widest, size.width)
    }
    let line = middle(rows, subviews: subviews, width: width)
    var lineHeight: CGFloat = 0
    var lineWidth: CGFloat = 0
    for (index, itemWidth) in line {
      lineHeight = max(lineHeight, subviews[index].sizeThatFits(ProposedViewSize(width: itemWidth, height: nil)).height)
      lineWidth += itemWidth
    }
    height += lineHeight
    return CGSize(width: width ?? max(widest, lineWidth), height: height)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    let rows = rows(subviews)
    var y = bounds.minY
    for index in rows.top {
      let size = subviews[index].sizeThatFits(ProposedViewSize(width: bounds.width, height: nil))
      subviews[index].place(at: CGPoint(x: bounds.minX, y: y), anchor: .topLeading, proposal: ProposedViewSize(width: bounds.width, height: size.height))
      y += size.height
    }
    var bottomHeight: CGFloat = 0
    for index in rows.bottom {
      bottomHeight += subviews[index].sizeThatFits(ProposedViewSize(width: bounds.width, height: nil)).height
    }
    let line = middle(rows, subviews: subviews, width: bounds.width)
    let lineHeight = max(bounds.maxY - bottomHeight - y, 0)
    var x = bounds.minX
    for (index, width) in line {
      let height = subviews[index].sizeThatFits(ProposedViewSize(width: width, height: nil)).height
      let control = subviews[index][InputGroupSlotKey.self] == .control
      let placed = control ? max(height, lineHeight) : height
      subviews[index].place(
        at: CGPoint(x: x, y: y + (lineHeight - placed) / 2),
        anchor: .topLeading,
        proposal: ProposedViewSize(width: width, height: placed)
      )
      x += width
    }
    y += lineHeight
    for index in rows.bottom {
      let size = subviews[index].sizeThatFits(ProposedViewSize(width: bounds.width, height: nil))
      subviews[index].place(at: CGPoint(x: bounds.minX, y: y), anchor: .topLeading, proposal: ProposedViewSize(width: bounds.width, height: size.height))
      y += size.height
    }
  }
}

public struct InputGroupAddon<Content: View>: View {
  let align: InputGroupAddonAlign
  let content: Content

  @State private var hasButton = false
  @Environment(\.inputGroup) private var group
  @Environment(\.isEnabled) private var isEnabled

  public init(align: InputGroupAddonAlign = .inlineStart, @ViewBuilder content: () -> Content) {
    self.align = align
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 8) {
      content
    }
    .labelStyle(ButtonLabelStyle(spacing: 8, iconSize: 16))
    .scaledFont(.base)
    .foregroundStyle(isEnabled ? Color.labelSecondary : .labelQuaternary)
    .lineLimit(1)
    .padding(.vertical, align.isBlock ? 0 : 8)
    .padding(.top, align == .blockStart ? 12 : 0)
    .padding(.bottom, align == .blockEnd ? 12 : 0)
    .padding(.leading, leading)
    .padding(.trailing, trailing)
    .frame(maxWidth: align.isBlock ? .infinity : nil, alignment: .leading)
    .contentShape(Rectangle())
    .onTapGesture { group?.requestFocus() }
    .onPreferenceChange(InputGroupButtonKey.self) { hasButton = $0 }
    .transformPreference(InputGroupButtonKey.self) { $0 = false }
    .preference(key: InputGroupAddonsKey.self, value: [align])
    .layoutValue(key: InputGroupSlotKey.self, value: .addon(align))
  }

  private var leading: CGFloat {
    switch align {
    case .inlineStart: hasButton ? 8 : 12
    case .inlineEnd: 0
    case .blockStart, .blockEnd: 12
    }
  }

  private var trailing: CGFloat {
    switch align {
    case .inlineEnd: hasButton ? 8 : 12
    case .inlineStart: 0
    case .blockStart, .blockEnd: 12
    }
  }
}

public enum InputGroupButtonSize: CaseIterable, Sendable {
  case xs, sm, iconXs, iconSm
}

public struct InputGroupButton<Label: View>: View {
  public typealias Size = InputGroupButtonSize

  let variant: VariantButtonStyle.Variant
  let size: Size
  let action: () -> Void
  let label: Label

  public init(
    variant: VariantButtonStyle.Variant = .ghost,
    size: Size = .xs,
    action: @escaping () -> Void,
    @ViewBuilder label: () -> Label
  ) {
    self.variant = variant
    self.size = size
    self.action = action
    self.label = label()
  }

  public var body: some View {
    Button(action: action) {
      label
    }
    .buttonStyle(style)
    .preference(key: InputGroupButtonKey.self, value: true)
  }

  private var style: VariantButtonStyle {
    switch size {
    case .xs:
      VariantButtonStyle(variant, size: .xs, metrics: ButtonMetrics(horizontalPadding: 6, spacing: 4, iconSize: 14, textStyle: .sm))
    case .sm:
      VariantButtonStyle(variant, size: .sm)
    case .iconXs:
      VariantButtonStyle(variant, size: .iconXs, metrics: ButtonMetrics(horizontalPadding: 0, spacing: 4, iconSize: 14, textStyle: .sm))
    case .iconSm:
      VariantButtonStyle(variant, size: .iconSm)
    }
  }
}

extension InputGroupButton where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    variant: VariantButtonStyle.Variant = .ghost,
    size: Size = .xs,
    action: @escaping () -> Void
  ) {
    self.init(variant: variant, size: size, action: action) { Text(title) }
  }
}

public struct InputGroupText<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 8) {
      content
    }
    .labelStyle(ButtonLabelStyle(spacing: 8, iconSize: 16))
    .scaledFont(.base)
    .foregroundStyle(Color.labelSecondary)
  }
}

extension InputGroupText where Content == Text {
  public init(_ text: LocalizedStringKey) {
    self.init { Text(text) }
  }

  public init(verbatim text: String) {
    self.init { Text(verbatim: text) }
  }
}

public struct InputGroupInput: View {
  let title: LocalizedStringKey
  let text: Binding<String>

  @Environment(\.inputGroup) private var group
  @Environment(\.isEnabled) private var isEnabled

  public init(_ title: LocalizedStringKey, text: Binding<String>) {
    self.title = title
    self.text = text
  }

  public var body: some View {
    let addons = group?.addons ?? []
    TextField(title, text: text)
      .textFieldStyle(.plain)
      .scaledFont(.base)
      .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
      .tint(Color.accent)
      .padding(.leading, addons.contains(.inlineStart) ? 6 : 12)
      .padding(.trailing, addons.contains(.inlineEnd) ? 6 : 12)
      .frame(maxWidth: .infinity, minHeight: 44)
      .modifier(InputGroupFocus(request: group?.focusRequest ?? 0))
      .layoutValue(key: InputGroupSlotKey.self, value: .control)
  }
}

public struct InputGroupTextarea: View {
  let title: LocalizedStringKey
  let text: Binding<String>
  let lineLimit: ClosedRange<Int>

  @Environment(\.inputGroup) private var group
  @Environment(\.isEnabled) private var isEnabled

  public init(_ title: LocalizedStringKey, text: Binding<String>, lineLimit: ClosedRange<Int> = 2...8) {
    self.title = title
    self.text = text
    self.lineLimit = lineLimit
  }

  public var body: some View {
    TextField(title, text: text, axis: .vertical)
      .textFieldStyle(.plain)
      .lineLimit(lineLimit)
      .scaledFont(.base)
      .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
      .tint(Color.accent)
      .padding(.horizontal, 12)
      .padding(.vertical, 10)
      .frame(maxWidth: .infinity, alignment: .topLeading)
      .modifier(InputGroupFocus(request: group?.focusRequest ?? 0))
      .preference(key: InputGroupMultilineKey.self, value: true)
      .layoutValue(key: InputGroupSlotKey.self, value: .control)
  }
}

struct InputGroupFocus: ViewModifier {
  let request: Int

  @FocusState private var focused: Bool

  func body(content: Content) -> some View {
    content
      .focused($focused)
      .contentShape(Rectangle())
      .onTapGesture { focused = true }
      .onChange(of: request) { focused = true }
      .preference(key: InputGroupFocusedKey.self, value: focused)
  }
}
