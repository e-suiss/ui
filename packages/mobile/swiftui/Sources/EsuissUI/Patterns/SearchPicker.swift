import PhosphorSwift
import SwiftUI

public struct SearchPickerItem: Hashable, Sendable, Identifiable {
  public var value: String
  public var label: String
  public var group: String?
  public var disabled: Bool

  public var id: String { value }

  public init(value: String, label: String, group: String? = nil, disabled: Bool = false) {
    self.value = value
    self.label = label
    self.group = group
    self.disabled = disabled
  }
}

struct SearchPickerGroup: Hashable {
  let name: String
  let items: [SearchPickerItem]

  static func grouping(_ items: [SearchPickerItem], query: String) -> [SearchPickerGroup] {
    let trimmed = query.trimmingCharacters(in: .whitespaces)
    var order: [String] = []
    var buckets: [String: [SearchPickerItem]] = [:]
    for item in items where trimmed.isEmpty || item.label.localizedCaseInsensitiveContains(trimmed) {
      let key = item.group ?? ""
      if buckets[key] == nil { order.append(key) }
      buckets[key, default: []].append(item)
    }
    return order.map { SearchPickerGroup(name: $0, items: buckets[$0] ?? []) }
  }
}

public struct SearchPicker: View {
  let items: [SearchPickerItem]
  let selection: Binding<String?>
  let placeholder: LocalizedStringKey?
  let searchPlaceholder: LocalizedStringKey
  let emptyText: LocalizedStringKey
  let title: LocalizedStringKey?
  let showCloseButton: Bool
  let closeLabel: LocalizedStringKey?

  @State private var open = false
  @CompactLayout private var compact
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.isInvalid) private var invalid
  @Environment(\.colorScheme) private var colorScheme

  public init(
    items: [SearchPickerItem],
    selection: Binding<String?>,
    placeholder: LocalizedStringKey? = nil,
    searchPlaceholder: LocalizedStringKey = "Search...",
    emptyText: LocalizedStringKey = "No results found.",
    title: LocalizedStringKey? = nil,
    showCloseButton: Bool = false,
    closeLabel: LocalizedStringKey? = nil
  ) {
    self.items = items
    self.selection = selection
    self.placeholder = placeholder
    self.searchPlaceholder = searchPlaceholder
    self.emptyText = emptyText
    self.title = title
    self.showCloseButton = showCloseButton
    self.closeLabel = closeLabel
  }

  public var body: some View {
    let isOpen = $open
    trigger
      .drawer(isPresented: $open.gated(compact), detents: [.medium, .large]) {
        SearchPickerSheet(
          items: items,
          selection: selection,
          searchPlaceholder: searchPlaceholder,
          emptyText: emptyText,
          title: title,
          showCloseButton: showCloseButton,
          closeLabel: closeLabel
        )
      }
      .popover(isPresented: $open.gated(!compact)) {
        SearchPickerPanel(
          items: items,
          selection: selection,
          searchPlaceholder: searchPlaceholder,
          emptyText: emptyText
        )
        .frame(width: 320, height: 360)
        .environment(\.overlayDismiss, OverlayDismiss { isOpen.wrappedValue = false })
        .presentationCompactAdaptation(.popover)
        .presentationBackground(EsuissColor.card)
      }
  }

  private var selected: SearchPickerItem? {
    items.first { $0.value == selection.wrappedValue }
  }

  private var trigger: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.lg, style: .continuous)
    let selected = selected
    return Button {
      open = true
    } label: {
      HStack(spacing: 6) {
        Group {
          if let selected {
            Text(verbatim: selected.label)
          } else if let placeholder {
            Text(placeholder)
          } else {
            Text(verbatim: "")
          }
        }
        .scaledFont(TextStyle.base)
        .lineLimit(1)
        .foregroundStyle(selected == nil ? EsuissColor.mutedForeground : EsuissColor.foreground)
        .frame(maxWidth: .infinity, alignment: .leading)
        Ph.caretUpDown.regular
          .frame(width: 16, height: 16)
          .foregroundStyle(EsuissColor.mutedForeground)
          .accessibilityHidden(true)
      }
      .padding(.horizontal, 12)
      .frame(height: 44)
      .background(background, in: shape)
      .overlay {
        if invalid { shape.strokeBorder(EsuissColor.destructive) }
      }
      .contentShape(shape)
      .opacity(isEnabled ? 1 : 0.5)
    }
    .buttonStyle(.plain)
    .accessibilityHint(Text("Shows options"))
  }

  private var background: Color {
    if invalid { return EsuissColor.destructive.opacity(colorScheme == .dark ? 0.1 : 0.05) }
    return EsuissColor.secondary
  }
}

struct SearchPickerSheet: View {
  let items: [SearchPickerItem]
  let selection: Binding<String?>
  let searchPlaceholder: LocalizedStringKey
  let emptyText: LocalizedStringKey
  let title: LocalizedStringKey?
  let showCloseButton: Bool
  let closeLabel: LocalizedStringKey?
  var initialQuery = ""
  var autofocus = true

  var body: some View {
    DrawerContent(showCloseButton: showCloseButton, closeLabel: closeLabel) {
      if let title {
        DrawerHeader {
          DrawerTitle(title)
        }
      }
      SearchPickerPanel(
        items: items,
        selection: selection,
        searchPlaceholder: searchPlaceholder,
        emptyText: emptyText,
        trailingInset: title == nil && showCloseButton ? (closeLabel == nil ? 44 : 84) : 0,
        initialQuery: initialQuery,
        autofocus: autofocus
      )
      .padding(.horizontal, 12)
      .padding(.top, 5)
      .padding(.bottom, 12)
    }
  }
}

struct SearchPickerPanel: View {
  let items: [SearchPickerItem]
  let selection: Binding<String?>
  let searchPlaceholder: LocalizedStringKey
  let emptyText: LocalizedStringKey
  var trailingInset: CGFloat = 0
  var initialQuery = ""
  var autofocus = true

  @State private var query = ""
  @FocusState private var focused: Bool
  @Environment(\.overlayDismiss) private var dismiss

  var body: some View {
    let groups = SearchPickerGroup.grouping(items, query: query)
    VStack(spacing: 0) {
      HStack(spacing: 12) {
        Ph.magnifyingGlass.regular
          .frame(width: 22, height: 22)
          .foregroundStyle(EsuissColor.mutedForeground)
          .accessibilityHidden(true)
        TextField(searchPlaceholder, text: $query, prompt: Text(searchPlaceholder).foregroundStyle(EsuissColor.mutedForeground))
          .focused($focused)
          .textInputAutocapitalization(.never)
          .autocorrectionDisabled()
          .scaledFont(TextStyle.xl)
          .foregroundStyle(EsuissColor.foreground)
          .tint(EsuissColor.primary)
      }
      .padding(.leading, 16)
      .padding(.trailing, 16 + trailingInset)
      .frame(height: 56)
      .overlay(alignment: .bottom) {
        EsuissColor.border.frame(height: 1)
      }
      ScrollView {
        LazyVStack(alignment: .leading, spacing: 0) {
          if groups.isEmpty {
            Text(emptyText)
              .scaledFont(TextStyle.base)
              .foregroundStyle(EsuissColor.mutedForeground)
              .multilineTextAlignment(.center)
              .frame(maxWidth: .infinity)
              .padding(.vertical, 40)
          }
          ForEach(Array(groups.enumerated()), id: \.element.name) { index, group in
            VStack(alignment: .leading, spacing: 0) {
              if !group.name.isEmpty {
                Text(verbatim: group.name)
                  .scaledFont(TextStyle.xs, weight: .semibold)
                  .foregroundStyle(EsuissColor.mutedForeground)
                  .padding(.horizontal, 12)
                  .padding(.top, 4)
                  .padding(.bottom, 6)
                  .accessibilityAddTraits(.isHeader)
              }
              ForEach(group.items) { item in
                row(item)
              }
            }
            .padding(.top, index > 0 ? 8 : 0)
          }
        }
        .padding(6)
      }
      .scrollDismissesKeyboard(.interactively)
    }
    .foregroundStyle(EsuissColor.foreground)
    .onAppear {
      query = initialQuery
      if autofocus { focused = true }
    }
  }

  private func row(_ item: SearchPickerItem) -> some View {
    let checked = item.value == selection.wrappedValue
    return Button {
      selection.wrappedValue = item.value
      dismiss?()
    } label: {
      Text(verbatim: item.label)
    }
    .buttonStyle(SearchPickerRowStyle(checked: checked))
    .disabled(item.disabled)
    .accessibilityAddTraits(checked ? .isSelected : [])
  }
}

struct SearchPickerRowStyle: ButtonStyle {
  let checked: Bool

  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    HStack(spacing: 12) {
      configuration.label
        .scaledFont(TextStyle.base)
        .lineLimit(1)
        .frame(maxWidth: .infinity, alignment: .leading)
      if checked {
        Ph.check.regular
          .frame(width: 20, height: 20)
          .foregroundStyle(EsuissColor.mutedForeground)
          .accessibilityHidden(true)
      }
    }
    .foregroundStyle(EsuissColor.foreground)
    .padding(.horizontal, 12)
    .frame(height: 40)
    .opacity(isEnabled ? (configuration.isPressed ? 0.8 : 1) : 0.5)
    .contentShape(Rectangle())
  }
}
