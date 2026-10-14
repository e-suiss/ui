import SwiftUI

extension View {
  public func alertSheet<Content: View>(
    isPresented: Binding<Bool>,
    dismissible: Bool = true,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    modifier(
      CoverPresenter(
        isPresented: isPresented,
        enter: .timingCurve(0.32, 0.72, 0, 1, duration: 0.3),
        exit: .timingCurve(0.32, 0.72, 0, 1, duration: 0.25)
      ) { visible in
        AlertSheetStage(visible: visible, dismissible: dismissible, content: content)
      }
    )
  }
}

struct AlertSheetStage<Content: View>: View {
  let visible: Bool
  let dismissible: Bool
  @ViewBuilder let content: () -> Content

  @Environment(\.overlayDismiss) private var dismiss
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    let hidden = !visible
    let slide = !reduceMotion
    ZStack(alignment: .bottom) {
      ScrimLayer(visible: visible, dismissible: dismissible)
      content()
        .visualEffect { view, proxy in
          view.offset(y: hidden && slide ? proxy.size.height + 16 : 0)
        }
        .opacity(hidden && !slide ? 0 : 1)
    }
    .accessibilityAction(.escape) { dismiss?() }
  }
}

public struct AlertSheetContent<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 8) {
      content
    }
    .multilineTextAlignment(.center)
    .frame(maxWidth: 448)
    .padding(8)
    .frame(maxWidth: .infinity)
    .accessibilityElement(children: .contain)
    .accessibilityAddTraits(.isModal)
  }
}

public struct AlertSheetGroup<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    SeparatedStack {
      content
    }
    .frame(maxWidth: .infinity)
    .background(Color.separator)
    .clipShape(shape)
    .foregroundStyle(Color.label)
  }
}

public struct AlertSheetHeader<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 4) {
      content
    }
    .padding(16)
    .frame(maxWidth: .infinity)
    .background(Color.surfaceRaised)
  }
}

public struct AlertSheetTitle: View {
  let text: Text

  public init(_ title: LocalizedStringKey) {
    text = Text(title)
  }

  public init(verbatim title: String) {
    text = Text(verbatim: title)
  }

  public var body: some View {
    text
      .scaledTextStyle(.sm, weight: .semibold)
      .foregroundStyle(Color.labelSecondary)
      .fixedSize(horizontal: false, vertical: true)
      .accessibilityAddTraits(.isHeader)
  }
}

public struct AlertSheetDescription: View {
  let text: Text

  public init(_ description: LocalizedStringKey) {
    text = Text(description)
  }

  public init(verbatim description: String) {
    text = Text(verbatim: description)
  }

  public var body: some View {
    text
      .scaledTextStyle(.sm)
      .foregroundStyle(Color.labelSecondary)
      .fixedSize(horizontal: false, vertical: true)
  }
}

public enum AlertSheetActionVariant: CaseIterable, Sendable {
  case `default`, destructive
}

struct AlertSheetActionStyle: ButtonStyle {
  let variant: AlertSheetActionVariant
  var cancel = false

  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .labelStyle(ButtonLabelStyle(spacing: 12, iconSize: 20))
      .scaledFont(.lg, weight: cancel ? .semibold : .regular)
      .foregroundStyle(!isEnabled ? Color.labelQuaternary : variant == .destructive ? .danger : .link)
      .lineLimit(2)
      .padding(.horizontal, 16)
      .padding(.vertical, 8)
      .frame(maxWidth: .infinity, minHeight: 56)
      .background(Color.surfaceRaised)
      .overlay {
        if configuration.isPressed && isEnabled {
          Color.label.opacity(0.1)
        }
      }
      .contentShape(Rectangle())
  }
}

public struct AlertSheetAction<Label: View>: View {
  let variant: AlertSheetActionVariant
  let action: (() -> Void)?
  let label: Label

  @Environment(\.overlayDismiss) private var dismiss

  public init(
    variant: AlertSheetActionVariant = .default,
    action: (() -> Void)? = nil,
    @ViewBuilder label: () -> Label
  ) {
    self.variant = variant
    self.action = action
    self.label = label()
  }

  public var body: some View {
    Button(role: variant == .destructive ? .destructive : nil) {
      action?()
      dismiss?()
    } label: {
      label
    }
    .buttonStyle(AlertSheetActionStyle(variant: variant))
  }
}

extension AlertSheetAction where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    variant: AlertSheetActionVariant = .default,
    action: (() -> Void)? = nil
  ) {
    self.init(variant: variant, action: action) { Text(title) }
  }
}

extension AlertSheetAction where Label == SwiftUI.Label<Text, Image> {
  public init(
    _ title: LocalizedStringKey,
    icon: Image,
    variant: AlertSheetActionVariant = .default,
    action: (() -> Void)? = nil
  ) {
    self.init(variant: variant, action: action) {
      SwiftUI.Label { Text(title) } icon: { icon }
    }
  }
}

public struct AlertSheetCancel<Label: View>: View {
  let action: (() -> Void)?
  let label: Label

  @Environment(\.overlayDismiss) private var dismiss

  public init(action: (() -> Void)? = nil, @ViewBuilder label: () -> Label) {
    self.action = action
    self.label = label()
  }

  public var body: some View {
    Button(role: .cancel) {
      action?()
      dismiss?()
    } label: {
      label
    }
    .buttonStyle(AlertSheetActionStyle(variant: .default, cancel: true))
    .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
  }
}

extension AlertSheetCancel where Label == Text {
  public init(_ title: LocalizedStringKey = "Cancel", action: (() -> Void)? = nil) {
    self.init(action: action) { Text(title) }
  }
}

struct SeparatedStack: Layout {
  var spacing: CGFloat = 1

  private func heights(_ subviews: Subviews, width: CGFloat?) -> [CGFloat] {
    subviews.map { $0.sizeThatFits(ProposedViewSize(width: width, height: nil)).height }
  }

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let visible = heights(subviews, width: proposal.width).filter { $0 > 0 }
    let height = visible.reduce(0, +) + spacing * CGFloat(max(visible.count - 1, 0))
    let width = proposal.width ?? subviews.map { $0.sizeThatFits(.unspecified).width }.max() ?? 0
    return CGSize(width: width, height: height)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    var y = bounds.minY
    var first = true
    for (view, height) in zip(subviews, heights(subviews, width: bounds.width)) {
      if height <= 0 {
        view.place(at: CGPoint(x: bounds.minX, y: y), anchor: .topLeading, proposal: ProposedViewSize(width: bounds.width, height: 0))
        continue
      }
      if !first { y += spacing }
      first = false
      view.place(at: CGPoint(x: bounds.minX, y: y), anchor: .topLeading, proposal: ProposedViewSize(width: bounds.width, height: height))
      y += height
    }
  }
}
