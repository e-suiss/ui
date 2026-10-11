import PhosphorSwift
import SwiftUI

public protocol TipStorage: Sendable {
  func getItem(_ key: String) async -> String?
  func setItem(_ key: String, _ value: String?) async
}

public actor InMemoryTipStorage: TipStorage {
  public static let shared = InMemoryTipStorage()

  private var values: [String: String] = [:]

  public init() {}

  public func getItem(_ key: String) async -> String? {
    values[key]
  }

  public func setItem(_ key: String, _ value: String?) async {
    values[key] = value
  }
}

enum TipKeys {
  static func key(_ id: String) -> String { "tip:" + id }
  static let dismissed = "dismissed"
}

public func resetTips(_ ids: [String], storage: any TipStorage = InMemoryTipStorage.shared) async {
  for id in ids {
    await storage.setItem(TipKeys.key(id), nil)
  }
}

enum TipQueue {
  static func current(order: [String], loaded: Set<String>, skipped: Set<String>) -> String? {
    for id in order {
      guard loaded.contains(id) else { return nil }
      if !skipped.contains(id) { return id }
    }
    return nil
  }
}

struct TipGroupContext {
  var current: String?
  var storage: any TipStorage
  var complete: (String) -> Void
}

struct TipContext {
  var visible: Bool
  var dismiss: () -> Void
}

extension EnvironmentValues {
  @Entry var tipGroup: TipGroupContext?
  @Entry var tip: TipContext?
}

struct TipIdsKey: PreferenceKey {
  static var defaultValue: [String] { [] }

  static func reduce(value: inout [String], nextValue: () -> [String]) {
    value.append(contentsOf: nextValue())
  }
}

let tipAnimation = Animation.timingCurve(0.32, 0.72, 0, 1, duration: 0.4)

public struct TipGroup<Content: View>: View {
  let storage: any TipStorage
  let content: Content

  @State private var order: [String] = []
  @State private var loaded: Set<String> = []
  @State private var skipped: Set<String> = []

  public init(storage: any TipStorage = InMemoryTipStorage.shared, @ViewBuilder content: () -> Content) {
    self.storage = storage
    self.content = content()
  }

  public var body: some View {
    let context = TipGroupContext(
      current: TipQueue.current(order: order, loaded: loaded, skipped: skipped),
      storage: storage,
      complete: { id in skipped.insert(id) }
    )
    content
      .environment(\.tipGroup, context)
      .onPreferenceChange(TipIdsKey.self) { ids in
        order = ids
        load(ids)
      }
      .transformPreference(TipIdsKey.self) { $0 = [] }
  }

  private func load(_ ids: [String]) {
    let storage = storage
    for id in ids where !loaded.contains(id) {
      Task { @MainActor in
        let value = await storage.getItem(TipKeys.key(id))
        if value == TipKeys.dismissed { skipped.insert(id) }
        loaded.insert(id)
      }
    }
  }
}

public struct Tip<Content: View>: View {
  let id: String
  let delay: Duration
  let storage: (any TipStorage)?
  let onDismiss: (() -> Void)?
  let content: Content

  @State private var ready = false
  @State private var dismissed = false
  @Environment(\.tipGroup) private var group
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    id: String,
    delay: Duration = .zero,
    storage: (any TipStorage)? = nil,
    onDismiss: (() -> Void)? = nil,
    @ViewBuilder content: () -> Content
  ) {
    self.id = id
    self.delay = delay
    self.storage = storage
    self.onDismiss = onDismiss
    self.content = content()
  }

  private var resolvedStorage: any TipStorage {
    storage ?? group?.storage ?? InMemoryTipStorage.shared
  }

  private var turn: Bool {
    group.map { $0.current == id } ?? true
  }

  public var body: some View {
    let visible = ready && turn && !dismissed
    ZStack(alignment: .topLeading) {
      Color.clear
        .frame(width: 0, height: 0)
        .preference(key: TipIdsKey.self, value: [id])
        .task(id: turn) {
          await reveal()
        }
      content
        .environment(\.tip, TipContext(visible: visible, dismiss: dismiss))
    }
  }

  private func reveal() async {
    guard turn, !ready else { return }
    if group == nil, await resolvedStorage.getItem(TipKeys.key(id)) == TipKeys.dismissed { return }
    if delay > .zero {
      try? await Task.sleep(for: delay)
      guard !Task.isCancelled else { return }
    }
    animate { ready = true }
  }

  private func dismiss() {
    guard !dismissed else { return }
    animate { dismissed = true }
    let storage = resolvedStorage
    let key = TipKeys.key(id)
    Task { await storage.setItem(key, TipKeys.dismissed) }
    group?.complete(id)
    onDismiss?()
  }

  private func animate(_ change: () -> Void) {
    if reduceMotion {
      change()
    } else {
      withAnimation(tipAnimation, change)
    }
  }
}

struct TipCloseKey: LayoutValueKey {
  static let defaultValue = false
}

struct TipRowLayout: Layout {
  var padding: CGFloat = 16
  var trailing: CGFloat = 48
  var spacing: CGFloat = 12

  private func widths(_ subviews: Subviews, width: CGFloat?) -> [CGFloat?] {
    let row = subviews.filter { !$0[TipCloseKey.self] }
    let fixed = row.map { $0.priority > 0 ? nil : $0.sizeThatFits(.unspecified).width } as [CGFloat?]
    guard let width else { return fixed }
    let inner = width - padding - trailing - spacing * CGFloat(max(row.count - 1, 0))
    let used = fixed.compactMap { $0 }.reduce(0, +)
    let flexible = fixed.filter { $0 == nil }.count
    let share = flexible > 0 ? max(0, inner - used) / CGFloat(flexible) : 0
    return fixed.map { $0 ?? share }
  }

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let row = subviews.filter { !$0[TipCloseKey.self] }
    let sizes = zip(row, widths(subviews, width: proposal.width)).map { view, width in
      view.sizeThatFits(ProposedViewSize(width: width, height: nil))
    }
    let height = sizes.map(\.height).max() ?? 0
    let contentWidth = sizes.map(\.width).reduce(0, +) + spacing * CGFloat(max(row.count - 1, 0))
    return CGSize(
      width: proposal.width ?? contentWidth + padding + trailing,
      height: max(height + padding * 2, 48)
    )
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    let row = subviews.filter { !$0[TipCloseKey.self] }
    var x = bounds.minX + padding
    for (view, width) in zip(row, widths(subviews, width: bounds.width)) {
      let size = view.sizeThatFits(ProposedViewSize(width: width, height: nil))
      view.place(at: CGPoint(x: x, y: bounds.minY + padding), anchor: .topLeading, proposal: ProposedViewSize(width: width, height: size.height))
      x += (width ?? size.width) + spacing
    }
    for view in subviews where view[TipCloseKey.self] {
      view.place(at: CGPoint(x: bounds.maxX - 8, y: bounds.minY + 8), anchor: .topTrailing, proposal: ProposedViewSize(width: 32, height: 32))
    }
  }
}

public struct TipCard<Content: View>: View {
  let content: Content

  @Environment(\.tip) private var tip

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if tip?.visible ?? false {
      TipRowLayout {
        content
      }
      .foregroundStyle(Color.label)
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
      .accessibilityElement(children: .contain)
      .transition(.opacity.combined(with: .offset(y: -8)))
    }
  }
}

extension View {
  public func tipPopover<Content: View>(
    side: Edge = .bottom,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    modifier(TipPopoverPresenter(side: side, popover: content))
  }
}

struct TipPopoverPresenter<Popover: View>: ViewModifier {
  let side: Edge
  @ViewBuilder let popover: () -> Popover

  @Environment(\.tip) private var tip

  private var arrowEdge: Edge {
    switch side {
    case .top: .bottom
    case .bottom: .top
    case .leading: .trailing
    case .trailing: .leading
    }
  }

  func body(content: Content) -> some View {
    let tip = tip
    let visible = tip?.visible ?? false
    content
      .simultaneousGesture(TapGesture().onEnded {
        if visible { tip?.dismiss() }
      })
      .popover(
        isPresented: Binding(
          get: { visible },
          set: { if !$0 { tip?.dismiss() } }
        ),
        arrowEdge: arrowEdge
      ) {
        TipPopoverSurface { popover() }
          .environment(\.tip, tip)
          .presentationCompactAdaptation(.popover)
          .presentationBackground(Color.surfaceRaised)
      }
  }
}

struct TipPopoverSurface<Content: View>: View {
  @ViewBuilder let content: () -> Content

  var body: some View {
    TipRowLayout {
      content()
    }
    .foregroundStyle(Color.label)
    .frame(width: 320, alignment: .leading)
    .fixedSize(horizontal: false, vertical: true)
    .accessibilityElement(children: .contain)
  }
}

public struct TipIcon<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    content
      .frame(width: 32, height: 32)
      .foregroundStyle(Color.accent)
      .accessibilityHidden(true)
  }
}

public struct TipContent<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 2) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .layoutPriority(1)
  }
}

public struct TipTitle: View {
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
      .foregroundStyle(Color.label)
      .fixedSize(horizontal: false, vertical: true)
      .accessibilityAddTraits(.isHeader)
  }
}

public struct TipDescription: View {
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
      .fixedSize(horizontal: false, vertical: true)
  }
}

public struct TipClose: View {
  @Environment(\.tip) private var tip

  public init() {}

  public var body: some View {
    Button {
      tip?.dismiss()
    } label: {
      Ph.x.bold
        .frame(width: 16, height: 16)
    }
    .buttonStyle(TipCloseStyle())
    .accessibilityLabel(Text("Dismiss tip"))
    .layoutValue(key: TipCloseKey.self, value: true)
  }
}

private struct TipCloseStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .foregroundStyle(configuration.isPressed ? Color.label : .labelSecondary)
      .frame(width: 32, height: 32)
      .background(configuration.isPressed ? Color.itemPressed : .clear, in: Circle())
      .contentShape(Circle().inset(by: -6))
  }
}
