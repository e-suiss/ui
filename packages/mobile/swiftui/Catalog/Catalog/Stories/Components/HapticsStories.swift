import EsuissUI
import SwiftUI

enum HapticsStories {
  static let group = StoryGroup(.components, "Haptics", stories: [
    Story("Default") {
      HapticsControls()
    },
    Story("Feedback") {
      HapticsFeedbackDemo()
    },
    Story("Reorder") {
      HapticsReorderDemo()
    },
    Story("Disabled") {
      HapticsControls()
        .haptics(false)
    },
  ])
}

private struct HapticsLog: View {
  let last: String
  let count: Int

  var body: some View {
    HStack {
      Text("Last haptic")
        .textStyle(.sm)
        .foregroundStyle(Color.labelSecondary)
      Spacer(minLength: 16)
      Text(verbatim: count > 0 ? "\(last) (\(count))" : last)
        .textStyle(.sm, weight: .medium)
        .foregroundStyle(Color.label)
        .accessibilityAddTraits(.updatesFrequently)
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 12)
    .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
  }
}

private struct HapticsRow<Content: View>: View {
  let label: LocalizedStringKey
  @ViewBuilder let content: () -> Content

  var body: some View {
    HStack(spacing: 16) {
      Text(label)
        .textStyle(.base)
        .foregroundStyle(Color.label)
      Spacer(minLength: 0)
      content()
    }
    .frame(minHeight: 44)
  }
}

private struct HapticsControls: View {
  @State private var wifi = true
  @State private var terms = false
  @State private var volume = 40.0
  @State private var copies = 1
  @State private var openNow = false
  @State private var topRated = false

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      HapticsRow(label: "Wi-Fi") {
        Toggle(isOn: $wifi) { EmptyView() }
          .toggleStyle(.switch(size: .default))
          .accessibilityLabel(Text("Wi-Fi"))
      }
      HapticsRow(label: "Accept terms") {
        Toggle(isOn: $terms) { EmptyView() }
          .toggleStyle(.checkbox)
          .accessibilityLabel(Text("Accept terms"))
      }
      HapticsRow(label: "Copies") {
        ValueStepper(value: $copies, in: 1...9) {
          StepperInput()
            .accessibilityLabel(Text("Copies"))
          StepperGroup {
            StepperDecrement()
            StepperSeparator()
            StepperIncrement()
          }
        }
      }
      HStack(spacing: 8) {
        Chip("Open now", isSelected: $openNow)
        Chip("Top rated", isSelected: $topRated)
      }
      .padding(.vertical, 8)
      ValueSlider(value: $volume, in: 0...100, step: 10)
        .accessibilityLabel(Text("Volume"))
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

private struct HapticsFeedbackDemo: View {
  private struct Entry: Identifiable {
    let id: String
    let feedback: SensoryFeedback
  }

  private static let impacts = [
    Entry(id: "light", feedback: .impact(weight: .light)),
    Entry(id: "medium", feedback: .impact(weight: .medium)),
    Entry(id: "heavy", feedback: .impact(weight: .heavy)),
    Entry(id: "soft", feedback: .impact(flexibility: .soft)),
    Entry(id: "rigid", feedback: .impact(flexibility: .rigid)),
  ]

  private static let notifications = [
    Entry(id: "success", feedback: .success),
    Entry(id: "warning", feedback: .warning),
    Entry(id: "error", feedback: .error),
  ]

  @State private var last = "None"
  @State private var count = 0

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      HapticsLog(last: last, count: count)
      VStack(alignment: .leading, spacing: 12) {
        Text("Impact").textVariant(.muted)
        FlowRow(spacing: 8) {
          ForEach(Self.impacts) { entry in
            HapticsFeedbackButton(title: entry.id, feedback: entry.feedback) { record("impact \(entry.id)") }
          }
        }
        Text("Selection").textVariant(.muted)
        FlowRow(spacing: 8) {
          HapticsFeedbackButton(title: "selection", feedback: .selection) { record("selection") }
        }
        Text("Notification").textVariant(.muted)
        FlowRow(spacing: 8) {
          ForEach(Self.notifications) { entry in
            HapticsFeedbackButton(title: entry.id, feedback: entry.feedback) { record("notification \(entry.id)") }
          }
        }
      }
    }
  }

  private func record(_ event: String) {
    last = event
    count += 1
  }
}

private struct HapticsFeedbackButton: View {
  let title: String
  let feedback: SensoryFeedback
  let action: () -> Void

  @State private var trigger = 0

  var body: some View {
    Button(title) {
      trigger += 1
      action()
    }
    .buttonStyle(.variant(.secondary, size: .sm))
    .sensoryFeedback(feedback, trigger: trigger)
  }
}

private struct HapticsReorderDemo: View {
  @State private var tasks = ["Inbox", "Today", "Upcoming", "Someday"]

  var body: some View {
    ReorderList($tasks) { task in
      Text(verbatim: task)
        .textStyle(.base)
        .foregroundStyle(Color.label)
        .lineLimit(1)
        .padding(.vertical, 12)
    }
    .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
    .overlay {
      RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
        .strokeBorder(Color.separator)
    }
  }
}
