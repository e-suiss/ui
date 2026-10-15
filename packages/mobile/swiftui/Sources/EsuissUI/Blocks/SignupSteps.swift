import PhosphorSwift
import SwiftUI

public struct SignupSteps: View {
  struct Step {
    let title: LocalizedStringKey
    let description: LocalizedStringKey
    let placeholder: Text
    let content: UITextContentType
    let keyboard: UIKeyboardType
    let secure: Bool
    let valid: (String) -> Bool
  }

  static var steps: [Step] {
    [
      Step(
        title: "What should we call you?",
        description: "Your name appears across suiss products and services.",
        placeholder: Text("Full name"),
        content: .name,
        keyboard: .default,
        secure: false,
        valid: { $0.trimmingCharacters(in: .whitespaces).count > 1 }
      ),
      Step(
        title: "What's your email address?",
        description: "This will be your suiss Account.",
        placeholder: Text(verbatim: "name@example.com"),
        content: .emailAddress,
        keyboard: .emailAddress,
        secure: false,
        valid: { $0.wholeMatch(of: /.+@.+\..+/) != nil }
      ),
      Step(
        title: "Create a password.",
        description: "A strong password keeps your account safe.",
        placeholder: Text("Password"),
        content: .newPassword,
        keyboard: .default,
        secure: true,
        valid: { value in SignupStepsRules.rules.allSatisfy { $0.1(value) } }
      ),
    ]
  }

  private var onSubmit: ((String, String, String) -> Void)?
  @State private var index: Int
  @State private var forward = true
  @State private var values: [String]
  @State private var done: Bool
  @FocusState private var focused: Bool
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(onSubmit: ((_ name: String, _ email: String, _ password: String) -> Void)? = nil) {
    self.init(index: 0, values: ["", "", ""])
    self.onSubmit = onSubmit
  }

  init(index: Int, values: [String], done: Bool = false) {
    _index = State(initialValue: index)
    _values = State(initialValue: values)
    _done = State(initialValue: done)
  }

  private var step: Step { Self.steps[index] }
  private var ready: Bool { step.valid(values[index]) }

  public var body: some View {
    Screen {
      if done {
        welcome(name: values[0].split(separator: " ").first.map(String.init) ?? "", email: values[1])
          .transition(.opacity.combined(with: .offset(y: 18)))
      } else {
        progress
          .padding(.top, 16)
        KeyboardScrollView {
          form
            .id(index)
            .transition(reduceMotion ? .opacity : .asymmetric(
              insertion: .opacity.combined(with: .offset(x: forward ? 40 : -40)),
              removal: .opacity
            ))
        }
        BottomBar(separator: false) {
          BottomBarContent {
            HStack(spacing: 12) {
              if index > 0 {
                Button("Back") { go(-1) }
                  .buttonStyle(.variant(.outline, size: .lg, block: true))
              }
              Button(index == Self.steps.count - 1 ? "Create account" : "Continue") { go(1) }
                .buttonStyle(.variant(.default, size: .lg, block: true))
                .disabled(!ready)
            }
          }
        }
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.55), value: index)
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.6), value: done)
  }

  private var progress: some View {
    HStack(spacing: 8) {
      ForEach(0..<Self.steps.count, id: \.self) { position in
        Capsule()
          .fill(position <= index ? EsuissColor.primary : EsuissColor.border)
          .frame(width: position == index ? 28 : 6, height: 6)
      }
    }
    .frame(maxWidth: .infinity)
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(Text("Progress"))
    .accessibilityValue(Text("Step \(index + 1) of \(Self.steps.count)"))
  }

  private var form: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
    return VStack(spacing: 14) {
      Text("Step \(index + 1) of \(Self.steps.count)")
        .scaledFont(.sm, weight: .semibold)
        .foregroundStyle(EsuissColor.mutedForeground)
      Text(step.title)
        .scaledTextStyle(.xl2, weight: .bold)
      Text(step.description)
        .scaledTextStyle(.lg)
        .foregroundStyle(EsuissColor.mutedForeground)
      Group {
        if step.secure {
          SecureField(text: $values[index], prompt: step.placeholder) { step.placeholder }
        } else {
          TextField(text: $values[index], prompt: step.placeholder) { step.placeholder }
            .keyboardType(step.keyboard)
            .textInputAutocapitalization(step.keyboard == .emailAddress ? .never : .words)
            .autocorrectionDisabled()
        }
      }
      .textContentType(step.content)
      .submitLabel(index == Self.steps.count - 1 ? .done : .next)
      .focused($focused)
      .onSubmit { if ready { go(1) } }
      .scaledFont(.lg)
      .foregroundStyle(EsuissColor.foreground)
      .tint(EsuissColor.primary)
      .multilineTextAlignment(.leading)
      .padding(.horizontal, 16)
      .frame(maxWidth: .infinity, minHeight: 52, alignment: .leading)
      .background(EsuissColor.background, in: shape)
      .overlay {
        shape.strokeBorder(focused ? EsuissColor.ring : EsuissColor.input, lineWidth: 1)
      }
      .padding(.top, 16)
      if step.secure && !values[index].isEmpty {
        SignupStepsRules(password: values[index])
          .frame(maxWidth: .infinity, alignment: .leading)
      }
    }
    .multilineTextAlignment(.center)
    .fixedSize(horizontal: false, vertical: true)
    .frame(maxWidth: .infinity)
    .padding(.horizontal, 24)
    .padding(.vertical, 40)
  }

  private func welcome(name: String, email: String) -> some View {
    VStack(spacing: 14) {
      Ph.check.bold
        .frame(width: 38, height: 38)
        .foregroundStyle(EsuissColor.primaryForeground)
        .frame(width: 76, height: 76)
        .background(Palette.green500, in: Circle())
        .accessibilityHidden(true)
      Text("Welcome, \(name).")
        .scaledTextStyle(.xl2, weight: .bold)
      Text("Your account is ready. Verify \(email) to finish.")
        .scaledTextStyle(.lg)
        .foregroundStyle(EsuissColor.mutedForeground)
      Button("Start over ›") {
        done = false
        index = 0
      }
      .buttonStyle(SignupStepsLinkStyle())
    }
    .multilineTextAlignment(.center)
    .fixedSize(horizontal: false, vertical: true)
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }

  private func go(_ delta: Int) {
    forward = delta > 0
    if index + delta > Self.steps.count - 1 {
      focused = false
      onSubmit?(values[0], values[1], values[2])
      done = true
      return
    }
    index = max(0, index + delta)
  }
}

private struct SignupStepsRules: View {
  let password: String

  static var rules: [(LocalizedStringKey, (String) -> Bool)] {
    [
      ("At least 8 characters", { $0.count >= 8 }),
      ("Upper and lowercase letters", { $0.contains(where: \.isUppercase) && $0.contains(where: \.isLowercase) }),
      ("At least one number", { $0.contains(where: \.isNumber) }),
    ]
  }

  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    VStack(alignment: .leading, spacing: 6) {
      ForEach(Array(Self.rules.enumerated()), id: \.offset) { _, rule in
        let met = rule.1(password)
        HStack(spacing: 8) {
          ZStack {
            Circle()
              .strokeBorder(met ? Color.clear : EsuissColor.border, lineWidth: 1.5)
              .background(met ? Palette.green500 : .clear, in: Circle())
            Ph.check.bold
              .frame(width: 10, height: 10)
              .foregroundStyle(EsuissColor.primaryForeground)
              .scaleEffect(met ? 1 : 0)
          }
          .frame(width: 16, height: 16)
          Text(rule.0)
            .scaledFont(.sm)
            .foregroundStyle(met ? EsuissColor.foreground : EsuissColor.mutedForeground)
        }
        .animation(reduceMotion ? nil : .spring(response: 0.25, dampingFraction: 0.6), value: met)
        .accessibilityElement(children: .combine)
        .accessibilityValue(met ? Text("Met") : Text("Not met"))
      }
    }
  }
}

private struct SignupStepsLinkStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(.lg)
      .foregroundStyle(EsuissColor.primary)
      .opacity(configuration.isPressed ? 0.8 : 1)
      .frame(minHeight: 32)
      .contentShape(Rectangle())
  }
}
