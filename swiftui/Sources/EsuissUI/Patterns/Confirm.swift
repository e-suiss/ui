import SwiftUI

extension View {
  public func confirm<Content: View>(
    isPresented: Binding<Bool>,
    dismissible: Bool = false,
    @ViewBuilder content: @escaping () -> Content
  ) -> some View {
    modifier(ConfirmPresenter(isPresented: isPresented, dismissible: dismissible, content: content))
  }
}

struct ConfirmPresenter<Body: View>: ViewModifier {
  @Binding var isPresented: Bool
  let dismissible: Bool
  @ViewBuilder let content: () -> Body

  @CompactLayout private var compact

  func body(content host: Content) -> some View {
    let compact = self.compact
    host.modifier(
      CoverPresenter(
        isPresented: $isPresented,
        enter: compact ? .timingCurve(0.32, 0.72, 0, 1, duration: 0.3) : .easeOut(duration: 0.15),
        exit: compact ? .timingCurve(0.32, 0.72, 0, 1, duration: 0.25) : .easeIn(duration: 0.1)
      ) { visible in
        Group {
          if compact {
            AlertSheetStage(visible: visible, dismissible: dismissible, content: content)
          } else {
            CenteredStage(visible: visible, dismissible: dismissible, content: content)
          }
        }
        .environment(\.patternCompact, compact)
      }
    )
  }
}

struct ConfirmCancelEntry: Equatable {
  let title: LocalizedStringKey
  let action: (() -> Void)?

  static func == (lhs: ConfirmCancelEntry, rhs: ConfirmCancelEntry) -> Bool {
    lhs.title == rhs.title
  }
}

struct ConfirmCancelKey: PreferenceKey {
  static var defaultValue: ConfirmCancelEntry? { nil }

  static func reduce(value: inout ConfirmCancelEntry?, nextValue: () -> ConfirmCancelEntry?) {
    value = value ?? nextValue()
  }
}

public struct ConfirmContent<Content: View>: View {
  let size: AlertDialogContent<Content>.Size
  let content: Content

  @State private var cancel: ConfirmCancelEntry?
  @CompactLayout private var compact

  public init(size: AlertDialogContent<Content>.Size = .default, @ViewBuilder content: () -> Content) {
    self.size = size
    self.content = content()
  }

  public var body: some View {
    if !compact {
      AlertDialogContent(size: size) { content }
    } else {
      AlertSheetContent {
        AlertSheetGroup { content }
        if let cancel {
          AlertSheetCancel(cancel.title, action: cancel.action)
        }
      }
      .onPreferenceChange(ConfirmCancelKey.self) { cancel = $0 }
    }
  }
}

public struct ConfirmHeader<Content: View>: View {
  let content: Content

  @CompactLayout private var compact

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if !compact {
      AlertDialogHeader { content }
    } else {
      AlertSheetHeader { content }
    }
  }
}

public struct ConfirmTitle: View {
  let title: LocalizedStringKey

  @CompactLayout private var compact

  public init(_ title: LocalizedStringKey) {
    self.title = title
  }

  public var body: some View {
    if !compact {
      AlertDialogTitle(title)
    } else {
      AlertSheetTitle(title)
    }
  }
}

public struct ConfirmDescription: View {
  let description: LocalizedStringKey

  @CompactLayout private var compact

  public init(_ description: LocalizedStringKey) {
    self.description = description
  }

  public var body: some View {
    if !compact {
      AlertDialogDescription(description)
    } else {
      AlertSheetDescription(description)
    }
  }
}

public struct ConfirmFooter<Content: View>: View {
  let content: Content

  @CompactLayout private var compact

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if !compact {
      AlertDialogFooter { content }
    } else {
      SeparatedStack { content }
    }
  }
}

public struct ConfirmAction: View {
  let title: LocalizedStringKey
  let variant: AlertSheetActionVariant
  let action: (() -> Void)?

  @CompactLayout private var compact

  public init(
    _ title: LocalizedStringKey,
    variant: AlertSheetActionVariant = .default,
    action: (() -> Void)? = nil
  ) {
    self.title = title
    self.variant = variant
    self.action = action
  }

  public var body: some View {
    if !compact {
      AlertDialogAction(title, variant: variant == .destructive ? .destructive : .default, action: action)
    } else {
      AlertSheetAction(title, variant: variant, action: action)
    }
  }
}

public struct ConfirmCancel: View {
  let title: LocalizedStringKey
  let action: (() -> Void)?

  @CompactLayout private var compact

  public init(_ title: LocalizedStringKey = "Cancel", action: (() -> Void)? = nil) {
    self.title = title
    self.action = action
  }

  public var body: some View {
    if !compact {
      AlertDialogCancel(title, action: action)
    } else {
      Color.clear
        .frame(width: 0, height: 0)
        .accessibilityHidden(true)
        .preference(key: ConfirmCancelKey.self, value: ConfirmCancelEntry(title: title, action: action))
    }
  }
}
