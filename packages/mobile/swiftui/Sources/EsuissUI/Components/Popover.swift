import SwiftUI
import UIKit

public struct PopoverContent<Content: View>: View {
  let width: CGFloat?
  let content: Content

  public init(width: CGFloat? = 288, @ViewBuilder content: () -> Content) {
    self.width = width
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      content
    }
    .scaledFont(TextStyle.base)
    .foregroundStyle(EsuissColor.foreground)
    .padding(16)
    .frame(width: width, alignment: .leading)
    .fixedSize(horizontal: width == nil, vertical: true)
    .presentationCompactAdaptation(.popover)
    .presentationBackground(EsuissColor.popover)
    .background(PopoverChrome())
  }
}

private struct PopoverChrome: UIViewRepresentable {
  func makeUIView(context: Context) -> PopoverChromeView { PopoverChromeView() }
  func updateUIView(_ view: PopoverChromeView, context: Context) { view.apply() }
}

final class PopoverChromeView: UIView {
  override init(frame: CGRect) {
    super.init(frame: frame)
    isUserInteractionEnabled = false
    registerForTraitChanges([UITraitUserInterfaceStyle.self]) { (view: PopoverChromeView, _) in view.apply() }
  }

  required init?(coder: NSCoder) { nil }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    apply()
    DispatchQueue.main.async { self.apply() }
  }

  func apply() {
    let dark = traitCollection.userInterfaceStyle == .dark
    var view = superview
    while let current = view, !(current is UIWindow) {
      for sibling in current.subviews where String(describing: type(of: sibling)).contains("ShadowView") {
        sibling.isHidden = dark
      }
      view = current.superview
    }
  }
}

public struct PopoverHeader<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

public typealias PopoverTitle = DialogTitle
public typealias PopoverDescription = DialogDescription
