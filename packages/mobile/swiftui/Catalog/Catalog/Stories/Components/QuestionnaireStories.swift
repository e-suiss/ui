import EsuissUI
import SwiftUI

enum QuestionnaireStories {
  static let group = StoryGroup(.components, "Questionnaire", stories: [
    Story("Default") {
      QuestionnaireOnboarding()
    },
    Story("MidFlow") {
      QuestionnaireOnboarding(defaultItem: "team-size")
    },
    Story("Invalid") {
      QuestionnaireOnboarding(attempted: true)
    },
    Story("MultipleChoice") {
      QuestionnaireMultipleChoice()
    },
    Story("WithChoiceDescriptions") {
      QuestionnaireChoiceDescriptions()
    },
    Story("TextInput") {
      QuestionnaireTextInput()
    },
  ])
}

private struct QuestionnaireStoryActions: View {
  var body: some View {
    QuestionnaireActions {
      QuestionnairePrevious()
      QuestionnaireSkip()
      QuestionnaireNext()
      QuestionnaireSubmit()
    }
  }
}

private struct QuestionnaireOnboarding: View {
  var attempted = false

  @State private var controller: QuestionnaireController
  @State private var submitted: String?

  init(defaultItem: String? = nil, attempted: Bool = false) {
    self.attempted = attempted
    _controller = State(initialValue: QuestionnaireController(
      defaultItem: defaultItem,
      defaultValues: ["team-size": ["small"]]
    ))
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Questionnaire(controller: controller) {
        QuestionnaireProgress()
        QuestionnaireItem(name: "role", required: true, invalid: attempted) {
          QuestionnaireTitle("What best describes your role?")
          QuestionnaireDescription("This helps us tailor the setup to your team.")
          QuestionnaireChoices {
            QuestionnaireChoice("Engineering", value: "engineering")
            QuestionnaireChoice("Design", value: "design")
            QuestionnaireChoice("Product", value: "product")
            QuestionnaireChoice("Something else", value: "other")
          }
          QuestionnaireError()
        }
        QuestionnaireItem(name: "team-size") {
          QuestionnaireTitle("How large is your team?")
          QuestionnaireChoices {
            QuestionnaireChoice("Just me", value: "solo")
            QuestionnaireChoice("2 to 10 people", value: "small")
            QuestionnaireChoice("11 to 50 people", value: "medium")
            QuestionnaireChoice("More than 50 people", value: "large")
          }
          QuestionnaireError()
        }
        QuestionnaireItem(name: "company", required: true) {
          QuestionnaireTitle("What is your company called?")
          QuestionnaireInput("Acme Inc.")
          QuestionnaireError("Enter a company name to continue.")
        }
        QuestionnaireStoryActions()
      }
      if let submitted {
        Text(verbatim: submitted)
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
          .accessibilityAddTraits(.updatesFrequently)
      }
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .onAppear {
      let controller = controller
      controller.onSubmit = { answers in
        let fields = controller.sequence.compactMap { name -> String? in
          guard let value = answers[name]?.first else { return nil }
          return "\"\(name)\":\"\(value)\""
        }
        submitted = "Submitted: {\(fields.joined(separator: ","))}"
      }
    }
  }
}

private struct QuestionnaireMultipleChoice: View {
  @State private var controller = QuestionnaireController(defaultValues: ["features": ["analytics", "billing"]])

  var body: some View {
    Questionnaire(controller: controller) {
      QuestionnaireProgress()
      QuestionnaireItem(name: "features", required: true, multiple: true) {
        QuestionnaireTitle("Which features do you plan to use?")
        QuestionnaireDescription("Select all that apply.")
        QuestionnaireChoices {
          QuestionnaireChoice("Analytics", value: "analytics")
          QuestionnaireChoice("Billing", value: "billing")
          QuestionnaireChoice("Automations", value: "automations")
          QuestionnaireChoice("Integrations", value: "integrations", disabled: true)
        }
        QuestionnaireError("Choose at least one feature.")
      }
      QuestionnaireStoryActions()
    }
  }
}

private struct QuestionnaireChoiceDescriptions: View {
  @State private var controller = QuestionnaireController(defaultValues: ["plan": ["team"]])

  var body: some View {
    Questionnaire(controller: controller) {
      QuestionnaireProgress()
      QuestionnaireItem(name: "plan", required: true) {
        QuestionnaireTitle("Which plan fits you best?")
        QuestionnaireChoices {
          QuestionnaireChoice(value: "starter") {
            Text("Starter")
            QuestionnaireChoiceDescription("For individuals trying things out.")
          }
          QuestionnaireChoice(value: "team") {
            Text("Team")
            QuestionnaireChoiceDescription("Shared workspaces and roles for growing teams.")
          }
          QuestionnaireChoice(value: "enterprise") {
            Text("Enterprise")
            QuestionnaireChoiceDescription("Single sign-on, audit logs, and priority support.")
          }
        }
        QuestionnaireError()
      }
      QuestionnaireStoryActions()
    }
  }
}

private struct QuestionnaireTextInput: View {
  @State private var controller = QuestionnaireController()

  var body: some View {
    Questionnaire(controller: controller) {
      QuestionnaireProgress()
      QuestionnaireItem(name: "email", required: true) {
        QuestionnaireTitle("Where should we send your results?")
        QuestionnaireDescription("We only use your email to share the report.")
        QuestionnaireInput("you@example.com", keyboard: .emailAddress, contentType: .emailAddress)
        QuestionnaireError("Enter an email address to continue.")
      }
      QuestionnaireStoryActions()
    }
  }
}
