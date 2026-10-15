import SwiftUI

public enum PreviewMenuItemVariant: CaseIterable, Sendable {
  case `default`, destructive
}

let previewMenuEnter = Animation.timingCurve(0.32, 0.72, 0, 1, duration: 0.4)
let previewMenuExit = Animation.timingCurve(0.32, 0.72, 0, 1, duration: 0.3)

enum PreviewMenuMath {
  static let edge: CGFloat = 16
  static let menuSpace: CGFloat = 260
  static let menuMinHeight: CGFloat = 88
  static let maxWidth: CGFloat = 360
  static let menuWidth: CGFloat = 250
  static let menuGap: CGFloat = 12

  static func size(trigger: CGRect, viewport: CGSize, aspectRatio: CGFloat?, reserve: CGFloat) -> CGSize {
    let ratio = aspectRatio.map { 1 / max($0, 0.01) } ?? trigger.height / max(trigger.width, 1)
    var width = min(viewport.width - edge * 2, maxWidth)
    var height = width * ratio
    let maxHeight = viewport.height - reserve - edge * 2
    if height > maxHeight {
      height = max(maxHeight, trigger.height)
      width = height / max(ratio, 0.01)
    }
    return CGSize(width: width, height: height)
  }

  static func menuMaxHeight(trigger: CGRect, viewport: CGSize, aspectRatio: CGFloat?) -> CGFloat {
    let base = size(trigger: trigger, viewport: viewport, aspectRatio: aspectRatio, reserve: menuSpace)
    return max(viewport.height - edge * 2 - base.height - menuGap, menuMinHeight)
  }

  static func frame(trigger: CGRect, viewport: CGSize, aspectRatio: CGFloat?, menuHeight: CGFloat) -> CGRect {
    let menu = min(menuHeight, menuMaxHeight(trigger: trigger, viewport: viewport, aspectRatio: aspectRatio))
    let size = size(trigger: trigger, viewport: viewport, aspectRatio: aspectRatio, reserve: menu + menuGap)
    let left = (viewport.width - size.width) / 2
    let top = edge + max(0, (viewport.height - edge * 2 - size.height - menuGap - menu) / 2)
    return CGRect(x: left, y: top, width: size.width, height: size.height)
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
        if value { lifts += 1 }
      }
      .task(id: open) {
        guard !open else { return }
        if !reduceMotion {
          try? await Task.sleep(for: .milliseconds(270))
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
            preview: preview,
            onShow: { lifted = true }
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
  var onShow: () -> Void = {}

  @State private var menu = CGSize(width: PreviewMenuMath.menuWidth, height: PreviewMenuMath.menuSpace - PreviewMenuMath.menuGap)
  @Environment(\.overlayDismiss) private var dismiss

  var body: some View {
    GeometryReader { proxy in
      let origin = proxy.frame(in: .global).origin
      let local = source.offsetBy(dx: -origin.x, dy: -origin.y)
      let target = PreviewMenuMath.frame(trigger: local, viewport: proxy.size, aspectRatio: aspectRatio, menuHeight: menu.height)
      let current = visible ? target : local
      let menuOrigin = PreviewMenuMath.menuOrigin(preview: target, menu: menu, viewport: proxy.size)
      let menuMax = PreviewMenuMath.menuMaxHeight(trigger: local, viewport: proxy.size, aspectRatio: aspectRatio)
      let triggerZoom = max(target.width / max(local.width, 1), target.height / max(local.height, 1))
      let previewZoom = max(local.width / max(target.width, 1), local.height / max(target.height, 1))
      let anchor = UnitPoint(
        x: min(max((target.midX - menuOrigin.x) / max(menu.width, 1), 0), 1),
        y: min(max((target.maxY + PreviewMenuMath.menuGap - menuOrigin.y) / max(menu.height, 1), 0), 1)
      )
      ZStack(alignment: .topLeading) {
        Rectangle()
          .fill(.ultraThinMaterial)
          .overlay(Palette.black.opacity(0.5).opacity(0.4))
          .ignoresSafeArea()
          .opacity(visible ? 1 : 0)
          .contentShape(Rectangle())
          .onTapGesture { dismiss?() }
          .accessibilityHidden(true)
        ZStack {
          trigger()
            .frame(width: local.width, height: local.height)
            .scaleEffect(visible ? triggerZoom : 1)
            .opacity(preview == nil || !visible ? 1 : 0)
          if let preview {
            preview()
              .frame(width: target.width, height: target.height)
              .scaleEffect(visible ? 1 : previewZoom)
              .opacity(visible ? 1 : 0)
          }
        }
        .frame(width: current.width, height: current.height)
        .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
        .shadow(visible ? Shadow.lg : Shadow(color: .clear, radius: 0, x: 0, y: 0))
        .position(x: current.midX, y: current.midY)
        .allowsHitTesting(false)
        .accessibilityHidden(true)
        PreviewMenuPanel(content: items)
          .onGeometryChange(for: CGSize.self) { $0.size } action: { menu = $0 }
          .frame(maxHeight: menuMax, alignment: .top)
          .scaleEffect(visible ? 1 : 0.4, anchor: anchor)
          .opacity(visible ? 1 : 0)
          .offset(
            x: menuOrigin.x + (visible ? 0 : local.midX - target.midX),
            y: menuOrigin.y + (visible ? 0 : local.maxY - target.maxY - PreviewMenuMath.menuGap)
          )
      }
    }
    .onAppear(perform: onShow)
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
    .foregroundStyle(EsuissColor.foreground)
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
      .foregroundStyle(destructive ? EsuissColor.destructive : EsuissColor.popoverForeground)
      .padding(.horizontal, 16)
      .padding(.vertical, 11)
      .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
      .opacity(isEnabled ? (configuration.isPressed ? 0.8 : 1) : 0.5)
      .overlay(alignment: .top) {
        EsuissColor.border.frame(height: 1)
      }
      .contentShape(Rectangle())
  }
}

public struct PreviewMenuSeparator: View {
  public init() {}

  public var body: some View {
    EsuissColor.border
      .opacity(0.4)
      .frame(height: 8)
      .frame(maxWidth: .infinity)
      .accessibilityHidden(true)
  }
}
