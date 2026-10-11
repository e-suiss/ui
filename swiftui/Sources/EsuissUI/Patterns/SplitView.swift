import PhosphorSwift
import SwiftUI

public enum SplitViewColumn: CaseIterable, Sendable {
  case sidebar, list, detail

  var next: SplitViewColumn {
    switch self {
    case .sidebar: .list
    case .list, .detail: .detail
    }
  }

  var previous: SplitViewColumn? {
    switch self {
    case .sidebar: nil
    case .list: .sidebar
    case .detail: .list
    }
  }

  var order: Int {
    switch self {
    case .sidebar: 0
    case .list: 1
    case .detail: 2
    }
  }

  var weight: CGFloat {
    switch self {
    case .sidebar: 20
    case .list: 32
    case .detail: 48
    }
  }
}

enum SplitViewMath {
  static let wideWidth: CGFloat = 768

  static func isWide(_ width: CGFloat) -> Bool {
    width >= wideWidth
  }

  static func backColumn(for kind: SplitViewColumn, present: [SplitViewColumn]) -> SplitViewColumn? {
    guard let previous = kind.previous else { return nil }
    return present.contains(previous) ? previous : nil
  }

  static func widths(total: CGFloat, present: [SplitViewColumn]) -> [SplitViewColumn: CGFloat] {
    let available = max(0, total - CGFloat(max(present.count - 1, 0)))
    let sum = present.reduce(0) { $0 + $1.weight }
    guard sum > 0 else { return [:] }
    var result: [SplitViewColumn: CGFloat] = [:]
    for column in present {
      result[column] = (available * column.weight / sum).rounded(.down)
    }
    return result
  }
}

struct SplitViewColumnKey: LayoutValueKey {
  static let defaultValue: SplitViewColumn? = nil
}

struct SplitViewColumnsLayout: Layout {
  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let width = proposal.width ?? SplitViewMath.wideWidth
    if let height = proposal.height { return CGSize(width: width, height: height) }
    let widths = columnWidths(total: width, subviews: subviews)
    let height = zip(subviews, widths).map { $0.sizeThatFits(ProposedViewSize(width: $1, height: nil)).height }.max() ?? 0
    return CGSize(width: width, height: height)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    let widths = columnWidths(total: bounds.width, subviews: subviews)
    var x = bounds.minX
    for (subview, width) in zip(subviews, widths) {
      subview.place(
        at: CGPoint(x: x, y: bounds.minY),
        anchor: .topLeading,
        proposal: ProposedViewSize(width: width, height: bounds.height)
      )
      x += width + 1
    }
  }

  private func columnWidths(total: CGFloat, subviews: Subviews) -> [CGFloat] {
    let kinds = subviews.map { $0[SplitViewColumnKey.self] ?? .detail }
    let widths = SplitViewMath.widths(total: total, present: kinds)
    var result = kinds.map { widths[$0] ?? 0 }
    if !result.isEmpty {
      let used = result.dropLast().reduce(0, +) + CGFloat(result.count - 1)
      result[result.count - 1] = max(0, total - used)
    }
    return result
  }
}

struct SplitViewPaneInfo: Equatable {
  let kind: SplitViewColumn
  let title: Text?
}

struct SplitViewPanesKey: PreferenceKey {
  static var defaultValue: [SplitViewPaneInfo] { [] }

  static func reduce(value: inout [SplitViewPaneInfo], nextValue: () -> [SplitViewPaneInfo]) {
    value.append(contentsOf: nextValue())
  }
}

struct SplitViewContext: @unchecked Sendable {
  var wide = false
  var column: SplitViewColumn = .list
  var panes: [SplitViewPaneInfo] = []
  var forward = true
  var select: @MainActor @Sendable (SplitViewColumn) -> Void = { _ in }

  func title(_ kind: SplitViewColumn) -> Text? {
    panes.first { $0.kind == kind }?.title
  }
}

extension EnvironmentValues {
  @Entry var splitView: SplitViewContext? = nil
  @Entry var splitViewColumn: SplitViewColumn = .list
}

public struct SplitView<Content: View>: View {
  let external: Binding<SplitViewColumn>?
  let content: Content

  @State private var local: SplitViewColumn
  @State private var width: CGFloat = 0
  @State private var panes: [SplitViewPaneInfo] = []
  @State private var forward = true
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(column: Binding<SplitViewColumn>, @ViewBuilder content: () -> Content) {
    self.external = column
    self._local = State(initialValue: column.wrappedValue)
    self.content = content()
  }

  public init(defaultColumn: SplitViewColumn = .list, @ViewBuilder content: () -> Content) {
    self.external = nil
    self._local = State(initialValue: defaultColumn)
    self.content = content()
  }

  public var body: some View {
    let binding = external ?? $local
    let current = binding.wrappedValue
    let wide = SplitViewMath.isWide(width)
    let animation: Animation? = reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.35)
    let context = SplitViewContext(
      wide: wide,
      column: current,
      panes: panes,
      forward: forward,
      select: { next in
        guard next != binding.wrappedValue else { return }
        forward = next.order > binding.wrappedValue.order
        if wide {
          binding.wrappedValue = next
        } else {
          withAnimation(animation) { binding.wrappedValue = next }
        }
      }
    )
    Group {
      if wide {
        SplitViewColumnsLayout { content }
      } else {
        ZStack(alignment: .topLeading) { content }
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .clipped()
    .environment(\.splitView, context)
    .onGeometryChange(for: CGFloat.self) { $0.size.width } action: { width = $0 }
    .onPreferenceChange(SplitViewPanesKey.self) { value in panes = value }
  }
}

struct SplitViewPane<Content: View>: View {
  let kind: SplitViewColumn
  let title: Text?
  let content: Content

  @Environment(\.splitView) private var splitView
  @Environment(\.layoutDirection) private var layoutDirection

  var body: some View {
    let context = splitView ?? SplitViewContext()
    Group {
      if context.wide {
        pane(context)
          .frame(maxHeight: .infinity, alignment: .top)
          .overlay(alignment: .leading) {
            if context.panes.first?.kind != kind {
              Color.separator.frame(width: 1).offset(x: -1)
            }
          }
          .layoutValue(key: SplitViewColumnKey.self, value: kind)
      } else if context.column == kind {
        pane(context)
          .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
          .transition(
            .asymmetric(
              insertion: .move(edge: context.forward ? .trailing : .leading),
              removal: .move(edge: context.forward ? .leading : .trailing)
            )
          )
      } else {
        Color.clear
          .frame(width: 0, height: 0)
          .accessibilityHidden(true)
      }
    }
    .preference(key: SplitViewPanesKey.self, value: [SplitViewPaneInfo(kind: kind, title: title)])
  }

  private func pane(_ context: SplitViewContext) -> some View {
    let back = context.wide ? nil : SplitViewMath.backColumn(for: kind, present: context.panes.map(\.kind))
    return ScrollView {
      VStack(alignment: .leading, spacing: 0) {
        if let back {
          Button {
            context.select(back)
          } label: {
            HStack(spacing: 2) {
              Ph.caretLeft.bold
                .frame(width: 18, height: 18)
                .flipsForRightToLeftLayoutDirection(true)
              if let title = context.title(back) {
                title.lineLimit(1)
              } else {
                Text("Back")
              }
            }
            .scaledFont(.base)
            .foregroundStyle(Color.link)
            .frame(minHeight: 44)
            .contentShape(Rectangle())
          }
          .buttonStyle(SplitViewBackStyle())
          .padding(.leading, -6)
        }
        if let title {
          heading(title, wide: context.wide)
        }
        VStack(alignment: .leading, spacing: 0) {
          content
        }
        .padding(.top, context.wide ? 0 : -1)
        .clipped()
        .environment(\.splitViewColumn, kind)
      }
      .padding(padding(wide: context.wide))
      .frame(maxWidth: .infinity, alignment: .leading)
    }
  }

  @ViewBuilder
  private func heading(_ title: Text, wide: Bool) -> some View {
    if !wide {
      title
        .scaledFont(.xl3, weight: .bold)
        .foregroundStyle(Color.label)
        .padding(.bottom, 8)
        .accessibilityAddTraits(.isHeader)
    } else {
      switch kind {
      case .sidebar:
        title
          .scaledFont(.xs, weight: .semibold)
          .foregroundStyle(Color.labelSecondary)
          .padding(.horizontal, 12)
          .padding(.top, 12)
          .padding(.bottom, 8)
          .accessibilityAddTraits(.isHeader)
      case .list:
        title
          .frame(width: 0, height: 0)
          .opacity(0)
          .accessibilityAddTraits(.isHeader)
      case .detail:
        title
          .scaledFont(.xl, weight: .semibold)
          .foregroundStyle(Color.label)
          .padding(.bottom, 4)
          .accessibilityAddTraits(.isHeader)
      }
    }
  }

  private func padding(wide: Bool) -> EdgeInsets {
    guard wide else { return EdgeInsets(top: 0, leading: 16, bottom: 16, trailing: 16) }
    switch kind {
    case .sidebar: return EdgeInsets(top: 4, leading: 12, bottom: 12, trailing: 12)
    case .list: return EdgeInsets(top: 12, leading: 12, bottom: 12, trailing: 12)
    case .detail: return EdgeInsets(top: 32, leading: 32, bottom: 32, trailing: 32)
    }
  }
}

private struct SplitViewBackStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label.opacity(configuration.isPressed ? 0.6 : 1)
  }
}

public struct SplitViewSidebar<Content: View>: View {
  let title: Text?
  let content: Content

  public init(_ title: LocalizedStringKey? = nil, @ViewBuilder content: () -> Content) {
    self.title = title.map { Text($0) }
    self.content = content()
  }

  public init(verbatim title: String, @ViewBuilder content: () -> Content) {
    self.title = Text(verbatim: title)
    self.content = content()
  }

  public var body: some View {
    SplitViewPane(kind: .sidebar, title: title, content: content)
  }
}

public struct SplitViewList<Content: View>: View {
  let title: Text?
  let content: Content

  public init(_ title: LocalizedStringKey? = nil, @ViewBuilder content: () -> Content) {
    self.title = title.map { Text($0) }
    self.content = content()
  }

  public init(verbatim title: String, @ViewBuilder content: () -> Content) {
    self.title = Text(verbatim: title)
    self.content = content()
  }

  public var body: some View {
    SplitViewPane(kind: .list, title: title, content: content)
  }
}

public struct SplitViewDetail<Content: View>: View {
  let title: Text?
  let content: Content

  public init(_ title: LocalizedStringKey? = nil, @ViewBuilder content: () -> Content) {
    self.title = title.map { Text($0) }
    self.content = content()
  }

  public init(verbatim title: String, @ViewBuilder content: () -> Content) {
    self.title = Text(verbatim: title)
    self.content = content()
  }

  public var body: some View {
    SplitViewPane(kind: .detail, title: title, content: content)
  }
}

public struct SplitViewItem<Label: View>: View {
  let isActive: Bool
  let action: (() -> Void)?
  let label: Label

  @Environment(\.splitView) private var splitView
  @Environment(\.splitViewColumn) private var kind

  public init(isActive: Bool = false, action: (() -> Void)? = nil, @ViewBuilder label: () -> Label) {
    self.isActive = isActive
    self.action = action
    self.label = label()
  }

  public var body: some View {
    let wide = splitView?.wide ?? false
    Button {
      action?()
      splitView?.select(kind.next)
    } label: {
      HStack(spacing: 12) {
        VStack(alignment: .leading, spacing: 2) {
          label
        }
        .scaledFont(.base)
        .frame(maxWidth: .infinity, alignment: .leading)
        if !wide && kind != .detail {
          Ph.caretRight.regular
            .frame(width: 16, height: 16)
            .foregroundStyle(Color.labelTertiary)
            .flipsForRightToLeftLayoutDirection(true)
            .accessibilityHidden(true)
        }
      }
    }
    .buttonStyle(SplitViewItemStyle(wide: wide, kind: kind, active: isActive))
    .accessibilityAddTraits(isActive ? .isSelected : [])
  }
}

private struct SplitViewItemStyle: ButtonStyle {
  let wide: Bool
  let kind: SplitViewColumn
  let active: Bool

  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    let pressed = configuration.isPressed && isEnabled
    if wide {
      let shape = RoundedRectangle(cornerRadius: kind == .list ? Radius.xl : Radius.lg, style: .continuous)
      configuration.label
        .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
        .padding(.horizontal, 12)
        .padding(.vertical, kind == .list ? 12 : 8)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(pressed ? Color.itemPressed : active ? .itemSelected : .clear, in: shape)
        .contentShape(shape)
    } else {
      configuration.label
        .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
        .padding(.vertical, 12)
        .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
        .background(pressed ? Color.itemPressed : .clear)
        .overlay(alignment: .top) {
          Color.separator.frame(height: 1)
        }
        .contentShape(Rectangle())
    }
  }
}
