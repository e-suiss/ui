import PhosphorSwift
import SwiftUI

enum SearchRevealAnchor: Hashable, Sendable {
  case field, content
}

struct SearchRevealFieldInfo: Equatable {
  var height: CGFloat = 0
  var hasQuery = false
}

struct SearchRevealFieldKey: PreferenceKey {
  static var defaultValue: SearchRevealFieldInfo { SearchRevealFieldInfo() }

  static func reduce(value: inout SearchRevealFieldInfo, nextValue: () -> SearchRevealFieldInfo) {
    let next = nextValue()
    if next.height > 0 { value = next }
  }
}

struct SearchRevealContext {
  var viewport: CGFloat
  var reveal: () -> Void
}

extension EnvironmentValues {
  @Entry var searchReveal: SearchRevealContext?
}

struct SearchRevealSnap: ScrollTargetBehavior {
  let height: CGFloat
  let hasQuery: Bool

  static func target(for offset: CGFloat, height: CGFloat, hasQuery: Bool) -> CGFloat? {
    guard height > 0, offset > 0, offset < height else { return nil }
    return offset < height / 2 || hasQuery ? 0 : height
  }

  func updateTarget(_ target: inout ScrollTarget, context: TargetContext) {
    if let snapped = Self.target(for: target.rect.minY, height: height, hasQuery: hasQuery) {
      target.rect.origin.y = snapped
    }
  }
}

public struct SearchReveal<Content: View>: View {
  let content: Content

  @State private var field = SearchRevealFieldInfo()
  @State private var position: SearchRevealAnchor?
  @State private var viewport: CGFloat = 0
  @State private var settled = false
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    let context = SearchRevealContext(viewport: viewport) {
      if reduceMotion {
        position = .field
      } else {
        withAnimation(.smooth(duration: 0.3)) { position = .field }
      }
    }
    ScrollView {
      VStack(spacing: 0) {
        content
      }
      .scrollTargetLayout()
    }
    .scrollPosition(id: $position, anchor: .top)
    .scrollTargetBehavior(SearchRevealSnap(height: field.height, hasQuery: field.hasQuery))
    .scrollBounceBehavior(.always)
    .environment(\.searchReveal, context)
    .onGeometryChange(for: CGFloat.self) { $0.size.height } action: { viewport = $0 }
    .onPreferenceChange(SearchRevealFieldKey.self) { info in
      field = info
      if !settled, info.height > 0 {
        settled = true
        position = info.hasQuery ? .field : .content
      }
    }
  }
}

public struct SearchRevealField: View {
  let text: Binding<String>
  let placeholder: LocalizedStringKey

  @FocusState private var focused: Bool
  @Environment(\.searchReveal) private var reveal

  public init(text: Binding<String>, placeholder: LocalizedStringKey = "Search") {
    self.text = text
    self.placeholder = placeholder
  }

  public var body: some View {
    HStack(spacing: 6) {
      Ph.magnifyingGlass.regular
        .frame(width: 18, height: 18)
        .accessibilityHidden(true)
      TextField(placeholder, text: text, prompt: Text(placeholder).foregroundStyle(Color.labelSecondary))
        .focused($focused)
        .submitLabel(.search)
        .autocorrectionDisabled()
        .scaledFont(.base)
        .foregroundStyle(Color.label)
        .tint(Color.accent)
      if !text.wrappedValue.isEmpty {
        Button {
          text.wrappedValue = ""
          focused = true
        } label: {
          Ph.xCircle.fill
            .frame(width: 18, height: 18)
            .frame(width: 28, height: 28)
            .contentShape(Circle().inset(by: -8))
        }
        .buttonStyle(.plain)
        .padding(.trailing, -4)
        .accessibilityLabel(Text("Clear search"))
      }
    }
    .foregroundStyle(Color.labelSecondary)
    .padding(.horizontal, 8)
    .frame(height: 36)
    .background(Color.control, in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
    .padding(.horizontal, 16)
    .padding(.bottom, 8)
    .visualEffect { view, proxy in
      let height = proxy.size.height
      let top = proxy.frame(in: .scrollView).minY
      return view.opacity(height > 0 ? min(max(1 + top / height, 0), 1) : 1)
    }
    .background {
      GeometryReader { proxy in
        Color.clear.preference(
          key: SearchRevealFieldKey.self,
          value: SearchRevealFieldInfo(height: proxy.size.height, hasQuery: !text.wrappedValue.isEmpty)
        )
      }
    }
    .id(SearchRevealAnchor.field)
    .onChange(of: focused) { _, value in
      if value { reveal?.reveal() }
    }
  }
}

public struct SearchRevealContent<Content: View>: View {
  let content: Content

  @Environment(\.searchReveal) private var reveal

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 0) {
      content
    }
    .frame(maxWidth: .infinity, minHeight: reveal?.viewport, alignment: .top)
    .id(SearchRevealAnchor.content)
  }
}
