import SwiftUI

extension EnvironmentValues {
  @Entry public var hapticsEnabled = true
}

extension View {
  public func haptics(_ enabled: Bool) -> some View {
    environment(\.hapticsEnabled, enabled)
  }

  func hapticFeedback<Trigger: Equatable>(_ feedback: SensoryFeedback, trigger: Trigger) -> some View {
    modifier(HapticFeedbackModifier(feedback: feedback, trigger: trigger) { _, _ in true })
  }

  func hapticFeedback<Trigger: Equatable>(
    _ feedback: SensoryFeedback,
    trigger: Trigger,
    condition: @escaping (Trigger, Trigger) -> Bool
  ) -> some View {
    modifier(HapticFeedbackModifier(feedback: feedback, trigger: trigger, condition: condition))
  }
}

private struct HapticFeedbackModifier<Trigger: Equatable>: ViewModifier {
  let feedback: SensoryFeedback
  let trigger: Trigger
  let condition: (Trigger, Trigger) -> Bool

  @Environment(\.hapticsEnabled) private var enabled

  func body(content: Content) -> some View {
    let enabled = enabled
    let condition = condition
    content.sensoryFeedback(feedback, trigger: trigger) { old, new in
      enabled && condition(old, new)
    }
  }
}

enum HapticMoments {
  static func step(_ value: Double, bounds: ClosedRange<Double>, step: Double?) -> Int? {
    guard let step, step > 0 else { return nil }
    return Int(((value - bounds.lowerBound) / step).rounded())
  }

  static func lifted<Value: Equatable>(_ old: Value?, _ new: Value?) -> Bool {
    new != nil && old != new
  }

  static func crossed<Value: Equatable>(_ old: Value?, _ new: Value?) -> Bool {
    old == nil && new != nil
  }

  static func moved(_ old: Int?, _ new: Int?) -> Bool {
    guard let old, let new else { return false }
    return old != new
  }
}

struct HapticButton<Style: ButtonStyle>: View {
  let feedback: SensoryFeedback
  let action: () -> Bool
  let style: Style

  @State private var count = 0

  init(_ feedback: SensoryFeedback = .selection, style: Style, action: @escaping () -> Bool) {
    self.feedback = feedback
    self.style = style
    self.action = action
  }

  var body: some View {
    Button {
      if action() { count += 1 }
    } label: {
      EmptyView()
    }
    .buttonStyle(style)
    .hapticFeedback(feedback, trigger: count)
  }
}
