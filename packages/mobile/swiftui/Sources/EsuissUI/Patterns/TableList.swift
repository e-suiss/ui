import SwiftUI

public enum TableListSlot: CaseIterable, Sendable {
  case title, description, trailing, hidden
}

public struct TableListColumn<Row> {
  public let key: String
  public let header: LocalizedStringKey
  public let slot: TableListSlot
  public let cell: (Row) -> Text

  public init(
    _ key: String,
    header: LocalizedStringKey,
    slot: TableListSlot = .hidden,
    cell: @escaping (Row) -> Text
  ) {
    self.key = key
    self.header = header
    self.slot = slot
    self.cell = cell
  }
}

public struct TableList<Row, ID: Hashable>: View {
  let rows: [Row]
  let id: (Row) -> ID
  let columns: [TableListColumn<Row>]
  let title: LocalizedStringKey?
  let emptyText: LocalizedStringKey
  let action: ((Row) -> Void)?

  public init(
    _ rows: [Row],
    id: KeyPath<Row, ID>,
    columns: [TableListColumn<Row>],
    title: LocalizedStringKey? = nil,
    emptyText: LocalizedStringKey = "No results.",
    action: ((Row) -> Void)? = nil
  ) {
    self.rows = rows
    self.id = { $0[keyPath: id] }
    self.columns = columns
    self.title = title
    self.emptyText = emptyText
    self.action = action
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      if let title {
        Text(title)
          .scaledTextStyle(.xl3, weight: .bold)
          .foregroundStyle(EsuissColor.foreground)
          .accessibilityAddTraits(.isHeader)
      }
      if rows.isEmpty {
        Text(emptyText)
          .scaledTextStyle(.base)
          .foregroundStyle(EsuissColor.mutedForeground)
          .padding(.horizontal, 16)
          .padding(.vertical, 12)
          .frame(maxWidth: .infinity, alignment: .leading)
          .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
      } else {
        TableListGroup {
          ForEach(rows.map { TableListEntry(id: id($0), row: $0) }) { entry in
            TableListRow(action: action.map { action in { action(entry.row) } }) {
              cells(entry.row)
            }
          }
        }
      }
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .tableListRowInsets()
  }

  @ViewBuilder private func cells(_ row: Row) -> some View {
    let titleColumn = columns.first { $0.slot == .title }
    let descriptions = columns.filter { $0.slot == .description }
    let trailing = columns.filter { $0.slot == .trailing }
    VStack(alignment: .leading, spacing: 2) {
      if let titleColumn {
        titleColumn.cell(row)
          .scaledTextStyle(.base)
          .foregroundStyle(EsuissColor.foreground)
          .lineLimit(1)
      }
      if !descriptions.isEmpty {
        descriptions.enumerated().reduce(Text(verbatim: "")) { text, entry in
          entry.offset == 0 ? text + entry.element.cell(row) : text + Text(verbatim: " \u{00B7} ") + entry.element.cell(row)
        }
        .scaledTextStyle(.sm)
        .foregroundStyle(EsuissColor.mutedForeground)
        .lineLimit(1)
      }
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    ForEach(trailing, id: \.key) { column in
      column.cell(row)
        .scaledTextStyle(.base)
        .monospacedDigit()
        .foregroundStyle(EsuissColor.mutedForeground)
        .lineLimit(1)
        .fixedSize()
    }
  }
}

extension TableList where Row: Identifiable, ID == Row.ID {
  public init(
    _ rows: [Row],
    columns: [TableListColumn<Row>],
    title: LocalizedStringKey? = nil,
    emptyText: LocalizedStringKey = "No results.",
    action: ((Row) -> Void)? = nil
  ) {
    self.init(rows, id: \.id, columns: columns, title: title, emptyText: emptyText, action: action)
  }
}

struct TableListEntry<Row, ID: Hashable>: Identifiable {
  let id: ID
  let row: Row
}

struct TableListRowKey: PreferenceKey {
  static var defaultValue: [Anchor<CGRect>] { [] }

  static func reduce(value: inout [Anchor<CGRect>], nextValue: () -> [Anchor<CGRect>]) {
    value.append(contentsOf: nextValue())
  }
}

public struct TableListGroup<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    VStack(alignment: .leading, spacing: 0) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .overlayPreferenceValue(TableListRowKey.self) { anchors in
      GeometryReader { proxy in
        let rects = anchors.map { proxy[$0] }.sorted { $0.minY < $1.minY }
        ForEach(Array(rects.dropFirst().enumerated()), id: \.offset) { _, rect in
          Rectangle()
            .fill(EsuissColor.border)
            .frame(width: max(rect.width - 16, 0), height: 1)
            .offset(x: rect.minX + 16, y: rect.minY)
        }
      }
      .allowsHitTesting(false)
      .accessibilityHidden(true)
    }
    .transformPreference(TableListRowKey.self) { $0 = [] }
    .background(EsuissColor.muted, in: shape)
    .clipShape(shape)
    .environment(\.itemGroupInset, true)
    .accessibilityElement(children: .contain)
  }
}

public struct TableListRow<Content: View>: View {
  let action: (() -> Void)?
  let content: Content

  public init(action: (() -> Void)? = nil, @ViewBuilder content: () -> Content) {
    self.action = action
    self.content = content()
  }

  public var body: some View {
    Group {
      if let action {
        Button(action: action) { row }
          .buttonStyle(TableListRowStyle())
      } else {
        row
      }
    }
    .anchorPreference(key: TableListRowKey.self, value: .bounds) { [$0] }
  }

  private var row: some View {
    HStack(spacing: 16) {
      content
    }
    .padding(.vertical, 11)
    .padding(.trailing, 16)
    .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
    .padding(.leading, 16)
    .contentShape(Rectangle())
    .accessibilityElement(children: .combine)
  }
}

private struct TableListRowStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .foregroundStyle(EsuissColor.foreground)
      .opacity(configuration.isPressed ? 0.8 : 1)
  }
}

public struct TableListSection<Content: View>: View {
  let header: LocalizedStringKey?
  let footer: LocalizedStringKey?
  let content: Content

  public init(
    header: LocalizedStringKey? = nil,
    footer: LocalizedStringKey? = nil,
    @ViewBuilder content: () -> Content
  ) {
    self.header = header
    self.footer = footer
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      if let header {
        Text(header)
          .textCase(.uppercase)
          .scaledTextStyle(.xs)
          .foregroundStyle(EsuissColor.mutedForeground)
          .padding(.horizontal, 16)
          .accessibilityAddTraits(.isHeader)
      }
      TableListGroup { content }
      if let footer {
        Text(footer)
          .scaledTextStyle(.xs)
          .foregroundStyle(EsuissColor.mutedForeground)
          .fixedSize(horizontal: false, vertical: true)
          .padding(.horizontal, 16)
      }
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .tableListRowInsets()
  }
}

extension View {
  func tableListRowInsets() -> some View {
    listRowInsets(EdgeInsets())
      .listRowBackground(Color.clear)
      .listRowSeparator(.hidden)
  }
}
