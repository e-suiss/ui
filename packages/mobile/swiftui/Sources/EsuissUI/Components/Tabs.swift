import SwiftUI

public struct Tabs<Content: View>: View {
  let selection: Binding<AnyHashable>
  let orientation: Axis
  let content: Content

  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init<Value: Hashable & Sendable>(
    selection: Binding<Value>,
    orientation: Axis = .horizontal,
    @ViewBuilder content: () -> Content
  ) {
    self.selection = Binding(
      get: { AnyHashable(selection.wrappedValue) },
      set: { value in
        if let value = value.base as? Value {
          selection.wrappedValue = value
        }
      }
    )
    self.orientation = orientation
    self.content = content()
  }

  public var body: some View {
    let binding = selection
    let animation: Animation? = reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.3)
    let context = TabsContext(
      selected: binding.wrappedValue,
      orientation: orientation,
      select: { value in
        withAnimation(animation) { binding.wrappedValue = value }
      }
    )
    Group {
      if orientation == .vertical {
        HStack(alignment: .top, spacing: 8) { content }
      } else {
        VStack(alignment: .leading, spacing: 8) { content }
      }
    }
    .environment(\.tabs, context)
  }
}

struct TabsContext: @unchecked Sendable {
  var selected: AnyHashable?
  var orientation: Axis = .horizontal
  var select: @MainActor @Sendable (AnyHashable) -> Void = { _ in }
}

extension EnvironmentValues {
  @Entry var tabs = TabsContext()
  @Entry var tabsListVariant: TabsListVariant = .default
  @Entry var tabsIndicator: Namespace.ID? = nil
}

public enum TabsListVariant: CaseIterable, Sendable {
  case `default`, line
}

public struct TabsList<Content: View>: View {
  public typealias Variant = TabsListVariant

  let variant: Variant
  let content: Content

  @Namespace private var namespace
  @Environment(\.tabs) private var tabs

  public init(variant: Variant = .default, @ViewBuilder content: () -> Content) {
    self.variant = variant
    self.content = content()
  }

  public var body: some View {
    let vertical = tabs.orientation == .vertical
    Group {
      if vertical {
        VStack(alignment: .leading, spacing: 4) { content }
          .fixedSize(horizontal: true, vertical: false)
      } else {
        HStack(spacing: 4) { content }
          .frame(height: variant == .line ? 32 : 36)
      }
    }
    .padding(variant == .line ? 2 : 4)
    .padding(variant == .line && !vertical ? .bottom : [], 5)
    .padding(variant == .line && vertical ? .trailing : [], 5)
    .background {
      if variant == .default {
        RoundedRectangle(cornerRadius: Radius.xl, style: .continuous).fill(EsuissColor.secondary)
      }
    }
    .environment(\.tabsListVariant, variant)
    .environment(\.tabsIndicator, namespace)
    .accessibilityElement(children: .contain)
  }
}

public struct TabsTrigger<Label: View>: View {
  let value: AnyHashable
  let label: Label

  @Environment(\.tabs) private var tabs
  @Environment(\.tabsListVariant) private var variant
  @Environment(\.tabsIndicator) private var namespace
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.colorScheme) private var colorScheme

  public init<Value: Hashable & Sendable>(value: Value, @ViewBuilder label: () -> Label) {
    self.value = AnyHashable(value)
    self.label = label()
  }

  public var body: some View {
    let active = tabs.selected == value
    let vertical = tabs.orientation == .vertical
    Button {
      tabs.select(value)
    } label: {
      label
        .labelStyle(ButtonLabelStyle(spacing: 8, iconSize: 16))
        .scaledFont(TextStyle.sm)
        .lineLimit(1)
        .foregroundStyle(active ? EsuissColor.foreground : EsuissColor.mutedForeground)
        .opacity(isEnabled ? 1 : 0.5)
        .padding(.horizontal, 12)
        .padding(.vertical, 4)
        .frame(maxWidth: vertical ? .infinity : nil, alignment: vertical ? .leading : .center)
        .frame(height: vertical ? 36 : nil)
        .frame(maxHeight: vertical ? nil : .infinity)
        .contentShape(Rectangle())
    }
    .buttonStyle(TabsTriggerStyle())
    .background(alignment: vertical ? .trailing : .bottom) {
      if active, let namespace {
        indicator
          .matchedGeometryEffect(id: "indicator", in: namespace)
      }
    }
    .accessibilityAddTraits(active ? .isSelected : [])
  }

  @ViewBuilder private var indicator: some View {
    let vertical = tabs.orientation == .vertical
    if variant == .line {
      Rectangle()
        .fill(EsuissColor.foreground)
        .frame(width: vertical ? 2 : nil, height: vertical ? nil : 2)
        .offset(x: vertical ? 4 : 0, y: vertical ? 0 : 5)
    } else {
      RoundedRectangle(cornerRadius: Radius.md, style: .continuous)
        .fill(colorScheme == .dark ? EsuissColor.border : EsuissColor.card)
        .shadow(color: .black.opacity(colorScheme == .dark ? 0 : 0.08), radius: 1.5, y: 1)
    }
  }
}

extension TabsTrigger where Label == Text {
  public init<Value: Hashable & Sendable>(_ title: LocalizedStringKey, value: Value) {
    self.init(value: value) { Text(title) }
  }
}

private struct TabsTriggerStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .opacity(configuration.isPressed ? 0.8 : 1)
  }
}

public struct TabsContent<Content: View>: View {
  let value: AnyHashable
  let content: Content

  @Environment(\.tabs) private var tabs

  public init<Value: Hashable & Sendable>(value: Value, @ViewBuilder content: () -> Content) {
    self.value = AnyHashable(value)
    self.content = content()
  }

  public var body: some View {
    if tabs.selected == value {
      content
        .frame(maxWidth: .infinity, alignment: .topLeading)
    }
  }
}
