import SwiftUI

public enum PreviewMenuItemVariant: CaseIterable, Sendable {
  case `default`, destructive
}

let previewMenuEnter = Animation.timingCurve(0.32, 0.72, 0, 1, duration: 0.4)
let previewMenuExit = Animation.timingCurve(0.32, 0.72, 0, 1, duration: 0.3)

enum PreviewMenuMath {
  static let edge: CGFloat = 16
  static let menuSpace: CGFloat = 260
  static let maxWidth: CGFloat = 360
  static let menuWidth: CGFloat = 250
  static let menuGap: CGFloat = 12

  static func frame(trigger: CGRect, viewport: CGSize, aspectRatio: CGFloat?) -> CGRect {
    let ratio = aspectRatio.map { 1 / max($0, 0.01) } ?? trigger.height / max(trigger.width, 1)
    var width = min(viewport.width - edge * 2, maxWidth)
    var height = width * ratio
    let maxHeight = viewport.height - menuSpace - edge * 2
    if height > maxHeight {
      height = max(maxHeight, trigger.height)
      width = height / max(ratio, 0.01)
    }
    let left = (viewport.width - width) / 2
    let centered = trigger.midY - height / 2
    let top = min(max(centered, edge), max(edge, viewport.height - menuSpace - height))
    return CGRect(x: left, y: top, width: width, height: height)
  }

  static func menuOrigin(preview: CGRect, menu: CGSize, viewport: CGSize) -> CGPoint {
    let x = min(max(preview.midX - menu.width / 2, edge), max(edge, viewport.width - edge - menu.width))
    let y = min(preview.maxY + menuGap, max(edge, viewport.height - edge - menu.height))
    return CGPoint(x: x, y: y)
  }
}

extension View {
  public func previewMenu<Items: View>(
    isPresented: Binding<Bool>? = nil,
    aspectRatio: CGFloat? = nil,
    @ViewBuilder items: @escaping () -> Items
  ) -> some View {
    modifier(
      PreviewMenuModifier<Self, Items, EmptyView>(
        external: isPresented,
        aspectRatio: aspectRatio,
        trigger: { self },
        items: items,
        preview: nil
      )
    )
  }

  public func previewMenu<Items: View, Preview: View>(
    isPresented: Binding<Bool>? = nil,
    aspectRatio: CGFloat? = nil,
    @ViewBuilder items: @escaping () -> Items,
    @ViewBuilder preview: @escaping () -> Preview
  ) -> some View {
    modifier(
      PreviewMenuModifier(
        external: isPresented,
        aspectRatio: aspectRatio,
        trigger: { self },
        items: items,
        preview: preview
      )
    )
  }
}

struct PreviewMenuModifier<Trigger: View, Items: View, Preview: View>: ViewModifier {
  let external: Binding<Bool>?
  let aspectRatio: CGFloat?
  let trigger: () -> Trigger
  let items: () -> Items
  let preview: (() -> Preview)?

  @State private var local = false
  @State private var source: CGRect = .zero
  @State private var lifts = 0
  @State private var lifted = false
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  func body(content: Content) -> some View {
    let binding = external ?? $local
    let open = binding.wrappedValue
    content
      .opacity(lifted ? 0 : 1)
      .onGeometryChange(for: CGRect.self) { $0.frame(in: .global) } action: { source = $0 }
      .contentShape(Rectangle())
      .onLongPressGesture(minimumDuration: 0.5, maximumDistance: 10) {
        binding.wrappedValue = true
      }
      .accessibilityAction(named: Text("Show actions")) { binding.wrappedValue = true }
      .accessibilityHint(Text("Long press to preview and show actions"))
      .hapticFeedback(.impact(weight: .medium), trigger: lifts)
      .onChange(of: open, initial: true) { _, value in
        if value {
          lifts += 1
          lifted = true
        }
      }
      .task(id: open) {
        guard !open else { return }
        if !reduceMotion {
          try? await Task.sleep(for: .milliseconds(300))
        }
        if !Task.isCancelled { lifted = false }
      }
      .modifier(
        CoverPresenter(
          isPresented: binding,
          enter: reduceMotion ? .linear(duration: 0) : previewMenuEnter,
          exit: reduceMotion ? .linear(duration: 0) : previewMenuExit
        ) { visible in
          PreviewMenuCanvas(
            source: source,
            aspectRatio: aspectRatio,
            visible: visible,
            trigger: trigger,
            items: items,
            preview: preview
          )
        }
      )
  }
}

struct PreviewMenuCanvas<Trigger: View, Items: View, Preview: View>: View {
  let source: CGRect
  let aspectRatio: CGFloat?
  let visible: Bool
  @ViewBuilder let trigger: () -> Trigger
  @ViewBuilder let items: () -> Items
  let preview: (() -> Preview)?

  @State private var menu: CGSize = CGSize(width: PreviewMenuMath.menuWidth, height: 0)
  @Environment(\.overlayDismiss) private var dismiss

  var body: some View {
    GeometryReader { proxy in
      let origin = proxy.frame(in: .global).origin
      let local = source.offsetBy(dx: -origin.x, dy: -origin.y)
      let target = PreviewMenuMath.frame(trigger: local, viewport: proxy.size, aspectRatio: aspectRatio)
      let scale = min(target.width / max(local.width, 1), target.height / max(local.height, 1))
      let center = visible ? CGPoint(x: target.midX, y: target.midY) : CGPoint(x: local.midX, y: local.midY)
      let menuOrigin = PreviewMenuMath.menuOrigin(preview: target, menu: menu, viewport: proxy.size)
      ZStack(alignment: .topLeading) {
        Rectangle()
          .fill(.ultraThinMaterial)
          .overlay(Color.scrim.opacity(0.4))
          .ignoresSafeArea()
          .opacity(visible ? 1 : 0)
          .contentShape(Rectangle())
          .onTapGesture { dismiss?() }
          .accessibilityHidden(true)
        Group {
          if let preview {
            preview()
              .frame(width: target.width, height: target.height)
              .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
              .scaleEffect(visible ? 1 : 1 / max(scale, 0.01))
          } else {
            trigger()
              .frame(width: local.width, height: local.height)
              .clipShape(RoundedRectangle(cornerRadius: Radius.xl2 / max(scale, 0.01), style: .continuous))
              .scaleEffect(visible ? scale : 1)
          }
        }
        .shadow(visible ? Shadow.lg : Shadow(color: .clear, radius: 0, x: 0, y: 0))
        .position(center)
        .allowsHitTesting(false)
        .accessibilityHidden(true)
        PreviewMenuPanel(content: items)
          .onGeometryChange(for: CGSize.self) { $0.size } action: { menu = $0 }
          .frame(maxHeight: max(proxy.size.height - menuOrigin.y - PreviewMenuMath.edge, 44), alignment: .top)
          .scaleEffect(visible ? 1 : 0.9, anchor: .top)
          .opacity(visible ? 1 : 0)
          .offset(x: menuOrigin.x, y: menuOrigin.y)
      }
    }
    .accessibilityAddTraits(.isModal)
    .accessibilityAction(.escape) { dismiss?() }
  }
}

struct PreviewMenuPanel<Content: View>: View {
  @ViewBuilder let content: () -> Content

  var body: some View {
    let stack = VStack(spacing: 0) {
      content()
    }
    .padding(.top, -1)
    ViewThatFits(in: .vertical) {
      stack
      ScrollView { stack }
    }
    .frame(width: PreviewMenuMath.menuWidth)
    .foregroundStyle(Color.label)
    .popupSurface(radius: Radius.xl2)
    .accessibilityElement(children: .contain)
  }
}

public struct PreviewMenuItem<Label: View>: View {
  public typealias Variant = PreviewMenuItemVariant

  let variant: Variant
  let icon: Image?
  let action: () -> Void
  let label: Label

  @Environment(\.overlayDismiss) private var dismiss

  public init(
    variant: Variant = .default,
    icon: Image? = nil,
    action: @escaping () -> Void,
    @ViewBuilder label: () -> Label
  ) {
    self.variant = variant
    self.icon = icon
    self.action = action
    self.label = label()
  }

  public var body: some View {
    Button {
      action()
      dismiss?()
    } label: {
      HStack(spacing: 24) {
        label
          .scaledTextStyle(.base)
          .lineLimit(2)
          .frame(maxWidth: .infinity, alignment: .leading)
        if let icon {
          icon
            .resizable()
            .scaledToFit()
            .frame(width: 20, height: 20)
            .accessibilityHidden(true)
        }
      }
    }
    .buttonStyle(PreviewMenuItemStyle(destructive: variant == .destructive))
  }
}

extension PreviewMenuItem where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    icon: Image? = nil,
    variant: Variant = .default,
    action: @escaping () -> Void
  ) {
    self.init(variant: variant, icon: icon, action: action) { Text(title) }
  }

  public init(
    verbatim title: String,
    icon: Image? = nil,
    variant: Variant = .default,
    action: @escaping () -> Void
  ) {
    self.init(variant: variant, icon: icon, action: action) { Text(verbatim: title) }
  }
}

private struct PreviewMenuItemStyle: ButtonStyle {
  let destructive: Bool

  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .foregroundStyle(!isEnabled ? Color.labelQuaternary : destructive ? .danger : .label)
      .padding(.horizontal, 16)
      .padding(.vertical, 11)
      .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
      .background(configuration.isPressed && isEnabled ? Color.itemPressed : .clear)
      .overlay(alignment: .top) {
        Color.separator.frame(height: 1)
      }
      .contentShape(Rectangle())
  }
}

public struct PreviewMenuSeparator: View {
  public init() {}

  public var body: some View {
    Color.separator
      .opacity(0.4)
      .frame(height: 8)
      .frame(maxWidth: .infinity)
      .accessibilityHidden(true)
  }
}
