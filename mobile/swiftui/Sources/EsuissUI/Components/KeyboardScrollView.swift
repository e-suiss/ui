import SwiftUI
import UIKit

public struct KeyboardScrollView<Content: View>: View {
  let showsIndicators: Bool
  let content: Content

  public init(showsIndicators: Bool = true, @ViewBuilder content: () -> Content) {
    self.showsIndicators = showsIndicators
    self.content = content()
  }

  public var body: some View {
    ScrollView(.vertical, showsIndicators: showsIndicators) {
      content
        .frame(maxWidth: .infinity, alignment: .topLeading)
        .background {
          Color.clear
            .contentShape(Rectangle())
            .onTapGesture { KeyboardScrollView.dismissKeyboard() }
        }
    }
    .scrollDismissesKeyboard(.interactively)
  }

  @MainActor
  static func dismissKeyboard() {
    UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
  }
}
