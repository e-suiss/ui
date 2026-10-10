import PhosphorSwift
import SwiftUI

struct InputOTPContext {
  var characters: [Character]
  var length: Int
  var focused: Bool
}

extension EnvironmentValues {
  @Entry var inputOTP = InputOTPContext(characters: [], length: 0, focused: false)
}

public struct InputOTP<Content: View>: View {
  @Binding var text: String
  let length: Int
  let allowed: CharacterSet
  let content: Content

  @FocusState private var focused: Bool

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
  @Environment(\.isEnabled) private var isEnabled
  @ScaledMetric(relativeTo: .title2) private var scale: CGFloat = 1

  public init(index: Int) {
    self.index = index
  }

  public var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.lg, style: .continuous)
    let character = index < context.characters.count ? context.characters[index] : nil
    let active = isEnabled && context.focused
      && index == min(context.characters.count, context.length - 1)
    ZStack {
      if let character {
        Text(String(character))
          .font(.system(size: TextStyle.xl.size * scale, weight: .semibold))
          .monospacedDigit()
          .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
      } else if active {
        InputOTPCaret()
      }
    }
    .frame(width: 44 * scale, height: 52 * scale)
    .background(isEnabled ? Color.control : .controlDisabled, in: shape)
    .overlay {
      shape.strokeBorder(active ? Color.accent : .clear, lineWidth: 1.5)
    }
    .zIndex(active ? 1 : 0)
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
