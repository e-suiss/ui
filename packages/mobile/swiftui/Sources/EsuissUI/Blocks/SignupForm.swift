import PhosphorSwift
import SwiftUI

public struct SignupFormValues: Equatable, Sendable {
  public var firstName: String
  public var lastName: String
  public var country: String
  public var birthday: String
  public var email: String
  public var password: String

  public init(firstName: String, lastName: String, country: String, birthday: String, email: String, password: String) {
    self.firstName = firstName
    self.lastName = lastName
    self.country = country
    self.birthday = birthday
    self.email = email
    self.password = password
  }
}

public struct SignupForm: View {
  struct Values: Sendable {
    var first = ""
    var last = ""
    var country: String? = "United States"
    var birthday = ""
    var email = ""
    var password = ""
    var confirm = ""
  }

  enum FocusField: Hashable {
    case first, last, birthday, email, password, confirm
  }

  static var countries: [String] { ["United States", "Germany", "Netherlands", "United Kingdom"] }

  private var onLearnMore: (() -> Void)?
  private var onSubmit: ((SignupFormValues) -> Void)?
  @State private var form: Values
  @State private var tried: Bool
  @State private var done: Bool
  @FocusState private var focus: FocusField?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(onSubmit: ((SignupFormValues) -> Void)? = nil, onLearnMore: (() -> Void)? = nil) {
    self.init(form: Values())
    self.onSubmit = onSubmit
    self.onLearnMore = onLearnMore
  }

  init(form: Values, tried: Bool = false, done: Bool = false) {
    _form = State(initialValue: form)
    _tried = State(initialValue: tried)
    _done = State(initialValue: done)
  }

  private var mismatch: Bool {
    tried && !form.confirm.isEmpty && form.password != form.confirm
  }

  private var valid: Bool {
    !form.first.isEmpty && !form.last.isEmpty && !form.birthday.isEmpty
      && form.email.wholeMatch(of: /.+@.+\..+/) != nil
      && SignupFormRules.strength(form.password) >= 3
      && form.password == form.confirm
  }

  public var body: some View {
    Screen {
      if done {
        SignupFormDone(email: form.email) {
          done = false
          tried = false
        }
        .transition(.opacity.combined(with: .offset(y: 18)))
      } else {
        content
        BottomBar {
          BottomBarContent {
            Button("Continue") {
              tried = true
              focus = nil
              if valid {
                onSubmit?(SignupFormValues(
                  firstName: form.first,
                  lastName: form.last,
                  country: form.country ?? "",
                  birthday: form.birthday,
                  email: form.email,
                  password: form.password
                ))
                done = true
              }
            }
            .buttonStyle(.variant(.default, size: .lg, block: true))
          }
        }
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.6), value: done)
  }

  private var content: some View {
    KeyboardScrollView {
      VStack(alignment: .leading, spacing: 22) {
        VStack(spacing: 10) {
          Text("Create your suiss Account")
            .scaledTextStyle(.xl2, weight: .bold)
          Text("One suiss Account is all you need to access every suiss service.")
            .scaledTextStyle(.lg)
            .foregroundStyle(EsuissColor.mutedForeground)
          Button("Learn more ›") { onLearnMore?() }
            .buttonStyle(SignupFormLinkStyle())
        }
        .multilineTextAlignment(.center)
        .fixedSize(horizontal: false, vertical: true)
        .frame(maxWidth: .infinity)
        section("Your name") {
          HStack(spacing: 12) {
            input(Text("First name"), text: $form.first, field: .first, content: .givenName)
            input(Text("Last name"), text: $form.last, field: .last, content: .familyName)
          }
        }
        section("Country or region and birthday") {
          OptionPicker(selection: $form.country, placeholder: "Country or region") {
            ForEach(Self.countries, id: \.self) { country in
              OptionPickerItem(verbatim: country, value: country)
            }
          }
          .accessibilityLabel(Text("Country or region"))
          input(Text("Birthday (MM/DD/YYYY)"), text: $form.birthday, field: .birthday, content: .birthdate, keyboard: .numbersAndPunctuation)
        }
        section("suiss Account") {
          input(Text(verbatim: "name@example.com"), text: $form.email, field: .email, content: .emailAddress, keyboard: .emailAddress)
          Text("This will be your new suiss Account.")
            .scaledTextStyle(.xs)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        section("Password") {
          input(Text("Password"), text: $form.password, field: .password, content: .newPassword, secure: true)
          input(Text("Confirm password"), text: $form.confirm, field: .confirm, content: .newPassword, secure: true)
            .invalid(mismatch)
          if !form.password.isEmpty {
            SignupFormRules(password: form.password)
              .padding(.horizontal, 4)
              .padding(.top, 6)
              .transition(.opacity.combined(with: .move(edge: .top)))
          }
        }
        .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.4), value: form.password.isEmpty)
        Text(tried && !valid ? "Please fill in every field correctly." : "")
          .scaledTextStyle(.xs)
          .foregroundStyle(EsuissColor.destructive)
          .frame(maxWidth: .infinity, minHeight: 20)
          .accessibilityHidden(!(tried && !valid))
      }
      .padding(.horizontal, 24)
      .padding(.top, 36)
      .padding(.bottom, 16)
    }
    .inputAccessoryBar(focus: $focus, order: [.first, .last, .birthday, .email, .password, .confirm])
  }

  private func section<Content: View>(_ legend: LocalizedStringKey, @ViewBuilder content: () -> Content) -> some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(legend)
        .scaledFont(.sm, weight: .semibold)
        .accessibilityAddTraits(.isHeader)
      content()
    }
  }

  @ViewBuilder
  private func input(
    _ title: Text,
    text: Binding<String>,
    field: FocusField,
    content: UITextContentType,
    keyboard: UIKeyboardType = .default,
    secure: Bool = false
  ) -> some View {
    Group {
      if secure {
        SecureField(text: text, prompt: title) { title }
      } else {
        TextField(text: text, prompt: title) { title }
          .keyboardType(keyboard)
          .textInputAutocapitalization(keyboard == .emailAddress ? .never : .words)
          .autocorrectionDisabled()
      }
    }
    .textContentType(content)
    .submitLabel(field == .confirm ? .done : .next)
    .focused($focus, equals: field)
    .textFieldStyle(.input)
  }
}

private struct SignupFormRules: View {
  let password: String

  static var rules: [(LocalizedStringKey, (String) -> Bool)] {
    [
      ("At least 8 characters", { $0.count >= 8 }),
      ("Upper and lowercase letters", { $0.contains(where: \.isUppercase) && $0.contains(where: \.isLowercase) }),
      ("At least one number", { $0.contains(where: \.isNumber) }),
    ]
  }

  static func strength(_ value: String) -> Int {
    rules.filter { $0.1(value) }.count + (value.contains { !$0.isLetter && !$0.isNumber } ? 1 : 0)
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

private struct SignupFormDone: View {
  let email: String
  let onReset: () -> Void

  var body: some View {
    VStack(spacing: 14) {
      Ph.check.bold
        .frame(width: 38, height: 38)
        .foregroundStyle(EsuissColor.primaryForeground)
        .frame(width: 76, height: 76)
        .background(Palette.green500, in: Circle())
        .accessibilityHidden(true)
      Text("Your suiss Account is ready.")
        .scaledTextStyle(.xl2, weight: .bold)
      Text("We sent a verification code to \(email).")
        .scaledTextStyle(.lg)
        .foregroundStyle(EsuissColor.mutedForeground)
      Button("Start over ›", action: onReset)
        .buttonStyle(SignupFormLinkStyle(style: .lg))
    }
    .multilineTextAlignment(.center)
    .fixedSize(horizontal: false, vertical: true)
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }
}

private struct SignupFormLinkStyle: ButtonStyle {
  var style: TextStyle = .base

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(style)
      .foregroundStyle(EsuissColor.primary)
      .opacity(configuration.isPressed ? 0.8 : 1)
      .frame(minHeight: 32)
      .contentShape(Rectangle())
  }
}
