import SwiftUI

struct ToggleGroupContext {
  var variant: ToggleVariant
  var size: ToggleSize
  var spacing: Int
  var orientation: Axis
  var namespace: Namespace.ID
  var multiple: Bool
  var isSelected: (AnyHashable) -> Bool
  var toggle: (AnyHashable) -> Void

  var segmented: Bool { spacing == 0 && variant == .default }
  var attached: Bool { spacing == 0 && variant == .outline }
}

extension EnvironmentValues {
  @Entry var toggleGroup: ToggleGroupContext?
}

public struct ToggleGroup<Value: Hashable, Content: View>: View {
  let variant: ToggleVariant
  let size: ToggleSize
  let spacing: Int
  let orientation: Axis
  let multiple: Bool
  let isSelected: (Value) -> Bool
  let toggle: (Value) -> Void
  let content: Content

  @Namespace private var namespace
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    selection: Binding<Value?>,
    variant: ToggleVariant = .default,
    size: ToggleSize = .default,
    spacing: Int = 2,
    orientation: Axis = .horizontal,
    @ViewBuilder content: () -> Content
  ) {
    self.variant = variant
    self.size = size
    self.spacing = spacing
    self.orientation = orientation
    multiple = false
    isSelected = { selection.wrappedValue == $0 }
    toggle = { value in
      selection.wrappedValue = selection.wrappedValue == value ? nil : value
    }
    self.content = content()
  }

  public init(
    selection: Binding<Set<Value>>,
    variant: ToggleVariant = .default,
    size: ToggleSize = .default,
    spacing: Int = 2,
    orientation: Axis = .horizontal,
    @ViewBuilder content: () -> Content
  ) {
    self.variant = variant
    self.size = size
    self.spacing = spacing
    self.orientation = orientation
    multiple = true
    isSelected = { selection.wrappedValue.contains($0) }
    toggle = { value in
      if selection.wrappedValue.contains(value) {
        selection.wrappedValue.remove(value)
      } else {
        selection.wrappedValue.insert(value)
      }
    }
    self.content = content()
  }

  public var body: some View {
    let context = ToggleGroupContext(
      variant: variant,
      size: size,
      spacing: spacing,
      orientation: orientation,
      namespace: namespace,
      multiple: multiple,
      isSelected: { value in (value.base as? Value).map(isSelected) ?? false },
      toggle: { value in
        guard let value = value.base as? Value else { return }
        if reduceMotion {
          toggle(value)
        } else {
          withAnimation(.timingCurve(0.32, 0.72, 0, 1, duration: 0.3)) { toggle(value) }
        }
      }
    )
    container
      .environment(\.toggleGroup, context)
      .accessibilityElement(children: .contain)
  }

  private var segmented: Bool { spacing == 0 && variant == .default }

  private var attached: Bool { spacing == 0 && variant == .outline }

  private var gap: CGFloat {
    segmented ? 4 : CGFloat(spacing) * 4
  }

  @ViewBuilder private var stack: some View {
    switch orientation {
    case .horizontal:
      HStack(spacing: gap) { content }
    case .vertical:
      VStack(alignment: .leading, spacing: gap) { content }
    }
  }

  @ViewBuilder private var container: some View {
    if segmented {
      let shape = RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
      stack
        .padding(4)
        .background(Color.control, in: shape)
    } else if attached {
      let shape = RoundedRectangle(cornerRadius: orientation == .vertical ? Radius.xl : Radius.lg, style: .continuous)
      stack
        .padding(1)
        .clipShape(shape)
        .overlay {
          shape.stroke(Color.separator, lineWidth: 1).padding(0.5)
        }
    } else {
      stack
    }
  }
}

public struct ToggleGroupItem<Value: Hashable, Label: View>: View {
  let value: Value
  let label: Label

  @Environment(\.toggleGroup) private var group
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.colorScheme) private var colorScheme

  public init(value: Value, @ViewBuilder label: () -> Label) {
    self.value = value
    self.label = label()
  }

  public var body: some View {
    let isOn = group?.isSelected(AnyHashable(value)) ?? false
    HapticButton(style: PressReader { pressed in
      item(isOn: isOn, pressed: pressed)
    }) {
      guard let group else { return false }
      group.toggle(AnyHashable(value))
      return true
    }
    .accessibilityAddTraits(isOn ? .isSelected : [])
  }

  @ViewBuilder private func item(isOn: Bool, pressed: Bool) -> some View {
    let variant = group?.variant ?? .default
    let size = group?.size ?? .default
    if let group, group.segmented {
      let shape = RoundedRectangle(cornerRadius: Radius.md, style: .continuous)
      label
        .labelStyle(ButtonLabelStyle(spacing: 4, iconSize: 16))
        .scaledFont(.sm)
        .lineLimit(1)
        .foregroundStyle(!isEnabled ? Color.labelQuaternary : isOn ? .label : .labelSecondary)
        .padding(.horizontal, 12)
        .frame(minWidth: size.height, minHeight: size.height)
        .frame(maxWidth: group.orientation == .vertical ? .infinity : nil)
        .background {
          if isOn {
            if isEnabled {
              shape
                .fill(colorScheme == .dark ? Color.labelQuaternary : .surfaceRaised)
                .shadow(.thumb)
                .matchedGeometryEffect(id: group.multiple ? AnyHashable(value) : AnyHashable("indicator"), in: group.namespace)
            } else {
              shape.fill(Color.controlDisabled)
            }
          }
        }
        .contentShape(shape)
    } else if let group, group.attached {
      ToggleSurface(
        isOn: isOn,
        pressed: pressed,
        variant: variant,
        size: size,
        shape: AnyShape(Rectangle()),
        bordered: false
      ) {
        label
      }
      .frame(maxWidth: group.orientation == .vertical ? .infinity : nil)
      .overlay(alignment: group.orientation == .vertical ? .top : .leading) {
        if group.orientation == .vertical {
          Color.separator.frame(height: 1).offset(y: -1)
        } else {
          Color.separator.frame(width: 1).offset(x: -1)
        }
      }
    } else {
      ToggleSurface(isOn: isOn, pressed: pressed, variant: variant, size: size) {
        label
      }
      .frame(maxWidth: group?.orientation == .vertical ? .infinity : nil)
    }
  }
}

extension ToggleGroupItem where Label == Text {
  public init(_ title: LocalizedStringKey, value: Value) {
    self.init(value: value) { Text(title) }
  }
}
