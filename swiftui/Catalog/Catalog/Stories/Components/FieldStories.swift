import EsuissUI
import SwiftUI

enum FieldStories {
  static let group = StoryGroup(.components, "Field", stories: [
    Story("Default") {
      FieldDefaultDemo()
    },
    Story("Invalid") {
      FieldInvalidDemo()
    },
    Story("Validation") {
      FieldValidationDemo()
    },
    Story("Disabled") {
      FieldDisabledDemo()
    },
    Story("Horizontal") {
      FieldHorizontalDemo()
    },
    Story("CheckboxGroup") {
      FieldToppingsDemo()
    },
    Story("Inset") {
      FieldInsetDemo()
    },
    Story("Form") {
      FieldFormDemo()
    },
  ])
}

private enum FieldMessages {
  static let required = "This field is required."

  static func tooShort(_ minLength: Int) -> String {
    "Use at least \(minLength) characters."
  }
}

private struct FieldDefaultDemo: View {
  @State private var username = ""

  var body: some View {
    Field {
      FieldLabel("Username")
        .accessibilityHidden(true)
      TextField("evilrabbit", text: $username)
        .textFieldStyle(.input)
        .textInputAutocapitalization(.never)
        .accessibilityLabel(Text("Username"))
      FieldDescription("Choose a unique username for your account.")
    }
  }
}

private struct FieldInvalidDemo: View {
  @State private var email = "hello@"

  var body: some View {
    Field(invalid: true) {
      FieldLabel("Email")
        .accessibilityHidden(true)
      TextField("Email", text: $email)
        .textFieldStyle(.input)
        .keyboardType(.emailAddress)
        .textInputAutocapitalization(.never)
        .accessibilityLabel(Text("Email"))
      FieldDescription("We will send a confirmation link here.")
      FieldError("Enter a valid email address.")
    }
  }
}

private struct FieldValidationDemo: View {
  private enum Focus: Hashable {
    case name, email, bio
  }

  @State private var name = ""
  @State private var email = ""
  @State private var bio = ""
  @State private var nameError: String?
  @State private var emailError: String?
  @State private var bioError: String?
  @State private var nameTouched = false
  @State private var bioTouched = false
  @FocusState private var focus: Focus?

  var body: some View {
    FieldGroup {
      Field(invalid: nameError != nil) {
        FieldLabel("Name")
          .accessibilityHidden(true)
        TextField("Required", text: $name)
          .textFieldStyle(.input)
          .focused($focus, equals: .name)
          .accessibilityLabel(Text("Name"))
        FieldError(errors: [nameError])
      }
      Field(invalid: emailError != nil) {
        FieldLabel("Email")
          .accessibilityHidden(true)
        TextField("m@example.com", text: $email)
          .textFieldStyle(.input)
          .keyboardType(.emailAddress)
          .textInputAutocapitalization(.never)
          .focused($focus, equals: .email)
          .accessibilityLabel(Text("Email"))
        FieldDescription("Validated on every change.")
        FieldError(errors: [emailError])
      }
      Field(invalid: bioError != nil) {
        FieldLabel("Bio")
          .accessibilityHidden(true)
        TextField("At least 20 characters", text: $bio, axis: .vertical)
          .textFieldStyle(.textarea)
          .focused($focus, equals: .bio)
          .accessibilityLabel(Text("Bio"))
        if bioError != nil {
          FieldError("Tell us a little more.")
        }
      }
    }
    .onChange(of: focus) { previous, _ in
      switch previous {
      case .name:
        nameTouched = true
        nameError = validateName()
      case .bio:
        bioTouched = true
        bioError = validateBio()
      default:
        break
      }
    }
    .onChange(of: name) {
      if nameTouched { nameError = validateName() }
    }
    .onChange(of: email) {
      emailError = email.contains("@") ? nil : "Email must contain @."
    }
    .onChange(of: bio) {
      if bioTouched { bioError = validateBio() }
    }
  }

  private func validateName() -> String? {
    name.isEmpty ? FieldMessages.required : nil
  }

  private func validateBio() -> String? {
    !bio.isEmpty && bio.count < 20 ? FieldMessages.tooShort(20) : nil
  }
}

private struct FieldDisabledDemo: View {
  @State private var workspace = "acme"

  var body: some View {
    Field {
      FieldLabel("Workspace")
        .accessibilityHidden(true)
      TextField("Workspace", text: $workspace)
        .textFieldStyle(.input)
        .accessibilityLabel(Text("Workspace"))
      FieldDescription("Contact an admin to change this.")
    }
    .disabled(true)
  }
}

private struct FieldHorizontalDemo: View {
  @State private var marketing = false
  @State private var security = false

  var body: some View {
    FieldGroup {
      Field(orientation: .horizontal) {
        FieldContent {
          FieldTitle("Marketing emails")
          FieldDescription("Receive emails about new products.")
        }
        Toggle(isOn: $marketing) { EmptyView() }
          .toggleStyle(.switch(size: .default))
          .accessibilityLabel(Text("Marketing emails"))
      }
      FieldSeparator()
      Field(orientation: .horizontal) {
        FieldContent {
          FieldTitle("Security emails")
          FieldDescription("Receive emails about your account.")
        }
        Toggle(isOn: $security) { EmptyView() }
          .toggleStyle(.switch(size: .default))
          .accessibilityLabel(Text("Security emails"))
      }
    }
  }
}

private struct FieldToppingsDemo: View {
  private static let toppings = ["cheese", "olives", "peppers"]

  @State private var selected: Set<String> = ["cheese"]

  var body: some View {
    FieldSet {
      FieldLegend("Toppings")
      FieldDescription("Choose what goes on your pizza.")
      VStack(alignment: .leading, spacing: 12) {
        Toggle(sources: Self.toppings.map(binding), isOn: \.self) {
          Text("All toppings")
            .textStyle(.base)
            .foregroundStyle(Color.label)
        }
        .toggleStyle(.checkbox)
        ForEach(Self.toppings, id: \.self) { topping in
          Toggle(isOn: binding(topping)) {
            Text(verbatim: topping.capitalized)
              .textStyle(.base)
              .foregroundStyle(Color.label)
          }
          .toggleStyle(.checkbox)
          .padding(.leading, 24)
        }
      }
    }
  }

  private func binding(_ topping: String) -> Binding<Bool> {
    Binding(
      get: { selected.contains(topping) },
      set: { isOn in
        if isOn { selected.insert(topping) } else { selected.remove(topping) }
      }
    )
  }
}

private struct FieldInsetDemo: View {
  @State private var name = "Ada Lovelace"
  @State private var city = "London"

  var body: some View {
    FieldSet {
      FieldLegend("Profile")
      FieldGroup(.inset) {
        FieldInsetRow(title: "Name", text: $name)
        FieldInsetRow(title: "City", text: $city)
      }
    }
  }
}

private struct FieldInsetRow: View {
  let title: LocalizedStringKey
  @Binding var text: String

  var body: some View {
    Field(orientation: .horizontal) {
      FieldLabel(title)
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityHidden(true)
      TextField(title, text: $text)
        .textFieldStyle(.plain)
        .multilineTextAlignment(.trailing)
        .textStyle(.base)
        .foregroundStyle(Color.label)
        .frame(maxWidth: .infinity, minHeight: 32)
        .accessibilityLabel(Text(title))
    }
  }
}

private struct FieldFormDemo: View {
  @State private var username = ""
  @State private var password = ""
  @State private var usernameErrors: [String] = []
  @State private var passwordErrors: [String] = []
  @State private var taken = false
  @State private var submitted: String?

  var body: some View {
    VStack(alignment: .leading, spacing: 24) {
      FieldGroup {
        Field(invalid: !usernameErrors.isEmpty || taken) {
          FieldLabel("Username")
            .accessibilityHidden(true)
          TextField("Try admin", text: $username)
            .textFieldStyle(.input)
            .textInputAutocapitalization(.never)
            .autocorrectionDisabled()
            .accessibilityLabel(Text("Username"))
          FieldDescription("Letters and numbers only.")
          FieldError(errors: usernameErrors + (taken ? ["This username is taken."] : []))
        }
        Field(invalid: !passwordErrors.isEmpty) {
          FieldLabel("Password")
            .accessibilityHidden(true)
          SecureField("Password", text: $password)
            .textFieldStyle(.input)
            .accessibilityLabel(Text("Password"))
          FieldError(errors: passwordErrors)
        }
      }
      Button {
        submit()
      } label: {
        Text("Create account").frame(maxWidth: .infinity)
      }
      .buttonStyle(.variant())
      if let submitted {
        Text(verbatim: "Submitted: \(submitted)")
          .textVariant(.muted)
      }
    }
    .onChange(of: username) { taken = false }
  }

  private func submit() {
    usernameErrors = username.isEmpty ? [FieldMessages.required] : []
    var errors: [String] = []
    if password.isEmpty {
      errors.append(FieldMessages.required)
    } else if password.count < 8 {
      errors.append(FieldMessages.tooShort(8))
    }
    if !password.contains(where: \.isNumber) {
      errors.append("Include at least one number.")
    }
    passwordErrors = errors
    guard usernameErrors.isEmpty, passwordErrors.isEmpty else { return }
    if username == "admin" {
      taken = true
      return
    }
    submitted = "{\"username\":\"\(username)\",\"password\":\"\(password)\"}"
  }
}
