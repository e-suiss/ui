import PhosphorSwift
import SwiftUI

public struct LoginAccount: View {
  enum Step: Sendable {
    case email, password
  }

  enum FocusField: Hashable {
    case email, password
  }

  private var onForgotPassword: (() -> Void)?
  private var onCreateAccount: (() -> Void)?
  private var onSubmit: ((String, String) -> Void)?
  @State private var step: Step
  @State private var email: String
  @State private var password: String
  @State private var error: LocalizedStringKey?
  @State private var busy: Bool
  @State private var signedIn: Bool
  @State private var remember = true
  @State private var shakes = 0
  @FocusState private var focus: FocusField?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onSubmit: ((String, String) -> Void)? = nil,
    onForgotPassword: (() -> Void)? = nil,
    onCreateAccount: (() -> Void)? = nil
  ) {
    self.init(step: .email)
    self.onSubmit = onSubmit
    self.onForgotPassword = onForgotPassword
    self.onCreateAccount = onCreateAccount
  }

  init(
    step: Step,
    email: String = "",
    password: String = "",
    error: LocalizedStringKey? = nil,
    busy: Bool = false,
    signedIn: Bool = false
  ) {
    _step = State(initialValue: step)
    _email = State(initialValue: email)
    _password = State(initialValue: password)
    _error = State(initialValue: error)
    _busy = State(initialValue: busy)
    _signedIn = State(initialValue: signedIn)
  }

  public var body: some View {
    Screen {
      if signedIn {
        welcome
          .transition(.opacity.combined(with: .offset(y: 18)))
      } else {
        form
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.45), value: step)
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.6), value: signedIn)
  }

  private var form: some View {
    KeyboardScrollView {
      VStack(spacing: 0) {
        Text("Sign in with your suiss Account")
          .scaledTextStyle(.xl2, weight: .bold)
          .multilineTextAlignment(.center)
          .fixedSize(horizontal: false, vertical: true)
          .padding(.bottom, 32)
        fields
          .shake(trigger: shakes)
        Text(error ?? "")
          .scaledTextStyle(.xs)
          .foregroundStyle(EsuissColor.destructive)
          .frame(minHeight: 22)
          .padding(.top, 10)
          .accessibilityHidden(error == nil)
        Toggle(isOn: $remember) {
          Text("Remember me")
            .scaledFont(.sm)
            .foregroundStyle(EsuissColor.foreground)
        }
        .toggleStyle(.checkbox)
        .padding(.top, 6)
        VStack(spacing: 10) {
          Button("Forgot password? ›") { onForgotPassword?() }
            .buttonStyle(LoginAccountLinkStyle())
          ViewThatFits(in: .horizontal) {
            HStack(spacing: 4) { createAccount }
            VStack(spacing: 4) { createAccount }
          }
        }
        .padding(.top, 40)
      }
      .frame(maxWidth: .infinity)
      .padding(.horizontal, 24)
      .padding(.top, 72)
      .padding(.bottom, 24)
    }
  }

  @ViewBuilder private var createAccount: some View {
    Text("Don't have a suiss Account?")
      .scaledFont(.sm)
      .foregroundStyle(EsuissColor.mutedForeground)
    Button("Create yours now ›") { onCreateAccount?() }
      .buttonStyle(LoginAccountLinkStyle())
  }

  private var fields: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
    let invalid = error != nil
    return VStack(spacing: 0) {
      HStack(spacing: 0) {
        TextField("Email or phone number", text: $email)
          .textContentType(.username)
          .keyboardType(.emailAddress)
          .textInputAutocapitalization(.never)
          .autocorrectionDisabled()
          .submitLabel(.continue)
          .focused($focus, equals: .email)
          .onSubmit(submit)
          .onChange(of: email) {
            error = nil
            if step == .password { step = .email }
          }
          .modifier(LoginAccountFieldText())
        if step == .email {
          LoginAccountArrow(ready: !email.isEmpty, busy: busy, action: submit)
        }
      }
      if step == .password {
        EsuissColor.input.frame(height: 1)
        HStack(spacing: 0) {
          SecureField("Password", text: $password)
            .textContentType(.password)
            .submitLabel(.go)
            .focused($focus, equals: .password)
            .onSubmit(submit)
            .onChange(of: password) { error = nil }
            .modifier(LoginAccountFieldText())
          LoginAccountArrow(ready: !password.isEmpty, busy: busy, action: submit)
        }
        .transition(.move(edge: .top).combined(with: .opacity))
      }
    }
    .background(invalid ? Color.adaptive(light: EsuissColor.destructive.opacity(0.1), dark: EsuissColor.destructive.opacity(0.2)) : EsuissColor.background, in: shape)
    .clipShape(shape)
    .overlay {
      shape.strokeBorder(invalid ? EsuissColor.destructive : focus != nil ? EsuissColor.ring : EsuissColor.input, lineWidth: 1)
    }
    .animation(.easeInOut(duration: 0.2), value: invalid)
  }

  private var welcome: some View {
    VStack(spacing: 14) {
      Avatar(size: .xl) {
        Text(verbatim: String(email.prefix(1)).uppercased())
          .scaledFont(.xl2, weight: .semibold)
          .foregroundStyle(EsuissColor.foreground)
          .frame(maxWidth: .infinity, maxHeight: .infinity)
          .background(EsuissColor.muted, in: Circle())
      }
      Text("Hello.")
        .scaledTextStyle(.xl3, weight: .bold)
      Text(verbatim: email)
        .scaledTextStyle(.lg)
        .foregroundStyle(EsuissColor.mutedForeground)
      Button("Sign out ›") {
        signedIn = false
        step = .email
        password = ""
      }
      .buttonStyle(LoginAccountLinkStyle(style: .lg))
    }
    .multilineTextAlignment(.center)
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }

  private func submit() {
    guard !busy else { return }
    if step == .email {
      guard email.wholeMatch(of: /.+@.+\..+/) != nil else {
        return fail("Enter a valid suiss Account.")
      }
      error = nil
      step = .password
      focus = .password
      return
    }
    guard password.count >= 4 else {
      return fail("Your suiss Account or password was incorrect.")
    }
    error = nil
    onSubmit?(email, password)
    busy = true
    focus = nil
    Task {
      try? await Task.sleep(for: .milliseconds(1200))
      busy = false
      signedIn = true
    }
  }

  private func fail(_ message: LocalizedStringKey) {
    error = message
    shakes += 1
  }
}

private struct LoginAccountFieldText: ViewModifier {
  func body(content: Content) -> some View {
    content
      .scaledFont(.lg)
      .foregroundStyle(EsuissColor.foreground)
      .tint(EsuissColor.primary)
      .padding(.horizontal, 16)
      .frame(maxWidth: .infinity, minHeight: 56, alignment: .leading)
  }
}

private struct LoginAccountArrow: View {
  let ready: Bool
  let busy: Bool
  let action: () -> Void

  var body: some View {
    Button(action: action) {
      Group {
        if busy {
          Spinner(.sm)
        } else {
          Ph.arrowRight.bold
            .frame(width: 14, height: 14)
            .flipsForRightToLeftLayoutDirection(true)
        }
      }
      .foregroundStyle(EsuissColor.mutedForeground)
      .frame(width: 30, height: 30)
      .overlay {
        Circle().strokeBorder(ready ? EsuissColor.mutedForeground : EsuissColor.border, lineWidth: 1.5)
      }
      .frame(width: 44, height: 44)
      .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .disabled(!ready || busy)
    .opacity(ready || busy ? 1 : 0.6)
    .padding(.trailing, 6)
    .accessibilityLabel(Text("Continue"))
  }
}

private struct LoginAccountLinkStyle: ButtonStyle {
  var style: TextStyle = .sm

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(style)
      .foregroundStyle(EsuissColor.primary)
      .opacity(configuration.isPressed ? 0.8 : 1)
      .frame(minHeight: 32)
      .contentShape(Rectangle())
  }
}
