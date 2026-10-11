import PhosphorSwift
import SwiftUI

public struct EmptySearch: View {
  static var suggestions: [String] { ["Book Air", "Book Pro", "Book mini", "Compare Book models"] }

  @State private var query: String
  @FocusState private var focused: Bool
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init() {
    self.init(query: "book neo")
  }

  init(query: String) {
    _query = State(initialValue: query)
  }

  private var matches: [String] {
    let trimmed = query.trimmingCharacters(in: .whitespaces).lowercased()
    guard !trimmed.isEmpty, trimmed.hasPrefix("book") else { return [] }
    return Self.suggestions.filter { $0.lowercased().hasPrefix(trimmed) }
  }

  public var body: some View {
    Screen {
      KeyboardScrollView {
        VStack(alignment: .leading, spacing: 26) {
          field
          if matches.isEmpty {
            empty
              .id(query.isEmpty)
              .transition(.opacity.combined(with: .offset(y: 8)))
          } else {
            suggested
          }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 24)
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.5), value: query.isEmpty)
  }

  private var field: some View {
    HStack(spacing: 10) {
      Ph.magnifyingGlass.regular
        .frame(width: 20, height: 20)
        .foregroundStyle(Color.labelSecondary)
        .accessibilityHidden(true)
      TextField("Search suiss", text: $query)
        .focused($focused)
        .submitLabel(.search)
        .textInputAutocapitalization(.never)
        .autocorrectionDisabled()
        .scaledFont(.xl, weight: .semibold)
        .foregroundStyle(Color.label)
        .tint(Color.accent)
        .accessibilityLabel(Text("Search suiss"))
      if !query.isEmpty {
        Button {
          query = ""
          focused = true
        } label: {
          Ph.x.bold
            .frame(width: 11, height: 11)
            .foregroundStyle(Color.surface)
            .frame(width: 22, height: 22)
            .background(Color.labelTertiary, in: Circle())
            .frame(width: 44, height: 44)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .padding(.trailing, -11)
        .accessibilityLabel(Text("Clear search"))
      }
    }
    .frame(height: 52)
    .overlay(alignment: .bottom) {
      (focused ? Color.accent : .separatorStrong).frame(height: 1)
    }
  }

  private var suggested: some View {
    VStack(alignment: .leading, spacing: 4) {
      Text("Suggested")
        .scaledFont(.xs2)
        .foregroundStyle(Color.labelSecondary)
        .padding(.bottom, 6)
        .accessibilityAddTraits(.isHeader)
      ForEach(matches, id: \.self) { item in
        Button {
          query = item
        } label: {
          HStack(spacing: 10) {
            Ph.magnifyingGlass.regular
              .frame(width: 14, height: 14)
              .foregroundStyle(Color.labelTertiary)
            Text(verbatim: item)
              .scaledFont(.lg)
              .foregroundStyle(Color.label)
          }
          .frame(maxWidth: .infinity, minHeight: 36, alignment: .leading)
          .contentShape(Rectangle())
        }
        .buttonStyle(EmptySearchRowStyle())
      }
    }
  }

  private var empty: some View {
    VStack(alignment: .leading, spacing: 12) {
      Group {
        if query.isEmpty {
          Text("What are you looking for?")
        } else {
          Text("No results for “\(query)”.")
        }
      }
      .scaledTextStyle(.xl2, weight: .bold)
      .fixedSize(horizontal: false, vertical: true)
      .accessibilityAddTraits(.isHeader)
      Text(query.isEmpty ? "Search for products, support articles or stores." : "Check the spelling or try one of these:")
        .scaledTextStyle(.lg)
        .foregroundStyle(Color.labelSecondary)
        .fixedSize(horizontal: false, vertical: true)
      ComboboxFlowLayout(spacing: 8) {
        ForEach(Self.suggestions, id: \.self) { item in
          Button(item) { query = item }
            .buttonStyle(.variant(.secondary))
        }
      }
      .padding(.top, 6)
    }
    .accessibilityElement(children: .contain)
  }
}

private struct EmptySearchRowStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .opacity(configuration.isPressed ? 0.5 : 1)
  }
}
