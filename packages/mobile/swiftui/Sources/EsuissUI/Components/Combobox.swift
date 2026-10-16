import PhosphorSwift
import SwiftUI

public struct Combobox<Item: Hashable & Sendable>: View {
  let items: [Item]
  let single: Binding<Item?>?
  let multiple: Binding<[Item]>?
  let placeholder: LocalizedStringKey
  let searchPlaceholder: LocalizedStringKey
  let emptyText: LocalizedStringKey
  let title: (Item) -> String

  @State private var open = false
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.isInvalid) private var invalid
  @Environment(\.colorScheme) private var colorScheme

  public init(
    _ items: [Item],
    selection: Binding<Item?>,
    placeholder: LocalizedStringKey = "Select",
    searchPlaceholder: LocalizedStringKey = "Search",
    emptyText: LocalizedStringKey = "No items found.",
    title: @escaping (Item) -> String
  ) {
    self.items = items
    self.single = selection
    self.multiple = nil
    self.placeholder = placeholder
    self.searchPlaceholder = searchPlaceholder
    self.emptyText = emptyText
    self.title = title
  }

  public init(
    _ items: [Item],
    selection: Binding<[Item]>,
    placeholder: LocalizedStringKey = "Select",
    searchPlaceholder: LocalizedStringKey = "Search",
    emptyText: LocalizedStringKey = "No items found.",
    title: @escaping (Item) -> String
  ) {
    self.items = items
    self.single = nil
    self.multiple = selection
    self.placeholder = placeholder
    self.searchPlaceholder = searchPlaceholder
    self.emptyText = emptyText
    self.title = title
  }

  public var body: some View {
    trigger
      .anchoredPopup(
        isPresented: $open,
        side: .bottom,
        align: .start,
        matchWidth: true,
        minWidth: 144,
        maxHeight: 340
      ) {
        ComboboxPanel(
          items: items,
          single: single,
          multiple: multiple,
          searchPlaceholder: searchPlaceholder,
          emptyText: emptyText,
          title: title
        )
      }
  }

  private var shape: RoundedRectangle {
    RoundedRectangle(cornerRadius: Radius.lg, style: .continuous)
  }

  private var background: Color {
    if invalid { return EsuissColor.destructive.opacity(colorScheme == .dark ? 0.1 : 0.05) }
    return EsuissColor.secondary
  }

  @ViewBuilder private var trigger: some View {
    if let multiple {
      chips(multiple)
    } else if let single {
      input(single)
    }
  }

  private func input(_ selection: Binding<Item?>) -> some View {
    HStack(spacing: 4) {
      Button {
        open = true
      } label: {
        Group {
          if let value = selection.wrappedValue {
            Text(verbatim: title(value))
              .foregroundStyle(EsuissColor.foreground)
          } else {
            Text(placeholder)
              .foregroundStyle(EsuissColor.mutedForeground)
          }
        }
        .scaledFont(TextStyle.base)
        .lineLimit(1)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .padding(.leading, 12)
        .contentShape(Rectangle())
      }
      .buttonStyle(.plain)
      .accessibilityHint(Text("Shows options"))
      if selection.wrappedValue != nil {
        Button {
          selection.wrappedValue = nil
        } label: {
          Ph.x.regular
            .frame(width: 16, height: 16)
            .foregroundStyle(EsuissColor.foreground)
        }
        .buttonStyle(ComboboxIconButtonStyle())
        .accessibilityLabel(Text("Clear"))
      }
      Button {
        open = true
      } label: {
        Ph.caretDown.regular
          .frame(width: 16, height: 16)
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      .buttonStyle(ComboboxIconButtonStyle())
      .accessibilityHidden(true)
    }
    .padding(.trailing, 8)
    .frame(height: 44)
    .background(background, in: shape)
    .overlay {
      if invalid { shape.strokeBorder(EsuissColor.destructive) }
    }
    .opacity(isEnabled ? 1 : 0.5)
  }

  private func chips(_ selection: Binding<[Item]>) -> some View {
    let values = selection.wrappedValue
    return ComboboxFlowLayout(spacing: 6) {
      ForEach(values, id: \.self) { value in
        ComboboxChip(text: title(value)) {
          selection.wrappedValue.removeAll { $0 == value }
        }
      }
      if values.isEmpty {
        Text(placeholder)
          .scaledFont(TextStyle.base)
          .foregroundStyle(EsuissColor.mutedForeground)
          .lineLimit(1)
      }
    }
    .padding(.horizontal, values.isEmpty ? 12 : 6)
    .padding(.vertical, 6)
    .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
    .background(background, in: shape)
    .overlay {
      if invalid { shape.strokeBorder(EsuissColor.destructive) }
    }
    .opacity(isEnabled ? 1 : 0.5)
    .contentShape(shape)
    .onTapGesture {
      if isEnabled { open = true }
    }
    .accessibilityElement(children: .contain)
    .accessibilityAction(named: Text("Show options")) { open = true }
  }
}

extension Combobox where Item == String {
  public init(
    _ items: [String],
    selection: Binding<String?>,
    placeholder: LocalizedStringKey = "Select",
    searchPlaceholder: LocalizedStringKey = "Search",
    emptyText: LocalizedStringKey = "No items found."
  ) {
    self.init(
      items,
      selection: selection,
      placeholder: placeholder,
      searchPlaceholder: searchPlaceholder,
      emptyText: emptyText
    ) { $0 }
  }

  public init(
    _ items: [String],
    selection: Binding<[String]>,
    placeholder: LocalizedStringKey = "Select",
    searchPlaceholder: LocalizedStringKey = "Search",
    emptyText: LocalizedStringKey = "No items found."
  ) {
    self.init(
      items,
      selection: selection,
      placeholder: placeholder,
      searchPlaceholder: searchPlaceholder,
      emptyText: emptyText
    ) { $0 }
  }
}

private struct ComboboxIconButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .frame(width: 24, height: 24)
      .opacity(configuration.isPressed ? 0.8 : 1)
      .contentShape(Circle().inset(by: -6))
  }
}

private struct ComboboxChip: View {
  let text: String
  let remove: () -> Void

  @Environment(\.isEnabled) private var isEnabled

  var body: some View {
    HStack(spacing: 2) {
      Text(verbatim: text)
        .scaledFont(TextStyle.xs)
        .lineLimit(1)
      Button(action: remove) {
        Ph.x.regular
          .frame(width: 12, height: 12)
          .frame(width: 20, height: 20)
          .contentShape(Rectangle())
      }
      .buttonStyle(ChipRemoveStyle())
      .accessibilityLabel(Text("Remove \(text)"))
    }
    .foregroundStyle(EsuissColor.primary)
    .padding(.leading, 10)
    .padding(.trailing, 2)
    .frame(height: 22)
    .background(Color.adaptive(light: EsuissColor.primary.opacity(0.1), dark: EsuissColor.primary.opacity(0.2)), in: Capsule())
  }
}

private struct ChipRemoveStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label.opacity(configuration.isPressed ? 1 : 0.5)
  }
}

struct ComboboxFlowLayout: Layout {
  var spacing: CGFloat

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let rows = arrange(width: proposal.width ?? .infinity, subviews: subviews)
    let width = rows.map(\.width).max() ?? 0
    let height = rows.map(\.height).reduce(0, +) + spacing * CGFloat(max(rows.count - 1, 0))
    return CGSize(width: proposal.width ?? width, height: height)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    var y = bounds.minY
    for row in arrange(width: bounds.width, subviews: subviews) {
      var x = bounds.minX
      for index in row.indices {
        let size = subviews[index].sizeThatFits(.unspecified)
        subviews[index].place(
          at: CGPoint(x: x, y: y + (row.height - size.height) / 2),
          anchor: .topLeading,
          proposal: ProposedViewSize(width: min(size.width, bounds.width), height: size.height)
        )
        x += size.width + spacing
      }
      y += row.height + spacing
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
      let next = row.indices.isEmpty ? size.width : row.width + spacing + size.width
      if !row.indices.isEmpty && next > width {
        rows.append(row)
        row = Row()
      }
      row.width = row.indices.isEmpty ? size.width : row.width + spacing + size.width
      row.height = max(row.height, size.height)
      row.indices.append(index)
    }
    if !row.indices.isEmpty { rows.append(row) }
    return rows
  }
}

struct ComboboxPanel<Item: Hashable & Sendable>: View {
  let items: [Item]
  let single: Binding<Item?>?
  let multiple: Binding<[Item]>?
  let searchPlaceholder: LocalizedStringKey
  let emptyText: LocalizedStringKey
  let title: (Item) -> String
  var initialQuery = ""
  var autofocus = true

  @State private var query = ""
  @FocusState private var focused: Bool
  @Environment(\.overlayDismiss) private var dismiss

  var body: some View {
    let filtered = items.filter { query.isEmpty || title($0).localizedCaseInsensitiveContains(query) }
    let list = VStack(alignment: .leading, spacing: 0) {
      if filtered.isEmpty {
        Text(emptyText)
          .scaledFont(TextStyle.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
          .multilineTextAlignment(.center)
          .frame(maxWidth: .infinity)
          .padding(.vertical, 8)
      }
      ForEach(filtered, id: \.self) { item in
        row(item)
      }
    }
    .padding(6)
    VStack(spacing: 0) {
      TextField(searchPlaceholder, text: $query)
        .focused($focused)
        .textInputAutocapitalization(.never)
        .autocorrectionDisabled()
        .scaledFont(TextStyle.base)
        .foregroundStyle(EsuissColor.foreground)
        .tint(EsuissColor.primary)
        .padding(.horizontal, 12)
        .frame(height: 32)
        .background(EsuissColor.secondary, in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
        .overlay {
          RoundedRectangle(cornerRadius: Radius.lg, style: .continuous)
            .strokeBorder(EsuissColor.border.opacity(0.3))
        }
        .padding([.horizontal, .top], 6)
      ViewThatFits(in: .vertical) {
        list
        ScrollView { list }
      }
    }
    .scaledFont(TextStyle.base)
    .foregroundStyle(EsuissColor.foreground)
    .popupSurface(radius: Radius.xl)
    .accessibilityElement(children: .contain)
    .onAppear {
      query = initialQuery
      if autofocus { focused = true }
    }
  }

  private func isSelected(_ item: Item) -> Bool {
    if let multiple { return multiple.wrappedValue.contains(item) }
    return single?.wrappedValue == item
  }

  private func row(_ item: Item) -> some View {
    let selected = isSelected(item)
    return Button {
      if let multiple {
        if selected {
          multiple.wrappedValue.removeAll { $0 == item }
        } else {
          multiple.wrappedValue.append(item)
        }
      } else {
        single?.wrappedValue = item
        dismiss?()
      }
    } label: {
      Text(verbatim: title(item))
    }
    .buttonStyle(MenuRowStyle(trailing: 32))
    .overlay(alignment: .trailing) {
      if selected {
        Ph.check.regular
          .frame(width: 16, height: 16)
          .foregroundStyle(EsuissColor.primary)
          .padding(.trailing, 8)
          .accessibilityHidden(true)
      }
    }
    .accessibilityAddTraits(selected ? .isSelected : [])
  }
}
