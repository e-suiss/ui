import PhosphorSwift
import SwiftUI

struct InputOTPContext {
  var characters: [Character]
  var length: Int
  var focused: Bool
}

struct InputOTPTone: Equatable {
  var danger = false
  var verified = false
  var dimmed = false
  var pops: [Int] = []
}

extension EnvironmentValues {
  @Entry var inputOTP = InputOTPContext(characters: [], length: 0, focused: false)
  @Entry var inputOTPTone = InputOTPTone()
  @Entry var inputOTPFocus: Binding<Bool>?
}

public struct InputOTP<Content: View>: View {
  @Binding var text: String
  let length: Int
  let allowed: CharacterSet
  let content: Content

  @FocusState private var focused: Bool
  @Environment(\.inputOTPFocus) private var externalFocus

  public init(
    text: Binding<String>,
    length: Int,
    allowed: CharacterSet = .decimalDigits,
    @ViewBuilder content: () -> Content
  ) {
    _text = text
    self.length = length
    self.allowed = allowed
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 8) {
      content
    }
    .accessibilityHidden(true)
    .environment(\.inputOTP, InputOTPContext(characters: Array(text), length: length, focused: focused))
    .background {
      TextField("", text: filtered)
        .textContentType(.oneTimeCode)
        .keyboardType(allowed == .decimalDigits ? .numberPad : .asciiCapable)
        .textInputAutocapitalization(.never)
        .autocorrectionDisabled()
        .focused($focused)
        .foregroundStyle(.clear)
        .tint(.clear)
        .accessibilityLabel(Text("One-time code"))
        .accessibilityValue(Text(verbatim: text))
    }
    .contentShape(Rectangle())
    .onTapGesture { focused = true }
    .onAppear {
      if externalFocus?.wrappedValue == true { focused = true }
    }
    .onChange(of: focused) { _, new in
      if let externalFocus, externalFocus.wrappedValue != new { externalFocus.wrappedValue = new }
    }
    .onChange(of: externalFocus?.wrappedValue) { _, new in
      if let new, new != focused { focused = new }
    }
  }

  private var filtered: Binding<String> {
    Binding(
      get: { text },
      set: { newValue in
        let scalars = newValue.unicodeScalars.filter { allowed.contains($0) }
        text = String(String.UnicodeScalarView(scalars).prefix(length))
      }
    )
  }
}

extension InputOTP where Content == InputOTPGroup<ForEach<Range<Int>, Int, InputOTPSlot>> {
  public init(text: Binding<String>, length: Int, allowed: CharacterSet = .decimalDigits) {
    self.init(text: text, length: length, allowed: allowed) {
      InputOTPGroup {
        ForEach(0..<length, id: \.self) { InputOTPSlot(index: $0) }
      }
    }
  }
}

public struct InputOTPGroup<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 8) {
      content
    }
  }
}

public struct InputOTPSlot: View {
  let index: Int

  @Environment(\.inputOTP) private var context
  @Environment(\.inputOTPTone) private var tone
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.isInvalid) private var invalid
  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.accessibilityReduceMotion) private var reduceMotion
  @ScaledMetric(relativeTo: .title2) private var scale: CGFloat = 1

  public init(index: Int) {
    self.index = index
  }

  public var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.lg, style: .continuous)
    let character = index < context.characters.count ? context.characters[index] : nil
    let active = isEnabled && context.focused
      && index == min(context.characters.count, context.length - 1)
    let pop = index < tone.pops.count ? tone.pops[index] : 0
    let still = reduceMotion
    ZStack {
      if let character {
        Text(String(character))
          .font(.system(size: TextStyle.xl.size * scale, weight: .semibold))
          .monospacedDigit()
          .foregroundStyle(foreground)
      } else if active {
        InputOTPCaret()
      }
    }
    .frame(width: 44 * scale, height: 52 * scale)
    .background(background, in: shape)
    .overlay {
      shape.strokeBorder(border(active: active), lineWidth: 1.5)
    }
    .opacity(tone.dimmed ? 0.6 : 1)
    .animation(.easeInOut(duration: 0.3), value: tone)
    .animation(.easeInOut(duration: 0.3), value: invalid)
    .keyframeAnimator(initialValue: CGFloat(1), trigger: pop) { view, value in
      view.scaleEffect(still ? 1 : value)
    } keyframes: { _ in
      KeyframeTrack {
        LinearKeyframe(0.8, duration: 0.001)
        CubicKeyframe(1.08, duration: 0.144)
        CubicKeyframe(1, duration: 0.096)
      }
    }
    .zIndex(active ? 1 : 0)
  }

  private var foreground: Color {
    if !isEnabled { return .labelQuaternary }
    if tone.verified { return .success }
    if tone.danger { return .danger }
    return .label
  }

  private var background: Color {
    if !isEnabled { return .controlDisabled }
    if tone.verified { return .successSurface }
    if invalid { return .danger.opacity(colorScheme == .dark ? 0.1 : 0.05) }
    return .control
  }

  private func border(active: Bool) -> Color {
    if !isEnabled { return .clear }
    if tone.verified { return .success }
    if invalid { return .danger }
    return active ? .accent : .clear
  }
}

private struct InputOTPCaret: View {
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    TimelineView(.periodic(from: .now, by: 0.5)) { timeline in
      let phase = Int(timeline.date.timeIntervalSinceReferenceDate * 2) % 2
      Capsule()
        .fill(Color.accent)
        .frame(width: 2, height: 24)
        .opacity(reduceMotion || phase == 0 ? 1 : 0)
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.2), value: phase)
    }
  }
}

public struct InputOTPSeparator: View {
  @Environment(\.isEnabled) private var isEnabled

  public init() {}

  public var body: some View {
    Ph.minus.regular
      .frame(width: 16, height: 16)
      .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
  }
}
