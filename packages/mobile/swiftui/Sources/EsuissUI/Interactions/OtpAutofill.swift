import Observation
import SwiftUI

public enum OtpAutofillState: String, CaseIterable, Sendable {
  case idle
  case filling
  case verifying
  case verified
  case invalid
}

@MainActor
@Observable
final class OtpAutofillModel {
  var value = ""
  var state = OtpAutofillState.idle
  var focused = false
  var pops: [Int] = []
  var shakes = 0

  @ObservationIgnored var length: Int
  @ObservationIgnored var verify: @MainActor (String) async -> Bool
  @ObservationIgnored let interval: Duration
  @ObservationIgnored let hold: Duration
  @ObservationIgnored private var run = 0

  init(
    length: Int,
    interval: Duration = .milliseconds(70),
    hold: Duration = .milliseconds(600),
    verify: @escaping @MainActor (String) async -> Bool
  ) {
    self.length = length
    self.interval = interval
    self.hold = hold
    self.verify = verify
  }

  var locked: Bool {
    state == .filling || state == .verifying || state == .verified
  }

  func fill(_ code: String) {
    let digits = String(code.filter { !$0.isWhitespace }.prefix(length))
    guard !digits.isEmpty else { return }
    run += 1
    let current = run
    state = .filling
    Task {
      for index in 1...digits.count {
        value = String(digits.prefix(index))
        pop(index - 1)
        try? await Task.sleep(for: interval)
        guard current == run else { return }
      }
      if digits.count == length {
        await check(digits, run: current)
      } else {
        state = .idle
      }
    }
  }

  func type(_ next: String) {
    guard !locked else { return }
    if next.count - value.count > 1 {
      fill(next)
      return
    }
    run += 1
    let current = run
    state = .idle
    value = next
    if next.count == length {
      Task { await check(next, run: current) }
    }
  }

  private func pop(_ index: Int) {
    if pops.count < length { pops = Array(repeating: 0, count: length) }
    guard index < pops.count else { return }
    pops[index] += 1
  }

  private func check(_ code: String, run current: Int) async {
    state = .verifying
    let valid = await verify(code)
    guard current == run else { return }
    if valid {
      state = .verified
      return
    }
    state = .invalid
    shakes += 1
    try? await Task.sleep(for: hold)
    guard current == run else { return }
    value = ""
    state = .idle
    focused = true
  }
}

extension EnvironmentValues {
  @Entry var otpAutofill: OtpAutofillModel?
}

public struct OtpAutofill<Content: View>: View {
  let length: Int
  let onVerify: @MainActor (String) async -> Bool
  let content: (OtpAutofillState) -> Content

  @State private var model: OtpAutofillModel

  public init(
    length: Int,
    onVerify: @escaping @MainActor (String) async -> Bool,
    @ViewBuilder content: @escaping (OtpAutofillState) -> Content
  ) {
    self.length = length
    self.onVerify = onVerify
    self.content = content
    _model = State(initialValue: OtpAutofillModel(length: length, verify: onVerify))
  }

  init(model: OtpAutofillModel, @ViewBuilder content: @escaping (OtpAutofillState) -> Content) {
    length = model.length
    onVerify = model.verify
    self.content = content
    _model = State(initialValue: model)
  }

  public var body: some View {
    model.length = length
    model.verify = onVerify
    return VStack(spacing: 16) {
      content(model.state)
    }
    .environment(\.otpAutofill, model)
  }
}

public struct OtpAutofillInput<Content: View>: View {
  let autoFocus: Bool
  let content: Content

  @Environment(\.otpAutofill) private var model

  public init(autoFocus: Bool = false, @ViewBuilder content: () -> Content) {
    self.autoFocus = autoFocus
    self.content = content()
  }

  public var body: some View {
    if let model {
      let state = model.state
      InputOTP(
        text: Binding(get: { model.value }, set: { model.type($0) }),
        length: model.length
      ) {
        content
      }
      .environment(\.inputOTPFocus, Binding(get: { model.focused }, set: { model.focused = $0 }))
      .environment(
        \.inputOTPTone,
        InputOTPTone(
          danger: state == .invalid,
          verified: state == .verified,
          dimmed: state == .verifying,
          pops: model.pops
        )
      )
      .invalid(state == .invalid)
      .shake(trigger: model.shakes)
      .onAppear {
        if autoFocus { model.focused = true }
      }
    }
  }
}

extension OtpAutofillInput where Content == InputOTPGroup<ForEach<Range<Int>, Int, InputOTPSlot>> {
  public init(length: Int, autoFocus: Bool = false) {
    self.init(autoFocus: autoFocus) {
      InputOTPGroup {
        ForEach(0..<length, id: \.self) { InputOTPSlot(index: $0) }
      }
    }
  }
}

public struct OtpAutofillSuggestion: View {
  let code: String?
  let source: LocalizedStringKey

  @Environment(\.otpAutofill) private var model

  public init(code: String?, source: LocalizedStringKey = "From Messages") {
    self.code = code
    self.source = source
  }

  public var body: some View {
    let open = isOpen
    ZStack {
      if open, let code, let model {
        Button {
          model.fill(code)
        } label: {
          EmptyView()
        }
        .buttonStyle(PressReader { pressed in
          VStack(spacing: 0) {
            Text(source)
              .scaledFont(.xs)
              .foregroundStyle(EsuissColor.mutedForeground)
            Text(verbatim: code)
              .scaledFont(.base, weight: .semibold)
              .tracking(1.2)
              .monospacedDigit()
              .foregroundStyle(EsuissColor.foreground)
          }
          .frame(maxWidth: .infinity, minHeight: 44)
          .padding(.vertical, 6)
          .background(EsuissColor.muted.opacity(0.85))
          .background(.ultraThinMaterial)
          .overlay(alignment: .top) {
            EsuissColor.border.frame(height: 1)
          }
          .opacity(pressed ? 0.8 : 1)
          .contentShape(Rectangle())
        })
        .accessibilityLabel(Text(source))
        .accessibilityValue(Text(verbatim: code))
        .transition(.opacity.combined(with: .offset(y: 8)))
      }
    }
    .animation(.timingCurve(0.32, 0.72, 0, 1, duration: 0.3), value: open)
  }

  private var isOpen: Bool {
    guard let model, let code, !code.isEmpty else { return false }
    return model.focused && model.value.isEmpty && model.state == .idle
  }
}
