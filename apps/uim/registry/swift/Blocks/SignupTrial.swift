import PhosphorSwift
import SwiftUI

public struct SignupTrial: View {
  enum FocusField: Hashable {
    case email, password
  }

  static let image = URL(string: "https://images.unsplash.com/photo-1599669454699-248893623440?w=1200&q=80&auto=format&fit=crop")

  private var onSignIn: (() -> Void)?
  private var onSubmit: ((String, String) -> Void)?
  @State private var email: String
  @State private var password: String
  @State private var terms: Bool
  @State private var done: Bool
  @FocusState private var focus: FocusField?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(onSubmit: ((_ email: String, _ password: String) -> Void)? = nil, onSignIn: (() -> Void)? = nil) {
    self.init(email: "", password: "", terms: false)
    self.onSubmit = onSubmit
    self.onSignIn = onSignIn
  }

  init(email: String, password: String, terms: Bool, done: Bool = false) {
    _email = State(initialValue: email)
    _password = State(initialValue: password)
    _terms = State(initialValue: terms)
    _done = State(initialValue: done)
  }

  private var score: Int {
    [
      password.count >= 8,
      password.contains(where: \.isUppercase) && password.contains(where: \.isLowercase),
      password.contains(where: \.isNumber),
      password.contains { !$0.isLetter && !$0.isNumber },
    ].filter { $0 }.count
  }

  private var valid: Bool {
    email.wholeMatch(of: /.+@.+\..+/) != nil && score >= 3 && terms
  }

  public var body: some View {
    Screen(edges: [.bottom]) {
      if done {
        welcome
          .transition(.opacity.combined(with: .offset(y: 18)))
      } else {
        KeyboardScrollView {
          VStack(spacing: 0) {
            hero
            form
          }
        }
        .inputAccessoryBar(focus: $focus, order: [.email, .password])
        BottomBar {
          BottomBarContent {
            Button("Start free trial") {
              onSubmit?(email, password)
              done = true
            }
              .buttonStyle(.variant(.default, size: .lg, block: true))
              .disabled(!valid)
            HStack(spacing: 4) {
              Text("Already have an account?")
                .scaledFont(.sm)
                .foregroundStyle(Color.labelSecondary)
              Button("Sign in ›") { onSignIn?() }
                .buttonStyle(SignupTrialLinkStyle())
            }
          }
        }
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.6), value: done)
  }

  private var hero: some View {
    VStack(alignment: .leading, spacing: 0) {
      Label {
        Text(verbatim: "suiss Music")
      } icon: {
        Ph.musicNotes.fill.frame(width: 26, height: 26)
      }
      .labelStyle(SignupTrialHeroLabelStyle())
      .scaledFont(.xl, weight: .semibold)
      Text("Over 100 million songs. Ad-free.")
        .scaledTextStyle(.xl2, weight: .bold)
        .padding(.top, 10)
      Text("1 month free, then $10.99/month.")
        .scaledTextStyle(.base)
        .opacity(0.8)
        .padding(.top, 8)
    }
    .foregroundStyle(Color.onMedia)
    .fixedSize(horizontal: false, vertical: true)
    .padding(24)
    .padding(.top, 112)
    .frame(maxWidth: .infinity, minHeight: 340, alignment: .bottomLeading)
    .background {
      ZStack {
        Color.media
        AsyncImage(url: Self.image) { phase in
          if let image = phase.image {
            image.resizable().scaledToFill()
          }
        }
        LinearGradient(colors: [.clear, Color.media.opacity(0.8)], startPoint: .top, endPoint: .bottom)
      }
      .clipped()
      .accessibilityHidden(true)
    }
    .accessibilityElement(children: .combine)
  }

  private var form: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
    return VStack(alignment: .leading, spacing: 16) {
      Text("Start your free trial.")
        .scaledTextStyle(.xl2, weight: .bold)
      VStack(spacing: 0) {
        TextField("suiss Account email", text: $email)
          .textContentType(.emailAddress)
          .keyboardType(.emailAddress)
          .textInputAutocapitalization(.never)
          .autocorrectionDisabled()
          .submitLabel(.next)
          .focused($focus, equals: .email)
          .modifier(SignupTrialFieldText())
        Color.separatorStrong.frame(height: 1)
        SecureField("Create a password", text: $password)
          .textContentType(.newPassword)
          .submitLabel(.done)
          .focused($focus, equals: .password)
          .modifier(SignupTrialFieldText())
      }
      .background(Color.surface, in: shape)
      .overlay {
        shape.strokeBorder(focus != nil ? Color.focus : .separatorStrong, lineWidth: 1)
      }
      if !password.isEmpty {
        meter
          .transition(.opacity.combined(with: .offset(y: 4)))
      }
      Toggle(isOn: $terms) {
        Text("I have read and agree to the suiss Media Services Terms and Conditions.")
          .scaledTextStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
          .fixedSize(horizontal: false, vertical: true)
      }
      .toggleStyle(.checkbox)
    }
    .padding(.horizontal, 24)
    .padding(.vertical, 28)
    .animation(reduceMotion ? nil : .easeOut(duration: 0.3), value: password.isEmpty)
  }

  private var meter: some View {
    let levels: [Color] = [.red, .red, .orange, .yellow, .green]
    let labels: [LocalizedStringKey] = ["Weak", "Weak", "Fair", "Good", "Strong"]
    return HStack(spacing: 4) {
      ForEach(0..<4, id: \.self) { bar in
        Capsule()
          .fill(bar < max(1, score) ? levels[score] : Color.control)
          .frame(height: 4)
      }
    }
    .animation(.easeInOut(duration: 0.3), value: score)
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(Text("Password strength"))
    .accessibilityValue(Text(labels[score]))
  }

  private var welcome: some View {
    VStack(spacing: 14) {
      Ph.check.bold
        .frame(width: 38, height: 38)
        .foregroundStyle(Color.onAccent)
        .frame(width: 76, height: 76)
        .background(Color.success, in: Circle())
        .accessibilityHidden(true)
      Text("Welcome to suiss Music.")
        .scaledTextStyle(.xl2, weight: .bold)
      Text("Your one-month free trial has started.")
        .scaledTextStyle(.lg)
        .foregroundStyle(Color.labelSecondary)
      Button("Start over ›") { done = false }
        .buttonStyle(SignupTrialLinkStyle(style: .lg))
    }
    .multilineTextAlignment(.center)
    .fixedSize(horizontal: false, vertical: true)
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }
}

private struct SignupTrialFieldText: ViewModifier {
  func body(content: Content) -> some View {
    content
      .scaledFont(.lg)
      .foregroundStyle(Color.label)
      .tint(Color.accent)
      .padding(.horizontal, 16)
      .frame(maxWidth: .infinity, minHeight: 52, alignment: .leading)
  }
}

private struct SignupTrialHeroLabelStyle: LabelStyle {
  func makeBody(configuration: Configuration) -> some View {
    HStack(spacing: 6) {
      configuration.icon
      configuration.title
    }
  }
}

private struct SignupTrialLinkStyle: ButtonStyle {
  var style: TextStyle = .sm

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(style)
      .foregroundStyle(Color.link)
      .opacity(configuration.isPressed ? 0.5 : 1)
      .frame(minHeight: 32)
      .contentShape(Rectangle())
  }
}
