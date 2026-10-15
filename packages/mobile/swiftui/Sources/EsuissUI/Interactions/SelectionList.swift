import PhosphorSwift
import SwiftUI

struct SelectionModel<Value: Hashable> {
  var editing = false
  var selected: Set<Value> = []
  var order: [Value] = []

  mutating func toggle(_ value: Value) {
    if selected.contains(value) {
      selected.remove(value)
    } else {
      selected.insert(value)
    }
  }

  mutating func selectAll() {
    selected = Set(order)
  }

  mutating func clear() {
    selected = []
  }

  mutating func setEditing(_ value: Bool) {
    editing = value
    if !value { selected = [] }
  }
}

struct SelectionListContext {
  var editing: Bool
  var count: Int
  var total: Int
  var isSelected: (AnyHashable) -> Bool
  var toggle: (AnyHashable) -> Void
  var setEditing: (Bool) -> Void
  var selectAll: () -> Void
  var clear: () -> Void
}

extension EnvironmentValues {
  @Entry var selectionList: SelectionListContext?
}

struct SelectionListValuesKey: PreferenceKey {
  static var defaultValue: [AnyHashable] { [] }

  static func reduce(value: inout [AnyHashable], nextValue: () -> [AnyHashable]) {
    value.append(contentsOf: nextValue())
  }
}

let selectionListAnimation = Animation.timingCurve(0.32, 0.72, 0, 1, duration: 0.4)

public struct SelectionListProxy {
  let context: SelectionListContext

  public var isEditing: Bool { context.editing }
  public var count: Int { context.count }
  public var total: Int { context.total }

  public func setEditing(_ value: Bool) {
    context.setEditing(value)
  }

  public func selectAll() {
    context.selectAll()
  }

  public func clear() {
    context.clear()
  }
}

public struct SelectionList<Value: Hashable, Content: View>: View {
  let editingBinding: Binding<Bool>?
  let selectionBinding: Binding<Set<Value>>?
  let content: Content

  @State private var localEditing: Bool
  @State private var localSelection: Set<Value>
  @State private var order: [Value] = []
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    isEditing: Binding<Bool>? = nil,
    selection: Binding<Set<Value>>? = nil,
    defaultEditing: Bool = false,
    defaultSelection: Set<Value> = [],
    @ViewBuilder content: () -> Content
  ) {
    editingBinding = isEditing
    selectionBinding = selection
    _localEditing = State(initialValue: defaultEditing)
    _localSelection = State(initialValue: defaultSelection)
    self.content = content()
  }

  private var model: SelectionModel<Value> {
    SelectionModel(
      editing: editingBinding?.wrappedValue ?? localEditing,
      selected: selectionBinding?.wrappedValue ?? localSelection,
      order: order
    )
  }

  private func update(_ change: (inout SelectionModel<Value>) -> Void) {
    var next = model
    change(&next)
    if next.selected != model.selected {
      if let selectionBinding {
        selectionBinding.wrappedValue = next.selected
      } else {
        localSelection = next.selected
      }
    }
    if next.editing != model.editing {
      let apply = {
        if let editingBinding {
          editingBinding.wrappedValue = next.editing
        } else {
          localEditing = next.editing
        }
      }
      if reduceMotion {
        apply()
      } else {
        withAnimation(selectionListAnimation, apply)
      }
    }
  }

  public var body: some View {
    let current = model
    let context = SelectionListContext(
      editing: current.editing,
      count: current.selected.count,
      total: order.count,
      isSelected: { value in (value.base as? Value).map(current.selected.contains) ?? false },
      toggle: { value in
        guard let value = value.base as? Value else { return }
        update { $0.toggle(value) }
      },
      setEditing: { value in update { $0.setEditing(value) } },
      selectAll: { update { $0.selectAll() } },
      clear: { update { $0.clear() } }
    )
    content
      .environment(\.selectionList, context)
      .onPreferenceChange(SelectionListValuesKey.self) { values in
        order = values.compactMap { $0.base as? Value }
      }
      .accessibilityAction(.escape) {
        if current.editing { context.setEditing(false) }
      }
  }
}

public struct SelectionListTrigger<Label: View>: View {
  let label: Label?

  @Environment(\.selectionList) private var list

  public init(@ViewBuilder label: () -> Label) {
    self.label = label()
  }

  public var body: some View {
    let editing = list?.editing ?? false
    Button {
      list?.setEditing(!editing)
    } label: {
      if let label {
        label
      } else {
        Text(editing ? "Done" : "Select").fontWeight(.semibold)
      }
    }
    .buttonStyle(.variant(.plain))
    .fontWeight(.semibold)
    .accessibilityAddTraits(editing ? .isSelected : [])
  }
}

extension SelectionListTrigger where Label == Text {
  public init() {
    label = nil
  }

  public init(_ title: LocalizedStringKey) {
    label = Text(title).fontWeight(.semibold)
  }
}

public struct SelectionListItem<Value: Hashable, Content: View>: View {
  let value: Value
  let content: Content

  @Environment(\.selectionList) private var list

  public init(value: Value, @ViewBuilder content: () -> Content) {
    self.value = value
    self.content = content()
  }

  public var body: some View {
    let editing = list?.editing ?? false
    let checked = list?.isSelected(AnyHashable(value)) ?? false
    HStack(spacing: 0) {
      SelectionListIndicator(editing: editing, checked: checked)
      content
        .frame(maxWidth: .infinity, alignment: .leading)
        .allowsHitTesting(!editing)
    }
    .background(checked ? EsuissColor.accent : .clear)
    .contentShape(Rectangle())
    .onTapGesture {
      guard editing else { return }
      list?.toggle(AnyHashable(value))
    }
    .animation(.timingCurve(0.32, 0.72, 0, 1, duration: 0.2), value: checked)
    .preference(key: SelectionListValuesKey.self, value: [AnyHashable(value)])
    .modifier(SelectionItemAccessibility(editing: editing, checked: checked) {
      list?.toggle(AnyHashable(value))
    })
  }
}

private struct SelectionItemAccessibility: ViewModifier {
  let editing: Bool
  let checked: Bool
  let toggle: () -> Void

  func body(content: Content) -> some View {
    if editing {
      content
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(checked ? [.isButton, .isSelected] : .isButton)
        .accessibilityAction { toggle() }
    } else {
      content
    }
  }
}

struct SelectionListIndicator: View {
  let editing: Bool
  let checked: Bool

  var body: some View {
    ZStack {
      Circle()
        .strokeBorder(checked ? EsuissColor.primary : EsuissColor.mutedForeground, lineWidth: 1.5)
      if checked {
        Circle().fill(EsuissColor.primary)
        Ph.check.bold
          .frame(width: 14, height: 14)
          .foregroundStyle(EsuissColor.primaryForeground)
          .transition(.scale)
      }
    }
    .frame(width: 22, height: 22)
    .scaleEffect(editing ? 1 : 0.5)
    .padding(.leading, 16)
    .frame(width: editing ? 40 : 0, alignment: .leading)
    .opacity(editing ? 1 : 0)
    .clipped()
    .accessibilityHidden(true)
  }
}

public struct SelectionListBar<Content: View>: View {
  let content: (SelectionListProxy) -> Content

  @Environment(\.selectionList) private var list

  public init(@ViewBuilder content: @escaping (SelectionListProxy) -> Content) {
    self.content = content
  }

  public init(@ViewBuilder content: @escaping () -> Content) {
    self.content = { _ in content() }
  }

  public var body: some View {
    let editing = list?.editing ?? false
    FloatingBar(visible: editing) {
      HStack(spacing: 8) {
        if let list {
          content(SelectionListProxy(context: list))
        }
      }
      .padding(.horizontal, 6)
    }
    .accessibilityElement(children: .contain)
  }
}

public struct SelectionListCount: View {
  let text: Text?

  @Environment(\.selectionList) private var list

  public init() {
    text = nil
  }

  public init(_ title: LocalizedStringKey) {
    text = Text(title)
  }

  public var body: some View {
    let count = list?.count ?? 0
    Group {
      if let text {
        text
      } else if count == 0 {
        Text("Select items")
      } else {
        Text("\(count) selected")
      }
    }
    .scaledFont(.sm, weight: .medium)
    .monospacedDigit()
    .lineLimit(1)
    .multilineTextAlignment(.center)
    .foregroundStyle(EsuissColor.foreground)
    .frame(maxWidth: .infinity)
    .contentTransition(.numericText())
    .accessibilityAddTraits(.updatesFrequently)
  }
}

struct FloatingBar<Content: View>: View {
  let visible: Bool
  var maxWidth: CGFloat = 448
  @ViewBuilder let content: () -> Content

  @State private var bottomInset: CGFloat = 0
  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    let dark = colorScheme == .dark
    content()
      .frame(maxWidth: .infinity, minHeight: 52, maxHeight: 52)
      .foregroundStyle(EsuissColor.foreground)
      .background {
        Capsule()
          .fill(.ultraThinMaterial)
          .overlay {
            Capsule().fill(dark ? EsuissColor.muted.opacity(0.75) : EsuissColor.card.opacity(0.8))
          }
          .shadow(Shadow(color: .black.opacity(dark ? 0.3 : 0.12), radius: 14, y: 10))
      }
      .overlay {
        Capsule().strokeBorder(EsuissColor.border)
      }
      .frame(maxWidth: maxWidth)
      .padding(.horizontal, 16)
      .padding(.bottom, 16)
      .scaleEffect(visible || reduceMotion ? 1 : 0.95, anchor: .bottom)
      .offset(y: min(16, bottomInset) + (visible || reduceMotion ? 0 : 52 + 16 + bottomInset))
      .background {
        Color.clear
          .onGeometryChange(for: CGFloat.self) { $0.safeAreaInsets.bottom } action: { bottomInset = $0 }
      }
      .opacity(visible ? 1 : 0)
      .allowsHitTesting(visible)
      .accessibilityHidden(!visible)
  }
}
