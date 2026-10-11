import EsuissUI
import SwiftUI

enum DatePickerStories {
  static let group = StoryGroup(.patterns, "Date Picker", stories: [
    Story("Default") {
      DatePickerDemo()
    },
    Story("WithValue") {
      DatePickerDemo(value: datePickerDay(2026, 10, 4))
    },
    Story("Locale") {
      DatePickerDemo(value: datePickerDay(2026, 10, 4), placeholder: "Tarih seç")
        .environment(\.locale, Locale(identifier: "tr_TR"))
    },
    Story("YearRange") {
      DatePickerDemo(value: datePickerDay(1990, 6, 15), placeholder: "Date of birth", fromYear: 1940, toYear: 2010)
    },
    Story("WithTitle") {
      DatePickerDemo(title: "Delivery date")
    },
    Story("WithCloseButton") {
      DatePickerDemo(showCloseButton: true)
    },
    Story("WithCloseLabel") {
      DatePickerDemo(showCloseButton: true, closeLabel: "Done")
    },
    Story("Disabled") {
      DatePickerDemo()
        .disabled(true)
    },
    Story("Invalid") {
      DatePickerDemo()
        .invalid()
    },
    Story("Controlled") {
      DatePickerControlled()
    },
  ])
}

private func datePickerDay(_ year: Int, _ month: Int, _ day: Int) -> Date? {
  Foundation.Calendar.current.date(from: DateComponents(year: year, month: month, day: day))
}

private struct DatePickerDemo: View {
  var placeholder: LocalizedStringKey = "Pick a date"
  var fromYear: Int?
  var toYear: Int?
  var title: LocalizedStringKey?
  var showCloseButton = false
  var closeLabel: LocalizedStringKey?

  @State private var value: Date?

  init(
    value: Date? = nil,
    placeholder: LocalizedStringKey = "Pick a date",
    fromYear: Int? = nil,
    toYear: Int? = nil,
    title: LocalizedStringKey? = nil,
    showCloseButton: Bool = false,
    closeLabel: LocalizedStringKey? = nil
  ) {
    _value = State(initialValue: value)
    self.placeholder = placeholder
    self.fromYear = fromYear
    self.toYear = toYear
    self.title = title
    self.showCloseButton = showCloseButton
    self.closeLabel = closeLabel
  }

  var body: some View {
    DatePickerField(
      selection: $value,
      placeholder: placeholder,
      fromYear: fromYear,
      toYear: toYear,
      title: title,
      showCloseButton: showCloseButton,
      closeLabel: closeLabel
    )
    .frame(width: 240)
    .accessibilityLabel(Text("Date"))
  }
}

private struct DatePickerControlled: View {
  @State private var value: Date? = datePickerDay(2026, 10, 4)

  private var selected: String {
    guard let value else { return "none" }
    let formatter = DateFormatter()
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.dateFormat = "EEE MMM dd yyyy"
    return formatter.string(from: value)
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      DatePickerField(selection: $value)
        .frame(width: 240)
        .accessibilityLabel(Text("Date"))
      Text(verbatim: "Selected: \(selected)")
        .textStyle(.sm)
        .foregroundStyle(Color.labelSecondary)
    }
  }
}
