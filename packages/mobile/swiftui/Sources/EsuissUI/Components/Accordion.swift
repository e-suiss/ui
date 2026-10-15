import PhosphorSwift
import SwiftUI

public struct Accordion<Content: View>: View {
  public enum Variant: CaseIterable, Sendable {
    case `default`, filled
  }

  let variant: Variant
  let multiple: Bool
  let external: Binding<Set<AnyHashable>>?
  let content: Content

  @State private var local: Set<AnyHashable> = []
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    _ variant: Variant = .default,
    multiple: Bool = false,
    @ViewBuilder content: () -> Content
  ) {
    self.variant = variant
    self.multiple = multiple
    self.external = nil
    self.content = content()
  }

  public init<Value: Hashable & Sendable>(
    _ variant: Variant = .default,
    expanded: Binding<Set<Value>>,
    multiple: Bool = false,
    @ViewBuilder content: () -> Content
  ) {
    self.variant = variant
    self.multiple = multiple
    self.external = Binding(
      get: { Set(expanded.wrappedValue.map { AnyHashable($0) }) },
      set: { expanded.wrappedValue = Set($0.compactMap { $0.base as? Value }) }
    )
    self.content = content()
  }

  public init<Value: Hashable & Sendable>(
    _ variant: Variant = .default,
    expanded: Binding<Value?>,
    @ViewBuilder content: () -> Content
  ) {
    self.variant = variant
    self.multiple = false
    self.external = Binding(
      get: { expanded.wrappedValue.map { [AnyHashable($0)] } ?? [] },
      set: { expanded.wrappedValue = $0.first?.base as? Value }
    )
    self.content = content()
  }

  public var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    VStack(alignment: .leading, spacing: 0) {
      content
    }
    .padding(.top, -1)
    .frame(maxWidth: .infinity, alignment: .leading)
    .clipped()
    .background(variant == .filled ? EsuissColor.muted : .clear, in: shape)
    .clipShape(variant == .filled ? AnyShape(shape) : AnyShape(Rectangle()))
    .environment(\.accordion, context)
  }

  private var context: AccordionContext {
    let binding = external ?? $local
    let multiple = multiple
    let animation: Animation? = reduceMotion ? .linear(duration: 0.15) : .easeInOut(duration: 0.2)
    return AccordionContext(
      expanded: binding.wrappedValue,
      toggle: { value in
        withAnimation(animation) {
          var next = binding.wrappedValue
          if next.contains(value) {
            next.remove(value)
          } else if multiple {
            next.insert(value)
          } else {
            next = [value]
          }
          binding.wrappedValue = next
        }
      }
    )
  }
}

struct AccordionContext: @unchecked Sendable {
  var expanded: Set<AnyHashable> = []
  var toggle: @MainActor @Sendable (AnyHashable) -> Void = { _ in }
}

extension EnvironmentValues {
  @Entry var accordion = AccordionContext()
}

public struct AccordionItem<Label: View, Content: View>: View {
  let value: AnyHashable
  let label: Label
  let content: Content

  @Environment(\.accordion) private var accordion
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init<Value: Hashable & Sendable>(
    value: Value,
    @ViewBuilder content: () -> Content,
    @ViewBuilder label: () -> Label
  ) {
    self.value = AnyHashable(value)
    self.label = label()
    self.content = content()
  }

  public var body: some View {
    let open = accordion.expanded.contains(value)
    VStack(alignment: .leading, spacing: 0) {
      Button {
        accordion.toggle(value)
      } label: {
        HStack(spacing: 24) {
          label
            .textStyle(.base)
            .multilineTextAlignment(.leading)
            .foregroundStyle(EsuissColor.foreground)
            .frame(maxWidth: .infinity, alignment: .leading)
          Ph.caretDown.regular
            .frame(width: 16, height: 16)
            .foregroundStyle(EsuissColor.mutedForeground)
            .rotationEffect(.degrees(open ? 180 : 0))
            .animation(.easeInOut(duration: open ? 0.25 : 0.2), value: open)
        }
        .padding(.vertical, 11)
        .padding(.trailing, 16)
        .frame(minHeight: 44)
        .contentShape(Rectangle())
      }
      .buttonStyle(AccordionTriggerStyle())
      .accessibilityAddTraits(.isHeader)
      .accessibilityValue(Text(open ? "Expanded" : "Collapsed"))
      if open {
        VStack(alignment: .leading, spacing: 16) {
          content
        }
        .textStyle(.sm)
        .foregroundStyle(EsuissColor.mutedForeground)
        .fixedSize(horizontal: false, vertical: true)
        .padding(.trailing, 40)
        .padding(.bottom, 12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .transition(reduceMotion ? .opacity : .opacity.combined(with: .offset(y: -8)))
      }
    }
    .padding(.leading, 16)
    .overlay(alignment: .top) {
      Rectangle()
        .fill(EsuissColor.border)
        .frame(height: 1)
        .padding(.leading, 16)
    }
  }
}

extension AccordionItem where Label == Text {
  public init<Value: Hashable & Sendable>(
    _ title: LocalizedStringKey,
    value: Value,
    @ViewBuilder content: () -> Content
  ) {
    self.init(value: value, content: content) { Text(title) }
  }
}

private struct AccordionTriggerStyle: ButtonStyle {
  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .underline(configuration.isPressed && isEnabled)
      .opacity(isEnabled ? 1 : 0.5)
  }
}
