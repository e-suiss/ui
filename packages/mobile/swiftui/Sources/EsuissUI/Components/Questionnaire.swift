import Observation
import PhosphorSwift
import SwiftUI

public enum QuestionnaireItemStatus: CaseIterable, Sendable {
  case unanswered, answered, skipped
}

public enum QuestionnaireDirection: Sendable {
  case forward, backward
}

public struct QuestionnaireItemDefinition: Hashable, Sendable {
  public var name: String
  public var required: Bool
  public var multiple: Bool
  public var disabled: Bool
  public var invalid: Bool

  public init(_ name: String, required: Bool = false, multiple: Bool = false, disabled: Bool = false, invalid: Bool = false) {
    self.name = name
    self.required = required
    self.multiple = multiple
    self.disabled = disabled
    self.invalid = invalid
  }
}

@MainActor
@Observable
public final class QuestionnaireController {
  public private(set) var activeItem: String?
  public private(set) var direction: QuestionnaireDirection = .forward
  public var values: [String: [String]]

  public var onItemChange: ((String) -> Void)?
  public var onSubmit: (([String: [String]]) -> Void)?

  private(set) var registered: [QuestionnaireItemDefinition] = []
  private(set) var skipped: Set<String> = []
  private(set) var attempted: Set<String> = []

  @ObservationIgnored private let explicitItems: [QuestionnaireItemDefinition]?
  @ObservationIgnored private let defaultItem: String?
  @ObservationIgnored private let defaultValues: [String: [String]]

  public init(
    items: [QuestionnaireItemDefinition]? = nil,
    defaultItem: String? = nil,
    defaultValues: [String: [String]] = [:]
  ) {
    explicitItems = items
    self.defaultItem = defaultItem
    self.defaultValues = defaultValues
    values = defaultValues
    activeItem = QuestionnaireController.initialItem(in: items ?? [], preferred: defaultItem)
  }

  var definitions: [QuestionnaireItemDefinition] {
    explicitItems ?? registered
  }

  public var sequence: [String] {
    definitions.filter { !$0.disabled }.map(\.name)
  }

  public var total: Int { sequence.count }

  var index: Int? {
    guard let activeItem else { return nil }
    return sequence.firstIndex(of: activeItem)
  }

  public var current: Int { index.map { $0 + 1 } ?? 0 }

  public var isFirst: Bool { total > 0 && index == 0 }

  public var isLast: Bool { total > 0 && index == total - 1 }

  public var activeItemRequired: Bool? {
    guard let activeItem, index != nil else { return nil }
    return definition(activeItem)?.required ?? false
  }

  public var activeItemStatus: QuestionnaireItemStatus? {
    guard let activeItem, index != nil else { return nil }
    return status(of: activeItem)
  }

  func definition(_ name: String) -> QuestionnaireItemDefinition? {
    definitions.first { $0.name == name }
  }

  public func status(of name: String) -> QuestionnaireItemStatus {
    if skipped.contains(name) { return .skipped }
    return hasAnswer(name) ? .answered : .unanswered
  }

  func hasAnswer(_ name: String) -> Bool {
    (values[name] ?? []).contains { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
  }

  func isSatisfied(_ name: String) -> Bool {
    let definition = definition(name) ?? QuestionnaireItemDefinition(name)
    if definition.disabled { return true }
    let status = status(of: name)
    if status == .skipped && !definition.required { return true }
    return !definition.invalid && status == .answered
  }

  public func isInvalid(_ name: String) -> Bool {
    let definition = definition(name) ?? QuestionnaireItemDefinition(name)
    if definition.disabled { return false }
    if status(of: name) == .skipped && !definition.required { return false }
    return definition.invalid || (attempted.contains(name) && !isSatisfied(name))
  }

  public func isSelected(_ value: String, in name: String) -> Bool {
    !skipped.contains(name) && (values[name] ?? []).contains(value)
  }

  public func select(_ value: String, in name: String, selected: Bool = true) {
    guard let definition = definition(name), !definition.disabled else { return }
    skipped.remove(name)
    var current = values[name] ?? []
    if !selected {
      current.removeAll { $0 == value }
    } else if definition.multiple {
      if !current.contains(value) { current.append(value) }
    } else {
      current = [value]
    }
    values[name] = current
  }

  public func toggle(_ value: String, in name: String) {
    let multiple = definition(name)?.multiple ?? false
    let selected = isSelected(value, in: name)
    select(value, in: name, selected: multiple ? !selected : true)
  }

  public func text(for name: String) -> String {
    values[name]?.first ?? ""
  }

  public func setText(_ text: String, for name: String) {
    if !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty { skipped.remove(name) }
    values[name] = [text]
  }

  @discardableResult
  public func validate(_ name: String) -> Bool {
    attempted.insert(name)
    return isSatisfied(name)
  }

  public func go(to name: String) {
    guard name != activeItem, sequence.contains(name) else { return }
    let from = index ?? -1
    let to = sequence.firstIndex(of: name) ?? 0
    direction = to >= from ? .forward : .backward
    activeItem = name
    onItemChange?(name)
  }

  public func goPrevious() {
    guard let index, index > 0 else { return }
    go(to: sequence[index - 1])
  }

  @discardableResult
  public func goNext() -> Bool {
    guard let index, let activeItem, index + 1 < sequence.count else { return false }
    guard validate(activeItem) else { return false }
    go(to: sequence[index + 1])
    return true
  }

  @discardableResult
  public func advance() -> Bool {
    guard let activeItem else { return false }
    guard validate(activeItem) else { return false }
    if isLast { return submit() }
    return goNext()
  }

  @discardableResult
  public func skip() -> Bool {
    guard let activeItem, let index, activeItemRequired == false else { return false }
    values[activeItem] = []
    skipped.insert(activeItem)
    if index + 1 < sequence.count {
      go(to: sequence[index + 1])
      return true
    }
    return submit()
  }

  @discardableResult
  public func submit() -> Bool {
    for name in sequence where !validate(name) {
      go(to: name)
      return false
    }
    onSubmit?(answers)
    return true
  }

  public var answers: [String: [String]] {
    var result: [String: [String]] = [:]
    for name in sequence where !skipped.contains(name) {
      let entries = (values[name] ?? []).filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
      if !entries.isEmpty { result[name] = entries }
    }
    return result
  }

  public func reset() {
    values = defaultValues
    skipped = []
    attempted = []
    if let target = QuestionnaireController.initialItem(in: definitions, preferred: defaultItem) {
      go(to: target)
    }
  }

  func register(_ items: [QuestionnaireItemDefinition]) {
    var seen = Set<String>()
    let unique = items.filter { seen.insert($0.name).inserted }
    if unique != registered { registered = unique }
    guard explicitItems == nil else { return }
    if index == nil, let target = QuestionnaireController.initialItem(in: unique, preferred: activeItem ?? defaultItem) {
      if activeItem == nil {
        activeItem = target
      } else {
        go(to: target)
      }
    }
  }

  static func initialItem(in items: [QuestionnaireItemDefinition], preferred: String?) -> String? {
    if let preferred, let match = items.first(where: { $0.name == preferred }), !match.disabled {
      return match.name
    }
    return items.first { !$0.disabled }?.name
  }
}

struct QuestionnaireItemsKey: PreferenceKey {
  static var defaultValue: [QuestionnaireItemDefinition] { [] }

  static func reduce(value: inout [QuestionnaireItemDefinition], nextValue: () -> [QuestionnaireItemDefinition]) {
    value.append(contentsOf: nextValue())
  }
}

struct QuestionnaireSlotKey: LayoutValueKey {
  static let defaultValue = false
}

struct QuestionnaireItemContext {
  var name: String
  var multiple: Bool
  var invalid: Bool
  var disabled: Bool
}

extension EnvironmentValues {
  @Entry var questionnaire: QuestionnaireController?
  @Entry var questionnaireDisplayed: String?
  @Entry var questionnaireItem: QuestionnaireItemContext?
}

struct QuestionnaireLayout: Layout {
  let spacing: CGFloat

  private func rows(_ subviews: Subviews, width: CGFloat?) -> [(indices: [Int], height: CGFloat)] {
    var rows: [(indices: [Int], height: CGFloat)] = []
    var slot: Int?
    for (offset, subview) in subviews.enumerated() {
      let size = subview.sizeThatFits(ProposedViewSize(width: width, height: nil))
      if subview[QuestionnaireSlotKey.self] {
        if let slot {
          rows[slot].indices.append(offset)
          rows[slot].height = max(rows[slot].height, size.height)
        } else {
          slot = rows.count
          rows.append((indices: [offset], height: size.height))
        }
      } else {
        rows.append((indices: [offset], height: size.height))
      }
    }
    return rows
  }

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let visible = rows(subviews, width: proposal.width).filter { $0.height > 0 }
    let height = visible.reduce(0) { $0 + $1.height } + spacing * CGFloat(max(visible.count - 1, 0))
    let width = proposal.width ?? subviews.map { $0.sizeThatFits(.unspecified).width }.max() ?? 0
    return CGSize(width: width, height: height)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    var y = bounds.minY
    for row in rows(subviews, width: bounds.width) {
      for index in row.indices {
        subviews[index].place(
          at: CGPoint(x: bounds.minX, y: y),
          anchor: .topLeading,
          proposal: ProposedViewSize(width: bounds.width, height: nil)
        )
      }
      if row.height > 0 { y += row.height + spacing }
    }
  }
}

public struct Questionnaire<Content: View>: View {
  let controller: QuestionnaireController
  let content: Content

  @State private var displayed: String?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(controller: QuestionnaireController, @ViewBuilder content: () -> Content) {
    self.controller = controller
    self.content = content()
    _displayed = State(initialValue: controller.activeItem)
  }

  public var body: some View {
    let controller = controller
    QuestionnaireLayout(spacing: 24) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .environment(\.questionnaire, controller)
    .environment(\.questionnaireDisplayed, displayed ?? controller.activeItem)
    .onPreferenceChange(QuestionnaireItemsKey.self) { items in
      MainActor.assumeIsolated { controller.register(items) }
    }
    .onChange(of: controller.activeItem) { _, name in
      let animation: Animation = reduceMotion ? .linear(duration: 0.2) : .timingCurve(0.32, 0.72, 0, 1, duration: 0.45)
      withAnimation(animation) { displayed = name }
    }
  }
}

public struct QuestionnaireProgress<Label: View>: View {
  let label: (Int, Int) -> Label

  @Environment(\.questionnaire) private var questionnaire

  public init(@ViewBuilder label: @escaping (_ current: Int, _ total: Int) -> Label) {
    self.label = label
  }

  public var body: some View {
    let current = questionnaire?.current ?? 0
    let total = questionnaire?.total ?? 0
    label(current, total)
      .scaledFont(.xs)
      .monospacedDigit()
      .foregroundStyle(EsuissColor.mutedForeground)
      .frame(minHeight: TextStyle.xs.lineHeight, alignment: .leading)
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(Text("Questionnaire progress"))
      .accessibilityValue(total > 0 ? Text("Question \(current) of \(total)") : Text(verbatim: ""))
  }
}

extension QuestionnaireProgress where Label == Text {
  public init() {
    self.init { current, total in
      total > 0 ? Text("Question \(current) of \(total)") : Text(verbatim: " ")
    }
  }
}

public struct QuestionnaireItem<Content: View>: View {
  let definition: QuestionnaireItemDefinition
  let onStatusChange: ((QuestionnaireItemStatus) -> Void)?
  let content: Content

  @Environment(\.questionnaire) private var questionnaire
  @Environment(\.questionnaireDisplayed) private var displayed

  public init(
    name: String,
    required: Bool = false,
    multiple: Bool = false,
    disabled: Bool = false,
    invalid: Bool = false,
    onStatusChange: ((QuestionnaireItemStatus) -> Void)? = nil,
    @ViewBuilder content: () -> Content
  ) {
    definition = QuestionnaireItemDefinition(name, required: required, multiple: multiple, disabled: disabled, invalid: invalid)
    self.onStatusChange = onStatusChange
    self.content = content()
  }

  public var body: some View {
    let name = definition.name
    let active = !definition.disabled && displayed == name
    let forward = questionnaire?.direction != .backward
    let multiple = questionnaire?.definition(name)?.multiple ?? definition.multiple
    let invalid = questionnaire?.isInvalid(name) ?? definition.invalid
    let status = questionnaire?.status(of: name) ?? .unanswered
    ZStack(alignment: .topLeading) {
      if active {
        VStack(alignment: .leading, spacing: 20) {
          content
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .environment(\.questionnaireItem, QuestionnaireItemContext(name: name, multiple: multiple, invalid: invalid, disabled: definition.disabled))
        .environment(\.isInvalid, invalid)
        .accessibilityElement(children: .contain)
        .transition(
          .asymmetric(
            insertion: .move(edge: forward ? .trailing : .leading),
            removal: .move(edge: forward ? .leading : .trailing)
          )
          .combined(with: .opacity)
        )
      }
    }
    .layoutValue(key: QuestionnaireSlotKey.self, value: true)
    .preference(key: QuestionnaireItemsKey.self, value: [definition])
    .onChange(of: status) { _, value in onStatusChange?(value) }
  }
}

public struct QuestionnaireTitle: View {
  let text: Text

  public init(_ title: LocalizedStringKey) {
    text = Text(title)
  }

  public init(verbatim title: String) {
    text = Text(verbatim: title)
  }

  public var body: some View {
    text
      .scaledTextStyle(.base, weight: .semibold)
      .foregroundStyle(EsuissColor.foreground)
      .fixedSize(horizontal: false, vertical: true)
      .accessibilityAddTraits(.isHeader)
  }
}

public struct QuestionnaireDescription: View {
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
      .foregroundStyle(EsuissColor.mutedForeground)
      .fixedSize(horizontal: false, vertical: true)
      .padding(.top, -16)
  }
}

public struct QuestionnaireChoices<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      content
    }
    .accessibilityElement(children: .contain)
  }
}

public struct QuestionnaireChoice<Label: View>: View {
  let value: String
  let disabled: Bool
  let label: Label

  @Environment(\.questionnaire) private var questionnaire
  @Environment(\.questionnaireItem) private var item
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.colorScheme) private var colorScheme
  @State private var taps = 0

  public init(value: String, disabled: Bool = false, @ViewBuilder label: () -> Label) {
    self.value = value
    self.disabled = disabled
    self.label = label()
  }

  public var body: some View {
    let name = item?.name ?? ""
    let multiple = item?.multiple ?? false
    let checked = questionnaire?.isSelected(value, in: name) ?? false
    let invalid = item?.invalid ?? false
    let enabled = isEnabled && !disabled && !(item?.disabled ?? false)
    Button {
      questionnaire?.toggle(value, in: name)
      taps += 1
    } label: {
      HStack(alignment: .firstTextBaseline, spacing: 10) {
        indicator(checked: checked, multiple: multiple, enabled: enabled)
          .alignmentGuide(.firstTextBaseline) { $0[VerticalAlignment.center] + 5 }
        VStack(alignment: .leading, spacing: 4) {
          label
        }
        .scaledFont(.base)
        .foregroundStyle(EsuissColor.foreground)
        .frame(maxWidth: .infinity, alignment: .leading)
        .fixedSize(horizontal: false, vertical: true)
      }
      .padding(.horizontal, 16)
      .padding(.vertical, 12)
      .frame(minHeight: 44)
      .contentShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
    }
    .buttonStyle(QuestionnaireChoiceStyle(checked: checked, invalid: invalid, dark: colorScheme == .dark))
    .disabled(!enabled)
    .hapticFeedback(.selection, trigger: taps)
    .accessibilityAddTraits(checked ? .isSelected : [])
  }

  @ViewBuilder
  private func indicator(checked: Bool, multiple: Bool, enabled: Bool) -> some View {
    let shape = RoundedRectangle(cornerRadius: multiple ? Radius.xs : 8, style: .continuous)
    ZStack {
      shape.fill(checked ? EsuissColor.primary : EsuissColor.border)
      if checked {
        if multiple {
          Ph.check.bold
            .frame(width: 12, height: 12)
            .foregroundStyle(EsuissColor.primaryForeground)
        } else {
          Circle()
            .fill(EsuissColor.primaryForeground)
            .frame(width: colorScheme == .dark ? 10 : 8, height: colorScheme == .dark ? 10 : 8)
        }
      }
    }
    .frame(width: 16, height: 16)
    .accessibilityHidden(true)
  }
}

extension QuestionnaireChoice where Label == Text {
  public init(_ title: LocalizedStringKey, value: String, disabled: Bool = false) {
    self.init(value: value, disabled: disabled) { Text(title) }
  }

  public init(verbatim title: String, value: String, disabled: Bool = false) {
    self.init(value: value, disabled: disabled) { Text(verbatim: title) }
  }
}

private struct QuestionnaireChoiceStyle: ButtonStyle {
  let checked: Bool
  let invalid: Bool
  let dark: Bool

  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
    configuration.label
      .background {
        shape.fill(invalid ? EsuissColor.destructive.opacity(dark ? 0.1 : 0.05) : .clear)
      }
      .overlay {
        shape.strokeBorder(border, lineWidth: checked && !invalid ? 2 : 1)
      }
      .opacity(isEnabled ? (configuration.isPressed ? 0.8 : 1) : 0.5)
      .animation(.easeOut(duration: 0.15), value: checked)
  }

  private var border: Color {
    if invalid { return EsuissColor.destructive }
    return checked ? EsuissColor.primary : EsuissColor.border
  }
}

public struct QuestionnaireChoiceDescription: View {
  let text: Text

  public init(_ description: LocalizedStringKey) {
    text = Text(description)
  }

  public init(verbatim description: String) {
    text = Text(verbatim: description)
  }

  public var body: some View {
    text
      .foregroundStyle(EsuissColor.mutedForeground)
      .fixedSize(horizontal: false, vertical: true)
  }
}

public struct QuestionnaireInput: View {
  let placeholder: Text
  let keyboard: UIKeyboardType
  let contentType: UITextContentType?
  let disabled: Bool

  @Environment(\.questionnaire) private var questionnaire
  @Environment(\.questionnaireItem) private var item
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.colorScheme) private var colorScheme

  public init(
    _ placeholder: LocalizedStringResource = "",
    keyboard: UIKeyboardType = .default,
    contentType: UITextContentType? = nil,
    disabled: Bool = false
  ) {
    self.placeholder = Text(verbatim: String(localized: placeholder))
    self.keyboard = keyboard
    self.contentType = contentType
    self.disabled = disabled
  }

  public var body: some View {
    let name = item?.name ?? ""
    let invalid = item?.invalid ?? false
    let enabled = isEnabled && !disabled && !(item?.disabled ?? false)
    let controller = questionnaire
    let shape = RoundedRectangle(cornerRadius: Radius.lg, style: .continuous)
    TextField(
      text: Binding(
        get: { controller?.text(for: name) ?? "" },
        set: { controller?.setText($0, for: name) }
      ),
      prompt: placeholder.foregroundStyle(EsuissColor.mutedForeground)
    ) {
      placeholder
    }
    .keyboardType(keyboard)
    .textContentType(contentType)
    .textInputAutocapitalization(keyboard == .emailAddress || keyboard == .URL ? .never : nil)
    .autocorrectionDisabled(keyboard == .emailAddress || keyboard == .URL)
    .submitLabel(controller?.isLast == true ? .done : .next)
    .onSubmit { controller?.advance() }
    .scaledFont(.base)
    .foregroundStyle(EsuissColor.foreground)
    .tint(EsuissColor.primary)
    .padding(.horizontal, 12)
    .frame(height: 44)
    .background(invalid ? EsuissColor.destructive.opacity(colorScheme == .dark ? 0.1 : 0.05) : EsuissColor.secondary, in: shape)
    .overlay { shape.strokeBorder(invalid ? EsuissColor.destructive : .clear, lineWidth: 1) }
    .opacity(enabled ? 1 : 0.5)
    .disabled(!enabled)
  }
}

public struct QuestionnaireError: View {
  let text: Text?

  @Environment(\.questionnaire) private var questionnaire
  @Environment(\.questionnaireItem) private var item

  public init() {
    text = nil
  }

  public init(_ message: LocalizedStringKey) {
    text = Text(message)
  }

  public init(verbatim message: String) {
    text = Text(verbatim: message)
  }

  public var body: some View {
    let name = item?.name ?? ""
    let invalid = item?.invalid ?? false
    let required = questionnaire?.definition(name)?.required ?? false
    if invalid {
      (text ?? (required ? Text("Choose an answer to continue.") : Text("Choose an answer or skip this question.")))
        .scaledTextStyle(.sm)
        .foregroundStyle(EsuissColor.destructive)
        .fixedSize(horizontal: false, vertical: true)
        .transition(.opacity)
        .onAppear {
          AccessibilityNotification.Announcement(
            String(localized: required ? "Choose an answer to continue." : "Choose an answer or skip this question.")
          ).post()
        }
    }
  }
}

public struct QuestionnaireActions<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    QuestionnaireActionsLayout(spacing: 8) {
      content
    }
    .frame(maxWidth: .infinity, minHeight: 44)
  }
}

struct QuestionnaireActionPlacementKey: LayoutValueKey {
  static let defaultValue = QuestionnaireActionPlacement.end
}

enum QuestionnaireActionPlacement {
  case start, end
}

struct QuestionnaireActionsLayout: Layout {
  let spacing: CGFloat

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let sizes = subviews.map { $0.sizeThatFits(.unspecified) }.filter { $0.width > 0 }
    let height = sizes.map(\.height).max() ?? 0
    let width = sizes.reduce(0) { $0 + $1.width } + spacing * CGFloat(max(sizes.count - 1, 0))
    return CGSize(width: proposal.width ?? width, height: height)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    var leading = bounds.minX
    var trailing = bounds.maxX
    for subview in subviews where subview[QuestionnaireActionPlacementKey.self] == .start {
      let size = subview.sizeThatFits(.unspecified)
      guard size.width > 0 else { continue }
      subview.place(at: CGPoint(x: leading, y: bounds.midY), anchor: .leading, proposal: ProposedViewSize(size))
      leading += size.width + spacing
    }
    for subview in subviews.reversed() where subview[QuestionnaireActionPlacementKey.self] == .end {
      let size = subview.sizeThatFits(.unspecified)
      guard size.width > 0 else { continue }
      subview.place(at: CGPoint(x: trailing, y: bounds.midY), anchor: .trailing, proposal: ProposedViewSize(size))
      trailing -= size.width + spacing
    }
  }
}

private struct QuestionnaireNavigationButton: View {
  let title: Text
  let variant: VariantButtonStyle.Variant
  let size: VariantButtonStyle.Size
  let visible: Bool
  let action: () -> Void

  var body: some View {
    if visible {
      Button(action: action) { title }
        .buttonStyle(.variant(variant, size: size))
        .transition(.opacity)
    }
  }
}

public struct QuestionnairePrevious: View {
  let title: Text
  let variant: VariantButtonStyle.Variant
  let size: VariantButtonStyle.Size

  @Environment(\.questionnaire) private var questionnaire

  public init(_ title: LocalizedStringKey = "Previous", variant: VariantButtonStyle.Variant = .outline, size: VariantButtonStyle.Size = .default) {
    self.title = Text(title)
    self.variant = variant
    self.size = size
  }

  public var body: some View {
    let visible = (questionnaire?.total ?? 0) > 1 && questionnaire?.isFirst == false
    QuestionnaireNavigationButton(title: title, variant: variant, size: size, visible: visible) {
      questionnaire?.goPrevious()
    }
    .layoutValue(key: QuestionnaireActionPlacementKey.self, value: .start)
  }
}

public struct QuestionnaireSkip: View {
  let title: Text
  let variant: VariantButtonStyle.Variant
  let size: VariantButtonStyle.Size

  @Environment(\.questionnaire) private var questionnaire

  public init(_ title: LocalizedStringKey = "Skip", variant: VariantButtonStyle.Variant = .outline, size: VariantButtonStyle.Size = .default) {
    self.title = Text(title)
    self.variant = variant
    self.size = size
  }

  public var body: some View {
    QuestionnaireNavigationButton(title: title, variant: variant, size: size, visible: questionnaire?.activeItemRequired == false) {
      questionnaire?.skip()
    }
  }
}

public struct QuestionnaireNext: View {
  let title: Text
  let variant: VariantButtonStyle.Variant
  let size: VariantButtonStyle.Size

  @Environment(\.questionnaire) private var questionnaire

  public init(_ title: LocalizedStringKey = "Next", variant: VariantButtonStyle.Variant = .default, size: VariantButtonStyle.Size = .default) {
    self.title = Text(title)
    self.variant = variant
    self.size = size
  }

  public var body: some View {
    let visible = (questionnaire?.total ?? 0) > 1 && questionnaire?.isLast == false
    QuestionnaireNavigationButton(title: title, variant: variant, size: size, visible: visible) {
      questionnaire?.goNext()
    }
  }
}

public struct QuestionnaireSubmit: View {
  let title: Text
  let variant: VariantButtonStyle.Variant
  let size: VariantButtonStyle.Size

  @Environment(\.questionnaire) private var questionnaire

  public init(_ title: LocalizedStringKey = "Submit", variant: VariantButtonStyle.Variant = .default, size: VariantButtonStyle.Size = .default) {
    self.title = Text(title)
    self.variant = variant
    self.size = size
  }

  public var body: some View {
    let visible = (questionnaire?.total ?? 0) > 0 && questionnaire?.isLast == true
    QuestionnaireNavigationButton(title: title, variant: variant, size: size, visible: visible) {
      questionnaire?.submit()
    }
  }
}
