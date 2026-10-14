import EsuissUI
import SwiftUI

enum RadioGroupStories {
  static let group = StoryGroup(.components, "Radio Group", stories: [
    Story("Default") {
      RadioGroupDemo()
    },
    Story("WithDescriptions") {
      RadioGroupDescriptionsDemo()
    },
    Story("DisabledItem") {
      RadioGroupDemo(disabledItem: "compact")
    },
    Story("Disabled") {
      RadioGroupDemo(disabled: true)
    },
    Story("Invalid") {
      RadioGroup(selection: .constant(String?.none)) {
        ForEach(radioGroupOptions, id: \.value) { option in
          RadioGroupItem(option.label, value: option.value)
        }
      }
      .invalid()
    },
  ])
}

private struct RadioGroupOption {
  let value: String
  let label: LocalizedStringKey
}

private let radioGroupOptions = [
  RadioGroupOption(value: "default", label: "Default"),
  RadioGroupOption(value: "comfortable", label: "Comfortable"),
  RadioGroupOption(value: "compact", label: "Compact"),
]

private struct RadioGroupPlan {
  let value: String
  let label: LocalizedStringKey
  let description: LocalizedStringKey
}

private let radioGroupPlans = [
  RadioGroupPlan(value: "starter", label: "Starter", description: "For individuals getting started."),
  RadioGroupPlan(value: "pro", label: "Pro", description: "For growing teams that need more."),
  RadioGroupPlan(value: "enterprise", label: "Enterprise", description: "For large organizations with custom needs."),
]

private struct RadioGroupDemo: View {
  var disabled = false
  var disabledItem: String?

  @State private var value = "comfortable"

  var body: some View {
    RadioGroup(selection: $value) {
      ForEach(radioGroupOptions, id: \.value) { option in
        RadioGroupItem(option.label, value: option.value)
          .disabled(disabled || option.value == disabledItem)
      }
    }
  }
}

private struct RadioGroupDescriptionsDemo: View {
  @State private var value = "pro"

  var body: some View {
    RadioGroup(selection: $value) {
      ForEach(radioGroupPlans, id: \.value) { plan in
        RadioGroupItem(value: plan.value) {
          VStack(alignment: .leading, spacing: 4) {
            FieldLabel(plan.label)
            Text(plan.description)
              .textStyle(.sm)
              .foregroundStyle(Color.labelSecondary)
          }
          .frame(maxWidth: .infinity, alignment: .leading)
        }
      }
    }
  }
}
