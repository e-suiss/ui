import SwiftUI

public struct Collapsible<Content: View>: View {
  let external: Binding<Bool>?
  let spacing: CGFloat
  let content: Content

  @State private var local = false
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    isExpanded: Binding<Bool>,
    spacing: CGFloat = 0,
    @ViewBuilder content: () -> Content
  ) {
    self.external = isExpanded
    self.spacing = spacing
    self.content = content()
  }

  public init(spacing: CGFloat = 0, @ViewBuilder content: () -> Content) {
    self.external = nil
    self.spacing = spacing
    self.content = content()
  }

  public var body: some View {
    let binding = external ?? $local
    let animation: Animation = reduceMotion ? .linear(duration: 0.15) : .easeInOut(duration: 0.2)
    VStack(alignment: .leading, spacing: spacing) {
      content
    }
    .environment(
      \.collapsible,
      CollapsibleContext(
        isExpanded: binding.wrappedValue,
        toggle: { withAnimation(animation) { binding.wrappedValue.toggle() } }
      )
    )
  }
}

struct CollapsibleContext: Sendable {
  var isExpanded = false
  var toggle: @MainActor @Sendable () -> Void = {}
}

extension EnvironmentValues {
  @Entry var collapsible = CollapsibleContext()
}

public struct CollapsibleTrigger<Label: View>: View {
  let label: Label

  @Environment(\.collapsible) private var collapsible

  public init(@ViewBuilder label: () -> Label) {
    self.label = label()
  }

  public var body: some View {
    Button {
      collapsible.toggle()
    } label: {
      label
    }
    .accessibilityValue(Text(collapsible.isExpanded ? "Expanded" : "Collapsed"))
  }
}

extension CollapsibleTrigger where Label == Text {
  public init(_ title: LocalizedStringKey) {
    self.init { Text(title) }
  }
}

public struct CollapsibleContent<Content: View>: View {
  let content: Content

  @Environment(\.collapsible) private var collapsible
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if collapsible.isExpanded {
      content
        .transition(reduceMotion ? .opacity : .opacity.combined(with: .offset(y: -8)))
    }
  }
}
