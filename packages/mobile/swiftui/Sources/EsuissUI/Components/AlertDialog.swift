import SwiftUI

extension View {
  public func alertDialog<Content: View>(
    isPresented: Binding<Bool>,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    modifier(
      CoverPresenter(isPresented: isPresented) { visible in
        CenteredStage(visible: visible, dismissible: false, content: content)
      }
    )
  }
}

public struct AlertDialogContent<Content: View>: View {
  public enum Size: CaseIterable, Sendable {
    case `default`, sm
  }

  let size: Size
  let content: Content

  public init(size: Size = .default, @ViewBuilder content: () -> Content) {
    self.size = size
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 24) {
      content
    }
    .padding(24)
    .frame(maxWidth: size == .sm ? 320 : 340)
    .popupSurface(radius: Radius.xl2)
    .accessibilityElement(children: .contain)
    .accessibilityAddTraits(.isModal)
  }
}

public struct AlertDialogHeader<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(spacing: 6) {
      content
    }
    .multilineTextAlignment(.center)
    .frame(maxWidth: .infinity)
  }
}

public struct AlertDialogMedia<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    content
      .frame(width: 32, height: 32)
      .foregroundStyle(EsuissColor.foreground)
      .frame(width: 64, height: 64)
      .background(EsuissColor.muted, in: Circle())
      .padding(.bottom, 8)
      .accessibilityHidden(true)
  }
}

public struct AlertDialogTitle: View {
  let text: Text

  public init(_ title: LocalizedStringKey) {
    text = Text(title)
  }

  public init(verbatim title: String) {
    text = Text(verbatim: title)
  }

  public var body: some View {
    text
      .textStyle(.lg, weight: .semibold)
      .foregroundStyle(EsuissColor.foreground)
      .multilineTextAlignment(.center)
      .fixedSize(horizontal: false, vertical: true)
      .accessibilityAddTraits(.isHeader)
  }
}

public struct AlertDialogDescription: View {
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
      .foregroundStyle(EsuissColor.mutedForeground)
      .multilineTextAlignment(.center)
      .fixedSize(horizontal: false, vertical: true)
  }
}

public struct AlertDialogFooter<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 8) {
      content
    }
    .frame(maxWidth: .infinity)
  }
}

public struct AlertDialogAction<Label: View>: View {
  let variant: VariantButtonStyle.Variant
  let size: VariantButtonStyle.Size
  let action: (() -> Void)?
  let label: Label

  @Environment(\.overlayDismiss) private var dismiss

  public init(
    variant: VariantButtonStyle.Variant = .default,
    size: VariantButtonStyle.Size = .default,
    action: (() -> Void)? = nil,
    @ViewBuilder label: () -> Label
  ) {
    self.variant = variant
    self.size = size
    self.action = action
    self.label = label()
  }

  public var body: some View {
    Button {
      action?()
      dismiss?()
    } label: {
      label.frame(maxWidth: .infinity)
    }
    .buttonStyle(.variant(variant, size: size))
  }
}

extension AlertDialogAction where Label == Text {
  public init(
    _ title: LocalizedStringKey,
    variant: VariantButtonStyle.Variant = .default,
    size: VariantButtonStyle.Size = .default,
    action: (() -> Void)? = nil
  ) {
    self.init(variant: variant, size: size, action: action) { Text(title) }
  }
}

public struct AlertDialogCancel<Label: View>: View {
  let variant: VariantButtonStyle.Variant
  let size: VariantButtonStyle.Size
  let action: (() -> Void)?
  let label: Label

  public init(
    variant: VariantButtonStyle.Variant = .secondary,
    size: VariantButtonStyle.Size = .default,
    action: (() -> Void)? = nil,
    @ViewBuilder label: () -> Label
  ) {
    self.variant = variant
    self.size = size
    self.action = action
    self.label = label()
  }

  public var body: some View {
    AlertDialogAction(variant: variant, size: size, action: action) { label }
  }
}

extension AlertDialogCancel where Label == Text {
  public init(
    _ title: LocalizedStringKey = "Cancel",
    variant: VariantButtonStyle.Variant = .secondary,
    size: VariantButtonStyle.Size = .default,
    action: (() -> Void)? = nil
  ) {
    self.init(variant: variant, size: size, action: action) { Text(title) }
  }
}
