import PhosphorSwift
import SwiftUI

enum StepperMath {
  static func canChange(_ value: Double, direction: Int, bounds: ClosedRange<Double>) -> Bool {
    direction > 0 ? value < bounds.upperBound : value > bounds.lowerBound
  }

  static func next(_ value: Double, direction: Int, step: Double, bounds: ClosedRange<Double>) -> Double? {
    guard canChange(value, direction: direction, bounds: bounds) else { return nil }
    let precision = max(0, -Int(log10(step).rounded(.down)))
    let factor = pow(10, Double(precision))
    let raw = ((value + Double(direction) * step) * factor).rounded() / factor
    return min(max(raw, bounds.lowerBound), bounds.upperBound)
  }

  static func delay(after count: Int) -> Duration {
    if count == 0 { return .milliseconds(400) }
    return .milliseconds(Int(max(35, 180 * pow(0.86, Double(count)))))
  }
}

struct StepperFormat {
  var format: (Double) -> String
  var parse: (String) -> Double?
}

struct StepperContext {
  var value: Double
  var enabled: Bool
  var format: (Double) -> String
  var parse: (String) -> Double?
  var canChange: @MainActor (Int) -> Bool
  var change: @MainActor (Int) -> Bool
  var set: @MainActor (Double) -> Void
}

extension EnvironmentValues {
  @Entry var stepper: StepperContext?
}

public struct ValueStepper<Content: View>: View {
  let value: Binding<Double>
  let bounds: ClosedRange<Double>
  let step: Double
  let style: (Locale) -> StepperFormat
  let content: Content

  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.locale) private var locale
  @State private var ticks = 0

  public init<F: ParseableFormatStyle>(
    value: Binding<Double>,
    in bounds: ClosedRange<Double> = -Double.infinity...Double.infinity,
    step: Double = 1,
    format: F,
    @ViewBuilder content: () -> Content
  ) where F.FormatInput == Double, F.FormatOutput == String {
    self.value = value
    self.bounds = bounds
    self.step = step
    style = { _ in StepperFormat(format: { format.format($0) }, parse: { try? format.parseStrategy.parse($0) }) }
    self.content = content()
  }

  public init(
    value: Binding<Double>,
    in bounds: ClosedRange<Double> = -Double.infinity...Double.infinity,
    step: Double = 1,
    @ViewBuilder content: () -> Content
  ) {
    self.value = value
    self.bounds = bounds
    self.step = step
    style = { locale in
      let format = FloatingPointFormatStyle<Double>.number.locale(locale)
      return StepperFormat(format: { format.format($0) }, parse: { try? format.parseStrategy.parse($0) })
    }
    self.content = content()
  }

  public init(
    value: Binding<Int>,
    in bounds: ClosedRange<Int>? = nil,
    step: Int = 1,
    @ViewBuilder content: () -> Content
  ) {
    let double = Binding<Double>(
      get: { Double(value.wrappedValue) },
      set: { value.wrappedValue = Int($0.rounded()) }
    )
    let range = bounds.map { Double($0.lowerBound)...Double($0.upperBound) } ?? -Double.infinity...Double.infinity
    self.value = double
    self.bounds = range
    self.step = Double(step)
    style = { locale in
      let format = IntegerFormatStyle<Int>.number.locale(locale)
      return StepperFormat(format: { format.format(Int($0.rounded())) }, parse: { (try? format.parseStrategy.parse($0)).map(Double.init) })
    }
    self.content = content()
  }

  public var body: some View {
    let binding = value
    let bounds = bounds
    let step = step
    let enabled = isEnabled
    let resolved = style(locale)
    let ticks = $ticks
    HStack(spacing: 12) {
      content
    }
    .environment(\.stepper, StepperContext(
      value: binding.wrappedValue,
      enabled: enabled,
      format: resolved.format,
      parse: resolved.parse,
      canChange: { direction in
        enabled && StepperMath.canChange(binding.wrappedValue, direction: direction, bounds: bounds)
      },
      change: { direction in
        guard enabled, let next = StepperMath.next(binding.wrappedValue, direction: direction, step: step, bounds: bounds) else { return false }
        binding.wrappedValue = next
        ticks.wrappedValue += 1
        return true
      },
      set: { next in
        binding.wrappedValue = min(max(next, bounds.lowerBound), bounds.upperBound)
      }
    ))
    .hapticFeedback(.selection, trigger: ticks.wrappedValue)
    .accessibilityElement(children: .contain)
  }
}

public struct StepperInput: View {
  @Environment(\.stepper) private var stepper
  @State private var text = ""
  @FocusState private var focused: Bool

  public init() {}

  public var body: some View {
    let enabled = stepper?.enabled ?? true
    TextField("", text: $text)
      .focused($focused)
      .keyboardType(.decimalPad)
      .multilineTextAlignment(.trailing)
      .font(TextStyle.base.font())
      .tracking(TextStyle.base.letterSpacing)
      .monospacedDigit()
      .foregroundStyle(enabled ? Color.label : .labelQuaternary)
      .tint(Color.accent)
      .padding(.horizontal, 4)
      .frame(width: 64, height: 32)
      .contentShape(RoundedRectangle(cornerRadius: Radius.md, style: .continuous))
      .onAppear { sync() }
      .onChange(of: stepper?.value) { _, _ in
        if !focused { sync() }
      }
      .onChange(of: focused) { _, isFocused in
        if !isFocused { commit() }
      }
      .onSubmit { commit() }
      .accessibilityValue(Text(verbatim: stepper.map { $0.format($0.value) } ?? ""))
      .accessibilityAdjustableAction { direction in
        _ = stepper?.change(direction == .increment ? 1 : -1)
      }
  }

  private func sync() {
    guard let stepper else { return }
    text = stepper.format(stepper.value)
  }

  private func commit() {
    guard let stepper else { return }
    if let parsed = stepper.parse(text) ?? Double(text) {
      stepper.set(parsed)
    }
    text = stepper.format(stepper.value)
  }
}

public struct StepperGroup<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.lg, style: .continuous)
    HStack(spacing: 3) {
      content
    }
    .padding(3)
    .frame(height: 32)
    .background(Color.control, in: shape)
    .fixedSize()
    .accessibilityElement(children: .contain)
  }
}

@MainActor
final class StepperPress {
  var handled = false
  var repeating: Task<Void, Never>?
}

struct StepperButton<Label: View>: View {
  let direction: Int
  let label: Label

  @Environment(\.stepper) private var stepper
  @State private var press = StepperPress()

  var body: some View {
    let enabled = stepper?.canChange(direction) ?? false
    Button {
      if press.handled {
        press.handled = false
      } else {
        _ = stepper?.change(direction)
      }
    } label: {
      label
    }
    .buttonStyle(StepperButtonStyle(direction: direction, press: press))
    .disabled(!enabled)
    .accessibilityAction {
      _ = stepper?.change(direction)
    }
  }
}

private struct StepperButtonStyle: ButtonStyle {
  let direction: Int
  let press: StepperPress

  func makeBody(configuration: Configuration) -> some View {
    StepperButtonBody(direction: direction, pressed: configuration.isPressed, press: press, label: configuration.label)
  }
}

private struct StepperButtonBody<Label: View>: View {
  let direction: Int
  let pressed: Bool
  let press: StepperPress
  let label: Label

  @Environment(\.stepper) private var stepper
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.colorScheme) private var colorScheme

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.md, style: .continuous)
    label
      .frame(width: 16, height: 16)
      .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
      .frame(width: 36)
      .frame(maxHeight: .infinity)
      .background {
        if !(stepper?.enabled ?? true) {
          shape.fill(Color.controlDisabled)
        } else if pressed && isEnabled {
          shape.fill(Color.controlPressed)
        } else if colorScheme == .dark {
          shape.fill(Color.labelQuaternary)
        } else {
          shape.fill(Color.surfaceRaised).shadow(.thumb)
        }
      }
      .padding(.vertical, 9)
      .contentShape(Rectangle())
      .padding(.vertical, -9)
      .onChange(of: pressed) { _, isPressed in
        press.repeating?.cancel()
        press.repeating = nil
        guard isPressed else {
          let current = press
          Task { @MainActor in
            try? await Task.sleep(for: .milliseconds(350))
            current.handled = false
          }
          return
        }
        guard let stepper, stepper.change(direction) else { return }
        press.handled = true
        press.repeating = Task { @MainActor in
          var count = 0
          while !Task.isCancelled {
            try? await Task.sleep(for: StepperMath.delay(after: count))
            guard !Task.isCancelled, stepper.change(direction) else { return }
            count += 1
          }
        }
      }
      .onDisappear {
        press.repeating?.cancel()
      }
  }
}

public struct StepperDecrement<Label: View>: View {
  let label: Label

  public init(@ViewBuilder label: () -> Label) {
    self.label = label()
  }

  public var body: some View {
    StepperButton(direction: -1, label: label)
      .accessibilityLabel(Text("Decrease"))
  }
}

extension StepperDecrement where Label == Image {
  public init() {
    self.init { Ph.minus.bold }
  }
}

public struct StepperIncrement<Label: View>: View {
  let label: Label

  public init(@ViewBuilder label: () -> Label) {
    self.label = label()
  }

  public var body: some View {
    StepperButton(direction: 1, label: label)
      .accessibilityLabel(Text("Increase"))
  }
}

extension StepperIncrement where Label == Image {
  public init() {
    self.init { Ph.plus.bold }
  }
}

public struct StepperSeparator: View {
  public init() {}

  public var body: some View {
    Color.separator
      .frame(width: 1, height: 18)
      .accessibilityHidden(true)
  }
}
