import SwiftUI

extension View {
  public func dialog<Content: View>(
    isPresented: Binding<Bool>,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    modifier(
      CoverPresenter(isPresented: isPresented) { visible in
        CenteredStage(visible: visible, dismissible: true, content: content)
      }
    )
  }
}

struct CenteredStage<Content: View>: View {
  let visible: Bool
  let dismissible: Bool
  @ViewBuilder let content: () -> Content

  @Environment(\.overlayDismiss) private var dismiss
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    ZStack {
      ScrimLayer(visible: visible, dismissible: dismissible)
      content()
        .scaleEffect(visible || reduceMotion ? 1 : 0.95)
        .opacity(visible ? 1 : 0)
        .padding(16)
    }
    .accessibilityAction(.escape) { dismiss?() }
  }
}

extension EnvironmentValues {
  @Entry var overlayCloseInset: CGFloat = 0
}

public struct DialogContent<Content: View>: View {
  let showCloseButton: Bool
  let closeLabel: LocalizedStringKey?
  let content: Content

  public init(
    showCloseButton: Bool = true,
    closeLabel: LocalizedStringKey? = nil,
    @ViewBuilder content: () -> Content
  ) {
    self.showCloseButton = showCloseButton
    self.closeLabel = closeLabel
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 24) {
      content
    }
    .padding(24)
    .frame(maxWidth: 448, alignment: .leading)
    .environment(\.overlayCloseInset, showCloseButton ? (closeLabel == nil ? 32 : 72) : 0)
    .popupSurface(radius: Radius.xl2)
    .overlay(alignment: .topTrailing) {
      if showCloseButton {
        OverlayCloseButton(label: closeLabel)
          .padding(.top, closeLabel == nil ? 19 : 17)
          .padding(.trailing, 16)
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityAddTraits(.isModal)
  }
}

public struct DialogHeader<Content: View>: View {
  let content: Content

  @Environment(\.overlayCloseInset) private var closeInset

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 6) {
      content
    }
    .padding(.trailing, closeInset)
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

public struct DialogFooter<Content: View>: View {
  let showCloseButton: Bool
  let content: Content

  public init(showCloseButton: Bool = false, @ViewBuilder content: () -> Content) {
    self.showCloseButton = showCloseButton
    self.content = content()
  }

  public var body: some View {
    ReversedVStack(spacing: 8) {
      content
      if showCloseButton {
        DialogClose {
          Text("Close").frame(maxWidth: .infinity)
        }
        .buttonStyle(.variant(.secondary))
      }
    }
  }
}

extension DialogFooter where Content == EmptyView {
  public init(showCloseButton: Bool) {
    self.init(showCloseButton: showCloseButton) { EmptyView() }
  }
}

public struct DialogTitle: View {
  let text: Text

  public init(_ title: LocalizedStringKey) {
    text = Text(title)
  }

  public init(verbatim title: String) {
    text = Text(verbatim: title)
  }

  public var body: some View {
    text
      .textStyle(.base, weight: .semibold)
      .foregroundStyle(Color.label)
      .fixedSize(horizontal: false, vertical: true)
      .accessibilityAddTraits(.isHeader)
  }
}

public struct DialogDescription: View {
  let text: Text

  public init(_ description: LocalizedStringKey) {
    text = Text(description)
  }

  public init(verbatim description: String) {
    text = Text(verbatim: description)
  }

  public var body: some View {
    text
      .textStyle(.sm)
      .foregroundStyle(Color.labelSecondary)
      .fixedSize(horizontal: false, vertical: true)
  }
}

public struct DialogClose<Label: View>: View {
  let action: (() -> Void)?
  let label: Label

  @Environment(\.overlayDismiss) private var dismiss

  public init(action: (() -> Void)? = nil, @ViewBuilder label: () -> Label) {
    self.action = action
    self.label = label()
  }

  public var body: some View {
    Button {
      action?()
      dismiss?()
    } label: {
      label
    }
  }
}

extension DialogClose where Label == Text {
  public init(_ title: LocalizedStringKey, action: (() -> Void)? = nil) {
    self.init(action: action) { Text(title) }
  }
}
