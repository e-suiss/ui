import SwiftUI

extension EnvironmentValues {
  @Entry var patternCompact: Bool? = nil
}

@propertyWrapper
struct CompactLayout: DynamicProperty {
  @Environment(\.patternCompact) private var forced
  @Environment(\.horizontalSizeClass) private var sizeClass

  init() {}

  var wrappedValue: Bool {
    forced ?? (sizeClass != .regular)
  }
}

extension Binding where Value == Bool {
  func gated(_ enabled: Bool) -> Binding<Bool> {
    Binding(
      get: { enabled && wrappedValue },
      set: { wrappedValue = $0 }
    )
  }
}
