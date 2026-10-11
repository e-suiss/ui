import SwiftUI

extension EnvironmentValues {
  @Entry public var isInvalid = false
  @Entry var fieldInset = false
  @Entry var fieldGroupInset = false
  @Entry var fieldSetInset = false
}

extension View {
  public func invalid(_ isInvalid: Bool = true) -> some View {
    environment(\.isInvalid, isInvalid)
  }
}

public enum FieldOrientation: CaseIterable, Sendable {
  case vertical, horizontal
}

public struct Field<Content: View>: View {
  let orientation: FieldOrientation
  let invalid: Bool?
  let content: Content

  @Environment(\.fieldGroupInset) private var inset
  @Environment(\.isInvalid) private var inheritedInvalid

  public init(
    orientation: FieldOrientation = .vertical,
    invalid: Bool? = nil,
    @ViewBuilder content: () -> Content
  ) {
    self.orientation = orientation
    self.invalid = invalid
    self.content = content()
  }

  public var body: some View {
    Group {
      switch orientation {
      case .vertical:
        VStack(alignment: .leading, spacing: 12) { content }
      case .horizontal:
        HStack(alignment: .center, spacing: 12) { content }
      }
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(.horizontal, inset ? 16 : 0)
    .padding(.vertical, inset ? 6 : 0)
    .frame(minHeight: inset ? 44 : nil)
    .overlay(alignment: .top) {
      if inset {
        Color.separator
          .frame(height: 1)
          .padding(.leading, 16)
          .offset(y: -1)
      }
    }
    .environment(\.fieldInset, inset)
    .environment(\.fieldGroupInset, false)
    .environment(\.isInvalid, invalid ?? inheritedInvalid)
  }
}

public struct FieldContent<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

public struct FieldTitle: View {
  let text: Text

  @Environment(\.isEnabled) private var isEnabled

  public init(_ title: LocalizedStringKey) {
    text = Text(title)
  }

  public init<S: StringProtocol>(_ title: S) {
    text = Text(title)
  }

  public var body: some View {
    text
      .scaledTextStyle(.base, weight: .semibold)
      .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
  }
}

public struct FieldDescription: View {
  let text: Text

  @Environment(\.fieldSetInset) private var inset

  public init(_ description: LocalizedStringKey) {
    text = Text(description)
  }

  public init<S: StringProtocol>(_ description: S) {
    text = Text(description)
  }

  public var body: some View {
    text
      .scaledTextStyle(inset ? .xs : .sm)
      .foregroundStyle(Color.labelSecondary)
      .multilineTextAlignment(.leading)
      .fixedSize(horizontal: false, vertical: true)
      .padding(.leading, inset ? 16 : 0)
  }
}

public struct FieldError: View {
  let messages: [String]
  let text: Text?

  public init(_ message: LocalizedStringKey) {
    messages = []
    text = Text(message)
  }

  public init(errors: [String?]) {
    var seen = Set<String>()
    messages = errors.compactMap { $0 }.filter { !$0.isEmpty && seen.insert($0).inserted }
    text = nil
  }

  public var body: some View {
    if let content {
      content
        .scaledTextStyle(.sm)
        .foregroundStyle(Color.danger)
        .multilineTextAlignment(.leading)
        .fixedSize(horizontal: false, vertical: true)
    }
  }

  private var content: Text? {
    if let text { return text }
    switch messages.count {
    case 0: return nil
    case 1: return Text(verbatim: messages[0])
    default: return Text(verbatim: messages.map { "\u{2022} \($0)" }.joined(separator: "\n"))
    }
  }
}

public enum FieldGroupVariant: CaseIterable, Sendable {
  case `default`, inset
}

public struct FieldGroup<Content: View>: View {
  let variant: FieldGroupVariant
  let content: Content

  public init(_ variant: FieldGroupVariant = .default, @ViewBuilder content: () -> Content) {
    self.variant = variant
    self.content = content()
  }

  public var body: some View {
    styled
      .environment(\.fieldGroupInset, variant == .inset)
      .environment(\.fieldSetInset, false)
      .transformPreference(FieldSetInsetKey.self) { $0 = variant == .inset }
  }

  @ViewBuilder private var styled: some View {
    let stack = VStack(alignment: .leading, spacing: variant == .inset ? 0 : 28) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    if variant == .inset {
      let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
      stack
        .background(Color.surfaceSecondary, in: shape)
        .clipShape(shape)
    } else {
      stack
    }
  }
}

struct FieldSetInsetKey: PreferenceKey {
  static let defaultValue = false

  static func reduce(value: inout Bool, nextValue: () -> Bool) {
    value = value || nextValue()
  }
}

public struct FieldSet<Content: View>: View {
  let content: Content

  @State private var inset = false

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: inset ? 8 : 24) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .environment(\.fieldSetInset, inset)
    .onPreferenceChange(FieldSetInsetKey.self) { inset = $0 }
    .transformPreference(FieldSetInsetKey.self) { $0 = false }
    .accessibilityElement(children: .contain)
  }
}

public struct FieldLegend: View {
  public enum Variant: CaseIterable, Sendable {
    case legend, label
  }

  let text: Text
  let variant: Variant

  @Environment(\.fieldSetInset) private var inset
  @Environment(\.isEnabled) private var isEnabled

  public init(_ title: LocalizedStringKey, variant: Variant = .legend) {
    text = Text(title)
    self.variant = variant
  }

  public init<S: StringProtocol>(_ title: S, variant: Variant = .legend) {
    text = Text(title)
    self.variant = variant
  }

  public var body: some View {
    Group {
      if inset {
        text
          .textCase(.uppercase)
          .scaledTextStyle(.xs)
          .foregroundStyle(isEnabled ? Color.labelSecondary : .labelQuaternary)
          .padding(.leading, 16)
      } else {
        text
          .scaledTextStyle(.base, weight: .semibold)
          .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
          .padding(.bottom, 12)
      }
    }
    .accessibilityAddTraits(variant == .legend ? .isHeader : [])
  }
}

public struct FieldSeparator<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    ZStack {
      Separator()
      content
        .scaledTextStyle(.sm)
        .foregroundStyle(Color.labelSecondary)
        .padding(.horizontal, 8)
        .background(Color.surface)
    }
    .frame(minHeight: 20)
    .padding(.vertical, -8)
  }
}

extension FieldSeparator where Content == EmptyView {
  public init() {
    self.init { EmptyView() }
  }
}

extension FieldSeparator where Content == Text {
  public init(_ title: LocalizedStringKey) {
    self.init { Text(title) }
  }
}
